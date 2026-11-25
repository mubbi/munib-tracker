import { Scale } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Note } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { compareHref, getComparePages } from "@/content/compare";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

const PATH = "/compare";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("compareHub");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default function CompareHub() {
  const t = useTranslations("compareHub");
  const locale = useLocale();
  const pages = getComparePages(locale);
  const versus = pages.filter((c) => c.kind === "versus");
  const roundups = pages.filter((c) => c.kind === "roundup");
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
            pages.map((c) => ({ name: c.title, href: compareHref(c.slug) })),
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
      <PageSection title={t("roundups.title")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {roundups.map((c) => (
            <LinkCard
              key={c.slug}
              href={compareHref(c.slug)}
              title={c.title}
              description={c.description}
              meta={t("roundups.meta")}
              icon={<Scale className="size-5" />}
            />
          ))}
        </div>
      </PageSection>
      <PageSection tone="band" title={t("versus.title")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {versus.map((c) => (
            <LinkCard
              key={c.slug}
              href={compareHref(c.slug)}
              title={c.title}
              description={c.description}
              meta={t("versus.meta")}
            />
          ))}
        </div>
        <div className="mt-10 max-w-3xl">
          <Note tone="info" title={t("note.title")} text={t("note.text")} />
        </div>
      </PageSection>
      <DownloadCta title={t("cta.title")} text={t("cta.text")} placement="hub_page" />
    </>
  );
}
