import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "en" | "ar";

type Dict = Record<string, string>;

type I18nContextValue = {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (l: Locale) => void;
};

const STRINGS: Record<Locale, Dict> = {
  en: {
    brand: "Ibn Al Arab",
    tagline: "Cloud-based Arabic cuisine. Monthly meal subscriptions only.",
    mealPlanPreview: "Meal Plan Preview",
    mealsGallery: "Meals Gallery",
    plans: "Plans",
    monthlyPlans: "Monthly Plans",
    flex: "Flex",
    focus: "Focus",
    fuel: "Fuel",
    deliveryChecker: "Delivery Zone Checker",
    sharjahOnly: "Sharjah-only",
    check: "Check",
    eligible: "We deliver to your location.",
    notEligible: "We currently deliver only within Sharjah.",
    studentDiscount: "Student Discount Validation",
    email: "Student Email",
    expiry: "Expiry Date",
    validate: "Validate",
    login: "Login",
    register: "Register",
    logout: "Logout",
    subscribe: "Subscribe",
    perMonth: "/month",
  },
  ar: {
    brand: "ابن العرب",
    tagline: "مطعم سحابي للمأكولات العربية. اشتراكات شهرية فقط.",
    mealPlanPreview: "نظرة عامة على الوجبات",
    mealsGallery: "معرض الو��بات",
    plans: "الباقات",
    monthlyPlans: "الباقات الشهرية",
    flex: "تقوية",
    focus: "تركيز",
    fuel: "تغذية",
    deliveryChecker: "التحقق من منطقة التوصيل",
    sharjahOnly: "الشارقة فقط",
    check: "تحقق",
    eligible: "نقوم بالتوصيل إلى موقعك.",
    notEligible: "حالياً نوصل داخل الشارقة فقط.",
    studentDiscount: "التحقق من خصم الطلبة",
    email: "بريد الطالب",
    expiry: "تاريخ الانتهاء",
    validate: "تحقق",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    subscribe: "اشترك",
    perMonth: "/شهري",
  },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>(
    () => (localStorage.getItem("locale") as Locale) || "en",
  );

  useEffect(() => {
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const t = useMemo(() => {
    const dict = STRINGS[locale];
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
