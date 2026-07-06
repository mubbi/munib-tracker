import type { AudioTrack } from "@/providers/audio-player-provider";

/**
 * Bundled + CDN adhan recordings (D11). Bundled clip is `require()`d via Metro;
 * additional styles stream from the open Kiwifu/adhan-mp3 collection on jsDelivr
 * (cached on native via `audio-cache.ts`). Play through the shared audio player.
 */
const ADHAN_DEFAULT = require("../../assets/audio/adhan/adhan.mp3") as number;

/** Open-source collection: https://github.com/Kiwifu/adhan-mp3 */
const ADHAN_CDN = "https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main";

function adhanRemoteUrl(filename: string): string {
  return `${ADHAN_CDN}/${encodeURIComponent(filename)}`;
}

export interface AdhanStyle {
  id: string;
  name: string;
  location: string;
  /** Bundled Metro asset module, when set. */
  source?: number;
  /** Remote MP3 URL (open-source CDN). */
  uri?: string;
  /** Short credit line for the audio source screen. */
  credit: string;
}

export const ADHAN_STYLES: AdhanStyle[] = [
  {
    id: "default",
    name: "Classic adhan",
    location: "Bundled preview",
    source: ADHAN_DEFAULT,
    credit: "itsnavee/prayeraudio",
  },
  {
    id: "mecca-fajr",
    name: "Mecca — Fajr",
    location: "Al-Masjid al-Haram",
    uri: adhanRemoteUrl("Adhan_Fajr_Al_Haram_Al_Maki_(أذان_الفجر_الحرم_المكي).mp3"),
    credit: "Kiwifu/adhan-mp3",
  },
  {
    id: "medina",
    name: "Medina",
    location: "Al-Masjid an-Nabawi",
    uri: adhanRemoteUrl(
      "Adhan_Al_Haram_Al_Madani_-_Al_Madinah_1_(أذان_الحرم_المدني_-_المدينة_المنورة).mp3",
    ),
    credit: "Kiwifu/adhan-mp3",
  },
  {
    id: "mishary",
    name: "Mishary Alafasy",
    location: "Kuwait",
    uri: adhanRemoteUrl("Mishary_Rashid_Alafasy_1_-_Kuwait_(مشاري_راشد_العفاسي_-_الكويت).mp3"),
    credit: "Kiwifu/adhan-mp3",
  },
  {
    id: "makkah-muezzin",
    name: "Ali Ibn Ahmad Mala",
    location: "Al-Masjid al-Haram",
    uri: adhanRemoteUrl(
      "Ali_Ibn_Ahmad_Mala_1_-_Al_Haram_Al_Maki_(علي_بن_أحمد_ملا_-_الحرم_المكي).mp3",
    ),
    credit: "Kiwifu/adhan-mp3",
  },
];

/** CDN muezzin recordings shown on Learn Salah → Adhan (excludes bundled preview). */
export const ADHAN_LEARN_STYLES = ADHAN_STYLES.filter((style) => style.id !== "default");

export const DEFAULT_ADHAN_STYLE = "default";

/** Build an `AudioTrack` for a bundled or remote adhan style. */
export function adhanTrack(styleId: string = DEFAULT_ADHAN_STYLE): AudioTrack {
  const style = ADHAN_STYLES.find((s) => s.id === styleId) ?? ADHAN_STYLES[0];
  return {
    id: `adhan:${style.id}`,
    title: style.name,
    subtitle: style.location,
    uri: style.uri ?? "",
    source: style.source,
  };
}

/** All learn-page adhan tracks. */
export function allAdhanTracks(): AudioTrack[] {
  return ADHAN_LEARN_STYLES.map((style) => adhanTrack(style.id));
}
