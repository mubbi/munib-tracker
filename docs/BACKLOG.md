# Active backlog

Open work only. Shipped features: [`FEATURES.md`](./FEATURES.md). Locked decisions:
[`DECISIONS.md`](./DECISIONS.md). Guides: [`README.md`](./README.md).

Last reviewed 2026-11-24, after the NF-3.x wave shipped (the plan is retired; its open items moved
here).

---

## Owner actions

Things only the owner can do (accounts, consoles, legal, production data).

| Item                               | Notes                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Private-sync migration             | Run `1720000013000-StripPrivateSyncPlaintext` (D46) on **staging before prod**. It strips the excused reason and exact coordinates from stored rows and deletes `khushu_journal` rows ([`DATA_INVENTORY.md`](./DATA_INVENTORY.md#3-cloud-sync)).                                                                                                                                        |
| First API deploy on TypeORM 1      | Run the Postgres migrations against a throwaway DB first.                                                                                                                                                                                                                                                                                                                               |
| Focus lock store filings           | [`FOCUS_LOCK_FILINGS.md`](./FOCUS_LOCK_FILINGS.md): file the Play foreground-service `specialUse` declaration + video (item 2) and the usage-access / overlay justification + Data safety (item 3); confirm Family Controls is enabled on all 4 App IDs and regenerate profiles (item 1). The privacy paragraph is now on the marketing privacy page — tick item 4 once it is deployed. |
| Kids / privacy legal review (D35)  | COPPA, GDPR Art. 8, UK AADC, privacy-policy update with a versioned `consentPolicyVersion`, DPIA for the circle flows — checklist in [`CIRCLES.md`](./CIRCLES.md#open-external-items-not-done). App copy never claims compliance.                                                                                                                                                       |
| Surface-push cron                  | Schedule `POST /surface-push/internal/dispatch-due` every 1–5 min with `SURFACE_PUSH_CRON_SECRET` ([`WEB_PUSH.md`](./WEB_PUSH.md)). Without it no family digest (D40) is sent and the circles retention sweep never runs ([`CIRCLES.md`](./CIRCLES.md)).                                                                                                                                |
| QAC file check (D22)               | Compare the pinned Quranic Arabic Corpus copy once with the official corpus.quran.com download (sha256 in [`proofs/root-word-search.md`](./proofs/root-word-search.md)). If it differs, switch to the second verified mirror.                                                                                                                                                           |
| Dua count                          | Marketing says **279 duas** (`packages/shared/src/constants/features.ts`); `packages/shared/src/content/duas.ts` has **293 entries**. Decide what counts as a dua and align the copy.                                                                                                                                                                                                   |
| Store version codes                | Set from Play Console / App Store Connect before the next upload ([`RELEASES.md`](./RELEASES.md)).                                                                                                                                                                                                                                                                                      |
| Store screenshots                  | Pending sets (Play phone/tablet refresh, Wear OS, Android TV banner) — [`STORE_ASSETS.md`](./STORE_ASSETS.md#store-screenshot-status).                                                                                                                                                                                                                                                  |
| Store listing copy                 | [`IOS_APP_COPY.md`](./IOS_APP_COPY.md) / [`ANDROID_APP_COPY.md`](./ANDROID_APP_COPY.md) predate the NF-3.x features; refresh "What's New" / descriptions for the next release.                                                                                                                                                                                                          |
| GitHub settings after going public | Checklist in [`OPEN_SOURCE.md`](./OPEN_SOURCE.md#manual-github-settings-do-after-going-public).                                                                                                                                                                                                                                                                                         |
| Optional Mirath Learn guide        | Offered by the owner, not decided.                                                                                                                                                                                                                                                                                                                                                      |

---

## Device QA

Needs real hardware or a Mac. Nothing here blocks CI.

| Area                         | What to check                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Salah focus lock (NF-3.13)   | iOS Family Controls hard block on a release build + Android foreground service / overlay — checklist in [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md#salah-focus-lock-nf-313). |
| Nearby join (NF-3.25)        | BLE beacon iOS↔Android, match code, host approval, backgrounding — checklist in [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md#nearby-join-nf-325).                              |
| Timetable OCR (NF-3.12)      | Native text recognition (iOS Vision, Android ML Kit) on real photos of printed timetables, incl. Eastern-Arabic digits.                                                       |
| Adhan notification clips     | The per-style ≤ 30 s WAV notification sounds (D29) on iOS and Android channels.                                                                                               |
| PDF export (D30)             | `expo-print` wasiyyah / debts statement through the native print/share sheet.                                                                                                 |
| Speech latency               | Hands-free tasbeeh (pause counting + teach-a-zikr) and NF-3.24 pronunciation check on low/mid devices.                                                                        |
| Watch                        | The Swift watch app and complications (`targets/munib-tracker-watch*`) on a Mac build; Wear OS app + tiles on each native bump.                                               |
| TV                           | D-pad focus in the settings master–detail pane; the TV checklist in [`TV.md`](./TV.md).                                                                                       |
| Suggested calculation method | iOS reverse geocoder returns `isoCountryCode` so the per-country suggestion appears (`lib/prayer-method-suggestion.ts`).                                                      |
| Seasonal banner              | Scrim contrast and RTL layout on web.                                                                                                                                         |
| Qur'an practice (NF-2.38)    | Device proofs (Phase 3) for the recitation companion.                                                                                                                         |
| Expo SDK 58 matrix           | Cache migration, recitation capture, audio focus, quick-action cold start, Precise Adhan under Doze, AsyncStorage downgrade.                                                  |
| Device-only surfaces         | Release (R8) builds, widgets, Android Live Updates and OAuth on device.                                                                                                       |
| Mac builds                   | `cleanbuild:app:ios` / `cleanbuild:app:tv`, Xcode build of the app + local modules + targets, iOS and tvOS archives, `@bacons/apple-targets` 5 check.                         |
| iPhone Duo                   | Vertical-bar status glyphs ignore the per-screen `StatusBar` style on iOS 27.2 (dark clock on the night home hero) — sizes in [`DEVICES.md`](./DEVICES.md).                   |

---

## Translations review

| Item                   | Notes                                                                                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native-speaker review  | All 23 non-English locales. Start with the low-resource ones: `ha`, `so`, `sw`, `tk`, `ky`, `kk`, `tg`, `ku` (Sorani), `ps`. Workflow in [`I18N_GUIDE.md`](./I18N_GUIDE.md). |
| D45 scripture meanings | Data-blocked items below ("Content — data-blocked").                                                                                                                         |

---

## Engineering follow-ups

| Item                        | Notes                                                                                                                                                                                                                                                                            |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arafah-eve copy             | The "Intend the fast" prompt still shows when the fast is already intended.                                                                                                                                                                                                      |
| Vault lock order            | `ensureDek` / `adoptDek` in `apps/app/src/lib/vault/vault.ts` should share one lock order.                                                                                                                                                                                       |
| Retire legacy sync entities | Next release: drop `white_days_checklist` and `reading_text_visibility` from `SYNC_ENTITIES` (`apps/api/src/sync/dto/sync.dto.ts`) and the client; `khushu_journal` is also accepted for one release only (D46).                                                                 |
| Pending madhhab anchors (7) | `PENDING` in `apps/app/src/lib/fiqh/difference-coverage.test.ts`: `/location` (Asr/Isha notes), home hero preferred-window sub-band, reminder-offsets preferred-time suggestion, tracker Witr info notes, tracker rawatib chips, `/statistics#rawatib`, calendar excused picker. |
| Settings layout migration   | Move `PracticePills` and remaining screens onto `SETTINGS_TWO_COLUMN_MIN_WIDTH` (`components/settings/settings-layout.tsx`).                                                                                                                                                     |
| Mirath second sources       | Six disputed or rare fixtures rest on one reference calculator: X30, X37, X09, X12, X33, X40 ([`proofs/mirath.md`](./proofs/mirath.md)). Find a second source for each.                                                                                                          |
| Structured evidence refs    | Evidence lines that exist only as i18n text should become structured refs (verifiable by `content-verification.ts`).                                                                                                                                                             |
| Hands-free spotter re-eval  | The model-based phrase spotter is built but switched off (`lib/tasbeeh-voice/mode.ts`); re-run the eval and switch it on only if it meets the gate ([`proofs/hands-free-tasbeeh.md`](./proofs/hands-free-tasbeeh.md)).                                                           |
| NF-3.24 gates               | Measure on-device latency. The full Clear / Listen again / Not sure mode turns on automatically if a future S3 eval passes; NF-3.15 Phase B word cards turn on when the pinned S4 calibration has `boundaryP90Ms ≤ 80` (currently `null`).                                       |
| TV in version API           | Add a TV platform to the app-version API (`apps/api/src/version`).                                                                                                                                                                                                               |
| SDK 58 experiments          | Not trialled: granular web chunking, `LocaleProvider`, `activityEnabled`, `expo-location/next`, variable fonts, `requireConfirmation`.                                                                                                                                           |

---

## Product — deferred scope

Not scheduled. Each was explicitly left out of v1 of its feature.

| Feature                    | Deferred part                                                                                                                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NF-3.23 Hadith audio       | Does not ship: no recording source passed the licence review (D12, D19; [`proofs/hadith-audio.md`](./proofs/hadith-audio.md)). Revisit only if a licence-cleared human recording source appears.                                        |
| NF-3.15 Tajweed coaching   | Head-level judging inside a recited ayah (qalqalah / ghunna / gemination in context) waits for the Quran Lab SDK to accept external audio or our alignment (D25); Phase C madd duration and makharij feedback wait on a validated eval. |
| NF-3.24 Pronunciation      | Naming a confusable letter (ح/ه, ع/ء, ص/س…) — only for pairs an eval proves reliable.                                                                                                                                                   |
| NF-3.11 Masjid finder      | In-app map (MapLibre + OpenFreeMap tiles); opt-in home-masjid geofence; extra iqamah feeds once one passes D12/D26 (the `TimetableSource` registry ships empty).                                                                        |
| NF-3.19 Tasbeeh designs    | Per-counter design override on custom tasbeeh entries.                                                                                                                                                                                  |
| NF-3.20 Hands-free tasbeeh | Post-Salah 33 / 33 / 34 sequence mode that moves to the next phrase automatically.                                                                                                                                                      |
| NF-3.4 Umrah mode          | Tawaf / sa'i counter on Apple Watch / Wear OS.                                                                                                                                                                                          |
| NF-3.1 Rawatib             | Home-screen widgets.                                                                                                                                                                                                                    |

---

## Content — data-blocked

These need **OSS datasets** before implementation (do not AI-generate). Rule: D45 in
[`DECISIONS.md`](./DECISIONS.md).

| Task                                          | Notes                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D45 — hadith meanings in Learn guides         | Guide hadith refs carry only collection + citation, so non-English UIs show the labelled English (`EnglishMeaningLabel`). Remote hadith editions exist for `ur id tr bn fr ru` (`hadith-editions.ts`); resolving a guide ref to a dataset hadith needs a citation → corpus-id map (Muslim numbering differs — see the madhhab proof log). |
| D45 — dua / zikr meanings in Learn guides     | Salah-guide phrases, learn-dua phrases and Jannah/Jahannam duas (`translation` fields) show labelled English outside `bn`/`id`; wire them to the Hisnul dataset translations where the phrase has a corpus id.                                                                                                                            |
| D45 — prose-embedded quotes in older overlays | Overlays rewritten in the 2026-11-24 pass quote Qur'an/hadith inside prose only from datasets (else English + "(English meaning)"). Older, not-rewritten overlays may still contain hand-translated quotes inside body prose — audit them module by module.                                                                               |
| No hadith dataset                             | `ms ha sw so az uz kk ky ku tg tk bs sq ps fa hi` have no fawazahmed0 hadith edition; `tk`'s Qur'an edition is Turkish (Diyanet) — a Turkmen Qur'an translation would replace it.                                                                                                                                                         |

---

## Content pipeline

See [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) and [`DATA_INGESTION.md`](./DATA_INGESTION.md).

| Item                                    | Notes                                                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Bundled adhan-call MP3 (full local set) | Baseline `adhan.mp3` + remote CDN styles shipped (`lib/adhan-audio.ts`); expand local files under `assets/audio/adhan/` |
| Per-item content `audioUri`             | Types wired; populate from OSS where available (play UI stays hidden until real URLs)                                   |

---

## Performance

Profile + playbooks: [`PROFILING.md`](./PROFILING.md)

| Priority | Task                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Android barcode / ML Kit assets — confirm unused; exclude from the release AAB if so. Note: NF-3.12 timetable OCR now uses ML Kit Text Recognition (Latin), so keep that model. |

---

## Device platforms

Support matrix: [`DEVICES.md`](./DEVICES.md)

| ID   | Goal                                   | Status                                                                                                                                                                                   |
| ---- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DS-2 | Watch / Wear maintenance QA            | Built — include face complications (circular/corner/inline/rectangular) each native bump                                                                                                 |
| DS-4 | visionOS                               | Not started                                                                                                                                                                              |
| DS-6 | Desktop native (PWA preferred)         | Web shipped                                                                                                                                                                              |
| DS-9 | Live Activity delivery worker (Fly.io) | Deferred — QStash + cron is current; add when the prayer-time backlog needs a long-running poller ([`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md#future-flyio-worker-when-required)) |

Shipped and removed from this table: DS-1 tablet / large-screen polish, DS-3 Apple TV / Android TV ([`TV.md`](./TV.md)).
