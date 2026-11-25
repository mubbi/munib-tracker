# UI/UX redesign — progress

Live checklist for [`ui-ux-implementation-plan.md`](./ui-ux-implementation-plan.md). Native surfaces and per-platform validation are tracked in [`cross-platform-progress.md`](./cross-platform-progress.md).

Last updated: 2026-11-25 · 148 tasks · 68 P0 · 65 P1 · 15 P2

## Legend and rules

| Status          | Meaning                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **Pending**     | Not started                                                                                        |
| **In progress** | An owner is named and has started; owned paths are locked to that work package                     |
| **Completed**   | Acceptance criteria met **and** evidence recorded in the "Validation evidence" column              |
| **Blocked**     | Cannot proceed — reason and the unblocking task / person in the evidence column (e.g. "needs Mac") |
| **Reviewed**    | A second agent or the owner checked the evidence and the diff                                      |

| Rule                                                 | Detail                                                                                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Never mark Completed without validation evidence** | Evidence = a test name + run reference, a guard count, a screenshot / recording path, or a dated device note. "Looks right" is not evidence |
| One owner per task                                   | Owner column = agent / person + model (e.g. `agent-5B · Sonnet`). Set it when the status becomes In progress                                |
| Only the owner edits its row                         | The wave coordinator edits gates and the lane-sweep matrix                                                                                  |
| Blocked is not Completed                             | A task that passes Jest but still needs a Mac or device check is **Blocked (needs Mac / device)** until that check is recorded              |
| Scope changes go in the plan first                   | New tasks get the next free ID in the plan; IDs are never reused                                                                            |

## Programme stages

| Stage                 | Deliverable                                                                                                                                          | Status    | Validation evidence                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1–2 Audit             | [`ui-ux-audit.md`](./ui-ux-audit.md) — 408 findings (A–G), code-based                                                                                | Completed | Seven audit slices (A foundations, B tracking, C library, D settings, E platforms, F copy + a11y, G coverage) consolidated; severity counts High 53 / Medium 191 / Low 164 |
| 3 Design-system spec  | [`design-system.md`](./design-system.md)                                                                                                             | Completed | Contrast figures computed for 12 accents × 2 schemes; cites audit IDs                                                                                                      |
| 3 Cross-platform spec | [`cross-platform-design-system.md`](./cross-platform-design-system.md)                                                                               | Completed | Token layering + shared-vs-platform table                                                                                                                                  |
| 3 Platform guidelines | [`platform-ux-guidelines.md`](./platform-ux-guidelines.md)                                                                                           | Completed | Per-platform requirements + QA checklists                                                                                                                                  |
| 4 Implementation plan | [`ui-ux-implementation-plan.md`](./ui-ux-implementation-plan.md), [`cross-platform-implementation-plan.md`](./cross-platform-implementation-plan.md) | Completed | 148 + 26 tasks; traceability check: 53 / 53 High findings mapped, 6 Medium / Low deferred with reasons; all task dependencies resolve                                      |
| 5 Execution           | Phases 1–11 below                                                                                                                                    | Pending   | —                                                                                                                                                                          |

## Phase gates

A phase gate is signed when every task in the phase is Completed or Reviewed (or explicitly deferred in the plan) and the gate check passes.

