import type { AudioTrack } from "@/providers/audio-player-provider";

/**
 * Bundled + CDN adhan recordings (D11). Bundled clip is `require()`d via Metro;
 * additional styles stream from the open Kiwifu/adhan-mp3 collection on jsDelivr
 * (cached on native via `audio-cache.ts`). Play through the shared audio player.
 *
 * Learn-the-words phrase clips are derived from Wikimedia Commons Adhan_wiki
 * (CC BY-SA 3.0), committed under `assets/audio/adhan/phrases/`, and also
 * available on jsDelivr once on GitHub.
 */
const ADHAN_DEFAULT = require("../../assets/audio/adhan/adhan.mp3") as number;

const ADHAN_PHRASE_01 =
  require("../../assets/audio/adhan/phrases/01-allahu-akbar-x4.mp3") as number;
const ADHAN_PHRASE_02 =
  require("../../assets/audio/adhan/phrases/02-ashhadu-la-ilaha.mp3") as number;
const ADHAN_PHRASE_03 =
  require("../../assets/audio/adhan/phrases/03-ashhadu-muhammad.mp3") as number;
const ADHAN_PHRASE_04 =
  require("../../assets/audio/adhan/phrases/04-hayya-ala-salah.mp3") as number;
const ADHAN_PHRASE_05 =
  require("../../assets/audio/adhan/phrases/05-hayya-ala-falah.mp3") as number;
const ADHAN_PHRASE_06 =
  require("../../assets/audio/adhan/phrases/06-allahu-akbar-x2.mp3") as number;
const ADHAN_PHRASE_07 =
  require("../../assets/audio/adhan/phrases/07-la-ilaha-illallah.mp3") as number;

/** Open-source collection: https://github.com/Kiwifu/adhan-mp3 */
const ADHAN_CDN = "https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main";

/**
 * Phrase clips hosted in this repo (jsDelivr). Pin to a commit SHA after they land on
 * `main` if you need immutable URLs; `@main` is fine for follow-the-repo delivery.
 */
const ADHAN_PHRASE_CDN =
  "https://cdn.jsdelivr.net/gh/mubbi/munib-tracker@main/apps/app/assets/audio/adhan/phrases";

const ADHAN_PHRASE_ID_PREFIX = "adhan-phrase:";

/** Medina style used for line-synced follow-along on the learn screen. */
export const ADHAN_FOLLOW_ALONG_STYLE_ID = "medina";

function adhanRemoteUrl(filename: string): string {
  return `${ADHAN_CDN}/${encodeURIComponent(filename)}`;
}

function adhanPhraseRemoteUrl(filename: string): string {
  return `${ADHAN_PHRASE_CDN}/${encodeURIComponent(filename)}`;
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

export interface AdhanPhrase {
  /** 0-based index matching `SalahGuideTopic.steps` order. */
  index: number;
  /** Short ASCII filename under `assets/audio/adhan/phrases/`. */
  filename: string;
  /** Mini-player title (transliteration). */
  title: string;
  /** Bundled Metro asset for offline learn phrases. */
  source: number;
}

/**
 * Standard Sunni adhan lines — one clip per numbered card on `/salah-guide/adhan`.
 * Source: Wikimedia Commons File:Adhan_wiki.oga (CC BY-SA 3.0), segmented.
 */
export const ADHAN_PHRASES: readonly AdhanPhrase[] = [
  {
    index: 0,
    filename: "01-allahu-akbar-x4.mp3",
    title: "Allahu Akbar",
    source: ADHAN_PHRASE_01,
  },
  {
    index: 1,
    filename: "02-ashhadu-la-ilaha.mp3",
    title: "Ashhadu an la ilaha illallah",
    source: ADHAN_PHRASE_02,
  },
  {
    index: 2,
    filename: "03-ashhadu-muhammad.mp3",
    title: "Ashhadu anna Muhammadan rasulullah",
    source: ADHAN_PHRASE_03,
  },
  {
    index: 3,
    filename: "04-hayya-ala-salah.mp3",
    title: "Hayya 'ala as-salah",
    source: ADHAN_PHRASE_04,
  },
  {
    index: 4,
    filename: "05-hayya-ala-falah.mp3",
    title: "Hayya 'ala al-falah",
    source: ADHAN_PHRASE_05,
  },
  {
    index: 5,
    filename: "06-allahu-akbar-x2.mp3",
    title: "Allahu Akbar",
    source: ADHAN_PHRASE_06,
  },
  {
    index: 6,
    filename: "07-la-ilaha-illallah.mp3",
    title: "La ilaha illallah",
    source: ADHAN_PHRASE_07,
  },
];

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

/** Build the learn-the-words phrase queue (one track per adhan sentence card). */
export function adhanPhraseTracks(): AudioTrack[] {
  return ADHAN_PHRASES.map((phrase) => ({
    id: `${ADHAN_PHRASE_ID_PREFIX}${phrase.index}`,
    title: phrase.title,
    subtitle: String(phrase.index + 1),
    uri: adhanPhraseRemoteUrl(phrase.filename),
    source: phrase.source,
  }));
}

export function isAdhanPhraseTrack(trackId: string | undefined | null): boolean {
  return typeof trackId === "string" && trackId.startsWith(ADHAN_PHRASE_ID_PREFIX);
}

/** 0-based phrase index from `adhan-phrase:N`, or undefined. */
export function adhanPhraseIndexFromId(trackId: string | undefined | null): number | undefined {
  if (!isAdhanPhraseTrack(trackId) || trackId == null) return undefined;
  const raw = trackId.slice(ADHAN_PHRASE_ID_PREFIX.length);
  const index = Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= ADHAN_PHRASES.length) return undefined;
  return index;
}

/** Remote CDN URIs for the phrase pack (for prefetch). */
export function adhanPhraseRemoteUris(): string[] {
  return ADHAN_PHRASES.map((phrase) => adhanPhraseRemoteUrl(phrase.filename));
}
