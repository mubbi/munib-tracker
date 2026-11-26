import { DEFAULT_WEATHER_PREFERENCES } from "@munib-tracker/shared/constants";
import type {
  PreferenceAccentColorId,
  PreferenceColorMode,
  QiblaCompassStyleId,
} from "@munib-tracker/shared/types";
import { defaultAccentColorId } from "@munib-tracker/theme/accents";
import {
  type AppIconPreference,
  appIconPreferenceLabelKey,
  defaultAppIconPreference,
  isAppIconModuleAvailable,
  resolveAppIconPreference,
} from "@/lib/app-icon";
import {
  DEFAULT_QIBLA_COMPASS_STYLE,
  qiblaCompassStyleKeys,
  resolveQiblaCompassStyle,
} from "@/lib/qibla-compass-styles";
import { setDevicePreferences } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";

import { editor } from "../editors";
import { type AnySettingDef, defineSetting } from "../types";
import { onOff, updatePrefs } from "./helpers";

const AccentEditor = editor("AccentEditor");
const AppIconEditor = editor("AppIconEditor");
const QiblaCompassStyleEditor = editor("QiblaCompassStyleEditor");
const ThemeModeEditor = editor("ThemeModeEditor");

const G = "appearance" as const;
const THEME = "settingsPanel.section.theme";
const HOME = "settingsPanel.section.home";
/** Hero weather effects + the Qibla compass style: the two decorative extras, grouped. */
const EXTRAS = "settingsPanel.section.extras";

/** Matches the theme provider's first-run default. */
const DEFAULT_COLOR_MODE: PreferenceColorMode = "dark";

