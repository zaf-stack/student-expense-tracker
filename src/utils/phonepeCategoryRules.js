export const PHONEPE_CATEGORY_RULES = [
    { match: ['grocery', 'kirana', 'mart', 'supermarket'], category: 'Grocery' },
    { match: ['vegetable', 'sabzi', 'fruits', 'fruit'], category: 'Vegetables' },
    { match: ['zomato', 'swiggy', 'food', 'restaurant', 'cafe', 'dhaba'], category: 'Outside Food' },
    { match: ['uber', 'ola', 'rapido', 'metro', 'bus', 'train', 'fuel', 'petrol', 'diesel'], category: 'Transport' },
    { match: ['rent', 'hostel', 'pg'], category: 'Rent' },
    { match: ['electricity', 'water', 'bill', 'recharge', 'wifi', 'broadband'], category: 'Utilities' },
    { match: ['medical', 'pharmacy', 'doctor', 'hospital'], category: 'Medical' },
    { match: ['book', 'course', 'fees', 'tuition'], category: 'Education' },
];

export const categorizePhonePe = (description = '', type = '') => {
    const text = description.toLowerCase();
    for (const rule of PHONEPE_CATEGORY_RULES) {
        if (rule.match.some(keyword => text.includes(keyword))) {
            return rule.category;
        }
    }

    if (type === 'CREDIT') return 'Income';
    return 'Other';
};
