import React, { useMemo, useState } from 'react';
import { mealsLocal, type MealLocal } from '@/data/meals.local';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/context/i18n'; // Import useI18n

export default function MealsGalleryClean() {
  const { locale } = useI18n(); // Destructure locale from useI18n
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo<string[]>(() => { // Explicitly type as string[]
    const cats = Array.from(new Set(mealsLocal.map((m) => m.category ?? 'Uncategorized')));
    return ['All', ...cats];
  }, []);

  const filtered = useMemo(() => {
    if (category === 'All') return mealsLocal;
    return mealsLocal.filter((m) => (m.category ?? 'Uncategorized') === category);
  }, [category]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Button key={c} variant={c === category ? 'secondary' : 'ghost'} size="sm" onClick={() => setCategory(c)}>
            {c}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m: MealLocal) => (
          <article key={m.id} className="rounded-lg border p-4 shadow-sm">
            <div className="h-40 w-full bg-gray-50 rounded overflow-hidden flex items-center justify-center">
              <img src={m.image ?? '/placeholder.svg'} alt={m.title} className="object-cover h-full w-full" />
            </div>
            <header className="mt-3 flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <span className="text-sm text-muted-foreground">{m.price ? `${m.price} AED` : ''}</span>
            </header>
            <p className="mt-2 text-sm text-muted-foreground">{m.description[locale]}</p>
            <div className="mt-4 flex items-center gap-2">
              <Button onClick={() => (window.location.href = `/meal/${m.id}`)}>View</Button>
              <Button variant="outline" onClick={() => (window.location.href = `/checkout?meal=${m.id}`)}>Order</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
