import { useI18n } from "@/context/i18n";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?q=80&w=1200&auto=format&fit=crop",
    alt: "Kabsa rice with roasted chicken",
  },
  {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    alt: "Hummus with olive oil and paprika",
  },
  {
    src: "https://images.unsplash.com/photo-1617195737497-7b5652a28f2d?q=80&w=1200&auto=format&fit=crop",
    alt: "Mixed grill skewers",
  },
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {IMAGES.map((img) => (
          <div key={img.src} className="overflow-hidden rounded-lg">
            <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition-transform hover:scale-105" />
          </div>
        ))}
      </div>
    </section>
  );
}
