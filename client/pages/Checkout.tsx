import { useSearchParams, Link } from "react-router-dom";
import { useI18n } from "@/context/i18n";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const [params] = useSearchParams();
  const { locale } = useI18n();
  const plan = params.get("plan") ?? "";

  const planLabel: Record<string, { en: string; ar: string }> = {
    flex: { en: "Flex", ar: "تقوية" },
    focus: { en: "Focus", ar: "تركيز" },
    fuel: { en: "Fuel", ar: "تغذية" },
  };

  return (
    <main className="container py-16">
      <h1 className="text-3xl font-extrabold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-6">
        This is a mock checkout page for demo purposes.
      </p>
      <div className="rounded-lg border p-6 space-y-3">
        <div className="text-lg">
          Plan:{" "}
          <span className="font-semibold">
            {planLabel[plan]?.[locale === "ar" ? "ar" : "en"] ?? plan}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete the payment by integrating a real gateway (Netlify/Vercel
          envs + provider SDK).
        </p>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline">Back</Button>
          </Link>
          <Button>Pay now (demo)</Button>
        </div>
      </div>
    </main>
  );
}
