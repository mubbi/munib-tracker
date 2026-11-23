import { AUDIENCE_PAGES, getAudience } from "@/content/audiences";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Munib Tracker";

export function generateStaticParams() {
  return AUDIENCE_PAGES.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAudience(slug);
  return renderOgImage({
    eyebrow: page?.eyebrow ?? "Who it's for",
    title: page?.title ?? "Munib Tracker",
  });
}
