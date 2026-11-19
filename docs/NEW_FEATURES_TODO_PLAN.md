# New features — TODO plan (NF-3.x)

Status: **planned, not started** · Created 2026-11-19 · Owner: product
Shipped catalog: [`FEATURES.md`](./FEATURES.md) · Open work: [`BACKLOG.md`](./BACKLOG.md)

This plan covers 18 features plus the shared foundations they need. Each feature section gives:
goal, Islamic basis, scope, data model, storage/sync, core logic and conditions, UI/routes,
notifications, data sources, tests, acceptance criteria and open risks.

When a feature ships, move its row into `FEATURES.md` (same NF id) and delete its section here.

---

## Contents

1. [Locked decisions](#1-locked-decisions)
2. [Non-negotiable rules (all features)](#2-non-negotiable-rules-all-features)
3. [Phasing & sequencing](#3-phasing--sequencing)
4. [Foundations (NF-3.0)](#4-foundations-nf-30) — incl. **NF-3.0a "My madhhab" setting + retrofit**
5. [Phase 1 — Daily practice](#5-phase-1--daily-practice)
   - NF-3.1 Sunnah Rawatib · NF-3.2 Voluntary fasting · NF-3.3 Dhul-Hijjah mode · NF-3.5 Daily Sunnah habits
6. [Phase 2 — Private self-accountability](#6-phase-2--private-self-accountability)
   - NF-3.6 Muhasabah · NF-3.7 Silat al-rahim · NF-3.8 Debts record · NF-3.9 Wasiyyah · NF-3.14 Weekly gentle coach
7. [Phase 3 — Fiqh tools & Qur'an](#7-phase-3--fiqh-tools--quran)
   - NF-3.10 Mirath · NF-3.15 Tajweed coaching · NF-3.4 Umrah mode
8. [Phase 4 — Device & place](#8-phase-4--device--place)
   - NF-3.13 Salah focus lock · NF-3.11 Masjid finder · NF-3.12 Timetable OCR
9. [Phase 5 — Social (circles)](#9-phase-5--social-circles)
   - NF-3.16 Family & kids · NF-3.17 Accountability partner · NF-3.18 Group khatm
10. [Cross-cutting checklist (per feature)](#10-cross-cutting-checklist-per-feature)
11. [Notification budget](#11-notification-budget)
12. [Evidence register](#12-evidence-register)
13. [Open questions (not blocking)](#13-open-questions-not-blocking)

---

## 1. Locked decisions

Decided with the product owner on 2026-11-19. Don't change any of these without updating this table.

| #   | Topic                      | Decision                                                                                                                                                                                                                                                         |
| --- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Social backend             | Build a **`circles` module in `apps/api`** (Postgres + TypeORM migrations, Drizzle mirror in `packages/db`). Family, partner and group khatm ship in the **final phase**, after the single-user features.                                                      |
| D2  | Sensitive data             | Muhasabah, wasiyyah and the debts record are **stored on the device by default**. Cloud sync is **opt-in and end-to-end encrypted**: the server stores ciphertext only. Silat al-rahim relatives (third-party names and phone numbers) also go in the vault (extension of D2, see §4.2). |
| D3  | AI approach                | **On-device only, permanently.** The weekly coach is a deterministic rules engine with i18n templates. Timetable OCR uses on-device text recognition plus a rule-based parser. No cloud LLM calls, no server-side inference, ever, for these features.          |
| D4  | Focus lock                 | **Hard block from v1.** iOS uses FamilyControls / ManagedSettings / DeviceActivity, which needs Apple's distribution entitlement. Android uses UsageStats, an overlay and a foreground service, which needs Play policy declarations. Start both approval processes in Phase 0 because of the lead time. |
| D5  | Masjid data                | **Publicly available data only.** Locations, details and any times come from **OpenStreetMap (Overpass)**, through a read-only proxy and cache in `apps/api`. Other public timetable sources are added only after a licence review. **No user submissions, no voting, no admin moderation, no masjid-admin claims.** When a field has no public data, it **isn't shown**. Users may keep **private** iqamah times for their own home masjid (manual or on-device OCR), and these are never shared. |
| D6  | Mirath scope               | **All four schools in v1**, one engine with per-school parameters for the disputed cases. Release is **gated on scholar sign-off** of the fixture suite.                                                                                                      |
| D7  | Kids                       | **Parent-managed child profile**: no email, nickname and birth year only, child device linked by QR. Kids mode applies below 13. The parent sees **fard salah status only**.                                                                                     |
| D8  | Rawatib default            | **Follows the global madhhab and can be edited.** Hanafi → 12; Shafi'i / Hanbali / Maliki → 10 mu'akkadah. The user can switch between 10 and 12 and enable optional ghayr mu'akkadah extras.                                                               |
| D9  | Global madhhab (NF-3.0a)   | One **"My madhhab"** setting (Hanafi / Shafi'i / Maliki / Hanbali / **Show all views**) that every guide and calculator reads, **including retrofitting shipped features**: Witr, hayd/istihada/nifas, qasr/jam', zakat nisab, Fajr/Isha preferred times, fidyah, Eid/Jumu'ah, janazah, tawaf (§4.1.4). Differences are labelled, never hidden. It is independent of the Asr `MadhabKey`, but picking a school offers to match the two. |

Planning decisions taken here (reversible; flag them in review if you disagree):

- **Masjid finder v1 is list-first.** "Open in Maps" uses the OS deep link. The in-app map (MapLibre plus OpenFreeMap tiles) is v2, so a new map SDK isn't needed at launch.
- **Group khatm unit**: 30 juz by default; 60 hizb or 114 surahs are optional.
- **Rawatib are stored as new `PrayerId`s** reusing `PrayerLog` (§5.1), rather than as a new entity.

---

## 2. Non-negotiable rules (all features)

1. **No AI-written or hand-typed scripture.** Qur'an and hadith text is always rendered from the bundled or remote corpus **by reference** (`surah:ayah`, `collection:number`). New guide copy follows the existing `packages/shared/src/content/*-guide.ts` pattern, with explicit refs checked by `content-verification.ts`. See the root `AGENTS.md`, "Content & data".
2. **Madhhab-aware, not madhhab-imposing.** Every ruling that differs between the schools reads `useMadhhab()` (§4.1). When `madhhab === null`, show all views side by side.
3. **Scholar review gate.** Each feature has a "Scholar sign-off" checkbox in §10 and does not ship without it. Mirath also needs fixture sign-off (D6).
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

| Phase | Features                                                                    | Why this order                                                         | Est. size |
| ----- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------- |
| 0     | NF-3.0 foundations: **NF-3.0a madhhab setting + retrofit of shipped features (§4.1.4)**, vault, **entitlement / Play filings** | Everything else depends on these. The retrofit fixes today's silent single-school defaults (zakat nisab, Witr qaza, hayd). The Apple and Play reviews take weeks. | L         |
| 1     | 3.1 Rawatib · 3.2 Voluntary fasting · 3.5 Sunnah habits · 3.3 Dhul-Hijjah mode | Local-only, used every day, extends existing patterns. **Dhul-Hijjah 1448 starts around May 2027** (verify with `hijri.ts`). | M         |
| 2     | 3.6 Muhasabah · 3.7 Silat al-rahim · 3.8 Debts · 3.9 Wasiyyah · 3.14 Coach  | Needs the vault (D2). The coach consumes Phase 1 data.                 | L         |
| 3     | 3.10 Mirath · 3.15 Tajweed coaching · 3.4 Umrah mode                        | Heavy fiqh/test work. The wasiyyah links into mirath.                  | L         |
| 4     | 3.13 Focus lock · 3.11 Masjid finder · 3.12 Timetable OCR                   | Native modules plus a read-only OSM proxy in the API (no admin work). The entitlements should be approved by now. | XL        |
| 5     | 3.16 Family & kids · 3.17 Partner · 3.18 Group khatm                        | D1: social goes last. Needs the `circles` backend.                     | XL        |

Dependency graph (→ = "needed by"):

```
madhhab pref ─→ rawatib, dhul-hijjah, voluntary fasting, mirath, umrah
vault ────────→ muhasabah, silat al-rahim, debts, wasiyyah
debts ────────→ wasiyyah ─→ mirath (estate deductions)
masjid finder → timetable OCR (private home-masjid times), focus lock (iqamah window), rawatib (tahiyyat al-masjid hint)
circles API ──→ family/kids, partner, group khatm
all trackers ─→ weekly coach
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
  | "salah" | "taharah" | "fasting" | "zakat" | "travel" | "hajj" | "udhiyah" | "inheritance";

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
  id: string;                          // "witr.status", "hayd.max", "qasr.distance", …
  domain: FiqhDomain;
  titleKey: string;
  positions: Record<MadhhabId, { summaryKey: string; value?: string | number; refs?: ContentRef[] }>;
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

| Area | Rule | Hanafi | Shafi'i | Maliki | Hanbali |
| --- | --- | --- | --- | --- | --- |
| **Salah times** | Asr start (existing `MadhabKey`) | Shadow 2× (+ zawal shadow) | Shadow 1× | Shadow 1× | Shadow 1× |
| | Fajr preferred time | Isfar (when light spreads, leaving time to repeat) | Taghlis (early, in darkness) | Taghlis | Taghlis |
| | Isha start (info only; calc angle unchanged) | White twilight (Abu Hanifa); red per the Sahibayn (many Hanafi fatwas) | Red twilight | Red twilight | Red twilight |
| | Isha preferred time | Delay to ⅓ of the night | Early (one view prefers delay) | Early (esp. for congregations) | Delay to ⅓ if not hard on others |
| | Asr preferred / disliked | Delay is preferred, but not until the sun yellows | Early | Early | Early |
| **Witr** | Status | **Wajib** | Sunnah mu'akkadah | Sunnah mu'akkadah | Sunnah mu'akkadah |
| | Form | 3 rak'at, one salam, qunut before ruku' all year | Min 1, commonly 2+1, max 11; qunut in the 2nd half of Ramadan | 1 rak'ah after a 2-rak'ah shaf' | Min 1, commonly 2+1, max 11; qunut all year, after ruku' |
| | Make-up (qaza) | Required | Recommended | Recommended | Recommended |
| **Salah method** (guide notes) | Raising the hands | Opening takbir only | Opening, ruku', rising, standing for the 3rd | Opening (the well-known view) | Opening, ruku', rising |
| | Fatiha behind the imam | Not recited | Obligatory in every prayer | Recited in silent prayers only | Recited in silent prayers only |
| | Qunut in Fajr | No | Yes (standing, after ruku') | Yes (quietly, before ruku') | No (only nazilah) |
| **Hayd / nifas** | Hayd minimum | 3 days | 1 day + night (24 h) | No minimum (for worship) | 1 day + night |
| | Hayd maximum | 10 days | 15 days | 15 days (habit + 3 days istizhar for a habitual woman, up to 15) | 15 days |
| | Minimum purity between two periods | 15 days | 15 days | 15 days | 13 days |
| | Nifas maximum | 40 days | 60 days | 60 days | 40 days |
| | Bleeding beyond the maximum | Istihada: pray, wudu per prayer time | Istihada (distinguish by habit/colour) | Istihada | Istihada (by habit/colour) |
| **Travel** | Qasr distance (approx.; conversions differ) | ≈ 77–78 km (48 mi) | ≈ 81–89 km (4 burud) | ≈ 81–89 km | ≈ 81–89 km |
| | Qasr status | **Wajib** (praying 4 is sinful/makruh tahriman) | Concession (qasr is better) | Sunnah mu'akkadah | Concession (qasr is better) |
| | Becomes resident by intending to stay | ≥ 15 days | ≥ 4 full days (excluding the arrival and departure days) | ≥ 4 full days (≈ 20 prayers) | > 4 days (more than 20 prayers) |
| | Combining prayers (jam') while travelling | **Not allowed** (except Arafah/Muzdalifah in Hajj) | Allowed (taqdim/ta'khir) | Allowed with conditions (while on the move) | Allowed |
| | Combining for rain | No | Yes (Dhuhr+Asr, Maghrib+Isha, in congregation) | Maghrib+Isha | Maghrib+Isha |
| | Rawatib while travelling | Optional (except the Fajr sunnah; recommended when settled) | Optional | Optional | Left except Fajr sunnah and Witr |
| **Zakat** | Nisab for cash/trade goods | **Lower** of gold/silver (favours the poor) | Gold or silver (classical: per metal; for currency, contemporary views differ) | Gold or silver; gold and silver combined | Gold or silver (one view: lower) |
| | Combine gold + silver to reach nisab | Yes (by value) | No | Yes (by proportion) | Two views (the relied-upon one: yes) |
| | Women's personal-use jewellery | **Zakatable** | Not zakatable (if permissible and in normal use) | Not zakatable | Not zakatable |
| **Fasting** | Eating forgetfully | Fast valid | Fast valid | Make up (obligatory fast) | Fast valid |
| | Kaffarah trigger | Intercourse **or** deliberate eating/drinking | Intercourse only | Intercourse or deliberate eating/drinking | Intercourse only |
| | Fidyah measure | ½ sa' wheat or 1 sa' dates/barley; **cash value allowed** | 1 mudd of staple food per day; food only | 1 mudd; food | 1 mudd of wheat or ½ sa' of other food; food |
| | Sadaqat al-fitr | ½ sa' wheat / 1 sa' other; **cash allowed** | 1 sa' of staple food | 1 sa' of staple food | 1 sa' of staple food |
| | Tarawih (info) | 20 | 20 | 20 (36 as the old Madinah practice) | 20 |
| **Jumu'ah / Eid** | Minimum congregation for Jumu'ah | 3 + imam | 40 | 12 + imam | 40 |
| | Eid prayer status | Wajib | Sunnah mu'akkadah | Sunnah mu'akkadah | Fard kifayah |
| | Extra Eid takbirs | 3 + 3 | 7 + 5 | 6 + 5 (7 counting the opening) | 6 + 5 (7 counting the opening) |
| **Janazah** | Fatiha in the janazah prayer | Not recited (praise instead) | Obligatory | Not recited | Obligatory |
| **Hajj / Umrah** | Wudu for tawaf | Wajib (valid without it, with a penalty) | Condition of validity | Condition | Condition |
| **New features** | Rawatib preset (NF-3.1) | 12 | 10 | 10 | 10 |
| | Takbir al-Tashriq (NF-3.3) | Fajr 9 → Asr 13, wajib, 2 opening takbirs | Fajr 9 → Asr 13, sunnah, 3 | Dhuhr 10 → Fajr 13, 3 | Fajr 9 → Asr 13, 2 |
| | Udhiyah (NF-3.3) | Wajib on one with nisab; ends 12th | Sunnah mu'akkadah; ends 13th | Sunnah mu'akkadah; ends 12th | Sunnah mu'akkadah; ends 12th |
| | Hair/nails in the ten (NF-3.3) | Mustahabb to refrain | Makruh | Makruh | Haram |
| | Shafi'i: fasting after mid-Sha'ban (NF-3.2) | — | Disliked unless habitual or qaza | — | — |
| | Mirath disputed cases (NF-3.10) | See §7 NF-3.10 | | | |

**Typed rules** consumed by code (excerpt):

```ts
export interface MadhhabRules {
  asrDefault: MadhabKey;                                        // "hanafi" | "shafi"
  fajrPreferred: "isfar" | "taghlis";
  ishaPreferred: "delay_third" | "early";
  witr: { status: "wajib" | "sunnah_muakkadah"; qazaDefault: boolean; form: WitrForm };
  hayd: { minHours: number | 0; maxDays: number; minPurityDays: number; nifasMaxDays: number };
  travel: {
    qasrDistanceKm: number; qasrStatus: "wajib" | "concession" | "sunnah";
    residencyDays: number; residencyRule: "gte" | "gt";
    jamTravel: boolean; jamRain: "none" | "maghrib_isha" | "both";
    rawatib: "optional_except_fajr" | "optional" | "left_except_fajr_witr";
  };
  zakat: { nisabBasis: NisabBasis; combineGoldSilver: boolean; personalJewelleryZakatable: boolean };
  fasting: { forgetfulEatingBreaks: boolean; kaffarahTriggers: Array<"intercourse" | "deliberate_eating">;
             fidyahMeasure: "half_sa_wheat" | "mudd"; fidyahCashAllowed: boolean; fitrCashAllowed: boolean };
  rawatib: { defaultPreset: 10 | 12; dhuhrBefore: 2 | 4 };
  takbirTashriq: { start: TashriqSlot; end: TashriqSlot; status: "wajib" | "sunnah"; openingTakbirs: 2 | 3 };
  udhiyah: { status: "wajib_for_capable" | "sunnah_muakkadah"; lastDayHijri: 12 | 13 };
  hairNailsDuringTen: "haram" | "makruh" | "mustahabb_to_refrain";
  eid: { status: "wajib" | "sunnah_muakkadah" | "fard_kifayah"; extraTakbirs: [number, number] };
  mirath: MirathSchoolParams;                                   // §7 NF-3.10
}
export type NisabBasis = "lower" | "gold" | "silver";
export type TashriqSlot = { hijriDay: 9 | 10 | 13; prayer: "fajr" | "dhuhr" | "asr" };
export const MADHHAB_RULES: Record<MadhhabId, MadhhabRules> = { /* filled + scholar-reviewed */ };

/** Resolves the domain school, then applies `fiqhCustom` numeric overrides. `null` ⇒ caller shows all views. */
export function rulesFor(prefs: Pick<UserPreferences, "madhhab" | "madhhabOverrides" | "fiqhCustom">,
                         domain: FiqhDomain): MadhhabRules | null;
```

#### 4.1.4 Apply to existing features (retrofit; Phase 0 deliverable)

| Shipped feature | Files | Change |
| --- | --- | --- |
| Prayer times / location (NF-0.1, 0.2) | `lib/prayer-times.ts`, `app/location`, `stores/location-store.ts` | Offer the matching Asr `MadhabKey` on madhhab pick; show a neutral mismatch hint. No automatic change. |
| Preferred-time hints | `lib/salah-phase/*`, `lib/prayer-ui.ts`, home hero, tracker | New "preferred window" sub-band per prayer: Fajr isfar vs taghlis, Isha delay to ⅓ of the night vs early, Asr "before the sun yellows". In all-views mode, show a neutral "earliest / preferred" note with a `MadhhabNote`. Optional "remind at preferred time" offset suggestion in `/settings/reminder-offsets`. |
| Witr tracking + qaza (NF-1.2, tracker) | `(tabs)/tracker.tsx`, `QAZA_PRAYERS`, `lib/prayer-qaza-debt.ts` | Witr row label "Wajib" (Hanafi) or "Sunnah mu'akkadah". **Witr qaza accrual is on by default only for Hanafi**; others can opt in. The form shown in the Witr info sheet follows the school. |
| Hayd / excused (NF-1.2) | `activeExcusedReason`, `excused-guide.ts`, `ExcusedDayPicker`, calendar | **Add `"nifas"` to `ExcusedReason`.** Day counter during an active period ("Day 6 of a maximum of 10 (Hanafi)"). Prompts, **never automatic edits**: (a) beyond `maxDays` → "Bleeding after day N is istihada in your school — resume prayer with wudu for each prayer time" with a Resume button; (b) a Hanafi period that ended before 3 days → "May not count as hayd in your school; consider making up these prayers" with an "Add N to qaza" action; (c) a new period starting before `minPurityDays` → an info note. Hayd days during Ramadan → offer to add those days to roza qaza (check the current behaviour first). All copy is private and never appears in notifications. |
| Travel guide (NF-1.3) | `/travel`, `travel-guide.ts` | New **qasr calculator**: inputs are trip distance (km/mi) and intended stay (days). Outputs: traveller yes/no, shorten 4→2 (labelled wajib or concession), when you become resident, whether jam' is available (hidden for Hanafi except Hajj), and rawatib guidance (feeds NF-3.1). Turning on travel excused mode asks the same two questions. |
| Combining (jam') | `PrayerLog` | Add an optional `combinedWith?: ObligatoryPrayer` (taqdim/ta'khir) flag. It is only offered when `rules.travel.jamTravel` or rain combining applies, and is shown in history. Separate from `isJama` (congregation). |
| Zakat (NF-2.2) | `lib/zakat.ts` (`lowerNisab`), `/zakat`, zakat draft | Replace the fixed `lowerNisab()` with `nisabFor(basis, goldNisab, silverNisab)`. The default basis comes from rules, with a user override in the calculator (saved to `fiqhCustom.nisabBasis`). Add a **personal jewellery** input that is included or excluded per `personalJewelleryZakatable`, with a note. Combine gold and silver per `combineGoldSilver`. The result card shows a `MadhhabBadge`, and the all-views mode shows a row per basis. |
| Fidyah / kaffarah (NF-2.5) | `lib/fidyah.ts`, `fidyah-guide.ts`, `/fidyah` | Measure per school (mudd vs ½ sa'), "cash value allowed" vs "food only" in the result, and kaffarah triggers in the kaffarah helper. |
| Ramadan mode (NF-1.1) | `/ramadan`, `lib/ramadan.ts` | "I ate forgetfully" helper (valid fast vs make-up). Kaffarah trigger note. Sadaqat al-fitr amount per school, with a cash/food label. Tarawih info note. |
| Salah guide (NF-1.33) | `salah-guide.ts` | Attach `MadhhabNote`s: raising the hands, Fatiha behind the imam, Fajr qunut, Witr form, preferred times. The prose stays; structured notes are added. |
| Taharah guide | `taharah.ts` | Attach structured differences to the paragraphs that already name schools (tartib/muwalat, intention, dalk, wudu nullifiers). |
| Friday guide (NF-2.35) | `friday-guide.ts` | Jumu'ah minimum congregation, sunnah before/after Jumu'ah per school. |
| Eid guide (NF-2.30) | `eid-guide.ts` | Status and extra takbirs per school. |
| Janazah guide (NF-2.6) | `janazah-guide.ts` | Fatiha in the janazah prayer. |
| Hajj / Umrah (NF-2.3, NF-3.4) | `hajj-guide.ts`, umrah mode | Wudu for tawaf. Udhiyah/hajj-related notes. |
| Flash cards / quizzes | `lib/flash-cards`, `*-quiz.ts` | Questions whose answer depends on the school are tagged with a `differenceId`. In all-views mode they are skipped, or the answer shows every school. |
| Search | `search-guides`, `lib/search.ts` | Index the difference catalog so a search like "witr wajib" or "qasr distance" finds the comparison card. |

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

**Backup** (`lib/backup.ts`): export the ciphertext. Importing it needs the DEK on the device, or the passphrase.

**Wipe** (`lib/wipe-local-data.ts`): delete the vault keys and the DEK.

**Tests:**

- round-trip encryption
- wrong passphrase → typed error
- merge of two diverged documents
- tampered ciphertext → GCM auth failure, surfaced as a `vault-corrupt` error code

### 4.3 Store/approval filings (start in Phase 0)

| Filing                                                                                        | Needed by | Lead time    |
| --------------------------------------------------------------------------------------------- | --------- | ------------ |
| Apple **Family Controls (Distribution)** entitlement request, for the app and each extension bundle id | NF-3.13   | Weeks; can be rejected |
| Play Console **foreground service `specialUse`** declaration + video                          | NF-3.13   | Days–weeks   |
| Play Console **`PACKAGE_USAGE_STATS`** / overlay justification in Data safety                  | NF-3.13   | With review  |
| Privacy policy update: vault, kids profiles, OCR (on-device), masjid lookups (geohash cell only)              | 3.6–3.18  | Internal     |
| Legal review: kids data (COPPA / GDPR Art. 8 / UK AADC), wasiyyah disclaimer                  | 3.9, 3.16 | Internal     |

### 4.4 Shared plumbing per new local entity

Repeat this for every new store. It mirrors the existing `white_days_checklist` path.

1. Add a `DB_KEYS.<name>` entry in `apps/app/src/db/keys.ts`.
2. Create the store with `createStore` in `apps/app/src/stores/<name>-store.ts`, plus `useEnsure<Name>Loaded`.
3. Add a `BLOB_ENTITIES` entry in `apps/app/src/sync/blob-sync.ts`. Add it to `UNION_MERGE_ENTITIES` if the value is a plain map, otherwise provide a custom `merge`.
4. Add the entity to `SYNC_ENTITIES` in `apps/api/src/sync/dto/sync.dto.ts`. Regenerate the client with `pnpm generate:api`.
5. Include it in `lib/backup.ts` export/import and in `lib/wipe-local-data.ts`.
6. Add it to `reload-all-stores.ts` so the `data_reset` path clears it.

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

  | Row | Visible from | Until | Notes |
  | --- | --- | --- | --- |
  | `fajr_before` | Fajr begins | Dhuhr begins | After sunrise it is logged with `late: true`. Making it up after sunrise is valid per Tirmidhi 423. Schools differ on whether it is made up independently of the fard; when `madhhab === "hanafi"`, show the note. |
  | `*_before` | Its fard's time begins | The next fard's time begins | |
  | `*_after` | The parent fard is marked completed | The next fard's time begins | Can be logged before the fard is marked, with a soft hint. |

- **Preset 12:** `dhuhr_before.rakahs` defaults to 4. **Preset 10:** it defaults to 2. The user can change either per log.
- **Excused periods:**
  - `hayd` hides all rawatib rows.
  - `sick` keeps them visible, with nothing expected.
  - `travel`: when `rules.travelRawatib === "optional_except_fajr"`, show only `fajr_before` (plus Witr, which already exists). The rest are collapsed under "Optional while travelling".
- **Sync:** reuses the existing `prayer_logs` record sync with no new entity. The API `prayerId` validator (`packages/shared/src/validators` and the API DTO) must accept the new ids. Run `pnpm generate:api`.
- **Statistics:** a new "Rawatib" section in `/statistics`:
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
- qaza and streak functions ignore the rawatib ids (regression test)
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
  | "monday" | "thursday" | "white_day" | "shawwal_six" | "arafah" | "tasua" | "ashura"
  | "muharram" | "shaban" | "dhul_hijjah_nine" | "dawud" | "other";
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
  enabledKinds: VoluntaryFastKind[];   // default ["monday","thursday","white_day","shawwal_six","arafah","tasua","ashura"]
  dawudMode?: { startDate: string } | null;
  intentReminderTime: string;          // "21:00" default; or "isha+60"
  suhoorAlarm: boolean;                // default false
  isPilgrimThisYear?: boolean;         // suppress Arafah recommendation
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
  udhiyah?: { animal: "sheep" | "goat" | "cow_share" | "camel_share" | "cow" | "camel"; shares?: number;
              via: "self" | "agency"; onBehalfOf?: string[]; status: "planned" | "arranged" | "slaughtered" | "distributed" };
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

| id                   | Habit                                   | Type         | Ref (verify)               | Links to                     |
| -------------------- | --------------------------------------- | ------------ | -------------------------- | ---------------------------- |
| `miswak`             | Use miswak (esp. before salah)          | binary       | Bukhari 887                | —                            |
| `wudu_before_sleep`  | Wudu before sleeping                    | binary       | Bukhari 247                | before-sleep adhkar          |
| `sleep_right_side`   | Sleep on the right side + dua           | binary       | Bukhari 247                | before-sleep adhkar          |
| `ayat_kursi_sleep`   | Ayat al-Kursi before sleep              | binary       | Bukhari 2311               | Qur'an 2:255                 |
| `mulk_nightly`       | Surah al-Mulk nightly                   | binary       | Tirmidhi 2891              | Qur'an 67                    |
| `istighfar_100`      | Istighfar 100×                          | count (100)  | Muslim 2702                | tasbeeh                      |
| `salawat`            | Salawat on the Prophet ﷺ                | count (user) | (durood dataset)           | `/duroods`                   |
| `salam_home`         | Salam on entering home                  | binary       | Qur'an 24:61               | dua dataset                  |
| `spread_salam`       | Initiate salam                          | binary       | Muslim 54                  | —                            |
| `eat_right_bismillah`| Eat with right hand, say Bismillah      | binary       | Bukhari 5376               | dua dataset                  |
| `smile`              | Smile at a brother/sister (sadaqah)     | binary       | Tirmidhi 1956              | —                            |
| `daily_sadaqah`      | Give something, even small              | binary       | Bukhari 1442               | `/sadaqah`                   |
| `morning_adhkar`     | Morning adhkar                          | linked       | (adhkar dataset)           | auto-checked from zikr progress |
| `evening_adhkar`     | Evening adhkar                          | linked       | (adhkar dataset)           | auto-checked from zikr progress |
| `custom`             | User-defined (title only, no evidence)  | binary/count | —                          | —                            |

**Data model:**

```ts
export interface SunnahHabitsState {
  selected: string[];                         // ordered habit ids (max 12 to keep it small)
  custom: Array<{ id: string; title: string; target?: number }>;
  checks: Record<string /* `${habitId}::${date}` */, number /* 1 for binary, n for count */>;
  spotlightSeen: Record<string, string>;      // habitId → last date shown
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
  repentNote?: string;        // optional; may be omitted by preference
  readIstighfar: boolean;
  intention?: string;
  durationMs: number;
  updatedAt: string;
}
export interface MuhasabahDoc {
  prompts: string[];          // selected prompt ids incl. custom:<id>
  customPrompts: Array<{ id: string; text: string }>;
  entries: Record<string, MuhasabahEntry>;
  prefs: { time: "bedtime" | "isha+90" | string; saveRepentText: boolean; retentionDays: 0 | 30 | 90 | 365 }; // 0 = forever
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
  | "mother" | "father" | "grandparent" | "child" | "sibling" | "spouse_parent"
  | "aunt_paternal" | "aunt_maternal" | "uncle_paternal" | "uncle_maternal"
  | "cousin" | "niece_nephew" | "other";
export interface Relative {
  id: string; name: string; kinship: Kinship;
  phone?: string;                        // optional; manual entry (no contacts import in v1)
  cadenceDays: number;                   // defaults by kinship: parents 2, grandparents 7, siblings 7, aunts/uncles 30, cousins 60, other 90
  lastContact?: { date: string; kind: "call" | "visit" | "message" | "gift" | "dua" };
  notes?: string;
  paused?: boolean;
  createdAt: string; updatedAt: string; deletedAt?: string;
}
export interface RelativesDoc { relatives: Relative[]; log: Array<{ relativeId: string; date: string; kind: string }> }
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
  amount?: number; currency?: string;      // currency via lib/format-currency.ts
  item?: string;                           // for trusts / non-cash
  createdOn: string; dueOn?: string;
  witnesses?: string[];                    // names only
  documentUri?: string;                    // optional photo via existing /user-media (encrypted-at-rest local only in v1)
  payments: Array<{ id: string; date: string; amount: number; note?: string }>;
  status: "open" | "settled" | "forgiven";
  notes?: string; updatedAt: string; deletedAt?: string;
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

**Engine** (`packages/shared/src/utils/coach/`):

```ts
export interface CoachRule {
  id: string;
  kind: "celebrate" | "suggest" | "plan";
  /** Returns evidence numbers or null if not applicable. Pure. */
  evaluate(ctx: CoachContext): CoachEvidence | null;
  priority: number;          // higher first
  cooldownWeeks: number;     // don't repeat within N weeks
  copyKey: string;           // i18n key with {params}
  action?: { route: string; labelKey: string };
}
export function buildCoachReport(ctx: CoachContext, history: CoachHistory): CoachInsight[]; // ≤ 3, ≥ 1 celebrate
```

Initial rule set (each with unit tests using fixture weeks from `test-support`):

| id                     | Fires when                                                                                     | Suggestion / action                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `fajr_gap`             | Fajr completion ≥ 30 pp below the mean of the other fard over 2+ weeks                         | Earlier bedtime / before-sleep adhkar → `/settings/reminder-offsets` |
| `delayed_pattern`      | ≥ 3 `delayed` for the same prayer in 7 days                                                    | Suggest reminder offset for that prayer                   |
| `weekday_dip`          | One weekday's fard rate ≤ mean − 25 pp for 3 weeks                                             | "Plan for <weekday>"                                      |
| `improvement`          | Any tracked metric +15 pp vs the 4-week baseline                                               | Celebrate ("Alhamdulillah — keep it small and steady")    |
| `qaza_pace`            | Qaza debt > 0                                                                                  | Projected finish date at current pace; offer +1/day plan  |
| `jama_rate`            | Men only if gender known? → **No gender inference.** Fires when user has a home masjid set & jama' rate < 20% | Suggest one masjid prayer this week               |
| `khushu_low_prayer`    | Avg khushu rating for one prayer ≤ 2/5 over 5+ entries                                         | Link to salah guide meaning of recitations                |
| `quran_streak`         | Reading days ≥ 5/7                                                                             | Celebrate; offer khatm plan if none                       |
| `khatm_behind`         | Khatm plan behind by > 2 days                                                                  | Offer re-plan (`lib/khatm.ts`)                            |
| `rawatib_start`        | Fard ≥ 90% and rawatib ≈ 0                                                                     | Suggest Fajr sunnah first (Muslim 725)                    |
| `habit_consistent`     | Any habit 7/7                                                                                  | Celebrate                                                 |
| `family_ties_due`      | ≥ 1 parent overdue                                                                             | Link to `/family-ties`                                    |
| `excused_week`         | Excused ≥ 4 days                                                                               | **Only** "Rest and return — your streak is safe". Suppress every suggestion. |

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

## 7. Phase 3 — Fiqh tools & Qur'an

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
  | "husband" | "wife" | "son" | "daughter" | "sons_son" | "sons_daughter"
  | "father" | "mother" | "paternal_grandfather" | "paternal_grandmother" | "maternal_grandmother"
  | "full_brother" | "full_sister" | "paternal_brother" | "paternal_sister"
  | "maternal_brother" | "maternal_sister"
  | "full_brothers_son" | "paternal_brothers_son"
  | "full_paternal_uncle" | "paternal_paternal_uncle" | "full_uncles_son" | "paternal_uncles_son";
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

| Heir             | Share                                                                                                     | Excluded by (all schools unless noted)                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Husband          | 1/2; 1/4 with a descendant heir (child / son's child)                                                     | —                                                                       |
| Wife / wives     | 1/4; 1/8 with a descendant heir; shared equally                                                           | —                                                                       |
| Father           | 1/6 with male descendant; 1/6 + residue with only female descendants; residue with no descendant         | —                                                                       |
| Mother           | 1/6 with descendant or ≥ 2 siblings (any type); else 1/3; 'Umariyyatayn 1/3 of remainder               | —                                                                       |
| Daughter(s)      | 1/2 one; 2/3 two+; residuary 2:1 with son(s)                                                              | —                                                                       |
| Son's daughter(s)| 1/2 / 2/3 when no daughter; 1/6 with exactly one daughter; residuary with son's son                      | Son; 2+ daughters (unless a son's son makes her residuary)             |
| Paternal grandfather | As father when father absent (see grandfather-with-siblings)                                         | Father                                                                  |
| Grandmother(s)   | 1/6 (shared if two)                                                                                       | Mother (both); father excludes paternal GM except `hanbali`            |
| Full sister(s)   | 1/2 / 2/3; residuary with full brother 2:1; residuary with daughters                                      | Son, son's son, father; grandfather (`hanafi`)                         |
| Paternal sister(s)| 1/2 / 2/3; 1/6 with exactly one full sister; residuary with paternal brother                             | Above + full brother, 2+ full sisters (unless paternal brother), full sister as residuary-with-daughters |
| Maternal sibling(s) | 1/6 one; 1/3 two+ shared equally (male = female)                                                       | Any descendant heir; father; grandfather                               |
| Residuary males  | Remainder by class/degree/strength                                                                        | Nearer residuary                                                        |

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

**Phase B (blocked on the SDK, tracked as an open dependency):**

- In-ayah coaching needs either `model.reference` populated or an SDK API that accepts external audio or alignment.
- With that, the design would be:
  - word time windows (from tajweed segment positions)
  - head evaluation inside each window
  - per-word "listen again" hints
- Same three-line verdict, no scores.
- Track this in `BACKLOG.md` as "Quran Lab: per-ayah alignment".

**Phase C (blocked):** madd duration and makharij feedback, once the SDK exposes validated heads.

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
  prayers: Array<ObligatoryPrayer | "jumuah">;              // default all 5 + jumuah
  start: { anchor: "adhan" | "iqamah"; offsetMin: number }; // iqamah only offered when the home masjid has iqamah times (private or public, NF-3.11); else adhan. default adhan+0
  durationMin: number;                                      // default 20, range 5–60
  unlockMode: "gentle" | "firm" | "strict";
  // gentle: "I'll pray now" unlock after a 10 s hold; firm: unlock only when the prayer is marked completed in-app;
  // strict: fixed until window end (marking prayed ends it early)
  emergencyUnlocksPerDay: number;                           // default 2, 0 allowed only in strict
  pauseWhileExcused: boolean;                               // default true (hayd/sick/travel)
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

- Apple may deny the distribution entitlement. Fallback: ship the soft prompt with the hard block disabled on iOS (feature-flag `focusLockHardIos`).
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

     | Tags | Shown as |
     | --- | --- |
     | `name`, `name:<locale>` | Localised name; the app locale is preferred |
     | `addr:*` | Address |
     | `website` / `contact:website` | Website link |
     | `phone` / `contact:phone` | Phone link |
     | `wheelchair` | Wheelchair badge |
     | `toilets`, `toilets:wheelchair` | Facility badges |
     | `denomination` | Info line |
     | `service_times` | Parsed with an `opening_hours`-syntax parser (see below) |
     | `opening_hours` | Open/closed hint only |

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
  osmType: "node" | "way" | "relation"; osmId: string;
  name?: string; lat: number; lon: number;
  jumuah?: string[];                         // only when parsed from public data
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

   | Prayer | Synonyms |
   | --- | --- |
   | fajr | Fajr, Fajar, Subh, Sobh, فجر, صبح |
   | sunrise | Sunrise, Shuruq, Ishraq, شروق |
   | dhuhr | Dhuhr, Zuhr, Zohar, Duhr, ظهر |
   | asr | Asr, عصر |
   | maghrib | Maghrib, مغرب |
   | isha | Isha, Esha, عشاء |
   | jumuah | Jumu'ah, Jummah, جمعة |

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
- [ ] Library menu entry (`lib/library-menu.ts`), home module id (`hiddenHomeModules`), search registration (`search-guides`), feature tour (`lib/feature-tours.ts`), "new features" badge (`lib/new-features.ts`)
- [ ] i18n keys in all 24 locales; RTL check (`lib/rtl.ts`, `chart-rtl.ts`)
- [ ] `useTheme()` everywhere; reduced motion respected; accessibility labels
- [ ] TV behaviour decided (hidden / read-only) via `isTV`
- [ ] Notifications registered in `build-reminders.ts` with a budget priority (§11) and a `notificationPrefs` toggle
- [ ] Excused-period behaviour implemented and tested
- [ ] Madhhab behaviour via `useMadhhab()` / `rulesFor(prefs, domain)`, including `null` = all views; new differences added to `FIQH_DIFFERENCES` with `usedIn` (coverage test passes)
- [ ] Evidence refs verified by `content-verification.ts`; no typed scripture
- [ ] **Scholar sign-off** (name + date recorded in the PR)
- [ ] Privacy review (lock-screen text, Sentry tags, data minimisation)
- [ ] `FEATURES.md` row added on ship; section removed from this file

---

## 11. Notification budget

`MAX_PENDING_REMINDERS = 60` over `SCHEDULE_DAYS_AHEAD = 2` (`lib/notifications/build-reminders.ts`). Extend `trimRemindersToBudget` to drop by priority, lowest first:

| Priority | Kinds                                                                                  |
| -------- | -------------------------------------------------------------------------------------- |
| 1 (keep) | Prayer, adhan, existing qaza                                                           |
| 2        | Iqamah (home masjid), focus lock confirm (if any JS-side), suhoor (intended fasts)     |
| 3        | Fast intent (night before), Dhul-Hijjah / Arafah / Ashura seasonal                     |
| 4        | Debts due, wasiyyah review                                                             |
| 5        | Family ties digest, muhasabah, habits, coach, rawatib nudge                            |

Focus lock timing lives in the **native** schedulers (DeviceActivity / AlarmManager) and does not count against this budget.

---

## 12. Evidence register

Every ref must be verified against the bundled corpus (or a cited printed edition) and recorded in `content-verification.ts` before the feature ships. Numbering follows the Sunnah.com / Dar-us-Salam conventions used by the existing datasets.

| Topic                       | Refs                                                                              |
| --------------------------- | --------------------------------------------------------------------------------- |
| Rawatib                     | Muslim 728, 725; Tirmidhi 415, 423; Bukhari 1180, 1182, 1183, 624; Abu Dawud 1271 |
| Voluntary fasting           | Tirmidhi 747; Muslim 1162, 1164, 1134, 1163, 1141, 1137, 1144; Bukhari 1969, 969, 1976, 1985, 1990, 1914; Abu Dawud 2437 |
| Dhul-Hijjah                 | Bukhari 969; Ahmad 5446; Muslim 1977; Tirmidhi 3585                               |
| Umrah                       | Abu Dawud 1892; existing hajj/umrah guide refs                                    |
| Sunnah habits               | Bukhari 887, 247, 2311, 5376, 1442, 6464; Tirmidhi 2891, 1956; Muslim 2702, 54; Qur'an 24:61 |
| Muhasabah                   | Qur'an 59:18; Umar's athar (Tirmidhi, under 2459); Bukhari 6306                   |
| Silat al-rahim              | Qur'an 4:1, 47:22–23; Bukhari 5986, 5984, 5971                                    |
| Debts                       | Qur'an 2:280, 2:282; Tirmidhi 1078; Muslim 1886; Bukhari 2387                     |
| Wasiyyah                    | Qur'an 2:180, 5:106; Bukhari 2738, 2742; Abu Dawud 2870; Tirmidhi 2120            |
| Mirath                      | Qur'an 4:11, 4:12, 4:176; Bukhari 6764; Tirmidhi 2109                             |
| Masjid                      | Bukhari 645, 444; Muslim 666                                                      |
| Focus lock                  | Qur'an 62:9, 23:1–2, 107:4–5                                                      |
| Family                      | Abu Dawud 495; Qur'an 66:6, 20:132                                                |
| Partner (dua in absence)    | Muslim 2733                                                                       |

---

## 13. Open questions (not blocking)

These can be settled during implementation; the defaults above apply until then.

1. **Scholar panel:** who signs off on each feature? (Name the people and record them in the PRs.)
2. **Mirath fixtures:** which printed editions are canonical per school? (The default proposal is above.)
3. **Group khatm timing:** D1 puts social last, but Ramadan 1448 (~Feb 2027) is the best launch moment for group khatm. Revisit if Phase 4 slips.
4. **Focus lock fallback:** if Apple denies the entitlement, do we ship the soft prompt on iOS (default yes) or hold the feature?
5. **Extra public timetable sources:** which sources (if any) publish iqamah times under terms that allow redistribution? Examples to evaluate include aggregator platforms and masjids' own public website feeds. Each needs a licence review before an adapter is written; until then only OSM data is shown.
6. **Kids content:** which existing datasets are suitable for under-7s, and is there an OSS kids' audio source?
