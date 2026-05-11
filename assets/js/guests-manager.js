let allGuests = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchPublicGuests();
    setupModalEvents();
});

function setupModalEvents() {
    const modal = document.getElementById('guest-modal');
    const closeBtn = document.querySelector('.guest-modal-close');
    
    if (closeBtn) {
        closeBtn.onclick = closeGuestModal;
    }
    
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) closeGuestModal();
        };
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGuestModal();
    });
}

async function fetchPublicGuests() {
    const container = document.getElementById('guests-container');
    if (!container) return;

    try {
        const { data, error } = await supabase
            .from('guests')
            .select('*')
            .eq('status', 'published')
            .order('order_index', { ascending: true });

        if (error) throw error;

        allGuests = data || [];

        if (allGuests.length === 0) {
            showComingSoon(container);
            return;
        }

        container.innerHTML = '';
        
        allGuests.forEach(guest => {
            const card = document.createElement('div');
            card.className = 'guest-card';
            card.style.cursor = 'pointer';
            card.onclick = () => openGuestModal(guest.id);
            
            const tagsArray = guest.tags ? guest.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            const tagsHtml = tagsArray.map(t => `<span class="guest-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="guest-card-inner">
                    <div class="guest-image-wrapper">
                        <img src="${guest.photo_url || 'assets/images/placeholder.jpg'}" alt="${guest.cat_name}" class="guest-image" onerror="this.src='assets/images/placeholder.jpg'">
                    </div>
                    <div class="guest-info">
                        <h3 class="guest-name">${guest.cat_name}</h3>
                        <div class="guest-dates">${guest.stay_dates || ''}</div>
                        <p class="guest-story">${guest.description || ''}</p>
                        <div class="guest-tags">${tagsHtml}</div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching guests:", error);
        showComingSoon(container);
    }
}

function openGuestModal(id) {
    // Force ID string comparison just in case
    const guest = allGuests.find(g => String(g.id) === String(id));
    if (!guest) {
        console.error("Guest not found for modal:", id);
        return;
    }

    const modal = document.getElementById('guest-modal');
    const contentArea = document.getElementById('modal-content-area');
    
    if (!modal || !contentArea) {
        console.error("Modal elements missing from DOM!");
        return;
    }

    const tagsArray = guest.tags ? guest.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    const tagsHtml = tagsArray.map(t => `<span class="modal-tag">${t}</span>`).join('');

    contentArea.innerHTML = `
        <div class="modal-hero">
            <img src="${guest.photo_url || 'assets/images/placeholder.jpg'}" alt="${guest.cat_name}" class="modal-hero-img" onerror="this.src='assets/images/placeholder.jpg'">
        </div>
        <div class="modal-details">
            <div class="modal-header">
                <h2 class="modal-name">${guest.cat_name}</h2>
                <div class="modal-dates">${guest.stay_dates || ''}</div>
            </div>
            <p class="modal-story">${guest.description || ''}</p>
            <div class="modal-tags">${tagsHtml}</div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

// Expose to window for global access
window.openGuestModal = openGuestModal;
window.closeGuestModal = closeGuestModal;
function closeGuestModal() {
    const modal = document.getElementById('guest-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
}

function showComingSoon(container) {
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; background: rgba(255,255,255,0.5); border-radius: 30px; border: 2px dashed #D9A3A3; width: 100%;">
            <h3 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; color: #D9A3A3; margin-bottom: 15px;">Coming Soon!</h3>
            <p style="color: #666; font-size: 1.2rem;">We are preparing beautiful stories of our lovely guests. Stay tuned!</p>
        </div>
    `;
}
