import { setDevicePreferences } from "@/stores/device-preferences-store";

import { editor } from "../editors";
import { type AnySettingDef, defineSetting } from "../types";
import { deviceToggle, updatePrefs } from "./helpers";

const DeviceVoiceControl = editor("DeviceVoiceControl");

const G = "audio" as const;
const PLAYBACK = "settingsPanel.section.playback";
const VOICE = "settingsPanel.section.voice";
const OFFLINE = "settings.offlineData";

/** Mirrors `AUDIO_SPEEDS` in the audio player provider (kept literal to stay light). */
const SPEEDS = [0.5, 1, 1.5, 2] as const;

export const AUDIO_SETTINGS: AnySettingDef[] = [
  defineSetting<number>({
    id: "audio.speed",
    group: G,
    section: PLAYBACK,
    titleKey: "player.speed",
    keywordsKey: "settingsPanel.kw.speed",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: SPEEDS.map((v) => ({ value: v, label: `${v}×` })),
    },
    read: (s) => s.prefs.audioSpeed ?? 1,
    write: (v) => updatePrefs({ audioSpeed: v }),
    defaultValue: 1,
    summary: (v) => `${v}×`,
    shortcuts: ["MiniPlayer"],
    fields: ["prefs.audioSpeed"],
  }),
  defineSetting<number>({
    id: "audio.volume",
    group: G,
    section: PLAYBACK,
    titleKey: "player.volume",
    // B4: a device preference (never synced).
    scope: "device",
    control: {
      kind: "stepper",
      min: 0,
      max: 100,
      step: 10,
      format: (v) => `${v}%`,
    },
    read: (s) => Math.round((s.device.audioVolume ?? s.prefs.audioVolume ?? 1) * 100),
    write: (v) => setDevicePreferences({ audioVolume: Math.max(0, Math.min(100, v)) / 100 }),
    defaultValue: 100,
    summary: (v) => `${v}%`,
    available: (ctx) => !ctx.tv,
    shortcuts: ["MiniPlayer"],
    fields: ["device.audioVolume", "prefs.audioVolume"],
  }),
  defineSetting<number>({
    id: "audio.deviceVoice",
    group: G,
    section: VOICE,
    titleKey: "settingsPanel.deviceVoice",
    subtitleKey: "settingsPanel.deviceVoiceSub",
    keywordsKey: "settingsPanel.kw.voice",
    // Voice ids differ per device: a device preference (B4).
    scope: "device",
    control: { kind: "custom", Component: DeviceVoiceControl },
    read: (s) => Object.keys(s.device.ttsVoiceByLang ?? s.quran.ttsVoiceByLang ?? {}).length,
    write: async (v) => {
      if (v === 0) await setDevicePreferences({ ttsVoiceByLang: {} });
    },
    defaultValue: 0,
    summary: (v, t) =>
      v === 0 ? t("quran.playback.ttsVoiceDefault") : t("settingsPanel.customCount", { count: v }),
    available: (ctx) => !ctx.tv,
    shortcuts: ["PlaybackSettingsSheet", "MiniPlayer", "ReadingTtsButton"],
    fields: ["device.ttsVoiceByLang", "quran.ttsVoiceByLang"],
  }),
  // §4.5.3: "Save audio for offline" is listed under Audio & voice too — a
  // shortcut row over the same device field as `data.offline.cacheAudio`
  // (which owns `fields` and the reset), so both rows always agree.
  {
    ...deviceToggle({
      id: "audio.offline.cacheAudio",
      group: G,
      section: OFFLINE,
      titleKey: "settings.cacheAudioLocally",
      subtitleKey: "settings.cacheAudioLocallySub",
      keywordsKey: "settingsPanel.kw.offline",
      icon: { ios: "arrow.down.circle.fill", android: "download", web: "download" },
      key: "cacheAudioLocally",
      fallback: true,
    }),
    resettable: false,
    fields: [],
  },
];
