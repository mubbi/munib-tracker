import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleTemplate } from "@/components/templates/article-template";
import { ARTICLES, articleHref, getArticle } from "@/content/resources";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) return {};
  return pageMetadata({
    path: articleHref(article),
    title: article.seoTitle,
    description: article.seoDescription,
    type: "article",
    published: article.published,
    modified: article.updated,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) notFound();
  return <ArticleTemplate article={article} />;
}
