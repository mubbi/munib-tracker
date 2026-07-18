import { APP_NAME } from "@munib-tracker/shared/constants";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { AchievementsSection } from "@/components/achievements-section";
import { PageAtmosphere, PageMasthead } from "@/components/content-page";
import { CtaBand } from "@/components/cta-band";
import { FeaturePillars } from "@/components/feature-pillars";
import { Section } from "@/components/section";
import { TrackedButton } from "@/components/tracked-button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description: `Explore every feature in ${APP_NAME} — salah tracking, qaza, 270 duas, 54 adhkar, Qur'an (25 translations, 123 tafsir), hadith, 350+ learn topics, widgets, and more.`,
};

type FeatureDetail = {
  title: string;
  items: readonly string[];
};

type FeatureChapter = {
  eyebrow: string;
  title: string;
  description: string;
  sections: readonly FeatureDetail[];
};

const FEATURE_CHAPTERS: readonly FeatureChapter[] = [
  {
    eyebrow: "Daily worship",
    title: "Track salah, qaza, and remembrance",
    description:
      "An honest daily record — five statuses, sunnah, make-up planning, and a calm place for duas and adhkar.",
    sections: [
      {
        title: "Home screen",
        items: [
          "Prayer times hero with time-of-day sky, mosque silhouette, moon phase, and optional weather",
          "Hijri date, live clock, and countdown to the next prayer",
          "43 quick actions you can reorder and toggle — tracker, Qur'an, learn paths, and more",
          "Five toggleable home modules: continue reading, knowledge card, quick actions, qaza, and today's schedule",
          "Today's goal combining salah, zikr, and qaza with segmented progress",
          "Devotion block with your Noor level, nine seasonal Hijri banners, and feature tours",
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
          "Khushu' prayer journal with per-salah ratings and notes",
        ],
      },
      {
        title: "Qaza & make-up",
        items: [
          "Per-prayer counters that auto-sync from missed tracker entries",
          "Lifetime calculator to estimate a backlog, with a scholar disclaimer",
          "Daily-pace planner with an ETA to clear your qaza",
          "Missed-fast (roza) tracking and a history log of what you've completed",
          "Bulk prayer import from CSV or text, with optional qaza increment",
        ],
      },
      {
        title: "Duas, adhkar, duroods & 99 Names",
        items: [
          "270 duas across 16 categories, sourced from Hisnul Muslim",
          "54 adhkar in seven categories (morning, evening, after-salah, before sleep, and more)",
          "Custom adhkar builder — add your own with Arabic, transliteration, translation, and speech-to-text",
          "Nine salawat/duroods and the 99 Names of Allah with meanings and audio",
          "Favorites, per-category search, and a tactile tasbeeh with custom targets",
        ],
      },
    ],
  },
  {
    eyebrow: "Learn",
    title: "Knowledge and fiqh, cited and offline",
    description:
      "A structured library for creed, history, the Hereafter, Qur'an study, and practical worship guides.",
    sections: [
      {
        title: "Creed, prophets & history",
        items: [
          "Aqeedah course — 24 topics on the articles of faith with a glossary",
          "Stories and lessons from the 25 named prophets, with a timeline",
          "Seerah timeline of 30 key events in the life of the Prophet ﷺ",
          "21 major battles — lessons, key figures, verses, and a glossary",
          "Per-topic progress and Qur'an + graded-hadith citations throughout",
        ],
      },
      {
        title: "The Hereafter",
        items: [
          "Jannah — 45 topics, the eight gates, and a journey of deeds that lead there",
          "Jahannam — 16 topics on its names, major sins, and the door of repentance",
          "The Last Day — 20 lessons on the signs, the reckoning, the Scale, and the Bridge",
          "An interactive quiz, a timeline of the Hereafter, and preparation guidance",
        ],
      },
      {
        title: "Companions & life guides",
        items: [
          "Sahaba — 30 companions with virtues, lessons, and citations",
          "Early Islamic history — 15 topics from the Khulafa Rashidun through the Umayyads",
          "Learn dua — 46 topics on when and how to supplicate, with Arabic and evidence",
          "New Muslim guide — 18 topics for converts starting salah, wudu, and daily worship",
          "Laylat al-Qadr (8), Eid (6), ruqyah (8), and Islamic finance education (14)",
        ],
      },
      {
        title: "Learn the Qur'an",
        items: [
          "A guided path: Read → Understand → Reflect → Memorize → Practice → Live",
          "28 Arabic letter cards, pronunciation drills, and the core tajweed rules",
          "Memorization plans, 13 themes, prophet stories, and vocabulary by root",
          "Daily tadabbur reflections and apply-it challenges, linked to the mushaf reader",
        ],
      },
      {
        title: "Worship guides (fiqh)",
        items: [
          "Salah guide — 24 lessons from why we pray to khushu' and making up missed prayers",
          "Taharah — 28 topics on wudu, ghusl, and tayammum with a daily checklist",
          "Zakat calculator with nisab thresholds, checklist, and evidence",
          "Friday / Jumu'ah learn hub with checklist and Today's Goal reminder",
          "60-step interactive hajj & umrah tracker, plus travel, illness, and hayd rulings",
          "Ramadan fasting tracker with suhoor/iftar countdown and a tahajjud log",
        ],
      },
    ],
  },
  {
    eyebrow: "Scripture & times",
    title: "Qur'an, hadith, and the prayer clock",
    description:
      "Read offline, listen with eight reciters, and keep prayer times and qibla accurate wherever you are.",
    sections: [
      {
        title: "Qur'an",
        items: [
          "All 114 surahs, juz browser, and Madani 604-page mushaf layout",
          "Arabic, transliteration toggle, two bundled translations, and 23 more editions on demand",
          "Word-by-word reader, tajweed coloring, and 123 tafsir editions fetched on demand",
          "Eight reciters with per-ayah and surah audio; ayah / page / mushaf layouts",
          "Ayah bookmarks, khatm and hifz tracking, Arabic font picker, and offline search",
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
          "Prayer times from GPS or city search, with 13 calculation methods and Asr madhab",
          "Per-prayer minute offsets, high-latitude rules, reminder offsets, and 12/24-hour formatting",
          "Qibla compass with alignment haptic on native; Hijri ↔ Gregorian date converter",
          "Hijri and Gregorian calendar with Islamic events and moon phase",
        ],
      },
    ],
  },
  {
    eyebrow: "Platform",
    title: "Reminders, widgets, and your privacy",
    description:
      "Native companions on phone and watch, gentle notifications, and full control over sync and lock.",
    sections: [
      {
        title: "Notifications",
        items: [
          "Prayer reminders, sunnah alerts, qaza reminders, and after-adhan alerts",
          "Morning, evening, before-sleep, before-prayer, and after-prayer adhkar",
          "Daily content and Friday (Jumu'ah / Kahf) reminders",
          "Play adhan on prayer with five adhan styles; achievement alerts",
          "iOS Live Activities / Dynamic Island for the next prayer; in-app notification center",
        ],
      },
      {
        title: "Native surfaces",
        items: [
          "Home-screen widgets for next prayer, schedule, and progress (iOS & Android)",
          "Apple Watch companion and Wear OS tile to view and mark salah",
          "Siri and Google Assistant shortcuts; long-press app-icon quick actions",
          "Haptics, magnetometer qibla, and native tabs on mobile",
        ],
      },
      {
        title: "Personalization, backup & privacy",
        items: [
          "Light, dark, or system theme with 12 accent presets and a custom hex picker",
          "23 languages (UI) with RTL for Arabic, Urdu, Persian, Pashto, and Kurdish",
          "Arabic font families and separate Arabic / translation sizes; scripture locale separate from UI",
          "Customize home modules, quick actions, and library menu order",
          "Local backup export/import, offline download manager, and bulk prayer import",
          "Optional PIN / biometric app lock; full guest mode; Google, Apple, or Facebook sync when you want it",
        ],
      },
    ],
  },
] as const;

