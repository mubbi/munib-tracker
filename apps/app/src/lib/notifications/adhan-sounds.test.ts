import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { ADHAN_STYLES, DEFAULT_ADHAN_STYLE } from "@/lib/adhan-audio";
import {
  ADHAN_NOTIFICATION_SOUNDS,
  adhanChannelId,
  adhanNotificationSound,
  DEFAULT_ADHAN_NOTIFICATION_SOUND,
  isAdhanChannelId,
  registeredAdhanSoundFiles,
  resolveAdhanSoundStyleId,
} from "@/lib/notifications/adhan-sounds";

const APP_ROOT = resolve(__dirname, "../../..");

type PluginEntry = string | [string, Record<string, unknown>];
const appJson = require("../../../app.json") as { expo: { plugins: PluginEntry[] } };

/** Paths in the `expo-notifications` plugin `sounds` array (registered at prebuild). */
function registeredSoundPaths(): string[] {
  const entry = appJson.expo.plugins.find(
    (plugin): plugin is [string, Record<string, unknown>] =>
      Array.isArray(plugin) && plugin[0] === "expo-notifications",
  );
  return (entry?.[1].sounds as string[] | undefined) ?? [];
}

describe("adhan notification sounds (B2)", () => {
  it("has a notification sound for every ADHAN_STYLES id and nothing else", () => {
    expect(Object.keys(ADHAN_NOTIFICATION_SOUNDS).sort()).toEqual(
      ADHAN_STYLES.map((style) => style.id).sort(),
    );
  });

  it.each(ADHAN_STYLES.map((style) => style.id))(
    "registers style %p's sound in app.json and ships the file",
    (styleId) => {
      const sound = adhanNotificationSound(styleId);
      const registered = registeredSoundPaths();
      const path = registered.find((p) => basename(p) === sound);
      expect(path).toBeDefined();
      expect(existsSync(resolve(APP_ROOT, path ?? ""))).toBe(true);
    },
  );

  it("registers only sounds a style uses, with Android-safe resource names", () => {
    const registered = registeredSoundPaths().map((p) => basename(p));
    expect(registered.sort()).toEqual(registeredAdhanSoundFiles().sort());
    // Android res/raw names: lowercase letters, digits and underscores only.
    for (const file of registered) expect(file).toMatch(/^[a-z0-9_]+\.(wav|caf|aiff|mp3)$/);
  });

  it("gives each style its own Android channel", () => {
    const channels = ADHAN_STYLES.map((style) => adhanChannelId(style.id));
    expect(new Set(channels).size).toBe(ADHAN_STYLES.length);
    expect(adhanChannelId("medina")).toBe("adhan-medina");
  });

  it("resolves unset and unknown styles to the default style", () => {
    expect(resolveAdhanSoundStyleId(undefined)).toBe(DEFAULT_ADHAN_STYLE);
    expect(resolveAdhanSoundStyleId("gone")).toBe(DEFAULT_ADHAN_STYLE);
    expect(resolveAdhanSoundStyleId("toString")).toBe(DEFAULT_ADHAN_STYLE);
    expect(adhanNotificationSound(null)).toBe(DEFAULT_ADHAN_NOTIFICATION_SOUND);
    expect(adhanChannelId("gone")).toBe(`adhan-${DEFAULT_ADHAN_STYLE}`);
  });

  it("gives every style its own clip cut from its own recording (D29)", () => {
    const sounds = ADHAN_STYLES.map((style) => adhanNotificationSound(style.id));
    expect(new Set(sounds).size).toBe(ADHAN_STYLES.length);
    expect(adhanNotificationSound(DEFAULT_ADHAN_STYLE)).toBe(DEFAULT_ADHAN_NOTIFICATION_SOUND);
  });

  it.each(registeredAdhanSoundFiles())(
    "%p is a ≤ 30 s 16 kHz mono 16-bit PCM WAV (iOS notification limit)",
    (file) => {
      const header = readFileSync(resolve(APP_ROOT, "assets/audio/adhan/notification", file));
      expect(header.toString("ascii", 0, 4)).toBe("RIFF");
      expect(header.toString("ascii", 8, 12)).toBe("WAVE");
      // Canonical 44-byte header from ffmpeg `-fflags +bitexact -map_metadata -1`.
      expect(header.readUInt16LE(20)).toBe(1); // PCM
      expect(header.readUInt16LE(22)).toBe(1); // mono
      expect(header.readUInt32LE(24)).toBe(16_000);
      expect(header.readUInt16LE(34)).toBe(16);
      expect(header.toString("ascii", 36, 40)).toBe("data");
      const seconds = header.readUInt32LE(40) / header.readUInt32LE(28);
      expect(seconds).toBeGreaterThan(5);
      expect(seconds).toBeLessThanOrEqual(30);
    },
  );

  it("recognises per-style and legacy adhan channels only", () => {
    expect(isAdhanChannelId("adhan-mishary")).toBe(true);
    expect(isAdhanChannelId("prayerAdhan")).toBe(true);
    expect(isAdhanChannelId("prayer")).toBe(false);
    expect(isAdhanChannelId("zikr")).toBe(false);
  });
});
