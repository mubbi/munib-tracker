import { APP_NAME } from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpenCheck,
  Calendar,
  Compass,
  Flame,
  GraduationCap,
  Hand,
  Heart,
  Languages,
  ListChecks,
  Moon,
  Scale,
  ScrollText,
  Sparkles,
  Swords,
  Users,
  WifiOff,
} from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { PageAtmosphere, PageMasthead } from "@/components/content-page";
import { CtaBand } from "@/components/cta-band";
import { Section } from "@/components/section";
import { TrackedButton } from "@/components/tracked-button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";
import type { Messages } from "@/messages";

const PATH = "/learn";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("learn");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

type AreaId = keyof Messages["learn"]["areas"];
type Area = { id: AreaId; icon: LucideIcon };

/** Library areas per section; copy is keyed by id in the `learn` catalog. */
const KNOWLEDGE: readonly Area[] = [
  { id: "aqeedah", icon: BookOpenCheck },
  { id: "prophets", icon: Users },
  { id: "seerah", icon: Swords },
  { id: "jannah", icon: Sparkles },
  { id: "jahannam", icon: Flame },
  { id: "lastDay", icon: Scale },
];

const QURAN: readonly Area[] = [
  { id: "readArabic", icon: Languages },
  { id: "tajweed", icon: ListChecks },
  { id: "memorize", icon: GraduationCap },
  { id: "understand", icon: BookOpenCheck },
];

const FIQH: readonly Area[] = [
  { id: "salahGuide", icon: Compass },
  { id: "taharah", icon: WifiOff },
  { id: "zakat", icon: BarChart3 },
  { id: "hajj", icon: ScrollText },
  { id: "concessions", icon: Users },
  { id: "ramadan", icon: Moon },
  { id: "friday", icon: Calendar },
  { id: "fasts", icon: Moon },
  { id: "janazah", icon: Heart },
];

const MORE: readonly Area[] = [
  { id: "sahaba", icon: Users },
  { id: "history", icon: ScrollText },
  { id: "learnDua", icon: Hand },
  { id: "newMuslim", icon: Heart },
  { id: "laylatAlQadr", icon: Moon },
  { id: "eid", icon: Calendar },
  { id: "ruqyah", icon: BookOpenCheck },
  { id: "finance", icon: BarChart3 },
  { id: "dailyHadith", icon: ScrollText },
  { id: "flashCards", icon: GraduationCap },
];

const HOW: readonly { id: keyof Messages["learn"]["how"]; icon: LucideIcon }[] = [
  { id: "referenced", icon: BookOpenCheck },
  { id: "progress", icon: BarChart3 },
  { id: "quizzes", icon: Scale },
  { id: "offline", icon: WifiOff },
];

function AreaGrid({ areas }: { areas: readonly Area[] }) {
  const t = useTranslations("learn");
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {areas.map(({ id, icon: Icon }) => (
        <StaggerItem key={id} className="min-h-full">
          <SpotlightCard className="h-full p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                <Icon className="size-5" />
              </span>
              <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs font-medium text-muted">
                {t(`areas.${id}.meta`)}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
              {t(`areas.${id}.title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t(`areas.${id}.description`)}
            </p>
          </SpotlightCard>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default function LearnPage() {
  const t = useTranslations("learn");
  return (
    <div className="relative flex flex-1 flex-col">
      <PageAtmosphere />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-8 md:px-8 md:pt-12">
        <PageMasthead
          path={PATH}
          eyebrow={t("eyebrow")}
          title={t("title")}
          intro={t("intro", { appName: APP_NAME })}
          actions={
            <>
              <TrackedButton href={SITE_PATHS.download} size="lg" cta="get_app" placement="learn">
                {t("getApp")}
              </TrackedButton>
              <TrackedButton
                href={SITE_PATHS.features}
                variant="outline"
                size="lg"
                cta="explore_features"
                placement="learn"
              >
                {t("seeFeatures")}
              </TrackedButton>
            </>
          }
        />
      </div>

      <Section
        align="left"
        eyebrow={t("sections.creed.eyebrow")}
        id="creed"
        className="scroll-mt-24"
        title={t("sections.creed.title")}
        description={t("sections.creed.description")}
      >
        <AreaGrid areas={KNOWLEDGE} />
      </Section>

      <Section
        align="left"
        variant="muted"
        eyebrow={t("sections.quran.eyebrow")}
        id="quran"
        className="scroll-mt-24"
        title={t("sections.quran.title")}
        description={t("sections.quran.description")}
      >
        <AreaGrid areas={QURAN} />
      </Section>

      <Section
        align="left"
        eyebrow={t("sections.worshipGuides.eyebrow")}
        id="worship-guides"
        className="scroll-mt-24"
        title={t("sections.worshipGuides.title")}
        description={t("sections.worshipGuides.description")}
      >
        <AreaGrid areas={FIQH} />
      </Section>

      <Section
        align="left"
        variant="muted"
        eyebrow={t("sections.lifeGuides.eyebrow")}
        id="life-guides"
        className="scroll-mt-24"
        title={t("sections.lifeGuides.title")}
        description={t("sections.lifeGuides.description")}
      >
        <AreaGrid areas={MORE} />
      </Section>

      <Section
        align="left"
        eyebrow={t("sections.trust.eyebrow")}
        title={t("sections.trust.title")}
        description={t("sections.trust.description")}
      >
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map(({ id, icon: Icon }) => (
            <StaggerItem key={id} className="min-h-full">
              <SpotlightCard className="h-full p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {t(`how.${id}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`how.${id}.description`)}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand placement="learn" />
    </div>
  );
}
