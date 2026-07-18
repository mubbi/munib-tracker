"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Compass,
  GraduationCap,
  Hand,
  ListChecks,
  RotateCcw,
  ScrollText,
} from "lucide-react";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

type Tile = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  chips?: string[];
  href: string;
  span: string;
};

const TILES: Tile[] = [
  {
    id: "salah_tracking",
    icon: ListChecks,
    title: "Salah tracking that respects you",
    description:
      "Five fard prayers plus Witr and sunnah, each with completed, missed, delayed, or qaza — streaks, notes, and confetti on a perfect day.",
    chips: ["5 statuses", "Streaks", "Calendar", "Notes"],
    href: SITE_PATHS.features,
    span: "lg:col-span-3",
  },
  {
    id: "learn_deen",
    icon: GraduationCap,
    title: "Learn your deen",
    description:
      "A whole library: aqeedah, the prophets, seerah, the Hereafter, Qur'an study, and fiqh — with progress, quizzes, and citations.",
    chips: ["Aqeedah", "Seerah", "Tajweed", "Fiqh"],
    href: SITE_PATHS.learn,
    span: "lg:col-span-3",
  },
  {
    id: "qaza",
    icon: RotateCcw,
    title: "Qaza made doable",
    description: "Estimate a lifetime backlog and plan a daily pace with a real ETA to clear it.",
    href: SITE_PATHS.features,
    span: "lg:col-span-2",
  },
  {
    id: "dhikr_tasbeeh",
    icon: Hand,
    title: "Zikr & tasbeeh",
    description:
      "Morning, evening, and situational adhkar (54 items) with a tactile counter, custom targets, and a custom adhkar builder.",
    href: SITE_PATHS.features,
    span: "lg:col-span-2",
  },
  {
    id: "times_qibla",
    icon: Compass,
    title: "Times & qibla",
    description:
      "Accurate prayer times with 13 calculation methods, Hijri events, widgets, and a qibla compass.",
    href: SITE_PATHS.features,
    span: "lg:col-span-2",
  },
  {
    id: "quran_hadith",
    icon: BookOpen,
    title: "Qur'an & hadith, offline",
    description:
      "Surah, juz, and 604-page mushaf with eight reciters, 25 translation editions, and search — plus Nawawi 40 and Riyad as-Salihin bundled, six more collections on demand.",
    chips: ["604 pages", "123 tafsir", "8 reciters", "Search"],
    href: SITE_PATHS.features,
    span: "lg:col-span-3",
  },
  {
    id: "worship_guides",
    icon: ScrollText,
    title: "Step-by-step worship guides",
    description:
      "Learn how to pray, make wudu, calculate zakat, prepare for Friday, and perform hajj — practical fiqh with checklists, evidence, and a khushu' journal.",
    chips: ["Salah guide", "Friday", "Zakat calc", "60 hajj steps"],
    href: SITE_PATHS.learn,
    span: "lg:col-span-3",
  },
];

export function FeatureBento() {
  return (
    <Section
      id="features"
      variant="muted"
      eyebrow="Everything in one app"
      title="One calm home for worship and knowledge"
      description="Track, read, supplicate, and learn — thoughtfully designed and offline-first across iOS, Android, and web."
    >
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <StaggerItem key={tile.id} className={cn("min-h-full", tile.span)}>
              <SpotlightCard className="h-full">
                <TrackedLink
                  href={tile.href}
                  className="flex h-full flex-col p-7"
                  track="select_content"
                  contentType="feature_tile"
                  itemId={tile.id}
                  placement="home_bento"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {tile.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {tile.description}
                  </p>
                  {tile.chips ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {tile.chips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs font-medium text-muted"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </TrackedLink>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
