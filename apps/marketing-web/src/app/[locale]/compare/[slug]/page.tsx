import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { CompareTemplate } from "@/components/templates/compare-template";
import { COMPARE_PAGES, compareHref, getComparison } from "@/content/compare";
import { routeOgImage } from "@/lib/og";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COMPARE_PAGES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = getComparison(slug, locale);
  if (!page) return {};
  const t = await getTranslations("og");
  const path = compareHref(page.slug);
  return pageMetadata({
    locale,
    path,
    markdown: true,
    title: page.seoTitle,
    description: page.seoDescription,
    image: routeOgImage(path, locale, t("compare.alt", { appName: APP_NAME })),
  });
}

/** URL data is read inside Suspense so the shared App Shell stays URL-independent. */
export default function ComparePageRoute({ params }: Props) {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <CompareContent params={params} />
    </Suspense>
  );
}

async function CompareContent({ params }: Props) {
  const { slug } = await params;
  const page = getComparison(slug, await getLocale());
  if (!page) notFound();
  return <CompareTemplate page={page} />;
}
