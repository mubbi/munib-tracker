import { BookOpenText } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { RouteSkeleton } from "@/components/content/route-skeleton";
import { featureHref, getFeature } from "@/content/features";
import { articleHref, articlesIn } from "@/content/resources";
import { categoryHref, getCategory, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

type Props = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return RESOURCE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return pageMetadata({
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
  const cat = getCategory(category);
  if (!cat) notFound();
  const articles = articlesIn(cat.slug);
  const feature = getFeature(cat.feature);
  const path = categoryHref(cat.slug);

  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ path, name: `${cat.title} guides`, description: cat.seoDescription }),
          itemListSchema(articles.map((a) => ({ name: a.title, href: articleHref(a) }))),
        )}
      />
      <PageHero
        crumbs={[
          { name: "Resources", href: "/resources" },
          { name: cat.title, href: path },
        ]}
        eyebrow="Resources"
        title={`${cat.title} guides`}
        intro={<p>{cat.description}</p>}
      />
      <PageSection title={`All ${cat.title} guides`}>
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
          eyebrow="In the app"
          title={feature.navLabel}
          intro={`${feature.description} [See how it works](${featureHref(feature.slug)}).`}
        />
      ) : null}
      {feature ? (
        <DownloadCta title={feature.cta.title} text={feature.cta.text} placement="hub_page" />
      ) : null}
    </>
  );
}
