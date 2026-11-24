import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { AudienceTemplate } from "@/components/templates/audience-template";
import { AUDIENCE_PAGES, audienceHref, getAudience } from "@/content/audiences";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AUDIENCE_PAGES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAudience(slug);
  if (!page) return {};
  return pageMetadata({
    path: audienceHref(page.slug),
    title: page.seoTitle,
    description: page.seoDescription,
  });
}

/** URL data is read inside Suspense so the shared App Shell stays URL-independent. */
export default function AudiencePageRoute({ params }: Props) {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <AudienceContent params={params} />
    </Suspense>
  );
}

async function AudienceContent({ params }: Props) {
  const { slug } = await params;
  const page = getAudience(slug);
  if (!page) notFound();
  return <AudienceTemplate page={page} />;
}
