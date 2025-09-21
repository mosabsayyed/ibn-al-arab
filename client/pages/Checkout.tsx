import { useSearchParams, Link } from "react-router-dom";
import { useI18n } from "@/context/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPlanById } from "@shared/data/plans";

export default function Checkout() {
  const [params] = useSearchParams();
  const { locale, t } = useI18n();
  const planId = params.get("plan") ?? "";

  const plan = getPlanById(planId as any);

  if (!plan) {
    return (
      <main className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-700">Invalid Plan</h1>
          <p className="text-gray-600">The selected plan is not available.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  const originalPrice = plan.priceAED;
  const discountedPrice = plan.studentPriceAED;
  const vatRate = 0.05; // 5%
  const vatAmount = Math.round(discountedPrice * vatRate);
  const finalPrice = discountedPrice + vatAmount;

  return (
    <main className="container py-16 max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-2">{t("checkout")}</h1>
      <p className="text-muted-foreground mb-6">
        {t("completeYourSubscription")}
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Plan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-red-600 font-extrabold">
                {locale === "en" ? plan.titleEn : plan.titleAr}
              </span>
              <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                {t("perMonth")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {locale === "en"
                ? `Delivery Days: ${plan.days} days, ${plan.mealsPerDay} meal${plan.mealsPerDay > 1 ? "s" : ""} per day`
                : `أيام التوصيل: ${plan.days} يوم، ${plan.mealsPerDay} وجبة يومياً`}
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              {t("specialStudentDiscount")}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("pricingBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("originalPrice")}</span>
              <span className="line-through text-muted-foreground">
                {originalPrice.toLocaleString()} {t("AED")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("discountAmount")}</span>
              <span className="text-emerald-600 font-medium">
                -{(originalPrice - discountedPrice).toLocaleString()} {t("AED")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">
                {discountedPrice.toLocaleString()} {t("AED")}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">VAT (5%)</span>
              <span className="font-medium">
                {vatAmount.toLocaleString()} {t("AED")}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t("total")}</span>
              <span className="text-red-600">
                {finalPrice.toLocaleString()} {t("AED")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-lg border p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("paymentNote")}
        </p>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline">{t("back")}</Button>
          </Link>
          <Button className="flex-1">
            {t("payNow")} - {finalPrice.toLocaleString()} {t("AED")}
          </Button>
        </div>
      </div>
    </main>
  );
}
