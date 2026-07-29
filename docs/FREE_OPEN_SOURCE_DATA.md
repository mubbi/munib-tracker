# Free & Open-Source Islamic Data — Sources & licenses

Reference for authentic Qur'an, Hadith, Duas, Adhkar, translations, and audio from free / open-source datasets accepted by the majority of the Muslim ummah.

Pipeline ops: [`DATA_INGESTION.md`](./DATA_INGESTION.md). Open gaps: [`BACKLOG.md`](./BACKLOG.md#content-pipeline) · data-blocked features in [`BACKLOG.md`](./BACKLOG.md).

Verify licenses again before shipping — terms change.

---

## 1. Guiding principles

1. **Authenticity first (ummah-accepted).**
   - Qur'an: use the **Ḥafṣ ʿan ʿĀṣim** reading in **Uthmani (Madīnah Mushaf) script** — the reading used by the overwhelming majority of Muslims worldwide and published by the **King Fahd Complex** for the Printing of the Holy Qur'an. **Tanzil.net** distributes exactly this, verified character-by-character.
   - Hadith: use the **Kutub al-Sittah** (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah) plus Malik's Muwatta / Ahmad, **and always carry the grade** (ṣaḥīḥ/ḥasan/ḍaʿīf) and the collection reference. Never present ḍaʿīf/mawḍūʿ material without its grade.
   - Duas/Adhkar: **Hisnul Muslim** by Sheikh **Saʿīd bin ʿAlī bin Wahf al-Qaḥṭānī** — a globally trusted, referenced compilation (every dua cites its Qur'an/Hadith source).
   - This app's content model (Witr, Tahajjud, Sunnah prayers, Hisnul Muslim adhkar) is **mainstream Sunni**, which is what "majority of the ummah" points to here. Keep translations sectarian-neutral; avoid polemical editions.

2. **License-clean.** Prefer **public domain / CC0 / CC-BY / CC-BY-SA / MIT / Unlicense**. Some *translations* are still **copyrighted** even when a website serves them for free (see §10). Track license per resource.

3. **Offline-first & durable.** The core mushaf and core adhkar must work with **zero network**. APIs are for *enrichment* (extra translations, audio streaming, tafsir), never for the critical path.

4. **No unnecessary native deps.** Ship data as **bundled JSON** and read it lazily; use **remote CDNs** for large/optional extras. Only consider `expo-sqlite` if full-offline Hadith search becomes a hard requirement (§5.4).

5. **Attribution built-in.** Add a "Data sources & credits" screen; store attribution text with each dataset (Tanzil requires a visible link back; CC-BY requires credit).

---

## 2. Qur'an — Arabic text

### 2.1 Recommended primary source

| Source | Contents | Script / reading | License | Verdict |
|---|---|---|---|---|
| **Tanzil.net** (`tanzil.net/download`) | Full Qur'an text, multiple types | **Uthmani** & **Simple** (Ḥafṣ) | **CC BY 3.0** — verbatim only, must credit + link to tanzil.net | ✅ **Primary. Gold standard for Arabic text.** |
| **Quranic Universal Library (QUL)** — `qul.tarteel.ai` (by Tarteel AI) | Uthmani + tajweed + IndoPak scripts, word-by-word, mushaf-layout/page data, 200+ translations, 115 tafsirs, 9 transliterations, recitations w/ timestamps | Multiple | Open-sourced; **per-resource licenses** — check each | ✅ **Primary hub for everything beyond bare text** (layout, word-by-word, bulk translations). |
| **risan/quran-json** (GitHub + jsDelivr CDN) | Uthmani text + transliteration + several translations, pre-chunked per-surah / per-ayah JSON | Uthmani | **CC BY-SA 4.0** | ✅ **Fastest bootstrap** — ready-made JSON, no processing. Arabic from *Noble Qur'an Encyclopedia*, translit/translations from Tanzil. |
| **fawazahmed0/quran-api** | 90+ languages, 400+ editions, served free via jsDelivr CDN | Multiple | **Unlicense (public domain)** for the project | ✅ Great **CDN fallback / extra-translation** source, no key, no rate limit. |
| **Al Quran Cloud** — `alquran.cloud/api` (Islamic Network) | 114 surahs / 6236 ayahs, dozens of translations/tafsir/audio editions | Uthmani (Tanzil-derived) | API code GPL-3.0; text from Tanzil | ✅ Good **live API** option, no auth. |
| **Quran.Foundation API** (quran.com) — `api-docs.quran.foundation` | Official quran.com content API v4: verses, translations (Saheeh Intl, Khattab…), recitations | Multiple | Free; **requires client registration** (id/secret) | ◻︎ Use if you want the *canonical quran.com* editions & word-by-word with an official API. |

**Recommendation:** Bootstrap the mushaf from **risan/quran-json** (ready JSON) *or* pull raw text from **Tanzil** via `build-data`. Treat **QUL** as the enrichment warehouse for word-by-word and mushaf page layout.

### 2.2 Verse metadata to include

Surah number/name (Arabic + English + transliteration), ayah number (in-surah and global 1–6236),
juz', hizb, rukū', **page (Madīnah Mushaf)**, sajda flag, revelation place (Makki/Madani). Tanzil
& QUL provide all of this.

---

## 3. Qur'an — Translations (by accepted scholars)

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

## 4. Qur'an — Transliteration

| Source | Coverage | License |
|---|---|---|
| **Tanzil transliteration** (English, ayah-by-ayah) | Full Qur'an | CC BY 3.0 (credit Tanzil) ✅ |
| **QUL transliterations** (9 ayah-level + 1 word-by-word) | Full Qur'an | Per-resource ✅ |
| **risan/quran-json** (bundles Tanzil translit) | Full Qur'an | CC BY-SA 4.0 ✅ |

**Recommendation:** use the **Tanzil / risan** ayah-level transliteration for the reader; use **QUL
word-by-word** transliteration if/when you add a word-by-word study view. This matches the app's
existing `transliteration` field convention.

---

## 5. Delivery strategy

Given **AsyncStorage / no-new-native-deps**:

### 5.1 Decision matrix

| Content | Size | Query needs | **Recommended delivery** | Why |
|---|---|---|---|---|
| **Adhkar / Duas / Duroods / 99 Names** | Small (KB) | Browse by category | **Bundled static content** (extend existing `packages/shared/src/content/*.ts` or JSON in `assets/`) | Matches current pattern; instant, offline, trivially versioned. |
| **Qur'an Arabic + 1–2 PD translations + transliteration** | ~2–6 MB/edition | Read sequentially by surah/page; jump to ayah | **Bundled JSON**, per-surah loaders in `quran-loader.ts`. Home/search light paths use **`quran-meta`** only; ayah JSON must not enter the web `__common` chunk — see [`PROFILING.md`](./PROFILING.md). | Fully offline core mushaf. Load one surah at a time. |
| Extra translations (Saheeh Intl, Khattab, others), tafsir | Large / many | On demand | **Live CDN/API** (fawazahmed0 jsDelivr for translations + Siraj; **spa5k/tafsir_api** for multi-language ayah tafsir; Al Quran Cloud / Quran.Foundation as alternatives) + cache with React Query / AsyncStorage | Keeps app small & license-clean; only fetched when the user selects that edition. Check **per-resource licenses** for spa5k/QUL tafsirs. |
| **Qur'an audio (per-ayah / per-surah)** | Very large | Stream | **Third-party CDN, streamed** (everyayah.com / QuranicAudio / QUL) | Never bundle audio; stream + optional download-for-offline later. |
| **Hadith (50k+)** | Large (tens of MB) | Search + browse by book/chapter | **Hybrid:** bundle **Nawawi40** eagerly; **Riyad** via web `import()` / `ensureBundledCollection` (never `require` — Metro embeds it); full collections via CDN API | Full offline Hadith with search really wants SQLite; avoid that unless required (§6.4). Web graph notes: [`PROFILING.md`](./PROFILING.md). |

### 5.2 Bundled JSON pattern (recommended for Qur'an core)

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

### 5.3 What to store in AsyncStorage (user data, not content)

Add a `quran` slice: `lastRead {surah, ayah}`, `bookmarks[]`, `khatmah/reading-plan progress`,
`preferredTranslationId`, `preferredReciterId`. Follow the existing repository pattern
(`apps/app/src/db/repositories/`), new key under `DB_KEYS`, bump a `QURAN_CONTENT_VERSION`.

### 5.4 If full offline Hadith search becomes a hard requirement

Then—and only then—introduce **`expo-sqlite`** (bundled prebuilt `.db`), and ship the Hadith corpus
as a seeded SQLite database. **This breaks the "no new native deps" rule**, so treat it as an
explicit, approved exception. See [[no-new-native-deps]]. Until then, prefer **API-backed Hadith +
bundled highlights**.

### 5.5 On "encrypted built-in data"

You mentioned possibly encrypting built-in data. **Recommendation: don't encrypt the Qur'an/Hadith
text.** It's public/openly-licensed — there's no IP reason to hide it, obfuscation only adds bundle
size, CPU cost, and startup latency, and it's discouraged to obscure scripture. **Do** add a
**SHA-256 integrity hash** per data file (checked at seed time) so corrupted/tampered content is
detected. Reserve encryption only for a *copyrighted* translation whose license explicitly forbids
plain redistribution (rare — usually you'd just fetch those via API instead).

---

## 6. Hadith

| Source | Contents | Grades? | License | Verdict |
|---|---|---|---|---|
| **sunnah.com API** (`sunnah.com/developers`, official) | Kutub al-Sittah + more, Arabic + English | Yes | **API key required** (request via their GitHub); data terms not fully open — respect their ToS | ✅ **Canonical & authoritative.** Best for a live, correct source. Ask for offline dump if needed. |
| **AhmedBaset/hadith-json** (GitHub) | **50,884** hadith, **17 books** (9 books + Riyad as-Salihin, Shamail, 40-hadith sets), Arabic + English | Limited (no full grade field) | **No explicit license** — scraped from sunnah.com ⚠️ | ◻︎ Convenient for prototyping; **legally gray**, confirm before shipping. Lacks grades. |
| **mhashim6/Open-Hadith-Data** | 9 books incl. Six + Arabic diacritics | Partial | Open | ◻︎ Good Arabic corpus. |
| **HadithAPI.com** | Bukhari, Muslim etc. with `status` (Sahih/Hasan/Daif) | Yes ✅ | Free w/ key | ✅ Handy API that **carries grades** — good for the grade requirement. |
| **QUL / Tarteel** | Hadith resources alongside Qur'an | Varies | Per-resource | ◻︎ Check availability. |
| **fawazahmed0/hadith-api** (jsDelivr CDN) | Kutub al-Sittah + more; **multi-language editions** (`urd-*`, `ind-*`, `tur-*`, `ben-*`, `fra-*`, `rus-*`, …) | Varies | **Unlicense** | ✅ **Shipped** for remote hadith translation in app locales `ur`, `id`, `tr`, `bn`, `fr`, `ru` — see `packages/shared/src/i18n/hadith-editions.ts` and `apps/app/src/api/hadith-remote.ts`. Arabic uses bundled `arabic` field; others cache per `collection:translationLocale`. |
| **osamayy/40-hadith-nawawi-db** | Nawawi 40 Arabic sharh / explanation | n/a | **Unlicense** | ✅ **Shipped (NF-2.8)** — `nawawi40-sharh.json` sidecar; Arabic only (no AI English paraphrase). |
| **emadjumaah/hadith-kg** (Hugging Face) | Structured isnad graphs (~1.6 GB SQLite) | Yes | **CC-BY-4.0** | ◻︎ Optional enricher via `HADITH_KG_PATH` + `extract-hadith-isnad.mjs`. Default NF-2.9 extract is companion→Prophet from AhmedBaset openings (not the full KG). |

**Recommendation:**
- **Authoritative path:** integrate the **official sunnah.com API** (request a key). Present
  collection → book → chapter → hadith, always showing **reference + grade**.
- **Offline highlights:** bundle small, universally-accepted curated sets as JSON —
  **40 Hadith an-Nawawi**, **Riyad as-Salihin** (or a "Hadith of the day" pool) — these are compact
  and safe.
- Store the **grade** and **collection reference** on every hadith. Extend a `HadithItem` type
  mirroring the app's content convention: `{ id, collection, book, chapterId, number, arabic,
  english, narrator, isnad?, sharhArabic?, grade, gradedBy, reference }`.
- Prefer sources that **include grades** (sunnah.com / HadithAPI); avoid presenting ungraded scraped
  data as authoritative.
- **Sharh (NF-2.8):** Nawawi Arabic commentary from osamayy — never AI-translate.
- **Isnad (NF-2.9):** structured `isnad[]` on bundled highlights (`isnad-highlights.json`); chains
  end with the Prophet ﷺ. Remote Kutub collections do not yet carry isnad.

---

## 7. Duas & Adhkar (Hisnul Muslim)

| Source | Contents | License | Verdict |
|---|---|---|---|
| **fitrahive/dua-dhikr** (GitHub) | "Authentic Sunnah Dua & Dhikr" REST API, categorized, Arabic + translit + translation + source | Open | ✅ Clean structure that maps directly to your `DuaItem`/`ZikrItem`. |
| **Seen-Arabic/Morning-And-Evening-Adhkar-DB** | Morning/evening adhkar, Arabic + English, **JSON/CSV/SQL/SQLite** | Open | ✅ Great for the morning/evening categories you already have. |
| **wafaaelmaandy/Hisn-Muslim-Json** | Full Hisnul Muslim, Arabic + English JSON | Open | ✅ Full Fortress-of-the-Muslim corpus. |
| **ThelightHub/dua-api** | Hisnul Muslim book 1, Arabic + Bengali segments (~133 chapters) | Open API | ✅ **Shipped** in `build-adhkar.mjs` for `bn` (~158/270 duas matched by Arabic prefix). |
| **fitrahive/dua-dhikr** | Subset of duas, Indonesian | Open | ✅ Partial `id` translations in adhkar pipeline. |
| **BetimShala/mburoja-api** | Hisnul Muslim chapters + invocations API | Open | ◻︎ Alternative API form. |
| **ahegazy/muslimKit azkar JSON** | Azkar with `zekr`, `repeat`, `bless`(source) | Open | ✅ Includes repeat-count → maps to your `targetCount`. |

**Status:** **Shipped** — full Hisnul Muslim corpus (**270** duas + expanded adhkar/duroods) lives in
`packages/shared/src/content/` via `build-adhkar.mjs`. Locale meaning coverage varies (e.g. Bengali
~158/270 by Arabic prefix match); English/Arabic corpus is complete — do not re-bundle it.

---

## 8. Names of Allah

- Standard **Asma-ul-Husna** list (99) is available in essentially every dataset above
  (fawazahmed0, QUL, muslimKit, awesome-Islam collections) and is uncontroversial.
- **Shipped** — all 99 in `packages/shared/src/content/names.ts` via `build-names.mjs` (existing
  shape: `id, arabic, transliteration, translation`; optional `meaning`/`benefit` enrichments only).
  Bump `NAMES_CONTENT_VERSION` when regenerating.

---

## 9. Audio — for every content type

Your content types (`ZikrItem`, `DuaItem`, `DurudItem`, `NameOfAllah`) already carry an `audioUri?`
field, and `UserPreferences` has `audioSpeed` — so audio is a first-class feature. **Golden rule:
never bundle audio in the app binary** (it's hundreds of MB). Stream from a CDN via
`expo-av`/`expo-audio`, with an optional "download for offline" per item/surah later. Cache the
resolved URLs; store only the user's chosen reciter/qari in AsyncStorage.

### 9.1 Qur'an recitation (Arabic)

| Source | Granularity | Reciters | License | Use |
|---|---|---|---|---|
| **everyayah.com** | **Per-ayah** MP3 (predictable URL pattern per reciter) | 40+ (Alafasy, Sudais, Husary, Abdul Basit, Minshawi…) | Free / Internet Archive mirrors | ✅ **Best for a reader** — highlight the current ayah as it plays. |
| **QuranicAudio.com** | **Per-surah** MP3 | Many | Free downloads | ✅ Good for full-surah playback. |
| **QUL (Tarteel)** | Per-ayah/surah **+ segment timestamps** | 71 unsegmented / 57 segmented | Per-resource | ✅ Use its **timing data** for word-by-word/ayah highlighting. |
| **Al Quran Cloud / Quran.Foundation** | Per-ayah via API (audio editions) | Several | Free | ◻︎ API-driven alternative. |

### 9.1a Learn Qur'an teaching audio

| Need | Source | How Munib uses it |
|---|---|---|
| Full ayah (daily, evidence, practice) | everyayah.com (already wired) | Play buttons on daily lessons, `JannahQuranEvidence`, memorization, learn-to-read levels |
| Example phrases (tajweed / letter examples) | everyayah + QuranCDN word timings | `packages/shared/src/content/quran-guide-audio.ts` maps Arabic examples → surah/ayah + optional `clipStart`/`clipEnd` |
| Qur'anic vocabulary headwords | everyayah + QuranCDN word timings | `QURAN_GUIDE_VOCAB_AUDIO` — one timed word clip per vocab id (not full ayah) |
| Isolated letters | **Abjad-Kids** (MIT) on Hugging Face | Stream one curated WAV per letter id; document Telkom Hijaiyah (**CC0**) as preferred if a CDN mirror is hosted |

Do **not** use CC-BY-NC corpora (e.g. Tadabur) or neural TTS as gold tajweed audio. Word-timed cuts + full-ayah fallback cover teaching demos without a commissioned phrase pack; commission only if product QA rejects clip quality.



| Source | Content | Granularity | Note |
|---|---|---|---|
| **QuranicAudio.com** | **Saheeh International (English)** recited by **Ibrahim Walk** — paired with Abdul Basit or Alafasy Arabic | Per-surah (Arabic ayah → English) | ✅ The standard free English audio-translation. |
| **Internet Archive** | Ibrahim Walk **English-only** & Arabic+English combined editions | Per-surah | ✅ Mirror/backup. Saheeh Intl text is copyrighted-but-freely-distributed → credit + verbatim. |
| Urdu audio translations | Available on QuranicAudio / Archive (various qaris) | Per-surah | ◻︎ Add per audience. |

### 9.3 Transliteration audio — **no separate dataset needed**

The transliteration is just the Latin rendering of the **same Arabic sound**, so the **Qur'an
recitation in §10.1 *is* the transliteration's audio.** Reuse the same reciter URL; no extra source
required. (Same applies to adhkar/dua/names transliteration → reuse their Arabic audio.)

### 9.4 Duas & Adhkar audio (Hisnul Muslim)

| Source | Content | Format | License |
|---|---|---|---|
| **Greentech / GTAF Hisnul Muslim audio** (Internet Archive) | Full Fortress-of-the-Muslim, per-dua Arabic | MP3 | Free (attribution) ✅ |
| **sheikhhanif/Hisnul_Muslim_Database** (jsDelivr CDN) | Same corpus, per-dua `Nhm.mp3` streams | MP3 | Free (attribution) ✅ |
| **khDev01/islamic-data** → "Fortress of the Muslim With Audio" | Adhkar + audio | CSV + MP3 | Open ✅ |
| **Seen-Arabic/Morning-And-Evening-Adhkar-DB** | Morning/evening adhkar | JSON/SQLite (audio refs) | Open ✅ |

→ Map each dua/zikr's `audioUri` to the matching Hisnul Muslim track. This directly fills the
`audioUri?` fields you already have in `ZikrItem`/`DuaItem`.

### 9.4a Step-by-step salah / Words of salah

Learn Salah → **how-to-pray** and **phrases** reuse the same authentic Arabic streams (no TTS):

| Phrase | Source clip |
|---|---|
| Opening takbir | Bundled Adhan_wiki segment `06-allahu-akbar-x2.mp3` (CC BY-SA 3.0) |
| Istiftah, ruku, rising, sujud, jalsah, tashahhud, salawat, four-trial dua | Hisnul Muslim CDN (`28`, `33`, `38`–`39`, `41`, `48`, `52`–`53`, `55` hm) |
| Ta'awwudh | Hisnul `193hm` + everyayah Fatiha 1:1 for Basmalah |
| Al-Fatihah | everyayah.com (user-preferred reciter) |
| Closing taslim | **Gap** — no clean matching single-phrase OSS clip; UI omits play for that row |

Implementation: `apps/app/src/lib/salah-how-to-pray-audio.ts`.

### 9.5 99 Names of Allah audio

| Source | Content | Note |
|---|---|---|
| **Internet Archive "Asma ul Husna – 99 Names"** collections | Per-name pronunciation MP3 (and the well-known recited nasheed) | ✅ Free. Prefer a **clear per-name pronunciation** set (for learning) over the melodic nasheed (single track). |

→ Fills `NameOfAllah.audioUri`. Use a per-name pronunciation clip so tapping a name plays just that name.

### 9.6 Hadith audio (optional)

| Source | Content | Note |
|---|---|---|
| **Internet Archive – 40 Hadith an-Nawawi audiobooks** | Per-hadith Arabic (+ some English) MP3 | ✅ Great for your bundled Nawawi highlights. |
| Riyad as-Salihin / others | Scattered audiobooks on Archive | ◻︎ Coverage is patchy; full six-books per-hadith audio is **not** reliably available open-source. |

→ Realistic scope: attach audio to the **curated highlight sets** (40 Nawawi), not the entire 50k
corpus. Don't promise per-hadith audio for the full Kutub al-Sittah — it doesn't exist openly.

### 9.7 Prayer times & Qibla (calculated, not audio data)

- **Prayer times:** keep the on-device **`adhan`** library (already installed) — offline, all major
  methods (MWL, ISNA, Umm al-Qura, Karachi, Egypt…). Fallback: **Aladhan API** (GPL-3.0, free, no key).
- **Adhan (call to prayer) audio:** stream a standard adhan MP3 (Makkah/Madinah muezzin) from
  Internet Archive for prayer-time notifications — a single small file, one per style.
- **Qibla:** keep `expo-location` compass calc.

### 9.8 Audio coverage summary

| Content | Open audio? | Best source | Granularity |
|---|---|---|---|
| Qur'an (Arabic) | ✅ Excellent | everyayah / QuranicAudio / QUL | Per-ayah |
| Qur'an translation | ✅ Good (EN) | QuranicAudio (Ibrahim Walk) | Per-surah |
| Transliteration | ✅ Reuse Arabic audio | (same as recitation) | Per-ayah |
| Learn Qur'an letters | ✅ Good (MIT stream) | Abjad-Kids (HF); Telkom Hijaiyah CC0 preferred when mirrored | Per letter |
| Learn Qur'an examples | ✅ Mapped | everyayah ayah (+ optional QuranCDN word clips) | Phrase / ayah |
| Step-by-step salah phrases | ✅ Good | Hisnul Muslim CDN + everyayah (Fatiha) + Adhan_wiki takbir | Per step |
| Duas / Adhkar | ✅ Good | Hisnul Muslim audio (Archive/GTAF) | Per-dua |
| 99 Names | ✅ Good | Archive Asma ul Husna | Per-name |
| Hadith | ⚠️ Partial | Archive 40-Nawawi audiobooks | Highlights only |
| Adhan call | ✅ Yes | Archive muezzin MP3 | Per-style |

---

## 10. Licensing & attribution checklist (do before shipping)

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

## 11. Quick-reference source list

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
- **Duas/Adhkar/99 Names →** **bundle** processed **Hisnul Muslim** (already shipping; extend via OSS only).
- **Prayer times →** keep `adhan` on-device; **Aladhan** as fallback.
- **Audio (all types) →** never bundle; **stream from CDN** (everyayah/QuranicAudio for Qur'an +
  translation, Internet Archive for Hisnul Muslim / 99 Names / 40-Nawawi), optional offline download
  later. Transliteration reuses the Arabic recitation — no separate audio needed. Full-corpus Hadith
  audio doesn't exist openly, so scope hadith audio to curated highlights.
- **Don't encrypt scripture;** use SHA-256 integrity hashes instead. Keep AsyncStorage for *user
  data only*; avoid new native deps unless offline Hadith search forces SQLite.

---

## 12. Current shipped state


- **Qur'an core (bundled, offline):** Arabic (Uthmani) + English transliteration + Pickthall +
  Yusuf Ali + Jalandhry (Urdu), validated at 114 surahs / 6236 ayahs. Assets under
  `apps/app/assets/data/quran/*`, loaded via the generated `src/lib/quran-loader.ts`. Reader with
  per-ayah recitation (everyayah), reciter/translation pickers, bookmarks, last-read, verse search.
- **Extra translations (D2, runtime):** Saheeh International + Clear Qur'an (Khattab) via
  fawazahmed0, cache-first over AsyncStorage (offline after first open).
- **Hadith:** bundled highlights (40 Nawawi, Riyad as-Salihin) offline + full six books via
  fawazahmed0 CDN (cache-first). Reference + grade always shown ("Ungraded" when absent).
- **Content:** complete 99 Names; expanded adhkar/duroods (every item carries a reference). **Duas:** full Hisnul Muslim corpus (**270**) across 16 categories — sourced from `sheikhhanif/Hisnul_Muslim_Database` CSV via `build-adhkar.mjs`. Transliteration only where a clean OSS source provides it (never auto-generated). Bengali meaning coverage ~158/270 (prefix match).
- **Credits screen** renders from `assets/data/manifest.json` (SHA-256 per file) + runtime sources +
  service credits (prayer times, weather).
- **Build pipeline:** `pnpm --filter app build:data` (dev/CI only) — cached fetch, validation,
  deterministic committed output.
- **Adhan call audio (D11):** bundled baseline `adhan.mp3` + remote CDN styles (`Kiwifu/adhan-mp3` via jsDelivr) in `lib/adhan-audio.ts`. Learn phrases: seven CC BY-SA clips from Wikimedia `Adhan_wiki` under `assets/audio/adhan/phrases/` (+ Medina follow-along cues). Open work: expand the full local MP3 set under `assets/audio/adhan/`.

**Still open:** fuller local adhan-call set (D11 expand) — see
`apps/app/assets/audio/adhan/README.md`. Content audio (`audioUri`, D9) infrastructure is wired but
play controls stay hidden until real per-item audio URLs are supplied (nothing fabricated).

## 13. Extending translations & reciters

- **Reciters** (`apps/app/src/lib/quran-audio.ts` `RECITERS`): per-ayah audio from
  [everyayah.com](https://everyayah.com). Add an entry `{ dir, name }` where `dir` is the reciter's
  everyayah directory. Expanded to include As-Sudais, Ash-Shatri, Ash-Shuraim, and Al-Hudhaify.
- **Translations** (`apps/app/src/api/quran-remote.ts` + `packages/shared` edition defs): cache-first, no key,
  from [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api). Add `{ id, fawaz, name,
  language, direction }` where `fawaz` is the edition slug from that API (e.g. another `eng-…`, `urd-…`,
  `ara-…`). Opened editions are cached to AsyncStorage and work offline afterward; a missing/failed
  fetch falls back to the bundled translation, so a bad slug degrades gracefully.
- **Tafsir** (`apps/app/src/api/quran-tafsir.ts` + `packages/shared/src/i18n/quran-tafsir-defs.json`):
  on-demand from [spa5k/tafsir_api](https://github.com/spa5k/tafsir_api) (multi-language) plus fawaz
  Siraj; cache keys prefixed `tafsir:`. Language → author picker and per-ayah sheet in the reader.
  Check per-resource licenses (many editions originate from QUL / quran.com).