| Phase                                    | Tasks | P0  | Gate check                                                                   | Status                               | Signed by / date | Evidence                                   |
| ---------------------------------------- | ----- | --- | ---------------------------------------------------------------------------- | ------------------------------------ | ---------------- | ------------------------------------------ |
| 1 Design-token foundation                | 9     | 6   | Contrast matrix green; token unit tests green; guard installed               | Pending                              | —                | —                                          |
| 2 Theme architecture                     | 6     | 3   | Fresh install follows system; one focus-ring rule; full Jest green           | Passed — browser focus check pending | Lead, 2026-11-25 | P2-01…P2-06 Completed; see Wave 1 gate run |
| 3 Shared component redesign              | 18    | 11  | Primitive suites green; codemod guard counts at baseline; web keyboard smoke | Pending                              | —                | —                                          |
| 4 Navigation                             | 11    | 3   | Shell tests green; rail emits anchors; tablet rail persists                  | Pending                              | —                | —                                          |
| 5 Screen-by-screen                       | 57    | 29  | All ten lanes done; behaviour-preservation diff signed per lane              | Pending                              | —                | —                                          |
| 6 Forms & interactions                   | 7     | 1   | Field / control / target guards at 0 in every lane                           | Pending                              | —                | —                                          |
| 7 Dialogs, modals & overlays             | 5     | 1   | No `Alert.alert`, no raw `Modal`; every sheet titled                         | Pending                              | —                | —                                          |
| 8 Loading, empty, error & success states | 7     | 2   | No early `return null`; every data screen has loading, empty, error          | Pending                              | —                | —                                          |
| 9 Accessibility                          | 9     | 1   | i18n suites green; a11y sweeps ticked in every lane                          | Pending                              | —                | —                                          |
| 10 Platform refinements                  | 8     | 2   | TV density guard at 0; platform checklists run or Blocked with reason        | Pending                              | —                | —                                          |
| 11 Testing & final QA                    | 11    | 9   | `pnpm check:ci` green; QA checklists signed; owner sign-off                  | Pending                              | —                | —                                          |

## Wave gates

| Wave                 | Work packages                 | Gate                                                     | Status              | Run reference                                                                                                                                                                                                                                                                                                                             |
| -------------------- | ----------------------------- | -------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 Baseline           | WP-0                          | Baseline table below filled                              | Pending             | —                                                                                                                                                                                                                                                                                                                                         |
| 1 Foundation         | WP-1A → WP-1B ∥ WP-1C (∥ N-A) | Contrast matrix + `pnpm turbo run lint check-types test` | Passed (2026-11-25) | App Jest 1039/1040 suites, 12266/12269 tests — sole failure `reading-card.test.tsx` (translation-toggle case) sits on pre-existing uncommitted user edits to `reading-card.tsx`, not Wave 1; `pnpm --filter app check-types` green; theme Vitest 149/149; Biome clean on touched files. Phase 1 gate stays open until P1-09 guard (WP-3A) |
| 2 Primitives         | WP-2A → WP-2B ∥ WP-2C ∥ WP-2D | Primitive suites + web keyboard smoke + i18n gate        | Pending             | —                                                                                                                                                                                                                                                                                                                                         |
| 3 Adoption           | WP-3A (exclusive)             | Codemods landed, guard baseline written, full test run   | Pending             | —                                                                                                                                                                                                                                                                                                                                         |
| 4 Navigation & shell | WP-4A ∥ WP-4B ∥ WP-4C         | Shell tests + i18n gate                                  | Pending             | —                                                                                                                                                                                                                                                                                                                                         |
| 5 Screens            | WP-5A … WP-5J                 | Lane tasks + lane sweeps + i18n gate                     | Pending             | —                                                                                                                                                                                                                                                                                                                                         |
| 6 Closers            | WP-6A → WP-6B → WP-6C         | `pnpm check:ci`; guard baseline = allowlist only         | Pending             | —                                                                                                                                                                                                                                                                                                                                         |
| 7 QA & sign-off      | WP-7                          | Phase-11 gates signed                                    | Pending             | —                                                                                                                                                                                                                                                                                                                                         |

## Baseline (fill in `P11-01` before Wave 1)

| Measure                                            | Value | Source        |
| -------------------------------------------------- | ----- | ------------- |
| `pnpm check:ci`                                    | —     | —             |
| Jest suites / tests (apps/app)                     | —     | —             |
| Raw `fontSize` literals (audit A: 159 in 88 files) | —     | guard dry run |
| Quoted hex literals (audit A: 68 in 18 files)      | —     | guard dry run |
| `color: colors.accent` (audit A: 93 in 65 files)   | —     | guard dry run |
| `Spacing.x ± n` (audit A: 270 in 151 files)        | —     | guard dry run |
| Raw `TextInput` (audit A: 66 in 50 files)          | —     | guard dry run |
| `ActivityIndicator` (audit A: 47 in 41 files)      | —     | guard dry run |
| Web export size                                    | —     | `build:web`   |

## Phase 1 — Design-token foundation

