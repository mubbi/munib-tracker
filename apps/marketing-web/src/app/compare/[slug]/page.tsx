import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompareTemplate } from "@/components/templates/compare-template";
import { COMPARE_PAGES, compareHref, getComparison } from "@/content/compare";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPARE_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) return {};
  return pageMetadata({
    path: compareHref(page.slug),
    title: page.seoTitle,
    description: page.seoDescription,
  });
}

export default async function ComparePageRoute({ params }: Props) {
  const { slug } = await params;
  const page = getComparison(slug);
  if (!page) notFound();
  return <CompareTemplate page={page} />;
}
