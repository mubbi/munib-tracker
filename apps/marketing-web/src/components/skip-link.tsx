import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a href="#main-content" className="skip-link">
      {t("skipToContent")}
    </a>
  );
}
