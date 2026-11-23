import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export default async function FeaturePageRoute({ params }: Props) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();
  return <FeatureTemplate feature={feature} />;
}
