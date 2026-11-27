# Design system (product app)

Status: implemented (Waves 1–6, 2026-11-25) — the source of truth for UI work; per-task status and any deviations in [`ui-ux-progress.md`](./ui-ux-progress.md), reviews in [`ui-ux-final-review.md`](./ui-ux-final-review.md). Native/device verification still pending where marked.

The design language of `apps/app` (iOS, Android, Web, Apple TV / Android TV). It **extends** the system that already ships — existing token names and values stay. Rows marked **NEW** or **FIX** are proposals; each cites the audit finding that justifies it (`A-nn` foundations, `B-`/`C-`/`D-` screens, `E-nn` platforms, `F-nn` copy + a11y). Everything unmarked describes current code.

Companion docs: [`cross-platform-design-system.md`](./cross-platform-design-system.md) (token layering, native surfaces) · [`platform-ux-guidelines.md`](./platform-ux-guidelines.md) (per-platform rules + QA) · [`TV.md`](./TV.md) (density, focus plumbing).

| Layer                               | Source of truth                                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colour primitives + semantic colour | [`packages/theme/src/`](../packages/theme/src/) — `accents.ts`, `resolve-theme.ts`, `color.ts`                                                                   |
| Derived colour tokens               | [`apps/app/src/lib/theme-tokens.ts`](../apps/app/src/lib/theme-tokens.ts) → `useThemeTokens()` = `{ colors, tokens, scheme, … }`                                 |
| Layout, geometry, static palettes   | [`apps/app/src/constants/theme.ts`](../apps/app/src/constants/theme.ts)                                                                                          |
| Motion                              | [`apps/app/src/constants/motion.ts`](../apps/app/src/constants/motion.ts)                                                                                        |
| Type ramp                           | [`apps/app/src/components/themed-text.tsx`](../apps/app/src/components/themed-text.tsx) (+ `TvType` in [`tv-layout.ts`](../apps/app/src/constants/tv-layout.ts)) |
| TV density                          | [`apps/app/src/constants/tv-density.ts`](../apps/app/src/constants/tv-density.ts) — `tvDp()`, `TV_DENSITY`                                                       |
| Primitives                          | [`apps/app/src/components/ui/`](../apps/app/src/components/ui/)                                                                                                  |

Contrast figures in this doc are **computed** (WCAG 2.x formula, hex values from the repo, translucent tints composited over the stated surface) for all 12 preset accents × light/dark. Nothing here was measured on a device.

## Principles

| #   | Principle                          | What it means in practice                                                                                                                               |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Worship first, chrome second**   | Marking a Salah, counting a zikr and reading an ayah are one action from where the user is. Chrome (borders, shadows, badges) never competes with them. |
| 2   | **Calm confidence**                | Deep green, cream and gold; one accent per screen; springs that settle without bounce; no red unless something is destroyed or failed.                  |
| 3   | **Record, never judge**            | Missed worship is shown as something to make up, not a debt or failure. No streak-loss drama, no guilt colours, no exclamation marks.                   |
| 4   | **Scripture is never compromised** | Arabic text is never truncated, restyled, letter-spaced, auto-shrunk or squeezed to fit a layout. Layout yields to the text.                            |
| 5   | **Legible for every reader**       | AA contrast for every accent in both schemes; body text scales freely; 44pt/48dp targets; meaning never by colour alone.                                |
| 6   | **One system, native feel**        | One token set and one component set; platform conventions (tab bar, ripple, focus engine, back) win over visual sameness.                               |
| 7   | **Tokens over literals**           | No raw hex, font size, spacing arithmetic or opacity in screens. If a value is missing, add a token here first.                                         |

## Colour

### Surface ladder and text (existing — unchanged)

| Token                           | Light     | Dark      | Use                                            | Contrast (computed)                                           |
| ------------------------------- | --------- | --------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `background`                    | `#F5F0E6` | `#152921` | Page                                           | —                                                             |
| `card`                          | `#FFFDF9` | `#1E3830` | Elevated surface; always with 1px `cardBorder` | decorative step (~1.2:1)                                      |
| `muted`                         | `#EAE3D4` | `#2B463D` | Chips, wells, list rows, segmented track       | decorative step                                               |
| `input`                         | `#FFFFFF` | `#2B463D` | Field fill; always with `inputBorder`          | —                                                             |
| `foreground` / `cardForeground` | `#152921` | `#EEE4D2` | Primary text and icons                         | ≥ 10.0:1 on background/card (target 4.5)                      |
| `mutedForeground`               | `#4A6157` | `#A2BDB0` | Secondary text, placeholder, inactive icons    | 5.1–7.6:1 on background, card **and** muted (target 4.5)      |
| `border`                        | `#D2C7B1` | `#3D5F53` | Decorative dividers, ghost-button outline      | decorative — never the only boundary of a control             |
| `cardBorder`                    | `#E3D9C6` | `#30504A` | Card outline                                   | decorative                                                    |
| `inputBorder`                   | `#8C826E` | `#60857A` | Field outline, **off-switch track (NEW use)**  | 3.3–3.7:1 light, 3.1–3.7:1 dark vs card/background (target 3) |

### Accent roles

