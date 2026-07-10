import { APP_NAME } from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpenCheck,
  Compass,
  Flame,
  GraduationCap,
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
import { CtaBand } from "@/components/cta-band";
import { Section } from "@/components/section";
import { Aurora, GridBackdrop } from "@/components/ui/backgrounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn",
  description: `The ${APP_NAME} learning library — aqeedah, the prophets, seerah, the Hereafter, Qur'an study, and fiqh guides, all referenced to Qur'an and authenticated hadith.`,
};

type Area = { icon: LucideIcon; title: string; meta: string; description: string };

const KNOWLEDGE: Area[] = [
  {
    icon: BookOpenCheck,
    title: "Aqeedah",
    meta: "27 lessons + glossary",
    description: "The six articles of faith, tawheed, and the names and attributes of Allah.",
  },
  {
    icon: Users,
    title: "The Prophets",
    meta: "25 prophets + timeline",
    description: "From Adam to Muhammad ﷺ, with the lessons carried by each story.",
  },
  {
    icon: Swords,
    title: "Seerah & battles",
    meta: "26-event life + battles",
    description: "The life of the Prophet ﷺ and the major campaigns, with leadership lessons.",
  },
  {
    icon: Sparkles,
    title: "Jannah",
    meta: "51 topics · 8 gates",
    description: "The reality of Paradise, its ranks, and the deeds that open its gates.",
  },
  {
    icon: Flame,
    title: "Jahannam",
    meta: "The seven names",
    description: "A balanced warning — and the ever-open door of sincere repentance.",
  },
  {
    icon: Scale,
    title: "The Last Day",
    meta: "29 lessons + quiz",
    description: "The signs, the reckoning, the Scale, and the Bridge — with an interactive quiz.",
  },
];

const QURAN: Area[] = [
  {
    icon: Languages,
    title: "Read the Arabic",
    meta: "28 letter cards",
    description: "Letters and their forms, pronunciation drills, and a learn-to-read path.",
  },
  {
    icon: ListChecks,
    title: "Tajweed",
    meta: "Core rules + drills",
    description: "Noon and meem sakinah, madd, qalqalah, ghunnah, and the rules of stopping.",
  },
  {
    icon: GraduationCap,
    title: "Memorize",
    meta: "Structured plans",
    description: "Hifz plans, revision, and khatm tracking to keep you moving.",
  },
  {
    icon: BookOpenCheck,
    title: "Understand & reflect",
    meta: "14 themes · stories",
    description: "Themes, prophet stories, vocabulary by root, and daily tadabbur prompts.",
  },
];

const FIQH: Area[] = [
  {
    icon: Compass,
    title: "Salah guide",
    meta: "24 lessons",
    description: "From why we pray to khushu' and making up missed prayers, step by step.",
  },
  {
    icon: WifiOff,
    title: "Taharah",
    meta: "31 topics + checklist",
    description: "Wudu, ghusl, and tayammum with a daily purification checklist.",
  },
  {
    icon: BarChart3,
    title: "Zakat",
    meta: "Calculator + evidence",
    description: "Nisab thresholds, an interactive calculator, and Qur'an and hadith evidence.",
  },
  {
    icon: ScrollText,
    title: "Hajj & Umrah",
    meta: "41-step tracker",
    description: "An interactive, offline checklist for every rite with location context.",
  },
  {
    icon: Users,
    title: "Travel, illness & hayd",
    meta: "Concessions",
    description:
      "Qasr and jam', worship when ill, and menstruation fiqh — worship at your capacity.",
  },
  {
    icon: Moon,
    title: "Ramadan, tahajjud & journal",
    meta: "Trackers + khushu'",
    description:
      "A fasting tracker with suhoor/iftar times, a night-prayer log, and a khushu' prayer journal.",
  },
];

const HOW: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BookOpenCheck,
    title: "Referenced to source",
    description: "Every claim is tied to the Qur'an and graded hadith, with collection and number.",
  },
  {
    icon: BarChart3,
    title: "Track your progress",
    description: "Per-topic completion means you always know exactly where you left off.",
  },
  {
    icon: Scale,
    title: "Quizzes & timelines",
    description: "Interactive quizzes and visual timelines make what you learn actually stick.",
  },
  {
    icon: WifiOff,
    title: "Fully offline",
    description: "The entire library works without a connection — read anywhere, anytime.",
  },
];

function AreaGrid({ areas }: { areas: Area[] }) {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {areas.map(({ icon: Icon, title, meta, description }) => (
        <StaggerItem key={title} className="min-h-full">
          <SpotlightCard className="h-full p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                <Icon className="size-5" />
              </span>
              <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs font-medium text-muted">
                {meta}
              </span>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          </SpotlightCard>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export default function LearnPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Aurora />
        <GridBackdrop className="opacity-50" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:px-8 md:py-24">
          <Reveal>
            <div className="flex justify-center">
              <Badge icon={<GraduationCap className="size-3.5 text-brand" />}>
                Learning library
              </Badge>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Learn your deen, <span className="text-gradient">deeply</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {APP_NAME} is more than a tracker. It&apos;s a structured, scholar-checked path
              through creed, history, the Qur&apos;an, and fiqh — with progress, quizzes, and
              citations on every lesson.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={SITE_PATHS.download} size="lg">
                Get the app
              </Button>
              <Button href={SITE_PATHS.features} variant="outline" size="lg">
                See all features
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="Islamic knowledge"
        title="Creed, history & the Hereafter"
        description="Ground your imaan in what you believe, where you come from, and where you're going."
      >
        <AreaGrid areas={KNOWLEDGE} />
      </Section>

      <Section
        variant="muted"
        eyebrow="The Qur'an"
        title="Read, understand, and memorize"
        description="A guided path from the Arabic letters to tajweed, memorization, and reflection."
      >
        <AreaGrid areas={QURAN} />
      </Section>

      <Section
        eyebrow="Fiqh & how-to"
        title="Practical worship guides"
        description="Clear, evidence-based guides with checklists, calculators, and trackers for everyday worship."
      >
        <AreaGrid areas={FIQH} />
      </Section>

      <Section
        variant="muted"
        eyebrow="Built on trust"
        title="Knowledge you can rely on"
        description="The library is designed to teach faithfully — cited, tracked, and always available."
      >
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map(({ icon: Icon, title, description }) => (
            <StaggerItem key={title} className="min-h-full">
              <SpotlightCard className="h-full p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <CtaBand />
    </>
  );
}
