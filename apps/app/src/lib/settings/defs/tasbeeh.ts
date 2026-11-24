import type {
  TasbeehAppearance,
  TasbeehBeadShape,
  TasbeehClickerBacklight,
  TasbeehDesignId,
  TasbeehFingerLayout,
  TasbeehHapticsLevel,
  TasbeehMisbahaAppearance,
  TasbeehPebbleItem,
  TasbeehSoundSettings,
  TasbeehSpacerStyle,
  TasbeehStageBackground,
  TasbeehStrandLayout,
  TasbeehStrandSize,
  TasbeehTasselStyle,
  TasbeehVoiceSensitivity,
  TasbeehVoiceSilenceStopSec,
} from "@munib-tracker/shared/types";
import type { TFunction } from "i18next";

import { isTV } from "@/lib/platform/is-tv";
import {
  availableDesigns,
  FINGER_LAYOUTS,
  getDesign,
  PEBBLE_ITEMS,
  type ResolvedTasbeehAppearance,
  resolveTasbeehAppearance,
} from "@/lib/tasbeeh/designs";
import {
  applyPreset,
  BEAD_SHAPES,
  COLOR_NAMES,
  MATERIAL_IDS,
  PRESETS,
  SPACER_STYLES,
  TASSEL_COLORS,
  TASSEL_STYLES,
  THREAD_COLORS,
} from "@/lib/tasbeeh/materials";
import { TASBEEH_SOUND_PACKS } from "@/lib/tasbeeh/sound-packs";
import { updateTasbeehAppearance } from "@/lib/tasbeeh/use-tasbeeh-appearance";
import { resolveTasbeehVoicePrefs } from "@/lib/tasbeeh-voice/gate";
import { usesModel } from "@/lib/tasbeeh-voice/mode";
import { preferencesStore } from "@/stores/preferences-store";
import { tasbeehVoiceTemplatesStore } from "@/stores/tasbeeh-voice-templates-store";

import { editor } from "../editors";
import { nativeOnly, notOnTv } from "../platform";
import {
  type AnySettingDef,
  type ChoiceOption,
  defineSetting,
  type SettingDef,
  type SettingsSnapshot,
} from "../types";
import { NO_VALUE, onOff, updatePrefs } from "./helpers";

const TasbeehAppearanceSettingsEditor = editor("TasbeehAppearanceSettingsEditor");
const TasbeehVoiceCalibrationEditor = editor("TasbeehVoiceCalibrationEditor");

const G = "content" as const;
const SECTION = "settingsStep4.tasbeeh.section";
const KEYWORDS = "tasbeehDesigns.searchKeywords";
const SHORTCUTS = ["TasbeehStyleSheet"];
const VOICE_KEYWORDS = "tasbeehVoice.settings.keywords";
/** Sensitivity, calibration and model storage only apply to the model-based counter (D24). */
const modelVoice = (ctx: Parameters<typeof notOnTv>[0]) => notOnTv(ctx) && usesModel();

/** The appearance the counter renders on this device (defaults filled, TV-safe). */
function resolved(s: SettingsSnapshot): ResolvedTasbeehAppearance {
  return resolveTasbeehAppearance(s.prefs.tasbeehAppearance, { tv: isTV() });
}

function misbahaPatch(
  s: SettingsSnapshot,
  patch: Partial<TasbeehMisbahaAppearance>,
): Partial<TasbeehAppearance> {
  return { misbaha: { ...resolved(s).misbaha, ...patch } };
}

/**
 * `mergeTasbeehAppearance` merges `sound` one level, so a partial patch keeps
 * the other sound fields — in particular `enabled` stays unset until flipped (D16).
 */
function soundPatch(patch: Partial<TasbeehSoundSettings>): TasbeehSoundSettings {
  return patch as TasbeehSoundSettings;
}

const currentSnapshot = (): SettingsSnapshot =>
  ({ prefs: preferencesStore.getState().prefs }) as SettingsSnapshot;

function labelOf<V>(options: readonly ChoiceOption<V>[]) {
  return (v: V, t: TFunction) => {
    const option = options.find((o) => o.value === v);
    return option?.labelKey ? t(option.labelKey) : (option?.label ?? String(v));
  };
}

