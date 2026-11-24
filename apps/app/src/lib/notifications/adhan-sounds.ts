/**
 * Native notification sound + Android channel per adhan style (settings audit
 * B2, D13).
 *
 * - Every sound file named here is registered in the `expo-notifications`
 *   plugin `sounds` array in `app.json` (copied to the iOS bundle and Android
 *   `res/raw` at prebuild). iOS plays the per-notification `sound` and ignores
 *   clips over 30 s; Android plays the *channel's* sound, which can't change
 *   after the channel is created — so each style gets its own channel
 *   (`adhan-<styleId>`), and a style change switches channel + reschedules.
 * - Each style's clip (≤ 30 s, short fade-out) is cut from that style's own
 *   source recording and credited like it. Adhan recordings are exempt from the
 *   D12 licence rule (D29, owner-accepted), so every style ships its own clip.
 *
 * Pure data + helpers (no Metro asset `require`s) so reminder builders, widgets
 * and the web bundle can import it cheaply. Keys mirror `ADHAN_STYLES` ids in
 * `lib/adhan-audio.ts`; a test keeps the two in step.
 */

/** Style used when the preference is unset or names a style that no longer exists. */
const DEFAULT_STYLE_ID = "default";

/**
 * 15 s mono 16-bit WAV converted from the bundled `assets/audio/adhan/adhan.mp3`
 * (source: itsnavee/prayeraudio `sounds/adhan.mp3`). WAV is a documented
 * UNNotificationSound format on iOS and a valid Android raw resource.
 */
export const DEFAULT_ADHAN_NOTIFICATION_SOUND = "adhan_default.wav";

/** Prefix for the per-style Android notification channels. */
export const ADHAN_CHANNEL_PREFIX = "adhan-";

/**
 * Channel id used before per-style channels existed. Deleted on the next
 * channel sync so Android settings don't list a stale "Adhan" channel.
 */
export const LEGACY_ADHAN_CHANNEL_ID = "prayerAdhan";

export type AdhanNotificationSound = {
  /** File name registered in `app.json` → `expo-notifications` → `sounds`. */
  sound: string;
};

/**
 * One entry per `ADHAN_STYLES` id. The four Kiwifu/adhan-mp3 styles use clips
 * cut from the same recordings the app streams (16 kHz mono 16-bit WAV,
 * peak-normalised to −3 dBFS, 1.5 s fade-out, cut at a pause between phrases;
 * see `assets/audio/adhan/README.md`). Kiwifu publishes no licence — accepted
 * by the owner under D29 (2026-11-24).
 */
export const ADHAN_NOTIFICATION_SOUNDS: Readonly<Record<string, AdhanNotificationSound>> = {
  default: { sound: DEFAULT_ADHAN_NOTIFICATION_SOUND },
  "mecca-fajr": { sound: "adhan_mecca_fajr.wav" },
  medina: { sound: "adhan_medina.wav" },
  mishary: { sound: "adhan_mishary.wav" },
  "makkah-muezzin": { sound: "adhan_makkah_muezzin.wav" },
};

/** Known style id for `styleId`, or the default style. */
export function resolveAdhanSoundStyleId(styleId?: string | null): string {
  return styleId && Object.hasOwn(ADHAN_NOTIFICATION_SOUNDS, styleId) ? styleId : DEFAULT_STYLE_ID;
}

/** Registered notification sound file for an adhan style. */
export function adhanNotificationSound(styleId?: string | null): string {
  return (
    ADHAN_NOTIFICATION_SOUNDS[resolveAdhanSoundStyleId(styleId)]?.sound ??
    DEFAULT_ADHAN_NOTIFICATION_SOUND
  );
}

/** Android channel id carrying an adhan style's sound (`adhan-<styleId>`). */
export function adhanChannelId(styleId?: string | null): string {
  return `${ADHAN_CHANNEL_PREFIX}${resolveAdhanSoundStyleId(styleId)}`;
}

/** True for any per-style adhan channel or the legacy single adhan channel. */
export function isAdhanChannelId(channelId: string): boolean {
  return channelId === LEGACY_ADHAN_CHANNEL_ID || channelId.startsWith(ADHAN_CHANNEL_PREFIX);
}

/** Distinct sound files the styles use — each must be in `app.json` `sounds`. */
export function registeredAdhanSoundFiles(): string[] {
  return [...new Set(Object.values(ADHAN_NOTIFICATION_SOUNDS).map((entry) => entry.sound))];
}
