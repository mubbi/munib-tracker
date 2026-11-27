import { APP_NAME } from "@munib-tracker/shared/constants";
import { getTranslations } from "next-intl/server";
import { ARTICLES, getArticle } from "@/content/resources";
import { getCategory } from "@/content/resources/categories";
import { OG_CONTENT_TYPE, OG_SIZE, ogLocale, renderOgImage } from "@/lib/og";

// Translated alt text comes from the page metadata (`routeOgImage`), not a static `alt` export.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ category: a.category, slug: a.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale: raw, category, slug } = await params;
  const locale = ogLocale(raw);
  const t = await getTranslations({ locale, namespace: "og" });
  const article = getArticle(category, slug, locale);
  return renderOgImage({
    locale,
    eyebrow: t("guide.eyebrow", {
      category: getCategory(category, locale)?.title ?? t("guide.fallbackCategory"),
    }),
    title: article?.title ?? t("guide.fallbackTitle", { appName: APP_NAME }),
  });
}