/**
 * One option of the counter style. These rows are searchable, read the same
 * resolved appearance as the counter and write through `updateTasbeehAppearance`
 * (the counter's style sheet uses the same path), but they are edited in the
 * section's detail editor (`TasbeehAppearanceEditor`), so they are not listed
 * twice. Their reset is the section's: the editor row clears the whole
 * appearance back to Ring (D10), which keeps `sound.enabled` unset (D16).
 */
function tasbeehChoice<V>(
  def: Pick<SettingDef<V>, "id" | "titleKey" | "available" | "enabledWhen"> & {
    options: readonly ChoiceOption<V>[];
    read: (r: ResolvedTasbeehAppearance) => V;
    patch: (v: V, s: SettingsSnapshot) => Partial<TasbeehAppearance>;
  },
): SettingDef<V> {
  const { options, read, patch, ...rest } = def;
  return {
    ...rest,
    group: G,
    section: SECTION,
    keywordsKey: KEYWORDS,
    scope: "account",
    control: { kind: "choice", presentation: "sheet", options },
    read: (s) => read(resolved(s)),
    write: (v) => updateTasbeehAppearance(patch(v, currentSnapshot())),
    defaultValue: (s) => read(resolved(s)),
    resettable: false,
    listed: false,
    summary: labelOf(options),
    shortcuts: SHORTCUTS,
    fields: [],
  };
}

const isMisbaha = (s: SettingsSnapshot) => resolved(s).design === "misbaha";
const isClicker = (s: SettingsSnapshot) => resolved(s).design === "clicker";
const isPebbles = (s: SettingsSnapshot) => resolved(s).design === "pebbles";
const isFingers = (s: SettingsSnapshot) => resolved(s).design === "fingers";

const DESIGN_OPTIONS: ChoiceOption<TasbeehDesignId>[] = availableDesigns({ tv: isTV() }).map(
  (d) => ({ value: d.id, labelKey: `tasbeehDesigns.designs.${d.i18nKey}.name` }),
);

type ThreadChoice = "theme" | "hidden" | string;
const THREAD_OPTIONS: ChoiceOption<ThreadChoice>[] = [
  { value: "theme", labelKey: "tasbeehDesigns.thread.theme" },
  ...THREAD_COLORS.map((hex) => ({
    value: hex,
    labelKey: `tasbeehDesigns.colors.${COLOR_NAMES[hex] ?? "brown"}`,
  })),
  { value: "hidden", labelKey: "tasbeehDesigns.thread.hidden" },
];

type LayoutChoice = "auto" | TasbeehStrandLayout;

