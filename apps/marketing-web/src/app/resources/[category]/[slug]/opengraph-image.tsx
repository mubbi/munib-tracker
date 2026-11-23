import { ARTICLES, getArticle } from "@/content/resources";
import { getCategory } from "@/content/resources/categories";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Munib Tracker guide";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ category: a.category, slug: a.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  return renderOgImage({
    eyebrow: `Guide · ${getCategory(category)?.title ?? "Resources"}`,
    title: article?.title ?? "Munib Tracker guides",
  });
}
