/**
 * Blog Image Automation for Black Princess & White Prince
 * Automatically assigns a high-quality anonymous cat photo to blog posts
 * based on their titles, ensuring a professional and consistent look.
 * Optimized for local files and reliable fallback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Curated local images for specific topics
    const localMappings = [
        { keywords: ['care', 'someone', 'look for'], src: 'assets/images/blog_cat_care_anonymous.png' },
        { keywords: ['prepare', 'stress-free', 'guide'], src: 'assets/images/blog_cat_prep_anonymous.png' },
        { keywords: ['cage-free', 'boarding', 'best choice'], src: 'assets/images/blog_anonymous_cagefree.png' },
        { keywords: ['updates', 'video', 'connected'], src: 'assets/images/blog_updates.png' }
    ];

    // Array of high-quality, anonymous cat photo IDs from Unsplash (Fallback)
    // Note: These use the full Unsplash ID for the direct image URL
    const anonymousCatPhotos = [
        '1514888286974-6c03e2ca1dba', // Cozy cat
        '1543852786-1cf6624b9987', // Ginger cat
        '1573865662567-57ef5b67bd00', // Sleeping cat
        '1495360010541-f48722b34f7d', // Curtailed tabby
        '1511044568932-338cba0ad801', // Curious cat
        '1533733358354-203511b5d8f8', // Black cat
        '1513245533132-aa7f8176b222', // Cat on blanket
        '1548247416-ec66f4900b2e', // Calm sitting cat
        '1516750105099-4b8a83e217ee', // Stretching cat
        '1519052537078-e6302a4968d4'  // Playful cat
    ];

    function getStringHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    // Find all images marked for auto-photo
    const blogImages = document.querySelectorAll('img[data-auto-photo]');

    blogImages.forEach(img => {
        const postContainer = img.closest('div[style*="background: rgba(255, 255, 255, 0.85)"]');
        const title = postContainer ? postContainer.querySelector('h2')?.innerText.toLowerCase() : "";

        // 1. Try local mappings first for better precision
        let matchedSrc = null;
        for (const mapping of localMappings) {
            if (mapping.keywords.some(k => title.includes(k))) {
                matchedSrc = mapping.src;
                break;
            }
        }

        if (matchedSrc) {
            img.src = matchedSrc;
        } else {
            // 2. Fallback to Unsplash with a consistent hash-based ID
            const photoIndex = getStringHash(title) || 0;
            const photoId = anonymousCatPhotos[photoIndex % anonymousCatPhotos.length];
            // Correct Unsplash Image URL format
            img.src = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;
        }

        // Ensure alt text is present
        if (!img.alt || img.alt === "") {
            img.alt = "Professional and caring cat boarding environment";
        }
        
        // Final check to handle potential path issues
        img.onerror = function() {
            this.src = 'assets/images/blog_anonymous_cagefree.png'; // Universal fallback
            this.onerror = null;
        };
    });
});
