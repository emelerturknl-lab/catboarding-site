/**
 * Site Announcement Logic - Black Princess & White Prince
 * Handles persistent banner visibility for development notice.
 */
(function() {
    const waNumber = '31644205396';
    const message = 'Our website is currently under development. If you encounter any issues or need information, please reach out to us via WhatsApp!';
    const storageKey = 'site_announcement_dismissed';
    
    // Robust Homepage Detection (Self-Destruct if on homepage)
    const path = window.location.pathname.toLowerCase();
    const isHomepage = path === '/' || 
                       path === '/index.html' || 
                       path.endsWith('/index.html') ||
                       path === '';
    
    if (isHomepage) {
        console.warn("🐾 site-announcement.js: Homepage detected. Self-destructing to prevent banner render.");
        return;
    }



    const showBanner = () => {
        // Don't show if already hidden or already exists
        if (sessionStorage.getItem(storageKey) || document.getElementById('site-announcement-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'site-announcement-banner';
        
        // Premium Glassmorphism Style
        banner.style.cssText = `
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: rgba(217, 163, 163, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            text-align: center;
            padding: 12px 20px;
            z-index: 9998;
            font-family: 'Courgette', cursive;
            font-size: 0.95rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            transition: all 0.5s ease;
            opacity: 0;
            transform: translateY(-20px);
        `;

        banner.innerHTML = `
            <span style="flex-grow: 1; max-width: 800px;">${message}</span>
            <div style="display: flex; align-items: center; gap: 15px; flex-shrink: 0;">
                <a href="https://wa.me/${waNumber}" target="_blank" style="background: white; color: #D9A3A3; padding: 6px 16px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: inline-flex; align-items: center; gap: 6px; transition: transform 0.2s ease;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" style="width: 14px; height: 14px; filter: brightness(0) saturate(100%) invert(80%) sepia(16%) saturate(666%) hue-rotate(314deg) brightness(91%) contrast(89%);" alt="WA"> WhatsApp
                </a>
                <span id="close-site-announcement" style="cursor: pointer; font-weight: bold; font-size: 1.2rem; opacity: 0.7; padding: 0 5px;">✕</span>
            </div>
        `;

        document.body.appendChild(banner);
        
        // Trigger animation
        setTimeout(() => {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 100);

        // Close logic
        const closeBtn = banner.querySelector('#close-site-announcement');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(-20px)';
            setTimeout(() => banner.remove(), 500);
            sessionStorage.setItem(storageKey, 'true');
        };

        // Hover effect for WA button
        const waBtn = banner.querySelector('a');
        waBtn.onmouseenter = () => waBtn.style.transform = 'scale(1.05)';
        waBtn.onmouseleave = () => waBtn.style.transform = 'scale(1)';
    };

    // Trigger on interaction
    const triggerEvents = ['click', 'scroll', 'touchstart'];
    const handleTrigger = () => {
        showBanner();
        // We only show it once per page session unless closed
        triggerEvents.forEach(evt => window.removeEventListener(evt, handleTrigger));
    };

    if (!sessionStorage.getItem(storageKey)) {
        // Wait for first interaction to avoid blocking music or other initial loads
        triggerEvents.forEach(evt => window.addEventListener(evt, handleTrigger));
        
        // Also show if music already started on previous page load or interaction already happened
        if (localStorage.getItem('bgMusic_interaction') === 'true') {
            if (document.readyState === 'complete') {
                showBanner();
            } else {
                window.addEventListener('load', showBanner);
            }
        }
    }
})();
