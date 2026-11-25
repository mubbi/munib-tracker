import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, PageSection, Screenshot } from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { StoreBadges } from "@/components/store-badges";
import type { ScreenshotSlot } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { productAppUrl, SITE_PATHS } from "@/lib/site";
import { graph, webPageSchema } from "@/lib/structured-data";
import type { Messages } from "@/messages";

const PATH = "/how-it-works";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("howItWorks");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

type StepId = keyof Messages["howItWorks"]["steps"];
type CaptionId = keyof Messages["howItWorks"]["stepCaptions"];

/** Steps in order; copy is keyed by id in the `howItWorks` catalog. */
const STEPS: readonly (
  | { id: Exclude<StepId, CaptionId> }
  | { id: CaptionId; shot: ScreenshotSlot["key"] }
)[] = [
  { id: "download" },
  { id: "location", shot: "home" },
  { id: "log", shot: "tracker" },
  { id: "adhkar", shot: "zikr" },
  { id: "qaza", shot: "qaza" },
  { id: "quran", shot: "quran" },
  { id: "reminders" },
  { id: "review" },
];

const DAY = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

const DATA_CARDS = ["device", "sync", "backups"] as const;

const textLink = (href: string) => (chunks: ReactNode) => (
  <Link href={href} className="text-brand underline underline-offset-2">
    {chunks}
  </Link>
);

export default function HowItWorksPage() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({
            locale,
            path: PATH,
            name: t("schemaName"),
            description: t("meta.description"),
          }),
        )}
      />
      <PageHero
        crumbs={[{ name: t("crumb"), href: PATH }]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={<p>{t("intro")}</p>}
        actions={<StoreBadges placement="how_it_works_page" />}
        screenshot={{ key: "home-light", caption: t("heroCaption") }}
      />

      <PageSection title={t("stepsTitle")}>
        <ol className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.id}
              className="grid items-center gap-6 rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[1fr_auto] md:p-8"
            >
              <div className="flex gap-5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/15 font-display text-lg font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {t(`steps.${step.id}.title`)}
                  </h3>
                  <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-white/72">
                    <RichText
                      text={t(`steps.${step.id}.text`, { webAppUrl: productAppUrl(locale) })}
                    />
                  </p>
                </div>
              </div>
              {"shot" in step ? (
                <Screenshot
                  slot={{ key: step.shot, caption: t(`stepCaptions.${step.id}`) }}
                  className="mx-auto w-[150px] md:w-[160px]"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection
        tone="band"
        eyebrow={t("day.eyebrow")}
        title={t("day.title")}
        intro={t("day.intro")}
      >
        <ol className="relative grid gap-4 md:grid-cols-5">
          {DAY.map((id) => (
            <li key={id} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-5">
              <p className="font-display text-lg font-bold text-gold">
                {t(`day.prayers.${id}.time`)}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">
                {t(`day.prayers.${id}.text`)}
              </p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection eyebrow={t("data.eyebrow")} title={t("data.title")}>
        <div className="grid gap-4 md:grid-cols-3">
          {DATA_CARDS.map((id) => (
            <div key={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display text-[17px] font-semibold text-white">
                {t(`data.cards.${id}.title`)}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                {t(`data.cards.${id}.text`)}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-white/65">
          {t.rich("data.more", {
            privacy: textLink(SITE_PATHS.privacy),
            why: textLink(SITE_PATHS.why),
          })}
        </p>
      </PageSection>

      <DownloadCta title={t("cta.title")} text={t("cta.text")} placement="how_it_works_page" />
    </>
  );
}
