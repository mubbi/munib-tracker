import { BookCheck, Code2, HeartHandshake, ShieldCheck, Sparkles, WifiOff } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection, Screenshot } from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";
import { graph, webPageSchema } from "@/lib/structured-data";

const PATH = "/why-munib-tracker";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("why");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

/** Principles in order; copy is keyed by id in the `why` catalog. */
const PRINCIPLES = [
  { id: "consistency", icon: HeartHandshake },
  { id: "privacy", icon: ShieldCheck },
  { id: "noAds", icon: Sparkles },
  { id: "authentic", icon: BookCheck },
  { id: "offline", icon: WifiOff },
  { id: "open", icon: Code2 },
] as const;

const WONT = ["ads", "subscription", "leaderboards", "aiText", "fatwas", "donations"] as const;

const MORE_CARDS = [
  { id: "features", href: SITE_PATHS.features },
  { id: "compare", href: SITE_PATHS.compare },
  { id: "privacy", href: SITE_PATHS.privacy },
] as const;

export default function WhyPage() {
  const t = useTranslations("why");
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
        screenshot={{ key: "offline-data", caption: t("heroCaption") }}
      />

      <PageSection title={t("principlesTitle")}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(({ id, icon: Icon }) => (
            <div key={id} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand/12 text-brand ring-1 ring-brand/20">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-[17px] font-semibold text-white">
                {t(`principles.${id}.title`)}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">
                <RichText text={t(`principles.${id}.text`)} />
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection tone="band" eyebrow={t("promises.eyebrow")} title={t("promises.title")}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="grid gap-3 sm:grid-cols-2">
            {WONT.map((id) => (
              <li
                key={id}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/80"
              >
                {t(`promises.items.${id}`)}
              </li>
            ))}
          </ul>
          <Screenshot
            slot={{ key: "tracker", caption: t("promises.caption") }}
            className="mx-auto w-[200px]"
          />
        </div>
      </PageSection>

      <PageSection eyebrow={t("more.eyebrow")} title={t("more.title")}>
        <p className="max-w-3xl text-[17px] leading-[1.75] text-white/78">
          <RichText text={t("more.body")} />
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {MORE_CARDS.map(({ id, href }) => (
            <LinkCard
              key={id}
              href={href}
              title={t(`more.cards.${id}.title`)}
              description={t(`more.cards.${id}.description`)}
            />
          ))}
        </div>
      </PageSection>

      <DownloadCta title={t("cta.title")} text={t("cta.text")} placement="why_page" />
    </>
  );
}