function DetailCard({ section }: { section: FeatureDetail }) {
  return (
    <SpotlightCard className="h-full p-6 md:p-7">
      <h3 className="font-display text-lg font-semibold text-white">{section.title}</h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {section.items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/60">
            <Check className="mt-0.5 size-4 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}

export default function FeaturesPage() {
  return (
    <div className="relative flex flex-1 flex-col">
      <PageAtmosphere />

      {/* Page hero — one job: brand the page and offer two clear next steps */}
      <div className="relative mx-auto w-full max-w-6xl px-6 pt-8 md:px-8 md:pt-14">
        <PageMasthead
          eyebrow="Features"
          title={`Everything ${APP_NAME} can do`}
          intro="Every screen is designed for calm confidence on your journey — offline-first, judgement-free, and entirely in your control."
          actions={
            <>
              <TrackedButton
                href={SITE_PATHS.download}
                size="lg"
                cta="get_app"
                placement="features"
              >
                Get the app
              </TrackedButton>
              <TrackedButton
                href={SITE_PATHS.learn}
                variant="outline"
                size="lg"
                cta="explore_library"
                placement="features"
              >
                Explore the library
              </TrackedButton>
            </>
          }
        />
      </div>

      {/* Chapter 1 — pillars at a glance */}
      <FeaturePillars align="left" eyebrow="At a glance" />

      {/* Chapter 2+ — thematic deep dives */}
      {FEATURE_CHAPTERS.map((chapter, index) => (
        <Section
          key={chapter.eyebrow}
          align="left"
          variant={index % 2 === 0 ? "muted" : "default"}
          eyebrow={chapter.eyebrow}
          title={chapter.title}
          description={chapter.description}
        >
          <Stagger
            className={
              chapter.sections.length >= 4
                ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
                : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            }
          >
            {chapter.sections.map((section) => (
              <StaggerItem key={section.title} className="min-h-full">
                <DetailCard section={section} />
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      ))}

      <AchievementsSection align="left" />

      {/* Closing download band owns store badges — keeps the hero uncluttered */}
      <CtaBand />
    </div>
  );
}
