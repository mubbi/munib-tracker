import { APP_NAME } from "@munib-tracker/shared/constants";
import { getTranslations } from "next-intl/server";
import { FEATURE_PAGES, getFeature } from "@/content/features";
import { OG_CONTENT_TYPE, OG_SIZE, ogLocale, renderOgImage } from "@/lib/og";

// Translated alt text comes from the page metadata (`routeOgImage`), not a static `alt` export.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return FEATURE_PAGES.map((f) => ({ slug: f.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const t = await getTranslations({ locale, namespace: "og" });
  const feature = getFeature(slug, locale);
  return renderOgImage({
    locale,
    eyebrow: feature?.eyebrow ?? t("feature.eyebrow"),
    title: feature?.title ?? APP_NAME,
  });
}
