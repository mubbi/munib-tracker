import { COMPARE_PAGES, getComparison } from "@/content/compare";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Munib Tracker app comparison";

export function generateStaticParams() {
  return COMPARE_PAGES.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getComparison(slug);
  return renderOgImage({
    eyebrow: page?.kind === "roundup" ? "App roundup" : "Comparison",
    title: page?.title ?? "Compare Islamic apps",
  });
}
