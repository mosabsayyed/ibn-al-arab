import { useI18n } from "@/context/i18n";
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MealsGallery() {
  const { t, locale } = useI18n();

  // The backend returns meals with DB fields like name_en/name_ar, description_en/description_ar, ingredients_en/ingredients_ar, nutritions_en/nutritions_ar, hero_image_url, etc.
  // Define a local API meal type to match those fields and avoid importing the shared UI type.
  type ApiMeal = {
    id: string;
    name_en?: string;
    name_ar?: string;
    description_en?: string;
    description_ar?: string;
    ingredients_en?: string;
    ingredients_ar?: string;
    nutritions_en?: string;
    nutritions_ar?: string;
    hero_image_url?: string | null;
    tags?: string[];
    allergens?: string[];
    status?: string;
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
  }

  const [meals, setMeals] = useState<ApiMeal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/meals')
        if (!res.ok) throw new Error(`Failed to fetch meals: ${res.status}`)
        const data = await res.json()
        // Store the raw API data directly - no normalization needed since we're using DB fields directly
        if (mounted) setMeals(data || [])
      } catch (err: any) {
        console.error(err)
        if (mounted) setError(err?.message || t('unknownError'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading meals...</div>
  if (error) return <div className="text-red-500">Error loading meals: {error}</div>

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
              {locale === 'en' ? (meal.name_en ?? '') : (meal.name_ar ?? '')}
            </div>
            <img
              src={meal.hero_image_url ?? "https://via.placeholder.com/400x300?text=Meal"}
              alt={locale === 'en' ? (meal.name_en ?? '') : (meal.name_ar ?? '')}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <Tabs defaultValue="description" className="w-full" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="description" className="data-[state=active]:bg-red-50 data-[state=active]:border-red-200 data-[state=active]:border-b-transparent rounded-b-none">{t("description")}</TabsTrigger>
                <TabsTrigger value="ingredients" className="data-[state=active]:bg-red-50 data-[state=active]:border-red-200 data-[state=active]:border-b-transparent rounded-b-none">{t("ingredients")}</TabsTrigger>
                <TabsTrigger value="nutrition" className="data-[state=active]:bg-red-50 data-[state=active]:border-red-200 data-[state=active]:border-b-transparent rounded-b-none">{t("nutrition")}</TabsTrigger>
              </TabsList>
                <TabsContent value="description" className="bg-red-50 border border-red-200 p-4 rounded-b-md rounded-tr-md min-h-[120px]">
                <p className="text-sm text-gray-700 mt-2">{locale === 'en' ? (meal.description_en ?? '') : (meal.description_ar ?? '')}</p>
              </TabsContent>
              <TabsContent value="ingredients" className="bg-red-50 border border-red-200 p-4 rounded-b-md rounded-tr-md min-h-[120px]">
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{locale === 'en' ? (meal.ingredients_en ?? 'No ingredients listed') : (meal.ingredients_ar ?? 'لا توجد مكونات مدرجة')}</p>
              </TabsContent>
              <TabsContent value="nutrition" className="bg-red-50 border border-red-200 p-4 rounded-b-md rounded-tr-md min-h-[120px]">
                <p className="text-sm text-gray-700 mt-2">{locale === 'en' ? (meal.nutritions_en ?? 'Nutrition information coming soon') : (meal.nutritions_ar ?? 'معلومات التغذية قريباً')}</p>
              </TabsContent>
            </Tabs>
          </article>
        ))}
      </div>
      
      {/* Stay tuned message */}
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-600">
          {t("stayTunedForMoreMeals")}{" "}
          <a 
            href="mailto:feedback_ibnalarab@miles.click?subject=New%20Meal%20Suggestion"
            className="text-red-600 hover:text-red-700 underline"
          >
            {t("here")}
          </a>
        </p>
      </div>
    </section>
  );
}
