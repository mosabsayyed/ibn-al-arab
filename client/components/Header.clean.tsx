import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useI18n } from "@/context/i18n";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const { user, login, resetPassword, logout } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    
    const result = await login(email, password);
    setLoginLoading(false);
    
    if (result.error) {
      setLoginError(result.error);
    }
  };

  const onResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    
    const result = await resetPassword(email);
    if (result.error) {
      setResetMessage(result.error);
    } else {
      setResetMessage(`Password reset email sent to ${email}. Check your inbox!`);
    }
  };

  const onLogout = async () => {
    console.log('Attempting logout from Header component...');
    await logout();
    console.log('Logout initiated from Header component.');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-red-600/80 backdrop-blur supports-[backdrop-filter]:bg-red-600/60 text-white">
      <div className="container flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img
            src="/LogoChef.png"
            alt="ابن  العرب logo"
            className="h-[60px] w-auto rounded bg-white p-0.5"
          />
          <span className="font-extrabold tracking-tight text-xl text-white">
            {t("brand")}
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link to="/" className="hover:text-red-200 transition-colors">
            {t("home")}
          </Link>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-red-700">
                  {t("login")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("login")}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onLogin} className="grid gap-4 py-4">
                  {loginError && <p className="text-red-500">{loginError}</p>}
                  <Input
                    id="email"
                    name="email"
                    placeholder={t("email")}
                    type="email"
                    required
                  />
                  <Input
                    id="password"
                    name="password"
                    placeholder={t("password")}
                    type="password"
                    required
                  />
                  <Button type="submit" disabled={loginLoading}>
                    {loginLoading ? t("loading") : t("login")}
                  </Button>
                  <Button variant="link" onClick={() => setShowResetForm(true)}>
                    {t("forgotPassword")}
                  </Button>
                </form>
                {showResetForm && (
                  <form onSubmit={onResetPassword} className="grid gap-4 py-4">
                    {resetMessage && <p className="text-green-500">{resetMessage}</p>}
                    <Input
                      id="reset-email"
                      name="email"
                      placeholder={t("email")}
                      type="email"
                      required
                    />
                    <Button type="submit">{t("resetPassword")}</Button>
                    <Button variant="link" onClick={() => setShowResetForm(false)}>
                      {t("backToLogin")}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
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
