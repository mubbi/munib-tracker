# Platform UX guidelines

Status: implemented (Waves 1–6, 2026-11-25) — the source of truth for UI work; per-task status and any deviations in [`ui-ux-progress.md`](./ui-ux-progress.md), reviews in [`ui-ux-final-review.md`](./ui-ux-final-review.md). Native/device verification still pending where marked.

Concrete requirements per platform for Munib Tracker. The shared language is in [`design-system.md`](./design-system.md); token flow and the shared-vs-platform component table are in [`cross-platform-design-system.md`](./cross-platform-design-system.md). **FIX (E-nn / A-nn / F-nn)** marks a requirement today's code does not meet, with the audit finding.

## Provenance — read this first

| Kind of statement                                                                                                                                                                                                                                                                                   | Source                                                                                         | Trust                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| What the app does today (files, values, breakpoints, TV density, rail widths)                                                                                                                                                                                                                       | Read from this repo's code and [`TV.md`](./TV.md) / [`DEVICES.md`](./DEVICES.md) on 2026-11-25 | Verified against source; **not** run on any device                      |
| Contrast ratios                                                                                                                                                                                                                                                                                     | Computed from repo hex values (WCAG formula)                                                   | Verified arithmetic; not measured on screen                             |
| TV canvas and safe-zone numbers (960×540dp, 5% overscan, tvOS 60pt / 80pt, Fire TV 14sp floor)                                                                                                                                                                                                      | Already cited in `constants/tv-layout.ts` and `TV.md`                                          | Repo-documented; re-check on device                                     |
| Platform guideline numbers — Apple HIG (44pt, tvOS/watchOS conventions), Material 3 (48dp, navigation bar/rail, window size classes 600/840, bottom-sheet 640dp), WCAG 2.2 success criteria, Wear OS tiles / M3 Expressive, Android predictive back, iPadOS tab bar/sidebar, widget rendering modes | **From memory.** No live documentation was fetched                                             | Re-check against the official pages before turning a line into a ticket |

**Needs a Mac or a device before sign-off** (nothing below can be confirmed from the Windows dev box):

| Area         | What to verify                                                                                                                                                                                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tvOS         | Density after any size change (E-25, E-26, E-28), focus engine order and memory, Menu ladder, glyph vs well sizes, focus scale value                                                          |
| watchOS      | Layout on 40/41/45/49mm, Digital Crown vs scroll (E-33), Always-On, WatchConnectivity delivery, complications on real faces, Smart Stack                                                      |
| iOS / iPadOS | Liquid Glass tab bar, tinted/clear widget modes (E-17), Dynamic Island, Live Activity on Watch/CarPlay (E-18), Dynamic Type at AX sizes, VoiceOver order, iPad window controls vs rail (E-13) |
| Android      | Predictive back (E-20), edge-to-edge under modals, widget picker previews (E-22), TalkBack, 200% font scale, hardware keyboard on tablets                                                     |
| Wear OS      | Whether the generated Kotlin compiles, round-screen clipping (E-40), Play Wear quality review (E-39) — doable on Windows with a Wear emulator                                                 |
| Web          | Focus loss on press (E-01 / F-41), which focus rule wins and the radius override (E-03), NVDA/VoiceOver, 200% zoom and 320px reflow                                                           |

---

## Web

Responsive web app + installable PWA via react-native-web. Keyboard and pointer are first-class.

