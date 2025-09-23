import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from "react-router-dom";
import { useI18n } from "@/context/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const { locale, t } = useI18n();
  const subscriptionNumber = params.get("subscription") ?? "SUB-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const planId = params.get("plan") ?? "";
  const [plan, setPlan] = useState<any | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/plans');
        if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`);
        const plans = await res.json();
        const found = plans.find((p: any) => p.id === planId || p.id === (planId as any));
        if (mounted) setPlan(found ?? null);
      } catch (err: any) {
        console.error(err);
      } finally {
        if (mounted) setLoadingPlan(false);
      }
    })();
    return () => { mounted = false };
  }, [planId]);

  if (loadingPlan) {
    return (
      <div role="main" className="container py-16 max-w-lg mx-auto">
        Loading...
      </div>
    );
  }

  if (!plan) {
    return (
      <div role="main" className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-700">Plan Not Found</h1>
          <p className="text-gray-600">Unable to load plan details.</p>
          <Link to="/">
            <Button>{t("backToHome")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const originalPrice = plan.base_price_aed || 0;
  const discountedPrice = plan.discounted_price_aed || originalPrice;
  const discountAmount = originalPrice - discountedPrice;
  const vatRate = 0.05; // 5%
  const vatAmount = Math.round(discountedPrice * vatRate);
  const finalPrice = discountedPrice + vatAmount;

  return (
    <div role="main" className="container py-16 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-green-700 mb-2">{t("orderSuccess")}</h1>
        <p className="text-gray-600">{t("orderProcessingMessage")}</p>
      </div>

      <Card className="mb-8 border-green-200 bg-green-50">
        <CardContent className="text-center py-8">
          <div className="text-sm text-gray-600 mb-2">{t("subscriptionNumber")}</div>
          <div className="text-3xl font-bold text-green-700 font-mono tracking-wider">
            {subscriptionNumber}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("mealPlanDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-red-600">
              {locale === "en" ? plan.name_en : plan.name_ar}
            </div>
            <div className="text-sm text-gray-600">
              {locale === "en"
                ? `Delivery Days: ${plan.delivery_days} days, ${plan.meals_per_day} meal${plan.meals_per_day > 1 ? "s" : ""} per day`
                : `أيام التوصيل: ${plan.delivery_days} يوم، ${plan.meals_per_day} وجبة يومياً`}
            </div>
            <div className="text-sm text-emerald-600 font-medium">
              {t("monthlySubscription")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("paymentSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("originalPrice")}</span>
              <span className={discountAmount > 0 ? "line-through text-gray-400" : "font-medium"}>
                {originalPrice.toLocaleString()} {t("AED")}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="space-y-0">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("studentDiscount")}</span>
                  <span className="text-emerald-600 font-medium">
                    -{discountAmount.toLocaleString()} {t("AED")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span className="font-medium">
                    {discountedPrice.toLocaleString()} {t("AED")}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('vatLabel')}</span>
              <span className="font-medium">
                {vatAmount.toLocaleString()} {t("AED")}
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t("totalPaid")}</span>
                <span className="text-red-600">
                  {finalPrice.toLocaleString()} {t("AED")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">{t("whatHappensNext")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">{t("orderProcessing")}</h4>
            <p className="text-sm text-blue-800">
              {t("orderProcessingDescription")}
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">{t("emailNotification")}</h4>
            <p className="text-sm text-green-800">
              {t("emailNotificationDescription")}
            </p>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">{t("deliveryRoute")}</h4>
            <p className="text-sm text-orange-800">
              {t("deliveryRouteDescription")}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Link to="/">
          <Button variant="outline" className="min-w-32">{t("backToHome")}</Button>
        </Link>
        <Button className="min-w-32 bg-red-600 hover:bg-red-700" onClick={() => window.print()}>
          {t("printReceipt")}
        </Button>
      </div>
    </div>
  );
}