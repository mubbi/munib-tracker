import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NotFoundContent } from "@/components/not-found-content";
import { SiteDocument } from "@/components/site-document";
import { DEFAULT_LOCALE } from "@/i18n/routing";

/**
 * 404 for URLs no route matches — including unknown content slugs, which
 * `src/proxy.ts` rewrites to an unmatched path so crawlers get a real 404.
 * Renders outside the `[locale]` layout, so it builds the document itself.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: DEFAULT_LOCALE, namespace: "notFound" });
  // Rendered outside the layout, so the "%s | Munib Tracker" template does not apply.
  return { title: `${t("metaTitle")} | ${APP_NAME}` };
}

export default function GlobalNotFound() {
  return (
    <SiteDocument locale={DEFAULT_LOCALE}>
      <NotFoundContent />
    </SiteDocument>
  );
}
