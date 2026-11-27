import { BookOpenText } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { articleHref, articlesIn, getArticles } from "@/content/resources";
import { categoryHref, getCategories } from "@/content/resources/categories";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

const PATH = "/resources";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("resourcesHub");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default function ResourcesHub() {
  const t = useTranslations("resourcesHub");
  const locale = useLocale();
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({
            locale,
            path: PATH,
            name: t("title"),
            description: t("meta.description"),
          }),
          itemListSchema(
            getArticles(locale).map((a) => ({ name: a.title, href: articleHref(a) })),
            locale,
          ),
        )}
      />
      <PageHero
        crumbs={[{ name: t("crumb"), href: PATH }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
      />
      {getCategories(locale).map((cat, i) => (
        <PageSection
          key={cat.slug}
          tone={i % 2 ? "band" : "default"}
          eyebrow={t("topicEyebrow")}
          title={cat.title}
          intro={cat.description}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articlesIn(cat.slug, locale).map((a) => (
              <LinkCard
                key={a.slug}
                href={articleHref(a)}
                title={a.title}
                description={a.description}
                icon={<BookOpenText className="size-5" />}
              />
            ))}
          </div>
          <Link
            href={categoryHref(cat.slug)}
            className="mt-6 inline-block text-sm font-semibold text-brand hover:underline"
          >
            {t("allGuides", { category: cat.title })}
          </Link>
        </PageSection>
      ))}
      <PageSection
        tone="band"
        eyebrow={t("library.eyebrow")}
        title={t("library.title")}
        intro={t("library.intro")}
      />
      <DownloadCta title={t("cta.title")} text={t("cta.text")} placement="hub_page" />
    </>
  );
}
