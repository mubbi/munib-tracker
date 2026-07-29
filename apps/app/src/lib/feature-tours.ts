import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

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

export function getFeatureTour(id: string): FeatureTour | undefined {
  return FEATURE_TOURS.find((tour) => tour.id === id);
}
