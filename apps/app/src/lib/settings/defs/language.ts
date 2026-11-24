import { DEFAULT_WEATHER_PREFERENCES } from "@munib-tracker/shared/constants";
import type {
  AppLocale,
  CalendarMode,
  HijriAdjustment,
  NumberFormatId,
  TemperatureUnit,
  TimeFormat,
} from "@munib-tracker/shared/types";
import type { TFunction } from "i18next";
import {
  DEFAULT_NUMBER_FORMAT,
  isNumberFormatStyle,
  NUMBER_FORMAT_OPTIONS,
} from "@/lib/format-currency";
import { saveHijriAdjustment } from "@/lib/hijri-adjustment-actions";

import { APP_LOCALES } from "@/lib/locale-display";
import { deviceCurrencyCode, resolveDefaultCurrency } from "@/lib/money-defaults";
import { preferencesStore } from "@/stores/preferences-store";

import { editor } from "../editors";
import { markSetupReviewed } from "../setup-checklist";
import { type AnySettingDef, defineSetting } from "../types";
import { updatePrefs } from "./helpers";

const LanguageControl = editor("LanguageControl");
const HijriDateEditor = editor("HijriDateEditor");
const DefaultCurrencyEditor = editor("DefaultCurrencyEditor");

const G = "language" as const;
const LANG = "settingsPanel.section.languages";
const REGION = "settingsPanel.section.region";
const HIJRI = "settingsStep4.hijri.title";
const MONEY = "settingsStep4.money.section";

const localeName = (code: string) => APP_LOCALES.find((l) => l.code === code)?.name ?? code;

