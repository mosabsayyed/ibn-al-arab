export type PlanId = "flex" | "focus" | "fuel";

export interface Plan {
  id: PlanId;
  titleEn: string;
  titleAr: string;
  days: number;
  mealsPerDay: number;
  priceAED: number;
  studentPriceAED: number;
  discountApprox: string;
}

export const PLANS: Plan[] = [
  {
    id: "flex",
    titleEn: "Flex",
    titleAr: "تقوية",
    days: 26,
    mealsPerDay: 2,
    priceAED: 1350,
    studentPriceAED: 1100,
    discountApprox: "~18.5%",
  },
  {
    id: "focus",
    titleEn: "Focus",
    titleAr: "تركيز",
    days: 26,
    mealsPerDay: 1,
    priceAED: 730,
    studentPriceAED: 640,
    discountApprox: "~12%",
  },
  {
    id: "fuel",
    titleEn: "Fuel",
    titleAr: "تغذية",
    days: 20,
    mealsPerDay: 1,
    priceAED: 600,
    studentPriceAED: 550,
    discountApprox: "~8%",
  },
];

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find(plan => plan.id === id);
}