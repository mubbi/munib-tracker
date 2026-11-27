import { APP_NAME } from "@munib-tracker/shared/constants";
import { ArrowRight, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DownloadCta } from "@/components/content/download-cta";
import { FeatureIcon } from "@/components/content/feature-icon";
import { PageHero } from "@/components/content/page-hero";
import {
  FaqSection,
  JsonLdScript,
  LinkCard,
  PageSection,
  RichParagraphs,
} from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { ScreenshotGallery } from "@/components/content/screenshot-gallery";
import { StoreBadges } from "@/components/store-badges";
import { audienceHref } from "@/content/audiences";
import { featureHref, getFeature } from "@/content/features";
import { articleByHref, articleHref } from "@/content/resources";
import type { AudiencePage } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { faqNodes, graph, webPageSchema } from "@/lib/structured-data";

export function AudienceTemplate({ page }: { page: AudiencePage }) {
  const t = useTranslations("templates");
  const locale = useLocale();
  const path = audienceHref(page.slug);
  const guides = page.guides
    .map((href) => articleByHref(href, locale))
    .filter((a) => a !== undefined);

  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({
            locale,
            path,
            name: page.title,
            description: page.seoDescription,
            modified: page.updated,
          }),
          ...faqNodes(page.faqs),
        )}
      />
      <PageHero
        crumbs={[
          { name: t("crumbs.audiences"), href: "/for" },
          { name: page.navLabel, href: path },
        ]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={<RichText text={page.intro} />}
        actions={<StoreBadges placement="audience_page" />}
        screenshot={page.hero}
      />

      <PageSection id="situation" title={page.situation.title}>
        <RichParagraphs
          items={page.situation.paragraphs}
          className="flex max-w-3xl flex-col gap-5 text-[17px] leading-[1.75] text-white/78"
        />
        {page.gallery?.length ? (
          <ScreenshotGallery slots={page.gallery} className="mt-12 md:mt-16" />
        ) : null}
      </PageSection>

      <PageSection
        id="how-it-helps"
        tone="band"
        eyebrow={t("audience.helpsEyebrow", { appName: APP_NAME })}
        title={t("audience.helpsTitle")}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.helps.map((h) => {
            const feature = h.feature ? getFeature(h.feature, locale) : undefined;
            const href = feature ? featureHref(feature.slug) : h.href;
            return (
              <div
                key={h.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6"
              >
                {feature ? (
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-brand/12 text-brand ring-1 ring-brand/20">
                    <FeatureIcon icon={feature.icon} />
                  </span>
                ) : null}
                <h3 className="font-display text-[17px] font-semibold text-white">{h.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                  <RichText text={h.text} />
                </p>
                {href ? (
                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand hover:underline"
                  >
                    {feature ? feature.navLabel : t("audience.learningLibrary")}
                    <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </PageSection>

      <PageSection id="plan" eyebrow={t("audience.planEyebrow")} title={page.plan.title}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {page.plan.steps.map((s) => (
            <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-gold">
                {s.title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/75">
                <RichText text={s.text} />
              </p>
            </li>
          ))}
        </ol>
        {page.limits?.length ? (
          <div className="mt-8 rounded-2xl border border-sky-300/25 bg-[#0c2233] p-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              <Info aria-hidden className="size-4" />
              {t("audience.goodToKnow")}
            </p>
            <ul className="mt-3 flex list-disc flex-col gap-2 ps-5 text-[15px] leading-relaxed text-white/78">
              {page.limits.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </PageSection>

      <FaqSection items={page.faqs} tone="band" title={t("audience.faqTitle")} />

      {guides.length ? (
        <PageSection
          id="guides"
          eyebrow={t("audience.guidesEyebrow")}
          title={t("audience.guidesTitle")}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((a) => (
              <LinkCard
                key={a.slug}
                href={articleHref(a)}
                title={a.title}
                description={a.description}
                meta={t("cardMeta.guide")}
              />
            ))}
          </div>
        </PageSection>
      ) : null}

      <DownloadCta title={page.cta.title} text={page.cta.text} placement="audience_page" />
    </>
  );
}
