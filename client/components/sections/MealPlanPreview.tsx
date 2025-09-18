import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n";
import { type PlanId, CheckoutResponse } from "@shared/api";

const PLANS: Array<{
  id: PlanId;
  titleEn: string;
  titleAr: string;
  days: number;
  mealsPerDay: number;
  priceAED: number;
  studentPriceAED: number;
  discountApprox: string;
}> = [
  { id: "flex", titleEn: "Flex", titleAr: "تقوية", days: 26, mealsPerDay: 2, priceAED: 1350, studentPriceAED: 1100, discountApprox: "~18.5%" },
  { id: "focus", titleEn: "Focus", titleAr: "تركيز", days: 26, mealsPerDay: 1, priceAED: 730, studentPriceAED: 640, discountApprox: "~12%" },
  { id: "fuel", titleEn: "Fuel", titleAr: "تغذية", days: 20, mealsPerDay: 1, priceAED: 600, studentPriceAED: 550, discountApprox: "~8%" },
];

export default function MealPlanPreview() {
  const { locale, t } = useI18n();

  const subscribe = async (planId: PlanId) => {
    const res = await fetch("/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = (await res.json()) as CheckoutResponse;
    if (data.checkoutUrl) {
      window.open(data.checkoutUrl, "_blank");
    }
  };

  return (
    <section id="preview" className="container py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
        {t("mealPlanPreview")}
      </h2>
      <p className="text-muted-foreground max-w-2xl mb-10">
        {locale === "en"
          ? "We’re an Arabic Cuisine restaurant serving traditional dishes. Cloud-based. Monthly subscriptions only."
          : "نقدّم المأكولات العربية التقليدية. مطعم سحابي. اشتراكات شهرية فقط."}
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card key={p.id} className="relative overflow-hidden border-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-baseline gap-2">
                <span>{locale === "en" ? p.titleEn : p.titleAr}</span>
                <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">{t("perMonth")}</span>
              </CardTitle>
              <CardDescription>
                {locale === "en"
                  ? `Delivery Days: ${p.days} days, ${p.mealsPerDay} meal${p.mealsPerDay>1?"s":""} per day`
                  : `أيام التوصيل: ${p.days} يوم، ${p.mealsPerDay} وجبة يومياً`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-extrabold">
                {p.priceAED.toLocaleString()} <span className="text-lg font-semibold">AED</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === "en"
                  ? `Student Discount: ${p.discountApprox} → ${p.studentPriceAED.toLocaleString()} AED`
                  : `خصم الطلاب: ${p.discountApprox} → ${p.studentPriceAED.toLocaleString()} درهم`}
              </div>
              <Button className="w-full" onClick={() => subscribe(p.id)}>
                {t("subscribe")} · {locale === "en" ? p.titleEn : p.titleAr}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
