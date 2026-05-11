document.addEventListener('DOMContentLoaded', () => {
    fetchPublicGuests();
});

async function fetchPublicGuests() {
    const container = document.getElementById('guests-container');
    if (!container) return;

    try {
        // Fetch from Supabase - Newest First (using order_index descending)
        const { data, error } = await supabase
            .from('guests')
            .select('*')
            .eq('status', 'published')
            .order('order_index', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            showComingSoon(container);
            return;
        }

        container.innerHTML = '';
        
        data.forEach(guest => {
            const card = document.createElement('div');
            card.className = 'guest-card';
            
            const tagsArray = guest.tags ? guest.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            const tagsHtml = tagsArray.map(t => `<span class="guest-tag">${t}</span>`).join('');

            card.innerHTML = `
                <div class="guest-image-wrapper">
                    <img src="${guest.photo_url || 'assets/images/placeholder.jpg'}" alt="${guest.cat_name}" class="guest-image" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="guest-info">
                    <div class="guest-header">
                        <h3 class="guest-name">${guest.cat_name}</h3>
                        <div class="guest-dates">${guest.stay_dates || ''}</div>
                    </div>
                    <p class="guest-story">${guest.description || ''}</p>
                    <div class="guest-tags">${tagsHtml}</div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching guests:", error);
        showComingSoon(container);
    }
}

function showComingSoon(container) {
    container.innerHTML = `
        <div style="text-align:center; padding: 60px 20px; background: rgba(255,255,255,0.5); border-radius: 30px; border: 2px dashed #D9A3A3; width: 100%;">
            <h3 style="font-family: 'Dancing Script', cursive; font-size: 2.5rem; color: #D9A3A3; margin-bottom: 15px;">Coming Soon!</h3>
            <p style="color: #666; font-size: 1.2rem;">We are preparing beautiful stories of our lovely guests. Stay tuned!</p>
        </div>
    `;
}
