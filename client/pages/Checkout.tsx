import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useI18n } from "@/context/i18n";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from 'react'
import { getPrice } from "@shared/data/prices";
import ProofUpload from "@/components/ProofUpload";
import { SHARJAH_DISTRICTS } from "@shared/data/districts";

export default function Checkout() {
  const [params] = useSearchParams();
  const { locale, t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const planId = params.get("plan") ?? "";
  const [plan, setPlan] = useState<any | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [planError, setPlanError] = useState<string | null>(null)
  
  // Form state
  const [isStudent, setIsStudent] = useState(false);
  const [universityEmail, setUniversityEmail] = useState("");
  const [studentIdExpiry, setStudentIdExpiry] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bankTransfer");

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/plans')
        if (!res.ok) throw new Error(`Failed to fetch plans: ${res.status}`)
        const plans = await res.json()
        const found = plans.find((p: any) => p.id === planId || p.id === (planId as any))
        if (mounted) setPlan(found ?? null)
      } catch (err: any) {
        console.error(err)
        if (mounted) setPlanError(err?.message || 'Unknown error')
      } finally {
        if (mounted) setLoadingPlan(false)
      }
    })()
    return () => { mounted = false }
  }, [planId])

  if (loadingPlan) return <main className="container py-16 max-w-lg mx-auto">Loading plan...</main>

  if (!plan) {
    return (
      <main className="container py-16 max-w-lg mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-700">Invalid Plan</h1>
          <p className="text-gray-600">The selected plan is not available.</p>
          <Link to="/">
            <Button>{t("backToHome")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  // Use DB pricing fields and apply student discount if applicable
  const originalPrice = plan.base_price_aed || 0;
  const baseDiscountedPrice = plan.discounted_price_aed || originalPrice;
  const finalDiscountedPrice = isStudent ? baseDiscountedPrice : originalPrice;
  const vatRate = 0.05; // 5%
  const vatAmount = Math.round(finalDiscountedPrice * vatRate);
  const finalPrice = finalDiscountedPrice + vatAmount;

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
                {locale === "en" ? plan.name_en : plan.name_ar}
              </span>
              <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                {t("perMonth")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {locale === "en"
                ? `Delivery Days: ${plan.delivery_days} days, ${plan.meals_per_day} meal${plan.meals_per_day > 1 ? "s" : ""} per day`
                : `أيام التوصيل: ${plan.delivery_days} يوم، ${plan.meals_per_day} وجبة يومياً`}
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
              <span className={originalPrice !== finalDiscountedPrice ? "line-through text-muted-foreground" : "font-medium"}>
                {originalPrice.toLocaleString()} {t("AED")}
              </span>
            </div>

            {isStudent && originalPrice !== finalDiscountedPrice && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("studentDiscount")}</span>
                  <span className="text-emerald-600 font-medium">
                    -{(originalPrice - finalDiscountedPrice).toLocaleString()} {t("AED")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="font-medium">
                    {finalDiscountedPrice.toLocaleString()} {t("AED")}
                  </span>
                </div>
              </>
            )}

            <Separator />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('vatLabel')}</span>
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

      {/* Student Status Confirmation */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">{t("studentStatusConfirmation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start">
            <Checkbox
              id="is-student"
              checked={isStudent}
              onCheckedChange={(checked: boolean) => setIsStudent(!!checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="is-student" className="ml-2 block text-sm font-medium text-gray-700">
              {t("iAmAStudentGetDiscount")}
            </label>
          </div>

          {isStudent && (
            <div className="space-y-4 ml-6 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("universityEmail")}</label>
                <Input
                  value={universityEmail}
                  onChange={(e) => setUniversityEmail(e.target.value)}
                  type="email"
                  placeholder={t("enterUniversityEmail")}
                  required={isStudent}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("studentIdExpiry")}</label>
                <Input
                  value={studentIdExpiry}
                  onChange={(e) => setStudentIdExpiry(e.target.value)}
                  type="date"
                  placeholder={t("enterStudentIdExpiry")}
                  required={isStudent}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sharjah District Selection */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">{t("sharjahDistrictConfirmation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("selectYourDistrict")}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">{t("chooseDistrict")}</option>
              {SHARJAH_DISTRICTS.map((district) => (
                <option key={district.en} value={district.en}>
                  {locale === "en" ? district.en : district.ar}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="mt-8 space-y-6">
        <h2 className="text-xl font-semibold">{t("paymentMethods")}</h2>
        
        <div className="space-y-4">
          {/* Credit Card Option */}
          <Card className="relative">
            <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center z-10">
              <div className="bg-white px-4 py-2 rounded-lg">
                <p className="text-lg font-semibold text-gray-800">{t("comingSoon")}</p>
              </div>
            </div>
            
            <CardContent className="p-6 opacity-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
                <h3 className="text-lg font-medium">{t("creditCard")}</h3>
              </div>
              
              {/* Card Logos */}
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AE</div>
              </div>
              
              {/* Card Form Fields */}
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder={t("cardNumber")}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled
                />
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder={t("expiryDate")}
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    disabled
                  />
                  <input 
                    type="text" 
                    placeholder={t("cvv")}
                    className="flex-1 p-3 border border-gray-300 rounded-lg"
                    disabled
                  />
                </div>
                <input 
                  type="text" 
                  placeholder={t("cardHolderName")}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer Option */}
          <Card className={selectedPaymentMethod === "bankTransfer" ? "border-blue-200 bg-blue-50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${selectedPaymentMethod === "bankTransfer" ? "border-blue-600 bg-blue-600" : "border-gray-400"}`}>
                  {selectedPaymentMethod === "bankTransfer" && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <h3 className="text-lg font-medium">{t("bankTransfer")}</h3>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                <h4 className="font-semibold text-blue-900 mb-3">{t("restaurantBankDetails")}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurant:</span>
                    <span className="font-medium">{t("restaurantName")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{t("city")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{t("bankName")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account #:</span>
                    <span className="font-medium font-mono">{t("accountNumber")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IBAN:</span>
                    <span className="font-medium font-mono">{t("ibanNumber")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SWIFT:</span>
                    <span className="font-medium font-mono">{t("swiftCode")}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  {t("transferInstructions")}
                </p>
              </div>
              
              <div className="space-y-3">
                <h5 className="font-medium text-blue-900">{t("uploadProof")}</h5>
                <ProofUpload planId={planId} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Actions */}
      <div className="mt-8 flex gap-3">
        <Link to="/">
          <Button variant="outline">{t("back")}</Button>
        </Link>
        <Button 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={!selectedDistrict}
          onClick={async () => {
            // Handle order submission: create subscription on backend, then navigate to success
            try {
              const body = { plan_id: planId };
              const resp = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
              });

              if (!resp.ok) {
                const txt = await resp.text().catch(() => '');
                console.error('Failed to create subscription:', resp.status, txt);
                // Keep user on page and show error via alert for now
                alert('Failed to create subscription. Please try again.');
                return;
              }

              const sub = await resp.json();
              const qp = new URLSearchParams();
              if (planId) qp.set('plan', planId);
              if (sub?.id) qp.set('subscription', sub.id);
              navigate(`/order-success?${qp.toString()}`);
            } catch (err) {
              console.error('Unexpected error creating subscription:', err);
              alert('Unexpected error creating subscription. Please try again.');
            }
          }}
        >
          {t("order")}
        </Button>
      </div>
    </main>
  );
}