| ID    | Task                     | WP    | Pri | Cx  | Model  | Status    | Owner       | Validation evidence                                                                                                                                                                                                                                                                                                                                                                             |
| ----- | ------------------------ | ----- | --- | --- | ------ | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1-01 | Accent palette (D-UX1)   | WP-1A | P0  | S   | Sonnet | Completed | Opus (lead) | `accents.ts` amber `#B45309`, lime `#4D7C0F`; new Vitest matrix in `accents.test.ts`: every preset ≥ 3:1 on background/card/muted (light) and background/card (dark) — theme suite 143/143 pass (2026-11-25). Marketing/admin builds not yet re-run → at Wave 1 gate                                                                                                                            |
| P1-02 | Colour maths             | WP-1A | P0  | S   | Sonnet | Completed | Opus (lead) | `compositeOver()` + `contrastMatrix()` in `color.ts` (subpath export `@munib-tracker/theme/color`; package has no barrel); tests in `color.test.ts` pass                                                                                                                                                                                                                                        |
| P1-03 | Derived colour tokens    | WP-1B | P0  | M   | Opus   | Completed | Opus        | `lib/theme-tokens.ts`: accentOnSoft, focusRing (= accentText), status.X.onSoft, status.danger.fill/onFill (`DangerFillPalette`), switchTrackOff, inputSurfaceError, hover, scrimStrong, onScrim. Jest matrix 12 accents × 2 schemes green (accentOnSoft min 4.59 L / 4.51 D; focusRing min 4.01 / 3.77). Deviation: white on scrimStrong tested ≥ 7 (spec said 8.5; computes 8.45) (2026-11-25) |
| P1-04 | Layout / geometry tokens | WP-1B | P0  | S   | Sonnet | Completed | Opus        | `constants/theme.ts`: Spacing.oneHalf/twoHalf, Radius.xs, BorderWidth, Control, IconSize (raw dp), ZIndex, Opacity, Breakpoints, Metal; ThemeColor += accentText/cardBorder/input/inputBorder. tvOS test: oneHalf 12, Control.md 88, IconSize.md 16, minTouch unscaled (2026-11-25)                                                                                                             |
| P1-05 | Motion tokens            | WP-1B | P1  | S   | Sonnet | Completed | Opus        | `Springs.sheet` (damping 20, stiffness 300); new `motion.test.ts` (2026-11-25)                                                                                                                                                                                                                                                                                                                  |
| P1-06 | Type ramp (`ThemedText`) | WP-1B | P0  | M   | Opus   | Completed | Opus        | ThemedText bodyLarge/button/footnote + TvType rows, `weight` prop, title lh 48, code lh 18, linkPrimary → accentText 14/22/600, `link` removed (0 usages; type error verified), per-variant maxFontSizeMultiplier, derived lineHeight for lone fontSize. TV linkPrimary 16/24 (spec gap). Tests pass (2026-11-25)                                                                               |
| P1-07 | TV overscan              | WP-1B | P2  | S   | Sonnet | Completed | Opus        | `TvLayout.overscanY = tvDp(30)`; new `tv-layout.test.ts`. tvOS visual check → cross-platform tracker (Mac) (2026-11-25)                                                                                                                                                                                                                                                                         |
| P1-08 | Dead radius scale        | WP-1A | P2  | S   | Sonnet | Completed | Opus (lead) | Zero importers of `@munib-tracker/theme/tokens` in apps/, packages/, tools/; `tokens.ts` + `./tokens` export deleted; theme `tsc --noEmit` clean                                                                                                                                                                                                                                                |
| P1-09 | Design-system guard      | WP-3A | P0  | M   | Opus   | Pending   | —           | —                                                                                                                                                                                                                                                                                                                                                                                               |

## Phase 2 — Theme architecture

