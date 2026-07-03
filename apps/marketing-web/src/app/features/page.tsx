import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { AchievementsSection } from "@/components/achievements-section";
import { AudioPlayerDemo } from "@/components/audio-player-demo";
import { CtaBand } from "@/components/cta-band";
import { FeaturePillars } from "@/components/feature-pillars";
import { ProgressDemo } from "@/components/progress-demo";
import { Section } from "@/components/section";
import { StoreBadges } from "@/components/store-badges";

export const metadata: Metadata = {
  title: "Features",
  description: `Explore every feature in ${APP_NAME} — prayer tracking, qaza, dhikr, Qur'an, hadith, audio, and more.`,
};

const DETAILED_SECTIONS = [
  {
    title: "Home screen",
    items: [
      "Prayer times hero with time-of-day sky, mosque silhouette, and moon phase",
      "Hijri date, live clock, and countdown to the next prayer",
      "Eleven quick actions: Tracker, Zikr, Tasbeeh, Qaza, Qur'an, Hadith, Duas, 99 Names, Qibla, Calendar, Stats",
      "Today's goal combining salah and dhikr with segmented progress",
      "Qaza card, stat row, and gentle reminder copy",
    ],
  },
  {
    title: "Tracker",
    items: [
      "Fajr, Dhuhr, Asr, Maghrib, Isha, and Witr with five statuses each",
      "Sunnah prayers: Tahajjud, Ishraq, Duha, Tahiyyatul Masjid, Hajat & Istikhara",
      "Private per-prayer notes",
      "Progress ring, streak display, and confetti on a perfect day",
      "Achievement unlock celebrations with haptic feedback",
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
    title: "Qur'an",
    items: [
      "All 114 surahs with continue-reading bookmark",
      "Arabic, transliteration toggle, and bundled translation",
      "On-demand Saheeh International and Clear Qur'an downloads",
      "Reciter selection with per-ayah and surah audio",
      "Ayah bookmarks, share, and dedicated offline search",
    ],
  },
  {
    title: "Hadith",
    items: [
      "Offline: Nawawi's 40 and Riyad as-Salihin",
      "On demand: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah",
      "Search, grades, narrators, bookmarks, and pagination",
    ],
  },
] as const;

export default function FeaturesPage() {
  return (
    <>
      <Section
        eyebrow="Features"
        title={APP_TAGLINE}
        description="Every screen is designed for calm confidence on your journey — offline-first, judgement-free, and entirely in your control."
        className="pt-12 md:pt-16"
      />
      <Section
        variant="muted"
        title="Try it yourself"
        description="Interactive previews of core app experiences."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <ProgressDemo />
          <AudioPlayerDemo />
        </div>
        <div className="mt-10 flex justify-center">
          <StoreBadges layout="row" />
        </div>
      </Section>
      <FeaturePillars />
      <Section title="Screen by screen" description="A closer look at what you get.">
        <div className="flex flex-col gap-8">
          {DETAILED_SECTIONS.map((section) => (
            <article
              key={section.title}
              className="rounded-[var(--radius-card)] border border-border/50 bg-card p-8"
            >
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
      <AchievementsSection />
      <CtaBand />
    </>
  );
}
