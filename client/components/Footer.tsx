import { useI18n } from "@/context/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} {t("brand")} · {t("tagline")}
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/terms" className="hover:text-primary text-muted-foreground">
            {t('terms')}
          </a>
          <a href="/privacy" className="hover:text-primary text-muted-foreground">
            {t('privacy')}
          </a>
          <a
            href="mailto:feedback_ibnalarab@miles.click?subject=New%20Meal%20Suggestion"
            className="hover:text-primary text-red-600 font-medium"
          >
            {t("feedback")}
          </a>
        </div>
      </div>
    </footer>
  );
}
