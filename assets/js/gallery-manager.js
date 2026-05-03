/**
 * Gallery Manager - Black Princess & White Prince
 * Handles Supabase data fetching and dynamic video/image rendering.
 */
(function () {
    const initGallery = async () => {
        const container = document.querySelector('.masonry-container');
        if (!container) return;

        // Fetch items from Supabase
        const { data: items, error } = await supabase
            .from('gallery')
            .select('*')
            .eq('status', 'published')
            .order('order_index', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Gallery Load Error:", error);
            return;
        }

        if (!items || items.length === 0) {
            // Keep existing static content or show a placeholder if DB is empty
            return;
        }

        // Clear existing static content
        container.innerHTML = '';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'masonry-item';

            if (item.type === 'video') {
                // Muted YouTube embed as requested (to let background music play)
                // Using modestbranding and controls=0 for a cleaner look
                const videoId = item.url.includes('embed/')
                    ? item.url.split('embed/')[1].split('?')[0]
                    : item.url.split('v=')[1]?.split('&')[0];

                if (videoId) {
                    itemDiv.innerHTML = `
                        <div style="position: relative; padding-bottom: 177.77%; height: 0; overflow: hidden; border-radius: 20px;">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                                allow="autoplay; encrypted-media" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                }
            } else {
                itemDiv.innerHTML = `<img src="${item.url}" alt="${item.title || ''}" onerror="this.parentElement.style.display='none';">`;
            }

            container.appendChild(itemDiv);
        });

        // Hide specific coming soon text if we have content
        const subtitle = document.getElementById('text04');
        if (subtitle && (subtitle.textContent.toLowerCase().includes('soon') || subtitle.textContent.toLowerCase().includes('yakında'))) {
            subtitle.style.display = 'none';
        }
    };

    // Ensure we run after library initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }
})();
