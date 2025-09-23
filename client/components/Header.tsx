import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const { user, logout } = useAuth();

  const onLogout = async () => {
    console.log('Attempting logout from Header component...');
    try {
      await logout();
      console.log('Logout completed successfully from Header component.');
    } catch (error) {
      console.error('Logout failed in Header component:', error);
      // Show user feedback about logout failure if needed
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-red-600/80 backdrop-blur supports-[backdrop-filter]:bg-red-600/60 text-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/LogoChef.png"
            alt="ابن  العرب logo"
            className="h-[60px] w-auto rounded bg-white p-0.5"
          />
          <span className="font-extrabold tracking-tight text-xl text-white">
            {t("brand")}
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link to="/" className="hover:text-red-200 transition-colors">
            {t("home")}
          </Link>
          <a className="hover:text-red-200 transition-colors" href="#gallery">
            {t("mealsGallery")}
          </a>
          <a className="hover:text-red-200 transition-colors" href="#plans">
            {t("monthlyPlans")}
          </a>
          {user ? (
            <>
              <Link to="/profile" className="hover:text-red-200 transition-colors">
                {t("profile")}
              </Link>
              <Button onClick={onLogout} variant="ghost" className="text-white hover:bg-red-700">
                {t("logout")}
              </Button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-white hover:bg-red-700 h-10 py-2 px-4"
            >
              {t("login")}
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="text-white hover:bg-red-700"
          >
            {locale === "en" ? "العربية" : "English"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
