import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n";
import { StudentValidateResponse } from "@shared/api";
import { useState } from "react";

export default function StudentDiscount() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [expiry, setExpiry] = useState("");
  const [result, setResult] = useState<StudentValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/validate-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, expiryISO: expiry }),
      });
      const data = (await res.json()) as StudentValidateResponse;
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-16">
      <Card>
        <CardHeader>
          <CardTitle>{t("studentDiscount")}</CardTitle>
          <CardDescription>
            {locale === "en"
              ? "Academic email required and unexpired ID."
              : "يلزم بريد جامعي وهوية غير منتهية."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={validate} className="grid gap-3 md:grid-cols-3">
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email")}
            />
            <Input
              required
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder={t("expiry")}
            />
            <Button type="submit" disabled={loading}>
              {t("validate")}
            </Button>
          </form>
          {result && (
            <div className="mt-4 text-sm">
              {result.valid ? (
                <div className="text-emerald-600">
                  {locale === "en"
                    ? `Valid. Discount ~${result.discountPercent}% applied at checkout.`
                    : `صالح. سيت�� تطبيق خصم ~${result.discountPercent}% عند الدفع.`}
                </div>
              ) : (
                <div className="text-red-600">{result.reason}</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
