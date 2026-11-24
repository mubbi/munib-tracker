import type { Href } from "expo-router";

import { resetTourHints } from "../actions";
import { editor } from "../editors";
import { type AnySettingDef, defineSetting } from "../types";
import { NO_VALUE } from "./helpers";

const AboutPanel = editor("AboutPanel");

const G = "about" as const;
const HELP = "settingsPanel.section.help";
const ABOUT = "settingsPanel.section.about";

export const ABOUT_SETTINGS: AnySettingDef[] = [
  defineSetting<null>({
    ...NO_VALUE,
    id: "about.tour",
    group: G,
    section: HELP,
    titleKey: "tour.navRow",
    subtitleKey: "tour.navRowSub",
    keywordsKey: "settingsPanel.kw.tour",
    icon: { ios: "sparkles.tv.fill", android: "tour", web: "tour" },
    scope: "account",
    control: { kind: "link", href: "/tour" as Href },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "about.resetTourHints",
    group: G,
    section: HELP,
    titleKey: "settingsPanel.resetTourHints",
    subtitleKey: "settingsPanel.resetTourHintsSub",
    keywordsKey: "settingsPanel.kw.tour",
    scope: "account",
    control: { kind: "action", run: resetTourHints },
  }),
  // Re-opens onboarding with the current values (language, location…); nothing
  // is reset — finishing it just returns home.
  defineSetting<null>({
    ...NO_VALUE,
    id: "about.runSetup",
    group: G,
    section: HELP,
    titleKey: "settingsStep4.runSetup.title",
    subtitleKey: "settingsStep4.runSetup.subtitle",
    keywordsKey: "settingsStep4.kw.runSetup",
    icon: { ios: "arrow.counterclockwise.circle", android: "restart_alt", web: "restart_alt" },
    scope: "account",
    control: { kind: "link", href: "/setup" as Href },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "about.credits",
    group: G,
    section: ABOUT,
    titleKey: "credits.settingsLabel",
    subtitleKey: "credits.settingsSub",
    icon: { ios: "text.badge.checkmark", android: "verified", web: "verified" },
    scope: "account",
    control: { kind: "link", href: "/credits" },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "about.app",
    group: G,
    section: ABOUT,
    titleKey: "settings.about",
    subtitleKey: "settings.aboutSub",
    keywordsKey: "settingsPanel.kw.about",
    scope: "account",
    // Version, credits, rate the app, privacy policy and terms.
    control: { kind: "custom", Component: AboutPanel },
  }),
];
