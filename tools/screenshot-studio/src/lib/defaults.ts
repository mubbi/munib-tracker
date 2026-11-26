import { DEFAULT_THEME_ID, DEVICE_PLATFORM, PROJECT_SCHEMA_VERSION } from "./constants";
import { DEFAULT_LOCALE } from "./locale";
import type { Device, Platform, ProjectState, Slide } from "./types";

let _id = 0;
export const nid = () => `s_${Date.now().toString(36)}_${(_id++).toString(36)}`;

const en = (s: string) => ({ [DEFAULT_LOCALE]: s });

function makeStarterSlides(): Slide[] {
  return [
    {
      id: nid(),
      layout: "hero",
      label: en("MEET YOUR APP"),
      headline: en("Sell one\nidea per slide."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "device-bottom",
      label: en("FEATURE 01"),
      headline: en("Your headline\nlives here."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "two-devices",
      label: en("FEATURE 02"),
      headline: en("Show two\nscreens at once."),
      screenshot: "",
      screenshotSecondary: "",
    },
    {
      id: nid(),
      layout: "device-top",
      label: en("FEATURE 03"),
      headline: en("Flip the contrast\nfor visual rhythm."),
      screenshot: "",
      inverted: true,
    },
    {
      id: nid(),
      layout: "no-device",
      label: en("MORE"),
      headline: en("And so\nmuch more."),
      screenshot: "",
    },
  ];
}

function ipadStarter(): Slide[] {
  return [
    {
      id: nid(),
      layout: "hero",
      label: en("MEET YOUR APP"),
      headline: en("Made for\nthe big screen."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "device-bottom",
      label: en("FEATURE 01"),
      headline: en("Built for\nfocus."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "device-top",
      label: en("FEATURE 02"),
      headline: en("Always within reach."),
      screenshot: "",
      inverted: true,
    },
  ];
}

function tabletStarter(kind: "7" | "10"): Slide[] {
  return [
    {
      id: nid(),
      layout: "hero",
      label: en("MEET YOUR APP"),
      headline: en(kind === "7" ? "Pocket-sized\npower." : "Made for\nthe big screen."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "split-landscape",
      label: en("FEATURE 01"),
      headline: en("Wide canvas,\nbigger ideas."),
      screenshot: "",
    },
  ];
}

function fgStarter(): Slide[] {
  return [
    {
      id: nid(),
      layout: "feature-graphic",
      label: {},
      headline: en("Your tagline goes here."),
      screenshot: "",
    },
  ];
}

// Watch / Wear OS store screenshots should show only the app UI.
function fullBleedStarter(count: number): Slide[] {
  return Array.from({ length: count }, () => ({
    id: nid(),
    layout: "full-bleed",
    label: {},
    headline: {},
    screenshot: "",
  }));
}

function tvStarter(): Slide[] {
  return [
    {
      id: nid(),
      layout: "hero",
      label: en("MEET YOUR APP"),
      headline: en("Made for\nthe living room."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "device-bottom",
      label: en("FEATURE 01"),
      headline: en("Your headline lives here."),
      screenshot: "",
    },
    {
      id: nid(),
      layout: "full-bleed",
      label: {},
      headline: {},
      screenshot: "",
    },
  ];
}

// App Store creative assets (header / search results) — one asset per locale.
// Keep the phrase short: it must fit Apple's art safe area at every size.
function creativeStarter(): Slide[] {
  return [
    {
      id: nid(),
      layout: "creative-asset",
      label: {},
      headline: en("One short\n**phrase**"),
      screenshot: "",
    },
  ];
}

export const DEFAULT_PROJECT: ProjectState = {
  schemaVersion: PROJECT_SCHEMA_VERSION,
  appName: "Munib Tracker",
  themeId: DEFAULT_THEME_ID,
  connectedCanvas: true,
  locales: [DEFAULT_LOCALE],
  locale: DEFAULT_LOCALE,
  device: "iphone",
  orientation: "portrait",
  appIcon: "/app-icon.png",
  slidesByDevice: {
    iphone: makeStarterSlides(),
    "iphone-duo": tabletStarter("10"),
    ipad: ipadStarter(),
    "apple-watch": fullBleedStarter(3),
    "apple-tv": tvStarter(),
    "ios-universal": creativeStarter(),
    "ios-header-wide": creativeStarter(),
    "ios-search-3x2": creativeStarter(),
    android: makeStarterSlides(),
    "android-7": tabletStarter("7"),
    "android-10": tabletStarter("10"),
    "wear-os": fullBleedStarter(3),
    "android-tv": tvStarter(),
    "tv-banner": fgStarter(),
    "feature-graphic": fgStarter(),
  },
};

export function newSlide(layout: Slide["layout"] = "device-bottom"): Slide {
  if (layout === "full-bleed") {
    return { id: nid(), layout, label: {}, headline: {}, screenshot: "" };
  }
  return {
    id: nid(),
    layout,
    label: en("NEW"),
    headline: en("Edit this\nheadline."),
    screenshot: "",
  };
}

export function detectPlatform(device: Device): Platform {
  return DEVICE_PLATFORM[device] ?? "android";
}
