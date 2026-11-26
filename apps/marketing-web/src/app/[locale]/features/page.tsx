import { APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";
import { Check, Clock } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { DeviceLineup } from "@/components/content/device-lineup";
import { DownloadCta } from "@/components/content/download-cta";
import { FeatureIcon } from "@/components/content/feature-icon";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { StoreBadges } from "@/components/store-badges";
import { DEVICE_ROWS, MUNIB_DEVICES } from "@/content/compare/devices";
import { FEATURE_GROUPS, featureHref, getFeaturePages } from "@/content/features";
import { getFeatureInventory } from "@/content/munib-features";
import { pageMetadata } from "@/lib/seo";
import {
  graph,
  itemListSchema,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/structured-data";
import type { Messages } from "@/messages";

const PATH = "/features";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("featuresHub");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description", { appName: APP_NAME }),
  });
}

type SectionId = keyof Messages["featuresHub"]["sections"];

/**
 * "Every feature, in detail": chapters and their cards, grouped the way they
 * appear in the app's Library. Copy is keyed by id in the `featuresHub` catalog
 * (`chapters.<id>`, `sections.<id>.title` / `.items`).
 */
const FEATURE_CHAPTERS = [
  { id: "daily", sections: ["home", "tracker", "qaza", "reflection", "duas"] },
  { id: "learn", sections: ["creed", "hereafter", "companions", "learnQuran", "fiqh"] },
  { id: "scripture", sections: ["quran", "practice", "hadith", "times"] },
  { id: "platform", sections: ["notifications", "nativeSurfaces", "personalization"] },
] as const satisfies readonly {
  id: keyof Messages["featuresHub"]["chapters"];
  sections: readonly SectionId[];
}[];

/** Card items; plain strings (`t.raw`), except the dua count line, which needs ICU. */
function DetailCard({ id }: { id: SectionId }) {
  const t = useTranslations("featuresHub");
  const items: readonly string[] = [
    ...(id === "duas" ? [t("sections.duas.countItem", { duaCount: DUA_COUNT })] : []),
    ...(t.raw(`sections.${id}.items`) as readonly string[]),
  ];
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-[#0c2131]/45 p-6 md:p-7">
      <h4 className="font-display text-lg font-semibold text-white">{t(`sections.${id}.title`)}</h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/68">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FeaturesPage() {
  const t = useTranslations("featuresHub");
  const tSchema = useTranslations("structuredData");
  const tMeta = useTranslations("metadata");
  const locale = useLocale();
  const features = getFeaturePages(locale);
  const planned = getFeatureInventory(locale).flatMap((g) =>
    g.items.filter((i) => i.status === "planned"),
  );
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({
            locale,
            path: PATH,
            name: t("schemaName", { appName: APP_NAME }),
            description: t("meta.description", { appName: APP_NAME }),
          }),
          softwareApplicationSchema({
            locale,
            description: tSchema("siteDescription", { appName: APP_NAME }),
            slogan: tMeta("tagline"),
            featureList: features.map((f) => f.navLabel),
          }),
          itemListSchema(
            features.map((f) => ({ name: f.navLabel, href: featureHref(f.slug) })),
            locale,
          ),
        )}
      />
      <PageHero
        crumbs={[{ name: t("crumb"), href: PATH }]}
        eyebrow={t("eyebrow")}
        title={t("title", { appName: APP_NAME })}
        intro={<p>{t("intro")}</p>}
        actions={<StoreBadges placement="features" />}
        screenshot={{ key: "home", caption: t("heroCaption") }}
      />

      {FEATURE_GROUPS.map((group, i) => (
        <PageSection
          key={group.id}
          tone={i % 2 ? "band" : "default"}
          title={t(`groups.${group.id}`)}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features
              .filter((f) => f.group === group.id)
              .map((f) => (
                <LinkCard
                  key={f.slug}
                  href={featureHref(f.slug)}
                  title={f.navLabel}
                  description={f.description}
                  icon={<FeatureIcon icon={f.icon} />}
                />
              ))}
          </div>
        </PageSection>
      ))}

      <PageSection
        id="available-on"
        tone="band"
        eyebrow={t("availableOn.eyebrow")}
        title={t("availableOn.title")}
        intro={t("availableOn.intro")}
      >
        <DeviceLineup className="mb-14" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEVICE_ROWS.map(({ key, feature }) => {
            const value = MUNIB_DEVICES[key];
            const note = "note" in value ? value.note : undefined;
            const companion = "status" in value && value.status === "partial";
            return (
              <li
                key={key}
                className="flex gap-3 rounded-2xl border border-white/10 bg-[#0c2131] p-4"
              >
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  <span className="block text-[15px] font-semibold text-white">
                    {feature}
                    {companion ? (
                      <span className="ms-2 text-xs font-medium text-gold">
                        {t("availableOn.companion")}
                      </span>
                    ) : null}
                  </span>
                  {note ? (
                    <span className="mt-0.5 block text-[13px] leading-snug text-white/65">
                      {note}
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      </PageSection>

      <PageSection
        id="complete-list"
        eyebrow={t("completeList.eyebrow")}
        title={t("completeList.title")}
        intro={t("completeList.intro")}
      >
        <div className="flex flex-col gap-14">
          {FEATURE_CHAPTERS.map((chapter) => (
            <div key={chapter.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t(`chapters.${chapter.id}.eyebrow`)}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">
                {t(`chapters.${chapter.id}.title`)}
              </h3>
              <p className="mt-2 max-w-2xl text-white/65">
                {t(`chapters.${chapter.id}.description`)}
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {chapter.sections.map((id) => (
                  <DetailCard key={id} id={id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {planned.length ? (
        <PageSection
          id="roadmap"
          tone="band"
          eyebrow={t("roadmap.eyebrow")}
          title={t("roadmap.title")}
          intro={t("roadmap.intro")}
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {planned.map((f) => (
              <li
                key={f.name}
                className="flex gap-3 rounded-2xl border border-white/10 bg-[#0c2131] p-4"
              >
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-sky-300" />
                <span>
                  <span className="block text-[15px] font-semibold text-white">{f.name}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-white/65">
                    {f.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}

      <DownloadCta title={t("cta.title")} text={t("cta.text")} placement="features" />
    </>
  );
}
