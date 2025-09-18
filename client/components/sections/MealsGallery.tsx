import { useI18n } from "@/context/i18n";

const FEATURE_IMAGES = {
  kabsa: "https://cdn.builder.io/api/v1/image/assets%2Fc88de0889c4545b98ff911f5842e062a%2F9479cba51ab742e2acda504c5e2258be",
  mixedGrill: "https://cdn.builder.io/api/v1/image/assets%2Fc88de0889c4545b98ff911f5842e062a%2F94ede8ed9eb74debad47208062aa077e",
};

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1625944536655-8aa43eb6ce41?q=80&w=1200&auto=format&fit=crop",
    alt: "Falafel and fresh salad",
  },
  {
    src: "https://images.unsplash.com/photo-1604908554027-0e8d3023a1f9?q=80&w=1200&auto=format&fit=crop",
    alt: "Shakshuka in skillet",
  },
  {
    src: "https://images.unsplash.com/photo-1625944545317-352269b4015f?q=80&w=1200&auto=format&fit=crop",
    alt: "Tabbouleh parsley salad",
  },
];

export default function MealsGallery() {
  const { t } = useI18n();
  return (
    <section id="gallery" className="container py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">{t("mealsGallery")}</h2>

      {/* Custom columns collage per requested diff */}
      <div className="relative flex flex-col gap-5 md:flex-row">
        {/* Column 1 */}
        <div className="flex w-full md:w-1/5 flex-col">
          {[0, 1].map((i) => (
            <div key={i} className="mb-5">
              <img
                src={FEATURE_IMAGES.kabsa}
                alt="Kabsa rice with roasted chicken"
                className="w-[90%] h-auto object-cover transition-transform duration-150 ease-in-out rounded-lg"
              />
              <div className="relative mt-5 pr-12">
                <p className="text-sm text-foreground/90">
                  Fuel your body and mind. The high-quality protein from the tender lamb aids in muscle repair after workouts, while the healthy fats in the almonds support brain function for those long study sessions. A traditional dish that provides lasting energy...
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Column 2 */}
        <div className="flex w-full md:w-1/5">
          <img
            src={FEATURE_IMAGES.mixedGrill}
            alt="Mixed grill skewers"
            className="w-3/5 md:w-3/5 h-full object-cover rounded-lg"
          />
        </div>
        {/* Column 3 with nested halves */}
        <div className="flex w-full md:w-1/5">
          <div className="flex w-full gap-5">
            <div className="w-1/2" />
            <div className="w-1/2">
              <img
                src={FEATURE_IMAGES.mixedGrill}
                alt="Mixed grill skewers"
                className="w-full aspect-[3/2] object-cover rounded-lg mt-5"
              />
            </div>
          </div>
        </div>
        {/* Optional empty columns to preserve spacing */}
        <div className="hidden md:block md:w-1/5" />
        <div className="hidden md:block md:w-1/5" />
      </div>

      {/* Standard responsive grid below */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {IMAGES.map((img) => (
          <div key={img.src} className="overflow-hidden rounded-lg">
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
