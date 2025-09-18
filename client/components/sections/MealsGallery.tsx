import { useI18n } from "@/context/i18n";

export default function MealsGallery() {
  const { t } = useI18n();

  const rows = 6;
  const cols = 3;
  const total = rows * cols;

  const placeholder = {
    src: "https://cdn.builder.io/api/v1/image/assets%2Fc88de0889c4545b98ff911f5842e062a%2F9479cba51ab742e2acda504c5e2258be",
    alt: "Kabsa rice with roasted chicken",
    text: "Fuel your body and mind. The high-quality protein from the tender lamb aids in muscle repair after workouts, while the healthy fats in the almonds support brain function for those long study sessions. A traditional dish that provides lasting energy...",
  };

  return (
    <section id="gallery" className="container py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
        {t("mealsGallery")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: total }).map((_, i) => (
          <figure key={i} className="rounded-lg overflow-hidden">
            <img
              src={placeholder.src}
              alt={placeholder.alt}
              className="w-full aspect-[4/3] object-cover rounded-lg transition-transform duration-150 ease-in-out hover:scale-[1.02]"
            />
            <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {placeholder.text}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
