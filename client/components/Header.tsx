import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useI18n } from "@/context/i18n";
import { cn } from "@/lib/utils";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "");
    const name = String(form.get("name") || "");
    const u = { email, name };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const onLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-amber-400" />
          <span className="font-extrabold tracking-tight text-xl">{t("brand")}</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:text-primary" href="#plans">{t("plans")}</a>
          <a className="hover:text-primary" href="#preview">{t("mealPlanPreview")}</a>
          <a className="hover:text-primary" href="#gallery">{t("mealsGallery")}</a>
          <a className="hover:text-primary" href="#delivery">{t("deliveryChecker")}</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className={cn("font-semibold", locale === "ar" && "font-[\"Cairo\",sans-serif]")}
          >
            {locale === "en" ? "العربية" : "EN"}
          </Button>
          {user ? (
            <Button variant="outline" onClick={onLogout}>{t("logout")}</Button>
          ) : (
            <AuthDialogs />
          )}
        </div>
      </div>
    </header>
  );
}

function AuthDialogs() {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{t("login")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("login")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            const headerEl = document.querySelector("header");
            (headerEl as any)?.dispatchEvent(new CustomEvent("auth:login", { detail: { target: e.target } }));
          }} className="grid gap-3">
            <Input required name="email" type="email" placeholder="email@example.com" />
            <Button type="submit">{t("login")}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>{t("register")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("register")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            const headerEl = document.querySelector("header");
            (headerEl as any)?.dispatchEvent(new CustomEvent("auth:register", { detail: { target: e.target } }));
          }} className="grid gap-3">
            <Input required name="name" placeholder="Your name" />
            <Input required name="email" type="email" placeholder="email@example.com" />
            <Button type="submit">{t("register")}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
