import { APP_NAME } from "@munib-tracker/shared/constants";
import { Check, Clock } from "lucide-react";
import type { Metadata } from "next";
import { DownloadCta } from "@/components/content/download-cta";
import { FeatureIcon } from "@/components/content/feature-icon";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { StoreBadges } from "@/components/store-badges";
import { FEATURE_GROUPS, FEATURE_PAGES, featureHref } from "@/content/features";
import { PLANNED_FEATURES } from "@/content/munib-features";
import { pageMetadata } from "@/lib/seo";
import {
  graph,
  itemListSchema,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/structured-data";

const PATH = "/features";
const DESCRIPTION = `Every feature in ${APP_NAME}: Salah and Qaza tracking, zikr and tasbeeh, the Qur'an with AI recitation practice, learning, Salah times, widgets and watch apps.`;

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Features — Salah, Qaza, Zikr, Qur'an & AI Recitation Practice",
  description: DESCRIPTION,
});

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
    title: "Track Salah, Qaza, and remembrance",
    description:
      "An honest daily record: four statuses, Sunnah, make-up planning, and a calm place for duas and adhkar.",
    sections: [
      {
        title: "Home screen",
        items: [
          "Prayer times hero with time-of-day sky, Masjid silhouette, moon phase, and optional weather",
          "Hijri date, live clock, and countdown to the next prayer",
          "55 quick actions you can reorder and toggle — tracker, Qur'an, learn paths, and more",
          "Five toggleable home modules: continue reading, knowledge card, quick actions, Qaza, and today's schedule",
          "Today's goal combining Salah, zikr, and Qaza with segmented progress",
          "Devotion block with your Noor level, nine seasonal Hijri banners, and feature tours",
        ],
      },
      {
        title: "Tracker",
        items: [
          "Five fard prayers (Fajr through Isha) with four statuses each (completed, delayed, missed, Qaza), plus Witr tracked separately",
          "Sunnah prayers: Tahajjud, Ishraq, Duha, Tahiyyat al-Masjid, Hajat & Istikhara",
          "Rawatib tracker for the confirmed Sunnah, 12 or 10 rakahs by madhhab",
          "Salah focus lock that blocks the apps you choose until you pray (iPhone and Android)",
          "Jama'ah (congregation) toggle and private per-prayer notes",
          "Progress ring, streak display, and confetti on a perfect day",
          "Excused-day picker for travel, illness, or hayd, plus haptic celebrations",
          "Khushu' prayer journal with per-Salah ratings and notes",
        ],
      },
      {
        title: "Qaza & make-up",
        items: [
          "Per-prayer counters that auto-sync from missed tracker entries",
          "Lifetime calculator to estimate a backlog, with a scholar disclaimer",
          "Daily-pace planner with an ETA to clear your qaza",
          "Missed-fast tracking and a history log of what you've completed",
          "Import Salah history from CSV or JSON, with misses optionally added to Qaza",
          "Voluntary fasting planner: disliked days labelled, prohibited days blocked",
        ],
      },
      {
        title: "Reflection & family",
        items: [
          "Nightly muhasabah: a private one-minute review with gratitude, istighfar and an intention",
          "Weekly gentle coach: kind suggestions from simple rules on your device, no AI and no upload",
          "A daily Qur'an reading log, so the coach counts the days you really read",
          "Family ties reminders that keep you in touch with relatives, kept in your encrypted vault",
          "Family and kids mode: parent-managed profiles for children under 13, a kids Salah path and prophet stories; parents see fard Salah status only",
          'Accountability partner: share only a daily "done", never the details',
        ],
      },
      {
        title: "Duas, adhkar, duroods & 99 Names",
        items: [
          "279 duas across 16 categories, sourced from Hisnul Muslim",
          "60 adhkar in seven categories (morning, evening, after-Salah, before sleep, and more)",
          "Custom adhkar builder — add your own with Arabic, transliteration, translation, and speech-to-text",
          "Nine salawat/duroods and the 99 Names of Allah with meanings and audio",
          "Favorites, per-category search, and a tactile tasbeeh with custom targets",
          "Eight tasbeeh designs: Ring, sliding beads, digital clicker, Focus / Night, date pits, finger counting, geometric rosette and night sky, with optional sound and haptics",
          "Hands-free tasbeeh that counts each pause between spoken zikr, on your device (less accurate than tapping)",
          "A daily Sunnah habits checklist with the evidence for each habit",
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
          "Flash cards that review the Qur'an, hadith, the Names of Allah and every guide",
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
          "New Muslim guide — 18 topics for converts starting Salah, wudu, and daily worship",
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
          "Tajweed coaching: a spaced plan of tajweed sounds to practise from the ayahs you're working on, with drills and explanations (no scores)",
        ],
      },
      {
        title: "Worship guides (fiqh)",
        items: [
          "Salah guide — 24 lessons from why we pray to khushu' and making up missed prayers",
          "Taharah — 28 topics on wudu, ghusl, and tayammum with a daily checklist",
          "Zakat calculator with nisab thresholds, checklist, and evidence",
          "Friday / Jumu'ah learn hub with checklist and Today's Goal reminder",
          "Hajj & Umrah learn guide with separate rite checklists, plus travel, illness, and hayd rulings",
          "Ramadan fasting tracker with suhoor/iftar countdown and a Tahajjud log",
          "Dhul-Hijjah mode: daily deeds, the Day of Arafah, Takbir al-Tashriq by school and an udhiyah planner",
          "Umrah mode: a miqat check and tawaf and sa'i counters, step by step",
          "Inheritance (mirath) calculator for all four schools, with every share explained (educational, not a ruling)",
          "Islamic will (wasiyyah) builder within the one-third limit, exported as a PDF, plus a debts and trusts record with an optional encrypted document photo",
          "Sadaqah goals with a simple giving log, kept separate from zakat",
        ],
      },
    ],
  },
  {
    eyebrow: "Scripture & times",
    title: "Qur'an, hadith, and the prayer clock",
    description:
      "Read offline, listen with eight reciters, and keep prayer times and Qibla accurate wherever you are.",
    sections: [
      {
        title: "Qur'an",
        items: [
          "All 114 surahs, juz browser, and Madani 604-page mushaf layout",
          "Arabic, transliteration toggle, two bundled translations, and 23 more editions on demand",
          "Word-by-word reader, tajweed coloring, and 123 tafsir editions fetched on demand",
          "Eight reciters with per-ayah and surah audio; ayah / page / mushaf layouts",
          "Ayah bookmarks, khatm and hifz tracking, Arabic font picker, and offline search",
          "Your own ayah notes, highlights and tags, plus Arabic root-word search",
          "Group khatm with family or friends, split into 30 juz, 60 hizb or 114 surahs",
          "Verse Detector: find the surah and ayah from spoken or typed Arabic or English",
        ],
      },
      {
        title: "Qur'an practice with AI",
        items: [
          "An on-device AI listener follows your recitation word by word, with gentle try-again marks and no scores",
          "Follow, Check, Hide words, and Hide ayahs modes; tap any word to hear it",
          "Practise one ayah, the next five, a mushaf page, a whole surah, or a custom range; change the passage any time",
          "Revision queue spaced over 1, 3, 7, 14, and 30 days, with an optional reminder",
          "Audio is processed on your device and never recorded, stored, or uploaded; works offline after a one-time download",
          "Pronunciation check: after you read an ayah aloud, words that seem skipped or unclear are marked so you can listen again (no tajweed judging)",
          "Optional pronunciation drills in selected tajweed lessons",
        ],
      },
      {
        title: "Hadith",
        items: [
          "Offline: Nawawi's 40 and Riyad as-Salihin, plus a daily hadith",
          "On demand: Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah",
          "Search, grades, narrators, bookmarks, and pagination",
          "Hadith explanation (sharh) and full chains of narration (isnad)",
        ],
      },
      {
        title: "Times, Qibla & calendar",
        items: [
          "Prayer times from GPS or city search, with 13 calculation methods and Asr madhab",
          "Per-prayer minute offsets, high-latitude rules, reminder offsets, and 12/24-hour formatting",
          "Qibla compass with alignment haptic on native; Hijri ↔ Gregorian date converter",
          "Masjid finder from OpenStreetMap, with your home masjid's private iqamah times (typed or scanned from its timetable), an iqamah countdown and reminders",
          '"Prayed at the Masjid" on fard Salah, with a weekly count in your statistics',
          "Hijri date adjustment: a ±2-day offset plus per-month corrections",
          "My madhhab: Hanafi, Shafi'i, Maliki, Hanbali or all views, labelled in guides and calculators",
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
          "Prayer reminders, Sunnah alerts, Qaza reminders, and after-Adhan alerts",
          "Optional preferred-time reminders for schools that prefer a later Fajr, Asr or Isha",
          "Group khatm and partner dua alerts, and a weekly family digest with counts only, each with its own switch",
          "Morning, evening, before-sleep, before-prayer, and after-prayer adhkar",
          "Daily content and Friday (Jumu'ah / Kahf) reminders",
          "Play Adhan on prayer with five Adhan styles; achievement alerts",
          "iOS Live Activities / Dynamic Island for the next prayer; in-app notification center",
        ],
      },
      {
        title: "Native surfaces",
        items: [
          "Home-screen widgets for next prayer, schedule, and progress (iOS & Android)",
          "Apple Watch companion and Wear OS tile to view and mark salah",
          "Siri and Google Assistant shortcuts; long-press app-icon quick actions",
          "Haptics, magnetometer Qibla, and native tabs on mobile",
        ],
      },
      {
        title: "Personalization, backup & privacy",
        items: [
          "Light, dark, or system theme with 12 accent presets and a custom hex picker",
          "24 languages (UI) with RTL for Arabic, Urdu, Persian, Pashto, and Kurdish",
          "Arabic font families and separate Arabic / translation sizes; scripture locale separate from UI",
          "Customize home modules, quick actions, and library menu order",
          "Redesigned settings, grouped by topic and searchable",
          "Local backup export/import, offline download manager, and bulk prayer import",
          "Optional PIN / biometric app lock; full guest mode; Google, Apple, or Facebook sync when you want it",
          "An encrypted vault for your will, debts, muhasabah and family contacts, with opt-in end-to-end encrypted sync (passphrase and 24-word recovery code)",
        ],
      },
    ],
  },
] as const;

