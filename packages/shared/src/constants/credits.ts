/**
 * Open-data attributions for Munib Tracker.
 * Keep in sync with `apps/app/assets/data/manifest.json` (bundled) and
 * `apps/app/src/app/credits.tsx` (runtime). Marketing `/credits` reads this.
 */

import { DUA_COUNT } from "./content-counts";

export type DataCredit = {
  id: string;
  name: string;
  license: string;
  attribution: string;
  url: string;
  note?: string;
  /**
   * Licence notice reproduced verbatim where the source's terms require it
   * (e.g. the Quranic Arabic Corpus header). Shown in full on Credits.
   */
  notice?: string;
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
    note: `${DUA_COUNT} duas in 16 categories, 60 adhkar in seven categories, and nine duroods ship bundled.`,
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
  {
    id: "tasbeeh-sounds",
    name: "Tasbeeh click sounds",
    license: "CC0 1.0 (public domain dedication)",
    attribution:
      "Short wood, stone, glass, resin and mechanical clicks for the tasbeeh counter, trimmed from Kenney's Impact Sounds, Interface Sounds and UI Audio packs (kenney.nl). No music and no bells. Per-file sources: apps/app/assets/audio/tasbeeh/README.md.",
    url: "https://kenney.nl/assets/impact-sounds",
    note: "24 clips, mono AAC, bundled for offline use.",
  },
] as const;

/**
 * Verbatim copyright blocks from the header of the Quranic Arabic Corpus
 * morphology v0.4 file (QAC + Tanzil Uthmani 1.0.2). Its terms require the notice
 * to be "reproduced appropriately in all works derived from" the file (NF-3.22).
 */
export const QURANIC_ARABIC_CORPUS_NOTICE = [
  "# PLEASE DO NOT REMOVE OR CHANGE THIS COPYRIGHT BLOCK",
  "#====================================================================",
  "#",
  "#  Quranic Arabic Corpus (morphology, version 0.4)",
  "#  Copyright (C) 2011 Kais Dukes",
  "#  License: GNU General Public License",
  "#",
  "#  The Quranic Arabic Corpus includes syntactic and morphological",
  "#  annotation of the Quran, and builds on the verified Arabic text",
  "#  distributed by the Tanzil project.",
  "#",
  "#  TERMS OF USE:",
  "#",
  "#  - Permission is granted to copy and distribute verbatim copies",
  "#    of this file, but CHANGING IT IS NOT ALLOWED.",
  "#",
  "#  - This annotation can be used in any website or application,",
  "#    provided its source (the Quranic Arabic Corpus) is clearly",
  "#    indicated, and a link is made to http://corpus.quran.com to enable",
  "#    users to keep track of changes.",
  "#",
  "#  - This copyright notice shall be included in all verbatim copies",
  "#    of the text, and shall be reproduced appropriately in all works",
  "#    derived from or containing substantial portion of this file.",
  "#",
  "#  Please check updates at: http://corpus.quran.com/download",
  "",
  "# PLEASE DO NOT REMOVE OR CHANGE THIS COPYRIGHT BLOCK",
  "#====================================================================",
  "#",
  "#  Tanzil Quran Text (Uthmani, version 1.0.2)",
  "#  Copyright (C) 2008-2009 Tanzil.info",
  "#  License: Creative Commons BY-ND 3.0 Unported",
  "#",
  "#  This copy of quran text is carefully produced, highly",
  "#  verified and continuously monitored by a group of specialists",
  "#  at Tanzil project.",
  "#",
  "#  TERMS OF USE:",
  "#",
  "#  - Permission is granted to copy and distribute verbatim copies",
  "#    of this text, but CHANGING IT IS NOT ALLOWED.",
  "#",
  "#  - This quran text can be used in any website or application,",
  "#    provided its source (Tanzil.info) is clearly indicated, and",
  "#    a link is made to http://tanzil.info to enable users to keep",
  "#    track of changes.",
  "#",
  "#  - This copyright notice shall be included in all verbatim copies",
  "#    of the text, and shall be reproduced appropriately in all files",
  "#    derived from or containing substantial portion of this text.",
  "#",
  "#  Please check updates at: http://tanzil.info/updates/",
  "#",
  "#====================================================================",
].join("\n");

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
    attribution:
      "Per-ayah and surah recitations from everyayah.com. Learn Qur'an example clips use the same streams with optional word-range timing derived from QuranCDN segment data.",
    url: "https://everyayah.com/",
  },
  {
    id: "learn-quran-letter-audio",
    name: "Arabic letter pronunciation (Learn Qur'an)",
    license: "MIT (Abjad-Kids); Telkom Hijaiyah dataset is CC0 when mirrored",
    attribution:
      "Isolated letter clips streamed from the Abjad-Kids dataset on Hugging Face (MIT). Prefer Telkom University Marked Hijaiyah (CC0) if a stable public CDN mirror is available.",
    url: "https://huggingface.co/datasets/Aziz-snoubra/Abjad-Kids",
    note: "Research/educational microphone quality — not a substitute for a tajweed teacher.",
  },
  {
    id: "audio-translation",
    name: "Audio translation & adhkar audio",
    license: "Free to stream",
    attribution:
      "QuranicAudio.com and Internet Archive. Hisnul Muslim (sheikhhanif) phrase audio also powers Learn Salah step-by-step and Words of salah.",
    url: "https://archive.org/",
  },
  {
    id: "salah-how-to-pray-audio",
    name: "Step-by-step salah phrase audio",
    license: "Free to stream / CC BY-SA 3.0 (takbir clip)",
    attribution:
      "In-prayer adhkar from Hisnul Muslim (sheikhhanif CDN). Al-Fatihah via everyayah.com. Opening takbir uses the Wikimedia Commons Adhan_wiki phrase segment (CC BY-SA 3.0) already bundled for Learn Adhan.",
    url: "https://github.com/sheikhhanif/Hisnul_Muslim_Database",
    note: "Closing taslim has no matching single-phrase OSS clip yet — play controls skip that step rather than attaching a mismatched dua.",
  },
  {
    id: "adhan-audio",
    name: "Adhan call audio",
    license:
      "Bundled clip + CC BY-SA 3.0 phrases / CDN styles (Kiwifu/adhan-mp3 publishes no licence — owner-accepted, D29)",
    attribution:
      "Bundled preview and adhan notification sound (adhan_default.wav, converted from the same clip) from itsnavee/prayeraudio; learn-phrase clips segmented from Wikimedia Commons Adhan_wiki (CC BY-SA 3.0, author Jarih); full muezzin styles from Kiwifu/adhan-mp3 via jsDelivr, and each style's notification sound (adhan_mecca_fajr.wav, adhan_medina.wav, adhan_mishary.wav, adhan_makkah_muezzin.wav — ≤ 30 s opening cuts with a fade-out) cut from that same Kiwifu recording.",
    url: "https://commons.wikimedia.org/wiki/File:Adhan_wiki.oga",
    note: "Adhan recordings are exempt from the licence-clearance rule (D29, owner decision 2026-11-24): the itsnavee and Kiwifu sources carry no recorded licence and are used as-is with credit.",
  },
  {
    id: "quran-morphology",
    name: "Quranic Arabic Corpus (morphology v0.4)",
    license:
      "GNU GPL — verbatim copies only; source must be credited with a link to corpus.quran.com",
    attribution:
      "Quranic Arabic Corpus (morphology v0.4), © Kais Dukes, GNU GPL — corpus.quran.com. Word roots and lemmas for root-word search; builds on the Tanzil Uthmani 1.0.2 text (CC BY-ND 3.0, tanzil.net). The file is downloaded unmodified on request from a pinned public GitHub copy and verified by sha256; the root index is built on your device.",
    url: "https://corpus.quran.com",
    note: "Remote, fetched on demand (6 MB). Never bundled or changed.",
    notice: QURANIC_ARABIC_CORPUS_NOTICE,
  },
] as const;

