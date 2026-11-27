import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { AudienceTemplate } from "@/components/templates/audience-template";
import { AUDIENCE_PAGES, audienceHref, getAudience } from "@/content/audiences";
import { routeOgImage } from "@/lib/og";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return AUDIENCE_PAGES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const page = getAudience(slug, locale);
  if (!page) return {};
  const t = await getTranslations("og");
  const path = audienceHref(page.slug);
  return pageMetadata({
    locale,
    path,
    markdown: true,
    title: page.seoTitle,
    description: page.seoDescription,
    image: routeOgImage(path, locale, t("audience.alt", { appName: APP_NAME })),
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
  const page = getAudience(slug, await getLocale());
  if (!page) notFound();
  return <AudienceTemplate page={page} />;
}
