# Proof log: Timetable OCR (NF-3.12, D3 / D5 / D11)

- **Feature:** photograph or pick a printed masjid timetable (daily board, daily strip or monthly grid), read it **on the device**, parse it with a rule-based parser, review/correct it, and save the iqamah times as the user's private "Your times" for their home masjid (NF-3.11).
- **Code:** parser `packages/shared/src/utils/timetable-parser/` (`@munib-tracker/shared/timetable-parser`, synonym data `header-synonyms.json`); native module `apps/app/modules/munib-text-recognition/` (iOS Vision, Android ML Kit); app glue `apps/app/src/lib/timetable-ocr/` (`recognize.ts` native, `recognize.web.ts` Tesseract.js, `review.ts` grid model, `index.ts` calculated-time plausibility + photo disposal); route `apps/app/src/app/masjids/import.tsx` (`TIMETABLE_IMPORT_ROUTE = "/masjids/import"`, opened from "Your times"); grid `apps/app/src/components/masjid/timetable-review-grid.tsx`; save path `saveImportedTimetable()` in `apps/app/src/lib/masjid/timetable-import.ts`. Copy: `apps/app/scripts/i18n/timetable-ocr-i18n.json` (English only, per owner rule 2026-11-24).
- **Review:** AI proof-backed review (D11), 2026-11-23/24.
- **Religious content:** none. The feature reads times; it renders no Qur'an, hadith or ruling, so there are no scripture refs to verify.

## 1. Privacy model (D3 — on-device only, permanently; D5 — no community data)

| Data                     | Where it goes                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The photo                | Picked with `expo-image-picker` (camera or library; the picker gives the app a cache copy). Read **on the device** only. The app's copy is deleted right after reading (`discardPhoto`) unless the user turns on "Keep the photo while I check"; then it is shown beside the grid and deleted on save, on "Use another photo" and when the screen unmounts. The user's own gallery original is never touched. |
| Recognised text / tokens | In memory on the review screen only. Never stored, never logged, never sent.                                                                                                                                                                                                                                                                                                                                  |
| Reviewed times           | Saved to the private blob `home_masjid_times` (labelled "Your times", `origin: "ocr"`), synced only to the user's own devices through their own account sync. Never sent to the masjids API, never shown to other users. No submission, voting or moderation exists (D5).                                                                                                                                     |
| Calculated times         | Computed on-device (`prayer-times.ts`) for the plausibility checks.                                                                                                                                                                                                                                                                                                                                           |

**Engines (no cloud OCR, no LLM):**

- **iOS:** Apple Vision `VNRecognizeTextRequest`, `.accurate`, `usesLanguageCorrection = false`, languages `en-US` + `ar-SA` filtered by `supportedRecognitionLanguages()` at runtime. Runs on-device.
- **Android:** ML Kit Text Recognition v2, `com.google.mlkit:text-recognition:16.0.1` — the **bundled** Latin model (ships inside the APK; no Play Services model download, no network). ML Kit has no Arabic-script model, so Eastern-Arabic digits may be missed; the review grid covers that. (Coordinate with the backlog item "Android barcode / ML Kit assets — confirm unused" so the bundled models are counted once.)
- **Web:** Tesseract.js 7.0.0 (WASM), loaded with a dynamic `import()` from `recognize.web.ts` only (never in the common chunk). Before the first read the screen states the one-time download (engine ~4.0 MB + English data ~3.0 MB ≈ 6.9 MB; Arabic +1.7 MB, opt-in) from jsDelivr; the browser caches it (IndexedDB). Only the engine/data are downloaded — the photo is read inside the browser.
- **TV / Expo Go / builds without the module:** `ocrAvailability() === "unavailable"`; the screen offers manual entry instead. The module is in `TV_EXCLUDED_PACKAGES`.

**Permissions:** camera only when the user taps "Take a photo" (`requestCameraPermissionsAsync`); denial shows a gentle message + "Open Settings" and the library option. The library picker needs no permission prompt on current iOS/Android. Usage strings (`app.json`) now mention the timetable and that photos stay on the device.

## 2. Parser (rule-based, pure, `packages/shared/src/utils/timetable-parser/`)

Follows plan steps 1–7:

1. **Normalise** — Eastern-Arabic (٠–٩) and Persian/Urdu (۰–۹) digits → ASCII; `٫ . h ;` → `:`; `O/o → 0`, `l/I/| → 1` inside time-shaped tokens; `am/pm/a.m./ص/م` stripped into a meridiem flag.
2. **Time tokens** — `^([01]?\d|2[0-3]):([0-5]\d)$`; split tokens ("5" ":" "12", "5:" "12") joined by box adjacency; lone "PM"/"م" tokens attached to the neighbouring time (either side, for RTL).
3. **Layout** — projection-profile deskew (−10°…10°), rows by y-overlap ≥ 50 %, columns by 1-D gap clustering + k-means refinement; prayer per row (daily boards) vs prayer per column (strips/grids); monthly = ≥ 7 grid rows (full sheets ≥ 20, partial crops allowed) with a day-number column chosen by the longest +1 sequence (beats a Hijri column).
4. **Headers** — multilingual synonym **data file** (`header-synonyms.json`, plan table + common spellings; Arabic "al-" optional; "Fajr-Jamaat" glued forms; two-word labels such as "Friday Prayer"); `other` labels (Date, Hijri, Sehri, Iftar, Zawal …) mark columns to ignore. Qualifiers Begins/Adhan/أذان vs Iqamah/Jamaat/إقامة/جماعت; Khutbah for Jumu'ah lines.
5. **12-hour disambiguation** — Fajr/sunrise AM; Dhuhr 11:00–14:00; Asr/Maghrib/Isha PM (Isha 12:xx/1:xx = after midnight); a search picks the AM/PM assignment that keeps Fajr < sunrise < Dhuhr < Asr < Maghrib < Isha (adhan ≤ iqamah); if none exists, only the out-of-order cells are flagged `orderConflict`.
6. **Plausibility** — with the user's location: adhan within ±20 min of the calculated time; iqamah within [adhan, adhan + 90 min]; out-of-range cells flagged. An unlabelled single column that tracks the calculated adhan (≥ 80 % within 3 min) is re-read as the adhan.
7. **Confidence** — per cell `min(tokenConf, layoutConf)`; < 0.8 or any flag ⇒ `needsReview`. Assumed kinds (single unlabelled time ⇒ iqamah) are always flagged `kindAssumed`.

**Only iqamah times are saved** (adhan times are always calculated on-device). Jumu'ah slots (iqamah, or khutbah when that is all the sheet gives) are saved too. A monthly import adds/replaces only its own dates; other months, daily times and existing Jumu'ah stay unless the sheet provides them (`mergeImportedTimes`).

## 3. Parser accuracy on fixtures

`packages/shared/src/utils/timetable-parser/__tests__/` — **40 fixture token dumps** (synthetic, modelled on real anonymised layouts; no masjid names): 21 daily boards (12h/24h, summer 12h without AM/PM, AM/PM glued and separate, Arabic + Eastern digits RTL, Urdu + Urdu digits, `٫` separator, French `06h05` with Sobh/Chorouk/Dohr/Icha, Jamaat-only + Jumu'ah footnote, no header, split tokens, dot separators, inline qualifiers, OCR noise O/l/bars, rotated 4° and −6° with jitter, Jamaat column first, Vision phrases, khutbah + salah line, Isha iqamah after midnight), 4 daily strips (Begins/Jamaat rows, single Iqamah row, Jumu'ah column, sub-headers) and 15 monthly grids (Nov 12h, June 24h, June 12h no AM/PM, iqamah-only, Hijri column, Arabic RTL, Urdu digits, February, rotated 2.5°, split tokens, partial crop days 10–24, low confidence + dropped tokens, Ramadan Sehri/Iftar columns, AM/PM Vision phrases, with calculated times).

| Measure                                       | Result (2026-11-24)                                                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Cells correct **before review**, all fixtures | **4,616 / 4,620 = 99.91 %** (target ≥ 95 %)                                                                                                  |
| Fixtures with every cell correct              | 39 / 40                                                                                                                                      |
| Misses                                        | 4 cells in the "dropped tokens" fixture — the tokens were deliberately deleted; those cells come back empty and flagged `missing` for review |
| Layout detection (daily / monthly / none)     | 40 / 40 + the non-timetable control returns `none`                                                                                           |

**Caveat:** the fixtures are synthetic token dumps. Real photos add blur, curved paper, merged/broken boxes and engine-specific mistakes; accuracy on real photos must be measured on devices (see §5). The review grid is mandatory — nothing is saved without the user pressing "Save as Your times".

## 4. Tests

- Shared (Vitest): `timetable-parser.test.ts` — normalisation, synonyms, every fixture, the ≥ 95 % aggregate, flags (low confidence, far from calculated, iqamah window, order conflict, kind assumed), month hint/day column/skew, `timetableToPrivateTimes`.
- App (Jest): `src/lib/timetable-ocr/timetable-ocr.test.ts` — availability per platform (web/TV/missing module ⇒ unavailable; native module output normalised), web download size, calculated times, review model (iqamah-only draft, overrides survive re-parse, invalid text blocks save, flagged rows first); `src/lib/masjid/masjid-layer.test.ts` — route slot, monthly merge, private OCR save.

## 5. Needs device verification

- OCR quality on real photos (iPhone Vision `.accurate`; Android ML Kit Latin; web Tesseract) — especially monthly grids, Arabic/Urdu sheets (ML Kit misses Eastern digits), glare and curved paper.
- `ar-SA` availability in `supportedRecognitionLanguages()` per iOS version.
- Camera permission prompt + denial flow (iOS/Android), image-picker crop UI, photo deletion of the cache copy.
- Web: first-use download from jsDelivr, IndexedDB caching, behaviour behind strict CSP/offline.
- Prebuild/autolinking of the new local module on both platforms (ML Kit `16.0.1` + `minSdk`), and that TV builds exclude it.