/** Libraries and services that power calculations or enrichment (not scripture text). */
export const SERVICE_DATA_CREDITS: readonly DataCredit[] = [
  {
    id: "quran-practice-listener",
    name: "Qur'an practice, recite-to-find, recite-along & hands-free tasbeeh — on-device listener",
    license:
      "NPL-1.2 (Zipformer weights and phoneme corpus; non-commercial, share-alike — the licence file ships with the download) / CC-BY-4.0 (NVIDIA FastConformer weights) / MIT (Tilawa code, © 2026 yazinsai)",
    attribution:
      "Tilawa 0.4 (yazinsai/tilawa, MIT) with the Zipformer a0w model and phoneme corpus derived from Quran-Lab/zipformer_p-arabic-v3 and alketab's prompter (NPL-1.2). FastConformer listener (also used for the pronunciation check, recite-to-find and hands-free tasbeeh): NVIDIA stt_ar_fastconformer_hybrid_large_pcd_v1.0 (CC-BY-4.0, huggingface.co/nvidia/stt_ar_fastconformer_hybrid_large_pcd_v1.0), modified — exported to ONNX by yazinsai/tilawa; on the web its pinned files come from the public Hugging Face mirror acibZ/tilawa-quran-onnx (commit 0cd79471). Inference by ONNX Runtime (MIT). Practice word data: Quran.com API v4.",
    url: "https://github.com/yazinsai/tilawa",
    note: "Downloaded on request onto the device and checked against pinned SHA-256 digests; never charged for, never behind ads. Audio stays on the device — no feature that uses this listener records, stores or sends audio.",
  },
  {
    id: "quran-practice-pronunciation",
    name: "Qur'an practice — pronunciation listener",
    license: "NPL-1.3 (Quran-Lab No-Profit License)",
    attribution:
      "TajweedFormer V4 model and SDK 4 (iOS, Android, web) by Quran Lab, a waqf. The model is protected: it runs only inside Quran Lab's SDK and Core, encrypted for each device. Automatic tajweed feedback can be wrong; it does not replace a qualified teacher.",
    url: "https://sdk.quranlab.ai/licence",
    note: "Optional; downloaded only after you agree on the pronunciation consent sheet. Recitation is processed on the device. Quran Lab's SDK always sends anonymous daily counts and error reports (never audio, words, names or device IDs) and may ask you, at most three times, whether to share recordings — sharing stays off unless you say yes. Free, with no ads or paywall (NPL-1.3).",
  },
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
  {
    id: "masjids-osm",
    name: "Masjid finder (OpenStreetMap)",
    license: "ODbL 1.0",
    attribution:
      "© OpenStreetMap contributors. Masjid locations, names, addresses, facilities and Jumu'ah service times come from OpenStreetMap via the Overpass API, fetched and cached by the Munib Tracker server. Only a ~5 km area code is sent, never your exact location.",
    url: "https://www.openstreetmap.org/copyright",
    note: "Corrections are made upstream on OpenStreetMap. Your own iqamah times stay on your devices.",
  },
] as const;
