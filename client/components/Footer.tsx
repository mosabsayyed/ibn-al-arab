import { useI18n } from "@/context/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} {t("brand")} · {t("tagline")}</p>
        <div className="flex items-center gap-4">
          <a href="#plans" className="hover:text-primary">{t("plans")}</a>
          <a href="#gallery" className="hover:text-primary">{t("mealsGallery")}</a>
          <a href="#delivery" className="hover:text-primary">{t("deliveryChecker")}</a>
        </div>
      </div>
    </footer>
  );
}
