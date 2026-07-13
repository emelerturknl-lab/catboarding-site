document.addEventListener('DOMContentLoaded', () => {
    fetchPublicGuests();
});

async function fetchPublicGuests() {
    const container = document.getElementById('guests-container');
    if (!container) return;

    // Inject styles dynamically to avoid inline styling rules
    if (!document.getElementById('guest-stay-styles')) {
        const style = document.createElement('style');
        style.id = 'guest-stay-styles';
        style.textContent = `
            .returning-guest-badge {
                background: #fff5f5;
                color: #D9A3A3;
                border: 1px solid rgba(217, 163, 163, 0.3);
                font-size: 0.8rem;
                padding: 4px 10px;
                border-radius: 20px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-weight: bold;
                margin-left: 10px;
                vertical-align: middle;
            }
            .last-visit-container {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px dashed rgba(217, 163, 163, 0.25);
            }
            .last-visit-title {
                font-family: 'Dancing Script', cursive !important;
                font-size: 1.4rem;
                color: #D9A3A3;
                margin: 0 0 5px 0;
                text-align: left;
            }
            .last-visit-date {
                font-size: 0.95rem;
                color: #555;
                text-align: left;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    try {
        let data, error;

        // 1. Primary Attempt: Fetch guests with relation
        const primaryQuery = await supabase
            .from('guests')
            .select(`
                *,
                guest_stays(
                    start_date,
                    end_date
                )
            `)
            .eq('status', 'published')
            .order('order_index', { ascending: false });
        
        data = primaryQuery.data;
        error = primaryQuery.error;

        // 2. Fallback Attempt: If relation query fails, run fallback query against public guests
        if (error) {
            console.warn("Primary relation query failed, attempting legacy fallback:", error);
            const fallbackQuery = await supabase
                .from('guests')
                .select('*')
                .eq('status', 'published')
                .order('order_index', { ascending: false });
            
            data = fallbackQuery.data;
            error = fallbackQuery.error;
            
            if (error) throw error; // Throw only if both fail
        }

        if (!data || data.length === 0) {
            showComingSoon(container);
            return;
        }

        // --- Date Calculations & Pre-processing ---
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const localToday = `${year}-${month}-${day}`;

        // Map and pre-process stays for sorting
        data.forEach(guest => {
            const hasRelationData = Array.isArray(guest.guest_stays) && guest.guest_stays.length > 0;
            guest._hasRelationData = hasRelationData;
            
            const stays = hasRelationData ? guest.guest_stays : [];
            const eligibleStays = stays
                .filter(s => s.start_date <= localToday)
                .sort((a, b) => a.start_date.localeCompare(b.start_date)); // Chronological ascending
            
            guest._eligibleStays = eligibleStays;
            
            if (eligibleStays.length > 0) {
                // Latest eligible start_date is the last one in the ascending chronological list
                guest._latestEligibleStartDate = eligibleStays[eligibleStays.length - 1].start_date;
            } else {
                guest._latestEligibleStartDate = null;
            }
        });

        // --- Public Card Sorting Rule ---
        // Sort guests:
        // 1. Guests with eligible stays come before guests with no eligible stays.
        // 2. Sort by latest eligible start_date descending.
        // 3. Fallback: Sort by order_index descending for ties.
        data.sort((a, b) => {
            const hasA = a._latestEligibleStartDate !== null;
            const hasB = b._latestEligibleStartDate !== null;
            
            if (hasA && !hasB) return -1;
            if (!hasA && hasB) return 1;
            
            if (hasA && hasB) {
                const dateCompare = b._latestEligibleStartDate.localeCompare(a._latestEligibleStartDate);
                if (dateCompare !== 0) return dateCompare;
            }
            
            // Tie-breaker: order_index descending
            return (b.order_index || 0) - (a.order_index || 0);
        });

        container.innerHTML = '';
        
        data.forEach(guest => {
            const card = document.createElement('div');
            card.className = 'guest-card';
            
            const tagsArray = guest.tags ? guest.tags.split(',').map(t => t.trim()).filter(t => t) : [];
            const tagsHtml = tagsArray.map(t => `<span class="guest-tag">${t}</span>`).join('');

            // Clean up description if it starts with the cat's name
            let displayStory = guest.description || '';
            const catName = guest.cat_name;
            if (displayStory.toLowerCase().startsWith(catName.toLowerCase())) {
                // Remove name and potential separators/emojis at the start (\u2728 is sparkle emoji)
                const regex = new RegExp('^\\s*' + catName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[\u2728\\s-]*', 'i');
                displayStory = displayStory.replace(regex, '');
            }

            // Month year formatter helper (direct string parsing, timezone-safe)
            const formatMonthYear = (dateStr) => {
                const parts = dateStr.split('-');
                if (parts.length !== 3) return '';
                const mNum = parseInt(parts[1], 10);
                const yNum = parseInt(parts[0], 10);
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                return `${monthNames[mNum - 1]} ${yNum}`;
            };

            const eligibleStays = guest._eligibleStays || [];
            const latestEligibleStay = eligibleStays.length > 0 ? eligibleStays[eligibleStays.length - 1] : null;

            // Dates display logic (fallback only when relation data is completely missing/empty)
            let datesHtml = '';
            if (!guest._hasRelationData) {
                datesHtml = `<div class="guest-dates">${guest.stay_dates || ''}</div>`;
            }

            // Returning Guest badge (only when eligible stays >= 2)
            let returningBadgeHtml = '';
            if (eligibleStays.length >= 2) {
                returningBadgeHtml = `<span class="returning-guest-badge">🐾 Returning Guest</span>`;
            }

            // Last Visit layout rendering
            let lastVisitHtml = '';
            if (latestEligibleStay) {
                const formattedDate = formatMonthYear(latestEligibleStay.start_date);
                lastVisitHtml = `
                    <div class="last-visit-container">
                        <h4 class="last-visit-title">Last Visit</h4>
                        <div class="last-visit-date">${formattedDate}</div>
                    </div>
                `;
            }

            // Construct card HTML (preserving exact naming, structures, stories, tags and classes)
            card.innerHTML = `
                <div class="guest-image-wrapper">
                    <img src="${guest.photo_url || 'assets/images/placeholder.jpg'}" alt="${guest.cat_name}" class="guest-image" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
                <div class="guest-info">
                    <div class="guest-header">
                        <h3 class="guest-name">${guest.cat_name}${returningBadgeHtml}</h3>
                        ${datesHtml}
                    </div>
                    <p class="guest-story">${displayStory}</p>
                    <div class="guest-tags">${tagsHtml}</div>
                    ${lastVisitHtml}
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
