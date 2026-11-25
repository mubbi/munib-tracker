import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

import { isTV } from "@/lib/platform/is-tv";

/**
 * In-app feature tours (NF-2.24) — a step-through guide to the app's main areas,
 * beyond the one-time onboarding intro. Each step is data only; titles/bodies are
 * i18n keys under `tour.steps.<id>.*`, and an optional route lets the step deep-
 * link the user straight into the feature.
 */
export interface FeatureTourStep {
  id: string;
  icon: SymbolViewProps["name"];
  /** Optional deep-link the "Go there" action opens. */
  route?: Href;
  /**
   * Needs the on-device microphone listener (practice, recite-to-find,
   * hands-free tasbeeh): left out on TV, which has no microphone path.
   */
  phoneOnly?: boolean;
}

export interface FeatureTour {
  id: string;
  steps: FeatureTourStep[];
}

export const EXPLORE_TOUR: FeatureTour = {
  id: "explore",
  steps: [
    {
      id: "tracker",
      icon: { ios: "checklist", android: "checklist", web: "checklist" },
      route: "/tracker",
    },
    {
      id: "prayerTimes",
      icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
      route: "/schedule" as Href,
    },
    {
      id: "quran",
      icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
      route: "/quran",
    },
    {
      id: "qibla",
      icon: { ios: "location.north.line.fill", android: "explore", web: "explore" },
      route: "/qibla",
    },
    {
      id: "adhkar",
      icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
      route: "/zikr",
    },
    {
      // NF-3.1: the sunnah rawatib chips under each fard on the tracker.
      id: "rawatib",
      icon: { ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" },
      route: "/rawatib" as Href,
    },
    {
      // NF-3.5: a small, personal list of daily sunnahs with 30-day dots.
      id: "sunnahHabits",
      icon: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
      route: "/habits" as Href,
    },
    {
      // NF-3.3: Dhul-Hijjah mode — the ten days, Arafah, Takbir al-Tashriq, udhiyah.
      id: "dhulHijjah",
      icon: { ios: "star.circle.fill", android: "stars", web: "stars" },
      route: "/dhul-hijjah" as Href,
    },
    {
      // NF-3.4: Umrah mode — live steps, tawaf / sa'i counters, miqat alert.
      id: "umrahMode",
      icon: { ios: "arrow.triangle.2.circlepath", android: "autorenew", web: "autorenew" },
      route: "/umrah" as Href,
    },
    {
      // NF-3.19: counter designs (Ring, sliding beads, clicker, Focus / Night).
      id: "tasbeehStyles",
      icon: { ios: "paintpalette.fill", android: "palette", web: "palette" },
      route: "/tasbeeh/free",
    },
    {
      // NF-3.21: personal notes, highlights and tags on any ayah.
      id: "quranNotes",
      icon: { ios: "note.text", android: "sticky_note_2", web: "sticky_note_2" },
      route: "/quran/notes" as Href,
    },
    {
      // NF-3.22: Arabic root-word search (letters → every derived word, by lemma).
      id: "quranRoots",
      icon: { ios: "character.book.closed.fill", android: "translate", web: "translate" },
      route: "/quran/search?mode=root" as Href,
    },
    {
      // D68: recite with the on-device listener — follow, check, revise due ayahs.
      id: "quranPractice",
      icon: { ios: "mic.fill", android: "mic", web: "mic" },
      route: "/quran/practice" as Href,
      phoneOnly: true,
    },
    {
      // D68: recite a few words to find the ayah (verse detector, Recite mode).
      id: "reciteToFind",
      icon: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
      route: "/verse-detector?mode=recite" as Href,
      phoneOnly: true,
    },
    {
      // D69: after-Salah 33 · 33 · 34 that counts hands-free and moves on by itself.
      id: "handsFreeSequence",
      icon: { ios: "circle.dotted", android: "radio_button_checked", web: "radio_button_checked" },
      route: "/tasbeeh/sequence" as Href,
      phoneOnly: true,
    },
    {
      // NF-3.2: voluntary fasting — Mon/Thu, Arafah, Ashura, Shawwal six + days not to fast.
      id: "voluntaryFasting",
      icon: { ios: "moon.haze.fill", android: "nights_stay", web: "nights_stay" },
      route: "/fasting" as Href,
    },
    {
      // NF-3.6 / NF-3.7: private nightly muhasabah + family-ties reminders (vault).
      id: "selfReview",
      icon: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
      route: "/muhasabah",
    },
    {
      // NF-3.14: weekly gentle coach — a few kind steps from your own tracking, on-device.
      id: "coach",
      icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
      route: "/coach" as Href,
    },
    {
      // NF-3.8 / NF-3.9: private debts & trusts record + wasiyyah builder (vault).
      id: "debtsWasiyyah",
      icon: { ios: "scroll.fill", android: "history_edu", web: "history_edu" },
      route: "/wasiyyah" as Href,
    },
    {
      // NF-3.10: inheritance calculator for all four schools, every share explained.
      id: "mirath",
      icon: { ios: "chart.pie.fill", android: "account_tree", web: "account_tree" },
      route: "/mirath" as Href,
    },
    {
      // NF-3.17 / NF-3.18: accountability partner (only "done" shared) + group khatm.
      id: "partnerKhatm",
      icon: { ios: "person.2.fill", android: "group", web: "group" },
      route: "/khatm-groups" as Href,
    },
    {
      // NF-3.16: family circle — parents see only the five fard statuses; kids mode for children.
      id: "familyKids",
      icon: {
        ios: "figure.2.and.child.holdinghands",
        android: "family_restroom",
        web: "family_restroom",
      },
      route: "/family" as Href,
    },
    {
      // NF-3.13: pause chosen apps around each Salah until you pray (native block / soft prompt).
      id: "focusLock",
      icon: { ios: "moon.circle.fill", android: "do_not_disturb_on", web: "do_not_disturb_on" },
      route: "/focus-lock" as Href,
    },
    {
      // NF-3.11: nearby masjids from OpenStreetMap, a home masjid and your own iqamah times.
      id: "masjids",
      icon: { ios: "building.columns.fill", android: "mosque", web: "mosque" },
      route: "/masjids" as Href,
    },
    {
      id: "personalize",
      icon: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
      route: "/settings",
    },
  ],
};

export const JANNAH_TOUR: FeatureTour = {
  id: "jannah",
  steps: [
    {
      id: "about",
      icon: { ios: "leaf.fill", android: "park", web: "park" },
      route: "/jannah",
    },
    {
      id: "paths",
      icon: {
        ios: "point.topleft.down.curvedto.point.bottomright.up",
        android: "route",
        web: "route",
      },
      route: "/jannah/tawheed" as Href,
    },
    {
      id: "journey",
      icon: { ios: "chart.line.uptrend.xyaxis", android: "trending_up", web: "trending_up" },
      route: "/jannah/journey",
    },
  ],
};

export const FEATURE_TOURS: FeatureTour[] = [EXPLORE_TOUR, JANNAH_TOUR];

/** The tour as this device shows it: TV drops the `phoneOnly` (microphone) stops. */
export function tourForDevice(tour: FeatureTour, tv: boolean = isTV()): FeatureTour {
  if (!tv || !tour.steps.some((step) => step.phoneOnly)) return tour;
  return { ...tour, steps: tour.steps.filter((step) => !step.phoneOnly) };
}

export function getFeatureTour(id: string): FeatureTour | undefined {
  const tour = FEATURE_TOURS.find((t) => t.id === id);
  return tour ? tourForDevice(tour) : undefined;
}
