import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { FeatureTemplate } from "@/components/templates/feature-template";
import { FEATURE_PAGES, featureHref, getFeature } from "@/content/features";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FEATURE_PAGES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};
  return pageMetadata({
    path: featureHref(feature.slug),
    title: feature.seoTitle,
    description: feature.seoDescription,
  });
}

/** URL data is read inside Suspense so the shared App Shell stays URL-independent. */
export default function FeaturePageRoute({ params }: Props) {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <FeatureContent params={params} />
    </Suspense>
  );
}

async function FeatureContent({ params }: Props) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();
  return <FeatureTemplate feature={feature} />;
}
