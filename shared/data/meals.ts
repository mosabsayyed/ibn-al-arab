// Clean meals dataset for Ibn Al Arab application
export interface Meal {
  id: string;
  name: { en: string; ar: string };
  description?: { en: string; ar: string };
  ingredients?: { en: string; ar: string };
  nutritionData?: { en: string; ar: string };
  image?: string;
}

export const meals: Meal[] = [
  {
    id: 'm1',
    name: { en: 'Mansaf', ar: 'منسف' },
    description: {
      en: 'Traditional Jordanian dish with tender lamb and aromatic rice.',
      ar: 'طبق أردني تقليدي مع لحم الضأن الطري والأرز العطر.',
    },
    ingredients: {
      en: 'Lamb, Rice, Yogurt Sauce, Almonds, Parsley',
      ar: 'لحم ضأن، أرز، صوص لبن، لوز، بقدونس',
    },
    nutritionData: {
      en: 'Calories: 850, Protein: 45g, Carbs: 65g, Fat: 28g',
      ar: 'السعرات الحرارية: 850، البروتين: 45 جرام، الكربوهيدرات: 65 جرام، الدهون: 28 جرام',
    },
    image: '/mansaf.png',
  },
  {
    id: 'm2',
    name: { en: 'Grilled Chicken Breast', ar: 'صدر دجاج مشوي' },
    description: {
      en: 'Juicy grilled chicken breast with herbs and spices.',
      ar: 'صدر دجاج مشوي وعصيري مع الأعشاب والتوابل.',
    },
    ingredients: {
      en: 'Chicken Breast, Herbs, Spices, Olive Oil',
      ar: 'صدر دجاج، أعشاب، بهارات، زيت زيتون',
    },
    nutritionData: {
      en: 'Calories: 350, Protein: 40g, Carbs: 5g, Fat: 18g',
      ar: 'السعرات الحرارية: 350، البروتين: 40 جرام، الكربوهيدرات: 5 جرام، الدهون: 18 جرام',
    },
    image: '/Grilled Chicken Breast.png',
  },
  {
    id: 'm3',
    name: { en: 'Grilled Steak', ar: 'ستيك مشوي' },
    description: {
      en: 'Tender grilled steak cooked to perfection.',
      ar: 'ستيك مشوي طري مطبوخ بإتقان.',
    },
    ingredients: {
      en: 'Beef Steak, Salt, Pepper, Garlic, Rosemary',
      ar: 'ستيك لحم بقري، ملح، فلفل، ثوم، إكليل الجبل',
    },
    nutritionData: {
      en: 'Calories: 600, Protein: 50g, Carbs: 0g, Fat: 45g',
      ar: 'السعرات الحرارية: 600، البروتين: 50 جرام، الكربوهيدرات: 0 جرام، الدهون: 45 جرام',
    },
    image: '/Steak.png',
  },
  {
    id: 'm4',
    name: { en: 'Roasted Half Chicken', ar: 'نصف دجاجة مشوية' },
    description: {
      en: 'Slow-roasted half chicken with crispy skin and tender meat.',
      ar: 'نصف دجاجة مشوية ببطء مع جلد مقرمش ولحم طري.',
    },
    ingredients: {
      en: 'Half Chicken, Paprika, Cumin, Garlic Powder, Onion Powder',
      ar: 'نصف دجاجة، بابريكا، كمون، مسحوق الثوم، مسحوق البصل',
    },
    nutritionData: {
      en: 'Calories: 700, Protein: 60g, Carbs: 10g, Fat: 45g',
      ar: 'السعرات الحرارية: 700، البروتين: 60 جرام، الكربوهيدرات: 10 جرام، الدهون: 45 جرام',
    },
    image: '/Roasted Half Chicken.png',
  },
  {
    id: 'm5',
    name: { en: 'Oozi', ar: 'أوزي' },
    description: {
      en: 'Delicious rice dish with mixed nuts and tender meat.',
      ar: 'طبق أرز لذيذ مع المكسرات المشكلة واللحم الطري.',
    },
    ingredients: {
      en: 'Rice, Mixed Nuts, Lamb/Beef, Spices',
      ar: 'أرز، مكسرات مشكلة، لحم ضأن/بقري، بهارات',
    },
    nutritionData: {
      en: 'Calories: 750, Protein: 40g, Carbs: 70g, Fat: 30g',
      ar: 'السعرات الحرارية: 750، البروتين: 40 جرام، الكربوهيدرات: 70 جرام، الدهون: 30 جرام',
    },
    image: '/Oozi.png',
  },
  {
    id: 'm6',
    name: { en: 'Mexican Chicken', ar: 'دجاج مكسيكي' },
    description: {
      en: 'Spicy Mexican chicken with bell peppers and onions.',
      ar: 'دجاج مكسيكي حار مع الفلفل والبصل.',
    },
    ingredients: {
      en: 'Chicken, Bell Peppers, Onions, Mexican Spices',
      ar: 'دجاج، فلفل، بصل، بهارات مكسيكية',
    },
    nutritionData: {
      en: 'Calories: 400, Protein: 35g, Carbs: 20g, Fat: 20g',
      ar: 'السعرات الحرارية: 400، البروتين: 35 جرام، الكربوهيدرات: 20 جرام، الدهون: 20 جرام',
    },
    image: '/MexicanChicken.png',
  },
  {
    id: 'm7',
    name: { en: 'Beef Slices', ar: 'شرائح لحم بقري' },
    description: {
      en: 'Thinly sliced beef cooked with savory sauce.',
      ar: 'شرائح لحم بقري رفيعة مطبوخة بصلصة لذيذة.',
    },
    ingredients: {
      en: 'Beef Slices, Soy Sauce, Ginger, Garlic, Vegetables',
      ar: 'شرائح لحم بقري، صلصة الصويا، زنجبيل، ثوم، خضروات',
    },
    nutritionData: {
      en: 'Calories: 550, Protein: 40g, Carbs: 15g, Fat: 35g',
      ar: 'السعرات الحرارية: 550، البروتين: 40 جرام، الكربوهيدرات: 15 جرام، الدهون: 35 جرام',
    },
    image: '/Beef Slices.png',
  },
  {
    id: 'm8',
    name: { en: 'Chicken Kabsa', ar: 'كبسة دجاج' },
    description: {
      en: 'Aromatic rice dish with tender chicken and spices.',
      ar: 'طبق أرز عطري مع دجاج طري وبهارات.',
    },
    ingredients: {
      en: 'Chicken, Basmati Rice, Tomatoes, Onions, Kabsa Spices',
      ar: 'دجاج، أرز بسمتي، طماطم، بصل، بهارات كبسة',
    },
    nutritionData: {
      en: 'Calories: 650, Protein: 40g, Carbs: 70g, Fat: 25g',
      ar: 'السعرات الحرارية: 650، البروتين: 40 جرام، الكربوهيدرات: 70 جرام، الدهون: 25 جرام',
    },
    image: '/ChickenKabsa.png',
  },
  {
    id: 'm9',
    name: { en: 'Stuffed Eggplant', ar: 'باذنجان محشي' },
    description: {
      en: 'Eggplant stuffed with seasoned rice and minced meat.',
      ar: 'باذنجان محشي بالأرز المتبل واللحم المفروم.',
    },
    ingredients: {
      en: 'Eggplant, Rice, Minced Meat, Tomatoes, Herbs, Spices',
      ar: 'باذنجان، أرز، لحم مفروم، طماطم، أعشاب، بهارات',
    },
    nutritionData: {
      en: 'Calories: 400, Protein: 20g, Carbs: 45g, Fat: 18g',
      ar: 'السعرات الحرارية: 400، البروتين: 20 جرام، الكربوهيدرات: 45 جرام، الدهون: 18 جرام',
    },
    image: '/Stuffed Eggplant.png',
  },
];
