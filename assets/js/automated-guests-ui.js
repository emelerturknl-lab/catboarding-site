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

    // Sort guests: BONCUK first, then MİLO, then BAMİ
    guestsData.sort((a, b) => {
        const order = { 'BONCUK': 1, 'MİLO': 2, 'BAMİ': 3 };
        const aVal = order[a.name] || 99;
        const bVal = order[b.name] || 99;
        return aVal - bVal;
    });

    // Force container to be a centered 2-column grid max 900px
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
    container.style.gap = '40px';
    container.style.maxWidth = '900px';
    container.style.margin = '60px auto 0 auto';
    container.style.justifyContent = 'center';

    guestsData.forEach(guest => {
        const card = document.createElement('div');
        card.className = 'automated-guest-card';
        
        // Force BONCUK to span full width and center
        if (guest.name === 'BONCUK') {
            card.style.gridColumn = '1 / -1';
            card.style.maxWidth = '450px';
            card.style.margin = '0 auto';
            card.style.width = '100%';
        }

        // Remove the black card background so it tightly wraps the image
        card.style.setProperty('background', 'transparent', 'important');
        card.style.setProperty('border', 'none', 'important');
        card.style.setProperty('box-shadow', '0 15px 35px rgba(0,0,0,0.5)', 'important');
        card.style.borderRadius = '20px';

        // Simplified UI: Image uses natural height (height: auto) to prevent black bars
        card.innerHTML = `
            <div class="cover-wrapper" style="height: auto; width: 100%; border-radius: 20px; overflow: hidden; position: relative;" onclick="openLightbox('${guest.cover}')">
                <img src="${guest.cover}" alt="${guest.name} cover" style="width: 100%; height: auto; display: block; transition: transform 0.5s ease;" loading="lazy" onerror="this.src='/assets/images/main_logo.png'; this.onerror=null;">
                <div class="cover-overlay" style="border-radius: 20px;">
                    <div class="zoom-icon">🔍 Büyüt</div>
                </div>
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
