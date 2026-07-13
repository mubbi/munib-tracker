/**
 * Open-data attributions for Munib Tracker.
 * Keep in sync with `apps/app/assets/data/manifest.json` (bundled) and
 * `apps/app/src/app/credits.tsx` (runtime). Marketing `/credits` reads this.
 */

export type DataCredit = {
  id: string;
  name: string;
  license: string;
  attribution: string;
  url: string;
  note?: string;
};

/** Datasets shipped inside the app binary / shared content packages. */
export const BUNDLED_DATA_CREDITS: readonly DataCredit[] = [
  {
    id: "adhkar",
    name: "Adhkar, duas & duroods",
    license: "Text: public domain (Qur'an & Hadith). Audio: streamed, © reciter.",
    attribution:
      "Duas from the full Hisnul Muslim (Fortress of the Muslim) corpus (sheikhhanif/Hisnul_Muslim_Database); adhkar & transliteration from fitrahive/dua-dhikr (Arabic, transliteration, translation). Bengali Hisnul translations from ThelightHub/dua-api (MIT). Indonesian subset from fitrahive/dua-dhikr. Audio streamed from sheikhhanif/Hisnul_Muslim_Database.",
    url: "https://github.com/ThelightHub/dua-api",
    note: "271 duas in 16 categories, 54 adhkar in seven categories, and nine duroods ship bundled.",
  },
  {
    id: "hadith-highlights",
    name: "Hadith highlights",
    license: "Unlicensed source (classical / public-domain hadith text)",
    attribution:
      "Nawawi 40, Riyad as-Salihin, and related highlights via AhmedBaset/hadith-json, sourced from sunnah.com.",
    url: "https://sunnah.com/",
    note: "Only classical highlight sets are bundled; full collections download on demand.",
  },
  {
    id: "names-99",
    name: "99 Names of Allah",
    license: "Text: public domain (classical). Audio: streamed, © reciter.",
    attribution:
      "Asma-ul-Husna — standard Tirmidhi enumeration. Audio via ProgrammerHasan. Locale glosses: olipiskandar (id), adiman-dev/islamic-json (ms), KabDeveloper/99-Names-Of-Allah (fr), asmaul-husna-api-coral (ur/bn).",
    url: "https://sunnah.com/tirmidhi:3507",
  },
  {
    id: "quran-core",
    name: "Qur'an core",
    license: "CC BY-SA 4.0 (Arabic & transliteration) / Public domain (bundled translations)",
    attribution:
      "Arabic & transliteration: Tanzil.net via risan/quran-json. Bundled translations: Pickthall, Yusuf Ali, Fateh Muhammad Jalandhry via fawazahmed0/quran-api. Page metadata: Quran.com API v4 (Madani mushaf).",
    url: "https://tanzil.net/",
  },
  {
    id: "quran-mushaf-layout",
    name: "Mushaf page layout & QCF fonts",
    license: "Open data (check source repository)",
    attribution:
      "Mushaf page layout: zonetecde/mushaf-layout (Madani 15-line Hafs, QPC V2 glyphs). QCF fonts: King Fahd Glorious Qur'an Printing Complex via nuqayah/qpc-fonts.",
    url: "https://github.com/zonetecde/mushaf-layout",
    note: "madinah-15-line-hafs",
  },
] as const;

/** Content fetched or streamed at runtime (cached on device when enabled). */
export const RUNTIME_DATA_CREDITS: readonly DataCredit[] = [
  {
    id: "quran-extra-translations",
    name: "Extra Qur'an translations & tafsir",
    license: "Free to use, © respective authors",
    attribution:
      "Saheeh International, Clear Qur'an (Khattab), and 23 more translation editions plus 123 tafsir editions fetched on demand via fawazahmed0/quran-api, spa5k/tafsir_api, and related CDNs.",
    url: "https://github.com/fawazahmed0/quran-api",
    note: "Two translations ship bundled; the rest download on first open and stay cached offline.",
  },
  {
    id: "hadith-full",
    name: "Full hadith collections",
    license: "Public domain (classical text)",
    attribution:
      "Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, and Ibn Majah via fawazahmed0/hadith-api.",
    url: "https://github.com/fawazahmed0/hadith-api",
  },
  {
    id: "quran-audio",
    name: "Qur'an recitation audio",
    license: "Free to stream",
    attribution: "Per-ayah and surah recitations from everyayah.com.",
    url: "https://everyayah.com/",
  },
  {
    id: "audio-translation",
    name: "Audio translation & adhkar audio",
    license: "Free to stream",
    attribution: "QuranicAudio.com and Internet Archive.",
    url: "https://archive.org/",
  },
  {
    id: "adhan-audio",
    name: "Adhan call audio",
    license: "Bundled clip, © reciter",
    attribution:
      "Bundled call-to-prayer styles (including clips derived from open prayer-audio sets).",
    url: "https://github.com/itsnavee/prayeraudio",
  },
] as const;

/** Libraries and services that power calculations or enrichment (not scripture text). */
export const SERVICE_DATA_CREDITS: readonly DataCredit[] = [
  {
    id: "prayer-times",
    name: "Prayer times calculation",
    license: "MIT",
    attribution:
      "On-device prayer times via the adhan library (Islamic Network / Batoul Apps), with user-selectable calculation methods and madhab.",
    url: "https://github.com/batoulapps/adhan-js",
  },
  {
    id: "weather",
    name: "Weather overlays",
    license: "CC BY 4.0 (Open-Meteo) / Norwegian Meteorological Institute terms",
    attribution:
      "Optional home-screen weather effects via Open-Meteo and MET Norway. Location is used only to fetch local conditions when enabled.",
    url: "https://open-meteo.com/",
  },
] as const;