| Topic              | Requirement                                                                                                                                                                                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation model   | < 768: bottom tab bar. ≥ 768: global left rail beside the root stack (persists on pushed screens). Browser back/forward always work; every screen has a URL. Primary nav items render as real `<a href>` (expo-router `Link asChild`) so middle-click, Ctrl-click and crawlers work — **FIX (E-05)** |
| Landmarks          | `navigation` on rail/tab bar, `main` on content, "Skip to content" as first focusable — **FIX (F-59)**                                                                                                                                                                                               |
| Breakpoints        | `Breakpoints`: 768 rail · 900 list–detail · 1024 content cap 1120 · 1600 cap 1320. Prose 880 max (65–85 characters). Works from 320px wide without horizontal scroll                                                                                                                                 |
| Safe margins       | Screen padding `Spacing.four`; `env(safe-area-inset-*)` for installed PWA (done)                                                                                                                                                                                                                     |
| Targets            | 44×44 CSS px for primary controls, 48 for bottom-nav items, 24 absolute floor. `hitSlop` does nothing on web — size must be real. **FIX (E-02)** tabs ~36px; **(E-07)** `Button` 40 → 44                                                                                                             |
| Bottom tab bar     | min-height 48px per tab, icon over label, label ≥ 12px, hover state — **FIX (E-02, E-12)**                                                                                                                                                                                                           |
| Rail               | Logo 110px (compact rail 64px) centred above the wordmark — owner call 2026-11-27, supersedes E-10; compact labels ≥ 12px                                                                                                                                                                            |
| Type minimums      | Body 16px, secondary 14px, minimum 12px (11px uppercase eyebrow only)                                                                                                                                                                                                                                |
| Hover              | Every interactive surface: `tokens.hover` wash or brightness shift + `cursor: pointer`                                                                                                                                                                                                               |
| Scrollbars         | Visible on fine pointers for the main scroller — **FIX (E-06)**                                                                                                                                                                                                                                      |
| Sheets / dialogs   | < 768 bottom sheet; ≥ 768 centered dialog (max 520) or centred sheet (max 640). Escape closes. Scrim click closes; scrim is not a tab stop — **FIX (E-11)**                                                                                                                                          |
| Gestures           | None required. Anything a swipe does has a button                                                                                                                                                                                                                                                    |
| Keyboard shortcuts | Existing set (`use-web-key-handler.ts`): arrows in readers, Space in tasbeeh, ⌘/Ctrl-K search. Never override browser shortcuts                                                                                                                                                                      |
| Haptics            | None                                                                                                                                                                                                                                                                                                 |
| Notifications      | Web Push only when installed/permitted ([`WEB_PUSH.md`](./WEB_PUSH.md)); ask in context, never on load                                                                                                                                                                                               |
| PWA                | `orientation: any`; 512 maskable icon; `shortcuts` (Mark Salah, Qibla, Tasbeeh); `screenshots`; splash colours matching the first paint; Chromium `beforeinstallprompt` affordance — **FIX (E-08, E-09)**                                                                                            |

### Focus (web)

| Item        | Spec                                                                                                                                                                                                                                                           |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ring        | `outline: 2px solid var(--munib-focus)`; `outline-offset: 2px`; 2px halo in `var(--munib-focus-halo)` (page background) between element and ring                                                                                                               |
| Colour      | `tokens.focusRing` (= `accentText`): ≥ 3.77:1 on background, card and muted for all 12 accents × 2 schemes (computed). On the deep-green hero: `Brand.heroAccent` (6.9:1). `forced-colors`: `Highlight`                                                        |
| Rules       | **One** `:focus-visible` rule (in `+html.tsx`), covering `a`, `button`, `input`, `textarea`, `select`, and roles `button/link/tab/switch/checkbox/radio/menuitem`. Delete `styles/focus-visible.css`; no `border-radius` override — **FIX (E-03, A-05, F-60)** |
| When        | Keyboard only (`:focus-visible`); programmatic focus on screen landmarks (`tabindex="-1"`) draws no ring                                                                                                                                                       |
| Order       | DOM order = visual order: skip link → rail → header → content → floating player                                                                                                                                                                                |
| Persistence | Focus stays on the control after an in-place action (toggle, chip, stepper, tasbeeh). **FIX (E-01, F-41)**: `PressableScale` blurs the active element on every press — blur only on route change                                                               |
| Restoration | Closing a sheet/dialog returns focus to its trigger; navigating back returns focus to the row that opened the screen                                                                                                                                           |
| Traps       | Only inside modal sheets/dialogs (Tab cycles; Escape exits). Nowhere else                                                                                                                                                                                      |

Back behaviour: browser back closes an open sheet first if it was pushed as a route; otherwise pops the stack. In-app back button goes to the parent route.

Accessibility: WCAG 2.2 AA. Real headings (`ThemedText heading`), `lang`/`dir` on `<html>` (done), live regions for toasts and inline errors (**FIX F-40, F-47**), reflow at 400% zoom / 320px, no information on hover only.

**QA checklist — Web**

