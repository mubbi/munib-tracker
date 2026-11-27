import { BookOpenText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { featureHref, getFeature } from "@/content/features";
import { articleHref, articlesIn } from "@/content/resources";
import { categoryHref, getCategory, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return RESOURCE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const locale = await getLocale();
  const cat = getCategory(category, locale);
  if (!cat) return {};
  return pageMetadata({
    locale,
    path: categoryHref(cat.slug),
    title: cat.seoTitle,
    description: cat.seoDescription,
  });
}

/** URL data is read inside Suspense so the shared App Shell stays URL-independent. */
export default function ResourceCategoryPage({ params }: Props) {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <ResourceCategoryContent params={params} />
    </Suspense>
  );
}

async function ResourceCategoryContent({ params }: Props) {
  const { category } = await params;
  const locale = await getLocale();
  const cat = getCategory(category, locale);
  if (!cat) notFound();
  const t = await getTranslations("resourcesHub");
  const articles = articlesIn(cat.slug, locale);
  const feature = getFeature(cat.feature, locale);
  const path = categoryHref(cat.slug);
  const title = t("category.title", { category: cat.title });

  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ locale, path, name: title, description: cat.seoDescription }),
          itemListSchema(
            articles.map((a) => ({ name: a.title, href: articleHref(a) })),
            locale,
          ),
        )}
      />
      <PageHero
        crumbs={[
          { name: t("crumb"), href: SITE_PATHS.resources },
          { name: cat.title, href: path },
        ]}
        eyebrow={t("eyebrow")}
        title={title}
        intro={<p>{cat.description}</p>}
      />
      <PageSection title={t("allGuides", { category: cat.title })}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <LinkCard
              key={a.slug}
              href={articleHref(a)}
              title={a.title}
              description={a.description}
              icon={<BookOpenText className="size-5" />}
            />
          ))}
        </div>
      </PageSection>
      {feature ? (
        <PageSection
          tone="band"
          eyebrow={t("category.inTheApp")}
          title={feature.navLabel}
          intro={t("category.featureIntro", {
            description: feature.description,
            href: featureHref(feature.slug),
          })}
        />
      ) : null}
      {feature ? (
        <DownloadCta title={feature.cta.title} text={feature.cta.text} placement="hub_page" />
      ) : null}
    </>
  );
}
