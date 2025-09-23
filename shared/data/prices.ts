export const PRICE_TABLE: Record<string, number> = {
  FLEX_REGULAR_MONTHLY: 300,
  FLEX_STUDENT_MONTHLY: 250,
  FOCUS_REGULAR_MONTHLY: 280,
  FOCUS_STUDENT_MONTHLY: 230,
  FUEL_REGULAR_MONTHLY: 260,
  FUEL_STUDENT_MONTHLY: 210,
};

export function getPrice(key: string, fallback = 0) {
  return PRICE_TABLE[key] ?? fallback;
}
