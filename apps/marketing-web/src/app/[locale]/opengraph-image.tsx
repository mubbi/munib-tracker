import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { getTranslations } from "next-intl/server";
import { LOCALES } from "@/i18n/routing";
import { OG_CONTENT_TYPE, OG_SIZE, ogLocale, renderOgImage } from "@/lib/og";

// No static `alt` export: it can't be translated. `pageMetadata()` references
// this card with a translated alt (`metadata.defaultImageAlt`).
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prerender one card per locale (the `[locale]` layout's params don't reach metadata routes). */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = ogLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "og" });
  return renderOgImage({ locale, eyebrow: APP_TAGLINE, title: t("home.title") });
}