export const APPEARANCE_SETTINGS: AnySettingDef[] = [
  defineSetting<PreferenceColorMode>({
    id: "appearance.theme",
    group: G,
    section: THEME,
    titleKey: "appearance.themeTitle",
    subtitleKey: "appearance.themeHint",
    keywordsKey: "settingsPanel.kw.theme",
    scope: "account",
    // Light / Dark / System as three preview tiles (one radio group).
    control: { kind: "custom", Component: ThemeModeEditor },
    read: (s) => s.prefs.colorMode ?? DEFAULT_COLOR_MODE,
    // The theme provider mirrors `prefs.colorMode` (same path cloud sync uses).
    write: (v) => updatePrefs({ colorMode: v }),
    defaultValue: DEFAULT_COLOR_MODE,
    summary: (v, t) =>
      t(
        v === "light"
          ? "appearance.modeLight"
          : v === "system"
            ? "appearance.modeSystem"
            : "appearance.modeDark",
      ),
    fields: ["prefs.colorMode"],
  }),
  defineSetting<string>({
    id: "appearance.accent",
    group: G,
    section: THEME,
    titleKey: "appearance.accentTitle",
    subtitleKey: "appearance.accentHint",
    keywordsKey: "settingsPanel.kw.accent",
    scope: "account",
    control: { kind: "custom", Component: AccentEditor },
    read: (s) => s.prefs.customAccent ?? s.prefs.accentColorId ?? defaultAccentColorId,
    // A preset id clears any custom hex; a `#rrggbb` value is a custom accent.
    write: (v) =>
      v.startsWith("#")
        ? updatePrefs({ customAccent: v })
        : updatePrefs({ customAccent: undefined, accentColorId: v as PreferenceAccentColorId }),
    defaultValue: defaultAccentColorId,
    summary: (v) => (v.startsWith("#") ? v.toUpperCase() : v),
    fields: ["prefs.accentColorId", "prefs.customAccent"],
  }),
  // NF-2.23b: seasonal launcher icon (Ramadan, Eid, Dhul-Hijjah, …). Per device, and
  // only where this binary carries the icon module (hidden on web, TV, older builds).
  defineSetting<AppIconPreference>({
    id: "appearance.appIcon",
    group: G,
    section: THEME,
    titleKey: "appIcon.title",
    subtitleKey: "appIcon.subtitle",
    keywordsKey: "appIcon.keywords",
    icon: { ios: "app.badge.fill", android: "app_badging", web: "app_badging" },
    scope: "device",
    control: { kind: "custom", Component: AppIconEditor },
    read: (s) => resolveAppIconPreference(s.device.appIcon),
    write: (v) => setDevicePreferences({ appIcon: v }),
    defaultValue: defaultAppIconPreference(),
    available: (ctx) => ctx.native && isAppIconModuleAvailable(),
    summary: (v, t) => t(appIconPreferenceLabelKey(v)),
    fields: ["device.appIcon"],
  }),
  defineSetting<string[]>({
    id: "appearance.homeCards",
    group: G,
    section: HOME,
    titleKey: "homeCustomize.modulesTitle",
    subtitleKey: "settings.homeCustomizeSub",
    keywordsKey: "settingsPanel.kw.home",
    icon: { ios: "square.grid.2x2.fill", android: "dashboard", web: "dashboard" },
    scope: "account",
    control: { kind: "link", href: "/settings/home" },
    read: (s) => s.prefs.hiddenHomeModules ?? [],
    write: (v) => updatePrefs({ hiddenHomeModules: v }),
    defaultValue: [],
    summary: (v, t) =>
      v.length === 0
        ? t("settingsPanel.allShown")
        : t("settingsPanel.hiddenCount", { count: v.length }),
    fields: ["prefs.hiddenHomeModules"],
  }),
  defineSetting<string[] | undefined>({
    id: "appearance.quickActions",
    group: G,
    section: HOME,
    titleKey: "homeCustomize.actionsTitle",
    subtitleKey: "homeCustomize.actionsHint",
    keywordsKey: "settingsPanel.kw.home",
    icon: { ios: "square.grid.3x2.fill", android: "apps", web: "apps" },
    scope: "account",
    control: { kind: "link", href: "/settings/home" },
    read: (s) => s.prefs.quickActionOrder,
    write: (v) => updatePrefs({ quickActionOrder: v }),
    defaultValue: undefined,
    summary: (v, t) =>
      v == null
        ? t("settingsPanel.allDefault")
        : t("settingsPanel.customCount", { count: v.length }),
    fields: ["prefs.quickActionOrder"],
  }),
  // D13: the Library tab renders its sections in this order (reset = default order).
  defineSetting<string[] | undefined>({
    id: "appearance.libraryOrder",
    group: G,
    section: HOME,
    titleKey: "settingsStep4.libraryOrder.title",
    subtitleKey: "settingsStep4.libraryOrder.subtitle",
    keywordsKey: "settingsStep4.kw.libraryOrder",
    icon: { ios: "books.vertical.fill", android: "library_books", web: "library_books" },
    scope: "account",
    // Edited on Customize home beside Home cards and Explore (one place to reorder).
    control: { kind: "link", href: "/settings/home" },
    read: (s) => s.prefs.libraryMenuOrder,
    write: (v) => updatePrefs({ libraryMenuOrder: v }),
    defaultValue: undefined,
    summary: (v, t) =>
      v == null || v.length === 0
        ? t("settingsPanel.allDefault")
        : t("settingsStep4.libraryOrder.custom"),
    shortcuts: ["/(tabs)/library"],
    fields: ["prefs.libraryMenuOrder"],
  }),
  defineSetting<boolean>({
    id: "appearance.weatherEffects",
    group: G,
    section: EXTRAS,
    titleKey: "weather.effectsToggle",
    subtitleKey: "weather.effectsToggleSub",
    keywordsKey: "settingsPanel.kw.weather",
    icon: { ios: "cloud.sun.fill", android: "partly_cloudy_day", web: "partly_cloudy_day" },
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.prefs.weatherPrefs.effectsEnabled,
    write: (v) => preferencesStore.getState().setWeatherPrefs({ effectsEnabled: v }),
    defaultValue: DEFAULT_WEATHER_PREFERENCES.effectsEnabled,
    summary: onOff,
    fields: ["prefs.weatherPrefs.effectsEnabled"],
  }),
  defineSetting<QiblaCompassStyleId>({
    id: "appearance.qiblaCompass",
    group: G,
    section: EXTRAS,
    titleKey: "qiblaStyles.sheetTitle",
    subtitleKey: "qiblaStyles.settingSubtitle",
    keywordsKey: "qiblaStyles.keywords",
    icon: { ios: "location.north.circle.fill", android: "explore", web: "explore" },
    scope: "account",
    control: { kind: "custom", Component: QiblaCompassStyleEditor },
    read: (s) => resolveQiblaCompassStyle(s.prefs.qiblaCompassStyle),
    write: (v) => updatePrefs({ qiblaCompassStyle: v }),
    defaultValue: DEFAULT_QIBLA_COMPASS_STYLE,
    summary: (v, t) => t(qiblaCompassStyleKeys(v).name),
    shortcuts: ["/qibla"],
    fields: ["prefs.qiblaCompassStyle"],
  }),
];
