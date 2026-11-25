import { Users } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { audienceHref, getAudiencePages } from "@/content/audiences";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

const PATH = "/for";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("audiencesHub");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default function AudienceHub() {
  const t = useTranslations("audiencesHub");
  const locale = useLocale();
  const audiences = getAudiencePages(locale);
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
            audiences.map((a) => ({ name: a.title, href: audienceHref(a.slug) })),
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
      <PageSection title={t("listTitle")}>
        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((a) => (
            <LinkCard
              key={a.slug}
              href={audienceHref(a.slug)}
              title={a.title}
              description={a.description}
              meta={a.navLabel}
              icon={<Users className="size-5" />}
            />
          ))}
        </div>
      </PageSection>
      <DownloadCta title={t("cta.title")} text={t("cta.text")} placement="hub_page" />
    </>
  );
}