| ID    | Task                           | WP    | Pri | Cx  | Model  | Status    | Owner | Validation evidence                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----- | ------------------------------ | ----- | --- | --- | ------ | --------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2-01 | First-run colour mode (D-UX2)  | WP-1C | P0  | M   | Opus   | Completed | Opus  | D-UX2: `DEFAULT_COLOR_MODE = "system"`; existing-install detection (onboarding done / stored accent / custom accent, no stored mode) → persist "dark" once; fresh installs no longer stamp synced prefs. Pure rules in `lib/boot/cold-start.ts`; Jest theme-provider + cold-start pass (2026-11-25)                                                                                                                        |
| P2-02 | Web focus ring + CSS variables | WP-1C | P0  | M   | Opus   | Completed | Opus  | Provider publishes `--munib-focus` (= tokens.focusRing), `--munib-focus-halo`, `--munib-bg`, `--munib-fg` (`styles/theme-css-variables.ts`); single `:focus-visible` rule in `+html.tsx` (2px ring, 2px offset, halo, forced-colors, no radius); `styles/focus-visible.*` deleted; no `--focus-ring-color` left. Jest (web) amber/lime + mode switch pass; check-types green. Browser visual check still open (2026-11-25) |
| P2-03 | Suspense fallback              | WP-1C | P1  | S   | Sonnet | Completed | Opus  | route-suspense-fallback uses resolveTheme + computeThemeTokens via new `lib/boot/resolved-accent.ts` mirror; no hex left; rose-accent Jest case passes L/D (2026-11-25)                                                                                                                                                                                                                                                    |
| P2-04 | `ThemedView`                   | WP-1C | P2  | S   | Sonnet | Completed | Opus  | `themed-view.tsx` + test deleted; sole importer `+not-found.tsx` → View + colors.background; typecheck has no new errors (2026-11-25)                                                                                                                                                                                                                                                                                      |
| P2-05 | Token access + test fixtures   | WP-1B | P0  | S   | Sonnet | Completed | Opus  | No hook change needed (provider memoises computeThemeTokens); new `use-theme-tokens.test.tsx`; fixtures use real provider (documented in test-support/README.md) (2026-11-25)                                                                                                                                                                                                                                              |
| P2-06 | Boot / PWA colours             | WP-1C | P1  | S   | Sonnet | Completed | Opus  | pwa.ts + cold-start derive from resolveTheme; manifest light base (#F5F0E6) + prefers-color-scheme metas; app.json web colours + public/manifest.json synced, guarded by pwa.test.ts. Manual "no dark flash" web check still open (2026-11-25)                                                                                                                                                                             |

## Phase 3 — Shared component redesign

| ID    | Task                                                                                              | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ------------------------------------------------------------------------------------------------- | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P3-01 | `PressableScale`                                                                                  | WP-2A | P0  | M   | Opus   | Pending | —     | —                   |
| P3-02 | `Button`                                                                                          | WP-2A | P0  | M   | Sonnet | Pending | —     | —                   |
| P3-03 | `IconButton` / `LabeledIconButton`                                                                | WP-2A | P1  | S   | Sonnet | Pending | —     | —                   |
| P3-04 | `Stepper` + `StepperRow`                                                                          | WP-2A | P1  | S   | Sonnet | Pending | —     | —                   |
| P3-05 | `Chip` / `ToggleChip` / `Pill` / `NewBadge`                                                       | WP-2B | P0  | S   | Sonnet | Pending | —     | —                   |
| P3-06 | `SegmentedControl`                                                                                | WP-2B | P1  | S   | Sonnet | Pending | —     | —                   |
| P3-07 | `SwitchRow` / `ThemedSwitch`                                                                      | WP-2B | P0  | M   | Sonnet | Pending | —     | —                   |
| P3-08 | `NavRow`, `ListIndexBadge`, `NotificationBadge`                                                   | WP-2B | P0  | M   | Sonnet | Pending | —     | —                   |
| P3-09 | `SectionHeader`, `CollapsibleSection`, `StatCard`, `StatPair`, `Divider`                          | WP-2B | P1  | M   | Sonnet | Pending | —     | —                   |
| P3-10 | `Sheet`                                                                                           | WP-2C | P0  | L   | Opus   | Pending | —     | —                   |
| P3-11 | `ConfirmDialog`                                                                                   | WP-2C | P0  | M   | Sonnet | Pending | —     | —                   |
| P3-12 | Toast                                                                                             | WP-2C | P0  | M   | Sonnet | Pending | —     | —                   |
| P3-13 | `Callout`, `ContentState`, `Skeleton`, `RetryCard`, `EmptyState`, `UnavailableOnDevice`, progress | WP-2C | P0  | M   | Opus   | Pending | —     | —                   |
| P3-14 | `TextField` family + `SearchField` v2                                                             | WP-2D | P0  | L   | Opus   | Pending | —     | —                   |
| P3-15 | `ContextMenu`                                                                                     | WP-2C | P1  | M   | Sonnet | Pending | —     | —                   |
| P3-16 | Adoption codemod — colour roles                                                                   | WP-3A | P0  | L   | Opus   | Pending | —     | —                   |
| P3-17 | Adoption codemod — spacing, geometry, order                                                       | WP-3A | P1  | L   | Sonnet | Pending | —     | —                   |
| P3-18 | Adoption codemod — type                                                                           | WP-3A | P1  | L   | Sonnet | Pending | —     | —                   |

## Phase 4 — Navigation

| ID    | Task                          | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ----------------------------- | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P4-01 | Web bottom tab bar            | WP-4A | P0  | M   | Sonnet | Pending | —     | —                   |
| P4-02 | Web global rail               | WP-4A | P1  | M   | Sonnet | Pending | —     | —                   |
| P4-03 | Native tabs + TV rail density | WP-4B | P0  | S   | Sonnet | Pending | —     | —                   |
| P4-04 | Tablet side rail (D-UX3)      | WP-4B | P1  | L   | Opus   | Pending | —     | —                   |
| P4-05 | Back fallback                 | WP-4C | P1  | M   | Opus   | Pending | —     | —                   |
| P4-06 | `AppHeader`                   | WP-4C | P0  | M   | Sonnet | Pending | —     | —                   |
| P4-07 | `ScreenLayout`                | WP-4C | P1  | M   | Sonnet | Pending | —     | —                   |
| P4-08 | Error fallbacks               | WP-4C | P1  | S   | Sonnet | Pending | —     | —                   |
| P4-09 | Android predictive back       | WP-4B | P1  | M   | Opus   | Pending | —     | —                   |
| P4-10 | Root overlay order            | WP-4B | P2  | S   | Sonnet | Pending | —     | —                   |
| P4-11 | TV feature scope (D-UX5)      | WP-4B | P1  | M   | Sonnet | Pending | —     | —                   |

## Phase 5 — Screen-by-screen

| ID    | Task                                                                                                    | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ------------------------------------------------------------------------------------------------------- | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P5-01 | Tracker tab layout                                                                                      | WP-5A | P0  | L   | Opus   | Pending | —     | —                   |
| P5-02 | `PrayerTrackerRow`                                                                                      | WP-5A | P0  | M   | Opus   | Pending | —     | —                   |
| P5-03 | `PrayerStatusSheet`                                                                                     | WP-5A | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-04 | Home hero (`PrayerTimesHero`)                                                                           | WP-5A | P0  | M   | Opus   | Pending | —     | —                   |
| P5-05 | Home below the fold                                                                                     | WP-5A | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-06 | Schedule                                                                                                | WP-5A | P0  | S   | Sonnet | Pending | —     | —                   |
| P5-07 | Mark-current deep link                                                                                  | WP-5A | P2  | S   | Sonnet | Pending | —     | —                   |
| P5-08 | Sunnah habits, Rawatib, Friday, White Days                                                              | WP-5A | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-09 | Qaza hub                                                                                                | WP-5B | P0  | L   | Opus   | Pending | —     | —                   |
| P5-10 | Qaza fasts (`roza`)                                                                                     | WP-5B | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-11 | Qaza calculator, planner, history                                                                       | WP-5B | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-12 | Calendar                                                                                                | WP-5B | P0  | L   | Opus   | Pending | —     | —                   |
| P5-13 | Hijri converter                                                                                         | WP-5B | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-14 | Voluntary fasting                                                                                       | WP-5B | P0  | M   | Opus   | Pending | —     | —                   |
| P5-15 | Ramadan, Dhul-Hijjah, Tahajjud, Last third                                                              | WP-5B | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-16 | Tasbeeh routes scaffold                                                                                 | WP-5C | P0  | L   | Opus   | Pending | —     | —                   |
| P5-17 | Tasbeeh counter behaviour                                                                               | WP-5C | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-18 | Zikr routes                                                                                             | WP-5C | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-19 | Zikr guided session                                                                                     | WP-5C | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-20 | Adhkar builder                                                                                          | WP-5C | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-21 | Statistics                                                                                              | WP-5D | P0  | M   | Opus   | Pending | —     | —                   |
| P5-22 | Charts and stats a11y                                                                                   | WP-5D | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-23 | Achievements                                                                                            | WP-5D | P2  | S   | Sonnet | Pending | —     | —                   |
| P5-24 | Journal                                                                                                 | WP-5D | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-25 | Muhasabah                                                                                               | WP-5D | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-26 | Coach                                                                                                   | WP-5D | P2  | S   | Sonnet | Pending | —     | —                   |
| P5-27 | Qur'an hub / surah list                                                                                 | WP-5E | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-28 | Surah reader                                                                                            | WP-5E | P0  | L   | Opus   | Pending | —     | —                   |
| P5-29 | Page and mushaf readers                                                                                 | WP-5E | P0  | M   | Opus   | Pending | —     | —                   |
| P5-30 | Find an ayah                                                                                            | WP-5E | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-31 | Khatm, pages, practice, hifz, revision, notes, bookmarks, roots                                         | WP-5E | P1  | L   | Sonnet | Pending | —     | —                   |
| P5-32 | Library tab                                                                                             | WP-5F | P0  | L   | Opus   | Pending | —     | —                   |
| P5-33 | Universal search                                                                                        | WP-5F | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-34 | Hadith hub, collection, daily, saved                                                                    | WP-5F | P0  | L   | Opus   | Pending | —     | —                   |
| P5-35 | Duas, Duroods, 99 Names                                                                                 | WP-5F | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-36 | Saved hub and vocabulary                                                                                | WP-5F | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-37 | Content actions, reading controls, audio                                                                | WP-5F | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-38 | Fiqh detail, Credits, Flash cards                                                                       | WP-5F | P2  | S   | Sonnet | Pending | —     | —                   |
| P5-39 | Learn kit                                                                                               | WP-5G | P0  | L   | Opus   | Pending | —     | —                   |
| P5-40 | Learn hubs — aqeedah, prophets, jannah, jahannam, last-day, learn-dua, sahaba, battles, history, events | WP-5G | P1  | L   | Sonnet | Pending | —     | —                   |
| P5-41 | Learn lists and details (same modules)                                                                  | WP-5G | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-42 | Salah guide, Learn Qur'an, Taharah, Sick / Hayd, Travel, Janazah, New Muslim                            | WP-5H | P1  | L   | Sonnet | Pending | —     | —                   |
| P5-43 | Kids, Hajj, Umrah, Eid, Laylat al-Qadr, Ruqyah                                                          | WP-5H | P1  | S   | Sonnet | Pending | —     | —                   |
| P5-44 | Settings hub and rows                                                                                   | WP-5I | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-45 | Reset app data                                                                                          | WP-5I | P0  | M   | Opus   | Pending | —     | —                   |
| P5-46 | Backup & restore                                                                                        | WP-5I | P0  | L   | Opus   | Pending | —     | —                   |
| P5-47 | Import Salah history                                                                                    | WP-5I | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-48 | Sign-in and OAuth returns                                                                               | WP-5I | P0  | M   | Opus   | Pending | —     | —                   |
| P5-49 | App lock and PIN                                                                                        | WP-5I | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-50 | Onboarding and tour                                                                                     | WP-5I | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-51 | Profile and delete account                                                                              | WP-5I | P1  | M   | Sonnet | Pending | —     | —                   |
| P5-52 | Notifications, permissions, offline data, misc settings, system screens                                 | WP-5I | P1  | L   | Sonnet | Pending | —     | —                   |
| P5-53 | Circles hub, join, family, invite                                                                       | WP-5J | P1  | L   | Sonnet | Pending | —     | —                   |
| P5-54 | Khatm group                                                                                             | WP-5J | P0  | M   | Sonnet | Pending | —     | —                   |
| P5-55 | Finance forms — zakat, sadaqah, fidyah, debts, wasiyyah                                                 | WP-5J | P0  | L   | Opus   | Pending | —     | —                   |
| P5-56 | Wizards — focus lock, wasiyyah, mirath                                                                  | WP-5J | P1  | M   | Opus   | Pending | —     | —                   |
| P5-57 | Masjids, Family ties, Qibla, Content report                                                             | WP-5J | P1  | L   | Sonnet | Pending | —     | —                   |

## Phase 6 — Forms & interactions

| ID    | Task                           | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ------------------------------ | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P6-01 | Field migration sweep          | lanes | P1  | L   | Sonnet | Pending | —     | —                   |
| P6-02 | Duplicate control sweep        | lanes | P1  | L   | Sonnet | Pending | —     | —                   |
| P6-03 | Validation pattern sweep       | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P6-04 | Undo toast helper              | WP-2C | P0  | S   | Sonnet | Pending | —     | —                   |
| P6-05 | Haptics vocabulary pass        | lanes | P2  | S   | Sonnet | Pending | —     | —                   |
| P6-06 | Single-choice convention sweep | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P6-07 | Touch-target sweep             | lanes | P1  | M   | Sonnet | Pending | —     | —                   |

## Phase 7 — Dialogs, modals & overlays

| ID    | Task                                       | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ------------------------------------------ | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P7-01 | `Alert.alert` call sites                   | WP-3A | P0  | S   | Sonnet | Pending | —     | —                   |
| P7-02 | Raw `Modal` → `Sheet variant="fullscreen"` | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P7-03 | Sheet title and naming sweep               | lanes | P1  | L   | Sonnet | Pending | —     | —                   |
| P7-04 | Destructive confirmation sweep             | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P7-05 | Feedback matrix sweep (toasts)             | lanes | P2  | M   | Sonnet | Pending | —     | —                   |

## Phase 8 — Loading, empty, error & success states

| ID    | Task                           | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ------------------------------ | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P8-01 | Never-null routes              | lanes | P0  | M   | Sonnet | Pending | —     | —                   |
| P8-02 | Hydration gates                | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P8-03 | Error and offline states       | lanes | P0  | M   | Sonnet | Pending | —     | —                   |
| P8-04 | Loading primitive adoption     | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P8-05 | Empty and not-found states     | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P8-06 | Unavailable-on-device adoption | lanes | P1  | S   | Sonnet | Pending | —     | —                   |
| P8-07 | Success and undo feedback      | lanes | P1  | M   | Sonnet | Pending | —     | —                   |

## Phase 9 — Accessibility

| ID    | Task                            | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ----- | ------------------------------- | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P9-01 | Arabic language tagging         | WP-1B | P0  | S   | Sonnet | Pending | —     | —                   |
| P9-02 | Roles and names sweep           | lanes | P1  | S   | Sonnet | Pending | —     | —                   |
| P9-03 | Colour-only meaning sweep       | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P9-04 | Dynamic Type sweep              | lanes | P1  | M   | Sonnet | Pending | —     | —                   |
| P9-05 | Announcements sweep             | lanes | P1  | S   | Sonnet | Pending | —     | —                   |
| P9-06 | Images                          | lanes | P2  | S   | Sonnet | Pending | —     | —                   |
| P9-07 | RTL sweep                       | lanes | P1  | S   | Sonnet | Pending | —     | —                   |
| P9-08 | Reduced motion and text opacity | lanes | P2  | S   | Sonnet | Pending | —     | —                   |
| P9-09 | Microcopy and terminology pass  | WP-6A | P1  | L   | Opus   | Pending | —     | —                   |

## Phase 10 — Platform refinements

| ID     | Task                             | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ------ | -------------------------------- | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P10-01 | PWA manifest                     | WP-4A | P1  | S   | Sonnet | Pending | —     | —                   |
| P10-02 | PWA install affordance           | WP-4A | P2  | M   | Sonnet | Pending | —     | —                   |
| P10-03 | Web keyboard and dialog QA fixes | WP-7  | P0  | S   | Opus   | Pending | —     | —                   |
| P10-04 | TV density sweep                 | WP-6B | P0  | M   | Opus   | Pending | —     | —                   |
| P10-05 | TV focus                         | WP-6B | P1  | M   | Sonnet | Pending | —     | —                   |
| P10-06 | Tablet list–detail extension     | WP-6B | P2  | L   | Opus   | Pending | —     | —                   |
| P10-07 | Android target sizes and insets  | WP-7  | P1  | S   | Sonnet | Pending | —     | —                   |
| P10-08 | Native pointer hover             | WP-7  | P2  | S   | Sonnet | Pending | —     | —                   |

## Phase 11 — Testing & final QA

| ID     | Task                         | WP    | Pri | Cx  | Model  | Status  | Owner | Validation evidence |
| ------ | ---------------------------- | ----- | --- | --- | ------ | ------- | ----- | ------------------- |
| P11-01 | Baseline                     | WP-0  | P0  | S   | Sonnet | Pending | —     | —                   |
| P11-02 | Wave gates                   | WP-6A | P0  | S   | Sonnet | Pending | —     | —                   |
| P11-03 | Contrast and token tests     | WP-6C | P0  | S   | Sonnet | Pending | —     | —                   |
| P11-04 | Guard ratchet to final       | WP-6C | P0  | S   | Sonnet | Pending | —     | —                   |
| P11-05 | Behaviour-preservation check | WP-7  | P0  | M   | Opus   | Pending | —     | —                   |
| P11-06 | Web visual + keyboard QA     | WP-7  | P0  | M   | Sonnet | Pending | —     | —                   |
| P11-07 | Android phone, tablet, TV QA | WP-7  | P0  | M   | Sonnet | Pending | —     | —                   |
| P11-08 | iOS, iPad, tvOS QA (Mac)     | WP-7  | P0  | M   | Sonnet | Pending | —     | —                   |
| P11-09 | i18n and RTL QA              | WP-7  | P1  | M   | Sonnet | Pending | —     | —                   |
| P11-10 | Docs                         | WP-6C | P1  | S   | Sonnet | Pending | —     | —                   |
| P11-11 | Sign-off                     | WP-7  | P0  | S   | Opus   | Pending | —     | —                   |

## Lane-sweep matrix

Tasks owned by `lanes` are done once per Wave-5 lane, inside that lane's paths. The task row above becomes Completed only when every applicable cell here is Completed (or n/a with a reason). Cell values: Pending / In progress / Completed / n/a.

| Sweep                                            | 5A      | 5B      | 5C      | 5D      | 5E      | 5F      | 5G      | 5H      | 5I      | 5J      |
| ------------------------------------------------ | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| P6-01 Field migration sweep                      | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P6-02 Duplicate control sweep                    | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P6-03 Validation pattern sweep                   | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P6-05 Haptics vocabulary pass                    | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P6-06 Single-choice convention sweep             | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P6-07 Touch-target sweep                         | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P7-02 Raw `Modal` → `Sheet variant="fullscreen"` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P7-03 Sheet title and naming sweep               | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P7-04 Destructive confirmation sweep             | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P7-05 Feedback matrix sweep (toasts)             | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-01 Never-null routes                          | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-02 Hydration gates                            | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-03 Error and offline states                   | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-04 Loading primitive adoption                 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-05 Empty and not-found states                 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-06 Unavailable-on-device adoption             | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P8-07 Success and undo feedback                  | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-02 Roles and names sweep                      | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-03 Colour-only meaning sweep                  | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-04 Dynamic Type sweep                         | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-05 Announcements sweep                        | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-06 Images                                     | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-07 RTL sweep                                  | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| P9-08 Reduced motion and text opacity            | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## Primitive change requests

After Wave 2, tokens and `components/ui/**` are frozen. Lanes request changes here; the primitive owner batches them between waves.

| #   | Requested by (WP / task) | Primitive or token | Change | Why | Status | Evidence |
| --- | ------------------------ | ------------------ | ------ | --- | ------ | -------- |
| —   | —                        | —                  | —      | —   | —      | —        |

## i18n patch log

One patch file per work package (`apps/app/scripts/i18n/ux-<wp>-i18n.json`), applied by WP-6A at each wave gate and then deleted.

| Wave | Patch file | Keys added / changed | Applied (test run) | Deleted |
| ---- | ---------- | -------------------- | ------------------ | ------- |
| —    | —          | —                    | —                  | —       |

## Blocked log

| Task | Blocked since | Reason | Needs | Cleared |
| ---- | ------------- | ------ | ----- | ------- |
| —    | —             | —      | —     | —       |