export const TASBEEH_SETTINGS: AnySettingDef[] = [
  // The section's detail editor (NF-3.19 "Counter style"), shared with the counter.
  defineSetting<TasbeehAppearance | undefined>({
    id: "content.tasbeeh.appearance",
    group: G,
    section: SECTION,
    titleKey: "tasbeehDesigns.settingsTitle",
    subtitleKey: "tasbeehDesigns.settingsSubtitle",
    keywordsKey: KEYWORDS,
    icon: { ios: "circle.dotted", android: "radio_button_checked", web: "radio_button_checked" },
    scope: "account",
    control: { kind: "custom", Component: TasbeehAppearanceSettingsEditor },
    read: (s) => s.prefs.tasbeehAppearance,
    write: (v) => preferencesStore.getState().update({ tasbeehAppearance: v }),
    // Unset = Ring (D10) with sound following the device default (D16).
    defaultValue: undefined,
    summary: (v, t) => t(`tasbeehDesigns.designs.${getDesign(v?.design).i18nKey}.name`),
    shortcuts: SHORTCUTS,
    fields: ["prefs.tasbeehAppearance"],
  }),
  tasbeehChoice<TasbeehDesignId>({
    id: "content.tasbeeh.design",
    titleKey: "tasbeehDesigns.sections.design",
    options: DESIGN_OPTIONS,
    read: (r) => r.design,
    patch: (design) => ({ design }),
  }),
  tasbeehChoice<string>({
    id: "content.tasbeeh.misbaha.preset",
    titleKey: "tasbeehDesigns.preset",
    options: PRESETS.map((p) => ({ value: p.id, labelKey: `tasbeehDesigns.presets.${p.id}` })),
    read: (r) => r.misbaha.preset,
    // A preset replaces the bead look but keeps strand, layout and background.
    patch: (preset, s) =>
      PRESETS.some((p) => p.id === preset)
        ? { misbaha: applyPreset(resolved(s).misbaha, preset) }
        : {},
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<TasbeehBeadShape>({
    id: "content.tasbeeh.misbaha.shape",
    titleKey: "tasbeehDesigns.shape",
    options: BEAD_SHAPES.map((v) => ({ value: v, labelKey: `tasbeehDesigns.shapes.${v}` })),
    read: (r) => r.misbaha.shape,
    patch: (shape, s) => misbahaPatch(s, { shape }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<string>({
    id: "content.tasbeeh.misbaha.material",
    titleKey: "tasbeehDesigns.material",
    options: MATERIAL_IDS.map((v) => ({ value: v, labelKey: `tasbeehDesigns.materials.${v}` })),
    read: (r) => r.misbaha.material,
    patch: (material, s) => misbahaPatch(s, { material }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<TasbeehSpacerStyle>({
    id: "content.tasbeeh.misbaha.spacer",
    titleKey: "tasbeehDesigns.spacer.label",
    options: SPACER_STYLES.map((v) => ({ value: v, labelKey: `tasbeehDesigns.spacer.${v}` })),
    read: (r) => r.misbaha.spacer,
    patch: (spacer, s) => misbahaPatch(s, { spacer }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<TasbeehTasselStyle>({
    id: "content.tasbeeh.misbaha.tassel",
    titleKey: "tasbeehDesigns.tassel.label",
    options: TASSEL_STYLES.map((v) => ({ value: v, labelKey: `tasbeehDesigns.tassel.${v}` })),
    read: (r) => r.misbaha.tassel.style,
    patch: (style, s) => misbahaPatch(s, { tassel: { ...resolved(s).misbaha.tassel, style } }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<string>({
    id: "content.tasbeeh.misbaha.tasselColor",
    titleKey: "tasbeehDesigns.tassel.color",
    options: TASSEL_COLORS.map((hex) => ({
      value: hex,
      labelKey: `tasbeehDesigns.colors.${COLOR_NAMES[hex] ?? "burgundy"}`,
    })),
    read: (r) => r.misbaha.tassel.color ?? "",
    patch: (color, s) => misbahaPatch(s, { tassel: { ...resolved(s).misbaha.tassel, color } }),
    // Only a silk tassel takes a colour.
    enabledWhen: (s) => isMisbaha(s) && resolved(s).misbaha.tassel.style === "silk",
  }),
  tasbeehChoice<ThreadChoice>({
    id: "content.tasbeeh.misbaha.thread",
    titleKey: "tasbeehDesigns.thread.label",
    options: THREAD_OPTIONS,
    read: (r) => (r.misbaha.thread.hidden ? "hidden" : (r.misbaha.thread.color ?? "theme")),
    patch: (v, s) =>
      misbahaPatch(s, {
        thread: v === "hidden" ? { hidden: true } : v === "theme" ? {} : { color: v },
      }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<TasbeehStrandSize>({
    id: "content.tasbeeh.misbaha.strand",
    titleKey: "tasbeehDesigns.strand.label",
    options: [
      { value: "auto", labelKey: "tasbeehDesigns.strand.auto" },
      { value: 33, labelKey: "tasbeehDesigns.strand.s33" },
      { value: 99, labelKey: "tasbeehDesigns.strand.s99" },
    ],
    read: (r) => r.misbaha.strand,
    patch: (strand, s) => misbahaPatch(s, { strand }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<LayoutChoice>({
    id: "content.tasbeeh.misbaha.layout",
    titleKey: "tasbeehDesigns.layout.label",
    options: [
      { value: "auto", labelKey: "tasbeehDesigns.layout.auto" },
      { value: "arc", labelKey: "tasbeehDesigns.layout.arc" },
      { value: "horizontal", labelKey: "tasbeehDesigns.layout.horizontal" },
      { value: "loop", labelKey: "tasbeehDesigns.layout.loop" },
    ],
    read: (r) => r.misbaha.layout ?? "auto",
    patch: (v, s) => misbahaPatch(s, { layout: v === "auto" ? undefined : v }),
    // TV always shows the horizontal strand.
    available: notOnTv,
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<TasbeehStageBackground>({
    id: "content.tasbeeh.misbaha.background",
    titleKey: "tasbeehDesigns.background.label",
    options: [
      { value: "surface", labelKey: "tasbeehDesigns.background.surface" },
      { value: "velvet", labelKey: "tasbeehDesigns.background.velvet" },
    ],
    read: (r) => r.misbaha.background ?? "surface",
    patch: (background, s) => misbahaPatch(s, { background }),
    enabledWhen: isMisbaha,
  }),
  tasbeehChoice<TasbeehClickerBacklight>({
    id: "content.tasbeeh.clicker.backlight",
    titleKey: "tasbeehDesigns.clicker.backlight",
    options: [
      { value: "green", labelKey: "tasbeehDesigns.clicker.green" },
      { value: "amber", labelKey: "tasbeehDesigns.clicker.amber" },
      { value: "mono", labelKey: "tasbeehDesigns.clicker.mono" },
    ],
    read: (r) => r.clicker.backlight,
    patch: (backlight) => ({ clicker: { backlight } }),
    enabledWhen: isClicker,
  }),
  // v2 designs (phone and web only, like the designs themselves).
  tasbeehChoice<TasbeehPebbleItem>({
    id: "content.tasbeeh.pebbles.item",
    titleKey: "tasbeehDesigns.pebbles.item",
    options: PEBBLE_ITEMS.map((v) => ({ value: v, labelKey: `tasbeehDesigns.pebbles.${v}` })),
    read: (r) => r.pebbles.item,
    patch: (item) => ({ pebbles: { item } }),
    available: notOnTv,
    enabledWhen: isPebbles,
  }),
  tasbeehChoice<TasbeehFingerLayout>({
    id: "content.tasbeeh.fingers.layout",
    titleKey: "tasbeehDesigns.fingers.layout",
    options: FINGER_LAYOUTS.map((v) => ({ value: v, labelKey: `tasbeehDesigns.fingers.${v}` })),
    read: (r) => r.fingers.layout,
    patch: (layout) => ({ fingers: { layout } }),
    available: notOnTv,
    enabledWhen: isFingers,
  }),
  // D16: unset until the person flips it (TV defaults on, phones/web off).
  defineSetting<boolean>({
    id: "content.tasbeeh.sound.enabled",
    group: G,
    section: SECTION,
    titleKey: "tasbeehDesigns.sound.toggle",
    subtitleKey: "tasbeehDesigns.sound.toggleSub",
    keywordsKey: KEYWORDS,
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => resolved(s).sound.enabled,
    write: (enabled) => updateTasbeehAppearance({ sound: soundPatch({ enabled }) }),
    defaultValue: () => isTV(),
    resettable: false,
    listed: false,
    summary: onOff,
    shortcuts: SHORTCUTS,
    fields: [],
  }),
  tasbeehChoice<string>({
    id: "content.tasbeeh.sound.pack",
    titleKey: "tasbeehDesigns.sound.pack",
    options: [
      { value: "auto", labelKey: "tasbeehDesigns.sound.auto" },
      ...TASBEEH_SOUND_PACKS.map((p) => ({
        value: p as string,
        labelKey: `tasbeehDesigns.sound.packs.${p}`,
      })),
    ],
    read: (r) => r.sound.pack,
    patch: (pack) => ({ sound: soundPatch({ pack }) }),
    enabledWhen: (s) => resolved(s).sound.enabled,
  }),
  defineSetting<number>({
    id: "content.tasbeeh.sound.volume",
    group: G,
    section: SECTION,
    titleKey: "tasbeehDesigns.sound.volume",
    keywordsKey: KEYWORDS,
    scope: "account",
    control: { kind: "stepper", min: 0, max: 100, step: 10, format: (v) => `${v}%` },
    read: (s) => Math.round(resolved(s).sound.volume * 100),
    write: (v) =>
      updateTasbeehAppearance({
        sound: soundPatch({ volume: Math.max(0, Math.min(100, v)) / 100 }),
      }),
    defaultValue: (s) => Math.round(resolved(s).sound.volume * 100),
    enabledWhen: (s) => resolved(s).sound.enabled,
    resettable: false,
    listed: false,
    summary: (v) => `${v}%`,
    shortcuts: SHORTCUTS,
    fields: [],
  }),
  tasbeehChoice<TasbeehHapticsLevel>({
    id: "content.tasbeeh.haptics",
    titleKey: "tasbeehDesigns.sections.haptics",
    options: [
      { value: "off", labelKey: "tasbeehDesigns.haptics.off" },
      { value: "subtle", labelKey: "tasbeehDesigns.haptics.subtle" },
      { value: "rich", labelKey: "tasbeehDesigns.haptics.rich" },
    ],
    read: (r) => r.haptics,
    patch: (haptics) => ({ haptics }),
    // Phones and tablets only (TV and web have no haptics); still gated by the global toggle.
    available: nativeOnly,
  }),

  // NF-3.20 hands-free counting (on-device FastConformer). Not on TV (no microphone path).
  defineSetting<TasbeehVoiceSensitivity>({
    id: "content.tasbeeh.voice.sensitivity",
    group: G,
    section: SECTION,
    titleKey: "tasbeehVoice.settings.sensitivity",
    subtitleKey: "tasbeehVoice.settings.sensitivitySub",
    keywordsKey: VOICE_KEYWORDS,
    icon: { ios: "mic.fill", android: "mic", web: "mic" },
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        {
          value: "strict",
          labelKey: "tasbeehVoice.settings.strict",
          descriptionKey: "tasbeehVoice.settings.strictHint",
        },
        {
          value: "balanced",
          labelKey: "tasbeehVoice.settings.balanced",
          descriptionKey: "tasbeehVoice.settings.balancedHint",
        },
      ],
    },
    read: (s) => resolveTasbeehVoicePrefs(s.prefs.tasbeehVoice).sensitivity,
    write: (sensitivity) =>
      updatePrefs({
        tasbeehVoice: {
          ...resolveTasbeehVoicePrefs(preferencesStore.getState().prefs.tasbeehVoice),
          sensitivity,
        },
      }),
    // D16: Strict is the default.
    defaultValue: "strict",
    available: modelVoice,
    summary: (v, t) => t(`tasbeehVoice.settings.${v}`),
    shortcuts: ["VoiceTasbeehSheet"],
    fields: ["prefs.tasbeehVoice"],
  }),
  defineSetting<TasbeehVoiceSilenceStopSec>({
    id: "content.tasbeeh.voice.silenceStop",
    group: G,
    section: SECTION,
    titleKey: "tasbeehVoice.settings.silenceStop",
    keywordsKey: VOICE_KEYWORDS,
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: ([30, 60, 120] as const).map((value) => ({
        value,
        label: String(value),
        descriptionKey: "tasbeehVoice.settings.silenceSecondsUnit",
      })),
    },
    read: (s) => resolveTasbeehVoicePrefs(s.prefs.tasbeehVoice).silenceStopSec,
    write: (silenceStopSec) =>
      updatePrefs({
        tasbeehVoice: {
          ...resolveTasbeehVoicePrefs(preferencesStore.getState().prefs.tasbeehVoice),
          silenceStopSec,
        },
      }),
    defaultValue: 60,
    available: notOnTv,
    summary: (v, t) => t("tasbeehVoice.settings.silenceSeconds", { seconds: v }),
    fields: [],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "content.tasbeeh.voice.calibration",
    group: G,
    section: SECTION,
    titleKey: "tasbeehVoice.calibrate.title",
    subtitleKey: "tasbeehVoice.settings.calibrateSub",
    keywordsKey: VOICE_KEYWORDS,
    // Device-local (DB_KEYS.tasbeehVoiceCalibration): this device's voice only.
    scope: "device",
    control: { kind: "custom", Component: TasbeehVoiceCalibrationEditor },
    available: modelVoice,
  }),
  // D48: taught zikr voice patterns (numbers, never audio) live only on this device.
  defineSetting<null>({
    ...NO_VALUE,
    id: "content.tasbeeh.voice.forgetTaught",
    group: G,
    section: SECTION,
    titleKey: "tasbeehVoice.settings.forgetTaught",
    subtitleKey: "tasbeehVoice.settings.forgetTaughtSub",
    keywordsKey: VOICE_KEYWORDS,
    scope: "device",
    control: {
      kind: "action",
      run: () => tasbeehVoiceTemplatesStore.getState().forget(),
      destructive: true,
      confirmKey: "tasbeehVoice.settings.forgetTaughtConfirm",
    },
    available: notOnTv,
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "content.tasbeeh.voice.modelStorage",
    group: G,
    section: SECTION,
    titleKey: "tasbeehVoice.settings.modelStorage",
    subtitleKey: "tasbeehVoice.settings.modelStorageSub",
    keywordsKey: VOICE_KEYWORDS,
    scope: "device",
    // The listener files are shared with Qur'an practice and managed there.
    control: { kind: "link", href: "/settings/quran-practice" },
    available: modelVoice,
  }),
];
