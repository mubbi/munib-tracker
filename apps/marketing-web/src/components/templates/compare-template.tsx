import { APP_NAME } from "@munib-tracker/shared/constants";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Blocks } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import {
  DateStamp,
  FaqSection,
  formatIsoDate,
  JsonLdScript,
  LinkCard,
  PageSection,
  RichParagraphs,
  Screenshot,
} from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { ComparisonTable } from "@/components/templates/comparison-table";
import { FeatureInventory } from "@/components/templates/feature-inventory";
import { compareHref, getComparison } from "@/content/compare";
import { getFeature } from "@/content/features";
import { PLANNED_FEATURES, SHIPPED_FEATURE_COUNT } from "@/content/munib-features";
import { articleByHref } from "@/content/resources";
import type { ComparePage, ScreenshotSlot } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { graph, webPageSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

type TemplatesT = ReturnType<typeof useTranslations<"templates">>;

/** "At a glance": real screens on iPhone and Android; captions in `templates.compare.glance`. */
const GLANCE: readonly {
  id: "home" | "tracker" | "quran" | "zikr";
  key: ScreenshotSlot["key"];
  device?: ScreenshotSlot["device"];
}[] = [
  { id: "home", key: "home" },
  { id: "tracker", key: "tracker", device: "android" },
  { id: "quran", key: "quran" },
  { id: "zikr", key: "zikr", device: "android" },
];

/** Resolves a related href to a card (feature, article, comparison or hub). */
function relatedCard(href: string, locale: Locale, t: TemplatesT) {
  if (href.startsWith("/features/")) {
    const f = getFeature(href.slice("/features/".length), locale);
    if (f) {
      return { href, title: f.navLabel, description: f.description, meta: t("cardMeta.feature") };
    }
  }
  if (href.startsWith("/compare/")) {
    const c = getComparison(href.slice("/compare/".length), locale);
    if (c) {
      return { href, title: c.title, description: c.description, meta: t("cardMeta.comparison") };
    }
  }
  const a = articleByHref(href, locale);
  if (a) return { href, title: a.title, description: a.description, meta: t("cardMeta.guide") };
  if (href === "/compare") {
    return {
      href,
      title: t("compare.allComparisons"),
      description: t("compare.allComparisonsDescription"),
      meta: t("cardMeta.compare"),
    };
  }
  return null;
}

export function CompareTemplate({ page }: { page: ComparePage }) {
  const t = useTranslations("templates");
  const locale = useLocale();
  const path = compareHref(page.slug);
  const related = page.related
    .map((href) => relatedCard(href, locale, t))
    .filter((c) => c !== null);
  const roundup = page.kind === "roundup";
  const planned = PLANNED_FEATURES.length;

  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ locale, path, name: page.title, description: page.seoDescription }),
        )}
      />
      <PageHero
        crumbs={[
          { name: t("crumbs.compare"), href: "/compare" },
          { name: page.title, href: path },
        ]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={<RichParagraphs items={page.intro} className="flex flex-col gap-4" />}
        meta={<DateStamp label="lastVerified" iso={page.verifiedOn} />}
      />

      <PageSection
        id="verdict"
        eyebrow={t("compare.verdictEyebrow")}
        title={t("compare.verdictTitle")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {page.summary.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6">
              <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">
                <RichText text={s.text} />
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="comparison-table"
        tone="band"
        eyebrow={t("compare.tableEyebrow")}
        title={t("compare.tableTitle")}
        intro={
          planned
            ? t("compare.tableIntroWithPlanned", { appName: APP_NAME })
            : t("compare.tableIntro")
        }
      >
        <ComparisonTable page={page} />
      </PageSection>

      <PageSection
        id="everything-in-munib"
        eyebrow={t("compare.inventoryEyebrow")}
        title={t("compare.inventoryTitle", { appName: APP_NAME })}
        intro={
          planned
            ? t("compare.inventoryIntroWithPlanned", { shipped: SHIPPED_FEATURE_COUNT, planned })
            : t("compare.inventoryIntro", { shipped: SHIPPED_FEATURE_COUNT, appName: APP_NAME })
        }
      >
        <FeatureInventory />
      </PageSection>

      <PageSection
        id="at-a-glance"
        tone="band"
        eyebrow={t("compare.glanceEyebrow")}
        title={t("compare.glanceTitle", { appName: APP_NAME })}
      >
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {GLANCE.map((slot) => (
            <li key={slot.id}>
              <Screenshot
                slot={{
                  key: slot.key,
                  device: slot.device,
                  caption: t(`compare.glance.${slot.id}`),
                }}
                className="mx-auto w-full max-w-[200px]"
                sizes="(min-width: 1024px) 200px, 45vw"
              />
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        id="strengths"
        eyebrow={t("compare.strengthsEyebrow")}
        title={t("compare.strengthsTitle")}
      >
        <div
          className={cn("grid gap-4", roundup ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}
        >
          {page.apps.map((app) => (
            <div key={app.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3
                className={cn(
                  "font-display text-lg font-semibold",
                  app.id === "munib" ? "text-brand" : "text-white",
                )}
              >
                {app.name}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                <span className="font-semibold text-white/75">{t("compare.bestFor")} </span>
                {page.bestFor[app.id]}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {(page.strengths[app.id] ?? []).map((s) => (
                  <li key={s} className="flex gap-2.5 text-[15px] leading-relaxed text-white/75">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      {page.body?.length ? (
        <section className="py-6 md:py-10">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <Blocks blocks={page.body} />
          </div>
        </section>
      ) : null}

      <PageSection
        id="sources"
        tone="band"
        eyebrow={t("compare.sourcesEyebrow")}
        title={t("compare.sourcesTitle")}
      >
        <p className="max-w-2xl text-[15px] leading-relaxed text-white/65">
          {t.rich("compare.sourcesNote", {
            date: formatIsoDate(page.verifiedOn, locale),
            time: (chunks) => <time dateTime={page.verifiedOn}>{chunks}</time>,
          })}
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {page.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[15px] text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>

      <FaqSection items={page.faqs} title={t("compare.faqTitle")} />

      {related.length ? (
        <PageSection
          id="related"
          tone="band"
          eyebrow={t("compare.relatedEyebrow")}
          title={t("compare.relatedTitle")}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <LinkCard key={c.href} {...c} />
            ))}
          </div>
        </PageSection>
      ) : null}

      <DownloadCta
        title={t("compare.ctaTitle", { appName: APP_NAME })}
        text={t("compare.ctaText")}
        placement="compare_page"
      />
    </>
  );
}