| Token                  | Definition                                                                                                                                                       | Use as                                                                                          | Never as                                               | Target                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `accent`               | Preset light/dark shade, or custom hex via `ensureContrastAgainst(…, background, 3)`                                                                             | **Fill**: primary button, selected solid chip, switch-on track, progress fill                   | Text, thin glyphs, focus ring (A-02, E-04)             | 3:1 vs page (non-text)                                                    |
| `accentForeground`     | `bestForeground(accent)` — ink `#152921` or white                                                                                                                | Text/icon **on an `accent` fill**                                                               | On any other fill (A-04)                               | 4.5:1 — computed 4.60–10.16                                               |
| `accentText`           | `accentOnSurface(accent, light ? background : card)`                                                                                                             | Accent-coloured **text and icons on `background` / `card`**; links, selected tab label, eyebrow | On `muted` or tinted fills (as low as 3.77 on `muted`) | 4.5:1 — computed 4.51–10.16                                               |
| `accentSoft`           | `accent` @ 18% light / 24% dark                                                                                                                                  | Tinted fill: selected soft chip, icon well, count badge                                         | Text                                                   | decorative                                                                |
| `accentBorder`         | `accent` @ 36% / 45%                                                                                                                                             | Outline of tinted fills                                                                         | Sole boundary of a control                             | decorative                                                                |
| **NEW** `accentOnSoft` | `accentOnSurface(accent, composite(accent @ 20% light / 28% dark, muted), 4.5)` — the strongest tint in use (secondary button) over the least favourable surface | Accent text/icons **on `accentSoft`, the secondary-button tint, or `muted`**                    | —                                                      | 4.5:1 — computed min 4.59 light, 4.51 dark across 12 accents × 9 surfaces |
| **NEW** `focusRing`    | `= accentText`                                                                                                                                                   | Focus ring on web and TV (see [Focus](#interaction-states))                                     | —                                                      | 3:1 — computed min 4.01 light, 3.77 dark vs background/card/muted         |

**FIX — accent used as text (A-02, F-48).** ~100 sites use `color: colors.accent`. On the light page: lime 2.72, amber 2.80, pink 4.05, rose 4.14. Fix: `linkPrimary`, tab labels ([`app-tabs.tsx`](../apps/app/src/components/app-tabs.tsx), `app-tabs.web.tsx`) and every text/icon style → `accentText`; add `accentText` to the `ThemeColor` union so `themeColor="accentText"` works.

**FIX — accent text on accent tint (A-01).** Selected soft `Chip`, secondary `Button` label, `NavRow` count, app-lock options: raw `accent` on `accentSoft` computes 2.07–5.76 light / 2.52–4.00 dark; `accentText` there is still as low as 3.20 light / 2.70 dark. Use `accentOnSoft` (same approach [`pill.tsx`](../apps/app/src/components/ui/pill.tsx) already uses).

**FIX — amber and lime light shades (A-02, E-04, audit A §4.9).** `#D97706` and `#65A30D` are 2.80 / 2.72 on the page and 2.49 / 2.42 on `muted` — below 3:1 even as a fill boundary (switch-on track, progress fill). Proposed values, hue preserved:

| Accent | Light now | Light proposed | vs background / card / muted | Label on fill |
| ------ | --------- | -------------- | ---------------------------- | ------------- |
| amber  | `#D97706` | `#B45309`      | 4.42 / 4.94 / 3.93           | white 5.02    |
| lime   | `#65A30D` | `#4D7C0F`      | 4.40 / 4.91 / 3.91           | white 4.99    |

Dark shades are unchanged (all 12 clear 4.2:1 on card). This changes two user-visible swatches — **owner decision**; if declined, the "fill only" rule above still removes the text/ring failures but the fill-boundary gap remains.

### Status roles

`StatusPalette` hues are unchanged: success `#2E9E6B` · warning `#D9A343` · danger `#D9604C` · info `#4C8FD9`.

| Token                          | Definition                                          | Use                                                                   | Contrast (computed)                                         |
| ------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| `status.X.color`               | Raw hue                                             | Fills, progress, dots **beside a text label**, decorative icons       | Not text: 2.0–3.6 on light surfaces (warning 1.99–2.23)     |
| `status.X.text`                | `accentOnSurface(hue, light ? background : card)`   | Status-coloured text and **meaning-bearing icons** on background/card | 4.62–6.76 (target 4.5)                                      |
| `status.X.soft` / `.border`    | hue @ 14% / 28% light, 22% / 40% dark               | Tinted fill + outline (toast accent, callout, badge)                  | decorative                                                  |
| **NEW** `status.X.onSoft`      | `accentOnSurface(hue, composite(soft, muted), 4.5)` | Text/icons **on `status.X.soft`**                                     | 4.59–4.93 (target 4.5); `.text` there is only 3.0–4.2       |
| **NEW** `status.danger.fill`   | `#B8432F` light · `#E57A68` dark                    | Destructive button fill                                               | Fill vs surface: 4.76–5.32 light, 4.40–5.34 dark (target 3) |
| **NEW** `status.danger.onFill` | `#FFFFFF` light · `#152921` dark                    | Label on `status.danger.fill`                                         | 5.41 light, 5.34 dark (target 4.5)                          |

**FIX — status hue as text (A-03).** `nav-row.tsx:90`, `list-index-badge.tsx:18` and ~48 feature sites → `.text` on neutral surfaces, `.onSoft` on tints.

**FIX — destructive button (A-04).** `ConfirmDialog`, `delete-account-modal`, `update-required-modal` override the primary background with `status.danger.color` and keep `accentForeground` (3.67 white / 4.18 ink — fails either way). Replace with `Button variant="destructive"` = `status.danger.fill` + `status.danger.onFill`; delete the three overrides.

Rule: status is never conveyed by colour alone — pair with a glyph and a word (F-45, F-47). A label on a solid `status.X.color` fill (rare; badges) uses `bestForeground(hue)` — ink clears 4.5 for success/warning/info only; danger must use `status.danger.fill`.

### Other derived tokens

| Token                                  | Value                                  | Use                                                                                                                                              |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hairline`                             | `foreground` @ 12% / 14%               | Row separators inside a card                                                                                                                     |
| `track`                                | `foreground` @ 14% / 20%               | Progress track, skeleton, sheet grabber (decorative only)                                                                                        |
| **NEW** `switchTrackOff`               | `= inputBorder`                        | Off-state switch track — today's `track` is 1.32 (light) / 1.72 (dark) vs card (A-14); `inputBorder` is 3.74 / 3.09                              |
| `inputSurface` / `inputSurfaceFocused` | `input` + `inputBorder` / `accent` 1px | Every text field                                                                                                                                 |
| **NEW** `inputSurfaceError`            | `input` + `status.danger.text` 1px     | Field in error (A-09) — border 4.6+:1; always with an error message                                                                              |
| **NEW** `hover`                        | `foreground` @ 4% light / 6% dark      | Pointer hover wash — already inlined in `pressable-scale.tsx` and `button.tsx` (A §4.7)                                                          |
| `ripple`                               | `foreground` @ 10% / 16%               | Android ripple                                                                                                                                   |
| `scrim`                                | black @ 40%                            | Behind sheets and dialogs                                                                                                                        |
| **NEW** `scrimStrong` / `onScrim`      | black @ 70% / `#FFFFFF`                | Media viewers (image gallery, PDF) and captions over media — replaces raw hex and white-alpha text (A §2b, F-57); white on `scrimStrong` ≥ 8.5:1 |
| `segmentThumb`, `surfaceRaised`        | existing                               | Segmented thumb; raised surface in dark                                                                                                          |

### Static palettes (constant across accent and scheme)

| Palette              | Use                                                                                                        | Rule                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Brand` (hero)       | Prayer-times hero, onboarding hero. `heroText` 9.3:1, `heroSubtext` 5.9:1, `heroAccent` 6.9:1 on `heroTop` | Controls on the hero take `heroAccent` as their focus ring; never theme tokens |
| `Mushaf`             | Qur'an page frame, ayah markers                                                                            | Always gold on cream / night; never the UI accent                              |
| `CategoryHues`       | Browse-section fills and icon wells                                                                        | Text goes through `accentOnSurface` first                                      |
| `CelebrationPalette` | Confetti                                                                                                   | Particles only                                                                 |
| **NEW** `Metal`      | `gold #D4A017`, `silver #A8B0B8` — zakat nisab indicators (A-39: literals in two files)                    | Fills/icons only                                                               |

### Fill vs text vs border vs icon — the short version

| I am colouring…                    | On background / card                               | On `muted` or a tint | On an `accent` fill | On `status.danger.fill` |
| ---------------------------------- | -------------------------------------------------- | -------------------- | ------------------- | ----------------------- |
| Primary text / icon                | `foreground`                                       | `foreground`         | `accentForeground`  | `status.danger.onFill`  |
| Secondary text / icon              | `mutedForeground`                                  | `mutedForeground`    | —                   | —                       |
| Accent text / icon                 | `accentText`                                       | `accentOnSoft`       | —                   | —                       |
| Status text / meaning-bearing icon | `status.X.text`                                    | `status.X.onSoft`    | —                   | —                       |
| A control's boundary (≥ 3:1)       | `inputBorder`, `accent` fill, `status.danger.fill` | same                 | —                   | —                       |
| Decoration                         | `border`, `cardBorder`, `hairline`, `accentBorder` | same                 | —                   | —                       |

Scheme: `colorMode` is `light` / `dark` / `system`. First launch currently defaults to **dark** (`theme-provider.tsx:46`) although `app.json` is `automatic` (A-29) — **owner decision** whether to default to `system`. The 36-swatch custom-accent palette (`constants/color-palette.ts`) is inherited from another product and includes neon and pure black/white (A-30) — curate to ~16–20 on-brand hues; `ensureContrastAgainst` already keeps any custom hex ≥ 3:1 on the page.

## Typography

Families: `Fonts.sans` (system), `Fonts.serif`, `Fonts.rounded`, `Fonts.mono`. All UI text goes through `ThemedText`; raw `<Text>` is allowed only in Qur'an renderers.

### Ramp (phone / tablet / web, pt)

| Role            | `ThemedText type`                           | Size / line       | Weight            | Letter-spacing | Status                                                                         |
| --------------- | ------------------------------------------- | ----------------- | ----------------- | -------------- | ------------------------------------------------------------------------------ |
| Display         | `display`                                   | 56 / 58           | 800               | −1             | keep — hero numerals (tasbeeh count, next-Salah clock)                         |
| H1 (hero)       | `title`                                     | 40 / 48           | 700               | −0.6           | **FIX** style says line 46, table says 48 → 48 (A-06)                          |
| H1 (screen)     | `header` + `heading={1}`                    | 26 / 34           | 700               | −0.4           | keep — one per screen, via `AppHeader`                                         |
| H2 (section)    | `subtitle` + `heading={2}`                  | 20 / 28           | 700               | −0.2           | keep — via `SectionHeader`                                                     |
| H3 (card title) | `default` + `weight="bold"` + `heading={3}` | 16 / 26           | 700               | 0              | uses NEW `weight` prop                                                         |
| H4              | `smallBold` + `heading={4}`                 | 14 / 22           | 700               | 0              | keep                                                                           |
| H5 / H6         | `caption` / `label` + `heading`             | 12 / 18 · 11 / 16 | 600 / 700         | 0 / 0.8        | rarely needed; prefer restructuring over deeper levels                         |
| Body L          | **NEW** `bodyLarge`                         | 18 / 28           | 400               | 0              | long-form reading (Learn, tafsir, hadith). Replaces raw 18 ×9, 17 ×4 (A-06)    |
| Body M          | `default`                                   | 16 / 26           | 500               | 0              | keep                                                                           |
| Body S          | `small`                                     | 14 / 22           | 500               | 0              | keep                                                                           |
| Label           | `smallBold`                                 | 14 / 22           | 700               | 0              | keep — row titles, field labels                                                |
| Button          | **NEW** `button`                            | 15 / 20           | 600               | 0              | `Button` md/lg, tab rail, segmented. Replaces raw 15 ×22 (A-06, A-13)          |
| Supporting      | **NEW** `footnote`                          | 13 / 18           | 500               | 0              | helper/hint/error text, `Button sm` label (at 600). Replaces raw 13 ×10 (A-06) |
| Caption         | `caption`                                   | 12 / 18           | 600               | 0              | keep — metadata, timestamps                                                    |
| Eyebrow         | `label`                                     | 11 / 16           | 700               | 0.8, uppercase | keep — **floor for UI text**; nothing below 11pt (A-24)                        |
| Link            | `linkPrimary`                               | 14 / 22           | 600               | 0              | **FIX** colour `accent` → `accentText`; line 30 → 22 (A-02, A-06)              |
| Code            | `code`                                      | 12 / 18           | 500 (700 Android) | 0              | **FIX** add line height                                                        |
| Scripture       | `arabic`                                    | 28 default        | 500               | never          | see below                                                                      |
| —               | `link`                                      | —                 | —                 | —              | **REMOVE** — 0 uses (A-06)                                                     |

Raw sizes with no variant map to the nearest step: 22/24 → `subtitle` or `header`; 28/30/32 → `header` or `title`; 9/10 → `label` (11).

**NEW `weight` prop** on `ThemedText`: `"regular" (400) | "medium" (500) | "semibold" (600) | "bold" (700)` — replaces 34 inline and 100 stylesheet `fontWeight` literals (A §2a). Variants keep their default weight.

**NEW `TvType` rows** (dp, pre-density — `ThemedText` applies `TV_DENSITY`; do not wrap in `tvDp`): `bodyLarge` 20/30 · `button` 18/24 · `footnote` 14/20. Primitives stop hand-applying `TvLayout.bodyFontSize` once they use a typed variant.

### Dynamic Type / font scale

| Rule                                                                                         | Value                                                                                 | Evidence        |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------- |
| Content text scales without a cap                                                            | `default`, `bodyLarge`, `small`, `smallBold`, `footnote`, `caption`, `arabic`, `code` | WCAG 1.4.4      |
| Oversized headings are capped (`maxFontSizeMultiplier` set inside `ThemedText`, per variant) | `display`, `title` **1.3** · `header`, `subtitle` **1.5**                             | A-07, E-47      |
| Chrome labels in fixed-height controls are capped                                            | `button`, `label` **1.3**; count/notification badges **1.2**                          | A-07, E-47      |
| Line height always scales with `fontScale` (already done)                                    | —                                                                                     | —               |
| Inline `style.fontSize` without `lineHeight` gets a derived line height                      | `round(fontSize × 1.4)` instead of the variant's                                      | A-07 (94 sites) |
| Containers around text use `minHeight`, never `height`                                       | badges, chips, rows, buttons                                                          | A-07            |
| Control labels wrap to 2 lines when `fontScale ≥ 1.3`                                        | `Chip`, `Pill`, `LabeledIconButton`, `QuickAction`                                    | F-58            |
| `allowFontScaling={false}`                                                                   | forbidden except decorative glyphs (flag emoji)                                       | —               |

### Arabic and scripture

| Rule           | Detail                                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Variant        | `type="arabic"` only — family from the user's preference (`resolveArabicFontFamily`), line height from `resolveArabicLineHeight`, text sanitised   |
| Size           | Default 28; reader controls change it within `ARABIC_SIZE_BOUNDS` (14–48); pass size via `style.fontSize`. Scales with OS font scale, no cap       |
| Direction      | Always RTL and physical-right, in every locale                                                                                                     |
| Forbidden      | `numberOfLines` / truncation, `letterSpacing`, `textTransform`, synthetic bold/italic, opacity < 1, `adjustsFontSizeToFit`, text over busy imagery |
| Colour         | `foreground` (or `mushaf.ink` for ornaments); never `mutedForeground` for the Arabic itself                                                        |
| Pairing        | Arabic → transliteration (`small`, `mutedForeground`) → translation (`default` / `bodyLarge`) → source (`caption`); gap `Spacing.two`              |
| Small surfaces | If the whole text cannot be shown legibly, do not show it (no scripture on watch/tile/small widget — see platform doc)                             |

## Spacing

### Scale (`Spacing`, all `tvDp`-scaled)

| Key           | dp  | Status                                                                               |
| ------------- | --- | ------------------------------------------------------------------------------------ |
| `half`        | 2   | keep — also replaces literal `gap: 2` (117×, not TV-scaled today)                    |
| `one`         | 4   | keep                                                                                 |
| **`oneHalf`** | 6   | **NEW** — replaces `Spacing.one + 2` (108×) and `Spacing.half + 2` rounded up (A-10) |
| `two`         | 8   | keep                                                                                 |
| **`twoHalf`** | 10  | **NEW** — replaces `Spacing.two + 2` (90×) (A-10)                                    |
| `three`       | 16  | keep                                                                                 |
| `four`        | 24  | keep                                                                                 |
| `five`        | 32  | keep                                                                                 |
| `six`         | 64  | keep                                                                                 |

No 12, 20 or 48 step: the audit counted only 4 uses of `two + 4`; resolve 12 → `twoHalf` or `three`, 20 → `three` or `four`, 48 → `five`. `Spacing.x ± n` arithmetic is banned — the literal part bypasses `tvDp` and renders half-size on Apple TV.

### Semantic spacing

| Context                      | Token                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Screen horizontal padding    | `Spacing.four` (24) phone/tablet/web · `TvLayout.contentPaddingX` TV — owned by `ScreenLayout`                               |
| Section gap (between blocks) | `Spacing.four`                                                                                                               |
| Header → first block         | `Spacing.three`                                                                                                              |
| Card padding                 | `Spacing.three` — **FIX** make it the `Card` default (542 of 619 cards override `four` → `three`, A-23)                      |
| Card internal gap            | `Spacing.two` (tight) / `Spacing.three` (grouped content)                                                                    |
| List row                     | min-height `Control.row`; padding `Spacing.three` horizontal, `Spacing.twoHalf` vertical; icon → text `Spacing.three`        |
| Rows inside a card           | no gap; `Divider` between                                                                                                    |
| Form                         | label → field `Spacing.one`; field → helper/error `Spacing.one`; field → field `Spacing.three`; group → group `Spacing.four` |
| Button row                   | `Spacing.two` between buttons; `Spacing.three` above                                                                         |
| Chip row                     | `Spacing.two`                                                                                                                |
| Dialog / sheet padding       | `Spacing.four`; internal gap `Spacing.two`                                                                                   |
| Inline icon → label          | `Spacing.oneHalf` (chip, pill) / `Spacing.two` (button)                                                                      |
| Empty state                  | vertical `Spacing.five`, horizontal `Spacing.four`, gap `Spacing.three`                                                      |

## Geometry

### Radius (`Radius`, `tvDp`-scaled, `borderCurve: "continuous"`)

| Key      | dp  | Use                                                                                                                                                  |
| -------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`xs`** | 6   | **NEW** — progress tracks, small badges, checkbox, skeleton lines, sheet grabber, `CollapsibleSection` well (literals 2–9 appear ~80×; A §4.2, A-36) |
| `sm`     | 10  | Segmented thumb, small icon wells, ripple clip                                                                                                       |
| `md`     | 14  | Button, IconButton well, NavRow, toast, text field                                                                                                   |
| `lg`     | 20  | Card, center dialog, SearchField, TV rows                                                                                                            |
| `xl`     | 28  | Bottom-sheet top corners, empty-state well, hero                                                                                                     |
| `pill`   | 999 | Chip, Pill, switch track, count badge                                                                                                                |

`packages/theme/src/tokens.ts` holds a second, unused `sm 4 / md 8 / lg 12` scale — **delete** (A-31). Seasonal art and illustration geometry are exempt from the radius scale.

### Border widths — **NEW** `BorderWidth` (A §4.6: 1 ×119, 1.5 ×41, 2 ×29 literals)

| Key        | Value                           | Use                                                               |
| ---------- | ------------------------------- | ----------------------------------------------------------------- |
| `hairline` | `StyleSheet.hairlineWidth`      | Dividers, secondary-button outline                                |
| `thin`     | `tvDp(1)`                       | Card, field, ghost button, chip                                   |
| `thick`    | `tvDp(2)`                       | Selected/emphasis outline; literal 1.5 resolves here or to `thin` |
| —          | `TvLayout.focusRingWidth` (3dp) | TV focus ring only                                                |

### Control heights — **NEW** `Control` (A-13, E-07, E-26; values already implied by the primitives)

| Key        | dp (`tvDp`-scaled)                   | Use                                                                                                     |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `sm`       | 36                                   | `Button sm`, dense toolbars only — never a screen's primary action                                      |
| `md`       | 44                                   | `Button md` (**FIX** from 40), `IconButton`, `SwitchRow`, `SegmentedControl`, `Stepper md`              |
| `lg`       | 52                                   | **NEW** `Button lg` — full-width primary CTA (onboarding, sheet footers)                                |
| `row`      | 52                                   | `NavRow`, settings rows                                                                                 |
| `field`    | 50                                   | `TextField`, `SearchField`                                                                              |
| `minTouch` | 44 iOS / web · 48 Android (unscaled) | Minimum hit area; reach it with `hitSlop` on native, with real size on web (`hitSlop` is ignored there) |

On TV every focusable uses `TvLayout.minFocusTarget` (64dp) or `TvLayout.chipMinHeight` (48dp) — both already `tvDp`-scaled. **FIX**: `button.tsx:73` (`48`) and `switch-row.tsx:107` (`44`) are bare numbers → half-height on tvOS (E-26).

### Icon sizes — **NEW** `IconSize` (A §4.5: 20 distinct sizes on `SymbolView`; A-28, E-25)

| Key    | dp  | Use                                    |
| ------ | --- | -------------------------------------- |
| `xs`   | 12  | Inline with caption, chevrons in pills |
| `sm`   | 14  | `Button sm`, chips                     |
| `md`   | 16  | `Button md`, row chevrons              |
| `lg`   | 20  | Row leading icons, tab bar             |
| `xl`   | 24  | Icon buttons, headers                  |
| `hero` | 28  | Empty state, feature wells             |

**`IconSize` values are raw dp — not `tvDp`.** The `expo-symbols` TV shim already multiplies every `SymbolView` `size` by `TV_DENSITY`; wrapping again double-scales (this is the E-25 rail bug in reverse: unscaled 44pt wells around a shim-doubled 56pt glyph). Wells, images and SVGs that are _not_ `SymbolView` use `tvDp(IconSize.x)`. On TV use one step up (`md` → `lg`).

### Touch and focus targets

| Platform     | Minimum                                                               | How                      |
| ------------ | --------------------------------------------------------------------- | ------------------------ |
| iOS / iPadOS | 44 × 44 pt                                                            | visual size or `hitSlop` |
| Android      | 48 × 48 dp                                                            | visual ≥ 44 + `hitSlop`  |
| Web          | 44 × 44 CSS px primary, 48 bottom nav; 24 absolute floor (WCAG 2.5.8) | real size only           |
| TV           | 64dp rows/buttons, 48dp chips                                         | `TvLayout`               |

**FIX**: pagination dots 8pt (F-50), toast dismiss ~12pt (F-43, A-15), ~40 controls at 32–42pt with no `hitSlop` (F-49), `IconButton hitTarget` < 44 at 10 sites (A §2d), `Stepper sm` 30pt (A-37), web bottom tabs ~36px (E-02).

### Widths and breakpoints

**NEW `Breakpoints`** — names for the literals already in `screen-layout.tsx` / `use-large-screen-layout.ts`; no value changes (A-26: 68 literal comparisons):

| Key          | px   | Effect                               |
| ------------ | ---- | ------------------------------------ |
| `tablet`     | 768  | Side rail replaces bottom tabs       |
| `listDetail` | 900  | Two-pane list–detail where supported |
| `wide`       | 1024 | Content cap 1120; multi-column grids |
| `xwide`      | 1600 | Content cap 1320                     |

1200 / 1280 / 1440 literals fold into `wide` or `xwide`.

| Surface        | Width                                                    |
| -------------- | -------------------------------------------------------- |
| Content column | `MaxContentWidth` 800 · 1120 at `wide` · 1320 at `xwide` |
| Prose column   | 880 (`TvLayout.proseMaxWidth` on TV) — 65–85 characters  |
| Center dialog  | max `tvDp(520)`, margin `Spacing.four`                   |
| Bottom sheet   | full width; max 640 at ≥ 640 (centred)                   |
| Toast          | full width, `Spacing.three` side padding (top of screen) |

### Elevation (`Shadows` unchanged; usage rule only — A §4.10)

| Level  | Use                                                             |
| ------ | --------------------------------------------------------------- |
| `none` | `Card variant="muted" / "plain" / "outline"`; rows inside cards |
| `sm`   | Resting card (light)                                            |
| `md`   | Resting card (dark), floating chrome: tab bar, mini-player      |
| `lg`   | Overlays: sheet, dialog, popover, toast                         |

Use `createShadow()` or `Shadows.*`; no raw `shadow*` / `elevation`. A card inside a card is `muted` or `plain`, never elevated.

**NEW `ZIndex`** (A-19, A §4.8: 14 distinct values incl. 9000, 9999, 10002): `base 0 · raised 1 · sticky 10 · header 20 · overlay 1000 · modal 2000 · toast 3000`.

**NEW `Opacity`** (A-11: disabled is 0.5 / 0.4 / 0.3 across primitives): `disabled 0.5 · pressed 0.88` — both are today's majority values. Opacity is never used to de-emphasise text (use `mutedForeground`; F-57).

## Interaction states

`PressableScale` is the only touchable. **FIX**: it owns disabled opacity + `accessibilityState.disabled` (A-11), defaults `accessibilityRole="button"` when `onPress` is set (F-44), and stops blurring focus on every web press (E-01, F-41).

| State    | Shared treatment                                                                                                                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Default  | Tokens above                                                                                                                                                                                                                                          |
| Pressed  | Scale to 0.96 (0.97 buttons) with `Springs.press`; optional dim to `Opacity.pressed`; Android ripple (`tokens.ripple`); haptic per component                                                                                                          |
| Hovered  | Pointer devices: `tokens.hover` wash on transparent surfaces, brightness 0.97 (light) / 1.1 (dark) on painted ones; `cursor: pointer`. **FIX**: honour on native pointer devices too, and on web tab bar (E-12, E-15)                                 |
| Focused  | Web keyboard: 2px `focusRing` outline, 2px offset, 2px `background` halo between. TV: `TvLayout.focusRingWidth` border in `focusRing`, grown outward, + scale 1.04. Never remove without replacement. **FIX**: TV ring uses raw `accent` today (E-04) |
| Selected | Fill change **and** a non-colour cue (check glyph, weight, thumb position) + `accessibilityState.selected/checked`                                                                                                                                    |
| Disabled | `Opacity.disabled`; no press, hover, ripple or haptic; `accessibilityState.disabled`; still focusable for screen readers                                                                                                                              |
| Loading  | Control keeps its size; spinner replaces the leading icon; press blocked; `accessibilityState.busy`; label unchanged                                                                                                                                  |
| Error    | `inputSurfaceError` border + message in `status.danger.text` with an icon, announced (alert role / live region)                                                                                                                                       |
| Success  | Haptic `success` + inline state change; toast only when the result is not visible on screen                                                                                                                                                           |

### Per primitive

| Primitive                   | Pressed                          | Focused (web / TV)                               | Selected                                                                                                           | Disabled                         | Loading                  | Error / success                |
| --------------------------- | -------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ------------------------ | ------------------------------ |
| `Button`                    | scale 0.97 + dim, haptic `light` | ring / ring + scale                              | —                                                                                                                  | 0.5                              | **NEW** `loading` (A-12) | **NEW** `destructive` variant  |
| `IconButton`                | scale, borderless ripple         | ring / ring + scale                              | `selected` tint via `accentSoft` + `accentOnSoft`                                                                  | **FIX** 0.4 → 0.5                | existing `loading`       | —                              |
| `Chip` / `ToggleChip`       | scale, ripple                    | ring / soft fill + ring                          | soft: `accentSoft` + `accentOnSoft` label (**FIX** A-01); solid: `accent` + `accentForeground`; role per behaviour | 0.5                              | —                        | —                              |
| `SegmentedControl`          | ripple on segment                | ring on segment                                  | thumb slides (`Springs.gentle`); **FIX** `radiogroup`/`radio` roles + group label (F-51)                           | **NEW** per-option disabled      | —                        | —                              |
| `SwitchRow`                 | whole row pressable              | ring on row                                      | track `accent`, thumb moves; off track **FIX** `switchTrackOff` (A-14)                                             | 0.5                              | —                        | —                              |
| `NavRow`                    | scale, ripple                    | ring / ring (scale 1.0–1.02 for full-width rows) | `completed`: check glyph + `status.success.onSoft` (**FIX** A-03)                                                  | 0.5                              | —                        | —                              |
| `Card` (pressable)          | scale, ripple                    | ring / ring + scale                              | `accentBorder` outline + check                                                                                     | 0.5                              | `Skeleton` content       | —                              |
| `TextField` / `SearchField` | —                                | `inputSurfaceFocused` (accent border) + web ring | —                                                                                                                  | 0.5, not editable                | trailing spinner         | `inputSurfaceError` + message  |
| `Stepper`                   | scale, haptic `selection`        | ring                                             | —                                                                                                                  | **FIX** 0.3 → 0.5 + state (A-37) | —                        | **FIX** value announced (F-46) |
| `Sheet` / dialog            | —                                | focus moves in, trapped, restored on close       | —                                                                                                                  | —                                | confirm button `loading` | inline `Callout`               |
| Toast                       | swipe to dismiss                 | action + dismiss focusable                       | —                                                                                                                  | —                                | —                        | tone = status token            |
| Tab bar / rail              | system / dim                     | ring                                             | `accentText` label + filled icon (**FIX** A-02)                                                                    | —                                | —                        | —                              |

## Motion

| Token                              | Value                                 | Use                                                           |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `Springs.press`                    | mass 0.5 · damping 16 · stiffness 280 | Press in/out, focus scale                                     |
| `Springs.gentle`                   | mass 1 · damping 24 · stiffness 170   | Entrances, progress fills, layout shifts, segmented thumb     |
| `Springs.pop`                      | mass 0.7 · damping 13 · stiffness 230 | Check-offs, selection confirmation                            |
| **NEW** `Springs.sheet`            | damping 20 · stiffness 300            | Sheet drag settle — already inlined at `sheet.tsx:175` (A-27) |
| `Durations.fast`                   | 180ms                                 | Fades, chevrons, toast exit, small state changes              |
| `Durations.base`                   | 260ms                                 | Sheet/dialog fade, toast enter, empty-state entrance          |
| `Durations.slow`                   | 420ms                                 | Large reveals                                                 |
| `Durations.ambient` / `.wallpaper` | 9877 / 44443ms                        | Breathing glow, live wallpaper                                |
| `Stagger.step` / `.base`           | 60 / 40ms                             | List entrances                                                |

Rules: no new durations — raw 140/160/180/220/240/280/320 round to `fast` or `base` (A-27: 47 raw literals); default timing easing only, no custom curves; nothing bounces except `Springs.pop` on a completion; bottom sheets **slide** in with `Springs.sheet` (they fade today — A-20).

**Reduced motion** (`useHydrationSafeReducedMotion`, the only hook to use — A-38):

| Motion                                                              | When reduced                                       |
| ------------------------------------------------------------------- | -------------------------------------------------- |
| Press / focus scale                                                 | No scale; keep dim, ripple and ring                |
| Slide / translate entrances, stagger                                | Opacity fade at `Durations.fast`, or instant       |
| Infinite loops (skeleton, shimmer, glow, wallpaper, buffering band) | Static state (**FIX** `buffering-band.tsx`, F-52)  |
| Confetti, celebratory pops                                          | Skipped; keep the haptic and the text confirmation |
| Progress fills                                                      | Jump to value                                      |

## Components

One canonical component per need. "Merge" lists the duplicates to delete after migration.

| Need                                                 | Canonical                                                                                                                                            | Changes                                                                                                                             | Merge into it (audit)                                                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Touchable                                            | [`ui/pressable-scale.tsx`](../apps/app/src/components/ui/pressable-scale.tsx)                                                                        | Own disabled; default role; no blur-on-press                                                                                        | Raw `Pressable` in tab bars, rail, update modal (A §2d)                                                                       |
| Button                                               | [`ui/button.tsx`](../apps/app/src/components/ui/button.tsx)                                                                                          | + `variant="destructive"`, + `loading`, + `size="lg"`; md → `Control.md`; labels `button` / `footnote`                              | Error-boundary button, accent `PressableScale` CTAs in sadaqah + app-lock (A-33, D §3)                                        |
| Icon button                                          | [`ui/icon-button.tsx`](../apps/app/src/components/ui/icon-button.tsx), `labeled-icon-button.tsx`                                                     | + `badge` slot; label → `caption`                                                                                                   | Header bell, `HeroIconButton`, `ControlButton`, `RailButton`, 6 prev/next `NavButton`s (A §2g, A-25)                          |
| Card                                                 | [`ui/card.tsx`](../apps/app/src/components/ui/card.tsx)                                                                                              | Default padding `three`                                                                                                             | —                                                                                                                             |
| Navigation row                                       | [`ui/nav-row.tsx`](../apps/app/src/components/ui/nav-row.tsx)                                                                                        | + `subtitle`, + `trailing`, + `tone="danger"`                                                                                       | `SahabaNavRow`, `JannahNavRow`, `JannahActionRow`, `LearnQuizNavRow`, `LinkRow`, `ExploreRow`, `ActionRow` (A §2g)            |
| Settings row                                         | `settings/settings-rows.tsx` `SettingsRow`                                                                                                           | Built on `NavRow` / `SwitchRow`; settings screens only                                                                              | Bespoke rows in app-lock (D-13)                                                                                               |
| Switch row                                           | [`ui/switch-row.tsx`](../apps/app/src/components/ui/switch-row.tsx)                                                                                  | Whole row pressable everywhere                                                                                                      | `SettingSwitchRow`, muhasabah `SwitchRow`, focus-lock `ToggleRow`, `WasiyyahSwitchRow`, `PrefToggle` ×2, 24 inline (A-21)     |
| Stepper                                              | `ui/stepper.tsx` + `settings/stepper-row.tsx` (move to `ui/`)                                                                                        | `adjustable` role + value; default `md`                                                                                             | Focus-lock `StepperRow`                                                                                                       |
| Text field                                           | **NEW** `ui/text-field.tsx` — label, helper, error, leading/trailing slot, multiline                                                                 | Justified by 66 `TextInput`s, 8 local wrappers, 11 unlabeled, no error state (A-09, F-54, D §3)                                     | `LabeledInput`, `AmountInput`, `DayInput`, self-review `TextField`, `NumberField` ×2, `MoneyField`, `CountField`, `DateField` |
| Field presets (same file family, not new primitives) | `SearchField` (exists) · **NEW** `NumberField` (affix slot, `decimal-pad`, TV stepper) · **NEW** `SelectField` (opens a `Sheet`)                     | —                                                                                                                                   | 16 search bars (C-07); currency/date pickers typed as text (D §3)                                                             |
| Chip / filter                                        | [`ui/chip.tsx`](../apps/app/src/components/ui/chip.tsx)                                                                                              | `accentOnSoft` label                                                                                                                | `TimeChip`, `LogAmountChip`, `TermChip`, `SelectChip`, `UnitToggle`                                                           |
| Static tag                                           | [`ui/pill.tsx`](../apps/app/src/components/ui/pill.tsx)                                                                                              | + `tone` (`accent`/`success`/`warning`/`danger`/`info`/`neutral`)                                                                   | `NewBadge`, `FeatureChip`, `CertaintyPill`, `GradePill`, `MadhhabBadge`, `ThisDeviceBadge`                                    |
| Count badge                                          | `ui/notification-badge.tsx`                                                                                                                          | `minHeight`; hidden from a11y, count goes in the parent label                                                                       | —                                                                                                                             |
| Segmented                                            | [`ui/segmented-control.tsx`](../apps/app/src/components/ui/segmented-control.tsx)                                                                    | Roles; per-option disabled                                                                                                          | —                                                                                                                             |
| Section header                                       | `ui/section-header.tsx`                                                                                                                              | Remove `textTransform: "capitalize"` (A-16)                                                                                         | Second `SectionHeader` in `quran-ayah-range-cards.tsx`; hand-rolled uppercase captions (B §3)                                 |
| Divider                                              | **NEW** `ui/divider.tsx` (hairline, optional inset)                                                                                                  | Justified by 6 `ListSeparator`s + `CardDivider` (A §2g)                                                                             | Those seven                                                                                                                   |
| Callout                                              | **NEW** `ui/callout.tsx` — promote `LearnCallout` from `jannah/primitives.tsx`; `tone` + icon + optional action; `danger` = alert role               | Justified by 6 callout variants (B §3), unannounced error text in 52 files (F-47), form-level blockers (D §3)                       | Local callouts, inline danger captions, permission banners                                                                    |
| Dialog                                               | [`ui/sheet.tsx`](../apps/app/src/components/ui/sheet.tsx) `variant="center"` · [`confirm-dialog.tsx`](../apps/app/src/components/confirm-dialog.tsx) | `Sheet`: + `title`, close button, accessible name (A-20, F-62). `ConfirmDialog`: destructive button, + `busy`, + `acknowledgeLabel` | 4 `Alert.alert` (A-08); delete-account typed-word step (F-30)                                                                 |
| Bottom sheet                                         | `ui/sheet.tsx` `variant="bottom"`                                                                                                                    | Slide-in; no grabber on TV (E-29)                                                                                                   | 6 `*Modal` wrappers are renamed `*Dialog` when touched                                                                        |
| Fullscreen overlay                                   | `ui/sheet.tsx` **NEW** `variant="fullscreen"`                                                                                                        | Justified by 4 raw `<Modal>` + 1 absolute overlay without modal a11y (A-19, F-56)                                                   | PIN set/verify, image gallery, night surface, volume popover                                                                  |
| Toast                                                | [`providers/toast-provider.tsx`](../apps/app/src/providers/toast-provider.tsx)                                                                       | Live region + announce; `IconButton` dismiss; durations below                                                                       | —                                                                                                                             |
| Empty state                                          | [`ui/empty-state.tsx`](../apps/app/src/components/ui/empty-state.tsx)                                                                                | —                                                                                                                                   | "Unavailable on this device" variants (D-40)                                                                                  |
| Loading / error / offline                            | **NEW** `ui/content-state.tsx` — switches `loading` (`Skeleton`) / `empty` (`EmptyState`) / `error` + `offline` (`RetryCard`)                        | Justified by 47 bare `ActivityIndicator`s, 4 local loaders, `return null` routes, 1 `RetryCard` importer (A-22, B §3, C-02/03)      | `CircleLoading`, `LearnContentLoading`, search loader, mushaf-font loader                                                     |
| Progress                                             | `ui/progress-bar.tsx`, `ui/progress-ring.tsx`                                                                                                        | Require `accessibilityLabel` (F-53)                                                                                                 | `arc-progress-ring.tsx` if the API allows                                                                                     |

Delete: `ui/stat-pair.tsx` (0 importers), `themed-view.tsx`, `packages/theme/src/tokens.ts`, `link` text type. Replace the hand-copied palette in `navigation/route-suspense-fallback.tsx` with `resolveTheme` (A-17). `ContextMenu` needs a `Sheet` fallback off iOS (A-18).

Naming: `*Sheet` = bottom, `*Dialog` = centered, never `*Modal`.

## Patterns

### Screen template

| Zone           | Rule                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Scaffold       | `ScreenLayout` always — it owns safe areas, padding, width tiers, TV overscan, floating header                       |
| Header         | `AppHeader`: optional eyebrow (`label`, `accentText`), one H1, optional one-line subtitle, ≤ 2 trailing icon actions |
| Body           | Blocks separated by `Spacing.four`; each block = `SectionHeader` (H2) + cards or rows                                |
| Primary action | One per screen; `Button lg` full-width at the end of the flow or pinned above the tab bar/inset                      |
| States         | Chrome renders immediately; body goes through `ContentState` — never `return null`, never a flash of zeros (B §3)    |

### Hub → list → detail

| Level  | Composition                                                                                               | Back target                         |
| ------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Hub    | Search (if > 20 items) → continue/resume → saved → sections of `BrowseTile` / `NavRow`                    | Tab root                            |
| List   | `SearchField` + filter `Chip`s → virtualised rows; `Divider`s inside one card or cards with `Spacing.two` | Hub                                 |
| Detail | Title → content → action bar in fixed order **Play · Save · Share · More** (C-10–12)                      | List (parent route, not `/` — B §3) |

At `Breakpoints.listDetail`+ list and detail sit side by side where supported. On TV, read-only prose is wrapped in `TvReadableBlock`.

### Forms and validation

| Rule               | Detail                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Fields             | `TextField` family only; visible label above (never placeholder-only); helper text in `footnote`        |
| Choice             | 2–4 options: `SegmentedControl`; 5+: `SelectField` → `Sheet`; boolean: `SwitchRow`                      |
| Dates / times      | Picker sheets (`WallClockPicker`, calendar) — never typed `YYYY-MM-DD` (D §3)                           |
| When to validate   | On blur and on submit; never while typing the first time                                                |
| Field error        | `inputSurfaceError` + icon + message below saying what to enter; announced                              |
| Form-level blocker | `Callout tone="warning"` or `"danger"` above the submit button                                          |
| Submit             | `Button` stays enabled; shows `loading` while saving; on failure focus moves to the first invalid field |
| Saved              | Navigate back or toast "Note saved"; never both                                                         |

### Dialogs, sheets, destructive confirmation

| Situation                                          | Use                                                                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Yes/no decision, short message                     | `ConfirmDialog`                                                                                                                                  |
| Short choice or action list (≤ ~6 rows, no inputs) | Bottom `Sheet`, frosted                                                                                                                          |
| Form, long or scrolling content, any `TextInput`   | Bottom `Sheet`, `solid`                                                                                                                          |
| PIN, media viewer, night surface                   | `Sheet variant="fullscreen"`                                                                                                                     |
| Single-choice sheet                                | Closes on select; stays open with **Done** only when it also has secondary toggles (B §3)                                                        |
| Removing one item, cheaply reversible              | No dialog — act + toast with **Undo**                                                                                                            |
| Bulk / irreversible (reset counter, delete note)   | `ConfirmDialog destructive` — title `{Verb} {object}?`, body says what is lost and where, Cancel has default focus, confirm repeats the verb     |
| Account / whole-device data                        | `ConfirmDialog destructive` + `acknowledgeLabel` checkbox + `busy`; stays open until done; inline `Callout` on failure. No typed "DELETE" (F-30) |

Every sheet has a title, a close affordance that is not only the grabber, Escape/back/scrim dismissal, and returns focus to its trigger. `Alert.alert` is not used (no-op on web — A-08).

### Toasts

| Rule     | Value                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| Content  | Past-tense, ≤ 6 words, no period; optional one action (**Undo** / **View**)                                  |
| Duration | 3.5s; 7s with an action; error tone and any toast while a screen reader is on: until dismissed (F-42)        |
| Announce | Polite live region + `announceForAccessibility`; assertive for errors (F-40)                                 |
| When     | Result not otherwise visible; anything that changes a Qaza counter or deletes. Not for simple toggles (B §3) |
| Not for  | Errors that need a decision → dialog or `Callout`                                                            |
| TV       | No action toasts (existing rule) — offer the action in the row                                               |

### Empty, loading, error, offline

| State                      | Component                                                              | Content                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Loading                    | `Skeleton` rows shaped like the content; spinner only inside a control | `{Verb}ing {object}…` if it lasts > 1s                                                                     |
| Empty                      | `EmptyState`                                                           | Title "No saved duas yet" · one sentence · one action                                                      |
| Error                      | `RetryCard`                                                            | "Couldn't load {object}. {cause} Try again." + **Try again**. A failed load is never an empty state (F-10) |
| Offline                    | `RetryCard` + cached hint                                              | Show cached content if any, with "Showing saved copy"                                                      |
| Not found                  | `EmptyState` with a primary action back to the parent                  | —                                                                                                          |
| Unavailable on this device | `EmptyState` with a focusable action                                   | One sentence on where it is available                                                                      |

## Accessibility

| Area            | Standard (WCAG 2.2 AA unless noted)                                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contrast        | Text ≥ 4.5:1; large text (≥ 24pt, or ≥ 18.66pt bold), control boundaries, meaningful icons and focus rings ≥ 3:1 — for all 12 accents × 2 schemes. New colour pairs get a row in the theme contrast tests |
| Names and roles | Every pressable has a role; icon-only controls a label; labels are names only (no "button", no "tap"); state in `accessibilityState` / `accessibilityValue`                                               |
| Headings        | One H1 per screen (`AppHeader`); `SectionHeader` = H2; dialog titles are headings and name the dialog                                                                                                     |
| Targets         | See [Touch and focus targets](#touch-and-focus-targets)                                                                                                                                                   |
| Focus           | Visible, logical order, never lost on in-place actions, trapped in modals, restored on close                                                                                                              |
| Text scaling    | Usable at 200%; see [Dynamic Type](#dynamic-type--font-scale)                                                                                                                                             |
| Colour          | Never the only signal — add glyph, text or shape                                                                                                                                                          |
| Status messages | Toasts, inline errors, counter changes and async results are announced                                                                                                                                    |
| Motion          | Reduced-motion table above; no flashing; no auto-advancing content without a pause                                                                                                                        |
| Timing          | No time limit on actions; toasts with actions persist for assistive tech                                                                                                                                  |
| Images          | Informative images labelled; decorative ones hidden                                                                                                                                                       |
| RTL             | Logical props only (`paddingStart`, `marginEnd`); direction-aware chevrons via `lib/rtl.ts`; illustrations do not mirror                                                                                  |
| Web             | `main` landmark + skip link (F-59); real links for navigation (E-05)                                                                                                                                      |

## Content and microcopy

Full guide and findings: audit F. Catalogs are the source of truth ([`I18N_GUIDE.md`](./I18N_GUIDE.md)); every string exists in all 24 locales.

| Topic             | Rule                                                                                                                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Voice             | Calm, respectful, encouraging. Second person, active, present tense. "We" only when taking responsibility                                                                                                                                                     |
| Plain words       | Never: cache, sync conflict, server, API, build, JSON, CDN, token, provider, configured, model, engine                                                                                                                                                        |
| Case              | Sentence case everywhere. Capitals: first word, proper nouns, Salah names, and **Salah, Zikr, Adhan, Qaza, Qur'an, Sunnah, Ramadan, Jumu'ah, Hijri**. Lowercase mid-sentence: adhkar, tasbeeh, dua, durood, masjid, wudu. Exception: named achievement titles |
| Casing in code    | No `textTransform: "capitalize"`; `uppercase` only on the `label` type                                                                                                                                                                                        |
| Punctuation       | `…` only for in-progress and placeholders; no period on buttons/titles/labels/short toasts; contractions; "and" in sentences, "&" only in short titles; no emoji or glyph characters in strings (use icons)                                                   |
| Buttons           | Verb + object, 1–3 words. Never OK / Yes / No / Submit / Confirm. Confirm button repeats the dialog title's verb. "Continue" only for neutral step-advance                                                                                                    |
| Errors            | `Couldn't {do the thing}. {Cause, if known.} {What to do next.}` — never codes or `error.message`; no "please"; reassure about data when relevant                                                                                                             |
| Confirm           | Title `{Verb} {object}?` · body: what is lost, from where, "This can't be undone." only if true · `Cancel` + `{Verb} {object}`                                                                                                                                |
| Empty             | Title: what is not here yet · one sentence · one action                                                                                                                                                                                                       |
| Toast             | Past tense, ≤ 6 words: "Note saved", "Added to Qaza"                                                                                                                                                                                                          |
| Loading           | `{Verb}ing {object}…`                                                                                                                                                                                                                                         |
| Input verbs       | "Select" in shared strings; "Tap" only for touch-only gestures; "Press" for physical keys                                                                                                                                                                     |
| Missed worship    | Gentle and practical: "make up", "catching up", "whenever you're ready". Never "debt", "overdue", "behind", "you missed"                                                                                                                                      |
| Religious phrases | Welcome in celebration; never in errors, confirmations or settings. No rulings in UI chrome                                                                                                                                                                   |
| A11y copy         | Label = name ("Bookmark ayah 12"); hint = result, starts with a verb ("Opens the dua")                                                                                                                                                                        |

### Glossary (use → never)

| Use                                                                                                                                                                       | Never                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Salah                                                                                                                                                                     | prayer (as a label), Namaz, Salat             |
| Zikr / adhkar                                                                                                                                                             | Dhikr                                         |
| Adhan                                                                                                                                                                     | Azan                                          |
| Qaza; verb **make up**                                                                                                                                                    | Qada, debt, missed-prayer debt                |
| Fasting; fasts to make up                                                                                                                                                 | Roza, fasting debt                            |
| Tasbeeh · Dua · Masjid · Qur'an · Jumu'ah                                                                                                                                 | Tasbih · Du'a · Mosque · Quran                |
| Sign in / Sign out                                                                                                                                                        | Log in / Log out                              |
| **Save / Saved** (items) · **Bookmark** (a place in a text)                                                                                                               | Favorite / Favourite                          |
| **Delete** (destroy what the user made) · **Remove** (take out of a list) · **Clear** (empty a list/field) · **Reset** (back to defaults) · **Erase** (whole-device data) | wipe                                          |
| Save (persist) · Done (close, already saved) · Apply (filters)                                                                                                            | Set, Confirm, Submit                          |
| Cancel · Close · Dismiss · Not now · Skip                                                                                                                                 | —                                             |
| Try again                                                                                                                                                                 | Retry                                         |
| Download / Downloaded content / Available offline                                                                                                                         | cache                                         |
| Guest · Cloud sync · Excused days · in congregation · Listener                                                                                                            | anonymous · backend · exempt · jamaat · model |

Spelling: American English in `en`.

## Rules for contributors

- [ ] Colours come from `useThemeTokens()` — no hex, `rgba()`, or ad-hoc `withAlpha(x, n)` where a token exists.
- [ ] `accent` is a fill. Text and icons use `accentText` (on background/card) or `accentOnSoft` (on tints/muted). Same for `status.X.color` vs `.text` / `.onSoft`.
- [ ] Text uses `ThemedText` with a `type` (+ `weight`); no `fontSize` / `fontWeight` literals; nothing under 11pt.
- [ ] Spacing, radius, heights, icon sizes, borders, z-index and opacity come from `Spacing`, `Radius`, `Control`, `IconSize`, `BorderWidth`, `ZIndex`, `Opacity`. No `Spacing.x + n`.
- [ ] TV: sizes are tokens or `tvDp(n)`; never `tvDp` a value that is already scaled (`Spacing`, `Radius`, `Control`, `TvLayout.*`) or one a component scales itself (`ThemedText` sizes, `SymbolView size`, `IconButton hitTarget`).
- [ ] Touchables are `PressableScale` or a primitive built on it, with a role and (if icon-only) a label; targets ≥ 44pt / 48dp.
- [ ] Inputs are `TextField` / `SearchField` with a visible label; errors use the error state and are announced.
- [ ] Dialogs and sheets are `Sheet` / `ConfirmDialog`; destructive confirms use `destructive`; no `Alert.alert`, no raw `Modal`.
- [ ] Every data screen handles loading, empty, error and offline through `ContentState`.
- [ ] Motion uses `Springs` / `Durations` and respects reduced motion.
- [ ] Strings are in all 24 catalogs, sentence case, glossary terms; no `error.message`, no emoji, no `textTransform: "capitalize"`.
- [ ] Arabic uses `type="arabic"`, is never truncated or restyled.
- [ ] Layout uses logical (start/end) props and works in RTL.
- [ ] A new token or component is added to this doc first, with the evidence for it. A new colour pair gets a contrast test.
- [ ] Before adding a `*Row`, `*Chip`, `*Field`, `*Badge` or `*Button` in a feature folder, check the [catalogue](#components).

Enforcement (no new CI job — runs inside the existing `test` task, same pattern as `i18n-guard.test.ts`): a source-scan test that fails on new `fontSize:` literals, quoted hex, `color: colors.accent`, `Spacing.\w+ [+-]`, and `Alert.alert` outside an allowlist (seasonal art, Qur'an renderers, brand logos, media viewers).