- [ ] Tab from page load: skip link → rail → content; ring visible on every stop, in light and dark, with amber and lime accents.
- [ ] Toggle a chip / switch / stepper with Space or Enter: focus stays on it.
- [ ] Open and close a sheet with the keyboard: focus is trapped, Escape closes, focus returns to the trigger.
- [ ] Middle-click and Ctrl-click a rail item opens a new tab.
- [ ] 320px, 768px, 1024px, 1600px widths: no horizontal scroll, no clipped controls.
- [ ] 200% browser zoom and 200% text-only zoom: nothing clipped or overlapping.
- [ ] Bottom tab targets ≥ 48px; all primary buttons ≥ 44px (measure in devtools).
- [ ] Screen reader (NVDA + Firefox, VoiceOver + Safari): headings outline, toast announced, inline error announced.
- [ ] `prefers-reduced-motion`: no scale/slide; `forced-colors`: rings and borders visible.
- [ ] Installed PWA: rotates on tablets, correct splash colour, shortcuts present.

---

## iOS (+ iPad)

| Topic            | iPhone                                                                                                                                                                                                                                                              | iPad                                                                                                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation model | System `NativeTabs` (4 tabs, Liquid Glass, minimise on scroll) + stack per tab. Edge-swipe back everywhere                                                                                                                                                          | **Owner decision (E-13):** system tab bar/sidebar via `NativeTabs` (recommended; platform-native, participates in windowing) vs today's custom 232pt JS rail. If the custom rail stays, host it beside the root stack so it does not disappear on pushed screens — **FIX (E-14)** |
| Layout           | Single column; `Spacing.four` screen padding; safe areas from `ScreenLayout`; content clears the tab bar (`BottomTabInset`)                                                                                                                                         | Width-driven, not device-driven: works at any window size. List–detail at ≥ 900pt for Qur'an and Tracker today; extend to Library, Hadith, Duas, Settings. Prose ≤ ~672–880pt                                                                                                     |
| Targets          | 44×44pt minimum (visual or `hitSlop`)                                                                                                                                                                                                                               | Same; pointer hover states on all pressables — **FIX (E-15)**                                                                                                                                                                                                                     |
| Type minimums    | Body 16pt (HIG body is 17 — accepted), secondary 14, minimum 11                                                                                                                                                                                                     | Same                                                                                                                                                                                                                                                                              |
| Dynamic Type     | Content scales through accessibility sizes; chrome labels capped (see [design-system § Dynamic Type](./design-system.md#dynamic-type--font-scale)); controls use `minHeight` — **FIX (A-07, E-47)**                                                                 | Same                                                                                                                                                                                                                                                                              |
| Back             | Edge swipe + header chevron; never disable the swipe except inside a drag surface (tasbeeh, sheet)                                                                                                                                                                  | Same                                                                                                                                                                                                                                                                              |
| Sheets / dialogs | `Sheet` bottom with grabber, drag-to-dismiss, slide-in. Confirms = `ConfirmDialog` (center). Route-level task sheets may use expo-router `formSheet` + `sheetAllowedDetents` — no new dependency (E-16)                                                             | Bottom sheets cap at 640pt and centre; prefer centered dialogs / form sheets over full-width bottom cards                                                                                                                                                                         |
| Gestures         | Swipe back; pull-to-refresh where data is remote; long-press context menu **with** a visible alternative (`ContextMenu` is iOS-only — A-18); no custom multi-finger gestures                                                                                        | + trackpad scroll and secondary click = context menu                                                                                                                                                                                                                              |
| Keyboard         | Return-key flow between fields; keyboard avoidance from `ScreenLayout`                                                                                                                                                                                              | Hardware keyboard parity with web shortcuts (arrows, Space, ⌘F/⌘K) — backlog (E-15)                                                                                                                                                                                               |
| Haptics          | Via `lib/haptics.ts` only (user toggle). `selection`: pickers, segmented, stepper. `light`: button press. `success`: Salah marked, target reached. `warning`/`error`: destructive confirm, failure. `tick`/`detent`: tasbeeh. None on plain navigation or scrolling | Same                                                                                                                                                                                                                                                                              |
| Focus            | Full Keyboard Access / hardware keyboard: leave the system focus ring intact; logical order; sheets trap focus                                                                                                                                                      | Same                                                                                                                                                                                                                                                                              |

### Glance surfaces (iOS)

| Surface                        | Requirement                                                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Notifications                  | Invitation tone ("Asr has begun."); actions "Mark prayed" where supported; respect the notification budget in [`DECISIONS.md`](./DECISIONS.md); time-sensitive only for Adhan                                                                                                                                                         |
| Home / lock widgets            | One idea per widget; SwiftUI text styles (Dynamic Type) — hero numerals must not be fixed `.system(size:)`; ≤ 2 tap targets in small; mark accent content `widgetAccentable` and handle `widgetRenderingMode` so tinted/clear modes keep hierarchy — **FIX (E-17)**; colours from snapshot or generated tokens, never literals (E-44) |
| Live Activity / Dynamic Island | Compact: leading glyph + trailing countdown; minimal: one glyph; ≤ 2 actions on Lock Screen; add `supplementalActivityFamilies([.small])` for Watch Smart Stack / CarPlay — **FIX (E-18)**; end promptly                                                                                                                              |
| Siri / App Intents             | Mark intents answer with a short dialog; phrases use the glossary (Salah, Qaza)                                                                                                                                                                                                                                                       |
| Focus shield                   | Brand colours from generated tokens; one primary action                                                                                                                                                                                                                                                                               |

Accessibility: VoiceOver labels/roles/values per the design system; `accessibilityViewIsModal` + escape on every modal (**FIX F-56** — four raw `Modal`s); toasts use `announceForAccessibility` (**FIX F-40**); Reduce Motion replaces scale/slide with fades; Bold Text and Increase Contrast must not break layouts.

**QA checklist — iOS / iPad** (Mac + device)

- [ ] Largest accessibility text size: no clipped labels in buttons, tabs, chips, badges; body text reflows.
- [ ] VoiceOver through: mark a Salah, count a tasbeeh, open and close a sheet (two-finger scrub closes), hear a toast.
- [ ] All tappable elements ≥ 44pt (Accessibility Inspector).
- [ ] Light and dark × forest, amber, lime, rose accents: selected chip, secondary button, tab label, destructive confirm readable.
- [ ] Reduce Motion on: no scale or slide; Reduce Transparency on: sheets and tab bar still legible.
- [ ] Edge-swipe back works on every pushed screen.
- [ ] iPad: every Split View / Stage Manager width; navigation chrome persists on pushed screens; trackpad hover visible.
- [ ] Widgets in standard, tinted and clear modes; lock-screen widgets; Dynamic Island compact/minimal/expanded.
- [ ] Haptics off in Settings → no haptics anywhere.

---

## Android (+ tablet / foldable)

| Topic            | Phone                                                                                                                                                                                                        | Tablet / foldable / ChromeOS                                                                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Navigation model | System `NativeTabs` (Material 3 navigation bar: icon over label) + stack per tab                                                                                                                             | Custom side rail at ≥ 768dp. Keep it beside pushed screens — **FIX (E-14)**. 232dp sits between an M3 rail (80–96dp) and drawer (360dp): acceptable while it carries labels; revisit if destinations stay at four (E-24) |
| Layout           | Edge-to-edge: draw behind system bars, pad with insets (`ScreenLayout`). `Spacing.four` screen padding                                                                                                       | Width-driven tiers (768 / 900 / 1024 / 1600). M3 window size classes for reference: compact < 600, medium 600–839, expanded ≥ 840. Hinge-aware only where interaction is affected (`lib/platform/hinge.ts`)              |
| Targets          | 48×48dp minimum: visual ≥ 44 + `hitSlop` — **FIX (E-07)** `Button` 40                                                                                                                                        | Same                                                                                                                                                                                                                     |
| Type minimums    | Body 16sp, secondary 14sp, minimum 11sp. Usable at 200% font scale (non-linear on Android 14+)                                                                                                               | Same                                                                                                                                                                                                                     |
| Press feedback   | Themed bounded ripple on every pressable (`PressableScale`, done) + scale                                                                                                                                    | + hover on pointer devices — **FIX (E-15)**                                                                                                                                                                              |
| Back             | System back: closes sheet → pops stack → leaves app from a tab root. **Enable predictive back** (`app.json` `predictiveBackGestureEnabled` is `false`) and re-test `BackHandler` call sites — **FIX (E-20)** | Same                                                                                                                                                                                                                     |
| Sheets / dialogs | Bottom sheet, max 640dp, scrim, back dismisses, slide-in. Confirms centered                                                                                                                                  | Centered above 640dp                                                                                                                                                                                                     |
| Gestures         | Pull-to-refresh; long-press must have a visible alternative — `ContextMenu` renders nothing on Android today (**FIX A-18**: fall back to an action `Sheet`)                                                  | + secondary click                                                                                                                                                                                                        |
| Haptics          | Same vocabulary as iOS through `lib/haptics.ts`; `tick` / `detent` map to Android segment/clock ticks                                                                                                        | Same                                                                                                                                                                                                                     |
| Focus            | Hardware keyboard / D-pad: every pressable focusable with visible highlight; logical order                                                                                                                   | Required for ChromeOS and keyboard tablets                                                                                                                                                                               |

### Glance surfaces (Android)

| Surface                 | Requirement                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Notifications           | Channels named with the glossary ("Adhan at Salah time"); ongoing Salah notification per [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md); actions "Mark prayed"                                                                                                                                                                                                                       |
| Home / lock widgets     | Light and dark trees from generated tokens (**FIX E-45** drifted `#4A5F56`); system corner radius `system_app_widget_background_radius` (**FIX E-23**); 48dp click targets; every widget has a localised picker label, description and a truthful preview — **FIX (E-21, E-22)**: `TasbeehGlanceWidget` and `JumuahWidget` missing from `GALLERY_KEYS`, one shared English preview |
| Material You            | Not adopted — brand palette is a deliberate choice; note it in store listing QA                                                                                                                                                                                                                                                                                                    |
| App Actions / shortcuts | Launcher shortcuts mirror the PWA shortcuts (Mark Salah, Qibla, Tasbeeh)                                                                                                                                                                                                                                                                                                           |

Accessibility: TalkBack roles on every pressable (**FIX F-44**: default `button` role), live regions for toasts and inline errors, switch off-track visible (**FIX A-14**), no information by colour alone.

**QA checklist — Android**

- [ ] Font scale 200% and display size largest: no clipped chrome; rows grow.
- [ ] TalkBack through: mark a Salah, change a stepper (value announced), dismiss a sheet with back, hear a toast.
- [ ] All targets ≥ 48dp (Accessibility Scanner).
- [ ] Predictive back: preview animates on stack pop and on leaving the app; sheets dismiss.
- [ ] Edge-to-edge: nothing under the status or gesture bar, including inside sheets and with the keyboard open.
- [ ] Off switch visible on a light card; ripple clipped to rounded corners.
- [ ] Tablet / foldable: 600, 840, 1024dp widths; rail persists; fold/unfold keeps state.
- [ ] Hardware keyboard: Tab reaches everything, focus visible.
- [ ] Widget picker in English, Arabic and Urdu, light and dark: correct name, description and preview for all 12 widgets.

---

## TV

Apple TV (tvOS 17+, 1920×1080pt) and Android TV / Fire TV (960×540dp), same bundle via `EXPO_TV=1`. Plumbing, commands and gates: [`TV.md`](./TV.md).

| Topic              | Requirement                                                                                                                                                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Navigation model   | Left side rail always (`WideAppTabs`): collapsed 96dp, expands to 288dp on focus. D-pad Right enters content (`nextFocusRight` → content focus guide). No bottom tabs, no gestures                                                                                                                                       |
| Canvas and density | Author in Android-TV dp. tvOS doubles through `TV_DENSITY`. **Never double-scale** — see the table in [`cross-platform-design-system.md`](./cross-platform-design-system.md#never-double-scale-tv). **FIX (E-25)**: rail uses bare 44/56/64/72/4 — wrap in `tvDp`. **FIX (E-26)**: `button.tsx:73`, `switch-row.tsx:107` |
| Safe margins       | `TvLayout.contentPaddingX` 48dp (= 96pt tvOS, ≥ 80pt required). `TvLayout.overscanY` **28 → 30dp** so tvOS gets 60pt — **FIX (E-28)**. Nothing essential outside the inner 90%                                                                                                                                           |
| Targets            | Focusable rows and buttons ≥ `TvLayout.minFocusTarget` (64dp); chips ≥ `TvLayout.chipMinHeight` (48dp); grid gap `TvLayout.gridGap` (20dp)                                                                                                                                                                               |
| Type minimums      | `TvType`: body 18dp, small 16, caption 14 (Fire TV floor), label 13 uppercase only. tvOS result ≈ 36 / 32 / 28pt. Prose column `TvLayout.proseMaxWidth`                                                                                                                                                                  |
| Input              | D-pad + Select + Back + Play/Pause only. No touch, no free typing where a stepper or list works (`Stepper`, `tv-number-stepper`). No dependence on camera, mic, GPS, biometrics                                                                                                                                          |
| Sheets / dialogs   | Centered, max `tvDp(520)`; visible title; **no grabber** — **FIX (E-29)**; Cancel takes initial focus on destructive confirms; Back closes; scrim not focusable                                                                                                                                                          |
| Toasts             | No action toasts (existing rule); the action lives in the focused row                                                                                                                                                                                                                                                    |
| Haptics            | None                                                                                                                                                                                                                                                                                                                     |
| Glance surfaces    | Apple TV Top Shelf is a static image; a content extension (next Salah, continue reading) is backlog only — new native target (E-30). No notifications on TV                                                                                                                                                              |
| Scope              | Lean-back: times, Salah marking, Qur'an text + audio, Learn, read-only stats. Private and typing-heavy tools are gated (`notOnTv`); gated screens show one consistent "Available on your phone" `EmptyState` with a focusable action — **FIX (D-40)**. Recommend hiding finance tools by default (audit E §5)            |

### Focus (TV)

| Item                | Spec                                                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ring                | `TvLayout.focusRingWidth` (3dp → 6pt tvOS) solid border, grown outward (negative margin, already implemented), radius = element radius                                                                                                                |
| Colour              | `tokens.focusRing` (= `accentText`), ≥ 3.77:1 on every ladder surface for all accents. **FIX (E-04)**: uses raw `accent` today (amber 2.80, lime 2.72 on the light page). On the hero: `Brand.heroAccent`                                             |
| Scale               | Default 1.04 (`TV_FOCUS_SCALE`, the shipped value); tiles/cards may pass 1.06; full-width rows and `TvReadableBlock` 1.0–1.02. [`TV.md`](./TV.md) says "~1.08" — align the doc to the code — **FIX (E-27)**. Skipped under reduced motion; ring stays |
| Selected vs focused | Selection is a soft fill + check; focus is the ring. They must be distinguishable when both apply (chips already do this)                                                                                                                             |
| Initial focus       | Every screen declares it: `preferredFocus` on the primary action or first row; sheets auto-focus                                                                                                                                                      |
| Order               | Spatial: what is visually right/left/up/down is next. Rail is always reachable with Left from the content's left edge                                                                                                                                 |
| Memory              | `TvFocusGuide autoFocus` restores the last focused child when re-entering a group; returning from a pushed screen restores the row that opened it                                                                                                     |
| Traps               | Horizontal rows: `trapFocusLeft` / `trapFocusRight` only — **never** `trapFocusUp` / `Down`. Modal dialogs trap fully. Nothing else traps                                                                                                             |
| Scrolling           | Scroll containers are not focus targets (`TvScrollView`, `TvFlatList`); read-only prose is wrapped in `TvReadableBlock` so D-pad can scroll it                                                                                                        |
| Never               | A screen with zero focusable elements; focus on a hidden or off-screen element; focus lost after a list item is removed (move to the neighbour)                                                                                                       |

Back behaviour (ladder): close overlay/sheet → pop stack → focus the rail → system Home. No "exit?" confirmation.

Accessibility: VoiceOver (tvOS) / TalkBack (Android TV) labels as on phone; text contrast targets unchanged; no meaning by focus colour alone; reduced motion honoured.

**QA checklist — TV** (tvOS on a Mac — mandatory after any size change; Android TV + Fire TV emulator)

- [ ] tvOS and Android TV side by side: rail, buttons, chips, rows, icons are the same physical size (no half-size or double-size element).
- [ ] Every screen: something has focus on entry; every control reachable by D-pad; no dead ends.
- [ ] Focus ring clearly visible in light and dark with amber and lime accents, on cards, muted rows and the hero.
- [ ] Back from every depth follows the ladder and ends at system Home without a prompt.
- [ ] Leave a list for its detail and come back: focus returns to the same row.
- [ ] Long article: D-pad scrolls paragraph by paragraph (`TvReadableBlock`).
- [ ] Nothing important within 5% of any edge; tvOS top/bottom ≥ 60pt.
- [ ] Sheets: no grabber, title visible, Cancel focused on destructive confirms.
- [ ] Gated features show the unavailable state with a focusable action.
- [ ] Play/Pause on the remote controls audio from any screen.

---

## Apple Watch

Companion app (watchOS 10+, needs the paired iPhone) + complications. SwiftUI in `apps/app/targets/munib-tracker-watch*`. Brand colour and copy are shared; type, spacing and components are watchOS-native.

| Topic            | Requirement                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation model | Vertical `TabView` pages: **Now** (next Salah, countdown, Mark) · **Today** (five Salah) · **Tasbeeh**. Next-Salah hero is first, not a link to Tasbeeh — **FIX (E-34)**                                                     |
| Glance rule      | One primary fact per screen, readable in under 2 seconds                                                                                                                                                                     |
| Layout           | Fit without scrolling on 40/41mm for Now and Tasbeeh; size with `GeometryReader`, no fixed 130pt frames — **FIX (E-33)**. System margins; nothing in the corners                                                             |
| Targets          | ≥ 44pt; no more than 2–3 controls side by side on 41mm (four `.bordered` caption buttons today — E-33)                                                                                                                       |
| Type             | SwiftUI text styles only (Dynamic Type); countdown via `Text(timerInterval:)`; no fixed point sizes                                                                                                                          |
| Colour           | Brand tint from the snapshot `theme.primary`, generated-token fallback; target config needs `colors: { $accent }` — system tint and system `.green` today (**FIX E-34, E-44**)                                               |
| Marking a Salah  | Explicit button on the current Salah only; future Salah disabled; state shown **on the row**; `.sensoryFeedback(.success)`; undo available. **FIX (E-31)**: every row marks immediately on tap, no undo, feedback off-screen |
| Tasbeeh          | Count persists (`@AppStorage`: count, target, date) — **FIX (E-32)**. Digital Crown has one job on this screen (count); target and reset live in a toolbar or secondary page; reset confirms                                 |
| Digital Crown    | One job per screen: scroll **or** count, never both                                                                                                                                                                          |
| Gestures         | Tap; system back swipe; double-tap = primary action (`handGestureShortcut(.primaryAction)`, guarded by availability)                                                                                                         |
| Back             | System (swipe from leading edge / crown press to face)                                                                                                                                                                       |
| Sheets / dialogs | `.confirmationDialog` with ≤ 2 actions; no multi-step flows                                                                                                                                                                  |
| Haptics          | Success on mark and on reaching the tasbeeh target; light click per count; none on navigation                                                                                                                                |
| Always-On        | Dim, hide seconds, redact private numbers (done in complications; apply in the app)                                                                                                                                          |
| Offline / stale  | Show when the snapshot is stale; queued marks sync when the phone returns; unsigned state = "Open Munib on your iPhone"                                                                                                      |
| Complications    | All accessory families (done); add `TimelineEntryRelevance` in the 30 minutes before each Salah so Smart Stack surfaces it — **FIX (E-35)**                                                                                  |
| Never            | Qur'an, hadith or dua text; settings; lists longer than one screen; hardcoded English (title is `"Munib"` today)                                                                                                             |

Accessibility: VoiceOver labels on every control and complication; Dynamic Type to the largest watch size without truncating the Salah name; no colour-only completed state (check glyph + label).

**QA checklist — Apple Watch** (Mac + watch or simulator, 41mm and 49mm)

- [ ] Now and Tasbeeh fit without scrolling on 41mm at default and largest text size.
- [ ] Mark the current Salah: haptic, row shows done, phone reflects it; undo works; future rows cannot be marked.
- [ ] Count 10, lower the wrist for a minute, raise: count is still 10. Force-quit and reopen: still 10.
- [ ] Crown counts on Tasbeeh and scrolls on Today; never both on one screen.
- [ ] Phone out of range: mark is queued and syncs later; stale indicator shows.
- [ ] Always-On: dimmed, no seconds ticking, private counts redacted.
- [ ] Complications on Modular, Infograph and a corner face; Smart Stack surfaces next Salah before Adhan.
- [ ] Brand tint (not system blue/green) in light and dark appearances; VoiceOver reads every control.
- [ ] Arabic and Urdu: strings localised and right-to-left.

---

## Wear OS

Today: two tiles (Next Salah, Tasbeeh) generated from string templates in `plugins/withWearOs.cjs`; no launcher activity, no complication. Brand colour and copy are shared; everything else is Wear Material 3.

| Topic            | Requirement                                                                                                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation model | Tiles are glances reached by swiping the system carousel. There is no app navigation until a Compose activity exists                                                                                                                                       |
| Tile layout      | `protolayout-material3` `materialScope { primaryLayout(titleSlot, mainSlot, bottomSlot) }` — round-safe margins come from the layout. **FIX (E-40)**: bare `Column` on the older `protolayout-material`                                                    |
| Tile actions     | One clear action, in a distinct edge button. The tile body opens the phone app. **FIX (E-38)**: the whole Next Salah tile marks the Salah on any tap                                                                                                       |
| Feedback         | Next render shows "Marked ✓" or "Will sync". Marks are written as Data Layer `DataItem`s so they survive the phone being out of range — **FIX (E-37)**: `sendMarkCurrent` swallows failures and the mark is lost                                           |
| Tasbeeh          | A tile is the wrong surface for rapid counting (a full tile reload per tap, no haptic). Tile = glance (count / target + "Open"). Counting needs a small Compose activity with rotary input and haptics, or the tile is dropped — **owner decision (E-41)** |
| Freshness        | One timeline entry per Salah boundary with validity ranges — not 15-minute polling — **FIX (E-42)**                                                                                                                                                        |
| Targets          | ≥ 48dp; keep interactive content away from the round edge                                                                                                                                                                                                  |
| Type             | Wear Material 3 typography constants only; long Salah names must not clip at display sizes on round screens (verify)                                                                                                                                       |
| Colour           | From `plugins/generated/native-tokens.json` (no hex in Kotlin templates); dark surfaces only — Wear UI is dark by convention                                                                                                                               |
| Back             | System swipe-to-dismiss (activities only)                                                                                                                                                                                                                  |
| Haptics          | None in tiles; in an activity: per count + on target                                                                                                                                                                                                       |
| Manifest / store | Declare `com.google.android.wearable.standalone` (`false`), app icon, **localised** tile labels, real tile previews — **FIX (E-39)**                                                                                                                       |
| Source layout    | Move Kotlin out of the JS plugin into `modules/munib-wear/wear/` so it can be linted and tested; the plugin copies it — **FIX (E-43)**                                                                                                                     |
| Complication     | A Next Salah `ComplicationDataSourceService` is the highest-value missing glance (backlog; no new JS dependency)                                                                                                                                           |
| Never            | Scripture text; settings; anything requiring text entry; silent failure                                                                                                                                                                                    |

Accessibility: content descriptions on every clickable and on tile roots; TalkBack reads Salah name + time + state; no colour-only state; respects system font scale within tile limits.

**QA checklist — Wear OS** (Android prebuild + Wear emulator, round small and large)

- [ ] Kotlin compiles from a clean prebuild; tiles appear in the tile picker with real previews and localised names.
- [ ] Next Salah tile on a small round screen: nothing clipped, longest Salah name fits in English, Arabic and Urdu.
- [ ] Swiping past the tile never marks a Salah; only the edge button does.
- [ ] Mark with the phone connected: tile shows "Marked ✓", phone reflects it.
- [ ] Mark with the phone in airplane mode: tile shows "Will sync"; reconnect → phone reflects it.
- [ ] Tile content is correct at each Salah boundary without opening the app.
- [ ] TalkBack reads the tile and the button meaningfully.
- [ ] Play Console pre-launch report: no Wear quality warnings.

---

## Cross-platform acceptance (run on every platform above)

- [ ] Light and dark, with forest (default), amber, lime and rose accents: no text under 4.5:1, no control boundary or focus ring under 3:1.
- [ ] Brand green before the first sync matches the app's default accent on every native surface (E-44).
- [ ] Glossary terms and sentence case in every visible string; no English fallback in Arabic/Urdu.
- [ ] RTL: layout mirrors, chevrons flip, Arabic scripture stays right-aligned and untruncated.
- [ ] Loading, empty, error and offline states exist for every data screen.
- [ ] Reduced motion honoured.
