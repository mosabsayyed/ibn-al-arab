import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n";
import { DeliveryCheckResponse } from "@shared/api";
import { useState } from "react";

export default function DeliveryZoneChecker() {
  const { t, locale } = useI18n();
  const [city, setCity] = useState("");
  const [result, setResult] = useState<DeliveryCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/check-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      const data = (await res.json()) as DeliveryCheckResponse;
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="delivery" className="container py-16">
      <Card>
        <CardHeader>
          <CardTitle>{t("deliveryChecker")} · {t("sharjahOnly")}</CardTitle>
          <CardDescription>
            {locale === "en" ? "Type your city. Eligibility is Sharjah-only." : "أدخل مدينتك. التوصيل للشارقة فقط."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={check} className="flex flex-col md:flex-row gap-3">
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={locale === "en" ? "Your city" : "مدينتك"} />
            <Button type="submit" disabled={loading}>{t("check")}</Button>
          </form>
          {result && (
            <div className="mt-4 text-sm">
              <div className={result.eligible ? "text-emerald-600" : "text-red-600"}>
                {result.eligible ? t("eligible") : t("notEligible")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
