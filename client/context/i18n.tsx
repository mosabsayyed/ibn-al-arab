import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    plans: 'Plans',
    mealsGallery: 'Meals Gallery',
    monthlyPlans: 'Monthly Plans',
    brand: 'Ibn Al Arab',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    description: 'Description',
    ingredients: 'Ingredients',
    nutrition: 'Nutrition Data',
    deliveryChecker: 'Delivery Checker',
    studentDiscount: 'Student Discount',
    tagline: 'Your Partner to a Healthy Academia.',
    healthyTastyHome: 'Healthy & Tasty. Just Like Home.',
    monthlySubscriptionTagline: 'Monthly-only meal subscriptions.',
    perMonth: 'per month',
    AED: 'AED',
    sharjahOnly: 'Sharjah Only',
    check: 'Check',
    eligible: 'Eligible for delivery!',
    notEligible: 'Not eligible for delivery.',
    deliveryCheckerDescription: 'Type your city. Eligibility is Sharjah-only.',
    yourCity: 'Your city',
    email: 'Email',
    expiry: 'Expiry Date',
    validate: 'Validate',
    studentDiscountDescription: 'Academic email required and unexpired ID.',
    validDiscount: (discountPercent: number) => `Valid. Discount ~${discountPercent}% applied at checkout.`,
    invalidReason: 'Invalid. Please check your details.',
    subscribe: 'Subscribe',
    specialStudentDiscount: 'Special Student Discount',
    checkout: 'Checkout',
    completeYourSubscription: 'Complete your subscription',
    pricingBreakdown: 'Pricing Breakdown',
    originalPrice: 'Original Price',
    discountAmount: 'Discount Amount',
    subtotal: 'Subtotal',
    total: 'Total',
    paymentNote: 'Complete the payment by integrating a real gateway (Netlify/Vercel envs + provider SDK).',
    back: 'Back',
    payNow: 'Pay Now',
  },
  ar: {
    plans: 'الخطط',
    mealsGallery: 'معرض الوجبات',
    monthlyPlans: 'الخطط الشهرية',
    brand: 'ابن العرب',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    description: 'الوصف',
    ingredients: 'المكونات',
    nutrition: 'البيانات الغذائية',
    deliveryChecker: 'التحقق من التوصيل',
    studentDiscount: 'خصم الطلاب',
    tagline: 'شريكك لحياة أكاديمية صحية.',
    healthyTastyHome: 'صحي ولذيذ. تماماً مثل البيت.',
    monthlySubscriptionTagline: 'اشتراكات شهرية مخصمة لاحتياجاتك',
    perMonth: 'شهريا',
    AED: 'د.أ.',
    sharjahOnly: 'الشارقة فقط',
    check: 'تحقق',
    eligible: 'مؤهل للتوصيل!',
    notEligible: 'غير مؤهل للتوصيل.',
    deliveryCheckerDescription: 'أدخل مدينتك. التوصيل للشارقة فقط.',
    yourCity: 'مدينتك',
    email: 'البريد الإلكتروني',
    expiry: 'تاريخ الانتهاء',
    validate: 'تحقق',
    studentDiscountDescription: 'يلزم بريد جامعي وهوية غير منتهية.',
    validDiscount: (discountPercent: number) => `صالح. سيتم تطبيق خصم ~${discountPercent}% عند الدفع.`,
    invalidReason: 'غير صالح. يرجى التحقق من التفاصيل.',
    subscribe: 'اشترك',
    specialStudentDiscount: 'خصم خاص للطلاب',
    checkout: 'الدفع',
    completeYourSubscription: 'أكمل اشتراكك',
    pricingBreakdown: 'تفصيل التسعير',
    originalPrice: 'السعر الأصلي',
    discountAmount: 'مبلغ الخصم',
    subtotal: 'المجموع الفرعي',
    total: 'المجموع',
    paymentNote: 'أكمل الدفع من خلال دمج بوابة دفع حقيقية (Netlify/Vercel envs + provider SDK).',
    back: 'العودة',
    payNow: 'ادفع الآن',
  },
};

type Locale = 'en' | 'ar';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, ...args: any[]) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (localStorage.getItem('locale') as Locale) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string, ...args: any[]) => {
    // @ts-ignore
    const translation = translations[locale][key];
    if (typeof translation === 'function') {
      return translation(...args);
    }
    return translation || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
