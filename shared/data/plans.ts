// PRODUCT_SIGNOFF_REQUIRED
// This data is for display and structure only.
// Actual prices MUST be fetched from a secure, external configuration source.

export type PlanId = "flex" | "focus" | "fuel";

export interface Plan {
  id: PlanId;
  titleEn: string;
  titleAr: string;
  days: number;
  mealsPerDay: number;
  priceReference: string; // Key for price lookup, e.g., "FLEX_PLAN_PRICE"
  studentPriceReference: string; // Key for student price lookup
}

export const PLANS: Plan[] = [
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

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find(plan => plan.id === id);
}
