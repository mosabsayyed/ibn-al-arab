import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/context/i18n";
import { type Plan } from "@shared/types";

export default function MealPlanPreview() {
  const { locale, t } = useI18n();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const subscribe = (planId: string) => {
    window.location.href = `/checkout?plan=${planId}`;
  };

  if (loading) {
    return <div>Loading plans...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((p) => (
        <Card key={p.id} className="relative overflow-hidden border-2">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              <CardHeader>
                <CardTitle className="text-3xl flex items-baseline gap-2">
                  <span className="text-red-600 font-extrabold">{locale === "en" ? p.name_en : p.name_ar}</span>
                  <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                    {t("perMonth")}
                  </span>
                </CardTitle>
                <CardDescription>
                  {locale === "en"
                    ? `Delivery Days: ${p.delivery_days} days, ${p.meals_per_day} meal${p.meals_per_day > 1 ? "s" : ""} per day`
                    : `أيام التوصيل: ${p.delivery_days} يوم، ${p.meals_per_day} وجبة يومياً`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-xl font-extrabold">
                    {p.base_price_aed.toLocaleString()} {t("AED")}
                  </span>
                  {p.discounted_price_aed && (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {t("specialStudentDiscount")}
                      </span>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xl font-extrabold line-through text-muted-foreground block">
                          {p.base_price_aed.toLocaleString()} {t("AED")}
                        </span>
                        <span className="text-3xl font-extrabold text-emerald-600 block">
                          {p.discounted_price_aed.toLocaleString()} {t("AED")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <Button className="w-full" onClick={() => subscribe(p.id)}>
                  {t("subscribe")} · {locale === "en" ? p.name_en : p.name_ar}
                </Button>
              </CardContent>
            </div>
            <div className="w-full md:w-40 h-40 md:h-auto bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center">
              <img
                src={`/${p.code.toLowerCase()}.png`}
                alt={`${locale === "en" ? p.name_en : p.name_ar} Chef`}
                className="w-full h-full md:w-full md:h-auto object-contain max-h-40 md:max-h-56"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
