import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { ArticleTemplate } from "@/components/templates/article-template";
import { ARTICLES, articleHref, getArticle } from "@/content/resources";
import { routeOgImage } from "@/lib/og";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const locale = await getLocale();
  const article = getArticle(category, slug, locale);
  if (!article) return {};
  const t = await getTranslations("og");
  const path = articleHref(article);
  return pageMetadata({
    locale,
    path,
    title: article.seoTitle,
    description: article.seoDescription,
    type: "article",
    published: article.published,
    modified: article.updated,
    image: routeOgImage(path, locale, t("guide.alt", { appName: APP_NAME })),
  });
}

/** URL data is read inside Suspense so the shared App Shell stays URL-independent. */
export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: Props) {
  const { category, slug } = await params;
  const article = getArticle(category, slug, await getLocale());
  if (!article) notFound();
  return <ArticleTemplate article={article} />;
}
