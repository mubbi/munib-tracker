import { APP_NAME } from "@munib-tracker/shared/constants";
import { Check, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { AchievementsSection } from "@/components/achievements-section";
import { AudioPlayerDemo } from "@/components/audio-player-demo";
import { CtaBand } from "@/components/cta-band";
import { FeaturePillars } from "@/components/feature-pillars";
import { ProgressDemo } from "@/components/progress-demo";
import { Section } from "@/components/section";
import { StoreBadges } from "@/components/store-badges";
import { Aurora, GridBackdrop } from "@/components/ui/backgrounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description: `Explore every feature in ${APP_NAME} — prayer tracking, qaza, dhikr, Qur'an, hadith, audio, and more.`,
};

const DETAILED_SECTIONS = [
  {
    title: "Home screen",
    items: [
      "Prayer times hero with time-of-day sky, mosque silhouette, moon phase, and optional weather",
      "Hijri date, live clock, and countdown to the next prayer",
      "A customizable grid of 30+ quick actions you can reorder and toggle",
      "Today's goal combining salah, zikr, and qaza with segmented progress",
      "Devotion block with your Noor level, continue card, and knowledge flash card",
    ],
  },
  {
    title: "Tracker",
    items: [
      "Five fard prayers (Fajr through Isha) with five statuses each, plus Witr tracked separately",
      "Sunnah prayers: Tahajjud, Ishraq, Duha, Tahiyyatul Masjid, Hajat & Istikhara",
      "Jama'ah (congregation) toggle and private per-prayer notes",
      "Progress ring, streak display, and confetti on a perfect day",
      "Excused-day picker for travel, illness, or hayd, plus haptic celebrations",
    ],
  },
  {
    title: "Qaza & make-up",
    items: [
      "Per-prayer counters that auto-sync from missed tracker entries",
      "Lifetime calculator to estimate a backlog, with a scholar disclaimer",
      "Daily-pace planner with an ETA to clear your qaza",
      "Missed-fast (roza) tracking and a history log of what you've completed",
    ],
  },
  {
    title: "Duas, adhkar, duroods & 99 Names",
    items: [
      "270+ duas across 16 categories, sourced from Hisnul Muslim",
      "50+ adhkar in 7 categories (morning, evening, after-salah, before sleep, and more)",
      "Salawat/duroods and the 99 Names of Allah with meanings and audio",
      "Favorites, per-category search, and a tactile tasbeeh with custom targets",
    ],
  },
  {
    title: "Learn: creed, prophets & history",
    items: [
      "Aqeedah course — 27 lessons on the articles of faith with a glossary",
      "Stories and lessons from the 25 named prophets, with a timeline",
      "Seerah timeline of 26 key events in the life of the Prophet ﷺ",
      "The major battles — lessons, key figures, verses, and a glossary",
      "Per-topic progress and Qur'an + graded-hadith citations throughout",
    ],
  },
  {
    title: "Learn: the Hereafter",
    items: [
      "Jannah — 51 topics, the eight gates, and a journey of deeds that lead there",
      "Jahannam — the seven names, major sins, and the door of repentance",
      "The Last Day — 29 lessons on the signs, the reckoning, the Scale, and the Bridge",
      "An interactive quiz, a timeline of the Hereafter, and preparation guidance",
    ],
  },
  {
    title: "Learn the Qur'an",
    items: [
      "A guided path: Read → Understand → Reflect → Memorize → Practice → Live",
      "28 Arabic letter cards, pronunciation drills, and the core tajweed rules",
      "Memorization plans, 14 themes, prophet stories, and vocabulary by root",
      "Daily tadabbur reflections and apply-it challenges, linked to the mushaf reader",
    ],
  },
  {
    title: "Worship guides (fiqh)",
    items: [
      "Salah guide — 24 lessons from why we pray to khushu' and making up missed prayers",
      "Taharah — 31 topics on wudu, ghusl, and tayammum with a daily checklist",
      "Zakat calculator with nisab thresholds, plus a checklist and evidence",
      "Interactive hajj step tracker, and travel, illness, and hayd rulings",
      "Ramadan fasting tracker with suhoor/iftar countdown and a tahajjud log",
    ],
  },
  {
    title: "Qur'an",
    items: [
      "All 114 surahs with continue-reading bookmark",
      "Arabic, transliteration toggle, and bundled translations",
      "On-demand Saheeh International and Clear Qur'an downloads",
      "Reciter selection with per-ayah and surah audio",
      "Ayah bookmarks, khatm and hifz tracking, and dedicated offline search",
    ],
  },
  {
    title: "Hadith",
    items: [
      "Offline: Nawawi's 40 and Riyad as-Salihin, plus a daily hadith",
      "On demand: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah",
      "Search, grades, narrators, bookmarks, and pagination",
    ],
  },
  {
    title: "Times, qibla & calendar",
    items: [
      "Prayer times from GPS or city search, with multiple calculation methods",
      "Per-prayer tuning, reminder offsets, and 12/24-hour formatting",
      "Qibla compass with alignment haptic on native",
      "Hijri and Gregorian calendar with Islamic events",
    ],
  },
  {
    title: "Notifications",
    items: [
      "Prayer reminders, qaza reminders, and after-azan alerts",
      "Morning, evening, before-sleep, before-prayer, and after-prayer adhkar",
      "Achievement milestone alerts",
      "Adhan preview playback and in-app notification center",
      "Bedtime setting for before-sleep reminders",
    ],
  },
  {
    title: "Personalization & privacy",
    items: [
      "Light, dark, or system theme with 12 accent presets and a custom hex picker",
      "Separate Arabic and translation font sizes; English, Arabic (RTL), and Urdu",
      "Full guest mode — no account needed for any feature",
      "Optional Google or Apple sign-in to sync across devices; export, import, and delete anytime",
    ],
  },
] as const;

export default function FeaturesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Aurora />
        <GridBackdrop className="opacity-50" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:px-8 md:py-24">
          <Reveal>
            <div className="flex justify-center">
              <Badge icon={<Sparkles className="size-3.5 text-brand" />}>Features</Badge>
            </div>
            <h1 className="mt-6 text-balance font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Everything {APP_NAME} <span className="text-gradient">can do</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Every screen is designed for calm confidence on your journey — offline-first,
              judgement-free, and entirely in your control.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={SITE_PATHS.download} size="lg">
                Get the app
              </Button>
              <Button href={SITE_PATHS.learn} variant="outline" size="lg">
                Explore the library
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section
        variant="muted"
        eyebrow="Interactive"
        title="Try it yourself"
        description="A taste of the core app experiences — right here in your browser."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ProgressDemo />
          <AudioPlayerDemo />
        </div>
        <div className="mt-10 flex justify-center">
          <StoreBadges layout="row" />
        </div>
      </Section>

      <FeaturePillars />

      <Section
        variant="muted"
        eyebrow="Screen by screen"
        title="A closer look at what you get"
        description="From the home hero to the learning library — the detail behind every area."
      >
        <Stagger className="grid gap-4 md:grid-cols-2">
          {DETAILED_SECTIONS.map((section) => (
            <StaggerItem key={section.title} className="min-h-full">
              <SpotlightCard className="h-full p-7">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted">
                      <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <AchievementsSection />
      <CtaBand />
    </>
  );
}
