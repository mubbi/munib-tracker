import { APP_NAME } from "@munib-tracker/shared/constants";
import { getTranslations } from "next-intl/server";
import { AUDIENCE_PAGES, getAudience } from "@/content/audiences";
import { OG_CONTENT_TYPE, OG_SIZE, ogLocale, renderOgImage } from "@/lib/og";

// Translated alt text comes from the page metadata (`routeOgImage`), not a static `alt` export.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return AUDIENCE_PAGES.map((a) => ({ slug: a.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const t = await getTranslations({ locale, namespace: "og" });
  const page = getAudience(slug, locale);
  return renderOgImage({
    locale,
    eyebrow: page?.eyebrow ?? t("audience.eyebrow"),
    title: page?.title ?? APP_NAME,
  });
}
