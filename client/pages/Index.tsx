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
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/60 to-transparent pointer-events-none" />
        <div className="container py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {locale === "en"
                  ? "Arabic cuisine, cloud-delivered."
                  : "مأكولات عربية تصل إليك سحابياً"}
              </h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-prose">
                {locale === "en"
                  ? "We’re an Arabic Cuisine restaurant serving traditional dishes. Cloud-based. We exclusively offer monthly meal subscriptions."
                  : "نحن مطعم للمأكولات العربية التقليدية، سحابي بالكامل. نقدم اشتراكات شهرية للوجبات فقط."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#plans"><Button>{t("plans")}</Button></a>
                <a href="#gallery"><Button variant="outline">{t("mealsGallery")}</Button></a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop"
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
