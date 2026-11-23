import { FEATURE_PAGES, getFeature } from "@/content/features";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Munib Tracker feature";

export function generateStaticParams() {
  return FEATURE_PAGES.map((f) => ({ slug: f.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  return renderOgImage({
    eyebrow: feature?.eyebrow ?? "Feature",
    title: feature?.title ?? "Munib Tracker",
  });
}
