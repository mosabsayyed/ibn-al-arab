import { useI18n } from "@/context/i18n";
import { meals } from "@shared/data/meals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MealsGallery() {
  const { t, locale } = useI18n();

  return (
    <section id="gallery" className="container py-16">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">{t("mealsGallery")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {meals.map((meal, i) => (
          <article
            key={i}
            className="rounded-lg overflow-hidden border bg-white shadow-sm p-4 flex flex-col items-center"
          >
            <div className="font-extrabold text-center mb-2 text-xl" style={{ color: "#dc2626" }}>
              {meal.name[locale]}
            </div>
            <img
              src={meal.image || "https://via.placeholder.com/400x300?text=Meal"}
              alt={meal.name[locale]}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <Tabs defaultValue="description" className="w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="description" className="data-[state=active]:bg-red-50 data-[state=active]:border-red-200 data-[state=active]:border-b-transparent rounded-b-none">{t("description")}</TabsTrigger>
                <TabsTrigger value="ingredients" className="data-[state=active]:bg-red-50 data-[state=active]:border-red-200 data-[state=active]:border-b-transparent rounded-b-none">{t("ingredients")}</TabsTrigger>
                <TabsTrigger value="nutrition" className="data-[state=active]:bg-red-50 data-[state=active]:border-red-200 data-[state=active]:border-b-transparent rounded-b-none">{t("nutrition")}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="bg-red-50 border border-red-200 p-4 rounded-b-md rounded-tr-md min-h-[120px]">
                <p className="text-sm text-gray-700 mt-2">{meal.description[locale]}</p>
              </TabsContent>
              <TabsContent value="ingredients" className="bg-red-50 border border-red-200 p-4 rounded-b-md rounded-tr-md min-h-[120px]">
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{meal.ingredients[locale]}</p>
              </TabsContent>
              <TabsContent value="nutrition" className="bg-red-50 border border-red-200 p-4 rounded-b-md rounded-tr-md min-h-[120px]">
                <p className="text-sm text-gray-700 mt-2">{meal.nutritionData[locale]}</p>
              </TabsContent>
            </Tabs>
          </article>
        ))}
      </div>
    </section>
  );
}
