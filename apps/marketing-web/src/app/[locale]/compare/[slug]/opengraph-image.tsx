import { getTranslations } from "next-intl/server";
import { COMPARE_PAGES, getComparison } from "@/content/compare";
import { OG_CONTENT_TYPE, OG_SIZE, ogLocale, renderOgImage } from "@/lib/og";

// Translated alt text comes from the page metadata (`routeOgImage`), not a static `alt` export.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return COMPARE_PAGES.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const t = await getTranslations({ locale, namespace: "og" });
  const page = getComparison(slug, locale);
  return renderOgImage({
    locale,
    eyebrow: page?.kind === "roundup" ? t("compare.eyebrowRoundup") : t("compare.eyebrow"),
    title: page?.title ?? t("compare.fallbackTitle"),
  });
}
