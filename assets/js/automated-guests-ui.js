/**
 * ==============================================================================
 * AUTOMATED GUEST GALLERY SYSTEM (UI)
 * ==============================================================================
 * 
 * NASIL ÇALIŞIR:
 * Bu sistem, `generate-guests-data.js` scripti tarafından statik olarak üretilen
 * `automated-guests-data.js` dosyasındaki verileri okur ve ekrana basar.
 * Mevcut Supabase sisteminden (guests-manager.js) tamamen bağımsız çalışır.
 *
 * HANGİ KLASÖRÜ TARAR:
 * /Konuklarımız/gift/ klasörünü tarar.
 *
 * DOSYA İSİMLENDİRME KURALLARI:
 * 1. Kapak fotoğrafı: KAPAK-MISAFIRADI.png (Örn: KAPAK-BONCUK-1.png)
 *    Sistem `KAPAK-` ön ekini arar ve misafir adını buradan çıkartır.
 * 2. Galeri fotoğrafları: MISAFIRADI-*.png (Örn: BONCUK-2.png, BONCUK bahce.png)
 * 3. Metin (Opsiyonel): MISAFIRADI.txt veya .md (Örn: BONCUK.txt)
 *
 * YENİ MİSAFİR EKLEME ADIMLARI:
 * 1. Misafirinizin kapak fotoğrafını KAPAK-İSİM formatıyla /Konuklarımız/gift/ klasörüne ekleyin.
 * 2. Diğer fotoğraflarını İSİM formatıyla aynı klasöre ekleyin.
 * 3. Terminalde ana dizinde `node generate-guests-data.js` komutunu çalıştırın.
 * 4. Siteyi yayına alın. Sistem otomatik olarak kartı ve galeriyi oluşturacaktır!
 * ==============================================================================
 */

console.log("🛠 Automated Guest UI Script Loading...");
console.log("🛠 guestsData variable status:", typeof guestsData !== 'undefined' ? "Loaded (" + guestsData.length + " guests)" : "UNDEFINED!");

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    renderGuests();
    setupLightbox();
});

function renderGuests() {
    const container = document.getElementById('automated-guests-container');
    if (!container) {
        console.error("❌ Automated Gallery Error: Container #automated-guests-container not found in HTML!");
        return;
    }
    
    container.innerHTML = '';
    
    // Check if data exists
    if (typeof guestsData === 'undefined') {
        console.error("❌ Automated Gallery Error: guestsData is undefined! Make sure <script src='/assets/js/automated-guests-data.js'> is loaded BEFORE automated-guests-ui.js and returns HTTP 200.");
        container.style.display = 'none';
        return;
    }

    if (guestsData.length === 0) {
        console.log("ℹ️ Automated Gallery: guestsData array is empty. Hiding container.");
        // Data is empty, do nothing, let the old system show "Coming Soon"
        container.style.display = 'none';
        return;
    }

    console.log("✅ Automated Gallery: Rendering", guestsData.length, "guests...");

    // Data exists, hide the old system (Coming Soon container) so they don't clash
    const oldContainer = document.getElementById('guests-container');
    if (oldContainer) oldContainer.style.display = 'none';

    guestsData.forEach(guest => {
        const card = document.createElement('div');
        card.className = 'automated-guest-card';

        // Generate gallery thumbnails HTML
        let galleryHtml = '';
        if (guest.gallery && guest.gallery.length > 0) {
            const thumbs = guest.gallery.map(img => `
                <div class="gallery-thumb-wrapper" onclick="openLightbox('${img}')">
                    <img src="${img}" class="gallery-thumb" alt="${guest.name} gallery image" loading="lazy" onerror="this.parentElement.style.display='none'">
                </div>
            `).join('');
            
            galleryHtml = `
                <div class="guest-gallery-section">
                    <div class="gallery-scroll-container">
                        ${thumbs}
                    </div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="cover-wrapper" onclick="openLightbox('${guest.cover}')">
                <img src="${guest.cover}" alt="${guest.name} cover" class="guest-cover" loading="lazy" onerror="this.src='/assets/images/placeholder.jpg'; this.onerror=null;">
                <div class="cover-overlay">
                    <div class="zoom-icon">🔍 Büyüt</div>
                </div>
            </div>
            <div class="guest-details">
                <h2 class="guest-title">${guest.name}</h2>
                <div class="guest-separator"></div>
                <p class="guest-description">${guest.description}</p>
                ${galleryHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

function setupLightbox() {
    // Create lightbox HTML if it doesn't exist
    if (!document.getElementById('automated-lightbox')) {
        const lb = document.createElement('div');
        lb.id = 'automated-lightbox';
        lb.className = 'lightbox-overlay';
        lb.innerHTML = `
            <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
            <img class="lightbox-img" id="lightbox-image">
        `;
        document.body.appendChild(lb);

        // Close on background click
        lb.addEventListener('click', (e) => {
            if (e.target === lb) closeLightbox();
        });
    }
}

window.openLightbox = function(imageSrc) {
    const lb = document.getElementById('automated-lightbox');
    const img = document.getElementById('lightbox-image');
    if (lb && img) {
        img.src = imageSrc;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

window.closeLightbox = function() {
    const lb = document.getElementById('automated-lightbox');
    if (lb) {
        lb.classList.remove('active');
        document.body.style.overflow = '';
        // Clear src after fade out to prevent flicker on next open
        setTimeout(() => { document.getElementById('lightbox-image').src = ''; }, 300);
    }
}
