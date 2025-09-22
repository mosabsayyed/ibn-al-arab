// PRODUCT_SIGNOFF_REQUIRED
// This data is for display and structure only.
// Actual prices MUST be fetched from a secure, external configuration source.
export const PLANS = [
    {
        id: "flex",
        titleEn: "Flex",
        titleAr: "تقوية",
        days: 26,
        mealsPerDay: 2,
        priceReference: "FLEX_REGULAR_MONTHLY",
        studentPriceReference: "FLEX_STUDENT_MONTHLY",
    },
    {
        id: "focus",
        titleEn: "Focus",
        titleAr: "تركيز",
        days: 26,
        mealsPerDay: 1,
        priceReference: "FOCUS_REGULAR_MONTHLY",
        studentPriceReference: "FOCUS_STUDENT_MONTHLY",
    },
    {
        id: "fuel",
        titleEn: "Fuel",
        titleAr: "تغذية",
        days: 20,
        mealsPerDay: 1,
        priceReference: "FUEL_REGULAR_MONTHLY",
        studentPriceReference: "FUEL_STUDENT_MONTHLY",
    },
];
export function getPlanById(id) {
    return PLANS.find(plan => plan.id === id);
}
