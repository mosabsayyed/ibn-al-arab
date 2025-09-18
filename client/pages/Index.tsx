import MealPlanPreview from "@/components/sections/MealPlanPreview";
import MealsGallery from "@/components/sections/MealsGallery";
import DeliveryZoneChecker from "@/components/sections/DeliveryZoneChecker";
import StudentDiscount from "@/components/sections/StudentDiscount";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n";

export default function Index() {
  const { t, locale } = useI18n();
  return (
    <main id="top">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-50 pointer-events-none" style={{ backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2Fc88de0889c4545b98ff911f5842e062a%2Fcfe12bae1afa47e08fa23ad97e57d913)" }} />
        <div className="container py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {locale === "en"
                  ? "Healthy & Tasty. Just Like Home."
                  : "صحي ولذيذ. تماماً مثل البيت."}
              </h1>
              <p className="mt-4 text-lg max-w-prose font-semibold text-black shadow-sm">
                {locale === "en"
                  ? "Your Partner to a Healthy Academia."
                  : "شريكك لصحة أكاديمية أفضل."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#plans"><Button>{t("plans")}</Button></a>
                <a href="#gallery"><Button variant="outline">{t("mealsGallery")}</Button></a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc88de0889c4545b98ff911f5842e062a%2F9479cba51ab742e2acda504c5e2258be"
                alt="Arabic cuisine spread"
                className="rounded-xl shadow-xl object-cover w-full h-[260px] md:h-[360px]"
              />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -top-8 -right-10 h-24 w-24 rounded-full bg-amber-300/30 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="container py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">{t("plans")}</h2>
        <p className="text-muted-foreground mb-8">{locale === "en" ? "Monthly-only meal subscriptions." : "اشتراكات شهرية فقط."}</p>
        <MealPlanPreview />
      </section>

      <MealsGallery />

      <DeliveryZoneChecker />

      <StudentDiscount />
    </main>
  );
}
