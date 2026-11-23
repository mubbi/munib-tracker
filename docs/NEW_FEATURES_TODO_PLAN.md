# New features — TODO plan (NF-3.x)

Status: **planned, not started** · Created 2026-11-19 · Updated 2026-11-23 (NF-3.21–3.24, NF-3.0b settings control panel, decisions D11–D28 locked) · Owner: product
Shipped catalog: [`FEATURES.md`](./FEATURES.md) · Open work: [`BACKLOG.md`](./BACKLOG.md)

This plan covers 24 features plus the shared foundations they need. Each feature section gives:
goal, Islamic basis, scope, data model, storage/sync, core logic and conditions, UI/routes,
notifications, data sources, tests, acceptance criteria and open risks.

When a feature ships, move its row into `FEATURES.md` (same NF id) and delete its section here.

---

## Contents

1. [Locked decisions](#1-locked-decisions)
2. [Non-negotiable rules (all features)](#2-non-negotiable-rules-all-features)
3. [Phasing & sequencing](#3-phasing--sequencing)
4. [Foundations (NF-3.0)](#4-foundations-nf-30) — incl. **NF-3.0a "My madhhab" setting + retrofit** and **NF-3.0b Settings control panel** (§4.5)
5. [Phase 1 — Daily practice](#5-phase-1--daily-practice)
   - NF-3.1 Sunnah Rawatib · NF-3.2 Voluntary fasting · NF-3.3 Dhul-Hijjah mode · NF-3.5 Daily Sunnah habits · NF-3.19 Tasbeeh counter designs
6. [Phase 2 — Private self-accountability](#6-phase-2--private-self-accountability)
   - NF-3.6 Muhasabah · NF-3.7 Silat al-rahim · NF-3.8 Debts record · NF-3.9 Wasiyyah · NF-3.14 Weekly gentle coach
7. [Phase 3 — Fiqh tools, Qur'an & hadith](#7-phase-3--fiqh-tools-quran--hadith)
   - NF-3.10 Mirath · NF-3.15 Tajweed coaching · NF-3.20 Hands-free tasbeeh (voice) · NF-3.4 Umrah mode · NF-3.21 Ayah notes & annotations · NF-3.22 Arabic root-word search · NF-3.23 Hadith audio · NF-3.24 Qur'an pronunciation assessment
8. [Phase 4 — Device & place](#8-phase-4--device--place)
   - NF-3.13 Salah focus lock · NF-3.11 Masjid finder · NF-3.12 Timetable OCR
9. [Phase 5 — Social (circles)](#9-phase-5--social-circles)
   - NF-3.16 Family & kids · NF-3.17 Accountability partner · NF-3.18 Group khatm
10. [Cross-cutting checklist (per feature)](#10-cross-cutting-checklist-per-feature)
11. [Notification budget](#11-notification-budget)
12. [Evidence register](#12-evidence-register)
13. [Open items (all decisions locked)](#13-open-items-all-decisions-locked)

---

## 1. Locked decisions

Decided with the product owner on 2026-11-19. Don't change any of these without updating this table.

| #   | Topic                            | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Social backend                   | Build a **`circles` module in `apps/api`** (Postgres + TypeORM migrations, Drizzle mirror in `packages/db`). Family, partner and group khatm ship in the **final phase**, after the single-user features.                                                                                                                                                                                                                                                                                          |
| D2  | Sensitive data                   | Muhasabah, wasiyyah and the debts record are **stored on the device by default**. Cloud sync is **opt-in and end-to-end encrypted**: the server stores ciphertext only. Silat al-rahim relatives (third-party names and phone numbers) also go in the vault (extension of D2, see §4.2).                                                                                                                                                                                                           |
| D3  | AI approach                      | **On-device only, permanently.** The weekly coach is a deterministic rules engine with i18n templates. Timetable OCR uses on-device text recognition plus a rule-based parser. Hands-free tasbeeh (NF-3.20) and Qur'an pronunciation assessment (NF-3.24) run the pinned FastConformer ONNX model on the device; they never use OS or cloud speech recognition, and audio never leaves the device. No cloud LLM calls, no server-side inference, ever, for these features.                         |
| D4  | Focus lock                       | **Hard block from v1.** iOS uses FamilyControls / ManagedSettings / DeviceActivity, which needs Apple's distribution entitlement. Android uses UsageStats, an overlay and a foreground service, which needs Play policy declarations. Start both approval processes in Phase 0 because of the lead time.                                                                                                                                                                                           |
| D5  | Masjid data                      | **Publicly available data only.** Locations, details and any times come from **OpenStreetMap (Overpass)**, through a read-only proxy and cache in `apps/api`. Other public timetable sources are added only after a licence review. **No user submissions, no voting, no admin moderation, no masjid-admin claims.** When a field has no public data, it **isn't shown**. Users may keep **private** iqamah times for their own home masjid (manual or on-device OCR), and these are never shared. |
| D6  | Mirath scope                     | **All four schools in v1**, one engine with per-school parameters for the disputed cases. Release is **gated on scholar sign-off** of the fixture suite.                                                                                                                                                                                                                                                                                                                                           |
| D7  | Kids                             | **Parent-managed child profile**: no email, nickname and birth year only, child device linked by QR. Kids mode applies below 13. The parent sees **fard salah status only**.                                                                                                                                                                                                                                                                                                                       |
| D8  | Rawatib default                  | **Follows the global madhhab and can be edited.** Hanafi → 12; Shafi'i / Hanbali / Maliki → 10 mu'akkadah. The user can switch between 10 and 12 and enable optional ghayr mu'akkadah extras.                                                                                                                                                                                                                                                                                                      |
| D9  | Global madhhab (NF-3.0a)         | One **"My madhhab"** setting (Hanafi / Shafi'i / Maliki / Hanbali / **Show all views**) that every guide and calculator reads, **including retrofitting shipped features**: Witr, hayd/istihada/nifas, qasr/jam', zakat nisab, Fajr/Isha preferred times, fidyah, Eid/Jumu'ah, janazah, tawaf (§4.1.4). Differences are labelled, never hidden. It is independent of the Asr `MadhabKey`, but picking a school offers to match the two.                                                            |
| D10 | Tasbeeh design default (NF-3.19) | The **current circular donut (Ring) with the count inside stays the default** for every user, and is used when no design has been chosen. Sliding beads and the other designs are opt-in from the counter's style sheet or from Settings.                                                                                                                                                                                                                                                          |

Decided with the product owner on 2026-11-23:

| #   | Topic                           | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D11 | Religious-content review        | **AI review with proofs and references replaces a named scholar panel.** Every ruling, copy line, fixture and evidence ref gets a **proof-log entry** (`docs/proofs/<feature>.md`) recording: the claim; its primary sources (Qur'an/hadith refs checked against the bundled corpus by `content-verification.ts`, or classical works cited by title, edition and page); the grading where relevant; the views of each school where they differ; and the review date. A claim without a verifiable source is **removed or shown as "scholars differ"**, never asserted. **Wherever this plan says "scholar sign-off", "scholar panel", "scholar to confirm", "scholar-reviewed" or "scholar-verified", read it as this review.** Mirath fixtures record `verifiedBy: "ai-review"` plus `sources`. The user-facing "consult a qualified scholar" disclaimers stay.                                                                                                      |
| D12 | Licences                        | **A source whose licence is unclear is not used**: no bundling and no runtime fetch. The feature ships without that tier until a source passes review. This applies to morphology data (NF-3.22), hadith recordings (NF-3.23), iqamah timetables (NF-3.11), kids content (NF-3.16) and sound packs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D13 | Settings panel (NF-3.0b)        | **Build a "Reorder library" editor** (`libraryMenuOrder` is implemented, not deleted). **Bundle one native notification sound per adhan style.** **Merge the four translation/transliteration visibility stores into one app-wide setting.** **"Reset app data" lives only in Data & storage** (removed from Profile, which keeps Delete account).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| D14 | Hijri date adjustment           | **Added**, with a global offset plus per-month corrections that always keep months at 29 or 30 days. Applied once, inside `lib/hijri.ts`, so every surface agrees (§4.5.11).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| D15 | Ayah notes (NF-3.21)            | **Normal sync** (not the vault). **Word-level highlights ship in mushaf page mode in v1**, after a glyph-box spike.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D16 | Tasbeeh (NF-3.19, 3.20)         | **All designs free.** **TV sound defaults on**; phones stay off. **CC0 sound packs**, credited. **The pebbles / date-pits design ships, with a grading note.** Hands-free counting keeps **Strict (default) + Balanced**.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D17 | Focus lock iOS fallback         | If Apple denies the entitlement, **ship the soft prompt on iOS** (hard block off via `focusLockHardIos`); Android keeps the hard block.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D18 | Speech model on web             | **No self-hosting and no CDN of our own.** On web, FastConformer comes from the public, CC-BY-4.0 Hugging Face mirror **`acibZ/tilawa-quran-onnx`, pinned to commit `0cd79471524bc9cfa1c9296055242a935a1873e4`**: `https://huggingface.co/acibZ/tilawa-quran-onnx/resolve/0cd7947…/<file>`. Checked 2026-11-23: all five files (`fastconformer_full_mixed.onnx` 88,307,366 B, `vocab.json`, `quran_ctc_tokens.json`, `quran.json`, `export_metadata.json`) match the sha256 values already pinned in `constants/recitation-models.json`, and the CDN sends `Access-Control-Allow-Origin: *`. The GitHub release URLs stay the native source; they can't serve the browser because neither `github.com` nor `release-assets.githubusercontent.com` sends a CORS header. Set `webHosted: true` with the HF URLs as web sources. The existing hash check rejects anything that changes. Credit both the mirror and the original (yazinsai/tilawa, NVIDIA FastConformer). |
| D19 | Hadith audio (NF-3.23)          | **Licence-cleared human recordings only; no device voice in any language.** If no recording source passes D12, **hadith audio doesn't ship**. This replaces the earlier "v1 = translation read-aloud" decision.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D20 | Pronunciation (NF-3.24)         | **Full Clear / Listen again / Not sure per word, gated**: if spike S3 misses the gate, v1 automatically falls back to "skipped or unclear words". Flagged words **feed NF-3.15 coaching automatically**, with an opt-out setting.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| D21 | Timeline                        | The owner plans to implement the whole plan in one push (2–3 days), so the phase order stays and **no early-launch exception** is needed for group khatm.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D22 | Root-word source (NF-3.22)      | The **unmodified Quranic Arabic Corpus morphology v0.4**, fetched cache-first from a pinned public GitHub copy (no self-hosting), checked against sha256 `910b721a…532d` after LF normalisation. The **root index is built on the device**, and the full QAC notice plus a link to corpus.quran.com appear in Credits. Its own terms allow use in any application with that credit. Details in NF-3.22.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| D23 | Speech testing                  | **No new human recordings and no storage of our own.** The test sets for S1–S4 are built at eval time from audio the app already streams: adhkar/dua recordings (`lib/audio-tracks.ts`), several Qur'an reciters (everyayah) and word-by-word audio (audio.qurancdn.com). The eval adds noise, speed and reverb variants and spliced errors (swapped or dropped words, confusable-letter word swaps). **Zipformer, FastConformer and Quran Lab cross-check each other.** Audio is cached locally (gitignored) and never committed. Release gates are reported as **"measured on reference + synthetic audio"**, and copy never claims accuracy on real learners' voices.                                                                                                                                                                                                                                                                                              |
| D24 | Spike failures                  | If a spike fails (S1–S4, N1), **the feature's documented fallback ships** without asking again: pause-count mode (3.20), "skipped or unclear words" (3.24), an ayah tint on that page (N1). The result goes in the proof log.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D25 | External filings, Quran Lab SDK | **File the Apple Family Controls entitlement and the Play declarations now** (D17 covers a refusal). **NF-3.15 Phase B no longer waits for the SDK**: it uses NF-3.24's own forced alignment for per-word windows and per-word coaching. Head-level judging inside an ayah stays out of scope until the SDK supports it (see NF-3.15).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| D26 | Iqamah sources (NF-3.11)        | **OpenStreetMap plus any public feed that passes D12.** Research feeds during the build; each adapter needs a recorded licence review. With no cleared feed, only OSM and the user's private times are shown.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| D27 | Kids content (NF-3.16)          | A **curated subset of the bundled datasets** (short duas, daily adhkar, 99 Names, short surahs) chosen under D11, using existing audio only. **No new kids-specific sources.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| D28 | Tasbeeh sound sources           | **Kenney** CC0 packs plus individual **Freesound** clips filtered to CC0; each file's licence is recorded (D12).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

Planning decisions confirmed and locked on 2026-11-23:

- **Masjid finder v1 is list-first.** "Open in Maps" uses the OS deep link. The in-app map (MapLibre plus OpenFreeMap tiles) is v2, so a new map SDK isn't needed at launch.
- **Group khatm unit**: 30 juz by default; 60 hizb or 114 surahs are optional.
- **Rawatib are stored as new `PrayerId`s** reusing `PrayerLog` (§5.1), rather than as a new entity.
- **Ayah notes (NF-3.21) use a normal sync entity, not the vault** (D15).
- **Hadith audio (NF-3.23) is human recordings only** (D19, which replaces the earlier "translation read-aloud" choice).

---

## 2. Non-negotiable rules (all features)

1. **No AI-written or hand-typed scripture.** Qur'an and hadith text is always rendered from the bundled or remote corpus **by reference** (`surah:ayah`, `collection:number`). New guide copy follows the existing `packages/shared/src/content/*-guide.ts` pattern, with explicit refs checked by `content-verification.ts`. See the root `AGENTS.md`, "Content & data".
2. **Madhhab-aware, not madhhab-imposing.** Every ruling that differs between the schools reads `useMadhhab()` (§4.1). When `madhhab === null`, show all views side by side.
3. **Proof-backed review gate (D11).** Each feature has a "Proof-backed review" checkbox in §10 and does not ship without a complete proof log. Mirath also needs every fixture reviewed with sources (D6).
4. **Privacy by default.**
   - Worship stats are private.
   - No leaderboards for ibadah.
   - Lock-screen notification text never reveals sensitive state: no hayd, no sins, no debts amounts.
   - Sentry tags only: no user content, the same rule as `lib/quran-companion/error-codes.ts`.
5. **Gentle tone.**
   - A missed act is framed as "make it up / ask Allah's forgiveness", never "you failed" or "streak lost".
   - Excused periods (hayd/sick/travel via `activeExcusedReason`) pause every judgement and nudge in these features.
6. **Theming and i18n.** Use `useTheme()` and no hardcoded colors. All strings go through i18n in all 24 locales ([`I18N_GUIDE.md`](./I18N_GUIDE.md)). Arabic dhikr text is never translated in place.
7. **Tests.** Use the shared `test-support` mocks, fixtures and helpers; tests should be DRY. Pure logic lives in `packages/shared/src/utils` or `apps/app/src/lib` with Vitest or Jest unit tests. Only the UI goes in routes.

---

## 3. Phasing & sequencing

| Phase | Features                                                                                                                                                                     | Why this order                                                                                                                                                                                                                                                                                                                                                                                                                               | Est. size |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 0     | NF-3.0 foundations: **NF-3.0a madhhab setting + retrofit of shipped features (§4.1.4)**, **NF-3.0b settings control panel (§4.5)**, vault, **entitlement / Play filings**    | Everything else depends on these. The retrofit fixes today's silent single-school defaults (zakat nisab, Witr qaza, hayd). The settings registry has to exist before features start adding settings, and it fixes the audit bugs B1–B7. The Apple and Play reviews take weeks.                                                                                                                                                               | L         |
| 1     | 3.1 Rawatib · 3.2 Voluntary fasting · 3.5 Sunnah habits · 3.3 Dhul-Hijjah mode · 3.19 Tasbeeh designs                                                                        | Local-only, used every day, extends existing patterns. **Dhul-Hijjah 1448 starts around May 2027** (verify with `hijri.ts`). 3.19 has no dependencies, so it can be built in parallel with the others or at any time.                                                                                                                                                                                                                        | M         |
| 2     | 3.6 Muhasabah · 3.7 Silat al-rahim · 3.8 Debts · 3.9 Wasiyyah · 3.14 Coach                                                                                                   | Needs the vault (D2). The coach consumes Phase 1 data.                                                                                                                                                                                                                                                                                                                                                                                       | L         |
| 3     | 3.10 Mirath · 3.15 Tajweed coaching · 3.20 Hands-free tasbeeh · 3.4 Umrah mode · 3.21 Ayah notes · 3.22 Root-word search · 3.23 Hadith audio · 3.24 Pronunciation assessment | Heavy fiqh/test work. The wasiyyah links into mirath. 3.20 and 3.24 share the on-device speech stack with Qur'an practice (build 3.20's shared FastConformer runner first); 3.20 also needs the 3.19 counter shell. Spikes S1–S4 can start at any time. 3.21 has no dependencies and can be built at any time. 3.22's source is already cleared (D22). 3.23 depends on finding licence-cleared recordings (D19), so start that search early. | XL        |
| 4     | 3.13 Focus lock · 3.11 Masjid finder · 3.12 Timetable OCR                                                                                                                    | Native modules plus a read-only OSM proxy in the API (no admin work). The entitlements should be approved by now.                                                                                                                                                                                                                                                                                                                            | XL        |
| 5     | 3.16 Family & kids · 3.17 Partner · 3.18 Group khatm                                                                                                                         | D1: social goes last. Needs the `circles` backend.                                                                                                                                                                                                                                                                                                                                                                                           | XL        |

Dependency graph (→ = "needed by"):

```
settings registry (3.0b) ─→ every feature that adds a setting (registers it in lib/settings)
madhhab pref ─→ rawatib, dhul-hijjah, voluntary fasting, mirath, umrah
vault ────────→ muhasabah, silat al-rahim, debts, wasiyyah
debts ────────→ wasiyyah ─→ mirath (estate deductions)
masjid finder → timetable OCR (private home-masjid times), focus lock (iqamah window), rawatib (tahiyyat al-masjid hint)
circles API ──→ family/kids, partner, group khatm
all trackers ─→ weekly coach
tasbeeh shell (3.19) + Qur'an practice speech stack (shipped) ─→ hands-free tasbeeh (3.20)
shared FastConformer runner (built in 3.20) ─→ pronunciation assessment (3.24) ─→ tajweed coaching (3.15, flagged words as examples)
morphology dataset licence review ─→ root-word search (3.22)
recording licence review ─→ hadith audio Tier 2 (3.23)
```

---

## 4. Foundations (NF-3.0)

### 4.1 NF-3.0a "My madhhab" setting, applied app-wide

**Problem.** Today madhhab only drives the Asr calculation (`MadhabKey = "shafi" | "hanafi"` in `apps/app/src/lib/prayer-times.ts`). Rulings also differ for:

- Witr
- hayd, istihada and nifas durations
- qasr distance, residency and combining prayers
- the zakat nisab and jewellery
- Fajr and Isha preferred times
- fidyah and kaffarah
- Eid and Jumu'ah details
- how salah is performed

These differences currently appear only as prose (for example in `taharah.ts`, `salah-guide.ts` and `travel-guide.ts`), or are silently fixed. For example, `lib/zakat.ts → lowerNisab()` always applies the Hanafi-style "lower of gold/silver".

**Goal.**

- One global setting: **Hanafi, Shafi'i, Maliki, Hanbali, or "Show all views"**.
- Every guide and calculator reads it.
- Differences of opinion are **labelled, never hidden**. Even with a school selected, a "Other views" disclosure is always one tap away.

#### 4.1.1 Data model

`packages/shared/src/types/preferences.ts`:

```ts
export type MadhhabId = "hanafi" | "shafii" | "maliki" | "hanbali";

/** Fiqh areas a user may set independently (advanced; talfiq caution shown). */
export type FiqhDomain =
  | "salah"
  | "taharah"
  | "fasting"
  | "zakat"
  | "travel"
  | "hajj"
  | "udhiyah"
  | "inheritance";

interface UserPreferences {
  // …existing
  /** Fiqh school for rulings. `null` = show all views side by side; `undefined` = never asked. */
  madhhab?: MadhhabId | null;
  /** Advanced: per-domain school (e.g. Hanafi overall, but a scholar told me silver nisab). Unset ⇒ `madhhab`. */
  madhhabOverrides?: Partial<Record<FiqhDomain, MadhhabId | null>>;
  /** Advanced: explicit numeric overrides a local scholar gave (labelled "custom" in UI). */
  fiqhCustom?: {
    qasrDistanceKm?: number;
    residencyDays?: number;
    nisabBasis?: NisabBasis;
    haydMaxDays?: number;
    nifasMaxDays?: number;
  };
}
```

- **Sync:** part of the typed `preferences` record. Update the API preferences DTO and run `pnpm generate:api`. No new entity.
- **Relationship to the Asr `MadhabKey`:** they stay independent, because some people follow a school but pray Asr by their masjid's timetable.
  - When the user picks a madhhab, offer "Also use <school> Asr time?" (Hanafi → `hanafi`; others → `shafi`).
  - If they differ later, the location screen shows a neutral hint and never auto-changes the setting.
- **Asked:**
  1. a new onboarding step after location
  2. Settings → **"Fiqh & madhhab"**
  3. existing users with `undefined` see a one-time home card, "Choose your madhhab for rulings"; dismissing it sets `null` ("show all views")
  4. lazily, the first time a fiqh-dependent screen opens while it is still `undefined`

#### 4.1.2 Architecture

```
packages/shared/src/fiqh/
  madhhab-rules.ts      // typed numeric/enum rules consumed by calculators & trackers (MADHHAB_RULES)
  differences.ts        // catalog of labelled differences consumed by guides (FIQH_DIFFERENCES)
  resolve.ts            // resolveSchool(prefs, domain) → MadhhabId | null ; rulesFor(...)
  __tests__/            // snapshot + per-rule tests
apps/app/src/hooks/use-madhhab.ts        // { madhhab, schoolFor(domain), rules(domain), isAllViews }
apps/app/src/components/fiqh/
  madhhab-note.tsx      // <MadhhabNote id="witr.status" />  — selected school's position + "Other views" disclosure
  ruling-compare.tsx    // <RulingCompare id="…" />          — 4-column table (used when madhhab === null)
  madhhab-badge.tsx     // small "Hanafi" / "All views" chip on calculators & results
  madhhab-picker.tsx    // shared picker (onboarding, settings, lazy sheet)
```

**Difference catalog entry.** This is guide copy, not scripture: it is authored, refs-checked by `content-verification.ts`, scholar-reviewed and translated into 24 locales.

```ts
export interface FiqhDifference {
  id: string; // "witr.status", "hayd.max", "qasr.distance", …
  domain: FiqhDomain;
  titleKey: string;
  positions: Record<
    MadhhabId,
    { summaryKey: string; value?: string | number; refs?: ContentRef[] }
  >;
  /** Optional label when 3+ schools agree. */
  majority?: MadhhabId[];
  /** Where the difference is shown (guide section ids / routes) — used by a coverage test. */
  usedIn: string[];
}
```

**Display rules:**

- **School selected:** show that school's position inline with a `MadhhabBadge`, plus a collapsed "Other views (3)" disclosure. Never phrase the selected view as the only valid one.
- **`null` (all views):** show `<RulingCompare>`. Calculators show a results row per school, or ask "Which view do you follow for this?" with a one-tap answer saved to `madhhabOverrides`.
- **Domain overrides** show a talfiq caution card once: "Mixing schools per convenience is discouraged; follow guidance from your teacher."
- A **coverage test** asserts that every `FiqhDifference.usedIn` section actually renders a `MadhhabNote`, and that every guide prose paragraph mentioning "Hanafi|Shafi'i|Maliki|Hanbali" has a structured difference attached. Guide prose then degrades gracefully into the structured view.

#### 4.1.3 Rules matrix (MADHHAB_RULES + FIQH_DIFFERENCES)

All values **must be scholar-confirmed before merge**. Where a school has multiple relied-upon views, record the relied-upon one (mu'tamad) and list the others in the difference catalog.

| Area                           | Rule                                         | Hanafi                                                                 | Shafi'i                                                                        | Maliki                                                           | Hanbali                                                  |
| ------------------------------ | -------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| **Salah times**                | Asr start (existing `MadhabKey`)             | Shadow 2× (+ zawal shadow)                                             | Shadow 1×                                                                      | Shadow 1×                                                        | Shadow 1×                                                |
|                                | Fajr preferred time                          | Isfar (when light spreads, leaving time to repeat)                     | Taghlis (early, in darkness)                                                   | Taghlis                                                          | Taghlis                                                  |
|                                | Isha start (info only; calc angle unchanged) | White twilight (Abu Hanifa); red per the Sahibayn (many Hanafi fatwas) | Red twilight                                                                   | Red twilight                                                     | Red twilight                                             |
|                                | Isha preferred time                          | Delay to ⅓ of the night                                                | Early (one view prefers delay)                                                 | Early (esp. for congregations)                                   | Delay to ⅓ if not hard on others                         |
|                                | Asr preferred / disliked                     | Delay is preferred, but not until the sun yellows                      | Early                                                                          | Early                                                            | Early                                                    |
| **Witr**                       | Status                                       | **Wajib**                                                              | Sunnah mu'akkadah                                                              | Sunnah mu'akkadah                                                | Sunnah mu'akkadah                                        |
|                                | Form                                         | 3 rak'at, one salam, qunut before ruku' all year                       | Min 1, commonly 2+1, max 11; qunut in the 2nd half of Ramadan                  | 1 rak'ah after a 2-rak'ah shaf'                                  | Min 1, commonly 2+1, max 11; qunut all year, after ruku' |
|                                | Make-up (qaza)                               | Required                                                               | Recommended                                                                    | Recommended                                                      | Recommended                                              |
| **Salah method** (guide notes) | Raising the hands                            | Opening takbir only                                                    | Opening, ruku', rising, standing for the 3rd                                   | Opening (the well-known view)                                    | Opening, ruku', rising                                   |
|                                | Fatiha behind the imam                       | Not recited                                                            | Obligatory in every prayer                                                     | Recited in silent prayers only                                   | Recited in silent prayers only                           |
|                                | Qunut in Fajr                                | No                                                                     | Yes (standing, after ruku')                                                    | Yes (quietly, before ruku')                                      | No (only nazilah)                                        |
| **Hayd / nifas**               | Hayd minimum                                 | 3 days                                                                 | 1 day + night (24 h)                                                           | No minimum (for worship)                                         | 1 day + night                                            |
|                                | Hayd maximum                                 | 10 days                                                                | 15 days                                                                        | 15 days (habit + 3 days istizhar for a habitual woman, up to 15) | 15 days                                                  |
|                                | Minimum purity between two periods           | 15 days                                                                | 15 days                                                                        | 15 days                                                          | 13 days                                                  |
|                                | Nifas maximum                                | 40 days                                                                | 60 days                                                                        | 60 days                                                          | 40 days                                                  |
|                                | Bleeding beyond the maximum                  | Istihada: pray, wudu per prayer time                                   | Istihada (distinguish by habit/colour)                                         | Istihada                                                         | Istihada (by habit/colour)                               |
| **Travel**                     | Qasr distance (approx.; conversions differ)  | ≈ 77–78 km (48 mi)                                                     | ≈ 81–89 km (4 burud)                                                           | ≈ 81–89 km                                                       | ≈ 81–89 km                                               |
|                                | Qasr status                                  | **Wajib** (praying 4 is sinful/makruh tahriman)                        | Concession (qasr is better)                                                    | Sunnah mu'akkadah                                                | Concession (qasr is better)                              |
|                                | Becomes resident by intending to stay        | ≥ 15 days                                                              | ≥ 4 full days (excluding the arrival and departure days)                       | ≥ 4 full days (≈ 20 prayers)                                     | > 4 days (more than 20 prayers)                          |
|                                | Combining prayers (jam') while travelling    | **Not allowed** (except Arafah/Muzdalifah in Hajj)                     | Allowed (taqdim/ta'khir)                                                       | Allowed with conditions (while on the move)                      | Allowed                                                  |
|                                | Combining for rain                           | No                                                                     | Yes (Dhuhr+Asr, Maghrib+Isha, in congregation)                                 | Maghrib+Isha                                                     | Maghrib+Isha                                             |
|                                | Rawatib while travelling                     | Optional (except the Fajr sunnah; recommended when settled)            | Optional                                                                       | Optional                                                         | Left except Fajr sunnah and Witr                         |
| **Zakat**                      | Nisab for cash/trade goods                   | **Lower** of gold/silver (favours the poor)                            | Gold or silver (classical: per metal; for currency, contemporary views differ) | Gold or silver; gold and silver combined                         | Gold or silver (one view: lower)                         |
|                                | Combine gold + silver to reach nisab         | Yes (by value)                                                         | No                                                                             | Yes (by proportion)                                              | Two views (the relied-upon one: yes)                     |
|                                | Women's personal-use jewellery               | **Zakatable**                                                          | Not zakatable (if permissible and in normal use)                               | Not zakatable                                                    | Not zakatable                                            |
| **Fasting**                    | Eating forgetfully                           | Fast valid                                                             | Fast valid                                                                     | Make up (obligatory fast)                                        | Fast valid                                               |
|                                | Kaffarah trigger                             | Intercourse **or** deliberate eating/drinking                          | Intercourse only                                                               | Intercourse or deliberate eating/drinking                        | Intercourse only                                         |
|                                | Fidyah measure                               | ½ sa' wheat or 1 sa' dates/barley; **cash value allowed**              | 1 mudd of staple food per day; food only                                       | 1 mudd; food                                                     | 1 mudd of wheat or ½ sa' of other food; food             |
|                                | Sadaqat al-fitr                              | ½ sa' wheat / 1 sa' other; **cash allowed**                            | 1 sa' of staple food                                                           | 1 sa' of staple food                                             | 1 sa' of staple food                                     |
|                                | Tarawih (info)                               | 20                                                                     | 20                                                                             | 20 (36 as the old Madinah practice)                              | 20                                                       |
| **Jumu'ah / Eid**              | Minimum congregation for Jumu'ah             | 3 + imam                                                               | 40                                                                             | 12 + imam                                                        | 40                                                       |
|                                | Eid prayer status                            | Wajib                                                                  | Sunnah mu'akkadah                                                              | Sunnah mu'akkadah                                                | Fard kifayah                                             |
|                                | Extra Eid takbirs                            | 3 + 3                                                                  | 7 + 5                                                                          | 6 + 5 (7 counting the opening)                                   | 6 + 5 (7 counting the opening)                           |
| **Janazah**                    | Fatiha in the janazah prayer                 | Not recited (praise instead)                                           | Obligatory                                                                     | Not recited                                                      | Obligatory                                               |
| **Hajj / Umrah**               | Wudu for tawaf                               | Wajib (valid without it, with a penalty)                               | Condition of validity                                                          | Condition                                                        | Condition                                                |
| **New features**               | Rawatib preset (NF-3.1)                      | 12                                                                     | 10                                                                             | 10                                                               | 10                                                       |
|                                | Takbir al-Tashriq (NF-3.3)                   | Fajr 9 → Asr 13, wajib, 2 opening takbirs                              | Fajr 9 → Asr 13, sunnah, 3                                                     | Dhuhr 10 → Fajr 13, 3                                            | Fajr 9 → Asr 13, 2                                       |
|                                | Udhiyah (NF-3.3)                             | Wajib on one with nisab; ends 12th                                     | Sunnah mu'akkadah; ends 13th                                                   | Sunnah mu'akkadah; ends 12th                                     | Sunnah mu'akkadah; ends 12th                             |
|                                | Hair/nails in the ten (NF-3.3)               | Mustahabb to refrain                                                   | Makruh                                                                         | Makruh                                                           | Haram                                                    |
|                                | Shafi'i: fasting after mid-Sha'ban (NF-3.2)  | —                                                                      | Disliked unless habitual or qaza                                               | —                                                                | —                                                        |
|                                | Mirath disputed cases (NF-3.10)              | See §7 NF-3.10                                                         |                                                                                |                                                                  |                                                          |

**Typed rules** consumed by code (excerpt):

```ts
export interface MadhhabRules {
  asrDefault: MadhabKey; // "hanafi" | "shafi"
  fajrPreferred: "isfar" | "taghlis";
  ishaPreferred: "delay_third" | "early";
  witr: { status: "wajib" | "sunnah_muakkadah"; qazaDefault: boolean; form: WitrForm };
  hayd: { minHours: number | 0; maxDays: number; minPurityDays: number; nifasMaxDays: number };
  travel: {
    qasrDistanceKm: number;
    qasrStatus: "wajib" | "concession" | "sunnah";
    residencyDays: number;
    residencyRule: "gte" | "gt";
    jamTravel: boolean;
    jamRain: "none" | "maghrib_isha" | "both";
    rawatib: "optional_except_fajr" | "optional" | "left_except_fajr_witr";
  };
  zakat: {
    nisabBasis: NisabBasis;
    combineGoldSilver: boolean;
    personalJewelleryZakatable: boolean;
  };
  fasting: {
    forgetfulEatingBreaks: boolean;
    kaffarahTriggers: Array<"intercourse" | "deliberate_eating">;
    fidyahMeasure: "half_sa_wheat" | "mudd";
    fidyahCashAllowed: boolean;
    fitrCashAllowed: boolean;
  };
  rawatib: { defaultPreset: 10 | 12; dhuhrBefore: 2 | 4 };
  takbirTashriq: {
    start: TashriqSlot;
    end: TashriqSlot;
    status: "wajib" | "sunnah";
    openingTakbirs: 2 | 3;
  };
  udhiyah: { status: "wajib_for_capable" | "sunnah_muakkadah"; lastDayHijri: 12 | 13 };
  hairNailsDuringTen: "haram" | "makruh" | "mustahabb_to_refrain";
  eid: { status: "wajib" | "sunnah_muakkadah" | "fard_kifayah"; extraTakbirs: [number, number] };
  mirath: MirathSchoolParams; // §7 NF-3.10
}
export type NisabBasis = "lower" | "gold" | "silver";
export type TashriqSlot = { hijriDay: 9 | 10 | 13; prayer: "fajr" | "dhuhr" | "asr" };
export const MADHHAB_RULES: Record<MadhhabId, MadhhabRules> = {
  /* filled + scholar-reviewed */
};

/** Resolves the domain school, then applies `fiqhCustom` numeric overrides. `null` ⇒ caller shows all views. */
export function rulesFor(
  prefs: Pick<UserPreferences, "madhhab" | "madhhabOverrides" | "fiqhCustom">,
  domain: FiqhDomain,
): MadhhabRules | null;
```

#### 4.1.4 Apply to existing features (retrofit; Phase 0 deliverable)

| Shipped feature                        | Files                                                                   | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prayer times / location (NF-0.1, 0.2)  | `lib/prayer-times.ts`, `app/location`, `stores/location-store.ts`       | Offer the matching Asr `MadhabKey` on madhhab pick; show a neutral mismatch hint. No automatic change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Preferred-time hints                   | `lib/salah-phase/*`, `lib/prayer-ui.ts`, home hero, tracker             | New "preferred window" sub-band per prayer: Fajr isfar vs taghlis, Isha delay to ⅓ of the night vs early, Asr "before the sun yellows". In all-views mode, show a neutral "earliest / preferred" note with a `MadhhabNote`. Optional "remind at preferred time" offset suggestion in `/settings/reminder-offsets`.                                                                                                                                                                                                                                                                                                                                                                       |
| Witr tracking + qaza (NF-1.2, tracker) | `(tabs)/tracker.tsx`, `QAZA_PRAYERS`, `lib/prayer-qaza-debt.ts`         | Witr row label "Wajib" (Hanafi) or "Sunnah mu'akkadah". **Witr qaza accrual is on by default only for Hanafi**; others can opt in. The form shown in the Witr info sheet follows the school.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Hayd / excused (NF-1.2)                | `activeExcusedReason`, `excused-guide.ts`, `ExcusedDayPicker`, calendar | **Add `"nifas"` to `ExcusedReason`.** Day counter during an active period ("Day 6 of a maximum of 10 (Hanafi)"). Prompts, **never automatic edits**: (a) beyond `maxDays` → "Bleeding after day N is istihada in your school — resume prayer with wudu for each prayer time" with a Resume button; (b) a Hanafi period that ended before 3 days → "May not count as hayd in your school; consider making up these prayers" with an "Add N to qaza" action; (c) a new period starting before `minPurityDays` → an info note. Hayd days during Ramadan → offer to add those days to roza qaza (check the current behaviour first). All copy is private and never appears in notifications. |
| Travel guide (NF-1.3)                  | `/travel`, `travel-guide.ts`                                            | New **qasr calculator**: inputs are trip distance (km/mi) and intended stay (days). Outputs: traveller yes/no, shorten 4→2 (labelled wajib or concession), when you become resident, whether jam' is available (hidden for Hanafi except Hajj), and rawatib guidance (feeds NF-3.1). Turning on travel excused mode asks the same two questions.                                                                                                                                                                                                                                                                                                                                         |
| Combining (jam')                       | `PrayerLog`                                                             | Add an optional `combinedWith?: ObligatoryPrayer` (taqdim/ta'khir) flag. It is only offered when `rules.travel.jamTravel` or rain combining applies, and is shown in history. Separate from `isJama` (congregation).                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Zakat (NF-2.2)                         | `lib/zakat.ts` (`lowerNisab`), `/zakat`, zakat draft                    | Replace the fixed `lowerNisab()` with `nisabFor(basis, goldNisab, silverNisab)`. The default basis comes from rules, with a user override in the calculator (saved to `fiqhCustom.nisabBasis`). Add a **personal jewellery** input that is included or excluded per `personalJewelleryZakatable`, with a note. Combine gold and silver per `combineGoldSilver`. The result card shows a `MadhhabBadge`, and the all-views mode shows a row per basis.                                                                                                                                                                                                                                    |
| Fidyah / kaffarah (NF-2.5)             | `lib/fidyah.ts`, `fidyah-guide.ts`, `/fidyah`                           | Measure per school (mudd vs ½ sa'), "cash value allowed" vs "food only" in the result, and kaffarah triggers in the kaffarah helper.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Ramadan mode (NF-1.1)                  | `/ramadan`, `lib/ramadan.ts`                                            | "I ate forgetfully" helper (valid fast vs make-up). Kaffarah trigger note. Sadaqat al-fitr amount per school, with a cash/food label. Tarawih info note.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Salah guide (NF-1.33)                  | `salah-guide.ts`                                                        | Attach `MadhhabNote`s: raising the hands, Fatiha behind the imam, Fajr qunut, Witr form, preferred times. The prose stays; structured notes are added.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Taharah guide                          | `taharah.ts`                                                            | Attach structured differences to the paragraphs that already name schools (tartib/muwalat, intention, dalk, wudu nullifiers).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Friday guide (NF-2.35)                 | `friday-guide.ts`                                                       | Jumu'ah minimum congregation, sunnah before/after Jumu'ah per school.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Eid guide (NF-2.30)                    | `eid-guide.ts`                                                          | Status and extra takbirs per school.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Janazah guide (NF-2.6)                 | `janazah-guide.ts`                                                      | Fatiha in the janazah prayer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Hajj / Umrah (NF-2.3, NF-3.4)          | `hajj-guide.ts`, umrah mode                                             | Wudu for tawaf. Udhiyah/hajj-related notes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Flash cards / quizzes                  | `lib/flash-cards`, `*-quiz.ts`                                          | Questions whose answer depends on the school are tagged with a `differenceId`. In all-views mode they are skipped, or the answer shows every school.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Search                                 | `search-guides`, `lib/search.ts`                                        | Index the difference catalog so a search like "witr wajib" or "qasr distance" finds the comparison card.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

#### 4.1.5 Settings UI — "Fiqh & madhhab"

1. **My madhhab:** Hanafi / Shafi'i / Maliki / Hanbali / Show all views. Short neutral description of each; no ranking.
2. **"Not sure?"** explainer: follow what your family, masjid or teacher follows, or choose all views. Never recommends a school.
3. **Advanced** (collapsed):
   - per-domain overrides, with the talfiq caution
   - custom values: qasr distance, residency days, nisab basis, hayd/nifas max, each labelled "Custom — as advised by your scholar"
4. **"Where this applies"**: a list of the features above, with deep links.
5. Changing the madhhab triggers:
   - the Asr offer
   - `rescheduleAll` if any preferred-time reminder offsets are tied to it
   - a toast: "Rulings updated across the app"

#### 4.1.6 Tests & acceptance

**Tests:**

- `MADHHAB_RULES` snapshot test; any change requires updating a `reviewedBy` field.
- `rulesFor` resolution: domain override > global > `null`; custom numbers applied.
- The coverage test (§4.1.2).
- Each retrofit has unit tests for its school variants (zakat basis, qasr calculator, hayd day-count prompts, Witr qaza default).

**Acceptance:**

- A new Hanafi user sees Witr labelled wajib, has Witr qaza on, sees a 10-day hayd maximum, gets ~77 km qasr with no jam', and uses the lower nisab with jewellery included.
- A Shafi'i user sees the opposite where the schools differ.
- "Show all views" shows a comparison everywhere and never silently picks a school.
- No existing user's data changes when they pick a madhhab; only defaults and labels change.

### 4.2 Vault (E2E-encrypted local store + opt-in sync) — D2

**Module**: `apps/app/src/lib/vault/`, with `vault.ts`, `crypto.native.ts`, `crypto.web.ts`, `vault-store.ts` and `vault-sync.ts`.

**At rest (always on):**

1. On first use, generate a 256-bit **data key (DEK)**.
2. Keep the DEK in `expo-secure-store` on native. On web, use a non-extractable `CryptoKey` in IndexedDB.
3. Each vault document is encrypted with **AES-256-GCM** (12-byte random IV) using the DEK.
4. Ciphertext is stored with AsyncStorage under `DB_KEYS.vault/<docId>`.

**Opt-in sync:**

1. The user sets a **vault passphrase** (minimum 10 chars, with a strength meter).
2. Derive a key-encryption key (KEK) with **scrypt** (`react-native-quick-crypto` on native, WebCrypto plus a wasm scrypt on web). Parameters: N=2^15, r=8, p=1, 16-byte salt. Benchmark on a low-end Android phone and target ≤ 1.5 s.
3. Upload `wrappedDek = AES-GCM(KEK, DEK)` and the salt as blob entity `vault_keyring`.
4. Each document syncs as its own blob entity (`vault_muhasabah`, `vault_debts`, `vault_wasiyyah`, `vault_relatives`). The server value has this shape:

   ```ts
   type VaultEnvelope = { v: 1; alg: "A256GCM"; keyId: string; iv: string; ct: string; updatedAt: string };
   ```
5. **Merge** runs client-side through the existing `BlobEntity.merge` hook in `sync/blob-sync.ts`:
   - decrypt both values
   - run the domain merge (per-item LWW on `updatedAt`, with tombstones)
   - re-encrypt
6. **Recovery:**
   - Show a 24-word recovery code once; it is a second wrapped copy of the DEK.
   - If the user loses both the passphrase and the code, the cloud copy is gone. Local data still works on the device that has the DEK.
   - Say this plainly in the opt-in sheet.
7. **New device:** the user enters the passphrase, which unwraps the DEK and decrypts the documents.
8. **Lock:** optionally require the existing app lock (`features/pin-lock`) before opening any vault screen. The toggle lives at Settings → Privacy → "Lock private journals".

**Server:**

- Add the five entities to `SYNC_ENTITIES` in `apps/api/src/sync/dto/sync.dto.ts`.
- Add server-side validation that the value matches the `VaultEnvelope` shape and is ≤ 256 KB.
- Never log values.

**Backup:** classify each `DB_KEYS.vault/<docId>` as `userData`, so the ciphertext is in `BACKUP_KEYS` automatically. Importing it needs the DEK on the device, or the passphrase.

**Wipe:** reset clears the ciphertext keys through `RESET_KEYS`. `lib/wipe-local-data.ts` must also delete the **DEK from SecureStore / IndexedDB**, which lives outside `DB_KEYS`.

**Tests:**

- round-trip encryption
- wrong passphrase → typed error
- merge of two diverged documents
- tampered ciphertext → GCM auth failure, surfaced as a `vault-corrupt` error code

### 4.3 Store/approval filings (start in Phase 0)

| Filing                                                                                                 | Needed by | Lead time              |
| ------------------------------------------------------------------------------------------------------ | --------- | ---------------------- |
| Apple **Family Controls (Distribution)** entitlement request, for the app and each extension bundle id | NF-3.13   | Weeks; can be rejected |
| Play Console **foreground service `specialUse`** declaration + video                                   | NF-3.13   | Days–weeks             |
| Play Console **`PACKAGE_USAGE_STATS`** / overlay justification in Data safety                          | NF-3.13   | With review            |
| Privacy policy update: vault, kids profiles, OCR (on-device), masjid lookups (geohash cell only)       | 3.6–3.18  | Internal               |
| Legal review: kids data (COPPA / GDPR Art. 8 / UK AADC), wasiyyah disclaimer                           | 3.9, 3.16 | Internal               |

### 4.4 Shared plumbing per new local entity

Repeat this for every new store. It mirrors the existing `white_days_checklist` path.

1. Add a `DB_KEYS.<name>` entry in `apps/app/src/db/keys.ts` **and classify it in `KEY_PERSISTENCE`** (same file):
   - `userData`: personal data, backed up and wiped on reset
   - `watermark`: its blob's LWW timestamp
   - `cache`: rebuildable, never backed up
   - `deviceLocal`: device-specific, never backed up
   - `schema`

   The map is a `Record<keyof typeof DB_KEYS, …>`, so a missing key **fails to compile**. `RESET_KEYS` and `BACKUP_KEYS` are derived from it, so backup and reset need no hand edits (verified 2026-11-23; `duaRecents` is the latest `deviceLocal` example).
2. Create the store with `createStore` in `apps/app/src/stores/<name>-store.ts`, plus `useEnsure<Name>Loaded`.
3. Add a `BLOB_ENTITIES` entry in `apps/app/src/sync/blob-sync.ts`. Add it to `UNION_MERGE_ENTITIES` if the value is a plain map, otherwise provide a custom `merge`.
4. Add the entity to `SYNC_ENTITIES` in `apps/api/src/sync/dto/sync.dto.ts`. Regenerate the client with `pnpm generate:api`.
5. Only state kept **outside** `DB_KEYS` needs manual handling in `lib/backup.ts` and `lib/wipe-local-data.ts`: SecureStore keys (vault DEK, PIN), files (audio cache, models) and AsyncStorage mirrors such as the theme (B6).
6. Add it to `reload-all-stores.ts` so the `data_reset` path clears it.

### 4.5 NF-3.0b Settings control panel (redesign + settings registry)

**Goal.** Settings becomes the **one control panel for the whole app**. Every persisted, user-facing option can be found there: grouped by task, searchable, showing its current value, and resettable. Controls inside feature screens (reader toolbars, the mini-player, calculators) stay as **shortcuts**. They write the same value through the same code path, so the two places can never disagree.

**Why now (Phase 0):** the NF-3.x features add about 15 new settings, including madhhab, rawatib, fasting, tasbeeh designs, hands-free counting, vault lock, focus lock, home masjid and iqamah, coach, circles and hadith audio. Without one structure, each feature would invent its own settings screen and the current sprawl would double.

#### 4.5.1 Audit of today's settings (verified 2026-11-23)

**Shape of the hub** (`app/(tabs)/settings.tsx`):

- There are no section headings: an Account card, then one card of **16 mixed rows** with 4 inline toggles between links, then a card of 8 unrelated rows (reports, import, backup, Qur'an practice, offline data, tour, about, credits).
- 19 sub-screens under `app/settings/`, plus `/profile`, `/location` and `/notifications` (the inbox).
- There's **no search** in Settings, and the universal `/search` doesn't index settings.

**Persisted options with no entry in Settings at all:**

| Area                                  | Options (store → field)                                                                                                                                                                                                                                | Edited only in                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Location & calculation                | `location` (GPS/manual), `location.method`, `location.madhab`                                                                                                                                                                                          | `/location`, which **the hub doesn't link to**                                                                      |
| Qur'an reader                         | `quranPrefs.readerLayout`, `preferredReciterDir`, `preferredTranslationIds`, `secondaryTranslationId`, `preferredTafsirId`, `showTranslation`, `showTransliteration`, `showWordByWord`, `showTajweed`, `repeatMode`, `repeatRange`, `translationAudio` | reader filter card and toolbar (`quran/[surah].tsx`, `quran/page/[page].tsx`), `PlaybackSettingsSheet`, mini-player |
| Device voice (TTS)                    | `quranPrefs.ttsVoiceByLang` (stored under the Qur'an prefs but used by every Listen button)                                                                                                                                                            | 5 sites: playback sheet, mini-player, `reading-tts-button`, `learn-tts-context`, `tts-voice-control`                |
| Audio player                          | `prefs.audioSpeed`, `prefs.audioVolume`                                                                                                                                                                                                                | mini-player only                                                                                                    |
| Text size per screen                  | `prefs.fontPrefs.readingOverrides.*` (13 reading surfaces)                                                                                                                                                                                             | A−/A+ on every reader (`reading-font-controls.tsx`); no overview, no "reset all"                                    |
| Hadith display                        | `hadithPrefs.showArabic/showTranslation/showNarrator/showGrade/showIsnad/showSharh`                                                                                                                                                                    | `hadith/[collection].tsx` (filter card and toolbar)                                                                 |
| Dua / zikr / durood / tasbeeh display | `readingTextVisibility.showTranslation/showTransliteration`                                                                                                                                                                                            | `scripture-reading-filters.tsx`, `reading-typography-context.tsx`                                                   |
| Qur'an practice                       | `companion.practiceView`, `companion.rangePreset`                                                                                                                                                                                                      | practice hub and toolbar                                                                                            |
| Money                                 | currency and number format, chosen **separately** in zakat, fidyah and sadaqah                                                                                                                                                                         | each calculator                                                                                                     |
| Onboarding                            | `hasCompletedOnboarding`                                                                                                                                                                                                                               | no way to run setup again                                                                                           |
| Device history                        | `DB_KEYS.duaRecents` (new in the working tree on 2026-11-23, `deviceLocal`), search history (`lib/search-history.ts`)                                                                                                                                  | nowhere; there's no way to clear either                                                                             |
| Tours                                 | `toursSeen`; `toursStore.reset()` exists but nothing calls it                                                                                                                                                                                          | —                                                                                                                   |

**Duplicates and wrong placement:**

- The notification master switch is written from 4 places (Settings, the inbox "Enable" button, `permission-banner.tsx`, onboarding), each with its own permission and reschedule handling.
- Two different screens are titled "Notifications": the inbox and the settings screen.
- Prayer tuning is linked from the hub and from `/location`, and its Back always goes to `/location`.
- **Bedtime** sits on the hub, but it only drives the `beforeSleep` reminder, which is inside Notifications. **Reminder timing** is hidden inside the Adhan card. **Revision reminder** is in Qur'an practice, not Notifications.
- The three "Save … locally" toggles are on the hub, but storage management is on the separate Offline data screen. "Reset app data" is in Profile.
- Time format, default calendar and weather are each a **full screen for one or two choices**.
- Practice `defaultMode`, `autoAdvance`, `showTranslation`, `showTransliteration` and `showTajweedColors` can be changed both in Settings and in the session toolbar. That's fine as a shortcut, but today it's two separate implementations.
- Translation and transliteration visibility lives in **4 independent stores**: Qur'an reader, practice, hadith, and dua/zikr. **D13 merges them into one app-wide setting (§4.5.4).**

**Bugs found while auditing:**

| #   | Bug                                                                                                                                                                                                                                                                                | Fix in this work                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | The **"Save Qur'an translations locally" toggle does nothing**. No code reads `cacheQuranEditionsLocally`; `api/quran-remote.ts`, `quran-tafsir.ts`, `quran-tajweed.ts` and `quran-words.ts` always persist. `cacheHadithLocally` works (`api/hadith-remote.ts:225`).              | Read the flag in all four like `hadith-remote.ts` does, with a test for each.                                                                                                                                                                                                                                                                                                                                                                  |
| B2  | The **adhan style choice never reaches native notifications**. `build-reminders.ts:110` always uses `adhan.mp3`; `adhanStyleId` only affects the preview and the web bridge.                                                                                                       | Register one notification sound per style (the `sounds` array in `app.json`, plus an Android channel per sound), all ≤ 30 s for iOS (D13). Each style's notification clip is cut from that style's existing source audio and credited like it. Android channels can't change sound after creation, so a style change recreates the channel (`adhan-<styleId>`) and reschedules. A test asserts every `ADHAN_STYLES` id has a registered sound. |
| B3  | The **`sunrise` masjid offset** is allowed by the type but has no control (`prayer-tuning.tsx` lists only the obligatory prayers). Sunrise drives the end of Fajr, Ishraq and Duha.                                                                                                | Add a Sunrise stepper.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| B4  | **Device-specific values sync to every device**: `hapticsEnabled`, the three cache toggles, `audioVolume`, `preciseAdhan` (an Android permission state), `liveActivityEnabled`, `avatarUri` (a local gallery path) and `ttsVoiceByLang` (voice ids differ per device).             | Move them to device preferences (§4.5.4).                                                                                                                                                                                                                                                                                                                                                                                                      |
| B5  | Dead fields: `UserPreferences.libraryMenuOrder`, `fontPrefs.global`, `.titles`, `.transliteration`, `.translation.family`, `.color`, `QuranPrefs.script`. They are stored but never read. The Fonts screen's "Translation & transliteration" row only writes the translation size. | Remove the `fontPrefs` and `script` fields (keep reading tolerant of old blobs), following the upgrade policy of removing deprecated code. Transliteration keeps following translation size − 1, and the label says so. **`libraryMenuOrder` is implemented instead (D13):** a "Library order" editor under Appearance & home, and the Library tab reads it (§4.5.4).                                                                          |
| B6  | The theme mirror in AsyncStorage (`@munib-tracker/color-mode`, `accent`, `custom-accent`) isn't cleared by `lib/wipe-local-data.ts`.                                                                                                                                               | Clear it on wipe.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| B7  | The deep-link allowlist (`lib/app-links.ts`) is missing `time-format`, `default-calendar`, `bedtime`, `weather`, `import` and `my-reports`.                                                                                                                                        | Generate the allowlist from the registry.                                                                                                                                                                                                                                                                                                                                                                                                      |

**UI inconsistency:**

- Single-choice controls are built 6+ ways: three copies of a custom `Choices` radio list, radio cards, `SegmentedControl`, `PracticePills`, a 3-button group, and a sheet.
- Steppers are built 3 different ways.
- Several rows are hand-rolled instead of using `SettingsRow`. `SettingsRow` always draws a chevron, even for actions such as the adhan preview.
- Some hub rows show the current value and others don't.
- Back fallbacks are mixed: `"/"`, `"/settings"`, `/location`, `/settings/notifications`.
- Four separate 1024 px "two-column" constants exist, and only about half the screens use `useSettingsFormMaxWidth`.
- Gating is uneven: some routes show a TV or web EmptyState while the hub hides the row; bedtime has no TV guard.

#### 4.5.2 Design principles

1. **Each setting is declared once** in a registry. The hub, group screens, search, deep links, reset, TV and web filtering and the coverage test all read that one declaration.
2. **In-context controls are shortcuts, not separate copies.** They call `useSetting(id)` and get the same value, setter, validation and side effects, such as `rescheduleAll`.
3. **Groups follow what the user is trying to do**, ordered by how often it's done. Every group can be reached in **one tap** and every setting in **two taps**, or straight away from search.
4. **Every row shows its current value.** Toggles, short choices and steppers sit inline; only rich editors such as the accent picker, quick-action order or practice listener get their own screen.
5. **Hide what can't work on this device** instead of opening empty states. Settings that only apply to this device carry a small **"This device"** badge.
6. **Changing a setting never surprises the user.** A setting that affects reminders reschedules them. A destructive action confirms first. "Reset settings" (keeps data) is a different action from "Reset app data" (wipes data).

#### 4.5.3 New information architecture

Hub (`app/(tabs)/settings.tsx`), top to bottom:

1. **Search bar**, for settings only (§4.5.6).
2. **Account card:** name, avatar, sign-in or sync status (last synced, "Sync now"). → `/profile`.
3. **"Finish setting up" card** that only appears while something important is unset, with one line per item and each item deep-linking to it:
   - location still the Makkah default
   - notifications off
   - madhhab undecided (NF-3.0a)
   - language not yet confirmed
   - calculation method never reviewed

   It can be dismissed, and it is the same checklist that onboarding uses.
4. **Groups** in five clusters. Each group row shows an icon, a title and a one-line summary of its current values (for example "Muslim World League · Hanafi Asr · Lahore").

| Cluster                 | Group (route)                                           | Contents: existing today, plus _planned NF-3.x_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Daily worship**       | **Prayer times & location** `/settings/prayer-times`    | Location (current place, use GPS, search; moved from `/location`, which stays as an alias); calculation method; Asr method; high-latitude rule; masjid offsets (now including Sunrise, B3). _Home masjid and private iqamah times (3.11); timetable OCR import (3.12)._                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|                         | **Fiqh & madhhab** `/settings/fiqh`                     | _My madhhab, advanced overrides, custom values, "where this applies" (NF-3.0a §4.1.5); rawatib 10/12 and extras (3.1); voluntary fasting defaults (3.2)._ The Asr-method offer links here from Prayer times.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|                         | **Reminders & notifications** `/settings/notifications` | Permission status and master switch; then sections: **Salah & adhan** (per-prayer alerts, adhan style and preview, play adhan, precise adhan, **reminder timing per prayer, promoted from inside the Adhan card**, Live Activity); **Zikr** (morning, evening, before sleep **with Bedtime moved here**, before and after prayer); **Qur'an** (revision reminder, the same field as Qur'an practice, now shown here too; _khatm_); **Qaza**; **Content** (daily content, Friday, white days, achievements); **App feedback**; "Upcoming reminders" preview. _Fasting, takbir, habits, muhasabah, family ties, debts, iqamah, coach, focus lock entry (3.2–3.14)._ Screen title becomes **"Reminders & notifications"** so it no longer clashes with the inbox. |
| **Reading & listening** | **Qur'an** `/settings/quran`                            | **Reading:** layout (ayah, page, mushaf), primary and second translation, tafsir, word-by-word, tajweed colours (translation and transliteration visibility are app-wide, under Text & fonts). **Recitation:** reciter, translation audio, default repeat. **Practice** → `/settings/quran-practice` (kept, regrouped, and now also showing `practiceView` and `rangePreset`). **Pronunciation (Quran Lab)** card. _Ayah notes export (3.21), tajweed coaching (3.15), pronunciation assessment sensitivity and calibration (3.24)._                                                                                                                                                                                                                           |
|                         | **Hadith, duas & adhkar** `/settings/content`           | **Hadith:** show Arabic, narrator, grade, isnad, sharh (translation is the app-wide setting). _Hadith audio: preferred recording language, auto-play next (3.23, recordings only). Tasbeeh counter: design, sound, haptics (3.19); hands-free counting (3.20)._                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|                         | **Text & fonts** `/settings/fonts`                      | **Show translation** and **show transliteration**: one app-wide pair for the Qur'an, practice, hadith, duas, adhkar, duroods and tasbeeh (D13); every reader's toolbar chip is a shortcut to it. Arabic typeface; Arabic and translation size; **new "Per-screen text sizes"** list of all 13 `readingOverrides` surfaces, each with its value and a reset, plus **"Reset all to default"**; preview.                                                                                                                                                                                                                                                                                                                                                          |
|                         | **Audio & voice** `/settings/audio`                     | Default playback speed; volume (_This device_); **device voice per language** (`ttsVoiceByLang`, moved to device prefs, B4) with a "Test voice" button; save audio for offline (_This device_).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Personalise**         | **Appearance & home** `/settings/appearance`            | Theme; accent and custom colour; home cards; quick actions order; **library order** (new, D13); weather effects.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|                         | **Language & region** `/settings/language`              | App language; translation language; **time format**, **default calendar** and **temperature unit** as inline segmented rows (their full screens become redirects); **Hijri date adjustment** (new, D14, §4.5.11); **new default currency and number format**, which seed zakat, fidyah and sadaqah (each calculator can still override).                                                                                                                                                                                                                                                                                                                                                                                                                       |
|                         | **Accessibility & feedback** `/settings/accessibility`  | Haptics (_This device_); shortcut to text sizes; an information row explaining that motion and contrast follow the OS setting; screen-reader tips. _Tasbeeh announcement frequency (3.20)._                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Privacy & data**      | **Privacy & security** `/settings/privacy`              | App lock (PIN, change PIN, lock timeout, **new biometric unlock toggle**, which is automatic today); microphone permission status; Quran Lab sharing (link); **clear recent duas and searches** (device history, _This device_); my content reports. _Lock private journals and vault passphrase or recovery code (§4.2); kids profile controls (3.16)._                                                                                                                                                                                                                                                                                                                                                                                                       |
|                         | **Data & storage** `/settings/data`                     | Cloud sync status and "Sync now"; **Offline data** (cache sizes **plus the three "save locally" toggles moved in from the hub**, B1 fixed); Qur'an listener models; backup and restore; import prayer history; **Reset settings to defaults** (keeps data); **Reset app data** (moved here from Profile and removed there, D13). Delete account stays in Account.                                                                                                                                                                                                                                                                                                                                                                                              |
|                         | **Devices & integrations** `/settings/devices`          | Siri / Google Assistant shortcuts; Live Activities (link to its toggle); widgets, Watch and Wear information; TV pairing; _focus lock (3.13)_; web only: get the native app, install as PWA.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Help**                | **Help & about** `/settings/about`                      | Take the app tour; **reset tour hints** (wires `toursStore.reset()`); **run setup again** (onboarding, without losing data); rate the app; about; credits & data sources; privacy policy; terms.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

**Wide screens and TV:**

- On wide web and tablets (the existing list-detail tier), the hub becomes **master–detail**: groups on the left, the selected group on the right, and search across both. This removes the four separate two-column breakpoints.
- On TV the hub shows only groups that have something TV-relevant: prayer times, Qur'an, content, fonts, appearance, language, data (backup is hidden), devices (pairing) and about. Every control is D-pad operable, and no route a TV user can reach shows an empty state.

#### 4.5.4 Settings registry and data model

**Module** `apps/app/src/lib/settings/`:

```ts
// registry.ts
export type SettingsGroupId =
  | "prayer-times"
  | "fiqh"
  | "notifications"
  | "quran"
  | "content"
  | "fonts"
  | "audio"
  | "appearance"
  | "language"
  | "accessibility"
  | "privacy"
  | "data"
  | "devices"
  | "about";

export type SettingScope = "account" | "device"; // account = synced; device = DB_KEYS.devicePreferences, never synced

export type SettingControl<V> =
  | { kind: "toggle" }
  | {
      kind: "choice";
      options: ReadonlyArray<{ value: V; labelKey: string; descriptionKey?: string }>;
      presentation: "segmented" | "list" | "sheet";
    }
  | {
      kind: "stepper";
      min: number;
      max: number;
      step: number;
      format: (v: number, t: TFunction) => string;
    }
  | { kind: "time" } // HH:mm, respects timeFormat
  | { kind: "link"; href: Href } // rich editor on its own screen
  | { kind: "action"; run: () => Promise<void>; destructive?: boolean; confirmKey?: string }
  | { kind: "custom"; Component: React.ComponentType<{ settingId: SettingId }> }; // accent picker, quick actions

export interface SettingDef<V = unknown> {
  id: SettingId; // stable, e.g. "quran.reader.layout"; used for search, deep links, focus
  group: SettingsGroupId;
  section: string; // i18n key of the section header inside the group
  titleKey: string;
  subtitleKey?: string;
  keywordsKey?: string; // per-locale synonyms for search ("adhan, azan, athan")
  scope: SettingScope;
  control: SettingControl<V>;
  read: (s: SettingsSnapshot) => V; // pure selector over all pref stores
  write: (v: V) => Promise<void>; // the ONLY write path; wraps the store action
  defaultValue: V | ((s: SettingsSnapshot) => V);
  available?: (ctx: PlatformCtx) => boolean; // isTV, Platform.OS, isPracticeAvailable(), feature flags
  enabledWhen?: (s: SettingsSnapshot) => boolean; // e.g. adhan toggles need master + prayer on
  summary?: (v: V, t: TFunction) => string; // value shown on the row and in the group summary
  sideEffects?: Array<"reschedule-reminders" | "reload-locale" | "refresh-prayer-times">;
  shortcuts?: string[]; // routes with an in-context control (documentation + tests)
}
```

- `groups.ts`: group order, cluster, icon, title and the `summary` builder for each group row.
- `use-setting.ts`: `useSetting(id)` → `{ value, setValue, def, enabled }`. It subscribes with a selector, so a row re-renders only when its own value changes. **Every in-context control migrates to it**: reader toolbars, `PlaybackSettingsSheet`, the mini-player, `ReadingFontControls`, hadith and scripture filters, the practice toolbar, calculators' currency (through the default), the permission banner and the inbox "Enable" button.
- `actions.ts`: shared actions such as `enableNotifications()` (asks permission, sets master, registers the push token, reschedules), which all four current entry points will call.

**Device preferences (B4):**

- New `DB_KEYS.devicePreferences`, classified **`deviceLocal`** in `KEY_PERSISTENCE`: never synced, never backed up (device-specific, matching the existing class), wiped on reset. The other new keys follow the same rule:
  - `quranRootIndex` (NF-3.22) → `cache`
  - `tasbeehVoiceCalibration` and `quranPronunciationCalibration` → `deviceLocal`
  - `quranNotes` (NF-3.21) and the `hijriAdjustment`-bearing preferences → `userData`

  The fields:

  ```ts
  interface DevicePreferences {
    hapticsEnabled: boolean;
    cacheAudioLocally: boolean;
    cacheQuranEditionsLocally: boolean;
    cacheHadithLocally: boolean;
    audioVolume: number;
    preciseAdhan?: boolean;
    liveActivityEnabled?: boolean;
    avatarUri?: string;
    ttsVoiceByLang: Record<string, string>;
  }
  ```
- **Migration:** on first load, copy each field from `UserPreferences` or `QuranPrefs` when the device value is unset. Readers use the device value first, then the legacy one. The legacy fields are removed from the types one release later.

**New account preferences** (`UserPreferences`, optional, so old clients are fine; update the API preferences DTO and run `pnpm generate:api`):

- `defaultCurrency?: string` and `defaultNumberFormat?: NumberFormatId`. These seed the zakat, fidyah and sadaqah drafts the first time they open; each calculator keeps its own override.
- `audioSpeed` stays an account preference.
- **`readingDisplay: { showTranslation: boolean; showTransliteration: boolean }`** (D13). It replaces `quranPrefs.showTranslation/showTransliteration`, `companion.showTranslation/showTransliteration` (and `readingTogglesSeeded`), `hadithPrefs.showTranslation`, and the whole `readingTextVisibility` store.
  - Migration: seed from `quranPrefs` (the most used surface), then fall back to `readingTextVisibility`.
  - Old fields are read once and no longer written. The `reading_text_visibility` sync entity stops being written; the server keeps accepting it for one release, then it is removed from `SYNC_ENTITIES` with `pnpm generate:api`.
- **`libraryMenuOrder`** (D13): the Library tab (`(tabs)/library.tsx` + `lib/library-menu.ts`) renders sections in this order. Unknown ids are dropped, and sections added in later releases are appended in their default position. The editor reuses the quick-actions list editor, generalised as `OrderedListEditor` (up/down, D-pad on TV, a drag handle on wide screens). It is reset with the Appearance & home section reset.
- **`hijriAdjustment`** (D14), see §4.5.11.

**Coverage test** (`registry.coverage.test.ts`): this is what keeps "all settings in one place" true over time.

- It enumerates every key of `DEFAULT_USER_PREFERENCES` (including `notificationPrefs.*`, `weatherPrefs.*` and `fontPrefs.*`), the `QuranPrefs`, `HadithPrefs`, `CompanionPrefs`, `readingTextVisibility` and `DevicePreferences` defaults, and the settings fields of `StoredLocation`.
- Each key must either be registered or appear in `INTERNAL_FIELDS`, which lists the non-settings fields (`updatedAt`, `salahTrackingSession`, `coachDismissed`, `lastPassage`, `schemaVersion` and so on), each with a one-line reason.
- **Adding a preference without giving it a place in Settings fails CI.**

**Single-write test:** a source-scan unit test fails if `usePreferencesActions().update`, `useQuranActions().updatePrefs`, `useHadithActions().updatePrefs`, `useCompanionPrefsActions().update`, `readingTextVisibilityStore` setters or `useLocationActions` setters are called from `app/**` or `components/**`. They may only be called from `lib/settings/**`, or from an allowlist of data writers such as favourites, `activeExcusedReason` and onboarding completion.

#### 4.5.5 Shared UI primitives (`components/settings/`)

| Primitive                                                                                                                               | Replaces                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `SettingsScreen` (ScreenLayout + form max width + Back to the parent group + availability gate + master–detail awareness)               | the per-screen width, back and empty-state code                                          |
| `SettingsSection` (header, optional footer note, `SettingsRowGroup`)                                                                    | ad-hoc Card + SectionHeader stacks                                                       |
| `SettingRow` (renders any `SettingDef` by `control.kind`: toggle, segmented, choice list or sheet, stepper, time, link, action, custom) | `SettingsRow`/`ToggleRow` used by hand                                                   |
| `ChoiceList`, `SegmentedRow`, `StepperRow`, `TimeRow`                                                                                   | the 3 copied `Choices` lists, radio cards, the 3-button group, and the 3 custom steppers |
| `ActionRow` (no chevron), `DangerRow` (with confirm)                                                                                    | adhan preview row, hand-rolled app-lock and profile danger rows                          |
| `ThisDeviceBadge`, `ResetSectionButton`                                                                                                 | —                                                                                        |

- **Reuse the new shared primitives** (added in the working tree on 2026-11-23):
  - `components/ui/search-field.tsx` (`SearchField`) for the settings search bar
  - `components/ui/browse-tile.tsx` (`BrowseTile`) with `use-category-hue.ts` and the `CategoryHues` tokens in `constants/theme.ts` (dawn, sky, rose, plus the user's accent) for the five cluster tiles on wide screens and TV, so Settings matches the redesigned Duas and Zikr hubs
- One breakpoint source: `settings-layout.ts` replaces `SETTINGS_TWO_COLUMN_MIN_WIDTH`, `SETTINGS_COLUMNS_MIN_WIDTH`, `APPEARANCE_TWO_COLUMN_MIN_WIDTH` and `PROFILE_TWO_COLUMN_MIN_WIDTH`.
- Every primitive uses `useTheme()`, works with the RTL chevron, supports TV focus, respects reduced motion and has accessibility labels that read out the current value ("Time format, 24-hour").

#### 4.5.6 Settings search and deep links

- **Index:** `createFuzzyIndex` from `lib/search.ts` over each available setting's title, subtitle, section, group and `keywordsKey`. It searches the current locale **plus English**, so "azan" finds the adhan settings in every language. Follow `.agents/skills/fuse-js/SKILL.md`.
- **Results** show the setting, its group path ("Reminders & notifications › Salah & adhan") and the current value. Toggles can be switched straight from the result.
- **Universal `/search`** gets a "Settings" group from the same index.
- **Deep links:** `/settings/<group>?focus=<settingId>` scrolls to the row and pulses a highlight (reuse `useScrollToActive`). The app-links allowlist and the `appLink.setting(id)` builders are generated from the registry (fixes B7).
- **Old routes keep working:** `/settings/time-format`, `/settings/default-calendar`, `/settings/weather`, `/settings/bedtime`, `/settings/reminder-offsets`, `/settings/prayer-tuning` and `/location` redirect to the right group with `focus`.
- **Shortcuts back to Settings:** each in-context options sheet (reader, hadith, mini-player, practice toolbar) gets a "More in Settings" link to its group.

#### 4.5.7 Reset behaviour

- **Per section:** "Reset to defaults", using each setting's `defaultValue`.
- **Global:** Data & storage → "Reset settings to defaults". It resets every registered setting and nothing else; logs, bookmarks, notes and progress are kept. A confirm dialog lists what changes.
- **Text sizes:** "Reset all text sizes" clears every `readingOverrides` surface.
- **Tours:** "Reset tour hints" calls `toursStore.reset()`. "Run setup again" re-opens onboarding with the current values pre-filled.

#### 4.5.8 How planned features register

Every NF-3.x feature adds its settings to the registry in its own PR (§10 checklist). Where a feature section above names a settings path, **the group in this table is the one to use**:

| Feature                                                                              | Group › section                                                                                                   |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| NF-3.0a My madhhab                                                                   | Fiqh & madhhab                                                                                                    |
| §4.2 Vault lock, passphrase and recovery code                                        | Privacy & security › Private journals                                                                             |
| NF-3.1 Rawatib · NF-3.2 Voluntary fasting · NF-3.3 Dhul-Hijjah                       | Fiqh & madhhab (defaults) + Reminders & notifications (alerts)                                                    |
| NF-3.5 Habits · NF-3.6 Muhasabah · NF-3.7 Family ties · NF-3.8 Debts · NF-3.14 Coach | Reminders & notifications › Personal (the data screens stay in their features)                                    |
| NF-3.19 Tasbeeh designs · NF-3.20 Hands-free                                         | Hadith, duas & adhkar › Tasbeeh counter (the planned `settings/tasbeeh.tsx` becomes this section's detail screen) |
| NF-3.11 Home masjid & iqamah · NF-3.12 Timetable OCR                                 | Prayer times & location › Home masjid                                                                             |
| NF-3.13 Focus lock                                                                   | Devices & integrations › Salah focus (its alerts appear under Reminders)                                          |
| NF-3.15 · NF-3.24 Tajweed coaching & pronunciation                                   | Qur'an › Practice                                                                                                 |
| NF-3.21 Ayah notes                                                                   | Qur'an › Notes (export, show note markers)                                                                        |
| NF-3.23 Hadith audio                                                                 | Hadith, duas & adhkar › Hadith audio (recordings only, D19)                                                       |
| NF-3.16–3.18 Circles, kids, partner, group khatm                                     | a new **Family & circles** group in the Personalise cluster, added in Phase 5                                     |

#### 4.5.9 Delivery steps (each step ships on its own, behind no flag)

1. **Registry and primitives:** `lib/settings/*`, the new `components/settings/*` primitives, and the coverage test with today's fields (initially all registered, or listed in `INTERNAL_FIELDS`).
2. **New hub and group screens:** move existing screens into groups, add redirects for old routes, add search, deep links and focus. Bedtime, reminder timing, location, offline toggles and reset app data move to their new homes.
3. **Shortcuts on `useSetting`:** reader, hadith, scripture filters, mini-player, playback sheet, practice toolbar, font controls, notification entry points. Enable the single-write test.
4. **Fixes and data:** B1–B7, device preferences with migration, the merged `readingDisplay` setting, the library order editor, the Hijri adjustment (§4.5.11), default currency, biometric toggle, sunrise offset, tour reset, run setup again.
5. **i18n and QA:** all 24 locales including search keywords, RTL, TV (Apple TV and Android TV), web master–detail, and screen-reader pass.

#### 4.5.10 Tests and acceptance

**Tests:**

- registry unit tests: every def's `read`/`write` round-trips through its store, `available` per platform, `enabledWhen`, `summary`
- the coverage and single-write tests (§4.5.4)
- `use-setting` re-renders only on its own value; side effects fire (reschedule on reminder settings, locale reload)
- device-prefs migration (legacy → device, and never synced: assert it isn't in `sync/records.ts` output)
- search: title, synonym, English fallback in a non-English locale, toggling from a result
- redirects for every old route; the deep-link allowlist equals the registry routes
- B1 (Qur'an cache flag honoured in all four APIs), B2 (reminder sound per style), B6 (wipe clears the theme mirror)
- screen tests for the hub, a group screen, master–detail, and TV focus order

**Acceptance criteria:**

- Every user-facing persisted option is in Settings, **at most 2 taps from the hub**, and findable by search in every locale.
- No setting has two different write paths; in-context controls and Settings always show the same value.
- No reachable settings route shows an empty state on TV or web.
- Old routes and deep links still open the right place.
- Reminders reschedule after every reminder-affecting change; there are no regressions in the reminder budget (§11).
- Device-only settings never sync. "Reset settings" never deletes user data.
- 24 locales, RTL, dark and light, reduced motion, screen-reader labels with values.

**Risks:**

- **Users can't find moved items.** Mitigation: redirects, a one-time "Settings has a new layout, search for anything" tip on the hub, and search.
- **A big diff across many screens.** Mitigation: the five independent steps above, each with its own tests.
- **Per-row subscriptions on long screens.** Mitigation: selector-based `useSetting`, and memoised rows (as `ToggleRow` is today).

#### 4.5.11 Hijri date adjustment (D14)

**Problem.** Dates come from `lib/hijri.ts`, the single source of truth (Ramadan, calendar, converter, Islamic events, white days, seasonal themes, tahajjud, qaza history, the moon sheet, widgets through `buildWidgetSnapshot.ts`). `hijriObserverFor()` in `hijri-authority.ts` picks the method: Umm al-Qura for Saudi Arabia and the regions that follow it, Yallop crescent visibility at the stored location everywhere else (`hijri-sighting.ts`), and the tabular calendar outside the table range. A user's local committee or masjid can still announce a month a day earlier or later than any prediction. Today there's no way to correct this.

**Why not a simple "+N days".** Shifting every date by N days keeps month lengths, but it is wrong whenever only one month differs locally, which is the usual case. Adding days to a single month by hand would also create invalid 28- or 31-day months. An Islamic month is **always 29 or 30 days**. The design keeps that invariant by construction.

**Model** (`UserPreferences.hijriAdjustment`, synced, optional):

```ts
interface HijriAdjustment {
  /** Whole-calendar shift in days, −2…+2. +1 = "my months start one day later than predicted". Default 0. */
  offsetDays: -2 | -1 | 0 | 1 | 2;
  /** Per-month announced starts: key "1448-09" → Gregorian ISO date of day 1 in the user's area. */
  monthStarts?: Record<`${number}-${string}`, string>;
  /** Method fingerprint when the corrections were made (observer/Umm al-Qura + rounded lat/lon); used to warn after a move. */
  basis?: string;
  updatedAt: string;
}
```

**Algorithm** (`lib/hijri-adjustment.ts`, pure, wrapping the existing `gregorianToHijri`, `hijriToGregorian` and `hijriMonthLength` inside `hijri.ts`, so no consumer changes):

1. **Base start of a month**, `B(y, m)` = the JDN of day 1 from the current method (sighting, Umm al-Qura or tabular), exactly as today.
2. **Global offset:** `S₀(y, m) = B(y, m) + offsetDays`. A uniform shift keeps every base month length, so lengths stay 29 or 30.
3. **Per-month corrections, applied in order through time** from the earliest corrected month:
   - A corrected month uses its announced start `A`, which is accepted only if `|A − S₀(y, m)| ≤ 2`.
   - For every month, the effective start is clamped against the previous effective start `P`: `S(y, m) = clamp(S₀(y, m) or A, P + 29, P + 30)`. Each month is therefore 29 or 30 days (the classical rule that a month can't exceed 30 days and the crescent can't be sought before the 29th).
   - When a correction or clamp leaves a month `e` days off `S₀`, later months drift back toward `S₀`. The gap closes by one day each time the base month has the "opposite" length (a 30-day base month when the start is late, a 29-day one when it is early), and is unchanged otherwise. It always converges, usually within 2–4 months, and the UI shows the affected months.
4. **Conversions** use the effective starts:
   - `gregorianToHijri(jdn)` finds the month whose `[S(y, m), S(next))` range holds `jdn`.
   - `hijriToGregorian(y, m, d) = S(y, m) + d − 1`, with `d` limited to the effective month length.
   - `hijriMonthLength(y, m) = S(next) − S(y, m)`.
5. **The prayer-day anchor is unchanged** (`prayerDayAnchor`, the existing Maghrib/day boundary). The adjustment changes which month a civil day belongs to, not when the day starts.
6. **Performance:** the effective starts are computed lazily for a window around the requested date and memoised. The cache is cleared when the adjustment, observer or location changes, next to `resetSightingCacheForTests`.

**UI** (Settings › Language & region › Hijri date):

- "Hijri date adjustment": a −2…+2 stepper with a live preview line ("Today: 21 Jumada al-Ula 1448").
- "**This month started on…**": opens a sheet with the predicted day 1 and the 2 days either side (only valid choices are offered), a note on where the prediction comes from ("Umm al-Qura" or "Crescent visibility at Lahore"), and "Clear this month's correction".
- The list of corrections made, each one removable.
- The Ramadan screen and the calendar month header get a small "Adjust" link to the same sheet, so the user can correct it at the moment of an announcement.
- **Moving location** (when `basis` no longer matches): a one-time card says "Your Hijri corrections were made for <old place>. Keep or clear?" They are never cleared silently.

**Side effects:**

- `sideEffects: ["reschedule-reminders"]`: white days, Ramadan, Friday and seasonal reminders reschedule.
- Widgets and live surfaces refresh their snapshot.
- Fasting and other day logs are stored by Gregorian date, so nothing is rewritten; only Hijri labels and Hijri-derived schedules move.

**Copy (D11 proof log):**

- The basis is that months begin with the sighting of the crescent and are completed to 30 days when it isn't seen (Bukhari 1909; Muslim 1081; verify the numbers against the corpus).
- The copy stays neutral between global and local sighting ("Follow the announcement your community follows"), and never says one method is the correct one.

**Verification** (unit tests, `hijri-adjustment.test.ts`):

- **Zero adjustment is identical to today**: for every day from 1300 to 1600 AH, under all three methods (Umm al-Qura, the sighting observer at fixture coordinates, tabular), the output equals the current `hijri.ts` output.
- **Invariant sweep:** random property tests (seeded) over offsets and up to 24 random corrections: every month is 29 or 30 days, `g→h→g` and `h→g→h` round-trip exactly, days are contiguous with no gaps or overlaps, and `offsetDays` alone shifts every date uniformly.
- **Clamp behaviour:** a correction that would make the previous month 28 or 31 days is never offered. Correcting a 29-day-predicted month one day late makes the previous month 30 days long. For any `|e| ≤ 2`, later months converge back to `S₀`, which the test asserts over the whole 1300–1600 AH table (expected within 8 months).
- **Real-world fixture:** Ramadan 1445 started on 11 March 2024 in Saudi Arabia (Umm al-Qura) and on 12 March 2024 in Pakistan (Ruet-e-Hilal). With an Umm al-Qura base and a 1445-09 correction to 2024-03-12, 12 March is 1 Ramadan and Sha'ban 1445 becomes one day longer than its Umm al-Qura length (the test reads that length from the table rather than hard-coding it; if the table already has Sha'ban at 30 days, the test asserts the correction is refused, and the sheet offers correcting Sha'ban first). Record the announcements behind this in the proof log, and add more announced months there as they are verified.
- Consumers: Ramadan, white days (13–15 follow the correction), Islamic events and the widget snapshot with a correction applied.

---

## 5. Phase 1 — Daily practice

### NF-3.1 Sunnah Rawatib (the 12 / 10 rak'at)

**Goal.** Track the confirmed sunnah prayers attached to the fard, inside the existing tracker, with minimal taps.

**Islamic basis.**

- Muslim 728: 12 rak'at daily earn a house in Jannah. Tirmidhi 415 gives the breakdown.
- Bukhari 1180: 10 rak'at (Ibn Umar).
- Bukhari 1182: 4 before Dhuhr.
- Muslim 725: the 2 before Fajr are better than the world and what it contains.
- Non-mu'akkadah extras:
  - 4 before Asr (Abu Dawud 1271 / Tirmidhi 430)
  - 2 before Maghrib (Bukhari 1183)
  - a prayer between every adhan and iqamah (Bukhari 624)

**Data model** (`packages/shared/src/types/prayer.ts`, `constants/index.ts`):

```ts
export type RawatibPrayer =
  | "fajr_before"      // 2 — mu'akkadah (all)
  | "dhuhr_before"     // 2 or 4 — preset-dependent
  | "dhuhr_after"      // 2 — mu'akkadah
  | "maghrib_after"    // 2 — mu'akkadah
  | "isha_after";      // 2 — mu'akkadah
export type RawatibExtraPrayer =
  | "asr_before"       // 4 (or 2)
  | "maghrib_before"   // 2
  | "isha_before"      // 2 or 4
  | "dhuhr_after_extra"; // +2 (making 4 after Dhuhr)

export type SunnahPrayer = /* existing */ | RawatibPrayer | RawatibExtraPrayer;

export const RAWATIB_PRAYERS = [...] as const satisfies readonly RawatibPrayer[];
export const RAWATIB_PARENT: Record<RawatibPrayer | RawatibExtraPrayer, ObligatoryPrayer> = {
  fajr_before: "fajr", dhuhr_before: "dhuhr", dhuhr_after: "dhuhr", /* … */
};

interface PrayerLog {
  // …existing
  /** Rak'at prayed for a sunnah with a variable count (e.g. dhuhr_before 2|4). */
  rakahs?: number;
  /** Sunnah prayed after its usual time (e.g. Fajr sunnah after the fard / after sunrise). */
  late?: boolean;
}
```

**Preferences** (in `UserPreferences`):

```ts
rawatib?: {
  enabled: boolean;              // default true once madhhab chosen; else asked in tracker card
  preset: 10 | 12;               // default from MADHHAB_RULES[m].rawatib.defaultPreset (D8)
  extras: RawatibExtraPrayer[];  // default []
};
```

**Logic and conditions:**

- Rawatib rows **never accrue qaza** and never prompt for it. They must not be in `QAZA_PRAYER_SET` and must not count toward `OBLIGATORY_PRAYER_SET`, streaks or the perfect-day count.
- Valid statuses are only `completed` and `pending`. `missed` is not offered; "not prayed" is just the absence of a log.
- **Visibility windows** (computed from today's `prayer-times.ts` times):

  | Row           | Visible from                        | Until                       | Notes                                                                                                                                                                                                              |
  | ------------- | ----------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | `fajr_before` | Fajr begins                         | Dhuhr begins                | After sunrise it is logged with `late: true`. Making it up after sunrise is valid per Tirmidhi 423. Schools differ on whether it is made up independently of the fard; when `madhhab === "hanafi"`, show the note. |
  | `*_before`    | Its fard's time begins              | The next fard's time begins |                                                                                                                                                                                                                    |
  | `*_after`     | The parent fard is marked completed | The next fard's time begins | Can be logged before the fard is marked, with a soft hint.                                                                                                                                                         |

- **Preset 12:** `dhuhr_before.rakahs` defaults to 4. **Preset 10:** it defaults to 2. The user can change either per log.
- **Excused periods:**
  - `hayd` hides all rawatib rows.
  - `sick` keeps them visible, with nothing expected.
  - `travel`: when `rules.travelRawatib === "optional_except_fajr"`, show only `fajr_before` (plus Witr, which already exists). The rest are collapsed under "Optional while travelling".
- **Sync:** reuses the existing `prayer_logs` record sync with no new entity. The API `prayerId` validator (`packages/shared/src/validators` and the API DTO) must accept the new ids. Run `pnpm generate:api`.
- **Statistics:** `/statistics` was redesigned in the working tree on 2026-11-23 (`lib/statistics.ts`, `components/statistics/salah-rate-list.tsx`, `status-distribution.tsx`, `today-salah-strip.tsx`). Rawatib extend those pieces instead of adding a parallel screen. `indexPrayerDays`, `summarizePeriod` and `salahBreakdown` must keep **fard rates rawatib-free** (regression test). The new section reuses `SalahRateList` for per-rawatib rates. A new "Rawatib" section in `/statistics`:
  - days with all of today's preset complete
  - the 30-day consistency grid
  - the count toward "12 a day" (no house metaphor in numbers; just the hadith card)

**UI:**

- Tracker: under each fard row, a compact chip row (`[2 before] [2 after]`). Tapping a chip toggles it.
- For `dhuhr_before`, long-press opens a sheet for 2 or 4.
- A "Rawatib" header card shows the evidence (Muslim 728) and a settings link.
- Home: an optional module `rawatib-progress` (registered in `hiddenHomeModules`).
- Widgets: deferred to v2.

**Notifications:** none by default. An optional "after-fard nudge" (+10 min after marking a fard, only if its `*_after` is unlogged) is off by default and controlled by `notificationPrefs.sunnahPrayer`, which already exists.

**Tests:**

- window computation for each row across DST and high-latitude rule cases
- excused filtering
- preset defaults per madhhab
- qaza, `computeStreak` and `longestStreak` (the achievements `bestStreak`) ignore the rawatib ids (regression test)
- validator accepts the new ids

**Acceptance:**

- A Hanafi user sees 12 by default; a Hanbali user sees 10.
- Logging rawatib never changes qaza debt or the streak.
- A travel period shows only the Fajr sunnah.
- Logs sync between two devices.

---

### NF-3.2 Voluntary fasting tracker

**Goal.** Plan, remind and log recommended fasts, warn on prohibited days, and link to qaza roza.

**Islamic basis (recommended days):**

- Mondays and Thursdays (Tirmidhi 747; Muslim 1162)
- the White Days, which already exist (NF-2.37)
- 6 days of Shawwal (Muslim 1164)
- Arafah for non-pilgrims (Muslim 1162)
- Tasu'a and Ashura (Muslim 1134, 1162)
- Muharram generally (Muslim 1163)
- most of Sha'ban (Bukhari 1969)
- the first 9 of Dhul-Hijjah (Abu Dawud 2437, grading differs; virtue of the ten: Bukhari 969)
- the fast of Dawud (Bukhari 1976)

**Prohibited or disliked days:**

- both Eids (Bukhari 1990; Muslim 1137)
- the days of Tashriq, 11–13 Dhul-Hijjah (Muslim 1141)
- Friday singled out on its own (Bukhari 1985; Muslim 1144)
- fasting a day or two before Ramadan, unless it is a habit (Bukhari 1914)
- the day of doubt, 30 Sha'ban
- Arafah for someone performing Hajj, which is disliked per the majority

**Data model:**

```ts
// packages/shared/src/types/fasting.ts (new)
export type VoluntaryFastKind =
  | "monday"
  | "thursday"
  | "white_day"
  | "shawwal_six"
  | "arafah"
  | "tasua"
  | "ashura"
  | "muharram"
  | "shaban"
  | "dhul_hijjah_nine"
  | "dawud"
  | "other";
export type FastDayRuling = "recommended" | "permitted" | "disliked" | "prohibited";

export interface VoluntaryFastEntry {
  status: "intended" | "fasted" | "broken";
  /** When true this day is a qaza (make-up) fast, decrementing roza debt. */
  asQaza?: boolean;
  note?: string;
  updatedAt: string;
}
export type VoluntaryFastingMap = Record<string /* YYYY-MM-DD */, VoluntaryFastEntry>;

export interface VoluntaryFastingPrefs {
  enabledKinds: VoluntaryFastKind[]; // default ["monday","thursday","white_day","shawwal_six","arafah","tasua","ashura"]
  dawudMode?: { startDate: string } | null;
  intentReminderTime: string; // "21:00" default; or "isha+60"
  suhoorAlarm: boolean; // default false
  isPilgrimThisYear?: boolean; // suppress Arafah recommendation
}
```

**Kinds are derived, not stored.** `classifyFastDay(date, tz, prefs, madhhab)` is a pure function in `packages/shared/src/utils/fasting-calendar.ts`. It returns:

```ts
{ kinds: VoluntaryFastKind[]; ruling: FastDayRuling; reasons: string[] /* i18n keys */ }
```

It uses `gregorianToHijri` from `apps/app/src/lib/hijri.ts`, injected so it stays testable.

Rules, applied in order (first match on `ruling` wins; `kinds` accumulate):

1. Hijri 10/1 or 12/10 → `prohibited` (Eid).
2. Hijri 12/11–13 → `prohibited` (Tashriq).
3. The day is in Ramadan → excluded (Ramadan has its own store).
4. Hijri 8/30, or the day before 9/1 when the month is uncertain → `disliked` (day of doubt), unless it is a qaza fast.
5. 1–2 days before 9/1 → `disliked` unless the day also matches the user's habitual kinds (Mon/Thu, Dawud).
6. Friday with no kind on Thursday or Saturday and no planned fast on either → `disliked` (singled out). Show a hint: "Fast Thursday or Saturday with it".
7. Hijri 12/9 with `isPilgrimThisYear` → `permitted` with a "not recommended for pilgrims at Arafah" note.
8. Hijri 8/16–29 and `madhhab === "shafii"` → `disliked` unless habitual or qaza (madhhab note).
9. Otherwise, any matching recommended kind → `recommended`. No match → `permitted`.

**Shawwal six:**

- Counter X/6 for Hijri month 10, from day 2 onward.
- If roza qaza debt is > 0, show the info note: "Many scholars advise making up Ramadan first; others allow either order." This never blocks logging.
- Separately, offer "count this day as qaza", which decrements via the existing `QazaRozaCounter`.

**Tasu'a/Ashura:**

- Recommend 9 + 10 together.
- If only the 10th is logged, show a hint to add the 9th or the 11th.

**Storage and sync:**

- Add `DB_KEYS.voluntaryFasting` and blob entity `voluntary_fasting`, with a custom merge (per-date LWW on `updatedAt`).
- Prefs go in `UserPreferences.voluntaryFasting`.
- The Ramadan `fasting` store is **unchanged**.

**Qaza link:**

- Marking `fasted` with `asQaza: true` decrements roza debt through the existing qaza roza path (`/qaza/roza`).
- Undo increments it again (idempotent flag, mirroring the `qazaDebtAdded` pattern on `PrayerLog`).

**Excused:** hayd days can't be marked `fasted`; the UI explains why. Sick and travel days are allowed, with no nudges.

**UI:**

- New route `/fasting`, a hub with:
  - an upcoming 30-day strip coloured by ruling
  - "Tonight: intend to fast tomorrow?"
  - the Shawwal counter (in month 10)
  - the Dhul-Hijjah counter (in month 12)
  - history
- Today's Goal banner on recommended days, reusing the `white-days-goal-reminder.tsx` pattern.
- Generalise the `/white-days` checklist into this hub, keeping the White Days route as a deep link.
- Calendar (`/calendar`): ruling dots.

**Notifications:**

- `fastIntent` at `intentReminderTime` the night before a recommended day, only if no entry exists for that day.
- Optional `suhoor` at Fajr minus 45 minutes when the entry is `intended`.
- Arafah and Ashura get an extra nudge 2 days ahead.
- New `notificationPrefs.voluntaryFasting: boolean`, default **true** for Mon/Thu off, and seasonal days on. ⇒ Store as `{ weekly: false, seasonal: true }`.

**Tests:**

- `classifyFastDay` table tests across a full Hijri year (fixtures from `hijri-umalqura-data`)
- madhhab variants
- Friday-alone logic with neighbours planned
- qaza decrement idempotency

**Acceptance:**

- Eid and Tashriq can't be logged as fasted without a blocking explanation.
- The Shawwal counter is correct across month boundaries and moon-sighting overrides.

---

### NF-3.3 Dhul-Hijjah mode

**Goal.** A seasonal mode, like Ramadan mode (NF-1.1), for the best ten days of the year, active from Hijri 12/1 to 12/13.

**Islamic basis:**

- Bukhari 969: deeds in the ten days are beloved.
- Ahmad 5446: increase tahlil, takbir and tahmid.
- Muslim 1977: refrain from cutting hair and nails when intending udhiyah.
- Tirmidhi 3585: the best dua is on the day of Arafah.
- Muslim 1162: the Arafah fast.
- Muslim 1141: the days of Tashriq.

**Components:**

1. **Ten-days dashboard** (`/dhul-hijjah`):
   - day X/10
   - daily deeds checklist:
     - fast (days 1–9, linked to NF-3.2)
     - dhikr (takbir/tahlil/tahmid counters, using the existing tasbeeh with new zikr ids from the bundled adhkar, not typed)
     - Qur'an
     - sadaqah (linked to `/sadaqah`)
     - qiyam
2. **Takbir al-Tashriq counter.**
   - Compute the slot list from `rules.takbirTashriq`:

     ```ts
     function tashriqSlots(rules, hijriYear): Array<{ date: string; prayer: ObligatoryPrayer }>
     ```

     The Hanafi/Shafi'i/Hanbali window (Fajr 9 → Asr 13) gives 23 slots. Maliki (Dhuhr 10 → Fajr 13) gives 15.
   - In the tracker, after a fard in a slot is marked `completed`, show an inline chip "Takbir said ✓" with the wording card.
   - The wording comes from the bundled adhkar dataset, with 2 or 3 opening takbirs per `openingTakbirs`.
   - Progress X/N.
   - Hanafi (wajib) copy shows "said once after each fard"; the others show "sunnah".
   - Applies to men and women. Copy notes that women say it quietly (madhhab note).
3. **Udhiyah planner** (`/dhul-hijjah/udhiyah`):
   - Eligibility explainer per `rules.udhiyah.status`. The Hanafi version links to the zakat nisab from `lib/zakat.ts`.
   - Planner fields: animal type (sheep/goat, cow, camel, or a share of 1/7 for a cow or camel), arranged via (local or agency), name(s) it is on behalf of.
   - Minimum age table (to confirm with a scholar): sheep 1 yr (6+ months if robust per majority), goat 1 yr, cow 2 yrs, camel 5 yrs.
   - Time window: after the Eid prayer on 12/10 → sunset of 12/`lastDayHijri`.
   - Distribution note (thirds is recommended).
   - Checklist states: arranged → slaughtered → distributed.
   - **Hair/nails reminder:** if the user set "I intend udhiyah" before 12/1, show the ruling per `hairNailsDuringTen` on the dashboard from 12/1 until "slaughtered" is ticked. If intention is set after 12/1, apply it from the moment of intention.
4. **Day of Arafah view:**
   - fast (non-pilgrim)
   - dua focus timer from Asr to Maghrib
   - personal dua list shortcut
5. **Eid al-Adha:** link to the existing `/eid` guide. The tracker hides the fast option on 10–13.

**Data model:**

```ts
interface DhulHijjahState {
  hijriYear: number;
  intendsUdhiyah?: { since: string /* ISO */ } | null;
  udhiyah?: {
    animal: "sheep" | "goat" | "cow_share" | "camel_share" | "cow" | "camel";
    shares?: number;
    via: "self" | "agency";
    onBehalfOf?: string[];
    status: "planned" | "arranged" | "slaughtered" | "distributed";
  };
  dailyChecks: Record<string /* `${itemId}::${date}` */, true>;
  tashriq: Record<string /* `${date}::${prayer}` */, true>;
}
```

- Store: `DB_KEYS.dhulHijjah`, blob entity `dhul_hijjah`, merged per year with union merge on the maps.
- Activation: `isDhulHijjahModeActive(date)` checks Hijri month 12, day ≤ 13. Teaser cards appear from 11/25.
- The seasonal theme hook goes in `lib/seasonal-themes.ts`.

**Notifications:**

- 11/29 evening: "The ten days begin tomorrow" and "Intending udhiyah?".
- Daily morning card (respects budget).
- Arafah eve.
- Takbir reminder after each fard in the window, **only** if the user enabled it (`notificationPrefs.takbirTashriq`, default off).

**Tests:** slot counts per madhhab; activation boundaries with sighting overrides; hair/nails window when intention is set mid-period.

---

### NF-3.5 Daily Sunnah habits

**Goal.** A small, personal, evidence-backed checklist of everyday sunnahs. The emphasis is consistency over volume (Bukhari 6464).

**Catalog** (`packages/shared/src/content/sunnah-habits.ts`). Refs are rendered from the corpus, and each must pass `content-verification.ts`:

| id                    | Habit                                  | Type         | Ref (verify)     | Links to                        |
| --------------------- | -------------------------------------- | ------------ | ---------------- | ------------------------------- |
| `miswak`              | Use miswak (esp. before salah)         | binary       | Bukhari 887      | —                               |
| `wudu_before_sleep`   | Wudu before sleeping                   | binary       | Bukhari 247      | before-sleep adhkar             |
| `sleep_right_side`    | Sleep on the right side + dua          | binary       | Bukhari 247      | before-sleep adhkar             |
| `ayat_kursi_sleep`    | Ayat al-Kursi before sleep             | binary       | Bukhari 2311     | Qur'an 2:255                    |
| `mulk_nightly`        | Surah al-Mulk nightly                  | binary       | Tirmidhi 2891    | Qur'an 67                       |
| `istighfar_100`       | Istighfar 100×                         | count (100)  | Muslim 2702      | tasbeeh                         |
| `salawat`             | Salawat on the Prophet ﷺ               | count (user) | (durood dataset) | `/duroods`                      |
| `salam_home`          | Salam on entering home                 | binary       | Qur'an 24:61     | dua dataset                     |
| `spread_salam`        | Initiate salam                         | binary       | Muslim 54        | —                               |
| `eat_right_bismillah` | Eat with right hand, say Bismillah     | binary       | Bukhari 5376     | dua dataset                     |
| `smile`               | Smile at a brother/sister (sadaqah)    | binary       | Tirmidhi 1956    | —                               |
| `daily_sadaqah`       | Give something, even small             | binary       | Bukhari 1442     | `/sadaqah`                      |
| `morning_adhkar`      | Morning adhkar                         | linked       | (adhkar dataset) | auto-checked from zikr progress |
| `evening_adhkar`      | Evening adhkar                         | linked       | (adhkar dataset) | auto-checked from zikr progress |
| `custom`              | User-defined (title only, no evidence) | binary/count | —                | —                               |

**Data model:**

```ts
export interface SunnahHabitsState {
  selected: string[]; // ordered habit ids (max 12 to keep it small)
  custom: Array<{ id: string; title: string; target?: number }>;
  checks: Record<string /* `${habitId}::${date}` */, number /* 1 for binary, n for count */>;
  spotlightSeen: Record<string, string>; // habitId → last date shown
}
```

**Logic:**

- **Linked habits are derived** from existing stores (zikr progress for adhkar, tasbeeh counts for istighfar, sadaqah store) and are not double-stored. They show as auto-checked with a "from Adhkar" label.
- **Consistency display:** 30-day dots per habit, with no streak-loss language. "Most consistent" is a soft highlight.
- **Sunnah spotlight:** one unselected habit per day, rotating and skipping any seen in the last 14 days, with an "Add to my habits" button.
- **Excused:** hayd and sick don't pause habits. They aren't worship-gated, except Qur'an recitation habits during hayd (madhhab-dependent: show a note and keep listening allowed). Keep it neutral: don't hide anything; the habit card shows the madhhab note.

**Storage:** `DB_KEYS.sunnahHabits`, blob entity `sunnah_habits`, union merge (checks map: max per key).

**UI:**

- Route `/habits`.
- Home module `sunnah-habits`.
- Tracker section "Sunnah habits" under the zikr section.
- Library entry under "Track".

**Notifications:** optional single evening nudge (`notificationPrefs.habits`, default off). Before-sleep habits fold into the existing `beforeSleep` reminder text, with no extra slot.

### NF-3.19 Tasbeeh counter designs (themes, sliding beads, sound & haptics)

**Goal.** Let users choose how the tasbeeh counter looks, sounds and feels. Today's circular donut with the count inside stays the **default** (D10). Add a traditional **sliding-bead misbaha** with its own shapes, materials and colours, and a few more designs. Each design is a different way of showing the same counter, so counting stays exactly as accurate as it is today.

**Related:** NF-3.20 (hands-free voice counting) sends recognised phrases through the same face `onCount` path, so every design here also responds to voice.

**Where it applies.** Every screen that renders `TasbeehCounter`: `tasbeeh/[zikrId].tsx`, `tasbeeh/free.tsx`, `tasbeeh/custom/[id].tsx` and `tasbeeh/durood/[id].tsx`. The sticky dock (`TasbeehCounterBar`), widgets, Watch/Wear and Live Activities keep the compact ring in v1.

**Islamic basis and guardrails.**

- **Fingers are the Sunnah way to count.** The Prophet ﷺ said to count on the fingertips, "for they will be asked and made to speak" (Abu Dawud 1501; Tirmidhi 3583, graded hasan; verify the numbering). Most scholars allow beads, pebbles and date pits. The reports about pebbles and date pits are graded differently by different scholars (Tirmidhi 3568 / Abu Dawud 1500; verify). Several scholars hold that counting on the fingers is better.
- **A design only changes how the count is shown.** No copy ever says or suggests that one design brings more reward. The finger design links to the hadith above. Nothing in any design ties an amount of reward to a count (see the rejected ideas below).
- **No music.** Sounds are short, natural, percussive clicks: wood, stone, resin, glass, or a mechanical clicker. No melodic chimes and **no bells** (Muslim 2114; verify). The completion cue is a soft "strand settles" clack, not a jingle.
- **No living beings.** Imagery is geometric, natural materials, or the sky. No mascots, animals or faces.
- **Calm, not game-like.** No points, XP, coins or unlockable "rare beads", and no paywall on worship visuals: every design and material is free (D16). This follows the existing "calm confidence" motion tokens (`constants/motion.ts`).

**Research summary (2026-11-20).**

- Most tasbih apps on the stores show a ring or a plain tap counter. Sliding-bead counters are rare and usually sold as paid upgrades. Examples: [Tasbih: Dhikr Counter by Ekin](https://mwm.ai/apps/tasbih-zikr-counter-pro/6790427707) (bead slides along a string; 33 or 99 beads; Amber, Kuka Wood, Pearl and Turquoise themes), [Tasbih Counter – Daily Dhikr](https://apps.apple.com/us/app/tasbih-counter-daily-dhikr/id6757278052) (a swipeable wooden-bead Pro view next to a circular counter), [BeadsCounter](https://apps.apple.com/us/app/beadscounter/id6757827993) (ruby, sapphire and jade bead materials at $1.99 each) and [Misbaha – Tasbih Counter](https://apps.apple.com/us/app/id6757333557) (tassels and bead materials behind a paid upgrade). Offering beads, materials and sound **free and well made** is a clear way to stand out.
- **How a real misbaha is built.** Common strands have 33 or 99 beads. A 33-bead strand has spacer beads (_fasil_ / _shahid_) after the 11th and 22nd beads; a 99-bead strand has them after the 33rd and 66th. One end has a larger leader bead (_imam_, also _yad_ or _mihrab_), usually with a tassel. Common materials are olive wood, kuka wood, sandalwood, ebony, camel bone, amber (honey and cherry), pearl and mother-of-pearl, turquoise, onyx, lapis, jade, agate and glass. Common shapes are round, olive (barrel), faceted, cylinder, and flat rondelle. Sources: [Wikipedia: Misbaha](https://en.wikipedia.org/wiki/Misbaha), [Tespih](https://www.wikiwand.com/en/articles/Tespih), [misbaha encyclopedia](https://skyjems.ca/pages/encyclopedia-misbaha).

**Design catalog** (`lib/tasbeeh/designs.ts` registry). Priority: P1 = v1, P2 = v1.1, P3 = v2.

| id          | Design                  | What it is                                                                                                                                                                                                                                                                                                                                                      | Prio |
| ----------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `ring`      | **Ring** (default)      | Today's `ArcProgressRing` donut with the count inside, moved unchanged into a "face" component.                                                                                                                                                                                                                                                                 | P1   |
| `misbaha`   | **Sliding beads**       | A traditional strand. Each count slides one bead along the thread into the counted group. Spacer beads, the imam bead and the tassel are all drawn. Shape, material, spacers, tassel, thread, strand size and layout can all be customised (below).                                                                                                             | P1   |
| `clicker`   | **Digital clicker**     | Looks like the handheld or ring zikr counter: a seven-segment LCD (green, amber or monochrome backlight) and one big round button with a mechanical click.                                                                                                                                                                                                      | P2   |
| `minimal`   | **Focus / Night**       | Very large numerals on true black (OLED), dimmed. The whole screen is the tap target and there is no animation. Built for qiyam and for counting after salah without looking: distinct haptic pulses at 33, 66, 99 and the target.                                                                                                                              | P2   |
| `fingers`   | **Finger counting**     | A visual aid for the Sunnah method. A line-art hand (react-native-svg, no skin tones) lights up the next fingertip or finger joint on each tap, and a lap counter shows completed rounds. Two layouts: fingertips (10, both hands) and joints (right hand). The copy says the user's own finger method is fine. Needs scholar review of the depiction and copy. | P3   |
| `geometric` | **Geometric rosette**   | An Islamic 8- or 12-point star pattern (girih) that fills one segment per count. A 33-segment rosette; for 99 it completes three times; for ∞ it loops.                                                                                                                                                                                                         | P3   |
| `stars`     | **Night sky**           | Each count lights one star in a simple constellation that completes at the target. Reuses the sky and moon palette from the home hero.                                                                                                                                                                                                                          | P3   |
| `pebbles`   | **Date pits / pebbles** | Each tap moves one pit or pebble from one dish to another. **Ships (D16)** with an always-visible "About this design" note on its evidence and the differing gradings, backed by the D11 proof log.                                                                                                                                                             | v2   |

**Considered and rejected:** a "palm garden" that plants a tree per count, because it applies the reward of one specific dhikr (Tirmidhi 3464) to all dhikr. Also rejected: coins, XP and level-ups; animal or character mascots; melodic or bell sounds; a 3D physics strand (it would need Skia or GL, both new native dependencies, and UI work must not add native dependencies); and ibadah leaderboards (§2.4).

**Misbaha customisation.** The user first picks a **preset**, then can fine-tune it:

| Option             | Values (v1)                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preset             | Amber classic · Kuka wood · Olive wood · Sandalwood · Pearl · Turquoise · Onyx night · Theme accent (matte, from `useTheme()` accent)                                                               |
| Bead shape         | Round · Olive (barrel) · Faceted · Cylinder (kuka cut) · Rondelle                                                                                                                                   |
| Material / finish  | Wood (olive, kuka, sandal, ebony) · Amber (honey, cherry; translucent) · Pearl / mother-of-pearl (sheen) · Stone (turquoise, onyx, lapis, jade, agate) · Glass (translucent) · Theme accent (matte) |
| Spacers (_fasil_)  | Same as beads · Silver · Gold · Contrasting material · Off                                                                                                                                          |
| Imam bead + tassel | Silk tassel (colour picker from a curated list) · Metal chain tassel · Imam bead without tassel                                                                                                     |
| Thread             | Colour (curated) · Hidden                                                                                                                                                                           |
| Strand             | **Auto** (follows target: 33 → 33 beads; 99 → 99 beads; 100 → 99 beads, with the imam bead as the 100th; custom or ∞ → a 33-bead loop with a lap counter) · Always 33 · Always 99                   |
| Layout             | Hanging arc (vertical, default on phones) · Horizontal (default on TV, tabletop posture and landscape) · Full loop (a circle of beads around the count)                                             |
| Background         | Theme surface (default) · Soft velvet tint (a gradient from theme tokens)                                                                                                                           |

Materials are **procedural**, not image assets. Each one is a `{ base, highlight, shadow, translucency, sheen, grain? }` recipe in `lib/tasbeeh/materials.ts`. Spheres are shaded with `gradientBackground()` radial gradients from `lib/gradient.ts`, which works on web too. Facets, olive shapes, the tassel and the thread are drawn with react-native-svg, which is already installed. If wood grain needs an image, it is one tiling PNG of 30 KB or less. All colours used for UI chrome come from theme tokens. Bead colours are material data, so they are exempt from the "no hardcoded colours" rule; they live in `materials.ts` and are listed in the PR.

**Interaction (misbaha).**

- **Tap** anywhere on the stage: the next bead slides down the thread and settles against the counted group with a spring (`Springs.gentle` and a short settle).
- **Drag:** the user pulls the next bead along the thread (react-native-gesture-handler Pan, already installed). The count happens **only** when the bead passes a detent at 60% of the bead pitch. If the user lets go before the detent, the bead springs back and nothing is counted. **One gesture counts at most one bead**, so a fast flick still counts as 1. Dragging the other way **never subtracts**; undo stays behind the existing confirmed Undo control. Both rules protect the accuracy of the count.
- **Spacer bead:** when it passes, a heavier haptic and a lower-pitched sound mark the 11/22 or 33/66 boundary.
- **Reaching the target:** the imam bead arrives, the tassel sways (unless reduced motion is on), a `success` haptic plays, and the existing `CompletionBanner` shows. The `PartyPopper` burst stays on Ring. Calmer designs show a short glow instead.
- **Rendering:** a virtualised strand. At most about 20 beads are drawn at once, and positions come from one Reanimated `progress` shared value through worklet math in `bead-layout.ts`. Target: 60 fps on the `Phone_API_35` emulator release build with a 99-bead strand.
- **Reduced motion:** beads step from one position to the next with no slide, sway or settle.
- **RTL:** the vertical layout doesn't change. The horizontal layout flows right to left (`lib/rtl.ts` and `chart-rtl.ts` helpers).

**Sound.**

- **Packs, one per material family:** wood clack (soft and hard), resin/amber tick, stone clink, glass clink, pearl tick, mechanical clicker, soft LCD beep. Each pack has three sounds: `bead`, `spacer` (lower pitch) and `complete` (the strand settling).
- **Sourcing (D16):** **CC0** sources only (the Freesound CC0 filter, Kenney UI audio); each file's CC0 status is recorded under D12. List the credits in `NOTICE` and on the About credits screen. Each file is mono AAC/m4a under 20 KB and stored in `apps/app/assets/audio/tasbeeh/`.
- **Engine** (`lib/tasbeeh/sound.ts`, using `expo-audio`, which is already installed):
  - Preload a round-robin pool of 3–4 `createAudioPlayer` instances per sound; each play is `seekTo(0)` then `play()`.
  - Set `playsInSilentMode: false` so the iOS silent switch is respected, and `interruptionMode: "mixWithOthers"` so a tick **never pauses Qur'an or adhan audio** that is already playing.
  - Release the players on unmount.
  - Skip the sound, but still count, when taps come less than 40 ms apart.
  - On web, unlock audio on the first gesture.
- **Defaults:** sound is **off** on phones, because people usually count in the masjid or after salah. There is a volume slider and a "Test" button. TV has no haptics, so sound is **on by default on TV** (D16).

**Haptics.**

- **Semantic mapping** (pure function `feedbackFor(design, event)`):
  - `bead` → `light` (or `selection`)
  - `spacer` → `medium`
  - lap / 33-milestone → `medium` ×2
  - `complete` → `success`
- **Tasbeeh haptics setting:** Off / Subtle / Rich. It is still gated by the global `hapticsEnabled` and still goes only through `triggerHaptic()` (`lib/haptics.ts`). **Rich** adds Android tick or detent primitives if `expo-haptics` 58 exposes them (check whether `performAndroidHapticsAsync` exists); otherwise it falls back to `selection`. Add any new types to the `HapticFeedback` union; never import `expo-haptics` directly.

**Architecture.**

- **Split the 925-line `components/tasbeeh/tasbeeh-counter.tsx`** into two parts:
  - A **shell**, which keeps everything that isn't visual: mode bar, controls, confirm dialogs, completion, the target limit, web Space/Enter, TV focus, hinge tabletop, and haptic and sound dispatch.
  - **Faces** in `components/tasbeeh/faces/{ring,misbaha,clicker,minimal,…}-face.tsx`, which are only visual.

  The shared face contract:

  ```ts
  export type TasbeehDesignId = "ring" | "misbaha" | "clicker" | "minimal" | "fingers" | "geometric" | "stars" | "pebbles";

  export interface TasbeehFaceProps {
    count: number;            // displayCount (already clamped to target)
    target: number;           // 0 = ∞
    complete: boolean;
    size: number;             // stage box from the shell (TV / tabletop aware)
    tv: boolean;
    reduceMotion: boolean;
    appearance: TasbeehAppearance;
    /** Face asks to count; the shell enforces the limit, haptics, sound and onIncrement. */
    onCount: (event: "bead" | "spacer") => void;
  }
  ```

- **Lazy loading:** faces other than Ring load lazily with a dynamic `import()`, so the bead and SVG code stays out of the web `__common` chunk ([`PROFILING.md`](./PROFILING.md)).
- **Pure modules with unit tests:** `lib/tasbeeh/bead-layout.ts` (strand path, bead positions for a given progress, spacer and imam indices, virtual window, ∞ loop, RTL horizontal), `lib/tasbeeh/materials.ts` and `lib/tasbeeh/feedback.ts`.
- **Preference.** Add an optional field to `UserPreferences`. It syncs through the existing `preferences` entity, so no API or DTO change is needed, and older clients ignore it. `undefined` means the Ring default, so no migration is needed.

  ```ts
  // packages/shared/src/types/tasbeeh-appearance.ts
  export interface TasbeehAppearance {
    design: TasbeehDesignId;                     // default "ring"
    misbaha?: {
      preset: string;
      shape: "round" | "olive" | "faceted" | "cylinder" | "rondelle";
      material: string;                          // key into MATERIALS
      spacer: "same" | "silver" | "gold" | "contrast" | "off";
      tassel: { style: "silk" | "chain" | "none"; color?: string };
      thread: { color?: string; hidden?: boolean };
      strand: "auto" | 33 | 99;
      layout: "arc" | "horizontal" | "loop";
    };
    clicker?: { backlight: "green" | "amber" | "mono" };
    sound: { enabled: boolean; pack: string; volume: number }; // enabled=false default
    haptics: "off" | "subtle" | "rich";          // default "subtle"
  }
  ```

- **Per-counter override (v2):** an optional `design?: TasbeehDesignId` on custom tasbeeh entries, so "Istighfar 100" can use beads while the free counter stays on Ring.

**UI.**

- **Palette button:** a palette `IconButton` in the counter's `ControlBar` opens a `Sheet` called "Counter style" with these parts:
  1. A carousel of design cards, each a **live mini preview** the user can tap to try.
  2. For the misbaha: a presets row, then chips for shape, material, spacers, tassel, thread, strand and layout.
  3. A sound section (toggle, pack, volume, Test).
  4. A haptics section (Off / Subtle / Rich).

  Changes apply at once, with no Save button.
- **Settings:** a new `settings/tasbeeh.tsx` screen ("Tasbeeh counter") with the same controls through a shared `TasbeehAppearanceEditor` component. Also register the counter styles in search (`search-guides`), add a feature tour step and a "new" badge in `lib/new-features.ts`.
- **Accessibility:** every face exposes the same accessible element: `accessibilityRole="button"`, a label with the count and target, `accessibilityValue {min, max, now}` and an increment action. Screen-reader users never need the drag gesture.
- **TV:** Ring, Misbaha (horizontal layout), Clicker and Minimal are offered on TV. Select counts, using the existing focus model. Fingers, Geometric and Stars are phone and web only until TV QA is done.
- **Web:** Space and Enter keep working through the shell. Hover previews show in the style sheet.

**Storage:** the `preferences` entity (synced) handles everything. There is no new `DB_KEYS` entry, and the per-counter override in v2 lives on the existing `custom_tasbeeh` entity.

**Notifications:** none.

**Delivery slices:**

1. **v1:** shell/face refactor (Ring stays pixel-identical) · Misbaha with arc layout, the 33/99/auto strand, 5 shapes, about 10 materials and 8 presets, spacers, tassel · sound packs for wood, amber, stone and glass · haptic levels · style sheet and Settings screen.
2. **v1.1:** Clicker · Focus/Night · Misbaha horizontal and loop layouts (TV, tabletop, landscape) · pearl and clicker sound packs.
3. **v2:** Fingers · Geometric · Stars · per-counter design · Pebbles (with its grading note, D16).

**Tests:**

- Unit tests for `bead-layout`, `materials` (each recipe has the required stops, and all contrast is computed against theme surfaces) and `feedback` (the event → haptic/sound table).
- Shell tests for each face: one tap counts exactly once; the limit holds at the target; a drag past the detent counts 1; a drag released short counts 0; a reverse drag counts 0; reduced motion produces no animation calls.
- The existing `tasbeeh-counter.test.tsx` passes unchanged under the default (Ring) design, which is the regression lock.
- Preference default and round-trip tests.
- An i18n guard covering all 24 locales.

**Acceptance criteria:**

- Existing users see **no change** until they pick a new design (Ring default, D10).
- **Count accuracy:** 1,000 scripted rapid taps give 1,000 counts in every face, with no counts dropped or doubled. A drag gesture never counts more than once and never subtracts.
- Sound plays within 50 ms of the tap on mid-range devices. It never pauses Qur'an or adhan playback, and it respects the iOS silent switch.
- A 99-bead misbaha runs at 60 fps in the Android release build. Web, TV, RTL (ar/ur) and reduced motion are all checked.
- **No new native dependencies:** only `expo-audio`, `expo-haptics`, Reanimated, RNGH and react-native-svg, which are all already installed.

**Risks:**

- Audio latency on Android and web. Mitigation: the player pool, and skipping the sound but never the count.
- Bead rendering cost on low-end Android. Mitigation: the virtual window, and a "simple beads" fallback with flat shading.
- The scope grows into a store of "skins". Mitigation: the catalog above is the cap until v2 is reviewed.

---

## 6. Phase 2 — Private self-accountability

All features in this phase store their data in the **vault** (§4.2, D2).

### NF-3.6 Nightly muhasabah (≈ 60 seconds)

**Goal.** A short, private nightly self-review that ends in istighfar and gratitude.

**Islamic basis:**

- Qur'an 59:18.
- The saying of Umar (ra), "Take account of yourselves before you are taken to account". This is an athar narrated by Tirmidhi under 2459; label it as Umar's statement, not a hadith.
- Bukhari 6306: Sayyid al-Istighfar.

**Flow (5 screens max, swipeable, about 60 s):**

1. **Salah:** auto-summary from the tracker (read-only): "4/5 fard on time, 2 rawatib". No question needed.
2. **Prompts.** Choose 3–6 from the catalog; the user can configure them. Each is answered **Yes / Partly / No**:
   - "Did I guard my tongue (backbiting, lying, harsh words)?"
   - "Did I guard my gaze?"
   - "Was I good to my parents / family today?"
   - "Did I fulfil a trust or promise?"
   - "Did I waste time I'd regret?"
   - "Was there anger I didn't control?"
   - custom prompts
3. **Good deed I'm grateful for** (optional, one line) → "Alhamdulillah" tap.
4. **Something to repent from** (optional, one line; stored encrypted; the user can choose "don't save text, only the fact") → shows Sayyid al-Istighfar from the bundled adhkar, with a "Read it" check.
5. **Tomorrow's one intention** (optional) → shown on tomorrow's Today card.

**Data model (vault doc `muhasabah`):**

```ts
export interface MuhasabahEntry {
  date: string;
  answers: Record<string /* promptId */, "yes" | "partly" | "no">;
  gratitude?: string;
  repentNote?: string; // optional; may be omitted by preference
  readIstighfar: boolean;
  intention?: string;
  durationMs: number;
  updatedAt: string;
}
export interface MuhasabahDoc {
  prompts: string[]; // selected prompt ids incl. custom:<id>
  customPrompts: Array<{ id: string; text: string }>;
  entries: Record<string, MuhasabahEntry>;
  prefs: {
    time: "bedtime" | "isha+90" | string;
    saveRepentText: boolean;
    retentionDays: 0 | 30 | 90 | 365;
  }; // 0 = forever
}
```

**Logic:**

- **Retention:** entries older than `retentionDays` are deleted on app start. The default is 90 days for privacy.
- **Trends** (visible only to the user): per-prompt 30-day bars. No overall score.
- **Excused periods:** the muhasabah still runs; only the salah screen changes its copy.
- **Lock:** if "Lock private journals" is on, require the PIN or biometrics before opening.

**UI:** route `/muhasabah`, plus `/muhasabah/history` and `/muhasabah/settings`. A Today card appears after Isha.

**Notifications:**

- One per night at `prefs.time`. `bedtime` already exists in `UserPreferences`.
- Generic text: "A minute with yourself before sleep".
- `notificationPrefs.muhasabah`, default off; offered after the first manual use.

**Coach input (NF-3.14):** only aggregated per-prompt rates. Text is never read by the coach.

---

### NF-3.7 Silat al-rahim (family ties) reminders

**Goal.** Never let a relative go uncontacted for too long, with parents first.

**Islamic basis:**

- Qur'an 4:1, 47:22–23.
- Bukhari 5986: whoever wants increased provision should keep family ties.
- Bukhari 5984: the one who severs ties.
- Bukhari 5971: "your mother" three times, then your father.

**Data model (vault doc `relatives`, D2 extension):**

```ts
export type Kinship =
  | "mother"
  | "father"
  | "grandparent"
  | "child"
  | "sibling"
  | "spouse_parent"
  | "aunt_paternal"
  | "aunt_maternal"
  | "uncle_paternal"
  | "uncle_maternal"
  | "cousin"
  | "niece_nephew"
  | "other";
export interface Relative {
  id: string;
  name: string;
  kinship: Kinship;
  phone?: string; // optional; manual entry (no contacts import in v1)
  cadenceDays: number; // defaults by kinship: parents 2, grandparents 7, siblings 7, aunts/uncles 30, cousins 60, other 90
  lastContact?: { date: string; kind: "call" | "visit" | "message" | "gift" | "dua" };
  notes?: string;
  paused?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
export interface RelativesDoc {
  relatives: Relative[];
  log: Array<{ relativeId: string; date: string; kind: string }>;
}
```

**Logic:**

- `dueDate = lastContact.date + cadenceDays`. When there's no last contact, the relative is due today.
- **Priority score** sorts the due list:

  ```
  score = overdueDays / cadenceDays × kinshipWeight
  ```

  `kinshipWeight`: mother 3, father 2, grandparents 1.5, siblings/children 1.2, others 1.
- **Actions:**
  - "Call" uses `tel:` via `expo-linking`.
  - "Message" uses `sms:` / WhatsApp deep link. Make sure the WhatsApp URL scheme is allowlisted in `LSApplicationQueriesSchemes`.
  - Each action auto-logs a `lastContact` after returning to the app, with a confirm toast.
- **"Make dua for them"** logs `kind: "dua"`. It does **not** reset the due date unless the relative's cadence is ≥ 30 days. A dua is valuable but doesn't replace contact.
- **Deceased relatives:** a `deceased` flag moves them into a "Remember in dua" list (no cadence), linked to the janazah guide's dua section.

**UI:** route `/family-ties`, with a due list, add/edit and history. Home module `family-ties-due`, which shows a count only.

**Notifications:**

- **Batched**: one weekly digest (default Friday after Jumu'ah, or user-set): "3 relatives would love to hear from you".
- Parents overdue → one extra individual nudge.
- No names on the lock screen.
- `notificationPrefs.familyTies`, default on once at least one relative is added.

---

### NF-3.8 Debts & trusts record (Dayn / Amanah)

**Goal.** Record what I owe and am owed (Qur'an 2:282) and keep obligations visible so they are paid before death.

**Islamic basis:**

- Qur'an 2:282: write debts down.
- Tirmidhi 1078: the soul is suspended by its debt.
- Muslim 1886: the martyr is forgiven everything except debt.
- Bukhari 2387: intending to repay.

**Data model (vault doc `debts`):**

```ts
export interface DebtRecord {
  id: string;
  direction: "i_owe" | "owed_to_me" | "trust_held" | "trust_given";
  counterparty: string;
  amount?: number;
  currency?: string; // currency via lib/format-currency.ts
  item?: string; // for trusts / non-cash
  createdOn: string;
  dueOn?: string;
  witnesses?: string[]; // names only
  documentUri?: string; // optional photo via existing /user-media (encrypted-at-rest local only in v1)
  payments: Array<{ id: string; date: string; amount: number; note?: string }>;
  status: "open" | "settled" | "forgiven";
  notes?: string;
  updatedAt: string;
  deletedAt?: string;
}
```

**Logic:**

- `outstanding = amount − Σ payments`. Status auto-moves to `settled` when outstanding ≤ 0.
- **Forgiveness:** "I forgive this debt" sets `forgiven`, with a sadaqah note (Qur'an 2:280).
- **Riba guard:** if the user enters a "repay" amount above the principal on an `i_owe` or `owed_to_me` loan, show an info card: "Increase on a loan is riba". Link to `/finance`. Not blocking.
- **Religious obligations summary** (read-only, from existing stores):
  - qaza prayers (`QazaCounter`)
  - qaza fasts (`QazaRozaCounter`)
  - zakat due (zakat draft)
  - fidyah/kaffarah computed (`lib/fidyah.ts`)
  - unfulfilled vows (a new simple list inside this doc: `vows: Array<{id,text,fulfilled}>`)

  These feed into the wasiyyah (NF-3.9).

**UI:** route `/debts`, with tabs "I owe", "Owed to me" and "Trusts", plus the obligations summary card. Export to a PDF statement goes through the same renderer as the wasiyyah.

**Notifications:** on `dueOn` and 3 days before, generic text "A payment is due". `notificationPrefs.debts`, default on when there are any open records with `dueOn`.

---

### NF-3.9 Wasiyyah (Islamic will) builder

**Goal.** A guided, shareable, printable Islamic will that pulls in debts and obligations and respects the 1/3 limit.

**Islamic basis:**

- Bukhari 2738: don't let two nights pass without your will written.
- Bukhari 2742: the bequest is one third, "and a third is much".
- Abu Dawud 2870 / Tirmidhi 2120: no bequest to an heir.
- Qur'an 2:180, 4:11–12, 5:106 (witnesses).

**Sections (wizard; each is optional except 1 and 7):**

1. **Testator:** name, date. Declaration of shahadah (fixed text from the dataset).
2. **Funeral wishes:** ghusl, kafan and janazah per sunnah, linked to the janazah guide. Burial in a Muslim cemetery; avoid innovations (neutral wording; scholar-reviewed copy).
3. **Debts and obligations:** auto-imported from NF-3.8 (the "i_owe" list plus the religious obligations summary). The user confirms each line.
4. **Trusts to return:** imported from `trust_held`.
5. **Bequest (wasiyyah) to non-heirs / charity**, with validation:
   - Estimated estate `E` (optional input).
   - `netAfterDebts = E − funeral − debts`.
   - `Σ bequests ≤ netAfterDebts / 3`. Over the limit → blocking error with the explanation "excess needs heirs' consent after death" (majority view).
   - **Bequest to an heir:** if the beneficiary is marked as an heir (from the mirath heir list), show a blocking warning "No bequest to an heir — valid only with the other heirs' consent (majority view)". The user must acknowledge it.
6. **Guardianship of minors** and **executor (wasi)**, names only.
7. **Distribution of the rest:** "according to the Islamic law of inheritance". Optionally attach a NF-3.10 calculation snapshot, labelled "illustrative — actual heirs determined at death".
8. **Witnesses:** two witnesses' names and signature lines (Qur'an 5:106).

**Output:**

- HTML → PDF on device (add `expo-print`; web uses the browser print).
- Language: user locale plus optional English side by side.
- Disclaimer block (legal-reviewed): "Not legally binding in many jurisdictions — have it executed/registered according to local law".

**Data:** vault doc `wasiyyah`, versioned:

```ts
interface WasiyyahDoc {
  versions: Array<{ id: string; createdAt: string; data: WasiyyahData }>;
  currentId: string;
}
```

**Reminder:** "Review your wasiyyah" every 12 months (configurable), and whenever debts change by more than 20%.

---

### NF-3.14 Weekly gentle coach (on-device only, D3)

**Goal.** Turn a week of tracking into 1–3 kind, actionable insights. **No LLM.** Everything is rules plus i18n templates.

**Inputs (all local):**

- `PrayerLog[]`: status, `isJama`, `delayed`, rawatib
- zikr progress
- khushu journal ratings
- Qur'an reading progress and khatm plan
- voluntary fasting
- habits
- muhasabah per-prompt **rates only**
- relatives due count
- `bedtime` pref
- excused periods

**Reuse the statistics engine** (`apps/app/src/lib/statistics.ts`, new in the working tree on 2026-11-23). Don't recompute what it already provides:

- `indexPrayerDays`, `dailyPoints` and `summarizePeriod` for weekly completion
- `salahBreakdown` and `salahExtremes` for the weakest and strongest salah (for example `fajr_gap`)
- `strongestWeekday`
- `projectQazaFinish` for qaza pace
- `summarizeQuranReading` (`quran_streak`)
- `longestStreak` / `bestStreak` from `packages/shared/src/utils/streak.ts` for "personal best" celebrations; a broken streak never takes back what was earned

The rule engine stays pure in `packages/shared`. A builder in the app, `apps/app/src/lib/coach/context.ts`, maps those outputs into a `CoachContext`, so shared never imports app code.

**Engine** (`packages/shared/src/utils/coach/`):

```ts
export interface CoachRule {
  id: string;
  kind: "celebrate" | "suggest" | "plan";
  /** Returns evidence numbers or null if not applicable. Pure. */
  evaluate(ctx: CoachContext): CoachEvidence | null;
  priority: number; // higher first
  cooldownWeeks: number; // don't repeat within N weeks
  copyKey: string; // i18n key with {params}
  action?: { route: string; labelKey: string };
}
export function buildCoachReport(ctx: CoachContext, history: CoachHistory): CoachInsight[]; // ≤ 3, ≥ 1 celebrate
```

Initial rule set (each with unit tests using fixture weeks from `test-support`):

| id                  | Fires when                                                                                                    | Suggestion / action                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `fajr_gap`          | Fajr completion ≥ 30 pp below the mean of the other fard over 2+ weeks                                        | Earlier bedtime / before-sleep adhkar → `/settings/reminder-offsets`         |
| `delayed_pattern`   | ≥ 3 `delayed` for the same prayer in 7 days                                                                   | Suggest reminder offset for that prayer                                      |
| `weekday_dip`       | One weekday's fard rate ≤ mean − 25 pp for 3 weeks                                                            | "Plan for <weekday>"                                                         |
| `improvement`       | Any tracked metric +15 pp vs the 4-week baseline                                                              | Celebrate ("Alhamdulillah — keep it small and steady")                       |
| `qaza_pace`         | Qaza debt > 0                                                                                                 | Projected finish date at current pace; offer +1/day plan                     |
| `jama_rate`         | Men only if gender known? → **No gender inference.** Fires when user has a home masjid set & jama' rate < 20% | Suggest one masjid prayer this week                                          |
| `khushu_low_prayer` | Avg khushu rating for one prayer ≤ 2/5 over 5+ entries                                                        | Link to salah guide meaning of recitations                                   |
| `quran_streak`      | Reading days ≥ 5/7                                                                                            | Celebrate; offer khatm plan if none                                          |
| `khatm_behind`      | Khatm plan behind by > 2 days                                                                                 | Offer re-plan (`lib/khatm.ts`)                                               |
| `rawatib_start`     | Fard ≥ 90% and rawatib ≈ 0                                                                                    | Suggest Fajr sunnah first (Muslim 725)                                       |
| `habit_consistent`  | Any habit 7/7                                                                                                 | Celebrate                                                                    |
| `family_ties_due`   | ≥ 1 parent overdue                                                                                            | Link to `/family-ties`                                                       |
| `excused_week`      | Excused ≥ 4 days                                                                                              | **Only** "Rest and return — your streak is safe". Suppress every suggestion. |

**Tone rules (enforced by tests on the copy keys):**

- Never compare to other people.
- Never show a failure percentage. Use "4 of 7" style counts.
- At most one suggestion per area.
- Each report ends with one "micro-goal" the user can accept. It is stored in `CoachHistory.goals` and checked next week.
- Evidence quote: optionally attach one corpus item by tag (for example the consistency hadith, Bukhari 6464), **by ref only**.

**Delivery:**

- Extends the weekly report (NF-1.6, `DB_KEYS.weeklyReportAt`, `buildWeeklyReport` in `packages/shared/src/utils/weekly-report.ts`) into `/coach`.
- Day is user-selectable; Friday after Jumu'ah by default.
- Notification text is generic: "Your weekly reflection is ready".

**Storage:**

- Blob entity `coach_history`: insights shown, goals and their outcomes. It contains no raw data.
- Muhasabah-derived rates are computed at run time from the unlocked vault. If the vault is locked, those rules are skipped.

---

## 7. Phase 3 — Fiqh tools, Qur'an & hadith

### NF-3.10 Mirath (inheritance) calculator — all four schools (D6)

**Goal.** A correct, explainable faraid calculator, with the disputed cases parameterised per school and every result traceable to its rules.

**Islamic basis:**

- Qur'an 4:11, 4:12, 4:176.
- Bukhari 6764: no inheritance across religions.
- Tirmidhi 2109: a killer does not inherit.
- Classical references for the fixtures: al-Sirajiyyah (Hanafi), Matn al-Rahbiyyah (Shafi'i), plus standard Maliki/Hanbali faraid texts. Record the source of each fixture.

**Location:** `packages/shared/src/mirath/`. The engine is pure TypeScript and heavily tested.

**Inputs:**

```ts
export interface MirathInput {
  school: MadhhabId;
  deceased: { gender: "male" | "female" };
  estate?: { gross: number; funeral: number; debts: number; bequests: number; currency: string };
  heirs: Partial<Record<HeirType, number>>; // counts; only living, Muslim, not the killer (UI asks)
}
export type HeirType =
  | "husband"
  | "wife"
  | "son"
  | "daughter"
  | "sons_son"
  | "sons_daughter"
  | "father"
  | "mother"
  | "paternal_grandfather"
  | "paternal_grandmother"
  | "maternal_grandmother"
  | "full_brother"
  | "full_sister"
  | "paternal_brother"
  | "paternal_sister"
  | "maternal_brother"
  | "maternal_sister"
  | "full_brothers_son"
  | "paternal_brothers_son"
  | "full_paternal_uncle"
  | "paternal_paternal_uncle"
  | "full_uncles_son"
  | "paternal_uncles_son";
```

**v1 scope:**

- One generation below (son's children) and one above (grandparents) the immediate heirs.
- Deeper descendants or ascendants, the unborn (haml), missing persons (mafqud), simultaneous deaths, hermaphrodite cases and wala' → "consult a scholar" screen.

**Algorithm (pipeline, each step logged for the explanation view):**

1. **Validate:**
   - `wife ≤ 4`
   - not both husband and wife
   - impediments are confirmed by UI questions (difference of religion, homicide), and excluded heirs are removed
2. **Net estate:**

   ```
   net = gross − funeral − debts
   bequest = min(bequests, net / 3)   // note if capped
   distributable = net − bequest
   ```
3. **Exclusion (hajb hirman):** apply the exclusion table (below). Exclusions that differ by school come from `MirathSchoolParams`.
4. **Fixed shares (furud):** assign per the rules table. Use exact rational arithmetic (`BigInt` numerator/denominator), with no floats.
5. **Residuaries ('asabah):**
   - by self: son → son's son → father → grandfather → brothers → nephews → uncles → cousins (nearest class, then degree, then strength of tie)
   - with another: daughters with sons, son's daughters with son's sons, sisters with brothers, at a 2:1 ratio
   - along with another: full or paternal sisters with daughters or son's daughters
6. **'Awl:** if Σ shares > 1, scale proportionally. Expected bases: 6 → 7, 8, 9, 10; 12 → 13, 15, 17; 24 → 27. Assert these in tests.
7. **Radd:** if Σ shares < 1 and there is no residuary:
   - Return the surplus to the fard-heirs **except the spouses**, in proportion.
   - School parameter `raddEnabled`. Classical Shafi'i/Maliki send it to bayt al-mal, while later scholars of both schools permit radd when there's no organised treasury. Default `true` for all four, with a note. Scholar to confirm.
   - The spouse keeps their share; the remainder is redistributed.
8. **Dhawu al-arham:** if nothing is left to heirs and no spouse-only case applies, the result is "distant kindred inherit (Hanafi/Hanbali; later Shafi'i/Maliki); consult a scholar for distribution". v1 does not distribute among dhawu al-arham.
9. **Special cases:**
   - **'Umariyyatayn:** spouse + father + mother (and no children or multiple siblings) → mother gets 1/3 of the **remainder**. Same in all four schools.
   - **Grandfather with siblings:**
     - `hanafi` (Abu Hanifa's view): the grandfather excludes full and paternal siblings, like the father.
     - `shafii`, `maliki`, `hanbali` (and the sahibayn): muqasamah. The grandfather takes the best of (sharing as a brother, 1/3 of the remainder, 1/6 of the total), with the Zayd ibn Thabit method. Include the **Akdariyyah** case (husband, mother, grandfather, full sister) for those three schools.
   - **Mushtarakah (Himariyyah):** husband + mother/grandmother + ≥ 2 maternal siblings + full brother(s).
     - `maliki` and `shafii`: the full brothers share the 1/3 equally with the maternal siblings.
     - `hanafi` and `hanbali`: the full brothers are excluded (nothing left).
   - **Paternal grandmother with father:**
     - `hanbali`: not excluded by the father (her son).
     - the others: excluded.
10. **Tashih:** find the smallest base so that every head gets an integer number of shares. Output per heir type: fraction, per-head fraction, percentage, amount (if estate given), and the explanation steps.

**Core share table** (encode as data; tests cover each row; scholar-verified):

| Heir                 | Share                                                                                            | Excluded by (all schools unless noted)                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Husband              | 1/2; 1/4 with a descendant heir (child / son's child)                                            | —                                                                                                        |
| Wife / wives         | 1/4; 1/8 with a descendant heir; shared equally                                                  | —                                                                                                        |
| Father               | 1/6 with male descendant; 1/6 + residue with only female descendants; residue with no descendant | —                                                                                                        |
| Mother               | 1/6 with descendant or ≥ 2 siblings (any type); else 1/3; 'Umariyyatayn 1/3 of remainder         | —                                                                                                        |
| Daughter(s)          | 1/2 one; 2/3 two+; residuary 2:1 with son(s)                                                     | —                                                                                                        |
| Son's daughter(s)    | 1/2 / 2/3 when no daughter; 1/6 with exactly one daughter; residuary with son's son              | Son; 2+ daughters (unless a son's son makes her residuary)                                               |
| Paternal grandfather | As father when father absent (see grandfather-with-siblings)                                     | Father                                                                                                   |
| Grandmother(s)       | 1/6 (shared if two)                                                                              | Mother (both); father excludes paternal GM except `hanbali`                                              |
| Full sister(s)       | 1/2 / 2/3; residuary with full brother 2:1; residuary with daughters                             | Son, son's son, father; grandfather (`hanafi`)                                                           |
| Paternal sister(s)   | 1/2 / 2/3; 1/6 with exactly one full sister; residuary with paternal brother                     | Above + full brother, 2+ full sisters (unless paternal brother), full sister as residuary-with-daughters |
| Maternal sibling(s)  | 1/6 one; 1/3 two+ shared equally (male = female)                                                 | Any descendant heir; father; grandfather                                                                 |
| Residuary males      | Remainder by class/degree/strength                                                               | Nearer residuary                                                                                         |

**UI:**

- Route `/mirath`: a wizard asking the deceased's gender, then spouse, children, parents, siblings, extended relatives. Each step is skipped when an earlier answer makes it irrelevant.
- Results show:
  - a pie/bars chart (follow `chart-rtl.ts`)
  - a table
  - "Why?" per heir, from the step log
  - school switch to compare all four side by side (highlight the differences)
- **Disclaimer is always visible:** "Educational calculator — confirm with a qualified scholar / court."
- The wasiyyah links into this; it is also reachable from the Library under "Learn → Fiqh tools".

**Testing / release gate (D6):**

- ≥ 150 fixtures in `packages/shared/src/mirath/__fixtures__/*.json`. Each fixture records `{ input, expected per school, source, verifiedBy, verifiedAt }`.
- Cover every row of the share table, every 'awl base, radd with and without a spouse, 'Umariyyatayn, Mushtarakah, Akdariyyah, and grandfather-with-siblings variants.
- Cross-check against ≥ 2 established independent calculators. Record any discrepancies and how they were resolved.
- **The feature flag `mirathEnabled` stays off in production until every fixture has `verifiedBy`.**

---

### NF-3.15 Tajweed error coaching (Quran Lab)

**Goal.** Turn Qur'an practice results into targeted tajweed practice, within the honesty limits of the current Quran Lab SDK.

**Current constraints:**

- From `lib/quran-companion/pronunciation/judge.ts`: the SDK scores nothing, and `model.reference` is null. So the app **cannot align a take to an ayah** or detect a tajweed mistake inside an ayah.
- Only three heads are drillable: `qalqalah`, `ghunna`, `gemination`. A head is judged only when its calibration status is `validated`.
- Copy rules: the result is one of three lines, a rule is never named as broken, and no score is ever shown.
- Tilawa and Quran Lab never run in the same session. The SDK owns the microphone.

**Phase A (buildable now): "Coaching plan from your practice":**

1. **Input:** `PracticeSummary.weakAyahs` (from `lib/quran-companion/types.ts`) from the last N sessions, plus the current hifz/revision queue (`due-queue.ts`).
2. Fetch the tajweed markup for those ayahs (`api/quran-tajweed.ts`, `parseTajweedMarkup`).
3. Count rule occurrences per `TajweedRuleId`.
4. Map the rules to drill heads:
   - `qalqalah` → `qalqalah`
   - `ghunnah`, `idgham_ghunnah`, `ikhafa`, `ikhafa_shafawi`, `iqlab`, `idgham_shafawi` → `ghunna`
   - letters with shaddah (detected from the Uthmani text) → `gemination`

   Rules with no head (madd variants, `ham_wasl`, `laam_shamsiyah`) → "listen and repeat" cards that use the reciter audio and `quran-word-timing.ts`, with no judging.
5. **Rank:**

   ```
   score(head) = occurrences in weak ayahs × (1 + recentTryAgainRate(head))
   ```

   Pick the top 3 drills. **Example words come from the user's own weak ayahs** (word-level segments), not generic lists.
6. **Drill history store** `tajweed_coaching`, a blob entity:

   ```ts
   interface TajweedCoachingState {
     heads: Record<DrillHeadId, { attempts: number; matched: number; tryAgain: number; notSure: number; lastAt?: string; nextDueAt?: string }>;
     plan?: { createdAt: string; items: Array<{ head: DrillHeadId | `listen:${TajweedRuleId}`; words: Array<{ surah: number; ayah: number; wordIndex: number }> }> };
   }
   ```

   Spacing reuses the `revision-schedule.ts` intervals. A `matched` result pushes `nextDueAt` out; `try-again` brings it in.
7. **Surfaces:**
   - "Practise these sounds" card on `/quran/practice/summary`
   - the "Coaching" tab on `/learn-quran/tajweed`
   - an optional daily item in the revision reminder
8. **Copy (reviewed):**
   - Use "These ayahs include qalqalah — let's practise it with words from your recitation."
   - **Never** "you made a qalqalah mistake", because the weak ayahs come from word mismatches, not tajweed judgement. Unit-test that this copy key is used.
9. **Privacy:** no audio leaves the device. Respect the Quran Lab `SharingState` toggle as-is.

**Phase B (unblocked by D25; uses our own alignment, not the SDK):**

- **Word windows:** NF-3.24's CTC forced aligner (`lib/quran-pronunciation/ctc-align.ts`) gives a time window for every word of the ayah the user recited.
- **Per-word coaching:** inside a tajweed rule's span (from `parseTajweedMarkup`), a word that NF-3.24 marks "Listen again" becomes a coaching card for that rule ("This word has ghunnah, listen to the reciter and try it again"). The card uses the reciter's word audio and the user's own take, held in memory only.
- **This is not a tajweed judgement.** The card says the word wasn't clear and names the rule it contains, never "you broke the rule". The same three-line verdict, no scores.
- **Head-level judging inside an ayah** (qalqalah, ghunna or gemination firing correctly within the recited ayah) still needs the Quran Lab SDK to accept external audio or alignment. That stays out of scope until it does; track it in `BACKLOG.md` as "Quran Lab: per-ayah alignment".
- If spike S4 (alignment accuracy) fails, Phase B falls back to Phase A cards (D24).

**Phase C:**

- **Madd duration:** measured from the aligned frame spans of long vowels, compared with the same span in reference recitations (D23 eval). It ships only if the eval shows it separates 2/4/6-count madd reliably; otherwise it stays out (D24).
- **Makharij feedback:** stays out of scope until a validated head exists.

### NF-3.20 Hands-free tasbeeh (voice counting, on-device)

**Goal.** The user says the zikr out loud and the counter counts it, with no tapping. Every phrase that is recognised goes through the same `onCount` path as a tap, so the NF-3.19 designs (a bead slides, the ring fills) and haptics all respond. All recognition runs **on the device**, using the speech stack that Qur'an practice already ships (D3).

**What the codebase already gives us (verified 2026-11-20):**

| Piece                                                                                            | Reuse                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/quran-companion/audio/capture.{native,web}.ts` (`RecitationCapture`)                        | Microphone capture as **16 kHz mono float32**: `expo-audio` `useAudioStream` on native, `getUserMedia` on web. Includes the resampler, permission handling and interruption events. Nothing is written to disk. **Reuse as-is.**                               |
| `lib/quran-companion/audio/audio-mode.ts`, `resample.ts` (`createChunker`)                       | Audio session setup and chunk queueing with a drop cap. **Reuse.**                                                                                                                                                                                             |
| `lib/quran-companion/model/*` + `constants/recitation-models.{ts,json}`                          | Pinned (sha256 + md5) download, storage and verification of the listener model, plus the download job and the Settings → Offline data management. **Reuse the same files.** A user who already downloaded the model for Qur'an practice downloads nothing new. |
| FastConformer ONNX (`fastconformer_full_mixed.onnx`, 88 MB, NVIDIA **CC-BY-4.0**) + `vocab.json` | `tilawa-adapter.ts` already runs this model with our own runner and receives the raw **CTC `logprobs` [timeSteps × vocabSize]**. That gives a phrase spotter direct access to the model's output, without the Qur'an-only recognition session.                 |
| `onnxruntime-react-native` 1.24.3 / `onnxruntime-web` 1.31.1 (`/ort/` UMD)                       | Inference runtime on all platforms. **No new native dependency.**                                                                                                                                                                                              |
| `lib/quran-companion/availability.ts`, `error-codes.ts`                                          | The TV gate (TV has no microphone path) and Sentry reporting that uses error codes only.                                                                                                                                                                       |
| `expo-keep-awake` (installed)                                                                    | Keeps the screen on while listening.                                                                                                                                                                                                                           |

**What we can't reuse, and why:**

- **The `@tilawa/core` recognition sessions** (`createZipformerSession`, `createRecognitionSession`) are built to match the **Qur'an corpus** (`zipformer_quran.json`, `quran_ctc_tokens.json`). Most adhkar phrases are not ayahs, so these sessions can't count them. We use the **model**, not the session.
- **Quran Lab TajweedFormer** (`modules/munib-tajweedformer`) needs an API key, works one take at a time, and outputs tajweed heads (qalqalah, ghunna and so on). It does not recognise words, so it doesn't fit this task.
- **OS speech recognition** (`expo-speech-recognition`, already used for dictation in `lib/stt.ts`) is rejected for this feature for three reasons. On web and on many Android devices it sends audio to a cloud service, which breaks D3. It drops or merges fast repeated phrases. Its `ar-SA` model isn't tuned for dhikr pronunciation.

**Islamic basis and guardrails.**

- Zikr is valid whether it is said quietly or aloud, and quiet zikr is praised (Qur'an 7:205; verify). The feature **never** encourages raising the voice. It is tuned to work with a **low speaking voice**, and the copy says that silent zikr and tap counting are just as good.
- **Accuracy is the top priority:** a count should never go up for something the user did not say. When the spotter is unsure, it **doesn't count**, and the user can always tap. Over-counting is treated as a bug that blocks release; a few missed counts are acceptable (see the targets below).
- No transcripts, audio, scores or "pronunciation grades" are stored or shown. This is a counter, not an assessment.
- Allowed during excused periods (zikr is allowed in hayd). There is no gating by excused status.

**Scope (v1):**

- **iOS and Android phones and tablets.** Web comes in v1.1, with the model served from a CDN bucket (D18). TV is hidden through `isPracticeAvailable()`.
- **Each counter listens for a single phrase.** `tasbeeh/[zikrId]` listens for that zikr's phrase. `tasbeeh/free` and `tasbeeh/custom/[id]` ask the user to choose a phrase from the catalog. A custom counter with no catalog phrase does not offer voice counting in v1.
- **v1 phrase catalog** (`lib/tasbeeh-voice/phrases.ts`). Each phrase points to an existing **adhkar dataset id**; the Arabic text is never hand-typed (§2.1). Each phrase also lists accepted variants:

  | key              | Phrase (from dataset)              | Variants accepted                |
  | ---------------- | ---------------------------------- | -------------------------------- |
  | `subhanallah`    | SubhanAllah                        | —                                |
  | `alhamdulillah`  | Alhamdulillah                      | —                                |
  | `allahu_akbar`   | Allahu Akbar                       | —                                |
  | `tahlil`         | La ilaha illallah                  | —                                |
  | `istighfar`      | Astaghfirullah                     | + "al-'Azim", + "wa atubu ilayh" |
  | `subhanallah_wb` | SubhanAllahi wa bihamdihi          | + "SubhanAllahil-'Azim"          |
  | `hawqala`        | La hawla wa la quwwata illa billah | —                                |
  | `salawat_short`  | Allahumma salli 'ala Muhammad      | + "wa 'ala ali Muhammad"         |

- **v2:** the long tahlil ("…wahdahu la sharika lah…"), longer duroods, post-salah sequence mode (33 / 33 / 33–34, moving to the next phrase automatically), and an optional pause-based mode for custom phrases (below).

**Detection pipeline** (`lib/tasbeeh-voice/`; all pure logic with unit tests except the runner):

```
RecitationCapture (16 kHz) → chunker → VAD (speech segments) → FastConformer runner (ORT, CTC logprobs)
   → phrase spotter (CTC keyword scoring per phrase token sequence) → hit de-dupe (absolute frame time)
   → confidence gate → onCount("bead") → face + haptics
```

1. **VAD (`vad.ts`).** An energy detector with an adaptive noise floor, a hangover of about 300 ms and a minimum segment length. Silence never reaches the model, which saves battery. During long continuous speech (fast repeated zikr), segments are split into windows of about 3 s with a 1 s overlap.
2. **Runner (`engine/ctc-runner.ts`).** Pull the FastConformer `runner.run()` code out of `tilawa-adapter.ts` into a shared `createFastConformerRunner(ort, session)`, so Qur'an practice and voice tasbeeh use the same code. The ORT session is created lazily and released when listening stops.
3. **Phrase tokens (`phrase-tokens.json`, generated).** A build script, `scripts/build-tasbeeh-voice-tokens.mjs`, tokenises each catalog phrase and its variants (Arabic text taken from the dataset) against the **pinned** `vocab.json`. It writes the token sequences together with the model `version`. A unit test fails if the version doesn't equal `RECITATION_MODELS["tilawa-fastconformer"].version`, so any model change forces the tokens to be regenerated. The generated file is never edited by hand.
4. **Spotter (`ctc-keyword-spotter.ts`).** For the expected phrase, run a streaming CTC keyword search: token passing that allows any audio before and after, so it can find **back-to-back repeats** with no pause. Each hit has a start frame, an end frame and a score, which is the phrase log-likelihood normalised against the best free path (a likelihood ratio). Spike S1 compares this against "greedy decode + fuzzy match with `normalize()`" and keeps whichever meets the targets.
5. **De-dupe (`hit-dedupe.ts`).** Hits are merged by absolute time across overlapping windows. Hits closer together than the phrase's minimum length (measured per phrase, for example about 350 ms for SubhanAllah) are merged into one, so overlapping windows can never count the same phrase twice.
6. **Confidence gate.** Two settings: _Strict_ (default) and _Balanced_. An optional **personal calibration** ("Say SubhanAllah 5 times") stores a per-phrase threshold offset on this device only (not synced). It helps with accents, children's voices and quiet speech.

**Session controller (`session.ts`) and hook (`hooks/use-voice-tasbeeh.ts`):**

- **Only one owner of the microphone.** Voice counting can't start while Qur'an practice, Quran Lab drills or dictation are using the microphone, and starting it stops theirs.
- **The app's audio player is paused** when listening starts, because recitation playing through the speaker would cause false counts. NF-3.19 counter sounds are muted while listening; haptics stay on.
- **Stops automatically:**
  - when the target is reached (success haptic, mic off)
  - after a stretch of silence (default 60 s, with a "Paused listening" toast)
  - when the app goes to the background (`AppState`). There is **no background microphone**; this is out of scope for privacy and store-review reasons.
  - when audio is interrupted (a call or Siri)
  - when the user leaves the screen
- **Screen-reader conflict:** while listening, VoiceOver and TalkBack count announcements are limited to milestones and **the spotter ignores audio during an announcement**. Otherwise the phone's own speech could be counted.
- Taps still work while listening, and Undo is still confirmed. All counts go through the same shell limit, so voice can never go past the target.

**UI** (part of the NF-3.19 shell):

- **Hands-free toggle.** A mic `IconButton` in the counter's `ControlBar`. It only appears when `isVoiceTasbeehAvailable()` is true and the counter's phrase is in the catalog.
- **First use:** an explainer sheet covering:
  - how it works and that everything stays on the device
  - model size (about 103 MB, **shared with Qur'an practice**) and a Wi-Fi recommendation
  - that a low voice is enough, and that tapping is just as good
  - then the microphone permission request

  The sheet reuses the download job and progress UI from Qur'an practice.
- **While listening:**
  - a pulsing mic chip and a small level meter
  - the phrase being listened for, in Arabic from the dataset with its translation
  - a soft "✓" flash on each counted phrase
  - keep-awake on
  - a suggestion to switch to the NF-3.19 Focus/Night design
- **Stuck hint:** if the VAD hears speech but nothing has been counted for 10 s, show "Say the phrase clearly, or tap to count". Never "you said it wrong".
- **Settings → Tasbeeh counter → Hands-free counting:** sensitivity (Strict / Balanced), auto-stop after silence (30 / 60 / 120 s), calibration, and a link to model storage (Settings → Offline data).
- i18n in all 24 locales, accessibility labels, and RTL checked.

**Preferences and storage:**

```ts
// UserPreferences (synced through the existing `preferences` entity; optional, so old clients are fine)
tasbeehVoice?: { sensitivity: "strict" | "balanced"; silenceStopSec: 30 | 60 | 120 };

// device-local (not synced, not backed up), like DB_KEYS.quranRecitationModel
DB_KEYS.tasbeehVoiceCalibration → Record<PhraseKey, { thresholdOffset: number; at: string }>
```

The model files and manifest stay in the existing Qur'an practice store. There is no new sync entity.

**Availability (`lib/tasbeeh-voice/availability.ts`):**

- `isPracticeAvailable()` (not TV), **and**
- microphone capture is available, **and**
- the FastConformer engine is pinned for the platform (native in v1; web once `webHosted` is turned on for the CDN-bucket copy, D18), **and**
- the phrase is in the catalog.

If the user has only the **Zipformer** model installed, offer the FastConformer download. Spike S1 also checks whether the Zipformer ONNX output is CTC; if it is, Zipformer is supported too (it is already web-hosted, NPL-1.2, and must stay free).

**Spikes before building:**

- **S1 – engine and spotter.**
  - On 3 real devices (low-end Android, mid-range Android, an iPhone that is a few years old), measure FastConformer real-time factor and memory on windows of about 3 s.
  - Confirm the CTC frame rate and that the vocab covers the dhikr tokens.
  - Compare the two spotter approaches on the fixture set.
  - Check whether Zipformer outputs CTC.
- **S2 – fixtures.**
  - **Built from audio the app already streams (D23); no new recordings and no storage of our own.** `pnpm --filter app tasbeeh-voice:eval` downloads, at eval time, the adhkar and dua recordings for each catalog phrase (`lib/audio-tracks.ts` sources), caches them in a gitignored folder, and never commits them.
  - **Variety by augmentation:** speed 0.8–1.4×, pitch ±3 semitones, low-volume and whisper-like filtering, and room reverb plus car, fan and crowd noise. Back-to-back repeats are spliced to test fast counting.
  - **Negatives:** Qur'an recitation from several reciters (everyayah) and word-by-word audio, the other catalog phrases (SubhanAllah must not count as Alhamdulillah), and silence and noise beds.
  - **Cross-check:** a count is labelled correct only when the Zipformer and FastConformer transcripts of the same clip agree with the expected phrase. Clips where they disagree are excluded and listed in the proof log.
  - The unit suite uses only synthetic logprob matrices; no audio is committed.
  - Results go in a proof log, like the one for Qur'an practice. Gates are reported as "measured on reference + synthetic audio".

**Acceptance criteria (release gate):**

- **Over-count rate ≤ 0.5%** (no more than one false count per 200 phrases), counting negatives and cross-phrase confusions, on the whole fixture set at the Strict setting.
- **Missed count rate ≤ 5%** at normal pace and ≤ 10% at fast pace, in quiet and moderate noise.
- **Latency:** p90 of 1.2 s or less from the end of a phrase to the count on a mid-range device. Real-time factor of 0.5 or less on the low-end device.
- **Battery:** 10 minutes of continuous listening uses no more than about 4% on the mid-range device. The VAD has to keep the model idle during silence.
- Overlapping windows never produce a double count (unit-tested with synthetic hits).
- The count never goes past the target. The app's audio is paused, and counter sounds are muted, while listening.
- No audio, transcript or phrase text appears in Sentry, logs or sync. Error codes only.
- Scholar sign-off on the copy, the catalog and the "quiet zikr is fine" framing.

**Tests:**

- Unit tests for `vad`, `ctc-keyword-spotter` (synthetic logprob matrices: single hit, back-to-back repeats, the wrong phrase, silence), `hit-dedupe`, the token-file version lock, `availability` and the session state machine (start, hit, target reached and auto-stop, silence, background, interruption).
- Hook tests with mocked capture and runner. These run the face's `onCount` exactly once per hit.
- Fixture regression is a local or manual script (`pnpm --filter app tasbeeh-voice:eval`) that writes the proof log. It is **not** a CI job (upgrade policy: no new CI jobs).

**Store and privacy:**

- Reuse the existing microphone usage strings, extending `NSMicrophoneUsageDescription` and the Android rationale to mention tasbeeh counting.
- The Play Data safety form still says audio is "not collected" (it never leaves the device). Add a line to the privacy policy.
- Show FastConformer CC-BY-4.0 attribution in About → Credits; it is already required for Qur'an practice.

**Risks:**

- The model was trained on Qur'an recitation, so it may be biased toward Qur'anic word forms. Mitigation: CTC keyword scoring is limited to the expected phrase, plus calibration. If S1 fails, fall back to v2's pause-based mode and label it clearly.
- Fast, slurred dhikr ("subhanallah-subhanallah…") may be under-counted. This is acceptable because the user taps any missed counts, and it is stated in the explainer.
- Web hosting the 88 MB file: served from a CDN bucket (D18), so Vercel's static file limits don't apply.

**Optional v2 mode – "Pause count (basic)":** every separate spoken burst found by the VAD counts once. There is no model and no download, and it works for any custom phrase. It is shown only as an opt-in labelled "Counts each pause — less accurate", is off by default, and is never used for catalog phrases.

---

### NF-3.4 Umrah mode (live guided)

**Goal.** A step-by-step companion during Umrah, beyond the existing checklist (`/umrah/checklist`, `umrah-checklist.ts`).

**Islamic basis:** follow the existing `hajj-guide.ts` / `umrah-checklist.ts` refs. For the corner dua: Abu Dawud 1892 ("Rabbana atina…" between the Yemeni corner and the Black Stone). **There is no fixed dua per lap**; the copy must say so and offer the user's own duas.

**Steps (state machine):**

```
prepare → miqat → ihram → talbiyah → arrive_haram → tawaf(7) → two_rakah_behind_maqam → zamzam → sai(7) → halq_taqsir → complete
```

- **Prepare:** packing and ihram checklist (existing checklist content); prohibitions of ihram card; intention wording from the dua dataset.
- **Miqat alert:**
  - Miqat coordinates (Dhul-Hulayfah, al-Juhfah/Rabigh, Qarn al-Manazil/as-Sayl al-Kabir, Yalamlam, Dhat 'Irq) come from **OSM/Wikidata** by id. Store them in the content dataset with source ids; do not hand-type coordinates.
  - **By land:** foreground location proximity (≤ 20 km) → "Approaching miqat".
  - **By air:** a manual "My flight crosses the miqat at ~HH:MM" timer, because GPS in flight is unreliable. Note: many airlines announce it.
- **Talbiyah:** audio from the bundled/remote OSS audio (`classify-oss-audio-uri.ts`) and text from the dataset.
- **Tawaf counter:**
  - 7 big tap targets, with haptic per lap and an undo.
  - "Start at the Black Stone line" hint.
  - Optional per-lap timer.
  - Keep-awake (`audio-keep-awake.ts` pattern).
  - Doubt rule card: "If unsure, build on the lesser number" (madhhab-neutral, scholar check).
- **Sa'i counter:** 7, Safa → Marwah = 1. The UI shows the current direction.
- **Halq/taqsir:** men choose between shaving and shortening (shaving preferred); women shorten a fingertip's length. Then "Umrah complete — congratulations" and the dua prompt.
- **Women:** if `activeExcusedReason === "hayd"`, the tawaf step is locked with an explanation (tawaf requires purity per the majority). Sa'i guidance is per madhhab note. Offer the "wait" guidance from the existing guide.

**Data:**

```ts
interface UmrahSession {
  id: string;
  startedAt: string;
  step: UmrahStep;
  tawafLaps: number;
  saiLaps: number;
  log: Array<{ step: UmrahStep; at: string }>;
}
```

- Stored in blob entity `umrah_sessions`. It extends the existing `umrah_checklist` and does not replace it.
- **Offline-first:** everything works without a network.

**Watch:** a tawaf/sa'i counter on Apple Watch / Wear OS (DS-2 targets), v2.

---

### NF-3.21 Ayah personal notes & annotations

**Goal.** Let the user write their own reflections (tadabbur) on any ayah or ayah range, highlight ayahs or words in a colour, tag them, and find them again from the reader, the Bookmarks hub and search. Notes are the user's own words. They are never presented as tafsir.

**Islamic basis:**

- Qur'an 38:29 ("…that they might reflect upon its verses") and 47:24, as the reason to reflect and write.
- Copy rule: a note is always labelled **"My note"**. It is never shown inside, or styled like, the tafsir panel, so a personal reflection can't be mistaken for scholarship.

**What exists today (verified 2026-11-23):**

- `QuranBookmark` (`db/repositories/quran-repository.ts`) is only `{ id, surah, ayah, createdAt }`. It syncs as the single-record entity `quran_bookmarks` (`sync/records.ts`). There is no note or highlight field anywhere.
- The ayah action sheet (`components/quran/ayah-action-sheet.tsx`) already has play, bookmark, tafsir, practise and share actions as `LabeledIconButton`s. Notes slot in next to them.
- `splitAyahWords()` in `lib/quran-companion/align-words.ts` tokenises the bundled Uthmani text offline. Word highlights reuse it.

**Data model** (`packages/shared/src/types/quran-notes.ts`):

```ts
export type AnnotationColorId = "gold" | "green" | "blue" | "rose" | "violet";

export interface AyahNote {
  id: string; // uuid
  surah: number;
  ayah: number;
  endAyah?: number; // inclusive range within the same surah
  body: string; // plain text, ≤ 5,000 chars; may be "" for a highlight-only annotation
  tags: string[]; // user tags, trimmed + lower-cased, ≤ 10 per note
  color?: AnnotationColorId; // highlight; resolved through theme tokens, never a raw hex
  words?: { start: number; end: number }; // optional word span (indexes into splitAyahWords of `ayah`)
  textHash?: string; // hash of the bundled ayah text when `words` was set
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // tombstone
}
```

- **Colours** build on the existing `CategoryHues` in `constants/theme.ts`: gold → `dawn`, blue → `sky`, rose → `rose`. Add `green` and `violet` there too, so the app has **one** palette of soft hues rather than two. Annotation tints are low-alpha fills of those hues, with dark-mode variants and a contrast test against `background` and the Arabic text colour. They never follow the user's accent, so a note's colour doesn't change when the theme does.
- **Word spans and content updates:** if `build:data` ever changes the bundled text of an ayah, `textHash` no longer matches. The note then falls back to a whole-ayah highlight and keeps working. Nothing is silently attached to the wrong words.

**Storage and sync** (follows §4.4):

- `DB_KEYS.quranNotes`, `stores/quran-notes-store.ts` (+ `useEnsureQuranNotesLoaded`). Memoised selectors: `notesByAyah`, `notesByTag`, `allTags`.
- Blob entity **`quran_notes`**: `Record<id, AyahNote>` with a **custom merge** (per-note LWW on `updatedAt`, tombstones win over older edits). Tombstones are garbage-collected after 90 days.
- Server: add `quran_notes` to `SYNC_ENTITIES`, with a payload cap of about 1 MB (roughly 2,000 notes). `pnpm generate:api`.
- Backup, wipe and `reload-all-stores.ts` as usual.
- **Locked (D15):** notes use the normal sync entity, **not** the vault (§4.2). They are reflections, not the sensitive records D2 covers.

**UI and routes:**

- **Ayah action sheet:** new "Note" and "Highlight" actions. "Highlight" opens a 5-swatch row and a "Clear" option. "Note" opens `components/quran/ayah-note-sheet.tsx`:
  - multiline input with `writingDirection` set automatically from the text (Urdu, Arabic and English notes all render correctly)
  - tag chips with autocomplete from `allTags`
  - colour swatches
  - an optional range end ("to ayah …")
  - optional dictation through the existing `lib/stt.ts`, with its existing disclosure
- **Reader:**
  - `ayah-reader.tsx`: a background tint for highlighted ayahs or word spans, and a small note glyph by the ayah number. Tapping the glyph opens the note.
  - Mushaf page mode (`page-layout-renderer.tsx`, `mushaf-line-renderer.tsx`): **word spans ship in v1 too (D15)**. They need spike **N1** first: find out whether the page-font line renderer can expose a box per word (for example, by rendering each word as its own text run and measuring it with `onLayout`), and confirm highlights stay aligned across font sizes, RTL, page zoom and TV scaling. If a page's font has no per-word runs, that page falls back to an ayah tint, and a test covers the fallback.
  - Wide web tier: a notes side panel next to the reader (uses the existing web large-screen width tiers).
- **`/quran/notes`:** all notes grouped by surah, filters by tag and colour, and a search bar using `createFuzzyIndex` from `lib/search.ts` over `body` and `tags` (follow `.agents/skills/fuse-js/SKILL.md`; no `new Fuse()` in the screen).
- **Bookmarks hub** (`app/bookmarks/index.tsx`): a "My notes" section with the 5 latest notes.
- **Universal search** (`app/search.tsx`): a "My notes" group, searched locally only. Notes never leave the device through search.
- **Export:** "Export notes" (one surah or all) as Markdown or plain text through the share sheet. Each note is headed by its ref (`2:255`). The ayah text is optional; when included it is rendered from the bundled corpus with the edition credit, never re-typed.
- **TV:** read-only. Highlights and notes are shown; editing is hidden, because text entry with a remote is poor.

**Notifications:** none.

**Tests:**

- merge: diverged edits on two devices, a tombstone against an older edit, a tombstone against a newer edit, tombstone GC
- selectors and tag normalisation
- the `textHash` fallback when the ayah text changes
- export formatting (ref headers, RTL bodies, edition credit)
- sheet and reader component tests: highlight tint, note glyph, TV read-only

**Acceptance criteria:**

- Saving a note works offline and appears immediately in the reader, `/quran/notes` and the Bookmarks hub.
- A note edited or deleted on one device shows the same state on a second device after sync.
- Note text never appears in Sentry, logs, notifications or analytics.
- i18n in all 24 locales; RTL checked; highlight colours pass the contrast test in both themes.

**Risks:**

- Large note sets on web localStorage (quota). Mitigation: the 1 MB cap, and a warning at 80% of it.
- Users pasting ayah text into a note: allowed (it's their own text), but the export only adds ayah text from the corpus.

---

### NF-3.22 Arabic root-word search

**Goal.** Search the Qur'an by Arabic root (for example ر ح م) and see every occurrence grouped by the words derived from it, with counts. From any word in word-by-word view, the user can open "all words from this root".

**Islamic basis and guardrails:**

- This is a linguistic study tool. Copy says: "Words that share a root are related in form; their meaning in each ayah depends on context. See the tafsir." It never implies that a root decides a ruling or an interpretation.
- **Roots come from a published morphology dataset, never from our own stemming.** The app looks a word up in the dataset; it doesn't guess a root with an algorithm (§2.1, "Content & data" in `AGENTS.md`). A word the dataset marks as rootless (particles, some proper nouns) is shown as such.

**What exists today:**

- Text search: `searchQuranAyahs()` in `lib/search.ts` (Fuse over `normalize()`-ed ayahs) and `/quran/search`.
- Word-by-word: `api/quran-words.ts` (cache-first from api.quran.com v4: `arabic`, `translit`, `gloss`, word audio). No root or lemma field is stored today.
- Word alignment between tokenisations: `lib/quran-companion/align-words.ts` (6,230 of 6,236 ayahs match the bundled word split; the known joins and splits are handled there).

**Data source (locked, D22; checked 2026-11-23):**

- **Dataset:** the original **Quranic Arabic Corpus morphology v0.4** (Kais Dukes, 2011), used **unmodified**.
- **What its own header says:** GNU GPL; "Permission is granted to copy and distribute verbatim copies of this file, but CHANGING IT IS NOT ALLOWED"; "This annotation can be used in any website or application, provided its source (the Quranic Arabic Corpus) is clearly indicated, and a link is made to http://corpus.quran.com"; and the notice "shall be reproduced appropriately in all works derived from" the file. The file also carries the Tanzil Uthmani 1.0.2 notice (CC BY-ND 3.0).
- **Ruled out:**
  - api.quran.com v4 returns no root, lemma or stem fields. I tested `word_fields=root,lemma,stem` on 1:2 and none came back.
  - The `mustafa0x/quran-morphology` fork is a _modified_ copy with no licence of its own, so it can't be used under D12.
- **Where it comes from (no self-hosting):**
  - Two independent public GitHub copies are **byte-identical after line-ending normalisation**: sha256 `910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d`, 6,181,227 bytes with LF endings. Both keep the full copyright block. GitHub's media host serves them with `Access-Control-Allow-Origin: *`.
  - Pinned URL: `https://media.githubusercontent.com/media/AhmedSaadi0/quran-words/a6d4217a9e1422978c367eadc833ff4883db77fb/data/quranic-corpus-morphology-0.4.txt`.
  - Fallback mirror: `ezAldinWaez/quran-etl@6539e2de6c`, a CRLF copy that gives the same hash after `\r` is stripped.
  - The app checks the hash of the LF-normalised file and rejects anything else.
  - Before release, compare once against the official download at corpus.quran.com/download and record the result in the proof log.
- **Credits:** "Quranic Arabic Corpus (morphology v0.4), © Kais Dukes, GNU GPL — corpus.quran.com" with a link, plus the full notice text in About → Credits, as the terms require. Add a `manifest.json` entry of type "remote, fetched on demand".

**On-device index** (D22: the file is never changed or bundled; the index is built from it on the device):

1. **Fetch** (`api/quran-morphology.ts`): cache-first, like `quran-remote.ts`, and only when the user first opens root search or a root chip. The sheet shows "Download word-root data (6 MB)" and follows `wifiOnlyDownload`. The raw file is kept unmodified in the content cache and appears in Settings › Data & storage › Offline data.
2. **Verify** the LF-normalised sha256. On a mismatch, delete the file and report error code `morphology-hash`.
3. **Parse** (`lib/quran-morphology/parse.ts`, pure): rows `(s:a:w:seg)  FORM  TAG  FEATURES`; take `ROOT:` and `LEM:` from the stem segment of each word (49,968 `ROOT:` tags in v0.4); convert Buckwalter to Arabic with a tested mapping table. It runs off the UI thread in chunks (`InteractionManager` on native, a web worker on web).
4. **Build** the index:
   - root → lemma → `[surah, ayah, word]`, packed and delta-encoded
   - `form → root` for whole-word lookups
   - per-root counts

   The index is persisted as a derived cache (`DB_KEYS.quranRootIndex`, device-local, rebuildable, never synced) tagged with the source hash. It's rebuilt only if that hash changes.
5. **Align** QAC word locations to the bundled word split (`splitAyahWords`, `align-words.ts`). QAC numbers words over Tanzil Uthmani 1.0.2, so the join/split table from `align-words.ts` is reused. A dev script, `pnpm --filter app morphology:verify`, runs the full alignment against the bundled text, must report 0 unexplained mismatches, and writes a proof log. A word that can't be aligned is shown at ayah level, never attached to the wrong word.

**Engine** (`apps/app/src/lib/quran-roots.ts`, pure, unit-tested):

- `parseRootQuery(input)`: accepts `ر ح م`, `رحم`, `ر-ح-م`, and Buckwalter or Latin (`rHm`, `r-h-m`). Latin input is ambiguous (h → ه or ح), so it returns several candidate roots. Hamza forms (أ إ آ ؤ ئ ء) and alif maqsura are folded to the dataset's convention.
- `lookupRoots(query)`: exact root match first. Otherwise, a whole word ("الرحمن") is looked up in the `form → root` index. If nothing matches, it returns no root and the UI offers normal text search instead.
- `getRootOccurrences(root)`: occurrences grouped by lemma, plus a per-surah distribution.
- "Did you mean" over the root list uses `createFuzzyIndex` (Fuse), as required for all search bars. The root match itself is exact.

**UI and routes:**

- `/quran/search` gets a **Text | Root** toggle. Arabic input of 2 to 4 letters that matches a root also adds a "Root" group to the top of the universal `/search`.
- **`/quran/roots/[root]`:**
  - the root letters, large, with the total count
  - lemma list with counts; the gloss shown for a lemma is taken from the word-by-word gloss of a real occurrence and labelled as such
  - occurrence list: ayah snippet with the matching word highlighted (from the alignment), tapping deep-links to `/quran/[surah]?ayah=`
  - a per-surah distribution bar chart (`chart-rtl.ts`)
- **Word-by-word:** a "Root: ر ح م →" chip on each word that has a root.
- **Letter picker sheet:** a 28-letter grid for users without an Arabic keyboard. It also serves TV (D-pad friendly).
- Root letters and Arabic words are never translated; UI strings in all 24 locales.

**Storage:** no user data. The raw file and the derived index are device-local caches (rebuildable, never synced, cleared from Offline data). Root queries may add an entry to the existing recent-searches list (`lib/search-history.ts`).

**Notifications:** none.

**Tests:**

- `parseRootQuery` (Arabic with and without separators, Buckwalter, ambiguous Latin, hamza folding)
- packed occurrence codec round-trip
- parser on a committed slice of the file (Al-Fatiha + Al-Baqarah 1–5, kept verbatim with its full copyright block): Buckwalter→Arabic, root and lemma extraction, rootless particles
- hash verification (LF and CRLF copies both pass, a changed byte fails), and index rebuilt only on a hash change
- alignment on the known join/split ayahs from `align-words.test.ts`
- screen tests for the toggle, the root page, the word chip and the first-use download sheet
- a bundle check that no morphology data is in the first-load chunk

**Acceptance criteria:**

- The file in use is byte-identical (after LF normalisation) to the pinned hash and is never modified. The Credits screen shows the full notice and the link.
- After the one-time download, a root lookup returns in under 50 ms, fully offline. The index build finishes in under 5 s on a mid-range phone without blocking the UI.
- `morphology:verify` reports 0 unexplained mismatches, and every occurrence deep-links to the right word in the reader.

**Risks:**

- **Third-party mirror disappears.** Mitigation: the commit is pinned, there's a second verified mirror, and the cached copy keeps working. If both mirrors vanish, root search shows "unavailable" for new installs (no self-hosting, by decision).
- Tokenisation differences between the dataset and the bundled text. Mitigation: `morphology:verify` and ayah-level fallback, never a silent shift.
- Latin transliteration ambiguity. Mitigation: show the candidate roots side by side.

---

### NF-3.23 Hadith audio

**Goal.** Listen to hadith through the shared mini-player (a single hadith, or a whole chapter or collection from a chosen point), with offline replay, without ever putting an inaccurate voice on the words of the Prophet ﷺ.

**Islamic basis and guardrails:**

- Bukhari 3461 ("Convey from me, even if it is one ayah") for the value of spreading hadith. Bukhari 110 (the warning against lying about the Prophet ﷺ) is the reason **accuracy gates every audio tier**. Verify both against the corpus.
- The hadith's reference and grade stay visible on screen while it plays, and the now-playing title is the reference (`Sahih al-Bukhari 1`).
- Audio is only ever attached **by reference** (`collection:number`). It is never matched to a hadith by fuzzy text comparison.

**What exists today (verified 2026-11-23):**

- `HadithItem.audioUri` exists in `packages/shared/src/types/hadith.ts`, but the bundled and remote hadith data almost never populate it.
- The audio cache: every remote track goes through `resolveCachedAudioUri()` (native `documentDirectory/munib-audio/`, web service worker bucket `munib-audio-v1`) and is cleared from Settings → Offline data.
- On-device TTS exists (`lib/tts.ts`), but **hadith audio doesn't use it** (D19).

**Scope (locked, D19): human recordings only.**

- **No device voice, in any language.** Hadith audio means licence-cleared human recordings only, in Arabic or in a translation.
- **If no recording source passes D12, the feature doesn't ship.** No play buttons appear, and nothing falls back to text-to-speech. A unit test asserts that `buildHadithTracks` never returns a TTS track.
- **Sources:** only recordings that are public **and** licensed for redistribution, each with a licence review in the proof log (D12). There is no self-hosting, so files stream from the licensed source's own public URL (or a public mirror with CORS), cache-first.
  - First targets: the bundled highlight sets (40 Nawawi, Riyad as-Salihin), because they are small and well known.
  - Candidates to evaluate: public-domain or CC recordings on archive.org, and publisher or masjid recordings under an explicit CC licence.
- **Builder** `scripts/build-data/build-hadith-audio.mjs`:
  - maps each licensed file to `collection:number`, measures duration
  - writes `assets/data/hadith/audio-index.json` (`collection → number → { url, durationSec, reciterId, lang }`) plus a manifest entry for Credits
  - fails the build if any entry doesn't resolve to an existing hadith
- Recordings play through the audio cache. Add each audio host to the service worker allowlist.

**Engine** (`apps/app/src/lib/hadith-audio.ts`, pure):

- `buildHadithTracks(items, { locale })`: one `AudioTrack` per hadith that has a recording, preferring the user's language, then Arabic. A hadith with no recording has no play button.
- `buildCollectionQueue(collection, fromNumber)`: continuous play over the recorded hadith only; remote collections are fetched cache-first through `api/hadith-remote.ts`.

**UI** (only when at least one recording source has passed review):

- Play button on recorded hadith in `hadith/[collection].tsx`, `hadith/daily.tsx` and the Bookmarks hub; "Play from here" in the collection header, and a "Has audio" filter.
- A source badge on the card and in the mini-player: "Recording: <reciter>".
- **Settings › Hadith, duas & adhkar › Hadith audio:** preferred recording language and "auto-play next".
- **TV:** playback is allowed.

**Storage and sync:** prefs only, as an optional `hadithAudio?: { preferLang?: string; autoNext: boolean }` in `UserPreferences`. There is no new entity.

**Notifications:** none.

**Tests:**

- `buildHadithTracks` (recording chosen by language, no recording → no track, **never a TTS track**)
- builder validation for `audio-index.json` (every entry resolves, duration present, licence recorded)
- the service worker allowlist includes each recording host
- component tests: the source badge, "Play from here", grade visible while playing, the feature hidden when the index is empty

**Acceptance criteria:**

- Play, pause, next and previous work across a collection in the mini-player, and on the lock screen on native.
- Cached recordings replay offline.
- No hadith text is typed, no audio is attached by text matching, and no synthetic voice is used.
- Credits list every recording source, with the licence review in the proof log (D11, D12).

**Risks:**

- **No licence-cleared recordings are found:** the feature doesn't ship (D19). That's an accepted outcome, not a blocker for the rest of the plan.
- A source URL disappears: cached files keep playing, and the next `build:data` drops the dead entries.

---

### NF-3.24 Qur'an pronunciation assessment

**Goal.** After the user recites an ayah they are reading, show, word by word, which words came through clearly and which are worth listening to again, with the reciter's audio for that word one tap away. It works on the device (D3), with no numeric score, and it never claims to replace learning with a teacher.

**How this differs from what exists:**

| Existing feature                            | What it checks                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Qur'an practice (`lib/quran-companion/*`)   | **Memorisation**: whether the right words came in the right order.                                                                    |
| Quran Lab drills (`pronunciation/judge.ts`) | One tajweed head (qalqalah, ghunna, gemination) on one drill word. The SDK can't align a take to an ayah (`model.reference` is null). |
| NF-3.15 Phase B                             | In-ayah tajweed coaching, **blocked on the Quran Lab SDK**.                                                                           |
| **NF-3.24 (this)**                          | **Pronunciation clarity of each word** against the known ayah text, using our own pinned FastConformer CTC model. No SDK dependency.  |

**Islamic basis and copy:**

- Qur'an 73:4 (recite with measured recitation, tartil).
- Bukhari 4937 / Muslim 798: the one who recites with difficulty has a double reward. This sets the tone for every result screen.
- Bukhari 5027 ("The best of you are those who learn the Qur'an and teach it"): a line on every result screen recommends checking recitation with a qualified teacher.
- Copy rules (the same as Quran Lab): each word gets one of three states, **Clear / Listen again / Not sure**. There is no score, percentage or grade, and the app never says a recitation is "correct", "valid" or "wrong". "Listen again" is amber, never red. When confidence is low the state is "Not sure".

**Pipeline** (`apps/app/src/lib/quran-pronunciation/`; all pure logic with unit tests except the runner):

```
RecitationCapture (16 kHz) → chunker → FastConformer runner (shared createFastConformerRunner, see NF-3.20) → CTC logprobs
   → expected token sequence for the ayah → CTC forced alignment (Viterbi with blanks) → per-token frame spans
   → per-token goodness of pronunciation (GOP) → group tokens to words (align-words) → calibrated verdict per word → UI
```

1. **Expected tokens (`ayah-tokens.ts`).** Spike S4 checks whether `quran_ctc_tokens.json`, which ships with `@tilawa/core`, matches the pinned FastConformer `vocab.json`. If it does, reuse it. If not, a build script tokenises the bundled Uthmani text against the pinned vocab, locked to the model `version` with the same test as NF-3.20's phrase tokens. The file is generated, never edited by hand.
2. **Forced aligner (`ctc-align.ts`).** Viterbi over the expected tokens with optional blanks and leading or trailing silence. Output: frame spans per token and the alignment cost.
3. **GOP (`gop.ts`).** For each token: the mean log posterior of the expected token over its frames, minus the mean log posterior of the best competing token over the same frames, normalised by duration.
4. **Word grouping.** Tokens map to engine words, and engine words map to study words through `align-words.ts`, including the 6 known joins and splits.
5. **Verdict (`verdict.ts`).** Per word: Clear if every token is above the calibrated threshold; Listen again if one token is clearly below it; Not sure otherwise, and also for very short tokens and when the alignment cost suggests the user read a different passage. If the whole take doesn't fit the ayah, the result is "Couldn't follow this ayah, try again" with no per-word marks.
6. **Calibration.** Thresholds per token class live in a pinned `pronunciation-calibration.json` produced by the eval script (S3). An optional device-local offset ("Read this ayah once to calibrate") helps with accents and children's voices. It isn't synced.

**Out of scope in v1:**

- Naming a letter as mispronounced, or suggesting a confusable letter (ح/ه, ع/ء, ص/س, ض/د, ط/ت, ق/ك, ذ/ز, ث/س, ظ/ز). This is v2, and only for the pairs the eval proves reliable.
- Madd length, ghunna and other tajweed rules (NF-3.15 covers the heads Quran Lab validates).
- Free recitation from memory. This mode assumes the user reads the ayah shown on screen; memorisation stays in Qur'an practice.

**UI and routes:**

- A **"Check pronunciation"** mode in Qur'an practice (`/quran/practice/session?mode=pronunciation`), and a "Check my recitation" action on the ayah action sheet for a single ayah.
- **Results** reuse `practice-word-row.tsx` and `practice-ayah-result.tsx` with the three new states. Tapping a word:
  - plays the reciter's word audio (`api/quran-words.ts`, audio.qurancdn.com), or the matching slice of the ayah recitation through `quran-word-timing.ts`
  - optionally plays the user's own take for that word, kept **in memory for the session only** and discarded when the screen closes
- A summary card, "Words to listen to again", feeds the NF-3.15 coaching plan **automatically** (D20): flagged words become its example words. The setting `companion.feedCoachingFromAssessment` (default on) turns it off, and lives in Settings › Qur'an › Practice.
- TV: hidden through `isPracticeAvailable()`.

**Storage and sync:**

- `PracticeSession` gains an optional `pronunciation?: { words: Array<{ surah; ayah; word; state }> }` inside the existing `quran_practice_sessions` entity. Old clients ignore it. There is no new entity, and no audio, GOP values or transcripts are stored or synced.
- Device-local: `DB_KEYS.quranPronunciationCalibration` (not synced, not backed up), like `DB_KEYS.tasbeehVoiceCalibration`.

**Availability:** the same gates as NF-3.20 (`isPracticeAvailable()`, microphone capture, FastConformer pinned for the platform). Native in v1, web once the FastConformer CDN-bucket copy is live (D18). Only one owner of the microphone at a time, and the app's audio player is paused while recording.

**Spikes before building:**

- **S3 – GOP validity.** The main risk is that a model trained on Qur'an recitation "hears" the expected text even when it was mispronounced, so GOP misses real errors. The fixture set follows D23 (no new recordings):
  - **Correct:** published recitations by several reciters (everyayah) with Quran.com word timings as ground truth. They are correct by construction.
  - **Errors, spliced from real audio:**
    - **substituted word:** replace a word with another reciter's recording of a confusable word, using word-by-word audio (for example a word with ح swapped for a near-identical word with ه, where both exist in the corpus)
    - **dropped word:** cut one word's span
    - **skipped ayah segment:** remove a span of several words
  - **Variety:** the same augmentation as NF-3.20's S2.
  - **Cross-check:** Zipformer recognition and the Quran Lab heads (where validated) must agree with each clip's label, or the clip is excluded and logged.
  - Audio is cached locally (gitignored) and never committed.

  Measure false "Listen again" on correct words and detection of the spliced errors. If GOP can't separate them, ship only "skipped or unclear words" (D24). Every gate is reported as "measured on reference + synthetic audio"; the app never claims this accuracy for real learners.
- **S4 – tokens and alignment.** Token compatibility (step 1), and word-boundary accuracy of the forced aligner against Quran.com word timings on reciter audio.

**Acceptance criteria (release gate):**

- **False "Listen again" on reference-recitation words ≤ 2%** (D23) at the default setting. This is the error that matters most: telling someone a correct word is wrong.
- Detection of spliced word errors ≥ 60% (D23). Below that, the feature is limited to skipped or unclear words.
- Word-boundary error p90 ≤ 80 ms against Quran.com timings on reciter audio.
- Verdict within 1.5 s after the user finishes an ayah of up to 30 s on a mid-range device.
- No score, percentage or "correct" wording anywhere (unit-tested copy keys). The teacher recommendation is always visible.
- No audio, GOP values or text in Sentry, logs or sync. Error codes only.
- D11 proof-backed review of the copy. Fixture annotations are checked against reference recitations (reciter audio + Quran.com word timings) and tajweed sources cited in the proof log. If S3 misses the gate, v1 ships only "skipped or unclear words" automatically (D20).

**Tests:**

- `ctc-align` with synthetic logprob matrices: a perfect path, a substituted token, a skipped word, silence padding, a different passage
- `gop` and `verdict` thresholds, including "Not sure" for short tokens
- token-file version lock against `RECITATION_MODELS`
- word grouping on the join/split ayahs from `align-words.test.ts`
- the session reducer and the hook with a mocked capture and runner
- Fixture regression is a local script (`pnpm --filter app quran-pronunciation:eval`) that writes a proof log and the calibration file. It is **not** a CI job.

**Store and privacy:** same as NF-3.20: microphone strings extended to mention pronunciation checks, Data safety still says audio is "not collected", and FastConformer CC-BY-4.0 attribution in Credits.

**Risks:**

- GOP validity (S3), as above.
- Accent bias: calibration offsets and the "Not sure" default reduce false flags.
- People may treat the result as an ijazah-like judgement. Mitigation: no scores, the three-state copy and the constant teacher line.

---

## 8. Phase 4 — Device & place

### NF-3.13 Salah focus lock — hard block from v1 (D4)

**Goal.** During a user-configured window around each salah, chosen apps are blocked until the user prays or the window ends.

**Islamic basis:**

- Qur'an 62:9: leave trade at the call to Jumu'ah.
- Qur'an 23:1–2: khushu.
- Qur'an 107:4–5: those heedless of their prayer.

**Settings** (`UserPreferences.focusLock`, synced; app selections are **device-local** because the iOS tokens are opaque and device-bound):

```ts
interface FocusLockPrefs {
  enabled: boolean;
  prayers: Array<ObligatoryPrayer | "jumuah">; // default all 5 + jumuah
  start: { anchor: "adhan" | "iqamah"; offsetMin: number }; // iqamah only offered when the home masjid has iqamah times (private or public, NF-3.11); else adhan. default adhan+0
  durationMin: number; // default 20, range 5–60
  unlockMode: "gentle" | "firm" | "strict";
  // gentle: "I'll pray now" unlock after a 10 s hold; firm: unlock only when the prayer is marked completed in-app;
  // strict: fixed until window end (marking prayed ends it early)
  emergencyUnlocksPerDay: number; // default 2, 0 allowed only in strict
  pauseWhileExcused: boolean; // default true (hayd/sick/travel)
  schedule: { weekdaysOnly?: boolean; quietDates?: string[] };
}
```

**Conditions (shared, `lib/focus-lock/plan.ts`, pure and unit-tested):**

1. Compute the windows for today and tomorrow from `prayer-times.ts` (and iqamah times if anchored). Respect `prayerReminderOffsets` and `prayer-tuning`.
2. Skip a window if any of these hold:
   - the prayer is already logged `completed`
   - an excused period is active and `pauseWhileExcused`
   - the date is in `quietDates`
   - for Jumu'ah, on non-Fridays (on Friday the Dhuhr window is replaced by the Jumu'ah window)
3. Merge overlapping windows (for example Maghrib → Isha at high latitudes).
4. **Marking the prayer completed** anywhere (app, widget, Siri intent, Watch) → `endWindowNow()`.
5. Every emergency unlock is counted and logged locally (no sync), and is shown in the weekly coach only as a neutral count.

**iOS implementation** (new Expo module `apps/app/modules/munib-focus-lock` plus `@bacons/apple-targets` extensions):

- **Frameworks:** FamilyControls, ManagedSettings, DeviceActivity (iOS 16+).
- **Authorization:** `AuthorizationCenter.shared.requestAuthorization(for: .individual)`.
- **App picker:** `FamilyActivityPicker` (SwiftUI, hosted in the module) → `FamilyActivitySelection`. Persist it, encoded, in an **App Group** container shared with the extensions.
- **Scheduling:**
  - `DeviceActivityCenter().startMonitoring(name, during: DeviceActivitySchedule(intervalStart:, intervalEnd:, repeats: false))` per window.
  - Plan 2 days ahead (≤ 12 activities; stay well under the system's monitored-activity limit, verify it on device).
  - Re-plan on app foreground, after prayer-time changes, and via a `BGAppRefreshTask`.
- **Extensions (targets):**
  - `DeviceActivityMonitor`: `intervalDidStart` → `ManagedSettingsStore().shield.applications = selection.applicationTokens` (plus categories); `intervalDidEnd` → `clearAllSettings()`.
  - `ShieldConfiguration`: custom shield with the app icon, "It's time for {prayer}", and the theme colors passed via the App Group.
  - `ShieldAction`: the "I've prayed / Open Munib" button. A shield **can't open the containing app directly**, so post a local notification "Tap to confirm your salah" that deep-links to `munib://mark-current` (the route `mark-current.tsx` exists). Marking there clears the store. "Emergency unlock" decrements the counter and clears the store, if allowed by `unlockMode`.
- **Entitlement:** `com.apple.developer.family-controls` on the app and all three extensions. **Distribution approval required (Phase 0 filing).**
- **Web/TV/visionOS:** unsupported. Show the soft in-app prompt only.

**Android implementation** (`modules/munib-focus-lock` Kotlin):

- **Permissions:**
  - `PACKAGE_USAGE_STATS`: user grants it in Settings via `ACTION_USAGE_ACCESS_SETTINGS`.
  - `SYSTEM_ALERT_WINDOW`: `ACTION_MANAGE_OVERLAY_PERMISSION`.
  - `FOREGROUND_SERVICE` and `FOREGROUND_SERVICE_SPECIAL_USE` (with a Play declaration).
  - `RECEIVE_BOOT_COMPLETED`.
  - `SCHEDULE_EXACT_ALARM`: reuse the existing NF-1.36 flow in `lib/notifications/exact-alarm.ts`.
- **App list for the picker:** a `<queries>` intent filter for `ACTION_MAIN` + `CATEGORY_LAUNCHER`. Do **not** use `QUERY_ALL_PACKAGES`.
- **Scheduling:**
  1. `AlarmManager.setAlarmClock` / `setExactAndAllowWhileIdle` at the window start.
  2. The receiver starts `FocusLockService` (foreground, specialUse, a low-priority ongoing notification "Salah focus on").
  3. The service polls `UsageStatsManager.queryEvents` for `ACTIVITY_RESUMED` every 750 ms.
  4. If the foreground package is in the blocklist, show the full-screen **overlay** (`TYPE_APPLICATION_OVERLAY`) with "Time for {prayer}", "I've prayed" (deep link into the app to mark it) and "Emergency unlock".
  5. Stop at the window end or on `endWindowNow()`.
- **Never block** our own app, the phone/dialer, SMS, emergency apps, or the default launcher and settings.
- **Background-activity launch:** overlays are exempt while the overlay permission is granted. Verify on Android 14–16.
- **Reboot:** `BOOT_COMPLETED` re-arms the next windows from cached times in shared prefs (the JS writes the plan JSON on every re-plan).
- **OEM battery killers:** link to a guide for whitelisting (Xiaomi, Samsung, Huawei). Reuse `dev:app:android:doctor` notes.
- **Accessibility API is not used** (Play policy).

**JS ↔ native contract** (`lib/focus-lock/native.ts`):

```ts
requestAuthorization(): Promise<"granted" | "denied">;
pickApps(): Promise<{ count: number }>;               // iOS picker / Android list UI
setPlan(windows: Array<{ id: string; prayer: string; start: string; end: string }>, cfg: { unlockMode; emergencyLeft }): Promise<void>;
endWindowNow(id?: string): Promise<void>;
status(): Promise<{ active: boolean; windowId?: string; emergencyLeft: number }>;
```

**UI:**

- Settings → "Salah focus", an onboarding flow:
  1. explain
  2. permissions, step by step with status checks
  3. pick apps
  4. choose prayers, timing and mode
  5. test with a 1-minute window
- Tracker header: "Focus active · ends 13:20".

**Tests:**

- `plan.ts` (windows, skips, merges, DST, high-latitude, Jumu'ah)
- the native contract mocked in Jest
- device QA matrix entries added to `BACKLOG.md`'s "On-device QA matrix"

**Risks:**

- Apple may deny the distribution entitlement. Fallback (locked, D17): ship the soft prompt with the hard block disabled on iOS (feature-flag `focusLockHardIos`).
- Play may reject `specialUse`. Fallback: an overlay triggered from the exact alarm only, without a service, with lower reliability.

---

### NF-3.11 Masjid finder & layer (replaces backlog NF-2.16) — D5

**Goal.**

- Find nearby masjids.
- Save a home masjid.
- Show iqamah and Jumu'ah times **only when they exist in publicly available data**.
- Log "prayed at the masjid".

**Islamic basis:**

- Bukhari 645: congregational prayer is 27 degrees better.
- Muslim 666: steps to the masjid.
- Bukhari 444: tahiyyat al-masjid.

**Principles (D5):**

- **No user-generated public data.** Munib Tracker users never submit, confirm, vote on or edit masjid times or details for other users.
- **No admin moderation.** There is no masjid queue in `apps/admin` and no masjid admin or claim flow.
- **Public data only.** Whatever the public source contains is shown with attribution. **If a field has no data, its UI is not rendered at all**: no empty states, no "unknown", no "add times" prompt.
- A user may keep **private times for their own home masjid**, entered manually or through on-device OCR (NF-3.12). These stay on that user's device (plus their own sync), are labelled "Your times", and are never sent to other users.

**Data sources:**

1. **OpenStreetMap via Overpass (v1, the only source).** Licence ODbL; show the attribution "© OpenStreetMap contributors" on every list and detail screen.
   - Query (radius ≤ 10 km, clamped server-side):

     ```
     [out:json][timeout:20];
     ( nwr["amenity"="place_of_worship"]["religion"="muslim"](around:{r},{lat},{lon});
       nwr["building"="mosque"](around:{r},{lat},{lon}); );
     out center tags;
     ```

   - **Tags used, each shown only if present:**

     | Tags                            | Shown as                                                 |
     | ------------------------------- | -------------------------------------------------------- |
     | `name`, `name:<locale>`         | Localised name; the app locale is preferred              |
     | `addr:*`                        | Address                                                  |
     | `website` / `contact:website`   | Website link                                             |
     | `phone` / `contact:phone`       | Phone link                                               |
     | `wheelchair`                    | Wheelchair badge                                         |
     | `toilets`, `toilets:wheelchair` | Facility badges                                          |
     | `denomination`                  | Info line                                                |
     | `service_times`                 | Parsed with an `opening_hours`-syntax parser (see below) |
     | `opening_hours`                 | Open/closed hint only                                    |

   - **`service_times` → Jumu'ah:**
     - Friday entries (`Fr HH:MM`) between 11:00 and 15:30 local are shown as "Jumu'ah (from OpenStreetMap)".
     - Other entries are shown verbatim as "Service times (from OpenStreetMap)". They are **not** reinterpreted as per-prayer iqamah times.
     - Unparseable values are hidden.
2. **Additional public timetable sources (optional, later).** These sit behind a pluggable `TimetableSource` adapter in the API. A source may be added **only after a licence review** confirms that redistribution in the app is allowed (open licence or written permission). Each source records:

   ```ts
   interface TimetableSource {
     id: string; name: string; licence: string; attribution: string; homepage: string;
     fetch(masjid: { osmId: string; lat: number; lon: number; name: string }): Promise<IqamahTimetable | null>;
   }
   ```

   - **No scraping** of sites whose terms forbid it.
   - **No guessing** a match between an OSM masjid and a source entry. Require an explicit id link, or name similarity ≥ 0.9 **and** distance ≤ 75 m; otherwise treat it as no data.
   - Candidates are listed in §13; none is assumed.

**API (`apps/api/src/masjids/`): a read-only proxy with no user data:**

- Overpass's public instances are rate-limited and their usage policy forbids heavy client traffic, so the API proxies and caches:
  - Cache key: geohash precision 5 (~5 km).
  - TTL: 7 days, in Redis (the `redis` module exists).
  - Cold misses are de-duplicated with a per-cell lock.
- On Overpass failure, serve stale cache up to 30 days old, then return an empty list with `stale: true`.
- **No Postgres tables and no migration.** Nothing is user-written, so there's nothing to moderate.
- **Privacy:** the client sends only the **geohash-5 cell**. The server returns all masjids in that cell plus its 8 neighbours, and the client sorts by exact distance locally. No user id is attached to masjid requests, and they're not logged with location.
- **Endpoints** (OpenAPI, then `pnpm generate:api`):

  ```
  GET /masjids?cell=<geohash5>   → { masjids: MasjidSummary[], attribution: string[], stale: boolean }
  GET /masjids/:osmType/:osmId   → MasjidDetail (tags + optional public timetable with source attribution)
  ```

**Types** (`packages/shared/src/types/masjid.ts`):

```ts
type MasjidSummary = {
  osmType: "node" | "way" | "relation";
  osmId: string;
  name?: string;
  lat: number;
  lon: number;
  jumuah?: string[]; // only when parsed from public data
  badges?: Array<"wheelchair" | "toilets" | "toilets_wheelchair">;
};
type IqamahTimetable = {
  daily?: Partial<Record<ObligatoryPrayer, string /* "HH:mm" */>>;
  monthly?: Record<string /* YYYY-MM-DD */, Partial<Record<ObligatoryPrayer, string>>>;
  jumuah?: Array<{ khutbahAt?: string; iqamahAt?: string }>;
  source: { id: string; attribution: string; fetchedAt: string } | { id: "private" };
};
```

**App:**

- Route `/masjids`, a list sorted by distance. Each row shows:
  - name and distance (always)
  - Jumu'ah times and badges, **only if present**
  - "Directions": deep link to Apple/Google Maps via `expo-linking`
  - "Set as home masjid"
- `/masjids/[osmType]/[osmId]`:
  - Detail sections render only when they have data.
  - A source attribution line goes under any public timetable.
  - "Report a problem on OpenStreetMap" links to `https://www.openstreetmap.org/<type>/<id>`. Corrections happen upstream in OSM, not in our system.
- Map view (v2): MapLibre + OpenFreeMap tiles.
- **Home masjid** (`UserPreferences.homeMasjid = { osmType, osmId, name, lat, lon }`; public data cached in `DB_KEYS.homeMasjidCache`):
  - **Private times (optional):** "Add your own times for this masjid" via manual entry or OCR (NF-3.12).
    - Stored in blob entity `home_masjid_times`, synced only to the user's own devices.
    - Labelled "Your times".
    - Never sent to the masjids API.
  - **Times shown, in order of precedence:** the user's private times, then the public source, then **nothing**. With nothing, the iqamah UI is hidden and features fall back to adhan times.
  - When iqamah times exist:
    - iqamah countdown on the home hero
    - optional **iqamah reminder** (`notificationPrefs.iqamah`, "leave now" at `iqamah − walkMinutes`, where `walkMinutes` is user-set)
    - focus lock can anchor to iqamah (NF-3.13 falls back to the adhan anchor if the times disappear)
- **PrayerLog extension:** `atMasjid?: boolean; masjidId?: string` (OSM ref). This is separate from `isJama` (jama' can happen at home). The tracker toggle appears when a home masjid is set. Statistics: masjid prayers per week.
- **Geofence (v2, opt-in):** `expo-location` geofencing + `expo-task-manager` around the home masjid only → "At the masjid — tahiyyat al-masjid?" Background location is a sensitive permission, so keep it off by default.
- **TV:** read-only list for the paired location.

**Tests:**

- Overpass response fixtures, with tag parsing that tolerates missing fields.
- `service_times` parser cases: Friday detection, multiple Jumu'ahs, unparseable values hidden.
- The precedence resolver (private > public > none).
- UI snapshot tests asserting that **no section renders when its data is absent**.
- The API caches per cell and serves stale data on failure.

---

### NF-3.12 Timetable OCR (on-device only, permanently — D3)

**Goal.** Photograph a printed masjid timetable (daily or monthly) and import the iqamah/adhan times, with zero cloud processing.

**Engine** (new Expo module `apps/app/modules/munib-text-recognition`):

- **iOS:** Vision `VNRecognizeTextRequest`, `.accurate`, `usesLanguageCorrection = false`, languages `["en-US", "ar-SA"]` when supported by the OS version (check `supportedRecognitionLanguages()` at runtime).
- **Android:** ML Kit Text Recognition v2, **Latin bundled model**. ML Kit has no Arabic script model, so Eastern-Arabic digits may be missed; the review grid covers that. Coordinate with the backlog item "Android barcode / ML Kit assets — confirm unused" so the bundled models are counted once.
- **Web:** Tesseract.js (WASM) with `eng` (+ optional `ara`) traineddata, **lazy-loaded via dynamic `import()`**, never in `__common` ([`PROFILING.md`](./PROFILING.md)). The traineddata is downloaded on first use with consent; show the size.
- **Output contract:**

  ```ts
  type OcrToken = { text: string; conf: number; box: { x: number; y: number; w: number; h: number } };
  recognize(uri: string): Promise<{ tokens: OcrToken[]; width: number; height: number }>;
  ```

**Parser** (`packages/shared/src/utils/timetable-parser/`, pure, heavily fixture-tested):

1. **Normalise:**
   - Eastern Arabic (٠–٩) and Persian (۰–۹) digits → ASCII.
   - `٫ . h` separators → `:`.
   - Strip `am/pm/ص/م` and keep them as a flag.
2. **Time tokens:** `^([01]?\d|2[0-3])[:.]([0-5]\d)$` (after normalisation). Join split tokens ("5" ":" "12") by box adjacency.
3. **Layout:**
   - Cluster rows by y-overlap ≥ 50%; cluster columns by x-centre with k-means on header positions.
   - Detect **daily** (one row of 5–6 times) vs **monthly** (≥ 20 rows with a day-number column 1–31).
4. **Headers:** a multilingual synonym table. It is a data file, extendable without code:

   | Prayer  | Synonyms                          |
   | ------- | --------------------------------- |
   | fajr    | Fajr, Fajar, Subh, Sobh, فجر, صبح |
   | sunrise | Sunrise, Shuruq, Ishraq, شروق     |
   | dhuhr   | Dhuhr, Zuhr, Zohar, Duhr, ظهر     |
   | asr     | Asr, عصر                          |
   | maghrib | Maghrib, مغرب                     |
   | isha    | Isha, Esha, عشاء                  |
   | jumuah  | Jumu'ah, Jummah, جمعة             |

   The begins/iqamah qualifiers are "Begins / Start / Adhan / أذان" vs "Iqamah / Jamaat / Jama'ah / إقامة".
5. **12-hour disambiguation by prayer order:**
   - Fajr < sunrise < Dhuhr < Asr < Maghrib < Isha.
   - Dhuhr 11:00–14:00.
   - Asr, Maghrib and Isha are PM.
   - Pick the AM/PM assignment that satisfies monotonic order.
6. **Plausibility vs calculated times** (from `prayer-times.ts` for the user's location and that date):
   - `|ocrAdhan − calcAdhan| ≤ 20 min`.
   - `iqamah ∈ [adhan, adhan + 90 min]`.
   - Out-of-range cells are flagged.
7. **Confidence:** per-cell `min(tokenConf, layoutConf)`. Cells under 0.8 or flagged are highlighted for review.

**UI flow:**

1. Capture (`expo-image-picker`, which exists; camera or gallery). Crop/rotate hint.
2. Recognise (spinner; on-device badge "Processed on your phone").
3. **Review grid**: editable cells, flagged ones first; month/year picker for monthly sheets.
4. Save as **private times for my home masjid** (`home_masjid_times`, NF-3.11). They're labelled "Your times" and synced only to the user's own devices. **They're never submitted or shared with other users**; there is no community data (D5).

   The photo is **never uploaded**. It is deleted after parsing unless the user keeps it.

**Tests:**

- ≥ 30 fixture token dumps (synthetic plus anonymised real layouts), covering daily, monthly, Arabic digits, AM/PM-less, split tokens and rotated sheets.
- Parser accuracy target: ≥ 95% of cells correct before review on the fixtures.

---

## 9. Phase 5 — Social (circles)

### 9.0 Circles backend (shared by NF-3.16–3.18) — D1

**API module:** `apps/api/src/circles/`, with migration `1720000012000-Circles.ts`, a Drizzle mirror in `packages/db`, and OpenAPI → `pnpm generate:api`.

```
circles(id uuid pk, type text check in ('family','partner','khatm_group'), name text, owner_id uuid fk users,
        settings jsonb, created_at, deleted_at)
circle_members(circle_id fk, member_id uuid, member_kind text check in ('user','child'), role text check in
        ('owner','admin','parent','member','child'), share_scope jsonb, joined_at, left_at, primary key(circle_id, member_id))
circle_invites(id, circle_id, code_hash text unique, role text, max_uses int, uses int, expires_at, created_by, revoked_at)
child_profiles(id uuid pk, created_by uuid fk users, nickname text, birth_year int, avatar text, linked_device_at,
        device_token_hash text, graduated_at, deleted_at)
daily_signals(circle_id, member_id, date date, kind text, value jsonb, updated_at, primary key(circle_id, member_id, date, kind))
group_khatms(id, circle_id fk, title, intention text, unit text check in ('juz','hizb','surah'), deadline date,
        round int default 1, status text, created_by, created_at)
khatm_parts(khatm_id fk, part_no int, assignee_member_id uuid null, status text check in ('open','assigned','reading','done'),
        updated_at, primary key(khatm_id, part_no))
circle_nudges(id, circle_id, from_member, to_member, kind text, created_at)   -- rate-limited
```

**Rules:**

- **Invites:**
  - The code is 10 chars, base32, stored **hashed**.
  - Delivered as a deep link `munib://circle/join/<code>` plus an HTTPS App Link per [`DEEP_LINKS.md`](./DEEP_LINKS.md), and as a QR (`react-native-qrcode-styled`, already a dependency).
  - Default expiry 7 days; `max_uses` defaults to 1 (family/partner) or 200 (khatm).
- **Authorisation:** members can only read their circle, and every endpoint checks membership. Children can only write their own signals. Parents can read their children's signals.
- **Data minimisation:** `daily_signals.value` is a **closed schema per kind**, validated by DTO:
  - `fard_status`: `{ fajr: bool, … }`
  - `goal_done`: `{ done: true }`
  - `khatm_part`: `{ partNo, status }`

  No notes, no qaza, no journals, ever.
- **Realtime:** TanStack Query polling (60 s while a screen is open), plus push via the existing `surface-push` module (Expo/Web push) on events: a part was completed, a nudge was received, a khatm was completed.
- **Deletion:**
  - Leaving a circle deletes your signals for it after 30 days.
  - Account deletion cascades, alongside the existing `account-tombstone`.
  - Deleting a child profile is immediate.
- **Rate limits:** nudges 1 per member pair per day; invites 20 per user per day.

### NF-3.16 Family & kids mode (D7)

**Islamic basis:**

- Abu Dawud 495: teach children salah at seven.
- Qur'an 66:6: protect your families.
- Qur'an 20:132: enjoin prayer on your family.
- **Nothing punitive is ever implemented or referenced.**

**Model:**

- **Family circle:**
  - owner = parent
  - other parent = role `parent`
  - adult children (13+) can join as `member` with their own account
  - children under 13 are `child` profiles
- **Child profile** is created by a parent and holds a nickname and birth year only. Consent is recorded server-side: `{ parentUserId, consentedAt, policyVersion }`.
- **Linking the child's device:**
  1. The parent shows a QR containing a one-time device-link token (5-min TTL).
  2. The child's device scans it and gets a **scoped child session**: write own salah status, read kids content.
  3. There is no email and no password on the child's device. The parent can revoke it.
- A child can also be tracked **on the parent's device only**: the parent logs on the child's behalf.

**Kids mode UI** (when a child session is active, or the parent switches into "Child: <nickname>"):

- Simplified shell with 3 tabs: Pray (5 big buttons), Learn (salah guide kids path, prophets stories, short surahs with the `learn-quran` letters), Duas (daily duas from the dataset with audio).
- **Rewards:**
  - Stickers and stars earned per prayer.
  - A **parent-defined real reward** ("All 5 for 7 days → park trip"), with a progress bar.
  - No leaderboards and no comparison between siblings.
- **Age bands:**
  - under 7: "learning" mode with no tracking expectations (prayers can be logged for practice)
  - 7–12: gentle tracking
  - 13+: prompt to graduate to their own account (§ below)
- **Excused:** kids mode has no hayd UI. The parent can mark "rest days" generically.

**Parent view** (`/family`), per child per day: the 5 fard statuses (✓ / –) and their own stickers. That's all. Weekly digest: "Ali prayed 28 of 35 this week — mashaAllah."

**Graduation:**

- At 13 (or earlier, set by the parent; maturity/bulugh is the real marker), offer to convert to a full account.
- After conversion the **parent's visibility ends** unless the young person opts in to share `fard_status` (as a partner-style signal).
- Prompt again at 15 (the age at which bulugh is presumed per the majority).

**Legal:** COPPA (US), GDPR Art. 8 (EU) and UK AADC review before launch (§4.3). No ads and no third-party analytics in child sessions; Sentry is limited to crash data with no user ids.

### NF-3.17 Accountability partner

- A circle of `type = partner`, **2–5 members**, joined by invite.
- Each member privately defines "my daily goal", which is **never shared**. Options:
  - all 5 fard
  - my wird
  - Qur'an X pages
  - custom
- **Only signal shared:** `goal_done: { done: true }` for a date. There is no "missed" state. Visible states are **"done"** and **"no signal"**, which deliberately also covers excused and private days. The user can skip sharing any day.
- Actions:
  - "Make dua for them": logs a nudge of kind `dua`, and the receiver sees "Someone made dua for you".
  - "Gentle reminder": once a day max, and only after Isha time in the receiver's timezone has passed. Copy is fixed and kind.
- Either member can pause sharing or leave at any time; leaving is silent.
- UI: `/partner` shows the circle, today's dots and the last 7 days of dots. No percentages.

### NF-3.18 Group khatm

- **Create:**
  - title
  - intention (free text; for example for the deceased, Ramadan, or a masjid circle)
  - unit (juz default, hizb, surah)
  - deadline
  - assignment mode: self-pick (default), auto round-robin, or creator assigns
  - visibility: invite link
- **Intention note:** copy stays neutral on gifting reward to the deceased (isal al-thawab); scholars differ. No claims in the copy.
- **Join:**
  - Users in the app join via link or QR.
  - **Non-users:** the link opens a marketing-web landing page (`apps/marketing-web`), with an Expo web fallback to join and read on the web.
- **Read:**
  - Opening an assigned juz goes to `/quran/juz` (or the mushaf pages for that juz).
  - Reading progress (`quran_reading_progress`) shows "reading".
  - The user confirms "Done", which sets the part to `done` and pushes to the circle.
- **Conditions:**
  - A part assigned with no progress for `max(2, (deadline − now)/3)` days → the creator can reassign it, and the member is asked first.
  - All parts done → the khatm is complete. Notify all members with a dua prompt (no specific "khatm dua" text unless sourced; use the dataset's general duas).
  - "Start another round" increments `round` and resets the parts.
  - Deadline passed with parts open → the creator can extend, or open the remaining parts to everyone.
- **Masjid khatm:** any user can create a khatm group and optionally tag it with a masjid from the finder (OSM ref). This is display-only: there is no verified masjid role and no masjid admin.
- **UI:**
  - `/khatm-groups`: my groups.
  - `/khatm-groups/[id]`: a 30-cell grid with assignee initials or nicknames (the member chooses a display name per circle), progress and deadline countdown.
  - Share card via the existing `share` / `react-native-view-shot`.

---

## 10. Cross-cutting checklist (per feature)

Copy this checklist into each feature's PR description.

- [ ] Types in `packages/shared/src/types`; pure logic in `packages/shared/src/utils` or `apps/app/src/lib`, with unit tests (Vitest/Jest, `test-support` helpers)
- [ ] Store plus the `DB_KEYS`, `BLOB_ENTITIES`, `SYNC_ENTITIES`, backup, wipe and reload plumbing (§4.4) or vault doc (§4.2)
- [ ] `pnpm generate:api` if any API/DTO changed; OpenAPI drift passes in `pnpm check:ci`
- [ ] Routes with `ScreenLayout`, `Seo` + `routeMetadata`, back navigation via `goBackOrReplace`
- [ ] Every new preference registered in `lib/settings/registry.ts` under the group from §4.5.8, with search keywords, `available`, `defaultValue` and `scope` (account or device); in-context controls use `useSetting(id)`; the coverage and single-write tests pass
- [ ] Library menu entry (`lib/library-menu.ts`), home module id (`hiddenHomeModules`), search registration (`search-guides`), feature tour (`lib/feature-tours.ts`), "new features" badge (`lib/new-features.ts`)
- [ ] i18n keys in all 24 locales; RTL check (`lib/rtl.ts`, `chart-rtl.ts`)
- [ ] `useTheme()` everywhere; reduced motion respected; accessibility labels
- [ ] TV behaviour decided (hidden / read-only) via `isTV`
- [ ] Notifications registered in `build-reminders.ts` with a budget priority (§11) and a `notificationPrefs` toggle
- [ ] Excused-period behaviour implemented and tested
- [ ] Madhhab behaviour via `useMadhhab()` / `rulesFor(prefs, domain)`, including `null` = all views; new differences added to `FIQH_DIFFERENCES` with `usedIn` (coverage test passes)
- [ ] Evidence refs verified by `content-verification.ts`; no typed scripture
- [ ] **Proof-backed review (D11):** `docs/proofs/<feature>.md` complete, linked from the PR, with every claim sourced
- [ ] Privacy review (lock-screen text, Sentry tags, data minimisation)
- [ ] `FEATURES.md` row added on ship; section removed from this file
- [ ] Marketing kept honest: the feature's entry in `apps/marketing-web/src/content/munib-features.ts` (`PLANNED_FEATURES`) and `content/compare/shared.ts` matches this plan's locked scope; on ship, flip it to `shipped` and add a `content/features/<slug>.ts` page plus its `content/routes.ts` entry (see `apps/marketing-web/AGENTS.md`, "Content architecture")

---

## 11. Notification budget

`MAX_PENDING_REMINDERS = 60` over `SCHEDULE_DAYS_AHEAD = 2` (`lib/notifications/build-reminders.ts`). Extend `trimRemindersToBudget` to drop by priority, lowest first:

| Priority | Kinds                                                                              |
| -------- | ---------------------------------------------------------------------------------- |
| 1 (keep) | Prayer, adhan, existing qaza                                                       |
| 2        | Iqamah (home masjid), focus lock confirm (if any JS-side), suhoor (intended fasts) |
| 3        | Fast intent (night before), Dhul-Hijjah / Arafah / Ashura seasonal                 |
| 4        | Debts due, wasiyyah review                                                         |
| 5        | Family ties digest, muhasabah, habits, coach, rawatib nudge                        |

Focus lock timing lives in the **native** schedulers (DeviceActivity / AlarmManager) and does not count against this budget.

---

## 12. Evidence register

Every ref must be verified against the bundled corpus (or a cited printed edition) and recorded in `content-verification.ts` before the feature ships. Numbering follows the Sunnah.com / Dar-us-Salam conventions used by the existing datasets.

| Topic                    | Refs                                                                                                                                                                                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rawatib                  | Muslim 728, 725; Tirmidhi 415, 423; Bukhari 1180, 1182, 1183, 624; Abu Dawud 1271                                                                                                                                                                                            |
| Voluntary fasting        | Tirmidhi 747; Muslim 1162, 1164, 1134, 1163, 1141, 1137, 1144; Bukhari 1969, 969, 1976, 1985, 1990, 1914; Abu Dawud 2437                                                                                                                                                     |
| Dhul-Hijjah              | Bukhari 969; Ahmad 5446; Muslim 1977; Tirmidhi 3585                                                                                                                                                                                                                          |
| Umrah                    | Abu Dawud 1892; existing hajj/umrah guide refs                                                                                                                                                                                                                               |
| Sunnah habits            | Bukhari 887, 247, 2311, 5376, 1442, 6464; Tirmidhi 2891, 1956; Muslim 2702, 54; Qur'an 24:61                                                                                                                                                                                 |
| Muhasabah                | Qur'an 59:18; Umar's athar (Tirmidhi, under 2459); Bukhari 6306                                                                                                                                                                                                              |
| Silat al-rahim           | Qur'an 4:1, 47:22–23; Bukhari 5986, 5984, 5971                                                                                                                                                                                                                               |
| Debts                    | Qur'an 2:280, 2:282; Tirmidhi 1078; Muslim 1886; Bukhari 2387                                                                                                                                                                                                                |
| Wasiyyah                 | Qur'an 2:180, 5:106; Bukhari 2738, 2742; Abu Dawud 2870; Tirmidhi 2120                                                                                                                                                                                                       |
| Mirath                   | Qur'an 4:11, 4:12, 4:176; Bukhari 6764; Tirmidhi 2109                                                                                                                                                                                                                        |
| Masjid                   | Bukhari 645, 444; Muslim 666                                                                                                                                                                                                                                                 |
| Focus lock               | Qur'an 62:9, 23:1–2, 107:4–5                                                                                                                                                                                                                                                 |
| Family                   | Abu Dawud 495; Qur'an 66:6, 20:132                                                                                                                                                                                                                                           |
| Partner (dua in absence) | Muslim 2733                                                                                                                                                                                                                                                                  |
| Tasbeeh designs          | Abu Dawud 1501; Tirmidhi 3583 (count on the fingertips); Tirmidhi 3568 / Abu Dawud 1500 (pebbles and date pits; gradings differ); Tirmidhi 3464 (cited only to explain the rejected "palm garden" idea); Muslim 2114 (bells). Check every number against the bundled corpus. |
| Hands-free tasbeeh       | Qur'an 7:205 (quiet zikr); phrase evidence comes from each catalog phrase's adhkar dataset entry                                                                                                                                                                             |
| Ayah notes               | Qur'an 38:29, 47:24 (reflecting on the ayahs)                                                                                                                                                                                                                                |
| Root-word search         | None needed (linguistic tool); the morphology dataset is cited in Credits                                                                                                                                                                                                    |
| Hadith audio             | Bukhari 3461 (convey from me); Bukhari 110 (warning against lying about the Prophet ﷺ)                                                                                                                                                                                       |
| Pronunciation assessment | Qur'an 73:4; Bukhari 4937 / Muslim 798 (double reward for the one who struggles); Bukhari 5027                                                                                                                                                                               |

---

## 13. Open items (all decisions locked)

There are no open questions. D1–D28 (§1) settle every product, policy, sourcing and testing choice. What remains is **execution**, and each task already has a locked fallback.

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Governed by | If it finds nothing / fails             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------- |
| 1   | Search for licence-cleared hadith recordings (start with 40 Nawawi, Riyad as-Salihin)                                                                                                                                                                                                                                                                                                                                                                                                                                       | D12, D19    | Hadith audio doesn't ship               |
| 2   | Research public iqamah feeds and review each licence                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | D12, D26    | OSM data and private times only         |
| 3   | Pick the specific Kenney / Freesound CC0 files                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | D16, D28    | Kenney only                             |
| 4   | Compare the pinned QAC copy once with the official corpus.quran.com download                                                                                                                                                                                                                                                                                                                                                                                                                                                | D22         | Use the second verified mirror          |
| 5   | Run spikes S1–S4 and N1 with the D23 eval sets                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | D23, D24    | The documented fallback ships           |
| 6   | File the Apple Family Controls entitlement and the Play declarations (§4.3)                                                                                                                                                                                                                                                                                                                                                                                                                                                 | D17, D25    | Soft prompt on iOS                      |
| 7   | Write each feature's proof log (`docs/proofs/<feature>.md`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | D11         | The feature doesn't ship until complete |
| 8   | **Correct marketing copy that conflicts with locked scope** (found 2026-11-23): `munib-features.ts` describes NF-3.23 as "Listen to hadith translations, with offline replay", but D19 means recordings only, possibly never shipping. `compare/islam360.ts` also lists hadith audio as planned. Reword to "Hadith recitations (human recordings, where licensed)", or remove until a source passes D12. Also check that the NF-3.0b entry, currently "Hijri date adjustment", reads as part of the settings control panel. | D19, §10    | Remove the planned entry                |

Earlier questions and where they were settled: reviewers (D11); licences (D12); settings panel (D13, D14); ayah notes (D15); tasbeeh (D16, D28); focus lock (D17, D25); web speech model (D18); hadith audio (D19); pronunciation (D20); timeline (D21); root data (D22); speech fixtures (D23); spike failures (D24); Quran Lab SDK (D25); iqamah sources (D26); kids content (D27); mirath reference texts (D11).
