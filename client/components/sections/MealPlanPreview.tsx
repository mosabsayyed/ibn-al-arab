import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/context/i18n";
import { PLANS } from "@shared/data/plans";
import { type PlanId } from "@shared/data/plans";

export default function MealPlanPreview() {
  const { locale, t } = useI18n();
  // Navigate to internal mock checkout to avoid blocked external window
  const subscribe = (planId: PlanId) => {
    window.location.href = `/checkout?plan=${planId}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLANS.map((p) => (
        <Card key={p.id} className="relative overflow-hidden border-2">
          <div className="flex flex-col md:flex-row">
            {/* Content side */}
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-3xl flex items-baseline gap-2">
                  <span className="text-red-600 font-extrabold">{locale === "en" ? p.titleEn : p.titleAr}</span>
                  <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                    {t("perMonth")}
                  </span>
                </CardTitle>
                <CardDescription>
                  {locale === "en"
                    ? `Delivery Days: ${p.days} days, ${p.mealsPerDay} meal${p.mealsPerDay > 1 ? "s" : ""} per day`
                    : `أيام التوصيل: ${p.days} يوم، ${p.mealsPerDay} وجبة يومياً`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xl font-extrabold">
                    {p.priceAED.toLocaleString()} {t("AED")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("specialStudentDiscount")}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-xl font-extrabold line-through text-muted-foreground block">
                      {p.priceAED.toLocaleString()} {t("AED")}
                    </span>
                    <span className="text-3xl font-extrabold text-emerald-600 block">
                      {p.studentPriceAED.toLocaleString()} {t("AED")}
                    </span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {p.discountApprox}
                    </span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => subscribe(p.id)}>
                  {t("subscribe")} · {locale === "en" ? p.titleEn : p.titleAr}
                </Button>
              </CardContent>
            </div>
            {/* Chef mascot side */}
            <div className="w-full md:w-40 h-40 md:h-auto bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center">
              <img
                src={`/${p.id}.png`}
                alt={`${locale === "en" ? p.titleEn : p.titleAr} Chef`}
                className="w-full h-full md:w-full md:h-auto object-contain max-h-40 md:max-h-56"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
