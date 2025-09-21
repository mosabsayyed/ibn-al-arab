export type MealLocal = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  category?: string;
  price?: number;
};

export const mealsLocal: MealLocal[] = [
  {
    id: 'ml-1',
    title: 'Spinach & Feta Omelette',
    description: 'Fluffy omelette with spinach and feta.',
    image: '/placeholder.svg',
    category: 'Breakfast',
    price: 6.5,
  },
  {
    id: 'ml-2',
    title: 'Chicken Shawarma Bowl',
    description: 'Marinated chicken, rice, pickles, and garlic sauce.',
    image: '/placeholder.svg',
    category: 'Lunch',
    price: 9.0,
  },
  {
    id: 'ml-3',
    title: 'Grilled Salmon & Veggies',
    description: 'Oven-grilled salmon with seasonal vegetables.',
    image: '/placeholder.svg',
    category: 'Dinner',
    price: 12.5,
  },
];
