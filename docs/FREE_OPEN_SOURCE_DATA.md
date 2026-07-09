# Free & Open-Source Islamic Data — Sourcing & Integration Plan

> **Goal:** Populate Munib Tracker with authentic Qur'an, Hadith, Duas, Adhkar, translations, and
> transliterations from free / open-source data that is **valid and accepted by the majority of the
> Muslim ummah**, and integrate it into the app in the most appropriate way for each content type
> (bundled JSON, seeded local store, or live third-party API).
>
> Last researched: **July 2026**. Verify licenses again before shipping — terms change.
>
> **Status (2026-07-05):** the integration described here is **implemented** — the app now has a
> Qur'an reader and Hadith library, and the duas/adhkar/99-Names content has been expanded from
> the small hand-written sets described in §1.1 below. Treat §1.1's "what the app has now" as the
> *pre-implementation* snapshot; this document is retained as the sourcing/rationale record.

---

## 1. Why this document exists (app audit)

Munib Tracker today ships a small amount of **hand-written static content** and calculates prayer
times on-device. It has no Qur'an reader and no Hadith library. This plan covers **expanding the
existing content** and **adding two new content domains (Qur'an + Hadith)** using vetted open data.

### 1.1 What the app has now

| Domain | Where it lives | Count today | Shape |
|---|---|---|---|
| Zikr / Adhkar | `packages/shared/src/content/zikr.ts` | ~28 | `arabic, transliteration, translation, virtues, reference, targetCount` |
| Duas | `packages/shared/src/content/duas.ts` | 9 | `arabic, transliteration, translation, reference` |
| Duroods / Salawat | `packages/shared/src/content/duroods.ts` | 4 | same as Dua |
| Names of Allah | `packages/shared/src/content/names.ts` | 25 | `arabic, transliteration, translation` |
| Prayer times | `adhan` npm package (calculated) | n/a | computed from GPS |
| Qibla | `expo-location` (calculated) | n/a | computed |

**Storage/tech reality that constrains our choices:**

- **Offline-first**, everything persisted in **AsyncStorage** (`@react-native-async-storage/async-storage`). **No SQLite / WatermelonDB / Realm.**
- Monorepo: read-only content in `packages/shared/src/content/*.ts`; user/tracking data in `apps/app/src/db/repositories/*`.
- Content is versioned with constants (`ZIKR_CONTENT_VERSION`, `DUA_CONTENT_VERSION`, …) that can trigger re-seed via `apps/app/src/db/migrations.ts`.
- i18n: `en`, `ar`, `ur` (`apps/app/src/i18n/*.json`).
- **Constraint (from project memory): avoid new native dependencies** — keep it rebuild-free and cross-platform (iOS / Android / Web). This pushes us toward **bundled JSON assets + CDN APIs** rather than an on-device SQL database. See §6.

### 1.2 What we need to source

1. **Qur'an** — Arabic (Uthmani) text, verse metadata (surah/juz/page), **translations** by accepted scholars, **transliteration**, optional **tafsir**, optional **audio**. *(New feature.)*
2. **Hadith** — the canonical collections (Kutub al-Sittah + others), Arabic + English, **with authenticity grades**. *(New feature.)*
3. **Duas & Adhkar** — expand to full **Hisnul Muslim** (Fortress of the Muslim). *(Expand existing.)*
4. **Names of Allah** — complete **99** with meanings. *(Expand existing.)*
5. **Prayer times / Qibla** — keep on-device calc; note an API fallback.

---

## 2. Guiding principles

1. **Authenticity first (ummah-accepted).**
   - Qur'an: use the **Ḥafṣ ʿan ʿĀṣim** reading in **Uthmani (Madīnah Mushaf) script** — the reading used by the overwhelming majority of Muslims worldwide and published by the **King Fahd Complex** for the Printing of the Holy Qur'an. **Tanzil.net** distributes exactly this, verified character-by-character.
   - Hadith: use the **Kutub al-Sittah** (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah) plus Malik's Muwatta / Ahmad, **and always carry the grade** (ṣaḥīḥ/ḥasan/ḍaʿīf) and the collection reference. Never present ḍaʿīf/mawḍūʿ material without its grade.
   - Duas/Adhkar: **Hisnul Muslim** by Sheikh **Saʿīd bin ʿAlī bin Wahf al-Qaḥṭānī** — a globally trusted, referenced compilation (every dua cites its Qur'an/Hadith source).
   - This app's content model (Witr, Tahajjud, Sunnah prayers, Hisnul Muslim adhkar) is **mainstream Sunni**, which is what "majority of the ummah" points to here. Keep translations sectarian-neutral; avoid polemical editions.

2. **License-clean.** Prefer **public domain / CC0 / CC-BY / CC-BY-SA / MIT / Unlicense**. Some *translations* are still **copyrighted** even when a website serves them for free (see §11). Track license per resource.

3. **Offline-first & durable.** The core mushaf and core adhkar must work with **zero network**. APIs are for *enrichment* (extra translations, audio streaming, tafsir), never for the critical path.

4. **No unnecessary native deps.** Ship data as **bundled JSON** and read it lazily; use **remote CDNs** for large/optional extras. Only consider `expo-sqlite` if full-offline Hadith search becomes a hard requirement (§6.4).

5. **Attribution built-in.** Add a "Data sources & credits" screen; store attribution text with each dataset (Tanzil requires a visible link back; CC-BY requires credit).

---

## 3. Qur'an — Arabic text

### 3.1 Recommended primary source

| Source | Contents | Script / reading | License | Verdict |
|---|---|---|---|---|
| **Tanzil.net** (`tanzil.net/download`) | Full Qur'an text, multiple types | **Uthmani** & **Simple** (Ḥafṣ) | **CC BY 3.0** — verbatim only, must credit + link to tanzil.net | ✅ **Primary. Gold standard for Arabic text.** |
| **Quranic Universal Library (QUL)** — `qul.tarteel.ai` (by Tarteel AI) | Uthmani + tajweed + IndoPak scripts, word-by-word, mushaf-layout/page data, 200+ translations, 115 tafsirs, 9 transliterations, recitations w/ timestamps | Multiple | Open-sourced; **per-resource licenses** — check each | ✅ **Primary hub for everything beyond bare text** (layout, word-by-word, bulk translations). |
| **risan/quran-json** (GitHub + jsDelivr CDN) | Uthmani text + transliteration + several translations, pre-chunked per-surah / per-ayah JSON | Uthmani | **CC BY-SA 4.0** | ✅ **Fastest bootstrap** — ready-made JSON, no processing. Arabic from *Noble Qur'an Encyclopedia*, translit/translations from Tanzil. |
| **fawazahmed0/quran-api** | 90+ languages, 400+ editions, served free via jsDelivr CDN | Multiple | **Unlicense (public domain)** for the project | ✅ Great **CDN fallback / extra-translation** source, no key, no rate limit. |
| **Al Quran Cloud** — `alquran.cloud/api` (Islamic Network) | 114 surahs / 6236 ayahs, dozens of translations/tafsir/audio editions | Uthmani (Tanzil-derived) | API code GPL-3.0; text from Tanzil | ✅ Good **live API** option, no auth. |
| **Quran.Foundation API** (quran.com) — `api-docs.quran.foundation` | Official quran.com content API v4: verses, translations (Saheeh Intl, Khattab…), recitations | Multiple | Free; **requires client registration** (id/secret) | ◻︎ Use if you want the *canonical quran.com* editions & word-by-word with an official API. |

**Recommendation:** Bootstrap the mushaf from **risan/quran-json** (ready JSON) *or* pull raw text from **Tanzil** and process it ourselves (§9). Treat **QUL** as the enrichment warehouse for word-by-word and mushaf page layout later.

### 3.2 Verse metadata to include

Surah number/name (Arabic + English + transliteration), ayah number (in-surah and global 1–6236),
juz', hizb, rukū', **page (Madīnah Mushaf)**, sajda flag, revelation place (Makki/Madani). Tanzil
& QUL provide all of this.

---

## 4. Qur'an — Translations (by accepted scholars)

Pick a **curated shortlist** rather than dumping 400 editions. Suggested defaults per language:

| Language | Translation | Author | Acceptance | License note |
|---|---|---|---|---|
| English | **Saheeh International** | Umm Muhammad (al-Muntada) | Very widely used, clear salafi-neutral English | Free to distribute; **copyrighted** — served by Tanzil/quran.com with permission. Keep verbatim + credit. |
| English | **The Clear Qur'an** | Dr. Mustafa Khattab | Modern, extremely popular | **Copyrighted** (Book of Signs Fdn). Available via quran.com API; confirm redistribution terms before bundling. |
| English | **Pickthall** (1930) | M. Marmaduke Pickthall | Classic, respected | **Public domain** ✅ (safe to bundle). |
| English | **Yusuf Ali** (1934) | Abdullah Yusuf Ali | Classic, widely cited | Public domain in most jurisdictions ✅ (use a clean, footnote-free text). |
| Urdu | **Fateh Muhammad Jalandhry** | — | Standard, mainstream | Public domain / freely distributed on Tanzil ✅. |
| Urdu | **Kanz-ul-Iman / Maududi (Tafheem)** | A.R. Thanvi / Maududi | Popular (pick per audience) | Check each; some copyrighted. |
| Arabic (tafsir-lite) | **Muyassar** | King Fahd Complex | Official, concise | Freely distributed ✅. |

**Source of the translation text:** all of the above are downloadable from **Tanzil** (translations
section), **QUL**, or via the **fawazahmed0** / **Al Quran Cloud** / **Quran.Foundation** APIs by
edition id.

**Rule of thumb:** *bundle the public-domain ones (Pickthall, Yusuf Ali, Jalandhry) for offline;
fetch the copyrighted-but-free ones (Saheeh Intl, Khattab) live via API* so licensing stays clean
and the app download stays small. Let the user pick their preferred translation in Settings (the app
already has `translationLocale` in `UserPreferences`).

---

## 5. Qur'an — Transliteration

| Source | Coverage | License |
|---|---|---|
| **Tanzil transliteration** (English, ayah-by-ayah) | Full Qur'an | CC BY 3.0 (credit Tanzil) ✅ |
| **QUL transliterations** (9 ayah-level + 1 word-by-word) | Full Qur'an | Per-resource ✅ |
| **risan/quran-json** (bundles Tanzil translit) | Full Qur'an | CC BY-SA 4.0 ✅ |

**Recommendation:** use the **Tanzil / risan** ayah-level transliteration for the reader; use **QUL
word-by-word** transliteration if/when you add a word-by-word study view. This matches the app's
existing `transliteration` field convention.

---

## 6. Delivery strategy — how each dataset should reach the app

This is the "which approach for each" decision the request asks for. Given the **AsyncStorage /
no-native-dep** reality:

### 6.1 Decision matrix

| Content | Size | Query needs | **Recommended delivery** | Why |
|---|---|---|---|---|
| **Adhkar / Duas / Duroods / 99 Names** | Small (KB) | Browse by category | **Bundled static content** (extend existing `packages/shared/src/content/*.ts` or JSON in `assets/`) | Matches current pattern; instant, offline, trivially versioned. |
| **Qur'an Arabic + 1–2 PD translations + transliteration** | ~2–6 MB/edition | Read sequentially by surah/page; jump to ayah | **Bundled JSON assets, lazy-loaded per surah** (`assets/quran/surah-001.json` …) via `require`/`Asset` | Fully offline core mushaf, no DB, no native module. Load one surah at a time to keep memory low. |
| **Extra translations (Saheeh Intl, Khattab, others), tafsir** | Large / many | On demand | **Live CDN/API** (fawazahmed0 jsDelivr, Al Quran Cloud, Quran.Foundation) + cache with React Query | Keeps app small & license-clean; only fetched when the user selects that edition. |
| **Qur'an audio (per-ayah / per-surah)** | Very large | Stream | **Third-party CDN, streamed** (everyayah.com / QuranicAudio / QUL) | Never bundle audio; stream + optional download-for-offline later. |
| **Hadith (50k+)** | Large (tens of MB) | Search + browse by book/chapter | **Hybrid:** bundle **curated highlights** (e.g. 40 Nawawi, Riyad as-Salihin) as JSON; serve **full collections via API** (or lazy per-book JSON) | Full offline Hadith with search really wants SQLite; avoid that unless required (§6.4). |

### 6.2 Bundled JSON pattern (recommended for Qur'an core)

```
apps/app/src/assets/quran/
  meta.json              # surah list, juz/page index, revelation info
  arabic/surah-001.json  # { "1": "بِسْمِ...", "2": "...", ... }  (Uthmani)
  translit/surah-001.json
  translation/en-pickthall/surah-001.json
```

Load lazily in a repository/hook (`quran-repository.ts`) using `expo-asset` + `fetch`/`require`,
cache parsed surahs in memory (React Query or a small LRU). No AsyncStorage bloat — AsyncStorage
stays for **user data only** (bookmarks, last-read position, reading progress).

### 6.3 What to store in AsyncStorage (user data, not content)

Add a `quran` slice: `lastRead {surah, ayah}`, `bookmarks[]`, `khatmah/reading-plan progress`,
`preferredTranslationId`, `preferredReciterId`. Follow the existing repository pattern
(`apps/app/src/db/repositories/`), new key under `DB_KEYS`, bump a `QURAN_CONTENT_VERSION`.

### 6.4 If full offline Hadith search becomes a hard requirement

Then—and only then—introduce **`expo-sqlite`** (bundled prebuilt `.db`), and ship the Hadith corpus
as a seeded SQLite database. **This breaks the "no new native deps" rule**, so treat it as an
explicit, approved exception. See [[no-new-native-deps]]. Until then, prefer **API-backed Hadith +
bundled highlights**.

### 6.5 On "encrypted built-in data"

You mentioned possibly encrypting built-in data. **Recommendation: don't encrypt the Qur'an/Hadith
text.** It's public/openly-licensed — there's no IP reason to hide it, obfuscation only adds bundle
size, CPU cost, and startup latency, and it's discouraged to obscure scripture. **Do** add a
**SHA-256 integrity hash** per data file (checked at seed time) so corrupted/tampered content is
detected. Reserve encryption only for a *copyrighted* translation whose license explicitly forbids
plain redistribution (rare — usually you'd just fetch those via API instead).

---

## 7. Hadith

| Source | Contents | Grades? | License | Verdict |
|---|---|---|---|---|
| **sunnah.com API** (`sunnah.com/developers`, official) | Kutub al-Sittah + more, Arabic + English | Yes | **API key required** (request via their GitHub); data terms not fully open — respect their ToS | ✅ **Canonical & authoritative.** Best for a live, correct source. Ask for offline dump if needed. |
| **AhmedBaset/hadith-json** (GitHub) | **50,884** hadith, **17 books** (9 books + Riyad as-Salihin, Shamail, 40-hadith sets), Arabic + English | Limited (no full grade field) | **No explicit license** — scraped from sunnah.com ⚠️ | ◻︎ Convenient for prototyping; **legally gray**, confirm before shipping. Lacks grades. |
| **mhashim6/Open-Hadith-Data** | 9 books incl. Six + Arabic diacritics | Partial | Open | ◻︎ Good Arabic corpus. |
| **HadithAPI.com** | Bukhari, Muslim etc. with `status` (Sahih/Hasan/Daif) | Yes ✅ | Free w/ key | ✅ Handy API that **carries grades** — good for the grade requirement. |
| **QUL / Tarteel** | Hadith resources alongside Qur'an | Varies | Per-resource | ◻︎ Check availability. |
| **fawazahmed0/hadith-api** (jsDelivr CDN) | Kutub al-Sittah + more; **multi-language editions** (`urd-*`, `ind-*`, `tur-*`, `ben-*`, `fra-*`, `rus-*`, …) | Varies | **Unlicense** | ✅ **Shipped** for remote hadith translation in app locales `ur`, `id`, `tr`, `bn`, `fr`, `ru` — see `packages/shared/src/i18n/hadith-editions.ts` and `apps/app/src/api/hadith-remote.ts`. Arabic uses bundled `arabic` field; others cache per `collection:translationLocale`. |

**Recommendation:**
- **Authoritative path:** integrate the **official sunnah.com API** (request a key). Present
  collection → book → chapter → hadith, always showing **reference + grade**.
- **Offline highlights:** bundle small, universally-accepted curated sets as JSON —
  **40 Hadith an-Nawawi**, **Riyad as-Salihin** (or a "Hadith of the day" pool) — these are compact
  and safe.
- Store the **grade** and **collection reference** on every hadith. Extend a `HadithItem` type
  mirroring the app's content convention: `{ id, collection, book, chapterId, number, arabic,
  english, narrator, grade, gradedBy, reference }`.
- Prefer sources that **include grades** (sunnah.com / HadithAPI); avoid presenting ungraded scraped
  data as authoritative.

---

## 8. Duas & Adhkar (expand existing → full Hisnul Muslim)

| Source | Contents | License | Verdict |
|---|---|---|---|
| **fitrahive/dua-dhikr** (GitHub) | "Authentic Sunnah Dua & Dhikr" REST API, categorized, Arabic + translit + translation + source | Open | ✅ Clean structure that maps directly to your `DuaItem`/`ZikrItem`. |
| **Seen-Arabic/Morning-And-Evening-Adhkar-DB** | Morning/evening adhkar, Arabic + English, **JSON/CSV/SQL/SQLite** | Open | ✅ Great for the morning/evening categories you already have. |
| **wafaaelmaandy/Hisn-Muslim-Json** | Full Hisnul Muslim, Arabic + English JSON | Open | ✅ Full Fortress-of-the-Muslim corpus. |
| **ThelightHub/dua-api** | Hisnul Muslim book 1, Arabic + Bengali segments (~133 chapters) | Open API | ✅ **Shipped** in `build-adhkar.mjs` for `bn` (~128/270 duas matched by Arabic prefix). |
| **fitrahive/dua-dhikr** | Subset of duas, Indonesian | Open | ✅ Partial `id` translations in adhkar pipeline. |
| **BetimShala/mburoja-api** | Hisnul Muslim chapters + invocations API | Open | ◻︎ Alternative API form. |
| **ahegazy/muslimKit azkar JSON** | Azkar with `zekr`, `repeat`, `bless`(source) | Open | ✅ Includes repeat-count → maps to your `targetCount`. |

**Recommendation:** **Bundle** a processed Hisnul Muslim dataset into
`packages/shared/src/content/` (or `assets/adhkar/*.json`), mapped onto your existing
`ZikrItem`/`DuaItem` shapes (`arabic, transliteration, translation, virtues, reference,
targetCount, categoryId`). Cross-check every dua's **reference** field against Hisnul Muslim's cited
Qur'an/Hadith. Bump `ZIKR_CONTENT_VERSION` / `DUA_CONTENT_VERSION` to trigger re-seed via
`migrations.ts`. This is the highest-value, lowest-risk expansion — do it first.

---

## 9. Names of Allah (complete the 99)

- Standard **Asma-ul-Husna** list (99) is available in essentially every dataset above
  (fawazahmed0, QUL, muslimKit, awesome-Islam collections) and is uncontroversial.
- **Bundle** the full 99 into `packages/shared/src/content/names.ts`, keeping your existing shape
  (`id, arabic, transliteration, translation`) and optionally adding a short `meaning`/`benefit`
  string. Bump `NAMES_CONTENT_VERSION`.

---

## 10. Audio — for every content type

Your content types (`ZikrItem`, `DuaItem`, `DurudItem`, `NameOfAllah`) already carry an `audioUri?`
field, and `UserPreferences` has `audioSpeed` — so audio is a first-class feature. **Golden rule:
never bundle audio in the app binary** (it's hundreds of MB). Stream from a CDN via
`expo-av`/`expo-audio`, with an optional "download for offline" per item/surah later. Cache the
resolved URLs; store only the user's chosen reciter/qari in AsyncStorage.

### 10.1 Qur'an recitation (Arabic)

| Source | Granularity | Reciters | License | Use |
|---|---|---|---|---|
| **everyayah.com** | **Per-ayah** MP3 (predictable URL pattern per reciter) | 40+ (Alafasy, Sudais, Husary, Abdul Basit, Minshawi…) | Free / Internet Archive mirrors | ✅ **Best for a reader** — highlight the current ayah as it plays. |
| **QuranicAudio.com** | **Per-surah** MP3 | Many | Free downloads | ✅ Good for full-surah playback. |
| **QUL (Tarteel)** | Per-ayah/surah **+ segment timestamps** | 71 unsegmented / 57 segmented | Per-resource | ✅ Use its **timing data** for word-by-word/ayah highlighting. |
| **Al Quran Cloud / Quran.Foundation** | Per-ayah via API (audio editions) | Several | Free | ◻︎ API-driven alternative. |

### 10.2 Translation audio (recited meaning)

| Source | Content | Granularity | Note |
|---|---|---|---|
| **QuranicAudio.com** | **Saheeh International (English)** recited by **Ibrahim Walk** — paired with Abdul Basit or Alafasy Arabic | Per-surah (Arabic ayah → English) | ✅ The standard free English audio-translation. |
| **Internet Archive** | Ibrahim Walk **English-only** & Arabic+English combined editions | Per-surah | ✅ Mirror/backup. Saheeh Intl text is copyrighted-but-freely-distributed → credit + verbatim. |
| Urdu audio translations | Available on QuranicAudio / Archive (various qaris) | Per-surah | ◻︎ Add per audience. |

### 10.3 Transliteration audio — **no separate dataset needed**

The transliteration is just the Latin rendering of the **same Arabic sound**, so the **Qur'an
recitation in §10.1 *is* the transliteration's audio.** Reuse the same reciter URL; no extra source
required. (Same applies to adhkar/dua/names transliteration → reuse their Arabic audio.)

### 10.4 Duas & Adhkar audio (Hisnul Muslim)

| Source | Content | Format | License |
|---|---|---|---|
| **Greentech / GTAF Hisnul Muslim audio** (Internet Archive) | Full Fortress-of-the-Muslim, per-dua Arabic | MP3 | Free (attribution) ✅ |
| **khDev01/islamic-data** → "Fortress of the Muslim With Audio" | Adhkar + audio | CSV + MP3 | Open ✅ |
| **Seen-Arabic/Morning-And-Evening-Adhkar-DB** | Morning/evening adhkar | JSON/SQLite (audio refs) | Open ✅ |

→ Map each dua/zikr's `audioUri` to the matching Hisnul Muslim track. This directly fills the
`audioUri?` fields you already have in `ZikrItem`/`DuaItem`.

### 10.5 99 Names of Allah audio

| Source | Content | Note |
|---|---|---|
| **Internet Archive "Asma ul Husna – 99 Names"** collections | Per-name pronunciation MP3 (and the well-known recited nasheed) | ✅ Free. Prefer a **clear per-name pronunciation** set (for learning) over the melodic nasheed (single track). |

→ Fills `NameOfAllah.audioUri`. Use a per-name pronunciation clip so tapping a name plays just that name.

### 10.6 Hadith audio (optional)

| Source | Content | Note |
|---|---|---|
| **Internet Archive – 40 Hadith an-Nawawi audiobooks** | Per-hadith Arabic (+ some English) MP3 | ✅ Great for your bundled Nawawi highlights. |
| Riyad as-Salihin / others | Scattered audiobooks on Archive | ◻︎ Coverage is patchy; full six-books per-hadith audio is **not** reliably available open-source. |

→ Realistic scope: attach audio to the **curated highlight sets** (40 Nawawi), not the entire 50k
corpus. Don't promise per-hadith audio for the full Kutub al-Sittah — it doesn't exist openly.

### 10.7 Prayer times & Qibla (calculated, not audio data)

- **Prayer times:** keep the on-device **`adhan`** library (already installed) — offline, all major
  methods (MWL, ISNA, Umm al-Qura, Karachi, Egypt…). Fallback: **Aladhan API** (GPL-3.0, free, no key).
- **Adhan (call to prayer) audio:** stream a standard adhan MP3 (Makkah/Madinah muezzin) from
  Internet Archive for prayer-time notifications — a single small file, one per style.
- **Qibla:** keep `expo-location` compass calc.

### 10.8 Audio coverage summary

| Content | Open audio? | Best source | Granularity |
|---|---|---|---|
| Qur'an (Arabic) | ✅ Excellent | everyayah / QuranicAudio / QUL | Per-ayah |
| Qur'an translation | ✅ Good (EN) | QuranicAudio (Ibrahim Walk) | Per-surah |
| Transliteration | ✅ Reuse Arabic audio | (same as recitation) | Per-ayah |
| Duas / Adhkar | ✅ Good | Hisnul Muslim audio (Archive/GTAF) | Per-dua |
| 99 Names | ✅ Good | Archive Asma ul Husna | Per-name |
| Hadith | ⚠️ Partial | Archive 40-Nawawi audiobooks | Highlights only |
| Adhan call | ✅ Yes | Archive muezzin MP3 | Per-style |

---

## 11. Licensing & attribution checklist (do before shipping)

| Dataset | License | Obligation |
|---|---|---|
| Tanzil Qur'an text & transliteration | **CC BY 3.0** | Show source "Tanzil Project" + **link to tanzil.net**; **no modification** of text. |
| risan/quran-json | **CC BY-SA 4.0** | Credit + **share-alike** any modified data. |
| fawazahmed0/quran-api | **Unlicense** | None (public domain). |
| Al Quran Cloud / Aladhan (Islamic Network) | **GPL-3.0 (code)** | Applies to their *code*; data derives from Tanzil → credit Tanzil. |
| Pickthall / Yusuf Ali / Jalandhry translations | **Public domain** | Safe to bundle; still credit the translator. |
| **Saheeh International / Khattab "Clear Qur'an"** | **Copyrighted (free to use)** | Verbatim only, credit; **prefer API delivery**; confirm redistribution rights before *bundling*. |
| sunnah.com hadith | Site ToS / **API key** | Follow ToS; attribute sunnah.com; don't rehost bulk without permission. |
| AhmedBaset/hadith-json | **No license** ⚠️ | Do **not** ship in production without clarifying rights. |
| Hisnul Muslim JSON repos | Mixed | Arabic is fine; verify the English translation's rights. |

Ship a **"Data Sources & Credits"** screen listing every dataset + license + link. Store an
`attribution` string alongside each seeded dataset so it's auditable.

---

## 12. AI processing pipeline (how to turn sources into app seeds)

When you hand a source to an AI to "process into our local seed", give it this contract:

**1. Target schemas** (align to existing `packages/shared/src/types/`):

```ts
// Qur'an (new)
interface Surah { number: number; nameArabic: string; nameEnglish: string;
  nameTransliteration: string; revelationPlace: "makkah"|"madinah"; ayahCount: number; }
interface Ayah { surah: number; ayah: number; global: number; // 1..6236
  arabic: string; juz: number; hizb: number; page: number; sajda: boolean; }
interface AyahTranslation { surah: number; ayah: number; editionId: string; text: string; }
interface AyahTransliteration { surah: number; ayah: number; text: string; }

// Hadith (new)
interface HadithItem { id: string; collection: string; book: string; chapterId: string;
  number: string; arabic: string; english: string; narrator?: string;
  grade?: string; gradedBy?: string; reference: string; }

// Adhkar/Dua/Names reuse existing ZikrItem / DuaItem / NameOfAllah shapes.
```

**2. Processing rules to give the AI:**
- Preserve Arabic **exactly** (Uthmani diacritics, no normalization, no removing tashkeel).
- Normalize field names to the target schema; drop editorial footnote markup from translations.
- Emit **one JSON file per surah / per hadith-book** (lazy-loadable), UTF-8, no BOM.
- Attach `editionId`, `license`, `attribution`, and a `sourceUrl` to each edition manifest.
- Produce a **SHA-256** per output file → write to `manifest.json` for integrity checks.
- Validate: 114 surahs / 6236 ayahs; every ayah has Arabic; translations align by (surah, ayah);
  every hadith has a `reference`; flag any missing grade.
- Never invent, "correct", or paraphrase religious text; if a value is missing, leave it null and
  list it in a `gaps.json` report.

**3. Output layout:** as in §6.2 (`assets/quran/...`, `assets/hadith/<collection>/<book>.json`,
`content/adhkar.json`) + a top-level `manifest.json` (versions, hashes, licenses).

**4. Wire-up:** add `quran-repository.ts` / `hadith-repository.ts` (lazy asset loaders + React Query
cache), extend `migrations.ts` to seed/re-seed on version bump, add Settings toggles for
translation/reciter, and add the Credits screen.

---

## 13. Recommended phased roadmap

| Phase | Deliverable | Sources | Delivery |
|---|---|---|---|
| **P1 — Expand what exists (low risk, high value)** | Full **Hisnul Muslim** adhkar/duas, complete **99 Names** | Hisn-Muslim-Json, Seen-Arabic ADB, fitrahive | Bundled static content; bump content versions |
| **P2 — Qur'an reader (core)** | Uthmani mushaf + transliteration + **Pickthall/Yusuf Ali/Jalandhry** (PD) | Tanzil / risan/quran-json | Bundled per-surah JSON assets; new `quran-repository` + AsyncStorage user slice (last-read, bookmarks) |
| **P3 — Qur'an enrichment** | Extra translations (**Saheeh Intl, Khattab**), tafsir, **audio** | Quran.Foundation / fawazahmed0 / Al Quran Cloud; everyayah/QuranicAudio | Live CDN/API + React Query cache; streamed audio |
| **P4 — Hadith** | Browse Six Books + **40 Nawawi / Riyad as-Salihin** offline highlights, with **grades** | sunnah.com API + bundled highlights | Bundled highlights JSON + API for full corpus (SQLite only if offline search is mandated) |
| **P5 — Polish** | Data Sources & Credits screen, integrity hashes, word-by-word study view | QUL word-by-word | Bundled/QUL |

---

## 14. Quick-reference source list

- **Tanzil** (Qur'an text/translit/translations, CC BY): https://tanzil.net/download/
- **QUL / Tarteel** (everything hub): https://qul.tarteel.ai/
- **risan/quran-json** (ready JSON, CC BY-SA): https://github.com/risan/quran-json
- **fawazahmed0/quran-api** (CDN, Unlicense): https://github.com/fawazahmed0/quran-api
- **Al Quran Cloud API** (free, no key): https://alquran.cloud/api
- **Quran.Foundation API** (official quran.com, needs registration): https://api-docs.quran.foundation/
- **sunnah.com developers** (official Hadith API): https://sunnah.com/developers
- **AhmedBaset/hadith-json** (50k hadith, no license ⚠️): https://github.com/AhmedBaset/hadith-json
- **HadithAPI.com** (Hadith with grades): https://hadithapi.com/
- **fitrahive/dua-dhikr** (authentic dua/dhikr API): https://github.com/fitrahive/dua-dhikr
- **Seen-Arabic/Morning-And-Evening-Adhkar-DB**: https://github.com/Seen-Arabic/Morning-And-Evening-Adhkar-DB
- **wafaaelmaandy/Hisn-Muslim-Json**: https://github.com/wafaaelmaandy/Hisn-Muslim-Json
- **Aladhan** (prayer times, GPL, free): https://aladhan.com/prayer-times-api

**Audio:**
- **everyayah.com** (per-ayah Qur'an audio): https://everyayah.com/
- **QuranicAudio.com** (per-surah Qur'an + Ibrahim Walk EN translation): https://quranicaudio.com/
- **QUL recitations + timestamps**: https://qul.tarteel.ai/
- **Hisnul Muslim audio** (Internet Archive): https://archive.org/details/HisnulMuslimAudio_201510
- **Asma ul Husna – 99 Names audio** (Internet Archive): https://archive.org/details/AsmaUlHusna99NamesofALLAH_201808
- **40 Hadith an-Nawawi audio** (Internet Archive): https://archive.org/details/40Hadith_Nawawi
- Curated indexes: **choubari/Awesome-Muslims**, **AhmedKamal/awesome-Islam**, **khDev01/islamic-data**

---

### TL;DR recommendation

- **Qur'an text/translit + PD translations →** bundle from **Tanzil / risan-quran-json** as lazy
  per-surah JSON (offline core). **Extra/copyrighted translations, tafsir, audio →** live via
  **fawazahmed0 / Quran.Foundation / everyayah** CDNs.
- **Hadith →** **sunnah.com API** (authoritative, with grades) + small **bundled highlights**.
- **Duas/Adhkar/99 Names →** **bundle** processed **Hisnul Muslim** into existing content files —
  do this first.
- **Prayer times →** keep `adhan` on-device; **Aladhan** as fallback.
- **Audio (all types) →** never bundle; **stream from CDN** (everyayah/QuranicAudio for Qur'an +
  translation, Internet Archive for Hisnul Muslim / 99 Names / 40-Nawawi), optional offline download
  later. Transliteration reuses the Arabic recitation — no separate audio needed. Full-corpus Hadith
  audio doesn't exist openly, so scope hadith audio to curated highlights.
- **Don't encrypt scripture;** use SHA-256 integrity hashes instead. Keep AsyncStorage for *user
  data only*; avoid new native deps unless offline Hadith search forces SQLite.

---

## Implementation status (data ingestion)

Implemented per `DATA_INGESTION.md` — all §13 gates green (types, biome, jest+vitest):

- **Qur'an core (bundled, offline):** Arabic (Uthmani) + English transliteration + Pickthall +
  Yusuf Ali + Jalandhry (Urdu), validated at 114 surahs / 6236 ayahs. Assets under
  `apps/app/assets/data/quran/*`, loaded via the generated `src/lib/quran-loader.ts`. Reader with
  per-ayah recitation (everyayah), reciter/translation pickers, bookmarks, last-read, verse search.
- **Extra translations (D2, runtime):** Saheeh International + Clear Qur'an (Khattab) via
  fawazahmed0, cache-first over AsyncStorage (offline after first open).
- **Hadith:** bundled highlights (40 Nawawi, Riyad as-Salihin) offline + full six books via
  fawazahmed0 CDN (cache-first). Reference + grade always shown ("Ungraded" when absent).
- **Content:** complete 99 Names; expanded adhkar/duroods (every item carries a reference). **Duas
  now ship the full Hisnul Muslim corpus (~266 supplications) across 16 situational/source
  categories** — sourced verbatim from the `sheikhhanif/Hisnul_Muslim_Database` CSV (Arabic +
  translation + reference + per-item audio), chapters mapped to categories in `build-adhkar.mjs`.
  Transliteration is optional (only where a clean open source provides it; never auto-generated).
- **Credits screen** renders from `assets/data/manifest.json` (SHA-256 per file) + runtime sources.
- **Build pipeline:** `pnpm --filter app build:data` (dev/CI only) — cached fetch, validation,
  deterministic committed output.

**Deferred (needs a maintainer-supplied binary + prebuild):** the bundled adhan-call MP3 (D11) — see
`apps/app/assets/audio/adhan/README.md`. Content audio (`audioUri`, D9) infrastructure is wired but
play controls stay hidden until real per-item audio URLs are supplied (nothing fabricated).

## Extending translations & reciters (NF-1.12)

- **Reciters** (`apps/app/src/lib/quran-audio.ts` `RECITERS`): per-ayah audio from
  [everyayah.com](https://everyayah.com). Add an entry `{ dir, name }` where `dir` is the reciter's
  everyayah directory. Expanded to include As-Sudais, Ash-Shatri, Ash-Shuraim, and Al-Hudhaify.
- **Translations / tafsir** (`apps/app/src/api/quran-remote.ts` `REMOTE_DEFS`): cache-first, no key,
  from [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api). Add `{ id, fawaz, name,
  language, direction }` where `fawaz` is the edition slug from that API (e.g. another `eng-…`, `urd-…`,
  `ara-…`). Opened editions are cached to AsyncStorage and work offline afterward; a missing/failed
  fetch falls back to the bundled translation, so a bad slug degrades gracefully.
