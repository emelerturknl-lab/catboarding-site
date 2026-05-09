const HomeEngine = {
    getNightsBetween: function(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    calculateAccommodation: function (nights, catCount) {
        let ratePerNight = (catCount === 1) ? 20 : 35;
        let undiscountedTotal = nights * ratePerNight;
        let nightsFree = 0;

        // Example Promotion: Stay 7 nights, get 1 free (if applicable)
        // if (nights >= 7) nightsFree = Math.floor(nights / 7);
        
        let total = (nights - nightsFree) * ratePerNight;

        return {
            ratePerNight: ratePerNight,
            undiscountedTotal: undiscountedTotal,
            nightsFree: nightsFree,
            total: total
        };
    },

    getFixedTransferPrice: function(location) {
        const prices = {
            'Schiphol': 65,
            'Amsterdam': 50,
            'Hoofddorp': 60,
            'Lelystad': 45
        };
        return prices[location] || null;
    },

    calculateDistanceTransfer: function(km) {
        // Example: €1.5 per km, minimum €15
        const rate = 1.5;
        const min = 15;
        return Math.max(min, km * rate);
    }
};

if (typeof module !== 'undefined') {
    module.exports = HomeEngine;
}
window.HomeEngine = HomeEngine;