function DetailCard({ section }: { section: FeatureDetail }) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-[#0c2131]/45 p-6 md:p-7">
      <h4 className="font-display text-lg font-semibold text-white">{section.title}</h4>
      <ul className="mt-4 flex flex-col gap-2.5">
        {section.items.map((item) => (
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
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ path: PATH, name: `${APP_NAME} features`, description: DESCRIPTION }),
          softwareApplicationSchema(FEATURE_PAGES.map((f) => f.navLabel)),
          itemListSchema(
            FEATURE_PAGES.map((f) => ({ name: f.navLabel, href: featureHref(f.slug) })),
          ),
        )}
      />
      <PageHero
        crumbs={[{ name: "Features", href: PATH }]}
        eyebrow="Features"
        title={`Everything ${APP_NAME} can do`}
        intro={
          <p>
            Track your Salah, make up what you missed, remember Allah through the day, and read,
            learn and practise the Qur&apos;an. Free, offline-first, and with no ads.
          </p>
        }
        actions={<StoreBadges placement="features" />}
        screenshot={{ key: "home", caption: "The Munib Tracker home screen." }}
      />

      {FEATURE_GROUPS.map((group, i) => (
        <PageSection key={group.id} tone={i % 2 ? "band" : "default"} title={group.title}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_PAGES.filter((f) => f.group === group.id).map((f) => (
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
        id="complete-list"
        eyebrow="The complete list"
        title="Every feature, in detail"
        intro="For the full picture, here is everything in the app, grouped the way it appears in the app's Library."
      >
        <div className="flex flex-col gap-14">
          {FEATURE_CHAPTERS.map((chapter) => (
            <div key={chapter.eyebrow}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {chapter.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">{chapter.title}</h3>
              <p className="mt-2 max-w-2xl text-white/65">{chapter.description}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {chapter.sections.map((section) => (
                  <DetailCard key={section.title} section={section} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {PLANNED_FEATURES.length ? (
        <PageSection
          id="roadmap"
          tone="band"
          eyebrow="Coming soon"
          title="On the roadmap"
          intro="Features we're building next. They aren't in the app yet; each one moves into the list above when it ships."
        >
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLANNED_FEATURES.map((f) => (
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

      <DownloadCta
        title="Try every feature, free"
        text="No subscription, no ads and no account needed. Download Munib Tracker and start with today's Salah."
        placement="features"
      />
    </>
  );
}