export const LANGUAGE_SETTINGS: AnySettingDef[] = [
  defineSetting<AppLocale>({
    id: "language.app",
    group: G,
    section: LANG,
    titleKey: "language.appLanguage",
    keywordsKey: "settingsPanel.kw.language",
    scope: "account",
    control: { kind: "custom", Component: LanguageControl },
    read: (s) => s.prefs.locale,
    write: async (v) => {
      await markSetupReviewed("language");
      await preferencesStore.getState().setLocale(v);
    },
    defaultValue: "en",
    // Resetting the UI language would flip RTL and reload the app; keep it.
    resettable: false,
    summary: localeName,
    sideEffects: ["reload-locale"],
    fields: ["prefs.locale"],
  }),
  defineSetting<AppLocale>({
    id: "language.translation",
    group: G,
    section: LANG,
    titleKey: "language.translationLanguage",
    subtitleKey: "language.translationHint",
    keywordsKey: "settingsPanel.kw.language",
    scope: "account",
    control: { kind: "custom", Component: LanguageControl },
    read: (s) => s.prefs.translationLocale,
    write: (v) => updatePrefs({ translationLocale: v }),
    defaultValue: (s) => s.prefs.locale,
    summary: localeName,
    fields: ["prefs.translationLocale"],
  }),
  defineSetting<TimeFormat>({
    id: "language.timeFormat",
    group: G,
    section: REGION,
    titleKey: "settings.timeFormat",
    subtitleKey: "settings.timeFormatSub",
    keywordsKey: "settingsPanel.kw.timeFormat",
    icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "12", labelKey: "timeFormat.option12" },
        { value: "24", labelKey: "timeFormat.option24" },
      ],
    },
    read: (s) => s.prefs.timeFormat,
    write: (v) => updatePrefs({ timeFormat: v }),
    defaultValue: "24",
    summary: (v, t) => t(v === "12" ? "timeFormat.option12" : "timeFormat.option24"),
    // Reminder titles embed formatted times.
    sideEffects: ["reschedule-reminders"],
    fields: ["prefs.timeFormat"],
  }),
  defineSetting<CalendarMode>({
    id: "language.defaultCalendar",
    group: G,
    section: REGION,
    titleKey: "settings.defaultCalendar",
    subtitleKey: "settings.defaultCalendarSub",
    keywordsKey: "settingsPanel.kw.calendar",
    icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "gregorian", labelKey: "defaultCalendar.optionGregorian" },
        { value: "hijri", labelKey: "defaultCalendar.optionHijri" },
      ],
    },
    read: (s) => s.prefs.defaultCalendar,
    write: (v) => updatePrefs({ defaultCalendar: v }),
    defaultValue: "hijri",
    summary: (v, t) =>
      t(v === "gregorian" ? "defaultCalendar.optionGregorian" : "defaultCalendar.optionHijri"),
    fields: ["prefs.defaultCalendar"],
  }),
  defineSetting<TemperatureUnit>({
    id: "language.temperatureUnit",
    group: G,
    section: REGION,
    titleKey: "weather.unitTitle",
    subtitleKey: "weather.unitHint",
    keywordsKey: "settingsPanel.kw.weather",
    icon: { ios: "thermometer.medium", android: "device_thermostat", web: "device_thermostat" },
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "celsius", labelKey: "weather.unitCelsius" },
        { value: "fahrenheit", labelKey: "weather.unitFahrenheit" },
      ],
    },
    read: (s) => s.prefs.weatherPrefs.unit,
    write: (v) => preferencesStore.getState().setWeatherPrefs({ unit: v }),
    defaultValue: DEFAULT_WEATHER_PREFERENCES.unit,
    summary: (v, t) => t(v === "celsius" ? "weather.unitCelsius" : "weather.unitFahrenheit"),
    fields: ["prefs.weatherPrefs.unit"],
  }),
  // D14 (§4.5.11): the hijri feature's section — every write reschedules
  // reminders itself (`hijri-adjustment-actions.ts`), so no declared side effect.
  defineSetting<HijriAdjustment | undefined>({
    id: "language.hijriAdjustment",
    group: G,
    section: HIJRI,
    titleKey: "settingsStep4.hijri.title",
    subtitleKey: "settingsStep4.hijri.subtitle",
    keywordsKey: "settingsStep4.kw.hijri",
    icon: { ios: "moon.fill", android: "dark_mode", web: "dark_mode" },
    scope: "account",
    control: { kind: "custom", Component: HijriDateEditor },
    read: (s) => s.prefs.hijriAdjustment,
    // Reset stores the neutral value explicitly so the clear syncs.
    write: (v) => saveHijriAdjustment(v),
    defaultValue: undefined,
    summary: (v, t) => hijriAdjustmentSummary(v, t),
    fields: ["prefs.hijriAdjustment"],
  }),
  // Money defaults: seed new zakat / fidyah / sadaqah drafts (each keeps its override).
  defineSetting<string>({
    id: "language.defaultCurrency",
    group: G,
    section: MONEY,
    titleKey: "settingsStep4.money.currency",
    subtitleKey: "settingsStep4.money.currencySub",
    keywordsKey: "settingsStep4.kw.money",
    icon: { ios: "banknote.fill", android: "payments", web: "payments" },
    scope: "account",
    control: { kind: "custom", Component: DefaultCurrencyEditor },
    read: (s) => resolveDefaultCurrency(s.prefs.defaultCurrency, deviceCurrencyCode()),
    write: (v) => updatePrefs({ defaultCurrency: v }),
    defaultValue: () => deviceCurrencyCode(),
    summary: (v) => v,
    fields: ["prefs.defaultCurrency"],
  }),
  defineSetting<NumberFormatId>({
    id: "language.defaultNumberFormat",
    group: G,
    section: MONEY,
    titleKey: "settingsStep4.money.numberFormat",
    subtitleKey: "settingsStep4.money.currencySub",
    keywordsKey: "settingsStep4.kw.money",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "sheet",
      options: NUMBER_FORMAT_OPTIONS.map((o) => ({ value: o.id, label: o.label })),
    },
    read: (s) =>
      isNumberFormatStyle(s.prefs.defaultNumberFormat)
        ? s.prefs.defaultNumberFormat
        : DEFAULT_NUMBER_FORMAT,
    write: (v) => updatePrefs({ defaultNumberFormat: v }),
    defaultValue: DEFAULT_NUMBER_FORMAT,
    summary: (v) => NUMBER_FORMAT_OPTIONS.find((o) => o.id === v)?.label ?? v,
    fields: ["prefs.defaultNumberFormat"],
  }),
];

/** "+1 day · 2 corrections" / "As calculated" for the Hijri adjustment row. */
export function hijriAdjustmentSummary(v: HijriAdjustment | undefined, t: TFunction): string {
  const offset = v?.offsetDays ?? 0;
  const corrections = Object.keys(v?.monthStarts ?? {}).length;
  const parts: string[] = [];
  if (offset !== 0) {
    parts.push(t("settingsStep4.hijri.offset", { value: offset > 0 ? `+${offset}` : `${offset}` }));
  }
  if (corrections > 0) parts.push(t("settingsStep4.hijri.corrections", { value: corrections }));
  return parts.length > 0 ? parts.join(" · ") : t("settingsStep4.hijri.none");
}
