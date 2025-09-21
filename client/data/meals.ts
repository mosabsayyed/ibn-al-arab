export interface Meal {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  ingredients: {
    en: string;
    ar: string;
  };
  nutritionData: {
    en: string;
    ar: string;
  };
  image?: string;
}

export const meals: Meal[] = [
  {
    id: 'm1',
    name: {
      en: 'Spinach & Feta Omelette',
      ar: 'عجة السبانخ والفيتا',
    },
    description: {
      en: 'Fluffy omelette with spinach, feta, and cherry tomatoes.',
      ar: 'عجة خفيفة مع السبانخ والفيتا والطماطم الكرزية.',
    },
    ingredients: {
      en: 'Eggs, spinach, feta cheese, cherry tomatoes, olive oil, salt, pepper.',
      ar: 'بيض، سبانخ، جبنة فيتا، طماطم كرزية، زيت زيتون، ملح، فلفل.',
    },
    nutritionData: {
      en: 'Calories: 250, Protein: 15g, Carbs: 5g, Fat: 18g',
      ar: 'السعرات الحرارية: 250، البروتين: 15 جرام، الكربوهيدرات: 5 جرام، الدهون: 18 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm2',
    name: {
      en: 'Chicken Shawarma Bowl',
      ar: 'وعاء شاورما دجاج',
    },
    description: {
      en: 'Marinated chicken, rice, pickles, and garlic sauce.',
      ar: 'دجاج متبل، أرز، مخلل، وصلصة ثوم.',
    },
    ingredients: {
      en: 'Chicken, basmati rice, pickles, garlic sauce, lettuce, tomatoes.',
      ar: 'دجاج، أرز بسمتي، مخلل، صلصة ثوم، خس، طماطم.',
    },
    nutritionData: {
      en: 'Calories: 450, Protein: 30g, Carbs: 40g, Fat: 20g',
      ar: 'السعرات الحرارية: 450، البروتين: 30 جرام، الكربوهيدرات: 40 جرام، الدهون: 20 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm3',
    name: {
      en: 'Grilled Salmon & Veggies',
      ar: 'سلمون مشوي وخضروات',
    },
    description: {
      en: 'Oven-grilled salmon with seasonal vegetables.',
      ar: 'سلمون مشوي بالفرن مع خضروات موسمية.',
    },
    ingredients: {
      en: 'Salmon fillet, broccoli, carrots, bell peppers, olive oil, lemon, herbs.',
      ar: 'فيليه سلمون، بروكلي، جزر، فلفل رومي، زيت زيتون، ليمون، أعشاب.',
    },
    nutritionData: {
      en: 'Calories: 380, Protein: 28g, Carbs: 15g, Fat: 25g',
      ar: 'السعرات الحرارية: 380، البروتين: 28 جرام، الكربوهيدرات: 15 جرام، الدهون: 25 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm4',
    name: {
      en: 'Hummus & Pita Snack',
      ar: 'وجبة خفيفة من الحمص والبيتا',
    },
    description: {
      en: 'Creamy hummus served with warm pita and olives.',
      ar: 'حمص كريمي يقدم مع بيتا دافئة وزيتون.',
    },
    ingredients: {
      en: 'Chickpeas, tahini, lemon juice, garlic, pita bread, olives.',
      ar: 'حمص، طحينة، عصير ليمون، ثوم، خبز بيتا، زيتون.',
    },
    nutritionData: {
      en: 'Calories: 300, Protein: 10g, Carbs: 35g, Fat: 15g',
      ar: 'السعرات الحرارية: 300، البروتين: 10 جرام، الكربوهيدرات: 35 جرام، الدهون: 15 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm5',
    name: {
      en: 'Vegetable Stir-fry',
      ar: 'خضروات سوتيه',
    },
    description: {
      en: 'Assorted fresh vegetables stir-fried in a light soy sauce.',
      ar: 'خضروات طازجة متنوعة مقلية بصلصة الصويا الخفيفة.',
    },
    ingredients: {
      en: 'Broccoli, carrots, bell peppers, snap peas, soy sauce, ginger, garlic.',
      ar: 'بروكلي، جزر، فلفل رومي، بازلاء، صلصة صويا، زنجبيل، ثوم.',
    },
    nutritionData: {
      en: 'Calories: 200, Protein: 8g, Carbs: 25g, Fat: 8g',
      ar: 'السعرات الحرارية: 200، البروتين: 8 جرام، الكربوهيدرات: 25 جرام، الدهون: 8 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm6',
    name: {
      en: 'Beef and Broccoli',
      ar: 'لحم بقر وبروكلي',
    },
    description: {
      en: 'Tender beef slices with fresh broccoli in a savory sauce.',
      ar: 'شرائح لحم بقر طرية مع بروكلي طازج بصلصة لذيذة.',
    },
    ingredients: {
      en: 'Beef, broccoli, soy sauce, oyster sauce, ginger, garlic, cornstarch.',
      ar: 'لحم بقر، بروكلي، صلصة صويا، صلصة محار، زنجبيل، ثوم، نشا الذرة.',
    },
    nutritionData: {
      en: 'Calories: 500, Protein: 35g, Carbs: 30g, Fat: 28g',
      ar: 'السعرات الحرارية: 500، البروتين: 35 جرام، الكربوهيدرات: 30 جرام، الدهون: 28 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm7',
    name: {
      en: 'Fruit Salad',
      ar: 'سلطة فواكه',
    },
    description: {
      en: 'A refreshing mix of seasonal fresh fruits.',
      ar: 'مزيج منعش من الفواكه الطازجة الموسمية.',
    },
    ingredients: {
      en: 'Seasonal fruits (e.g., strawberries, blueberries, grapes, melon).',
      ar: 'فواكه موسمية (مثل الفراولة، التوت الأزرق، العنب، الشمام).',
    },
    nutritionData: {
      en: 'Calories: 150, Protein: 2g, Carbs: 35g, Fat: 1g',
      ar: 'السعرات الحرارية: 150، البروتين: 2 جرام، الكربوهيدرات: 35 جرام، الدهون: 1 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm8',
    name: {
      en: 'Lentil Soup',
      ar: 'شوربة عدس',
    },
    description: {
      en: 'Hearty and nutritious lentil soup, perfect for a light meal.',
      ar: 'شوربة عدس دسمة ومغذية، مثالية لوجبة خفيفة.',
    },
    ingredients: {
      en: 'Lentils, carrots, celery, onions, vegetable broth, spices.',
      ar: 'عدس، جزر، كرفس، بصل، مرقة خضار، بهارات.',
    },
    nutritionData: {
      en: 'Calories: 180, Protein: 12g, Carbs: 25g, Fat: 4g',
      ar: 'السعرات الحرارية: 180، البروتين: 12 جرام، الكربوهيدرات: 25 جرام، الدهون: 4 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm9',
    name: {
      en: 'Vegetarian Pizza',
      ar: 'بيتزا خضروات',
    },
    description: {
      en: 'Delicious pizza topped with fresh vegetables and mozzarella.',
      ar: 'بيتزا لذيذة مغطاة بالخضروات الطازجة والموزاريلا.',
    },
    ingredients: {
      en: 'Pizza dough, tomato sauce, mozzarella, bell peppers, onions, mushrooms, olives.',
      ar: 'عجينة بيتزا، صلصة طماطم، موزاريلا، فلفل رومي، بصل، فطر، زيتون.',
    },
    nutritionData: {
      en: 'Calories: 600, Protein: 25g, Carbs: 70g, Fat: 25g',
      ar: 'السعرات الحرارية: 600، البروتين: 25 جرام، الكربوهربوهيدرات: 70 جرام، الدهون: 25 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm10',
    name: {
      en: 'Greek Yogurt with Berries',
      ar: 'زبادي يوناني مع توت',
    },
    description: {
      en: 'Creamy Greek yogurt with a mix of fresh berries and a drizzle of honey.',
      ar: 'زبادي يوناني كريمي مع مزيج من التوت الطازج ورشة عسل.',
    },
    ingredients: {
      en: 'Greek yogurt, mixed berries, honey.',
      ar: 'زبادي يوناني، توت مشكل، عسل.',
    },
    nutritionData: {
      en: 'Calories: 180, Protein: 15g, Carbs: 20g, Fat: 5g',
      ar: 'السعرات الحرارية: 180، البروتين: 15 جرام، الكربوهيدرات: 20 جرام، الدهون: 5 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm11',
    name: {
      en: 'Tuna Salad Sandwich',
      ar: 'ساندويتش سلطة التونة',
    },
    description: {
      en: 'Classic tuna salad sandwich on whole wheat bread with lettuce and tomato.',
      ar: 'ساندويتش سلطة التونة الكلاسيكي على خبز القمح الكامل مع الخس والطماطم.',
    },
    ingredients: {
      en: 'Tuna, mayonnaise, celery, whole wheat bread, lettuce, tomato.',
      ar: 'تونة، مايونيز، كرفس، خبز قمح كامل، خس، طماطم.',
    },
    nutritionData: {
      en: 'Calories: 350, Protein: 20g, Carbs: 30g, Fat: 18g',
      ar: 'السعرات الحرارية: 350، البروتين: 20 جرام، الكربوهيدرات: 30 جرام، الدهون: 18 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm12',
    name: {
      en: 'Pasta Primavera',
      ar: 'باستا بريمافيرا',
    },
    description: {
      en: 'Pasta with fresh spring vegetables in a light garlic and olive oil sauce.',
      ar: 'باستا مع خضروات الربيع الطازجة بصلصة خفيفة من الثوم وزيت الزيتون.',
    },
    ingredients: {
      en: 'Pasta, zucchini, bell peppers, cherry tomatoes, garlic, olive oil, parmesan.',
      ar: 'باستا، كوسة، فلفل رومي، طماطم كرزية، ثوم، زيت زيتون، بارميزان.',
    },
    nutritionData: {
      en: 'Calories: 420, Protein: 15g, Carbs: 50g, Fat: 20g',
      ar: 'السعرات الحرارية: 420، البروتين: 15 جرام، الكربوهيدرات: 50 جرام، الدهون: 20 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm13',
    name: {
      en: 'Oatmeal with Fruits',
      ar: 'شوفان بالفواكه',
    },
    description: {
      en: 'Warm oatmeal topped with fresh fruits and nuts.',
      ar: 'شوفان دافئ مغطى بالفواكه الطازجة والمكسرات.',
    },
    ingredients: {
      en: 'Oats, milk, mixed berries, banana, walnuts, honey.',
      ar: 'شوفان، حليب، توت مشكل، موز، جوز، عسل.',
    },
    nutritionData: {
      en: 'Calories: 280, Protein: 10g, Carbs: 45g, Fat: 8g',
      ar: 'السعرات الحرارية: 280، البروتين: 10 جرام، الكربوهيدرات: 45 جرام، الدهون: 8 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm14',
    name: {
      en: 'Quinoa Salad',
      ar: 'سلطة الكينوا',
    },
    description: {
      en: 'Healthy quinoa salad with cucumber, tomatoes, and a lemon-herb dressing.',
      ar: 'سلطة كينوا صحية مع خيار، طماطم، وصلصة الليمون والأعشاب.',
    },
    ingredients: {
      en: 'Quinoa, cucumber, cherry tomatoes, parsley, mint, lemon juice, olive oil.',
      ar: 'كينوا، خيار، طماطم كرزية، بقدونس، نعناع، عصير ليمون، زيت زيتون.',
    },
    nutritionData: {
      en: 'Calories: 220, Protein: 8g, Carbs: 30g, Fat: 10g',
      ar: 'السعرات الحرارية: 220، البروتين: 8 جرام، الكربوهيدرات: 30 جرام، الدهون: 10 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm15',
    name: {
      en: 'Chicken and Vegetable Skewers',
      ar: 'أسياخ دجاج وخضروات',
    },
    description: {
      en: 'Grilled chicken and colorful vegetables on skewers, seasoned to perfection.',
      ar: 'دجاج مشوي وخضروات ملونة على أسياخ، متبلة بإتقان.',
    },
    ingredients: {
      en: 'Chicken breast, bell peppers, onions, zucchini, olive oil, paprika, cumin.',
      ar: 'صدر دجاج، فلفل رومي، بصل، كوسة، زيت زيتون، بابريكا، كمون.',
    },
    nutritionData: {
      en: 'Calories: 300, Protein: 25g, Carbs: 15g, Fat: 15g',
      ar: 'السعرات الحرارية: 300، البروتين: 25 جرام، الكربوهيدرات: 15 جرام، الدهون: 15 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm16',
    name: {
      en: 'Smoothie Bowl',
      ar: 'وعاء سموثي',
    },
    description: {
      en: 'Thick and creamy smoothie bowl topped with granola and fresh fruits.',
      ar: 'وعاء سموثي سميك وكريمي مغطى بالجرانولا والفواكه الطازجة.',
    },
    ingredients: {
      en: 'Frozen berries, banana, almond milk, granola, chia seeds.',
      ar: 'توت مجمد، موز، حليب لوز، جرانولا، بذور الشيا.',
    },
    nutritionData: {
      en: 'Calories: 280, Protein: 8g, Carbs: 40g, Fat: 10g',
      ar: 'السعرات الحرارية: 280، البروتين: 8 جرام، الكربوهيدرات: 40 جرام، الدهون: 10 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm17',
    name: {
      en: 'Turkey and Cheese Wrap',
      ar: 'راب ديك رومي وجبن',
    },
    description: {
      en: 'Whole wheat wrap filled with sliced turkey, cheese, lettuce, and tomato.',
      ar: 'راب قمح كامل محشو بشرائح الديك الرومي والجبن والخس والطماطم.',
    },
    ingredients: {
      en: 'Whole wheat tortilla, turkey slices, cheddar cheese, lettuce, tomato, mustard.',
      ar: 'خبز تورتيلا قمح كامل، شرائح ديك رومي، جبنة شيدر، خس، طماطم، خردل.',
    },
    nutritionData: {
      en: 'Calories: 320, Protein: 22g, Carbs: 25g, Fat: 15g',
      ar: 'السعرات الحرارية: 320، البروتين: 22 جرام، الكربوهيدرات: 25 جرام، الدهون: 15 جرام',
    },
    image: '/placeholder.svg',
  },
  {
    id: 'm18',
    name: {
      en: 'Baked Cod with Asparagus',
      ar: 'سمك القد المخبوز مع الهليون',
    },
    description: {
      en: 'Flaky baked cod served with tender asparagus and a lemon-butter sauce.',
      ar: 'سمك القد المخبوز يقدم مع الهليون الطري وصلصة الليمون والزبدة.',
    },
    ingredients: {
      en: 'Cod fillet, asparagus, lemon, butter, garlic, parsley.',
      ar: 'فيليه سمك القد، هليون، ليمون، زبدة، ثوم، بقدونس.',
    },
    nutritionData: {
      en: 'Calories: 280, Protein: 25g, Carbs: 10g, Fat: 15g',
      ar: 'السعرات الحرارية: 280، البروتين: 25 جرام، الكربوهيدرات: 10 جرام، الدهون: 15 جرام',
    },
    image: '/placeholder.svg',
  },
];
