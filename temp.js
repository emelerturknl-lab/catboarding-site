
    let reservations = [];
    let calendar;
    let currentUser = null;

    // Supabase Auth Check
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            currentUser = session.user;
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            initCalendar();
            fetchData();
        } else {
            currentUser = null;
            document.getElementById('login-screen').style.display = 'block';
            document.getElementById('app').style.display = 'none';
        }
    });

    // Login Form logic
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');
        btn.innerHTML = "Giriş Yapılıyor..."; btn.disabled = true;
        
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        btn.innerHTML = "Giriş Yap"; btn.disabled = false;
        if (error) {
            document.getElementById('login-error').innerText = "Hatalı e-posta veya şifre.";
            document.getElementById('login-error').style.display = "block";
        }
    });

    async function logout() {
        await supabase.auth.signOut();
    }

    // Fetch Data from Supabase
    async function fetchData() {
        const { data, error } = await supabase
            .from('reservations')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error(error);
            alert("Veriler çekilirken hata oluştu!");
            return;
        }
        
        reservations = data;
        updateUI();
    }

    function updateUI() {
        // Update Stats
        const pendingCount = reservations.filter(r => r.status === 'pending').length;
        const upcomingCount = reservations.filter(r => r.status === 'confirmed' && new Date(r.dropoff_date) >= new Date()).length;
        const revenue = reservations.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + (parseFloat(r.total_price)||0), 0);
        
        document.getElementById('active-stays').innerText = pendingCount;
        document.getElementById('upcoming-stays').innerText = upcomingCount;
        document.getElementById('total-revenue').innerText = "€" + revenue.toFixed(2);

        // Render Pending Table
        const tbody = document.getElementById('pending-list');
        tbody.innerHTML = '';
        const pending = reservations.filter(r => r.status === 'pending');
        
        if(pending.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">Bekleyen talep bulunmuyor.</td></tr>';
        } else {
            pending.forEach((r) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><b>${r.customer_name}</b><br><small>${r.customer_contact}</small></td>
                    <td>${r.dropoff_date}<br>${r.pickup_date}</td>
                    <td>${r.cat_count} Kedi<br>€${r.total_price}</td>
                    <td><button class="btn" style="padding: 6px 12px; font-size:0.8em;" onclick="editBooking('${r.id}')">İncele & Onayla</button></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Render Calendar
        if(calendar) {
            calendar.removeAllEvents();
            calendar.addEventSource(formatEvents());
        }
    }

    function initCalendar() {
        if(calendar) return;
        const calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'tr',
            headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
            eventClick: function(info) { editBooking(info.event.id); },
            selectable: true,
            select: function(info) {
                openNewBookingModal(info.startStr, info.endStr);
            }
        });
        calendar.render();
    }

    function formatEvents() {
        return reservations.filter(r => r.status !== 'cancelled').map((res) => ({
            id: res.id,
            title: res.customer_name + (res.status === 'pending' ? ' (Beklemede)' : ''),
            start: res.dropoff_date,
            end: res.pickup_date ? new Date(new Date(res.pickup_date).getTime() + 86400000).toISOString().split('T')[0] : null, // +1 day for FullCalendar exclusive end
            backgroundColor: res.status === 'confirmed' ? '#DE9999' : '#f39c12',
            borderColor: 'transparent'
        }));
    }

    function getBooking(id) {
        return reservations.find(r => r.id === id);
    }

    function editBooking(id) {
        const res = getBooking(id);
        if(!res) return;
        
        document.getElementById('modalTitle').innerText = "Kayıt Detayları";
        document.getElementById('bookingIndex').value = id;
        document.getElementById('customerName').value = res.customer_name;
        document.getElementById('customerContact').value = res.customer_contact;
        document.getElementById('startDate').value = res.dropoff_date;
        document.getElementById('endDate').value = res.pickup_date;
        document.getElementById('status').value = res.status;
        document.getElementById('price').value = res.total_price || 0;
        
        let notes = "";
        if(res.transfer_dropoff) notes += `Dropoff Transfer: ${res.dropoff_location}\n`;
        if(res.transfer_pickup) notes += `Pickup Transfer: ${res.pickup_location}\n`;
        if(res.message) notes += `Mesaj: ${res.message}\n`;
        document.getElementById('notes').value = notes;

        // WhatsApp Btn Visibility
        const waBtn = document.getElementById('whatsapp-btn');
        if(res.status === 'confirmed') {
             waBtn.style.display = 'inline-flex';
        } else {
             waBtn.style.display = 'none'; // Only show WA if confirmed to avoid confusing workflow
        }

        document.getElementById('editButtons').style.display = "flex";
        document.getElementById('bookingModal').style.display = "flex";
    }

    function openNewBookingModal(startStr = '', endStr = '') {
        document.getElementById('modalTitle').innerText = "Yeni Rezervasyon Ekle";
        document.getElementById('bookingForm').reset();
        document.getElementById('bookingIndex').value = "";
        document.getElementById('editButtons').style.display = "none";
        document.getElementById('whatsapp-btn').style.display = "none";
        
        if (startStr) document.getElementById('startDate').value = startStr;
        if (endStr) {
            // FullCalendar end date is exclusive, fix it for input
            let d = new Date(endStr);
            d.setDate(d.getDate() - 1);
            document.getElementById('endDate').value = d.toISOString().split('T')[0];
        }

        document.getElementById('bookingModal').style.display = "flex";
    }

    function closeModal() {
        document.getElementById('bookingModal').style.display = "none";
    }

    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        try {
            const id = document.getElementById('bookingIndex').value;
            const btn = document.getElementById('save-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = "Kaydediliyor..."; btn.disabled = true;

            const payload = {
                customer_name: document.getElementById('customerName').value,
                customer_contact: document.getElementById('customerContact').value,
                dropoff_date: document.getElementById('startDate').value,
                pickup_date: document.getElementById('endDate').value,
                status: document.getElementById('status').value,
                total_price: parseFloat(document.getElementById('price').value) || 0,
                message: document.getElementById('notes').value,
                cat_count: 1, // Zorunlu alan olabilir
                language: 'EN' // default for manual
            };

            let result;
            if (id) {
                result = await supabase.from('reservations').update(payload).eq('id', id);
            } else {
                result = await supabase.from('reservations').insert([payload]);
            }

            btn.innerHTML = originalText; btn.disabled = false;

            if (result.error) {
                alert("Veritabanı Hatası: " + result.error.message);
                console.error("Supabase Error:", result.error);
            } else {
                closeModal();
                fetchData(); // Reload UI
                
                if (id) {
                    // Eğer pending'ten confirmed'a geçirildiyse WA gönderilsin mi diye sorabiliriz.
                    const oldRes = getBooking(id);
                    if (oldRes.status === 'pending' && payload.status === 'confirmed') {
                        if(confirm("Rezervasyon ONAYLANDI. Müşteriye WhatsApp'tan onay mesajı göndermek ister misiniz?")) {
                            sendWhatsAppFor(id, payload);
                        }
                    } else {
                        alert("Kayıt başarıyla güncellendi.");
                    }
                } else if (payload.status === 'confirmed') {
                    alert("Yeni onaylı rezervasyon başarıyla eklendi! Takvim güncellendi.");
                } else {
                    alert("Yeni rezervasyon eklendi.");
                }
            }
        } catch (error) {
            console.error("Form Exception:", error);
            alert("Beklenmeyen Hata Oluştu: " + error.message);
        }
    });


    async function deleteBooking() {
        const id = document.getElementById('bookingIndex').value;
        if (confirm('Bu kaydı tamamen SİLMEK istediğinize emin misiniz?')) {
            const { error } = await supabase.from('reservations').delete().eq('id', id);
            if(!error) {
                closeModal();
                fetchData();
            } else {
                alert("Silinemedi!");
            }
        }
    }

    function sendWhatsApp() {
        const id = document.getElementById('bookingIndex').value;
        const res = getBooking(id);
        const updates = {
            customer_name: document.getElementById('customerName').value,
            customer_contact: document.getElementById('customerContact').value,
            dropoff_date: document.getElementById('startDate').value,
            pickup_date: document.getElementById('endDate').value,
            total_price: document.getElementById('price').value
        };
        sendWhatsAppFor(id, updates);
    }
    
    function sendWhatsAppFor(id, data) {
        // Veritabanındaki dil bilgisini al
        const res = getBooking(id);
        const lang = res.language || 'EN'; 
        
        // Müşteri Teli formatla (boşlukları temizle)
        let phone = data.customer_contact.replace(/[\s\(\)\-]/g, '');
        if(!phone.startsWith('+') && !phone.startsWith('00')) {
            phone = '+31' + (phone.startsWith('0') ? phone.substring(1) : phone);
        }
        
        let text = "";
        if (lang === 'TR') {
            text = `Merhaba ${data.customer_name},\n\nBlack Princess & White Prince Kedi Pansiyonu rezervasyonunuz ONAYLANMIŞTIR! 🐾\nGeliş: ${data.dropoff_date}\nDönüş: ${data.pickup_date}\nToplam Ücret: €${data.total_price}\n\nÖdeme konaklamanın ilk günü nakit olarak alınacaktır. Görüşmek üzere!`;
        } else if (lang === 'NL') {
            text = `Beste ${data.customer_name},\n\nUw reservering bij kattenpension Black Princess & White Prince is BEVESTIGD! 🐾\nBrengen: ${data.dropoff_date}\nOphalen: ${data.pickup_date}\nTotaalbedrag: €${data.total_price}\n\nDe betaling dient contant te worden voldaan op de eerste dag van het verblijf. Tot ziens!`;
        } else {
            text = `Hello ${data.customer_name},\n\nYour reservation at Black Princess & White Prince Cat Boarding is CONFIRMED! 🐾\nDrop-off: ${data.dropoff_date}\nPick-up: ${data.pickup_date}\nTotal Price: €${data.total_price}\n\nThe payment will be collected in cash on the first day of the stay. See you soon!`;
        }
        
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
