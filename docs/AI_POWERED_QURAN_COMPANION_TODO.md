# Quran Companion — implementation spec

Status: **implemented in the working tree** (Phases 0–6, 17 Nov 2026, not committed). What is still open is listed in [§24](#24-what-is-still-open) — almost all of it needs a physical phone, a browser session, or the store consoles. This file is the spec. It replaces the earlier open-ended brief, which assumed a greenfield reader, Supabase, and Drizzle migrations. Those assumptions do not match this repo.

Reviewed against the codebase on 16 Nov 2026, including sync, notifications, TV linking, backup, and data wipe ([§19](#19-repo-wiring)), plus the public Tilawa and Quran Lab docs linked in [§18](#18-sources-checked). Engine behaviour that has not been run on a Munib build is marked **prove on device**. Do not treat those items as done.

A second review on 17 Nov 2026 re-checked every file reference against the tree and added the web capture path, the audio-session rules, the release and compliance work ([§20](#20-release-rollout-and-compliance)), and the decisions that were still implicit ([§21](#21-decisions-taken-in-review)). What that pass changed is listed in [§22](#22-review-log).

Do not start another research pass before Phase 0. Implement the phases in order. Stop only for the gates in [§5](#5-stop-gates).

---

## 1. Product

**Quran Companion** is an addition to the existing Qur'an reader. Tagline: "Read. Listen. Learn. Memorize. Improve."

It helps a person:

1. Keep reading with the reader that already ships.
2. Follow a recitation word by word while audio plays (already partially shipped).
3. Recite a chosen passage and see which words the on-device engine matched, missed, or is unsure about.
4. Practise hifz by hiding words or ayahs, then reciting.
5. Revise weak ayahs on a fixed schedule.
6. Study tajweed from the lessons that already ship, and later practise pronunciation only for rules a model can actually support.

The feature stays free. Audio stays on the device unless a future, separate, explicit opt-in says otherwise. Reading, listening, bookmarks, khatm, and the existing hifz marks keep working when no model is installed.

The first screen a person sees offers one next step, not a dashboard of modes. Listening with the existing reciter works before any model is downloaded. Model files and practice preferences live on one settings screen, reached from Settings and from the practice header.

It is for beginners, regular readers, and hifz students. It is not a score of religious correctness and not a leaderboard.

### Out of scope

- Rebuilding the reader, mushaf, tafsir, translations, reciters, or Learn Qur'an curriculum.
- Generating Arabic, translations, or tafsir with an LLM.
- Server-side inference, paid APIs, or a required account.
- Storing raw recordings.
- Using the OS speech recognizer (`expo-speech-recognition` / `src/lib/stt.ts`) as the Qur'an engine. That path is for dictating custom adhkar. It is off on web and TV, and it is not a mushaf aligner.
- Apple TV and Android TV recitation. Those builds have no microphone path (`isTV()`).
- Running Tilawa and Quran Lab in the same session.
- Auto-marking an ayah memorized after one good take.
- New SQL tables, Supabase policies, or Drizzle schema for this feature.
- Riwayat other than Hafs 'an 'Asim. The bundled text and the engine are both Hafs.
- Achievements, Noor points, streaks, or a continue-activity card for practice. `achievements` is derived from tracker data and `continueActivity` belongs to the reader. Practice writes to neither.
- Sharing or exporting a session result.
- Downloading the model while the app is closed. The download runs while the app is open (§7).
- Widgets, Live Activities, Wear, and voice shortcuts for practice.

### Who it is for, and what each person must be able to do

| Person | Must be able to | Covered in |
|---|---|---|
| Beginner who reads slowly | Hear an ayah, then recite it and see which words the listener followed, with no download first | §9.1, §9.2 Follow |
| Regular reader | Start practice on the ayah they are reading, in one tap from the reader | §8 UI integration |
| Hifz student | Hide a passage, recite from memory, reveal only what they need, and be told tomorrow what to revise | §9.2 Hide modes, §9.4, §10 |
| Anyone offline or on TV or an unsupported browser | Keep reading, listening, and using manual hide and reveal | §9.1 table, §8 |

### How we judge it

The app has no analytics SDK and this feature does not add one. Success is judged from what we can observe without tracking people:

- Phase 3 device checklist passes on both phones (§11).
- Sentry shows no new crash group under the tag `area: quran-practice`, and engine-init failures stay under 2% of sessions that reach `started`. Counted from `failed` events reported with a stable code only (§10 Privacy).
- No store review or in-app report (`settings/my-reports.tsx`) says the listener marked a correct recitation as wrong. One credible report of that turns confirmed-mismatch UI off until it is understood (§20 kill switch).
- Reader cold-open time and the web `__common` chunk size do not move (§13).

---

## 2. What already exists

Extend these. Do not replace them.

| Capability | Where | Notes |
|---|---|---|
| Surah index, search, continue reading | `apps/app/src/app/quran/index.tsx` | Fuse search via `searchSurahList`. Layouts: ayah, page, mushaf. |
| Ayah reader | `apps/app/src/app/quran/[surah].tsx`, `components/quran/ayah-reader.tsx` | Bookmarks, last read, repeat, translation, transliteration, hifz cycle. |
| 604-page mushaf | `quran/pages.tsx`, `quran/page/[page].tsx`, `page-layout-renderer.tsx`, `qcf-font-cache.ts` | NF-1.11. Practice highlighting does not use mushaf glyphs in v1. |
| Juz, bookmarks, search, khatm | `quran/juz.tsx`, `bookmarks.tsx`, `search.tsx`, `khatm.tsx` | Khatm is the reading plan (NF-1.8). |
| Hifz marks | `stores/hifz-store.ts`, `quran/hifz.tsx` | `surah:ayah` → `"review" \| "memorized"`. Cycle is none → review → memorized → clear. Synced as blob `hifz`. |
| Arabic text | `packages/shared` types + `apps/app/src/lib/quran.ts`, `quran-meta.ts`, `quran-loader.ts` | Uthmani, 114 surahs, 6,236 ayahs, juz, hizb, page. Bundled. Tanzil via `risan/quran-json`. Do not hand-edit JSON. |
| Translations | `api/quran-remote.ts`, `QuranRepository` prefs | Bundled Pickthall / Yusuf Ali / Jalandhry. Others cache-first from `fawazahmed0/quran-api`. |
| Tafsir | `api/quran-tafsir.ts` | spa5k + Siraj, on demand. |
| Reciters and playback | `lib/quran-audio.ts`, `providers/audio-player-provider.tsx` | `expo-audio`. everyayah.com per-ayah MP3. Eight reciters. Background audio is already an iOS background mode. |
| Word-by-word | `api/quran-words.ts`, `components/quran/word-by-word.tsx` | Quran.com v4 `text_uthmani` + gloss + per-word audio URL. Cache: `QuranStudyCacheRepository`. |
| Word highlight while audio plays | `lib/quran-word-timing.ts`, `fetchSurahWordSegments` | Quran.com `chapter_recitations/{id}/{surah}?segments=true`, shifted to ayah-local ms. Even split if segments are missing. |
| Tajweed colours | `api/quran-tajweed.ts`, `components/quran/tajweed-text.tsx` | alquran.cloud `quran-tajweed` markup. Rule ids in `packages/shared/src/types/quran.ts` (`TajweedRuleId`). This is colouring, not pronunciation scoring. |
| Learn Qur'an | `apps/app/src/app/learn-quran/*`, `lib/quran-guide.ts` | Lessons for letters, pronunciation pairs, tajweed, memorization plans, daily lessons. Content types in `packages/shared/src/types/quran-guide.ts`. Progress blob: `quran_guide_progress`. |
| Verse lookup from typed text | `lib/quran-verse-detector.ts` | Fuzzy match on bundled text. Not audio. |
| Offline caches | `settings/offline-data.tsx`, `quran-cache-repository.ts`, `lib/cache-manager.ts` | Editions and study payloads. |
| Audio cache | `lib/audio-cache.ts`, `public/expo-service-worker.js` | Every remote clip goes through `resolveCachedAudioUri`. Native keeps files in `documentDirectory/munib-audio/` (via `expo-file-system/legacy`). Web keeps them in the Cache Storage bucket `munib-audio-v1`. An ayah that has been played once replays offline. This is the storage pattern the model files follow (§7). |
| Error reporting | `lib/sentry.ts` (`captureAppException`) | Sentry, on in production. There is no analytics SDK and no remote feature flag. |
| Guest + optional cloud sync | `apps/app/src/sync/blob-sync.ts`, `apps/api/src/sync/dto/sync.dto.ts` | Guest-first. Signed-in sync is last-write-wins JSON blobs. API is NestJS + TypeORM. Admin Drizzle mirrors that database. There is no client Supabase SDK to extend. |
| Theme, i18n, TV | `useTheme()` / `useThemeTokens()`, 24 locales, `isTV()` | See `apps/app/AGENTS.md`. |
| Native modules | `apps/app/modules/munib-*` | Expo modules already used for Live Activity, Wear, external commands. New native code follows that layout. |
| Mic today | `app.json` | `expo-audio` has `microphonePermission: false`. `expo-speech-recognition` explains the mic as "dictate custom adhkar". Recitation needs its own prompt and must not start at launch. |
| PCM capture | `expo-audio@57.0.3` `useAudioStream` / `AudioStream` | Already installed, not yet used. Native delivers `onBuffer({ data: ArrayBuffer, sampleRate, channels, timestamp })` as `float32` or `int16`. The requested `sampleRate` is a hint and the delivered rate may differ. **On web `useAudioStream` returns `{ stream: null }`**, so web needs its own capture (§7). |
| Audio session | `providers/audio-player-provider.tsx` | Sets `setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: "doNotMix" })` once. Nothing in the app records today, so nothing switches the session to record and back. |

Stack that matters for this work:

- Expo SDK **57** (`expo ~57.0.8`), React 19.2, `react-native-tvos@0.86.0-2`, New Architecture on (`newArchEnabled=true`), React Compiler on.
- Web is a Metro static export (`web.output: "static"`) hosted on Vercel. `apps/app/vercel.json` sets no `Cross-Origin-Opener-Policy` or `Cross-Origin-Embedder-Policy`, so the page is not cross-origin isolated and `SharedArrayBuffer` is unavailable. ONNX Runtime Web therefore runs single-threaded wasm (§7).
- pnpm workspace with patched Expo packages in `patches/` (including `expo-file-system@57.0.1`). A new native dependency has to survive `pnpm install --frozen-lockfile` and the Android build-from-source list in `apps/app/package.json`.
- Product app only (`apps/app`). Marketing announces it (owner decision, §14). Admin gets a read-only aggregates page (module 15, `/quran-practice`, owner decision 17 Nov 2026).
- Local store is AsyncStorage via `DB_KEYS` + `KEY_PERSISTENCE` (`apps/app/src/db/keys.ts`). `userData` is backed up and wiped on reset. `cache` is not backed up. `deviceLocal` is wiped on reset and not backed up.
- Tests for the app are Jest. No Playwright or Maestro in CI.
- Religious strings come from datasets. UI strings come from `apps/app/src/i18n/en.json` and the i18n guard.

Entry points to extend, not duplicate:

- Qur'an index quick actions already link Learn Qur'an, khatm, and hifz (`quran/index.tsx`).
- Library search aliases already include `quran` and `learnQuran` (`lib/library-menu.ts`).

---

## 3. Corrections to the previous draft

The previous draft is not the spec. These are the decisions that replace it.

| Previous assumption | Decision |
|---|---|
| Build a new Qur'an home, reader, bookmarks, audio, and search. | Keep the current reader. Add practice, revision, and session summary beside it. |
| Inspect Supabase and add Drizzle migrations. | Persist companion state as AsyncStorage blobs. Register them on the existing blob-sync whitelist. No new tables. |
| Require an account. | Guest mode is the default, same as the rest of the app. |
| Tilawa and Quran Lab both "detect mistakes" and both run as equal providers. | Tilawa aligns recitation to ayahs and words. Quran Lab returns acoustic heads and does not compare them to an ayah. Different jobs. v1 ships Tilawa only. |
| Invent shared events the model does not emit, then hope the adapter fills them. | The app reducer consumes a small event union. The adapter may emit a confirmed mistake only when the pinned engine build actually reports one. |
| Green / red on every word from confidence. | Low confidence is uncertain (amber). Red is only a confirmed mismatch. |
| One implementation for iOS, Android, web, and TV. | Web uses `onnxruntime-web`. Phones use `onnxruntime-react-native` inside a dev build. TV has no engine. |
| Download models automatically. | Nothing downloads until the person taps Download on Settings → Qur'an practice, or the text button on the practice hub. Reading never waits on a model. |
| Store recordings and word-level timelines forever. | Store a short session summary and per-ayah counts. No PCM. |
| SM-2 from day one, and auto "memorized". | Fixed review ladder. The existing hifz cycle stays the only way to mark memorized. |
| Quran Lab "verifies tajweed rules". | Colouring and lessons stay as they are. A later pronunciation mode may score only heads the loaded model's calibration marks as reliable. |
| A pile of `docs/quran-companion/*.md` before any code. | This file is the spec. Add a short note to this file when a **prove on device** item is resolved. Do not split the plan. |

---

## 4. Engine choice

### 4.1 Tilawa — v1 recitation engine

Sources: [github.com/yazinsai/tilawa](https://github.com/yazinsai/tilawa), [@tilawa/core on npm](https://www.npmjs.com/package/@tilawa/core) (0.4.0 at review time; 1.0 is a new API on `@next` — pin one line and do not mix them).

What it is:

- TypeScript core, no runtime dependency. The app injects ONNX Runtime.
- Input: **16 kHz mono `Float32Array`**, streamed.
- Default engine: Zipformer2-CTC, int8 ONNX, about **66 MB**, 251 tajweed-phoneme tokens.
- Alternate engine: FastConformer, about **88 MB**, text CTC.
- React Native cannot pass the model as an `ArrayBuffer`. Copy the file to the documents directory and create the session from that path, passing `session` + `Tensor` from `onnxruntime-react-native`.
- Documented outputs (`WorkerOutbound`): `verse_match`, `verse_candidate`, `word_progress` (`word_index`, `total_words`, `matched_indices`), `raw_transcript`, `final_sequence`.
- `createRecognitionSession` / `createZipformerSession`. `feed()`, `stop()` / `flush()`, `reset()`.
- Correction mode (`setMode("correction")`) adds structural rules on the Zipformer path (omission / substitution style checks). Tracking mode does not run them. **Prove on device** against the pinned `.d.ts`: confirm the exact event names and fields before painting a word red. If the pinned build only exposes `word_progress`, v1 follow-along ships and confirmed-mistake UI stays off.

What it is not:

- A tajweed judge. Phoneme error rate on Quran Lab's 600-clip set is about 3.6% for the int8 Zipformer. That is not a licence to tell a user their madd or ghunnah was wrong.
- A React Native library that links itself. `onnxruntime-react-native` is a native module. It needs a dev client (`expo run:ios` / `expo run:android`), not Expo Go. TV prebuild must stub it the same way `src/lib/tv-stubs/expo-speech-recognition.ts` stubs speech.

Licence split (do not collapse this):

- Package **code**: MIT.
- Default Zipformer weights and the phoneme lexicon (`zipformer_quran.json` and derivatives of Quran Lab `zipformer_p-arabic-v3`): **NPL-1.2**. Not MIT. Non-commercial, share-alike. Do not charge for the model or for a feature it powers. Do not put that feature behind ads. Keep `NPL-1.2.txt` beside the downloaded files.
- FastConformer weights: NVIDIA CC-BY-4.0. Code path stays MIT. This is the only engine in this design that could remain if the app later needed a commercial licence. Mistake rules were validated on the Zipformer (a0w) model, so FastConformer is a follow-along fallback until a device run shows otherwise.

Repo licence is PolyForm Noncommercial 1.0.0 (`LICENSE`). A free build may ship the NPL Zipformer. A paid app, a paywalled practice mode, or ads on practice would violate NPL-1.2. If that product change is ever proposed, remove the Zipformer and the Quran Lab SDK first.

Distribution:

- Do not commit `.onnx` weights or the NPL lexicon to git.
- Download on demand into the app documents directory (native) or Cache Storage (web). See §7 Model files.
- Verify size and a published checksum before load.
- The download URL, byte size, checksums, and asset revision for each engine are constants in `apps/app/src/constants/recitation-models.ts`, pinned to a release tag, never to `latest` or a branch. There is no remote catalogue. A newer model reaches people only through an app release that changes those constants. "Update available" (§9.5) means the stored manifest's `version` differs from the pinned constant.
- **Prove in Phase 2:** where the engine's word list comes from. If `@tilawa/core` bundles `quran.json` or the phoneme lexicon inside the npm package, that NPL-1.2 data ships in the JS bundle. That is allowed for this free build, but then `NPL-1.2.txt` must ship in the app as well and the credits entry is required from the first release that includes the package. Check that the lexicon is only loaded through the lazy practice chunk (§7). If the lexicon is a separate download, it is fetched and checksummed with the model.
- The host is a third party (the Tilawa release host). If it is unreachable or rate-limited the Listener card shows "Needs another try" with the "No connection" copy. Do not mirror the NPL weights to our own storage without re-reading NPL-1.2's share-alike terms. Record the decision in §17 if a mirror is ever added.
- Download, replace, and delete happen on Settings → Qur'an practice ([§9](#9-experience-and-settings)). Offline data does not wipe the model as part of "Clear all".
- Credit Tilawa, Tanzil, and Quran Lab on that settings screen. The practice session itself uses plain words ("on-device listener").

### 4.2 Quran Lab TajweedFormer — not in v1

Sources: [sdk.quranlab.ai](https://sdk.quranlab.ai/), [feedback](https://sdk.quranlab.ai/docs/feedback), [reference](https://sdk.quranlab.ai/docs/reference), [licence](https://sdk.quranlab.ai/licence).

Verified limits:

- SDKs: Android Kotlin (`ai.quranlab:tajweedformer`), Apple Swift package, web npm (`@quran-lab/tajweedformer`), Windows/Linux C. **No React Native package.** A phone integration is an Expo module that wraps the Kotlin and Swift SDKs, plus the web package for Expo web. That is a separate project from Tilawa.
- Four calls: client, model, listen, read. `listen()` takes the microphone itself. A session ends in the background.
- First launch needs a developer key and a network download of about **56.5 MB** (larger with an NPU program). Files are verified against a signed manifest. Later starts work offline until the server refuses the key or the app. The operator can pause the app remotely; installs then delete the model.
- Android SDK pulls Play Integrity and extra manifest permissions (`INTERNET`, WorkManager, foreground service). Audit these before merging.
- The SDK does **not** say a word was wrong. The app would have to align `model.reference` for a surah/ayah against CTC log-probabilities. Quran Lab ships no scorer.
- V4 calibration, from their own docs: gemination marked **off**, qalqalah **experimental**, `attr_ghunna` and `attr_tafkheem` have **no validated thresholds**, lazim madd is too thin to trust, phone and children's audio are the weak case. Greedy text is not evidence of a mistake.
- Weights cannot be extracted or redistributed outside the SDK. NPL-1.2 applies, including "no charge for a feature it powers".
- Audio leaves the device only if the learner agrees. That toggle stays off. Do not call any share API.

Phase 6 (committed, after v1) adds a pronunciation drill on an existing Learn Qur'an tajweed lesson. It may score a head only when that build's calibration marks the head reliable. Everything else stays "listen to the example and try again", which the lessons already support via `practiceAudio`.

### 4.3 Tarteel

UX reference only (follow-along, hide ayah, mistake colours, revision). Do not copy proprietary UI or models. QUL (`qul.tarteel.ai`) remains the enrichment catalogue already described in `docs/FREE_OPEN_SOURCE_DATA.md`. Per-resource licences still apply. Do not scrape quran.com or Tarteel.

---

## 5. Stop gates

Stop and report before writing the blocked code if any of these happen:

1. The pinned `@tilawa/core` typings do not match the event table in §4.1 (API moved).
2. `onnxruntime-react-native` does not link in an Expo SDK 57 dev build, or it breaks the TV prebuild even when stubbed.
3. `expo-audio` `useAudioStream` does not deliver usable PCM buffers on one of the two Phase 3 phones (dropouts, wrong channel count, or a rate we cannot resample to 16 kHz mono). See §7.
4. A licence check shows the Zipformer or Quran Lab SDK cannot ship inside this PolyForm-NC app.
5. Word alignment (§6) cannot map Tilawa `word_index` onto the words the reader shows for Al-Fatiha and 2:255.
6. Someone proposes charging for practice, ads on practice, or uploading audio by default.
7. `onnxruntime-react-native` does not load under the New Architecture on `react-native-tvos@0.86`, or its Android `.so` files are not 16 KB page-aligned (Google Play rejects the bundle).
8. Adding the ORT native libraries grows the release download by more than the budget in §13.

A failed gate 2, 7, or 8 blocks phones only. Web (Phase 2) and the manual hide and reveal modes (Phase 1) still ship.

Until gate 5 passes, the practice screen may show listening follow-along with the existing audio highlighter. It may not paint words red.

---

## 6. Word alignment

This is the correctness hazard. Four tokenizations exist and they are not the same string:

| Layer | Source | Used for |
|---|---|---|
| Ayah string | Bundled `Ayah.arabic` | Reader Arabic, search, integrity |
| Study words | Quran.com `QuranWord[]` (`text_uthmani`) | Word-by-word row, gloss, word audio |
| Engine words | Tilawa `quran.json` / phoneme lexicon | `word_index` in `word_progress` |
| Mushaf glyphs | QCF page layout | 604-page view only |

v1 practice UI highlights the **study-word row**, not mushaf glyphs. Build a pure function:

`alignPracticeWords(ayahArabic, studyWords, engineWords) → { engineToStudy: number[], studyToEngine: number[] }`

Rules:

- Compare after the same Arabic folding used by `normalize()` (defined in `src/lib/search-fuse.ts`, re-exported from `src/lib/search.ts`). It strips harakat and folds letter variants. Keep the displayed glyphs untouched. Import it from `search-fuse` so the practice chunk does not pull in the search index code.
- A many-to-one or one-to-many match is allowed (waqf marks, basmala, hamzat al-wasl, a word split differently).
- An unmapped study word stays neutral. Never guess a red mark onto it.
- Disconnected letters (for example 2:1, 19:1, 42:1–2) are written as one or two tokens and recited as letter names. Whatever the engine's word list does with them, the mapping must cover the whole study token. If it cannot, the token stays neutral and the ayah never produces a confirmed mismatch.
- Unit-test Al-Fatiha (1:1–1:7), Ayat al-Kursi (2:255), At-Tawbah 9:1 (no basmala), Al-Baqarah 2:1 (disconnected letters), the longest ayah 2:282 (length and performance of the function), and one ayah with a known waqf. Fixtures live next to the test, copied from the bundled JSON and from a saved Tilawa corpus excerpt. Do not fetch in the test.

Study words come from `fetchSurahWords` (Quran.com, cache-first). That call needs a network the first time. When the cache is empty and the device is offline, split bundled `Ayah.arabic` on whitespace and use those tokens as the study row. Gloss and per-word audio are absent in that fallback. Hear still uses `singleAyahTrack`. Do not block practice on the Quran.com request, and do not invent glosses.

Do not prepend a basmala. Bundled ayah 1 already includes it where the mushaf has it, and surah 9 does not. The reader text is the source of what the person sees.

Highlight state is a parallel array on the study words, same length, so the row does not reflow:

`idle | upcoming | matched | uncertain | confirmedMismatch | corrected`

Colours come from `tokens.status` (success, warning, danger) and the default text colour. Do not hardcode hex. Do not add a second legend that contradicts the existing tajweed legend. If tajweed colouring is on, practice state uses an underline or a small dot, not a second full-letter colour.

The word row is Arabic and lays out right to left in every app locale, including the LTR ones. Force the row direction on the container, the way `word-by-word.tsx` does, and do not rely on the app's `I18nManager` direction.

---

## 7. Audio

One capture owner per session. v1 owner is our recorder, feeding Tilawa. Quran Lab `listen()` is not called.

### Pipeline

1. User taps Start. If the listener is missing, the session opens in listen-only mode (§9). The microphone permission is requested only when they tap the mic on a session that has a ready model.
2. Capture sits behind one interface, `RecitationCapture` (`start(onChunk)`, `stop()`), with a file per platform (§8):
   - **iOS and Android:** `expo-audio` `AudioStream` (the object behind `useAudioStream`), requested as `{ sampleRate: 16000, channels: 1, encoding: "float32" }`. Permission comes from `requestRecordingPermissionsAsync()` in the same package. Each `onBuffer` gives an `ArrayBuffer` plus the **actual** `sampleRate` and `channels`. Never assume 16 kHz: read the delivered values on every buffer.
   - **Web:** `useAudioStream` is a no-op on web. Use `navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false, autoGainControl: false } })` and an `AudioWorkletNode` that posts Float32 frames. Request `new AudioContext({ sampleRate: 16000 })` and still read `context.sampleRate`, because Safari may ignore the request. Requires HTTPS, which the Vercel host provides. If `getUserMedia` or `AudioWorklet` is missing, web falls back to the listen-only row in §9.1.
   - **TV:** the `unavailable` capture. Never imported on a TV bundle.
3. `resample.ts` is a pure function: downmix interleaved channels to mono, then linear-resample to 16 kHz when the source rate differs. It carries the fractional position across chunks so chunk edges do not click. Feed 100–200 ms chunks into `session.feed()`. No whole-take buffer is kept, and nothing is written to disk. **Prove on device:** both phones deliver steady buffers with the screen on. Only if that fails (gate 3) add an Expo module under `apps/app/modules/munib-recitation-audio/`. Do not add a second player stack and do not revive `expo-av`.
4. The person finishes an ayah by tapping the mic again. Do not end the ayah on two seconds of silence. A hifz pause is normal. Tilawa's `tailSeconds` runs only inside that explicit `stop()`.
5. App background or a phone call stops the mic and leaves the session route open in the idle state (§9.2). Leaving the route (Back, End, or a different screen) disposes the engine and releases the recorder in `finally`. App Lock may cover the screen on resume. The mic stays stopped until they tap it again after unlock.
6. Stop the shared player from `audio-player-provider` before Hear and before the mic starts, so a mini-player that was already playing does not overlap the take. Playback of the reference ayah then uses `singleAyahTrack()` and the reader's chosen reciter. Word highlight during that playback uses `activeWordIndexAt()` plus `quranComRecitationId()` in `src/constants/tajweed.ts` (`RECITER_DIR_TO_QURAN_COM_ID`). Do not add a second reciter map.
7. Practice does not call `quranStore.setLastRead` or `recordProgress`. The reader's continue position stays where they were reading. The companion stores its own `lastPassage` (§10).

### Audio session

The player provider configures the session for playback once and nothing switches it today. Recording needs the opposite mode, and leaving it switched breaks the mini-player for the rest of the app.

- Before `capture.start()`: stop the shared player, then `setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true, shouldPlayInBackground: false, interruptionMode: "doNotMix" })`.
- After `capture.stop()`, and in the route's cleanup `finally`: restore exactly the mode `audio-player-provider.tsx` sets (`playsInSilentMode: true`, `shouldPlayInBackground: true`, `interruptionMode: "doNotMix"`, `allowsRecording: false`). Export that object from the provider file as a constant and use it in both places so the two cannot drift.
- Hear always restores the playback mode first. On iOS a session left in play-and-record routes the reciter to the earpiece.
- An interruption (call, Siri, another app taking the mic) ends the take the same way backgrounding does. The stream's `audioStreamStatus` event going to `isStreaming: false` without our `stop()` is treated as that interruption.
- Headsets and Bluetooth: use whatever input the OS routes. Do not add an input picker. Bluetooth hands-free input is 8 or 16 kHz and lower quality. That is another reason every buffer goes through `resample.ts`.
- A screen reader that speaks while the mic is live is captured with the recitation. While recording, do not post accessibility announcements. Queue them until the take ends (§8 Accessibility already delays the mismatch announcement to the end of the ayah).
- **Prove on device** in Phase 3: after a practice session, the mini-player plays through the loudspeaker at normal volume, lock-screen controls still work, and background playback still continues with the screen off.

### Model files

Manifest stored at a new `deviceLocal` key (not backup, not sync):

```ts
type RecitationModelManifest = {
  engine: "tilawa-zipformer" | "tilawa-fastconformer";
  version: string; // pinned @tilawa/core + asset revision
  fileName: string;
  bytes: number;
  /** Checked on web with `crypto.subtle.digest`. */
  sha256: string;
  /** Checked on native with `getInfoAsync(uri, { md5: true })`, which hashes in native code. */
  md5: string;
  /** Absent when the pinned package bundles its own word list (§4.1). */
  lexiconFileName?: string;
  downloadedAt: string;
};
```

Storage is one interface, `RecitationModelStore` (`getInfo`, `download(onProgress, signal)`, `delete`, `resolveForEngine`), with two implementations. It mirrors `lib/audio-cache.ts`, which already solved native files versus web Cache Storage. `expo-file-system` has no usable web implementation for this.

- **Native** (`model-store.native.ts`): `expo-file-system/legacy`, the same import the audio cache uses. Directory `${documentDirectory}recitation-models/`. Download with `createDownloadResumable` so progress is reported and Cancel can stop it. Write to `fileName + ".part"` and rename after the checksum passes, so a half-written file is never loaded. Before starting, call `getFreeDiskStorageAsync()` and refuse with the "Not enough space" copy when free space is below twice the model size. Verify with `getInfoAsync(uri, { size: true, md5: true })`. Do not read the file into JS to hash it: a 66 MB base64 string will exhaust memory on the phones this feature is meant for. `resolveForEngine` returns the file path for the ORT session.
- **Web** (`model-store.web.ts`): Cache Storage bucket `munib-recitation-model-v1`. It must be a different bucket from `munib-audio-v1`, because Offline data → Clear audio deletes that whole bucket. Fetch with a `ReadableStream` reader for progress, verify `sha256` with `crypto.subtle`, then `cache.put`. `resolveForEngine` returns the `ArrayBuffer`. Call `navigator.storage.persist()` after a successful download and ignore a refusal. Browsers may evict the file anyway: when the manifest says Ready and the cache entry is gone, reset the manifest to Not downloaded without an error message. The service worker does not need to know about this bucket. Do not add the model host to its fetch handler.
- When the practice store first loads, delete any `.part` file and any model file the manifest does not reference. A killed app otherwise leaves 66 MB behind with no UI to remove it.
- The download runs only while the app is open. If the OS suspends the app, the job fails and the card shows "Needs another try". Try `downloadResumable.resumeAsync()` once on the next foreground. If that throws, start over. Do not add a background task or a foreground service for this.
- On iOS the documents directory is included in device backups, as the audio cache already is. Keep the same behaviour for now, and see decision D6 in §21.

Microphone permission strings. iOS has a single `NSMicrophoneUsageDescription`. `app.json` currently sets `expo-audio` `microphonePermission` to `false` and `recordAudioAndroid` to `false`, while `expo-speech-recognition` says the mic is for dictating adhkar. Whichever plugin writes the plist last becomes the App Store string. Capture goes through `expo-audio` (pipeline step 2), so in the Phase 3 change:

- Set `expo-audio` `microphonePermission` to the shared sentence and `recordAudioAndroid` to `true`.
- Set `expo-speech-recognition` `microphonePermission` to the **same** sentence. Suggested English: "Munib Tracker uses the microphone to follow your Qur'an recitation and to dictate custom adhkar. Audio stays on your device."
- Leave `speechRecognitionPermission` as it is. Qur'an practice does not use the OS recogniser.
- Do not add `android.permission.FOREGROUND_SERVICE_MICROPHONE`. Capture never runs in the background.
- The TV builds must not gain a microphone permission. Check the prebuilt TV `Info.plist` and `AndroidManifest.xml` after this change (§19 TV rows).
- These are native config changes. They need a new store build and cannot ship over the air.

Wi-Fi detection uses `expo-network` `getNetworkStateAsync()` (`NetworkStateType.WIFI`), the same package as `use-is-online.ts`. Do not add NetInfo. Cellular, unknown, or a failed network read shows the "Use mobile data" confirm when the Wi-Fi-only toggle is on. The download job lives in the practice store, so leaving the screen does not cancel it. Progress stays visible on the practice hub and on the settings screen. Copy states the size (about 66 MB, or about 88 MB for the alternate) and that the file stays on device.

Lazy-load the engine from the practice route only (`import()`), so the home bundle and `__common` stay clear. Same rule as `docs/PROFILING.md` for `quran-loader`. Do not import ONNX from `app-providers.tsx` or the Qur'an index.

Web runtime files. `onnxruntime-web` loads its `.wasm` binaries at run time from a URL. Serve them from our own origin: a small script copies the files for the pinned ORT version from `node_modules` into `apps/app/public/ort/` before `build:web`, and that folder is git-ignored. Point `ort.env.wasm.wasmPaths` at `/ort/`. Do not load them from a public CDN: the listener would then depend on a host the privacy card does not name. Because the site is not cross-origin isolated (§2), set `ort.env.wasm.numThreads = 1`. Do **not** add COOP/COEP headers to `vercel.json` to get threads. `require-corp` would block the cross-origin recitation audio, fonts, and CDN JSON the rest of the app loads. Add a long-lived `Cache-Control` header for `/ort/*` in `vercel.json`.

Inference runs off the JS interaction path. On web, use a Worker if `onnxruntime-web` allows it in this Expo web build. If a Worker cannot load the wasm, run on the page and drop frames rather than blocking taps. On native, `onnxruntime-react-native` runs inference in native code, but `onBuffer`, resampling, and the Tilawa decoder run on the JS thread. Keep them allocation-light and never run two `feed()` calls concurrently: queue chunks and drop the oldest when the queue passes two seconds of audio. **Prove on device** that a mid-range phone stays responsive during Al-Fatiha. If it does not, ship push-to-recite (record, then decode) instead of live colouring, and say so in the UI.

---

## 8. App architecture

Logic that does not need a microphone lives in pure TypeScript so Jest can cover it.

```
apps/app/src/lib/quran-companion/
  types.ts                 session, word state, summary
  align-words.ts           §6
  reduce-session.ts        events → word states + summary
  map-tilawa-event.ts      WorkerOutbound → CompanionEvent | ignore
  revision-schedule.ts     ladder
  passage.ts               surah/ayah range helpers on top of quran-meta
  due-queue.ts             §10 queue order and daily cap, pure
  availability.ts          isPracticeAvailable(): !isTV(), one place for every entry point to ask
  error-codes.ts           stable codes → i18n keys (§9.5), also the Sentry tag value

apps/app/src/lib/quran-companion/engine/
  types.ts                 RecitationEngine interface
  tilawa.ts                create engine, feed, stop, dispose
  tilawa.web.ts            onnxruntime-web
  tilawa.native.ts         onnxruntime-react-native
  unavailable.ts           TV, missing model, failed init

apps/app/src/lib/quran-companion/audio/
  types.ts                 RecitationCapture interface
  capture.native.ts        expo-audio AudioStream
  capture.web.ts           getUserMedia + AudioWorklet
  capture.ts               unavailable fallback (TV)
  resample.ts              downmix + resample to 16 kHz, pure
  audio-mode.ts            enter and leave record mode (§7 Audio session)

apps/app/src/lib/quran-companion/model/
  types.ts                 RecitationModelStore interface, manifest
  model-store.native.ts    expo-file-system/legacy
  model-store.web.ts       Cache Storage bucket
  download-job.ts          state machine: idle → downloading → verifying → ready | failed

apps/app/src/constants/recitation-models.ts   pinned URL, bytes, checksums, version per engine

apps/app/src/stores/quran-practice-store.ts
apps/app/src/stores/quran-memorization-store.ts
apps/app/src/stores/quran-companion-prefs-store.ts
apps/app/src/db/repositories/quran-practice-repository.ts
apps/app/src/db/repositories/quran-memorization-repository.ts
apps/app/src/db/repositories/quran-companion-prefs-repository.ts

apps/app/src/app/quran/practice.tsx          hub + one-tap start
apps/app/src/app/quran/practice/session.tsx  live
apps/app/src/app/quran/practice/summary.tsx
apps/app/src/app/quran/revision.tsx
apps/app/src/app/settings/quran-practice.tsx model + practice settings

apps/app/src/components/quran/practice-word-row.tsx
apps/app/src/components/quran/practice-dock.tsx
apps/app/src/components/quran/practice-session.tsx
apps/app/src/components/quran/revision-queue.tsx
```

The repositories follow the existing blob pattern (`readJSON` / `writeJSON` under one key) and are exported from `apps/app/src/db/index.ts`. The stores use `createStore` and expose a `useEnsure…Loaded` hook like `hifz-store.ts`. None of them is loaded from `app-providers.tsx`.

### Route contract

`typedRoutes` is on, so the params are part of the spec. All are strings in the URL and are validated on entry. An invalid or out-of-range value falls back to the hub, never to a crash or an empty session.

| Route | Params | Notes |
|---|---|---|
| `/quran/practice` | `surah?` | Preselects a surah (used by Learn Qur'an memorization plans). |
| `/quran/practice/session` | `surah`, `from`, `to`, `mode?`, `source?` | `from` and `to` are ayah numbers in one surah, clamped with `passage.ts`. `mode` defaults to `defaultMode`. `source` is `hub`, `reader`, or `revision` and only decides where Back and Done return to. |
| `/quran/practice/summary` | none | Reads the just-finished summary from the practice store. Opened cold (deep link, reload) with no summary in memory, it redirects to the hub. |
| `/quran/revision` | none | |
| `/settings/quran-practice` | `from?` | `hub` makes Back return to the hub. |

A passage never crosses a surah boundary. "Next 5" stops at the last ayah of the surah. A revision sitting is a list of single-ayah passages, held in the practice store and not in the URL.

`RecitationEngine`:

```ts
type RecitationEngine = {
  id: "tilawa-zipformer" | "tilawa-fastconformer";
  ready: boolean;
  start(passage: { surah: number; ayahStart: number; ayahEnd: number }): Promise<void>;
  feed(pcm16kMono: Float32Array): void;
  stop(): Promise<void>;
  dispose(): Promise<void>;
  subscribe(listener: (event: CompanionEvent) => void): () => void;
};
```

`CompanionEvent` (app-owned, not a copy of Tilawa's union):

| Event | When the adapter may emit it |
|---|---|
| `started` | Engine accepted the passage |
| `position` | `word_progress` or `verse_match` mapped through §6 |
| `uncertain` | Candidate or low confidence, no structural fault |
| `confirmedMismatch` | Only a documented correction-mode fault (missing, wrong, or extra word) after alignment |
| `corrected` | A previously mismatched study word later matches in the same take |
| `completed` | `stop()` returned a summary |
| `failed` | Init, mic, or runtime error with a stable code |

`map-tilawa-event` drops unknown messages. It does not invent `confirmedMismatch` from a short `matched_indices` list. A word that has not been reached stays `upcoming`. A word the tracker skipped inside the spoken span can become `confirmedMismatch` with reason `missing` only after the correction-mode proof in §5. Until that proof, skipped words stay `uncertain`.

Extra words (spoken but not in the ayah) appear in the summary list, not as a fake extra glyph inside the ayah.

Modes on one session screen:

| Mode | Text | Engine |
|---|---|---|
| Follow | Full passage visible | Tracking. Colours show match / not yet / uncertain. No red. |
| Check | Full passage visible | Correction mode when the proof passes; otherwise Follow. |
| Hide words | Chosen study words covered | Same engine as Check. Reveal one, or reveal all. |
| Hide ayahs | Ayah covered until the user reveals or finishes | Same. |
| Revision | Queue item, hide ayahs by default | Same. |

Feedback timing, default mode, and the model download live in [§9](#9-experience-and-settings). The session never opens a modal while the person is still reciting. A confirmed mismatch may offer "hear the word" via the existing `QuranWord.audioUrl` when that URL is cached. If it is not cached, offer the whole ayah through `singleAyahTrack`. Hearing the reference stops the microphone first.

### UI integration

- Add one quick action on `quran/index.tsx`: Practise → `/quran/practice`. If ayahs are due, the subtitle is the due count ("3 to revise"), and the action opens the revision queue. Otherwise it opens the practice hub.
- From the ayah reader action sheet (`ayah-action-sheet.tsx`), add "Practise this ayah". It opens the session directly in the saved default mode, with that ayah as a one-ayah range. No setup form in between.
- Extend `quran/hifz.tsx` with a row into `/quran/revision` when anything is due or marked. Do not replace the manual cycle.
- Learn Qur'an memorization plans (`learn-quran/memorization.tsx`) link into practice with `surahNumbers` already on `QuranGuideMemorizationPlan`, opening the hub with that surah selected.
- Tajweed lessons stay at `learn-quran/tajweed/[id].tsx`. No pronunciation score in v1.
- Settings tab: a `SettingsRow` "Qur'an practice" → `/settings/quran-practice`, hidden when `isTV()`. Value text is "Ready", "Not downloaded", or the download percent.
- TV: `isTV()` hides Practise, the mic button, the settings row, and model download. The rest of Qur'an is unchanged.
- Web: the same screens render. If wasm fails, the hub's primary action becomes Listen (existing player) and the settings screen says this browser cannot run the listener.
- Strings: new `quranCompanion` namespace in `en.json`. Then `node scripts/i18n/merge-missing-keys.mjs`. Phase 1 Arabic and Urdu in the same change. Run `pnpm --filter app test -- i18n`. Terminology follows `apps/app/AGENTS.md` (Qur'an, Salah, and the rest of that table).
- Layout uses `ScreenLayout`, `Card`, `SettingsRow`, `ToggleRow`, `Button`, `ConfirmDialog`, `PressableScale`, `useThemeTokens()`, logical margins, `useChevronForward()`. Arabic lines use `compactArabicTextStyle` / `reading-typography`. No new colour tokens unless an existing status token cannot express "not yet reached" — in that case use the muted text colour, not a new palette.
- Accessibility: the mic control is a labelled button with `accessibilityState.selected` while recording, at least 64pt, sitting in the bottom dock above `useContentBottomInset()`. Word state is in `accessibilityLabel` ("matched", "not sure", "try again"), not colour alone. Reduced motion already exists; scroll the active ayah into view without a bounce, and do not pulse highlights. Announce a confirmed mismatch after the ayah, not on every frame.

### Session reducer

`reduce-session` is a pure function of `(state, event) → state`. The store persists only when the session completes or the app backgrounds.

Summary stored when the session completes. The screen that shows it is §9.3: the next action comes first, and the counts are a caption. Do not show a percentage.

- Passage reference (surah, ayah range) and mode.
- Duration.
- Counts: matched, uncertain, confirmed mismatch, corrected, not reached.
- Engine id and version.
- Ayahs to try again: those with a confirmed mismatch, else those with uncertain words. If the engine cannot confirm mismatches, the list is "not sure" only, and the copy says the listener was unsure.

---

## 9. Experience and settings

Practice should feel like the reader with a microphone, not like a test. One primary action per screen. The person can always fall back to listening with the reciter they already use.

### 9.1 Practice hub

Route: `/quran/practice`. `ScreenLayout` title "Practice". Header trailing control opens `/settings/quran-practice`.

What the hub shows, in order:

1. **Download in flight**, only when a download is running. One line: name, size done, percent, and "Manage". Tapping it opens settings. Leaving the hub does not cancel the download.
2. **Revise**, only when the due queue is non-empty. Card title is the count ("3 ayahs to revise"). Primary button "Start revision" opens the queue capped by the daily limit in settings. Caption under it: how many are left after today's cap ("12 more on other days").
3. **Continue**. Surah name, ayah range, and the saved mode. One full-width **Start** button. This is the default primary action when nothing is due.
4. **Range**, a single row of pills, one selected: This ayah, Next 5, This surah. "This page" appears only when the reader layout is page or mushaf and a page is known. The choice is remembered in prefs.
5. **Mode**, a horizontally scrolling row of pills, one selected: Follow, Check, Hide words, Hide ayahs. The selected pill is the default for the next session, including "Practise this ayah" from the reader. Four pills in a `SegmentedControl` will not fit a phone, so this is a scroller, not a segment.

A short caption under Start states the listener in plain language:

| Listener | Caption | Start does |
|---|---|---|
| Ready | "The listener stays on this device." | Opens the session |
| Missing, online | "Download the listener to follow your voice. You can still listen." | Start still opens the session in listen-only Follow. A text button "Download listener (66 MB)" sits under the caption, and also on the settings screen. |
| Missing, offline | "The listener needs a connection to download. Listening still works." | Same listen-only session. No download button. |
| Failed | "The listener did not start. You can still listen." | Listen-only. "Try again" lives on the settings screen, not as a second primary here. |
| Web wasm unavailable | "This browser can't run the listener." | Start is labelled Listen and uses the existing player. |

Check, Hide words, and Hide ayahs need the listener. If it is not ready, choosing one of those pills does not block the hub. Start explains, in the caption, that this mode will show the text for manual reveal and will not mark words. Follow is the listen-only path. Do not send the person through a download wall before they have heard an ayah.

First visit, until `coachDismissed` is set: one caption above the dock on the first session, "Read the ayah, then tap the microphone and recite." It goes away after the first completed session. No multi-step tour.

Empty memorization and an empty history are not error screens. The hub simply has no Revise card.

### 9.2 Session

Route: `/quran/practice/session`.

The ayah is the screen. Arabic uses the reader's font size and the existing reading typography. Translation and transliteration follow the practice prefs, defaulting to the reader's current toggles the first time, then remembering the practice-specific choice.

Tajweed colouring is **off** during practice so a word's practice mark stays readable. The settings screen can turn it back on. When it is on, practice state is an underline or a dot under the word, not a second fill colour (§6).

One ayah is on screen at a time even if the range is longer. A caption shows "Ayah 2 of 5". The next ayah is a swipe or the Next control after this one settles. Do not render the whole surah and auto-scroll under the finger while the person is reciting. Auto-scroll within a long ayah only moves when the active word is outside the visible area, and only when reduced motion is off.

Bottom dock, fixed, above the content inset. At most four controls:

| Control | Role |
|---|---|
| Hear | Secondary. Stops the mic, plays the reference ayah, then returns to the idle mic. |
| Microphone | Primary, 64pt. Idle label "Start". Recording label "Listening" and `selected`. Tap again to finish this ayah. |
| Reveal | Secondary, hide modes only. Reveals the next hidden word, or the ayah. Long-press reveals the rest of this ayah. |
| End | Text button. Finishes the range and opens the summary. |

No other buttons in the dock, with one exception added in the UX pass: on windows at least 768 pt wide, "Reveal all" gets its own button so the long-press is not a hidden gesture for mouse users. Settings stay in the header (the practice toolbar's gear, §23).

Word marks update like this (the `feedbackTiming` pref):

| Timing | Default for | What the person sees |
|---|---|---|
| `ayah` | Follow, Check, Hide, Revision | The current word uses the accent underline while they speak. Matched words settle quietly. A confirmed mismatch waits until the ayah ends, then one line under the ayah: "Try 2 words again", with Hear and Retry. The take is not paused mid-word. |
| `live` | Off | The mismatch underline appears as soon as the engine confirms it. Still no modal and no sound effect. |
| `end` | Off | Only the current-word underline during the take. Marks appear on the summary. |

"Try again" is the word in the UI. Do not use "wrong", "error", or a score.

A self-correction in the same ayah clears that word's mismatch before the line under the ayah is shown, so a fixed word never appears in the "try again" line.

Haptics on a settled match go through `triggerHaptic("light")` in `src/lib/haptics.ts`, which already follows Settings → Haptics. Do not import `expo-haptics` directly. One light tap per word, not per audio frame.

Keep the screen awake while this route is focused and `keepAwake` is on, with a tag of its own next to `lib/audio-keep-awake.ts` (`expo-keep-awake` is already a dependency). Release it on blur.

If the engine fails mid-session, keep the text up, show one caption ("Listening stopped. You can reveal the words and continue."), and leave Reveal working. Do not pop an alert with an engine code. The code is logged and the settings screen can say "Did not start" with Try again.

Backgrounding or a phone call stops the mic, keeps the partial summary, and returns to this screen in the idle state when they come back. Do not auto-start the mic on resume.

Layout. On a wide screen (tablet, desktop web) the ayah column keeps the reader's maximum line width and is centred. The dock stays at the bottom and does not stretch into a sidebar. Check landscape on a small phone: the ayah must still be visible above the dock, so the dock collapses to icon-only controls when the window height is under 420pt.

Permission. The first tap on the mic shows the OS prompt. If the person denies it, the session stays where it is in listen-only, and the caption reads "Microphone is off for Munib Tracker. You can still listen." with a text button to the OS settings. Do not ask again on every tap: after a denial the mic button opens that caption instead of re-requesting.

Listen-only sessions (no model) hide the mic and make Hear the primary control. Hide modes still reveal by tap. The summary does not invent match counts. It says they listened, and it does not move the review ladder.

### 9.3 Summary

Route: `/quran/practice/summary`.

The first thing on the screen is the next action, not the statistics.

| Situation | Primary button |
|---|---|
| This ayah had words to try again | "Try this ayah again" |
| Range has a later ayah | "Next ayah" |
| Range is finished and the queue has more due today | "Next revision" |
| Nothing left | "Done", which returns to the hub |

Secondary text button: "Hear this ayah". Counts sit in a caption row: matched, not sure, try again, not reached. When the engine cannot confirm mismatches, omit the try-again count and say "The listener was not sure about N words."

"Mark memorized" is a text button, shown only when the ladder in §10 says the offer is due. It is never the primary button. Tapping it runs the existing hifz transition and confirms with the same dialog the reader already uses.

No confetti, streak flame, or percentage that reads as a grade.

### 9.4 Revision sitting

`/quran/revision` is the queue. The primary button starts a sitting of at most `dailyRevisionLimit` ayahs (default 10), overdue first. Each item is one session in Hide ayahs unless the user has set another default mode.

The sitting chrome is "2 of 10" plus the caption for the rest of the backlog. Skip moves to the next ayah without a lapse. Hear and Reveal work as in §9.2. Ending early is a normal Done, not a failure.

A row can be removed from the queue ("Not now") without deleting the hifz mark. That sets `nextReviewAt` to tomorrow.

### 9.5 Settings screen

Route: `/settings/quran-practice`. Back returns to Settings, or to the practice hub when opened from the hub header (`goBackOrReplace` already does the right thing if the caller passes the fallback).

Use the same building blocks as the other settings screens: `ScreenLayout`, `Card`, `SectionHeader`, `SettingsRow`, `ToggleRow`, `Button`, `ConfirmDialog`. Hidden entirely on TV.

The settings tab row (`apps/app/src/app/(tabs)/settings.tsx`) sits with the other Qur'an-adjacent rows, near Offline data:

- Title: "Qur'an practice"
- Subtitle: "Listener, feedback, and revision"
- Value: "Ready", "Not downloaded", "Downloading 40%", or "Needs another try"
- Icon: mic
- Omitted when `isTV()`

Four cards, in this order. People looking for the download find it first. People who already downloaded it can change how practice feels without scrolling past a licence essay.

#### Card 1 — Listener

Plain name in the title: "On-device listener". The engine id is in the caption, not the title.

| State | Row | Actions |
|---|---|---|
| Not downloaded | "Not on this device" and the size ("About 66 MB") | Primary "Download". Caption: "Stays on this device. Reading works without it." |
| Downloading | Progress bar, "24 MB of 66 MB" | "Cancel", which deletes the partial file and returns to Not downloaded |
| Verifying | "Checking the file" | No second action. A checksum mismatch deletes the file and shows Needs another try |
| Ready | "Ready" and the version | "Delete", behind `ConfirmDialog`: "Practice can still play recitations. Voice following needs the download again." |
| Needs another try | One sentence from the stable error code, mapped to copy ("No connection", "Not enough space", "The file did not match") | "Try again" |
| Update available | "An update is ready" and the new size. The current file keeps working | "Download update". Replacing the file uses the same confirm as delete, then downloads. A failed update leaves the old file in place |

Wi-Fi row: `ToggleRow` "Download on Wi-Fi only", default **on**. When it is on and the network is cellular, Download becomes "Use mobile data", and a confirm states the size before the job starts.

One model file at a time. The Advanced disclosure (collapsed) holds the engine choice:

- "Recommended" → Zipformer, about 66 MB. Default.
- "Alternate" → FastConformer, about 88 MB. Caption: "Use this only if the recommended listener will not run. It may not mark words to try again."

Choosing the other engine while one file is present asks to remove the current file first. Do not keep both on disk.

This card is the only place that deletes the model. Settings → Offline data (`offline-data.tsx`) shows a read-only row, "Qur'an listener", with the byte size and a chevron to this screen. "Clear all" on that screen does not delete the ONNX file or the lexicon. Cache clearing and model removal are different decisions.

#### Card 2 — Practice

These are the prefs in `QuranCompanionPrefs`. They sync. They do not affect the reader.

| Pref | Control | Default |
|---|---|---|
| `defaultMode` | The same pills as the hub | `follow` |
| `feedbackTiming` | Rows: "After each ayah", "While I recite", "At the end" | `ayah` |
| `showTranslation` | Toggle | Copy of the reader's `showTranslation` on first launch, then independent |
| `showTransliteration` | Toggle | Copy of the reader's `showTransliteration` on first launch, then independent |
| `showTajweedColors` | Toggle. Subtitle: "Colours can make practice marks harder to see." | `false` |
| `hearBeforeRecite` | Rows: "Off", "Once", "Every ayah" | `off`. The Hear button is always in the dock. Audio never starts by itself on the first visit. |
| `autoAdvance` | Toggle. Subtitle: "Go to the next ayah when this one is settled." | `true`. Applies only in Follow, and only when the ayah ended with no "try again" line. Check and Hide always wait for Next. |
| `keepAwake` | Toggle | `true` |
| `startFrom` | Rows: "Last practice", "Where I was reading", "Ask me" | `lastPractice` |

`Ask me` shows the range pills expanded on the hub and does not auto-continue. `lastPractice` and `lastRead` fill the Continue card.

Match haptics are not a separate toggle. They follow Settings → Haptics.

#### Card 3 — Revision

| Pref | Control | Default |
|---|---|---|
| `dailyRevisionLimit` | 5, 10, 20 | `10` |
| `includeHifzReview` | Toggle. Subtitle: "Ayahs you marked for review are included." | `true` |
| `revisionReminder` | Toggle. Subtitle: "A reminder on this device when ayahs are due." | `false`. Implemented in `buildReminders`, not as a one-off schedule (§10). |

The reminder is off until the person turns it on. Scheduling, the 09:00 time, and what happens when prayer reminders rebuild are in §10. Do not add a remote push. The in-app due count on the Qur'an index is always on and is not a setting.

#### Card 4 — Privacy and sources

Short copy, in this order:

- "Your voice is processed on this device. It is not uploaded and it is not saved."
- Microphone row: "Allowed" or "Blocked". When blocked, the row opens the OS app settings. Do not show a toggle that pretends the app can grant the permission itself.
- "Delete practice history" with a confirm. Removes session summaries only. Does not remove hifz marks, the memorization map, or the model. Say that in the confirm body.
- Sources caption: Tilawa, Tanzil, Quran.com word data, and the NPL-1.2 line for the recommended model. Link to the existing credits screen rather than pasting the licence.

There is no toggle for "upload audio" and no toggle for "share with Quran Lab". Those paths are not built.

### 9.6 What stays quiet

- The reader toolbar does not gain a settings gear. Practice settings are on the practice header and in Settings.
- A session does not show engine names, confidence percentages, phoneme strings, or a live transcript.
- Download errors do not use the word "ONNX".
- The hub does not show a chart of minutes practised. The summary's caption counts are the progress surface until a later version asks for more.

---

## 10. Persistence and sync

New keys in `DB_KEYS`, each with a `KEY_PERSISTENCE` entry so backup and reset stay exhaustive.

| Key | Class | Sync entity | Contents |
|---|---|---|---|
| `quranCompanionPrefs` | `userData` | `quran_companion_prefs` | Practice, revision, and coach prefs. Not the model file. |
| `quranPracticeSessions` | `userData` | `quran_practice_sessions` | `PracticeHistory` below: last 30 summaries and a `clearedAt` marker. Drop oldest. |
| `quranMemorization` | `userData` | `quran_memorization` | `{ schemaVersion, records }`, where `records` maps `surah:ayah` (built with `hifzKey`) → record below. |
| `quranRecitationModel` | `deviceLocal` | none | Manifest only. The ONNX file and lexicon are in the documents directory. |

Register the three userData entities in:

- `apps/app/src/sync/blob-sync.ts` `BLOB_ENTITIES` (reload the matching store).
- `apps/api/src/sync/dto/sync.dto.ts` `SYNC_ENTITIES`.

No TypeORM migration and no Drizzle change. `SyncRecordEntity.entity` is already `varchar(64)` and `data` is JSON (`apps/api/src/database/entities/index.ts`). The new names fit that column. Admin does not get a new table. Regenerate the client after the DTO enum changes (`pnpm generate:api`). `pnpm check:ci` fails on OpenAPI drift.

Blob sync is not one rule for every entity.

- `quran_companion_prefs` stays whole-value last-write-wins, same as `quran_prefs`. Give the `BlobEntity` an `isPristine` check for the exact defaults with no `lastPassage`, so a brand-new install does not push those defaults over an account that already has practice settings (`isPristine` on the location and reading-text entities is the pattern).
- `quran_memorization` and `quran_practice_sessions` must not be plain last-write-wins, or one phone's history replaces the other's. They also cannot use `UNION_MERGE_ENTITIES` as it stands. Read `mergeBlobValue` before touching this: for maps it does `{ ...remote, ...local }`, so when two devices hold different records for the same ayah **each device keeps its own forever** and they never converge. For arrays it dedupes by content and never trims. And when the local value is empty it returns the remote value, so "Delete practice history" on one phone is undone by the next pull.
- Add one optional field to `BlobEntity`: `merge?: (local: unknown, remote: unknown) => unknown`. `mergeBlobValue` calls it when present, before the generic union rule. An entity with `merge` is treated like a union-merge entity in `applyRemoteBlob` (the "local is newer, skip" shortcut does not apply). This is a small extension of the existing path, not a second protocol. The two merge functions are pure and live in `lib/quran-companion/` so Jest covers them without the sync engine:
  - `mergeMemorization(local, remote)`: union of keys. For a key on both sides, the record with the later `updatedAt` wins. Ties keep local. Both devices reach the same map after one round trip each.
  - `mergeSessions(local, remote)`: `clearedAt` is the later of the two. `items` is the union by `id`, minus any item whose `endedAt` is at or before `clearedAt`, sorted by `endedAt`, newest 30 kept. Delete history then propagates, and a phone that was offline during the delete cannot bring the old sessions back.
- Memorization records are never removed one at a time in v1. Only Reset app data and account deletion clear the map, and those already propagate through the server `data_reset` marker. If a later version adds "forget this ayah", it needs a tombstone on the record, not a deleted key.

`hifz` is not in `UNION_MERGE_ENTITIES`, so it stays last-write-wins. Leave it there.

Release order. `SyncPushDto` validates every record with `@IsIn(SYNC_ENTITIES)`, and one unknown entity fails the **whole** push with a 400, including prayer logs. The API with the three new names must be deployed before any app build that can push them reaches a signed-in user. An older app that pulls the new entities ignores them: `isBlobEntity` is false and the typed `switch` has no case. Add a sync-engine test for that so it stays true.

Payload size. A blob is pushed whole each time it changes, inside one `/sync/push` request with every other changed entity. `apps/api/src/main.ts` sets no JSON body limit, so the Express default (100 KB) applies unless the deployment overrides it. **Confirm the effective limit in Phase 4.** A memorization map for a full hafiz is up to 6,236 records. Keep the stored record compact (dates as `YYYY-MM-DD`, the field list below and nothing more), add a test that 6,236 records serialize under 600 KB, and raise the JSON limit for the sync route to 2 MB in the same API change if the default is in force. Only ayahs practised in Check, a Hide mode, or Revision get a record. Follow never creates one. On Android a single AsyncStorage value above about 2 MB cannot be read back, which is the hard ceiling for this blob.

`engineChoice` and `wifiOnlyDownload` live on the prefs object, so they follow prefs last-write-wins. The model file itself does not sync. A second device still downloads its own copy. `coachDismissed` is on that same object.

`hifz` stays a separate map. Writing `memorized` or `review` still goes through `hifzStore.cycle` or a new explicit setter that uses `hifzKey`. There is no setter today, only `cycle`. Add `setStatus(surah, ayah, status | null)` rather than calling `cycle` twice from "Mark memorized". Practice success never calls it. The revision screen may show both: "marked memorized" from `hifz`, and "due" from `quranMemorization`.

The due queue is:

1. Memorization rows whose `nextReviewAt` is today or earlier.
2. When `includeHifzReview` is on, ayahs whose hifz status is `review` and that are not already in the list.
3. Order: overdue first, then `lapses` descending, then mushaf order. Hifz-only rows sort as lapses 0.
4. Today's sitting is the first `dailyRevisionLimit` rows. The hub caption mentions a remainder only when the queue is longer than the cap.

```ts
type QuranCompanionPrefs = {
  defaultMode: "follow" | "check" | "hide-words" | "hide-ayahs";
  rangePreset: "ayah" | "next5" | "surah" | "page";
  feedbackTiming: "ayah" | "live" | "end";
  showTranslation: boolean;
  showTransliteration: boolean;
  showTajweedColors: boolean;
  hearBeforeRecite: "off" | "once" | "every-ayah";
  autoAdvance: boolean;
  keepAwake: boolean;
  startFrom: "lastPractice" | "lastRead" | "ask";
  dailyRevisionLimit: 5 | 10 | 20;
  includeHifzReview: boolean;
  revisionReminder: boolean;
  coachDismissed: boolean;
  engineChoice: "tilawa-zipformer" | "tilawa-fastconformer";
  wifiOnlyDownload: boolean;
  /** Last companion passage. Independent of quran last-read. */
  lastPassage?: {
    surah: number;
    ayahStart: number;
    ayahEnd: number;
    mode: QuranCompanionPrefs["defaultMode"];
  };
};

type PracticeSummary = {
  id: string;
  mode: "follow" | "check" | "hide-words" | "hide-ayahs" | "revision";
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  engine: "tilawa-zipformer" | "tilawa-fastconformer" | "none";
  engineVersion: string;
  matched: number;
  uncertain: number;
  confirmedMismatch: number;
  corrected: number;
  notReached: number;
  weakAyahs: number[]; // ayah numbers inside the range
};

/** Stored value of `quranPracticeSessions`. An object, not a bare array, so a clear survives sync. */
type PracticeHistory = {
  /** Set by "Delete practice history". Items ending at or before this are dropped on merge. */
  clearedAt?: string;
  items: PracticeSummary[]; // newest 30
};

type MemorizationStatus = "learning" | "practising" | "needs_revision";

type MemorizationRecord = {
  status: MemorizationStatus;
  successStreak: number;
  intervalDays: number; // 0 | 1 | 3 | 7 | 14 | 30
  nextReviewAt: string; // ISO date
  lastAttemptAt: string;
  lastSuccessAt?: string;
  lapses: number;
  /** Every write sets this, including a manual status change and "Not now". Used by `mergeMemorization`. */
  updatedAt: string;
};
```

"Today" for `nextReviewAt` is the device's local calendar day, formatted with `getLocalDateString()` and advanced with `addDays()` from `@munib-tracker/shared` (`packages/shared/src/utils/date.ts`), not `toISOString().slice(0, 10)`, which is UTC and moves the due day for anyone east or west of Greenwich. `revision-schedule.ts` takes `now` as an argument so tests can fix the date.

Each stored blob carries a `schemaVersion: 1` field (prefs, history, and a wrapper around the memorization map: `{ schemaVersion, records }`). A reader that sees a higher version than it knows leaves the blob untouched and treats practice history as empty, so an older build never corrupts data written by a newer one. No entry in `db/migrations.ts` is needed for v1 because the keys are new.

### Review ladder

Implemented in `revision-schedule.ts`.

- New ayah starts at `learning`, `intervalDays: 0`, due today.
- A take advances one step only when the range was fully reached, `confirmedMismatch === 0`, and `uncertain` is below a fixed cap (start at 10% of study words, tune after the device proof). Steps: 0 → 1 → 3 → 7 → 14 → 30 days.
- A confirmed mismatch sets `needs_revision`, `intervalDays: 0`, due today, increments `lapses`, resets `successStreak`.
- An all-uncertain take does not advance and does not lapse.
- After two advances at 30 days, the UI offers "Mark memorized", which runs the existing hifz transition to `memorized`. It does not happen by itself.
- User can set learning / practising / needs revision manually, and can still use the old cycle on the ayah reader.
- Queue membership and the daily cap are the numbered list above this ladder.

Daily reading goals stay on khatm. Do not add a second reading-plan object. When `startFrom` is `lastRead`, the Continue card uses `quranStore.lastRead`. When it is `lastPractice`, it uses `lastPassage`.

### Privacy

- The mic prompt is the shared usage string in §7, requested from the session mic button, with on-screen copy that audio is processed on device and not uploaded.
- The recording indicator is the dock mic state. No background capture. Background stops the mic (§7).
- Summaries contain counts and ayah numbers, not transcript text and not audio.
- Model download talks to the pinned Tilawa release host. Name that host on the settings privacy card. No analytics event includes ayah text or audio.
- `userData` keys are in backup and in `wipeLocalDeviceData` via `RESET_KEYS`. The ONNX directory is not a `DB_KEYS` entry, so the wipe function must delete `recitation-models/` itself (§19).
- Quran Lab's share-recording API is not called in any phase unless a later spec adds a separate consent screen. v1 does not add that screen.

- Sentry: report practice failures with `captureAppException(error, { tags: { area: "quran-practice", code } })`, where `code` is one of the stable codes in `error-codes.ts`. Do not put ayah text, a transcript, phoneme strings, PCM, or the model file path in `extra`. Do not add breadcrumbs per word or per audio chunk.
- The published privacy policy and the store privacy forms change with this feature (§20).

### Revision reminder

The reminder is a row built by `buildReminders` (`apps/app/src/lib/notifications/build-reminders.ts`). `rescheduleAll` (`apps/app/src/notifications/scheduler.ts`, and `scheduler.web.ts` for web timers) calls `cancelAll()` and then schedules only what `buildReminders` returns, plus snoozes. A notification scheduled from the settings screen alone is deleted the next time prayer reminders rebuild.

How the existing builder works, and what the new row must match:

- Reminders are **dated**, not repeating. Each pass builds rows for the next `SCHEDULE_DAYS_AHEAD` (2) days. Follow `pushFridayReminder`: id `quran-revision:{dayKey}`, `repeat: "date"`, `fireAt` from `wallClockInTimeZoneToDate(…, 9, 0, location.timeZone)`, `channelId: "zikr"`, `route: "/quran/revision"`. Do not add a new Android channel.
- The total is capped by `MAX_PENDING_REMINDERS` (60) through `trimRemindersToBudget`, which keeps the lowest `priority` numbers. Add `PRIORITY.quranRevision` below every Salah and adhan priority, so a full budget drops the revision reminder before it drops a prayer.
- `buildReminders` is pure and takes `BuildRemindersOptions`. Add `revisionDueByDay?: Record<string, number>` (day key → due count). Emit a row only for a day whose count is greater than zero, when `revisionReminder` is on. The pref lives in `QuranCompanionPrefs`, not `UserPreferences`, so pass it in through the same options object (`revisionReminderEnabled?: boolean`).
- `buildReminderOptions()` in `scheduler.ts` is synchronous today and reads only `trackerStore`. The practice stores are lazy and are usually not loaded when the app reschedules at launch. Make the options builder async and read the prefs and memorization blobs through their repositories (`readJSON`), then compute the per-day counts with `due-queue.ts`. Do the same in `scheduler.web.ts`. Do not load the practice stores from `app-providers.tsx` to make this work.
- Call `rescheduleAll` when the `revisionReminder` toggle changes, when a revision sitting ends, and after "Not now". Otherwise a person who finished today's revision at 08:00 is still reminded at 09:00.
- The body states the count ("3 ayahs to revise") with plural forms. It never names the ayah.
- Tap handling already uses `data.route` through `openNotificationRoute`. TV stubs `expo-notifications`, so the toggle stays off there.
- If the toggle is turned on while notification permission is not granted, show the same permission flow `settings/notifications.tsx` uses. If the master toggle is off, the row's subtitle says reminders are off in Notifications and links there. Do not turn the master toggle on from this screen.
- Tests: extend `build-reminders.test.ts` (row present with pref on and a due count, absent with pref off, absent at zero due, survives `trimRemindersToBudget` only when budget allows) and `scheduler.test.ts` (options are read from the repositories).

---

## 11. Phases

Each phase is shippable behind the practice entry. Do not start a phase until the previous acceptance list is true.

### Phase 0 — Alignment and schedule, no microphone

Build `align-words`, `revision-schedule`, `reduce-session`, and `map-tilawa-event` with fixture events checked in as JSON.

Acceptance:

- Jest covers the four ayah fixtures, the ladder, "uncertain does not lapse", "one success does not write hifz", and unknown Tilawa messages ignored.
- No new native dependency.
- No user-visible route yet, or a route hidden in `__DEV__` that replays a fixture. Production builds do not replay fixtures.

### Phase 1 — Practice UI on top of the current reader

Build the hub, session, summary, and `/settings/quran-practice` from §9, wired to the `unavailable` engine. Prefs persist locally with the defaults in §9.5. Follow can play the reference reciter and highlight with the existing `activeWordIndexAt` path. The settings download button is visible with the size copy and does not start a transfer until Phase 2.

Acceptance:

- Hub shows one primary Start, range pills, and mode pills. "Practise this ayah" from the reader opens a one-ayah session without a form.
- Session dock is Hear, mic or Listen, Reveal when hiding, and End. No modal during a take.
- Summary leads with Try again, Next, or Done.
- Settings screen renders all four cards. Download, Delete, and the engine picker do not crash while the file is absent. Wi-Fi toggle and practice toggles round-trip through the prefs repository.
- Settings tab row is hidden on TV. Phone and a wide web width both reach the screen.
- Hide-word and hide-ayah work with Reveal and no engine.
- Every entry point (Qur'an index action, reader action sheet, hifz row, memorization plan link, Settings row, library aliases, deep links) goes through `isPracticeAvailable()`. On TV none of them renders and the routes redirect to `/quran`.
- `quranCompanionPrefs` is added to `DB_KEYS` in this phase, local only. The other two keys and all sync wiring wait for Phase 4.
- Invalid session params (surah 115, `from` greater than `to`, an ayah past the end of the surah) land on the hub.
- Theme tokens only. English keys plus `ar` and `ur`. i18n tests pass.
- Existing hifz cycle tests still pass (`hifz-store.test.ts`).

### Phase 2 — Web engine proof

Add `@tilawa/core` at a pinned version and `onnxruntime-web` only on the web bundle (dynamic import from the practice route). The settings Listener card runs the download: progress, cancel, checksum, Wi-Fi confirm, delete. Feed a short clip of Al-Fatiha (a local fixture file in dev, the mic in a real browser).

Acceptance, written back into §17 of this doc:

- Model loads, one ayah produces `word_progress`, `dispose()` drops the session.
- Alignment maps those indexes onto study words for 1:1–1:7.
- Whether correction mode emits a confirmed miss is recorded, with the event payload shape. The UI enables red marks only if this is true.
- Rough numbers: download size, init time, peak memory, time from speech to highlight. Measured in one Chromium session is enough to continue. It is not a claim about phones.
- The wasm files load from `/ort/` on our origin with `numThreads = 1`, in a production static export (`pnpm build:app:web`, then serve `dist`), not only in the dev server.
- Web capture works in Chromium and in Safari (desktop or iOS). Record the `AudioContext.sampleRate` each one actually gave.
- The model survives a reload from the `munib-recitation-model-v1` bucket, and Offline data → Clear audio does not remove it.
- Where the engine's word list comes from is recorded in §17 (§4.1), and the web `__common` chunk size is unchanged from before the dependency was added.

If wasm cannot run inside Expo web, web Practise stays on Phase 1 (listen + manual hide) and phones continue in Phase 3.

### Phase 3 — iOS and Android dev builds

Add `onnxruntime-react-native`, pinned to an exact version. Metro platform files as in §8. Stub the module when `EXPO_TV=1` so `pnpm prebuild:app:tv` still configures. Capture PCM per §7. Change the microphone strings in `app.json` (§7).

Before any feature code in this phase, on a throwaway branch: install the package, run `pnpm prebuild:app:ios` and `pnpm prebuild:app:android`, build a dev client for each, and create one inference session from a file. That settles gates 2, 7, and 8 in a day. Record the result in §17. If the package needs a config plugin entry or a patch under `patches/`, that goes in the same commit as the dependency.

Acceptance on one physical Android phone and one physical iPhone (simulators do not count for the mic):

- Permission deny path leaves the session in listen-only and the settings microphone row offers OS settings.
- Al-Fatiha follow-along highlights without freezing scrolling. The active word stays on screen.
- Feedback timing `ayah` does not show a "try again" line until the ayah ends.
- Backgrounding stops the mic (verify with the OS privacy indicator) and does not start it again on return.
- Kill and relaunch does not leave a locked audio session.
- Low-storage download failure is explained.
- After a session, the mini-player plays through the loudspeaker, lock-screen controls work, and background playback continues with the screen off (§7 Audio session).
- An incoming call during a take ends the take, and the session is idle and usable after the call.
- A wired headset and a Bluetooth headset both capture. Note the delivered sample rate for each in §17.
- Dictating a custom adhkar (`expo-speech-recognition`) still works after the permission strings change, including on a fresh install where practice asks for the microphone first.
- The iOS permission prompt shows the shared sentence. The TV prebuild has no microphone key in `Info.plist` and no `RECORD_AUDIO` in the TV manifest.
- A release build (not only debug) loads the model. Minification and ProGuard/R8 can strip the ORT JNI classes.
- The Android release bundle passes the 16 KB page-size check, and the per-ABI download size increase is recorded against the §13 budget.
- Killing the app mid-download leaves no `.part` file after the next visit to the practice hub.
- A debug build records the same measurements as Phase 2.

Do not upload store binaries in this phase.

### Phase 4 — Memorization and revision

Persist `quranMemorization`, `quranPracticeSessions`, and `quranCompanionPrefs`. Revision sitting with the daily cap. Sync whitelist. Manual "Mark memorized" writes hifz. "Not now" pushes `nextReviewAt` to tomorrow. Optional local reminder stays off until the toggle is on.

Acceptance:

- Due queue survives restart and appears after backup restore (userData). The sitting shows "2 of 10" when the limit is 10.
- Reset app data and account deletion clear prefs, history, memorization, the manifest key, and the `recitation-models/` directory (or the web bucket). `resetDatabase()` only removes `RESET_KEYS`, so the files are deleted in `wipeLocalDeviceData` (§19).
- Signed-in sync round-trip of the three blobs (existing sync tests style in `blob-sync.test.ts` and the API whitelist test if one exists).
- Two devices that practised the **same** ayah converge on the record with the later `updatedAt` after each has synced once. Two devices that practised different ayahs both keep both.
- Delete practice history on one device removes it on the other after sync, and a device that was offline during the delete does not bring the sessions back.
- The API change is deployed before the app build is released (§10 Release order), and the effective JSON body limit is confirmed (§10 Payload size).
- A day change while the app is open (midnight) refreshes the due count on the Qur'an index and the hub. Reuse the day-rollover refresh `app-providers.tsx` already runs for the tracker, by having the practice store recompute `due` when it is loaded and the app returns to the foreground.
- A session with zero confirmed mismatches advances the ladder; a mismatch resets it; uncertain does neither. A listen-only session does not move the ladder.
- Hifz screen still cycles the old way when the user never opens Practise.
- Deleting practice history leaves hifz marks and the model in place.

### Phase 5 — Hardening

- Settings privacy card: on-device copy, microphone row, delete history, credits link, NPL-1.2 line for the recommended model.
- Offline data row links to Qur'an practice and "Clear all" leaves the model file alone.
- Empty, offline, and failed-engine captions from §9 on the hub, session, and settings screen.
- `pnpm --filter app test` for the new suites, plus the quran and hifz suites already in the app.
- No change to mushaf layout tests beyond what a shared component forces.
- Everything in §20: privacy policy text, store privacy forms, credits entry, and `docs/DEEP_LINKS.md`.
- The copy review in §12 is done and its notes are recorded in §17.
- Accessibility pass with VoiceOver and TalkBack on the hub, session, summary, and settings screen: every control has a label, word state is spoken, and nothing is announced while the mic is live.
- The remaining 21 locales have key parity from `merge-missing-keys.mjs`. English fallback text is acceptable there for v1. Arabic and Urdu are translated by hand.

### Phase 6 — Pronunciation drills (committed, after v1)

Decided on 17 Nov 2026: this phase is planned work, started after Phases 0–5 are complete. It is not part of "v1 done" (§16). The owner has accepted the Quran Lab terms in §4.2: a developer key, a network call on first run, a remote pause held by Quran Lab, Play Integrity on Android, and NPL-1.2.

Before any code (the owner does these, they cannot be done from the repo):

1. Request a Quran Lab developer key for the app's bundle id and Android package. Record the key's terms and any usage cap in §17.
2. Re-read the SDK docs in §18 on the day work starts. The calibration list in §4.2 is from 16 Nov 2026 and decides which sounds can be offered.
3. Decide where the key lives. It is a client key and ships inside the binary, so treat it as public. It goes in an `EXPO_PUBLIC_` variable and `.env.example`, never in a server secret that the app cannot read.

Build:

- An Expo module `apps/app/modules/munib-tajweedformer/` wrapping the Kotlin and Swift SDKs, with the same layout as the existing `munib-*` modules. Web uses `@quran-lab/tajweedformer` behind a `.web.ts` file. TV is excluded in the three places §19 lists for ORT (Metro stub, `TV_EXCLUDED`, `withTvExpoModuleExcludes.cjs`).
- Audit the Android SDK's manifest merge before the first build: `INTERNET` is already present, but list every permission, service, and WorkManager job it adds, and add any unwanted ones to `blockedPermissions` only if the SDK still works without them. Record the final merged list in §17.
- `listen()` takes the microphone itself. It uses the audio-session rules in §7 (stop the shared player, restore playback mode afterwards) and the same shared permission sentence.
- One Tilawa session or one Quran Lab session, never both. Opening a drill disposes a live Tilawa engine first, and the other way round.
- Entry: a "Practise this sound" button on `learn-quran/tajweed/[id].tsx`, shown only for lessons whose rule maps to a head the loaded calibration marks reliable. The mapping is a typed table from `TajweedRuleId` to head name, with a test that every mapped head is in the allow-list. A lesson with no reliable head keeps today's "listen and try again" and shows no new button.
- The drill screen plays the reference from `QuranGuideTajweedLesson.practiceAudio`, then listens. Feedback is one of three lines: "That matched the example", "Listen again and try once more", or "The listener was not sure". It never names a rule as broken and never shows a score.
- First use shows one consent sheet before the SDK is initialised: this drill downloads a second listener (about 56.5 MB), contacts Quran Lab once to activate it, and processes audio on the device. Declining leaves the lesson as it is today. The choice is stored in `QuranCompanionPrefs` (`pronunciationConsentAt?: string`).
- Quran Lab's share-recording API is still not called. There is no toggle for it.
- If Quran Lab pauses the app or refuses the key, the SDK deletes its model. The button disappears and the lesson works as before. No error dialog. The Listener settings screen gains a second card, "Pronunciation listener", with the state and a Delete action.
- Drill results do not move the review ladder and write nothing to `quranMemorization` or `hifz`. Lesson completion stays in `quran_guide_progress` as today.

Acceptance:

- A fresh install with no network can still open every tajweed lesson. The drill button explains that it needs a connection once.
- Declining consent makes no network call to Quran Lab (verify with a proxy).
- The store privacy forms and the privacy policy name Quran Lab as a third party contacted for activation, and Play Integrity is declared where Play requires it.
- TV builds contain no Quran Lab library.
- The copy review in §12 has been run on every feedback string in English, Arabic, and Urdu.

Risk the owner has accepted: a third party can switch this drill off for every user at any time. That is why the drill is an addition to a lesson and never the only way to complete it.

---

## 12. Testing

Jest, next to the pure modules. No new E2E framework.

| Test | Proves |
|---|---|
| `align-words.test.ts` | Fixtures in §6, including unmapped words staying neutral |
| `map-tilawa-event.test.ts` | Each known message, unknown message ignored, no red from confidence alone |
| `reduce-session.test.ts` | Match, uncertain, mismatch, self-correction, not-reached |
| `revision-schedule.test.ts` | Ladder, lapse, uncertain, no hifz write, local-day boundary with a fixed `now` |
| `due-queue.test.ts` | Order, daily cap, hifz `review` rows included or excluded by the pref, per-day counts for the reminder |
| `resample.test.ts` | 48 kHz and 44.1 kHz to 16 kHz length and continuity across chunks, stereo downmix, 16 kHz passthrough |
| `download-job.test.ts` | Progress, cancel deletes the partial, checksum mismatch, low disk, resume failure restarts, orphan cleanup |
| `merge-memorization.test.ts`, `merge-sessions.test.ts` | Convergence on the same key, union of different keys, `clearedAt` propagation, trim to 30 |
| `passage.test.ts` | Clamp to surah end, invalid params, "Next 5" at the end of a surah |
| `blob-sync.test.ts` (extend) | The `merge` hook is used, pristine prefs are not pushed, an unknown entity from a newer client is ignored |
| `build-reminders.test.ts`, `scheduler.test.ts` (extend) | §10 Revision reminder |
| `app-links.test.ts` (extend) | The five new routes |
| `backup.test.ts` (existing) | Fails until the four keys have a `KEY_PERSISTENCE` class |
| `wipe-local-data` test | The model directory and manifest are removed |
| API `sync` e2e (extend) | The three entity names are accepted, an unknown name is still rejected |
| `quran-practice-repository.test.ts` | Cap at 30, round-trip, unknown `schemaVersion` left untouched |
| `quran-companion-prefs-repository.test.ts` | Defaults, Wi-Fi flag, engine choice, daily limit |
| `hifz-store.test.ts` | Unchanged cycle |
| `i18n-guard` / `plural-audit` | New keys |

Device checks (Phase 3) are a checklist in the PR, not a CI job. Include: correct recitation of 1:1, a deliberate wrong word, a skip, an extra word, a self-correction, backgrounding, offline after the model is downloaded. Record what the pinned engine actually did. Do not "fix" a failed skip test by marking the word red in the reducer without an engine signal.

Copy review. Decided on 17 Nov 2026: no Qur'an teacher is available, so the review of the English, Arabic, and Urdu session copy is done by the AI assistant during Phase 5, and again for Phase 6 strings. The review checks that:

- No string says or implies that a recitation was wrong, invalid, or sinful, or that a tajweed rule was broken. The allowed vocabulary is "matched", "not sure", and "try again".
- Arabic and Urdu use the terms in `apps/app/AGENTS.md` and read as natural, respectful language for a religious context, not a literal translation of the English.
- The three languages say the same thing. A softer English line must not become a harsher Arabic or Urdu one.
- Plural forms are correct for Arabic counts.

Limits of that review, stated so nobody mistakes it for more: it is a language and tone check. It is not a scholarly opinion and it cannot certify tajweed terminology the way a qualified teacher can. Because of that, two rules hold until a teacher has read the copy:

- No string in any phase names a specific tajweed rule as the thing the person got wrong. Phase 6 feedback stays within the three lines listed in that phase.
- The settings privacy card carries one sentence: "The listener is a practice aid. It does not replace a teacher."

If a teacher becomes available later, their review replaces this one and the two rules can be revisited.

There is no committed dataset of user recitations. Do not scrape audio. A later eval set needs consent and stays out of git.

---

## 13. Performance budget

Targets for the Phase 3 phones, not a lab bench:

- Reader cold open does not load ONNX. Compare a profile before and after; the practice chunk stays off `__common`.
- Model init under 5 s after the file is on disk, or the UI shows a spinner and the rest of the screen stays usable.
- Highlight latency under 1 s from speech on Follow mode for a short ayah. If the phone cannot do that, switch that device class to record-then-decode and keep the spinner off the ayah text.
- One model in memory. `dispose()` on leaving the session.
- Session JSON under 4 KB each so the 30-item blob stays small.
- Store download size grows by at most 15 MB per ABI on Android and 15 MB on iOS from the ORT native libraries. Measure with the release bundle, not the debug build. Over that is gate 8.
- Peak memory during a session stays under 350 MB on the Phase 3 Android phone. If init fails for lack of memory, the engine reports `failed` with the code `out-of-memory`, and the Listener card suggests the listen-only path. It does not retry in a loop.
- The web wasm files and the model are fetched only after the person opens a session with a ready listener, never on the hub and never on the Qur'an index.
- A 15-minute Follow session on battery does not make the phone hot enough to throttle. Note the battery drop in §17. If it is over 8%, lower the feed rate before shipping.

---

## 14. Files an implementer will touch

Expected, not a blank cheque:

- `apps/app/package.json` — pinned `@tilawa/core`, and the ORT package for that phase.
- `apps/app/app.json` — mic usage string, plugin config, TV exclusion.
- `apps/app/src/db/keys.ts` — new keys and persistence class.
- `apps/app/src/sync/blob-sync.ts` — three entities.
- `apps/api/src/sync/dto/sync.dto.ts` — the same three names.
- `apps/app/src/app/quran/index.tsx` and `components/quran/ayah-action-sheet.tsx` — entry points.
- `apps/app/src/app/quran/hifz.tsx` — link to revision.
- `apps/app/src/app/(tabs)/settings.tsx` — Qur'an practice row, hidden on TV.
- `apps/app/src/app/settings/quran-practice.tsx` — listener, practice, revision, privacy.
- `apps/app/src/app/settings/offline-data.tsx` — read-only listener row. Clear all skips the model file.
- `apps/app/src/lib/cache-manager.ts` — report the model size without treating it as a wipeable cache group.
- `apps/app/src/i18n/en.json`, `ar.json`, `ur.json`, then merge for the other locales.
- `apps/app/src/lib/tv-stubs/` — ORT stub for TV.
- `docs/FEATURES.md` — add an NF id when a phase ships. Do not add it at the start.
- `docs/FREE_OPEN_SOURCE_DATA.md` — add the model row and NPL note when the download URL is pinned.
- `apps/app/src/db/index.ts` — export the three repositories.
- `apps/app/src/stores/hifz-store.ts` — `setStatus` (§10).
- `apps/app/src/providers/audio-player-provider.tsx` — export the playback audio-mode constant (§7).
- `apps/app/src/notifications/scheduler.ts` and `scheduler.web.ts` — async reminder options (§10).
- `apps/app/vercel.json` — cache header for `/ort/*`. No COOP/COEP.
- `apps/app/scripts/` — the copy-ORT-wasm step, wired into `build:web`.
- `packages/shared/src/constants/credits.ts` — Tilawa and model credit, which feeds `app/credits.tsx` and the marketing credits page.
- `apps/marketing-web/src/app/privacy/page.tsx` — the microphone paragraph (§20).
- Marketing announcement (owner decision, 17 Nov 2026 — supersedes the "leave marketing alone" line below): `packages/shared` `constants/features.ts` (pillar `quran-practice` + home card, icon `practice`), landing-page spotlight `apps/marketing-web/src/components/ai-practice-highlight.tsx` (section `#quran-practice`, after Stats), hero "New" announcement pill, `/features` "Qur'an practice with AI" block, and a FAQ entry on voice privacy. All copy follows the wording rule: the listener *follows* your recitation; no "mistake detection", "tajweed correction", or scores.
- `packages/api-contract/openapi.json` and `packages/api-client` — regenerated, not hand-edited.
- `docs/DEEP_LINKS.md`, `docs/STORE_ASSETS.md`, `docs/IOS_APP_COPY.md`, `docs/ANDROID_APP_COPY.md` — new routes and the store privacy answers.
- Every file in §19. The list above is not sufficient on its own.

Leave admin, widgets, and Live Activities alone until v1 has shipped and §17 is filled in (marketing copy was announced early by owner decision, see above). Marketing must not promise "mistake detection" or "tajweed correction" at any point. If the feature is announced, the wording is "follows your recitation on your device".

---

## 15. Implementation order on a single branch

1. Phase 0 tests.
2. Phase 1 UI with the unavailable engine.
3. Phase 2 web proof; update §17.
4. Stop if a §5 gate fails.
5. Phase 3 native spike on a throwaway branch (install, prebuild, one inference). Record gates 2, 7, and 8 in §17.
6. Phase 3 phones.
7. Phase 4 persistence and sync. The API change merges and deploys first, in its own PR.
8. Phase 5 hardening, the copy review, and the §20 store and policy work.
9. Merge to `main` only now (§20). Phase 6 follows as its own branch after v1 is released.

Phases 0 and 1 need no decision from anyone and no new native dependency, so they can start today. The native spike in step 5 does not depend on Phases 1 or 2 and can run in parallel with them if a second person is available. It is the largest unknown in the plan.

Suggested commits follow Conventional Commits (`pnpm commit`), one phase each. Do not mix an ORT upgrade with a UI rewrite. Release Please cuts a release from `main` on every merge, so nothing from this work reaches `main` until Phase 5 acceptance passes. The one exception is the API whitelist change, which is safe alone and must be live first.

---

## 16. Acceptance for "v1 done"

- A guest can open Practice with no model, listen to the current ayah, and hide words by tapping Reveal.
- Settings → Qur'an practice downloads, cancels, retries, and deletes the listener. There is no pause. Download on Wi-Fi only is the default. Offline data's Clear all leaves that file in place.
- A guest on a phone can recite Al-Fatiha in Follow mode and see word progress that matches the study-word row. "Try again" waits until the ayah ends unless they chose "While I recite".
- Confirmed mistake colours appear only if §17 records that the pinned engine emits them. Otherwise the UI stays match / not yet / unsure.
- Hide-word and hide-ayah work. A revision sitting respects the daily cap. Dates persist, sync, backup, and reset.
- Mark memorized still uses the hifz store and never runs from a single take. Deleting practice history does not clear hifz marks.
- TV has no mic UI and no Qur'an practice settings row. Web either runs the wasm engine or changes Start into Listen.
- No audio upload. No PCM in AsyncStorage.
- App Jest suite and `pnpm --filter app test -- i18n` pass.
- Existing reader, mushaf, tafsir, and hifz flows still work.
- Reset app data deletes `recitation-models/` as well as the manifest key.
- Two signed-in devices that each added a different ayah both still have those ayahs after sync.
- Turning prayer reminders off and on again does not drop the revision reminder while its pref stays on.
- Two signed-in devices that practised the same ayah end with the same record. Deleting practice history on one removes it on the other.
- After any practice session the mini-player, lock-screen controls, and adhkar dictation behave as they did before.
- The privacy policy, store privacy forms, and credits screen describe the microphone use and the model licence (§20).
- The copy review in §12 has been run and the "practice aid, not a teacher" sentence is on the settings screen.

Phase 6 is committed work but is not required for v1.

---

## 17. Device proof log

Fill the device rows during Phase 3. Rows marked **desktop** were measured on 17 Nov 2026 with the real pinned engine in Node (`@tilawa/core@0.4.0` + `onnxruntime-node@1.24.3`, Windows x64), fed everyayah Alafasy 128 kbps recitations decoded and resampled to 16 kHz with the same linear resampler the app uses. They prove the engine behaviour and the event shapes; they are not a claim about phones.

| Check | Where | Engine pin | Result |
|---|---|---|---|
| Correction-mode mismatch events present? | desktop | `@tilawa/core@0.4.0`, zipformer a0w | **Yes.** `correction` with `state.phase: "error"` and `issue.kind` (`possible_skipped_ayah` observed). Skipping 1:3 inside an expected 1:1–1:5 raised it on ayah 3, `words: 2`. Correct recitations of 1:1–1:7, 1:2, 2:1, 2:255 and 9:1 raised **no** issue. A word cut out of 1:2 or 1:5 raised no issue but left a gap in `word_progress.matched_indices` → shown as "not sure". `confirmedMismatchEnabled` is therefore `true` for the Zipformer build. Recorded payloads: `src/lib/quran-companion/__fixtures__/tilawa-events.json`. |
| Word numbering | desktop | same | `word_progress.word_index` and `issue.word` are 0-based within the ayah (`QuranCorpus.wordIndex`). |
| Alignment 1:1–1:7 | desktop / Jest | corpus v0.3.0 | **Pass** — one-to-one after folding (`align-words.test.ts`). |
| Alignment 2:255 | desktop / Jest | corpus v0.3.0 | **Pass**. Whole Qur'an: 6,230 of 6,236 ayahs split identically; the 6 that differ (2:72, 15:7, 27:20, 36:22, 37:164, 41:47) are join/split groups handled by the aligner. |
| Engine word list source | desktop | corpus v0.3.0 | **Separate download** (`zipformer_quran.json`, 5.5 MB, NPL-1.2) — fetched and checksummed with the model, so no NPL data ships in the app bundle. |
| Init time | desktop | same | ~2.1 s (model 66 MB + corpus parse). Phones: pending. |
| Throughput | desktop | same | ~10× faster than real time (46 s of Al-Fatiha decoded in 4.4 s). Phones: pending. |
| Peak memory | desktop | same | ~310 MB RSS for the whole Node process. Phones: pending (§13 budget 350 MB). |
| API JSON body limit | code | — | Express default 100 KB was in force; sync routes now accept 2 MB (`apps/api/src/create-app.ts`). Production confirmation: pending. |
| PCM source | iOS / Android | — | `expo-audio` `AudioStream` (pending device proof) |
| Highlight latency | iOS / Android / web | — | pending |
| Web wasm | Chromium / Safari | ORT web 1.24.3 | Partly. The listener downloads from `/recitation-models/` and the session reaches `ready` in the Expo web dev server (Chromium). Recognition quality in a browser, Safari, and a production static export (`build:web` → serve `dist`): pending. |
| Web model mirror (§4.1) | web | Zipformer a0w | **Decision recorded.** GitHub release assets send no CORS headers, so the web build serves an unmodified copy of the pinned files from its own origin. NPL-1.2 allows redistribution of unmodified files when they stay free and non-commercial and the licence travels with them: `NPL-1.2.txt` is one of the mirrored files, the feature is free with no ads, and the credits and privacy policy name the source. Native builds still download from the Tilawa release host. |
| Copy review (§12, D17) | — | — | Done by the AI assistant for English, Arabic and Urdu (and all other locales were translated). Checked: no "wrong"/"error"/score wording, soft "try again / not sure / not reached", same meaning in all three languages, CLDR plurals for `ar`. The "practice aid, not a teacher" sentence is on the settings privacy card. |
| ORT RN Gradle configuration | Android (Gradle 9.3.1) | ORT RN 1.24.3 | **Failed, then patched.** Its `build.gradle` used `org.gradle.util.VersionNumber` (removed in Gradle 9) and pulled `onnxruntime-android:latest.integration`. `patches/onnxruntime-react-native@1.24.3.patch` replaces the check with the RN minor version and pins the native AAR to 1.24.3. After the patch the Android project configures. |
| Quran Lab Kotlin bridge compiles | Android, Windows host | `ai.quranlab:tajweedformer:3.1.5` | **Pass** — `:munib-tajweedformer:compileDebugKotlin` builds against the real AAR. Swift side: not compiled (no macOS host). |
| ORT native: New Architecture load | iOS / Android | ORT RN 1.24.3 | pending |
| ORT native: Android 16 KB alignment | release AAB | ORT RN 1.24.3 | pending |
| Store size increase per platform | release builds | — | pending |
| Delivered sample rate (built-in, wired, Bluetooth) | phones | — | pending |
| Web capture: Chromium, Safari | browsers | — | pending |
| Playback after a session | phones | — | pending |
| Battery over 15 minutes | phones | — | pending |
| Quran Lab: Android merged permissions | release APK | `ai.quranlab:tajweedformer:3.1.5` | pending — the SDK declares RECORD_AUDIO, INTERNET, ACCESS_NETWORK_STATE and, through WorkManager, WAKE_LOCK, RECEIVE_BOOT_COMPLETED, FOREGROUND_SERVICE (per its README) |
| Quran Lab: calibration heads validated | device | model V4 | pending — only `validated` heads get a drill button (`reliableHeads`) |

---

## 18. Sources checked

Checked 16 Nov 2026. Re-read the pinned package `NOTICE` and `.d.ts` before adding the dependency.

- Tilawa repo and README: https://github.com/yazinsai/tilawa
- `@tilawa/core` README (events, RN path, 16 kHz, licence split): https://www.npmjs.com/package/@tilawa/core
- Tilawa notices (NPL artefacts vs MIT code): https://cdn.jsdelivr.net/npm/@tilawa/core@0.2.1/NOTICE.md
- Zipformer release notes (66 MB int8, NPL-1.2, non-commercial share-alike): https://github.com/yazinsai/tilawa/releases
- Quran Lab SDK overview: https://sdk.quranlab.ai/
- Quran Lab concepts (key, remote pause, download sizes, offline after first fetch): https://sdk.quranlab.ai/docs/concepts
- Quran Lab feedback (no scorer, head list, calibration limits): https://sdk.quranlab.ai/docs/feedback
- Quran Lab phonetic reference (rule ids vs heads): https://sdk.quranlab.ai/docs/reference
- NPL-1.2 summary: https://sdk.quranlab.ai/licence
- Android SDK repo (Play Integrity, permissions): https://github.com/Quran-Lab/tajweedformer-android

In-repo:

- `docs/DATA_INGESTION.md`, `docs/FREE_OPEN_SOURCE_DATA.md`, `docs/FEATURES.md` (NF-1.8 through NF-1.14, NF-2.7)
- `docs/PROFILING.md` (keep ayah JSON and ONNX out of the shared web chunk)
- `apps/app/AGENTS.md` (i18n, TV, theme, search)
- `apps/api/AGENTS.md` (TypeORM, blob sync, no client-side Supabase)
- `LICENSE` (PolyForm Noncommercial 1.0.0)

---

## 19. Repo wiring

These are existing seams. A new screen that ignores them will pass in isolation and break backup, TV, sync, or notifications.

| Seam | File | What to do |
|---|---|---|
| Key classes | `apps/app/src/db/keys.ts` | Add the four keys and a `KEY_PERSISTENCE` entry for each. `BACKUP_KEYS` and `RESET_KEYS` are derived from that map. `backup.test.ts` fails if a key is missing. |
| Backup and reset reload | `apps/app/src/stores/reload-all-stores.ts` | `load()` the practice, memorization, and prefs stores. Backup restore and reset call this. A store left out stays stale on a screen that is already mounted. Do not load them from `app-providers.tsx`. Practice stays lazy. |
| Files outside AsyncStorage | `apps/app/src/lib/wipe-local-data.ts` | `resetDatabase()` only deletes `RESET_KEYS`. Delete the `recitation-models/` directory here, next to `clearDownloadedQcfFonts()`. Account deletion uses this function. |
| Model size vs cache clear | `apps/app/src/lib/cache-manager.ts`, `settings/offline-data.tsx` | Show the listener bytes and a link to Qur'an practice. `clearAll` must not delete that directory. |
| Blob sync | `apps/app/src/sync/blob-sync.ts` | `BLOB_ENTITIES`, `isPristine` for default prefs, and the new `merge` hook for memorization and sessions (§10). Do not add those two to `UNION_MERGE_ENTITIES`. Extend `blob-sync.test.ts`. |
| API whitelist | `apps/api/src/sync/dto/sync.dto.ts` | The three entity names. Then `pnpm generate:api`. No migration. `packages/db` stays unchanged. Deploy the API before the app (§10 Release order). Confirm the JSON body limit (§10 Payload size). |
| Model files | `apps/app/src/lib/audio-cache.ts` (pattern only) | Native `expo-file-system/legacy`, web Cache Storage in its own bucket (§7). Do not put the model in `munib-audio/` or `munib-audio-v1`. |
| Audio mode | `apps/app/src/providers/audio-player-provider.tsx` | Export the playback mode constant. Practice switches to record mode and restores it (§7 Audio session). |
| Permission strings | `apps/app/app.json` | Same sentence on `expo-audio` and `expo-speech-recognition`, `recordAudioAndroid: true` (§7). Native change, needs a store build. |
| Web runtime | `apps/app/vercel.json`, `apps/app/public/ort/` | Self-hosted wasm, single thread, no COOP/COEP (§7). |
| Error reporting | `apps/app/src/lib/sentry.ts` | `captureAppException` with `area: "quran-practice"` and a stable code. No ayah text, transcript, or audio (§10 Privacy). |
| Credits | `packages/shared/src/constants/credits.ts` | Add Tilawa, the model, and NPL-1.2. The settings privacy card links to `/credits`. |
| Availability | `apps/app/src/lib/quran-companion/availability.ts` | `isPracticeAvailable()` is `!isTV()`. Every entry point asks it, so there is one place to change if a gate is ever needed. |
| TV Metro | `apps/app/metro.config.js` | When `EXPO_TV=1`, resolve `onnxruntime-react-native` to a stub under `src/lib/tv-stubs/`, the same map that stubs `expo-speech-recognition`. |
| TV native link | `apps/app/react-native.config.js` `TV_EXCLUDED` and `apps/app/plugins/withTvExpoModuleExcludes.cjs` | Add `onnxruntime-react-native` to both lists. They are required to stay aligned. Metro stubs do not stop CocoaPods or Gradle from compiling the module. |
| Deep links | `apps/app/src/lib/app-links.ts` and `app-links.test.ts` | Allow `/quran/practice`, `/quran/practice/session`, `/quran/practice/summary`, `/quran/revision`, and `/settings/quran-practice`. |
| Library search | `apps/app/src/lib/library-menu.ts` | Add aliases on the Qur'an item for practice, hifz, and revision so universal search can open the hub. Do not add a new Fuse index. |
| Notifications | `apps/app/src/lib/notifications/build-reminders.ts`, `apps/app/src/notifications/scheduler.ts`, `scheduler.web.ts`, and their tests | Revision reminder as specified in §10: a dated row with its own priority, fed by async options. |
| Routes | `apps/app/src/app/quran/practice.tsx` and the other files in §8 | File-based routes. `typedRoutes` is on. Each screen includes `<Seo path="..." />` like `quran/hifz.tsx`. |
| i18n | `apps/app/src/i18n/en.json` plus `merge-missing-keys.mjs` | Namespace `quranCompanion`. Arabic and Urdu in the same change. Counts that pluralize need CLDR suffixes for `ar`, `ru`, and `bn` (`plural-audit.test.ts`). The other locales get key parity from the merge script. |
| Git | `.gitignore` | Ignore `*.onnx` and `apps/app/public/ort/` so a downloaded model or the copied wasm cannot be committed. Neither pattern is there today. The lexicon JSON for the NPL model stays out of git too. Test fixtures copied from a Tilawa corpus excerpt are NPL-1.2 data: keep them to the few ayahs in §6 and put `NPL-1.2.txt` beside them. |
| Haptics | `apps/app/src/lib/haptics.ts` | Word-match taps use `triggerHaptic("light")`. |
| Audio session | `apps/app/src/providers/audio-player-provider.tsx` | Stop the shared player before Hear and before capture (§7). |
| Reader reciter ids | `apps/app/src/constants/tajweed.ts` | `quranComRecitationId` for reference-audio word timings. |
| App Lock | `apps/app/src/features/pin-lock` | No special case except the mic rule in §7. Do not start the microphone from the unlock callback. |

Do not add a home-module toggle, a feature-tour step, or a widget. The Qur'an index quick action and the Settings row are the discovery surfaces. `hiddenHomeModules` is unrelated.

Phase 3 is not done until `pnpm prebuild:app:tv` still configures after the native module is added.

---

## 20. Release, rollout, and compliance

The app has no remote feature flags and releases are cut by Release Please from `main`. A half-built phase on `main` would ship to the stores with the next unrelated fix.

### How unfinished work is kept out of releases

Decided on 17 Nov 2026: there is no release flag. The work is not committed to `main` until Phases 0–5 are complete and §16 passes. What that requires in practice:

- Do the work on one branch (or uncommitted in the working tree, as the owner prefers). A branch is safer: weeks of uncommitted changes have no history and no backup, and a single `git checkout` or disk fault loses them. Commit to the branch per phase even if nothing is pushed.
- Rebase or merge `main` into the branch at the end of each phase. The files in §19 (`keys.ts`, `blob-sync.ts`, `app.json`, `reload-all-stores.ts`, the i18n catalogues) change often on `main`, and conflicts are cheaper early.
- The API whitelist change is the exception. It is harmless without the app and must be deployed first, so it merges ahead on its own.
- Phase 2 and Phase 3 device proofs are run from the branch with dev and preview builds. No store upload from the branch.
- Hotfixes to `main` during this period go out as normal. They do not contain the feature.

### Kill switch

There is no way to turn the feature off remotely, and this spec does not add one. What can be done without a store release:

- Confirmed-mismatch marks are controlled by one constant in `constants/recitation-models.ts` (`confirmedMismatchEnabled`, per engine version). Turning it off needs a release. Web deploys in minutes. Phones wait for review. Accept that, and keep the default conservative: the constant is `false` until §17 records the proof.
- If the model host removes the file, new downloads fail with "Needs another try". Installed copies keep working. Nothing else in the app is affected.

### Order of release

1. API with the three sync entity names, deployed and verified (§10 Release order).
2. Merge the feature branch to `main` once Phase 5 acceptance passes. Web deploys from that merge and is the cheapest place to catch an alignment bug in production, because a fix is live in minutes.
3. Android and iOS in the same app version, after Phase 3 and Phase 5. This is a native release: new dependency and new permission strings. It cannot go over the air.
4. TV builds from the same commit, verified to contain no microphone permission and no ORT library.

### Store and policy work

None of this is code, and all of it blocks the phone release.

| Item | Where | What changes |
|---|---|---|
| Privacy policy | `apps/marketing-web/src/app/privacy/page.tsx` | The page does not mention the microphone today, although dictation already uses it. Add one paragraph: the microphone is used for adhkar dictation and Qur'an recitation practice, recitation audio is processed on the device, is not recorded, stored, or uploaded, and the listener file is downloaded from a named third-party host. |
| App Store privacy labels | App Store Connect | Audio data: not collected. No change to tracking. Review the answers anyway, because the reviewer will see a new microphone purpose string. |
| App Review notes | `docs/IOS_APP_COPY.md` | Say how to reach the feature, that the listener is an optional 66 MB download, and that reading works without it. Reviewers reject a microphone prompt they cannot trigger. |
| Play Data safety | Play Console, mirrored in `docs/ANDROID_APP_COPY.md` | Audio: processed on device and not collected. `RECORD_AUDIO` is already declared for dictation. Update the declared purpose. |
| Play 16 KB page size | Release bundle | Verified in Phase 3 (gate 7). |
| Licence notices | `packages/shared/src/constants/credits.ts`, `NOTICE` at the repo root, `docs/FREE_OPEN_SOURCE_DATA.md` | Tilawa (MIT code), the Zipformer weights and lexicon (NPL-1.2, non-commercial, share-alike), ONNX Runtime (MIT), FastConformer if offered (CC-BY-4.0). |
| Store listing | `docs/STORE_ASSETS.md` | No new screenshots or claims for v1. See the wording rule in §14. |
| Web | `apps/app/public/manifest.json` | No change. The PWA does not need a new permission entry. The browser asks for the microphone at the first tap. |

### Support

- A person who reports "it marked me wrong" needs to be able to say which build. The settings Listener card shows the engine version, and the About screen already shows the app version.
- In-app reports (`settings/my-reports.tsx`) are the channel. Do not add a "send my recording" option.
- Known limits to state on the settings screen, in plain words, under the Listener card: works best in a quiet room, with one voice, at a normal recitation pace. It may be less reliable for children's voices.

---

## 21. Decisions taken in review

Each of these was open or implied in the earlier draft. They are decided here so implementation does not stop to ask. Changing one is a product decision and means editing this table first.

| # | Question | Decision | Why |
|---|---|---|---|
| D1 | Which capture API on phones? | `expo-audio` `AudioStream`. A custom module only if gate 3 fails. | Already installed in SDK 57 and delivers PCM buffers. No new native code. |
| D2 | How does web capture audio? | `getUserMedia` + `AudioWorklet` in `capture.web.ts`. | `useAudioStream` is a no-op on web. |
| D3 | Web threads? | Single-threaded wasm. No COOP/COEP. | Cross-origin isolation would break the CDN audio and data the reader depends on. |
| D4 | Where do model files live on web? | Cache Storage bucket `munib-recitation-model-v1`. | `expo-file-system` cannot do it on web, and the audio bucket is cleared by Offline data. |
| D5 | How are model updates discovered? | Pinned constants in the app. No remote catalogue. | No new server surface, and the checksum is reviewed in a PR. |
| D6 | Should the model be excluded from iOS device backup? | Not in v1. It follows the audio cache, which is also in the documents directory. | Consistency. Revisit both together if App Review raises it, since excluding one path means a native change or moving both under a non-backed-up directory. |
| D7 | Can the two history blobs use the existing union merge? | No. Add a `merge` hook on `BlobEntity` and two pure merge functions. | The generic merge never converges on the same key and cannot propagate a delete (§10). |
| D8 | Does Follow mode create memorization records? | No. Only Check, Hide words, Hide ayahs, and Revision. | Following along is not a memorization attempt, and it keeps the blob small. |
| D9 | Does a listen-only or manual-reveal session move the ladder? | No. | There is no engine signal, and self-grading is not built in v1. |
| D10 | Can a passage span surahs? | No. | The route, the reference audio, and `passage.ts` all work per surah. |
| D11 | Pause and resume for the download? | Cancel and retry only, with one automatic resume attempt after an interruption. | A pause control is more UI than a 66 MB file on Wi-Fi needs. |
| D12 | Achievements, streaks, or a home card for practice? | None. | §1: not a score and not a leaderboard. |
| D13 | How is the feature gated before it is finished? | No flag. Nothing reaches `main` until Phases 0–5 are complete. Owner's decision, 17 Nov 2026. | The owner will not commit unfinished work, so a flag would be dead code. §20 lists what that approach needs. |
| D16 | Which engines does v1 offer? | Both. Zipformer is the default. FastConformer is under Advanced. Owner's decision, 17 Nov 2026. | Best accuracy by default, with a fallback for devices where the default will not run. While Zipformer is offered, practice stays free with no ads and no paywall (§4.1). |
| D17 | Who reviews the session copy? | The AI assistant, as a language and tone review, with the two guard rules in §12. Owner's decision, 17 Nov 2026. | No Qur'an teacher is available. The guard rules keep the copy inside what such a review can vouch for. |
| D18 | Is Phase 6 in the plan? | Yes, committed, after v1. Owner's decision, 17 Nov 2026. | The owner accepts the Quran Lab key, first-run network call, remote pause, Play Integrity, and NPL-1.2. |
| D14 | Who translates? | Arabic and Urdu by hand in the same change. Other locales get English fallback through the merge script until translated. | Matches how earlier features shipped. |
| D15 | Minimum device? | No explicit list. The engine reports `out-of-memory` or a slow init, and the UI falls back to listen-only. | A device allow-list would need remote config to maintain. |

Still open, and not blocking Phase 0 to Phase 2:

| # | Question | Needed by | Owner |
|---|---|---|---|
| O1 | ~~Does correction mode on the pinned build emit a usable mismatch event?~~ **Closed: yes** (§17, desktop run with the pinned engine). | — | — |
| O2 | Is the uncertain cap of 10% right for advancing the ladder? | End of Phase 3 | Tune from the device checklist. Change the constant, not the rule. |
| O3 | Quran Lab developer key requested and its terms recorded? | Before Phase 6 starts | Owner. It cannot be done from the repo. |
| O4 | Does the production API enforce the 100 KB default body limit? The code now raises `/api/v1/sync` to 2 MB; confirm the deployed API (and any proxy in front of it) allows it. | Before the app release | Whoever deploys the API. |

---

## 22. Review log

17 Nov 2026, second review. Corrections to statements that did not match the tree:

- `expo-audio@57.0.3` already ships `useAudioStream` / `AudioStream` with PCM buffers on native, so the capture question is mostly answered. On web that hook returns no stream, and the earlier draft had no web capture path.
- `expo-file-system` has no web implementation that can hold the model. The earlier draft said web would use it. The model store now follows `lib/audio-cache.ts`.
- `src/lib/haptics.ts` exports `triggerHaptic`, not `impactAsync`.
- `normalize()` is defined in `src/lib/search-fuse.ts`.
- The scheduler is `src/notifications/scheduler.ts` (plus `scheduler.web.ts`), not under `lib/notifications/`. Reminders are dated rows over a two-day horizon with a 60-item budget and priorities, not daily repeating triggers. The options builder is synchronous and cannot see lazy stores.
- Offline audio is no longer "later". The audio cache exists and its web bucket is wiped by Offline data.
- §16 said the download can be paused. §9.5 only ever had Cancel.
- Phase 4 said reset "does not need to delete the model file" while §16 and §19 said it must. It must.

Gaps closed:

- Audio session switching between playback and record, and restoring it (§7).
- Sync: the generic union merge does not converge for per-ayah records and cannot propagate "Delete practice history". Push validation rejects a whole batch on an unknown entity, so the API must ship first. Payload size against the API body limit and the Android AsyncStorage row limit (§10).
- Web: self-hosted wasm, no cross-origin isolation, browser eviction of the model (§7).
- Checksums without reading 66 MB into JS, disk-space precheck, orphaned partial files (§7).
- Route params, invalid input, and passages at a surah boundary (§8).
- Local-day handling for due dates, and a schema version on each blob (§10).
- Release order, store privacy forms, privacy policy, licence notices, support (§20).

17 Nov 2026, owner decisions (D13, D16, D17, D18 in §21): no release flag, because nothing is merged until v1 is complete. Both engines are offered. The copy review is done by the AI assistant with guard rules. Phase 6 is committed and now has its own task list.
- Success criteria without analytics, and the personas each mode serves (§1).
- Two more stop gates for the native runtime (§5), and more rows in the proof log (§17).
- Explicit decisions and the four questions still open (§21).

---

## 23. Implementation notes (17 Nov 2026)

Phases 0–6 are implemented in the working tree (not committed). What the code does where it sharpens or departs from the plan above:

- **Engine API, as pinned.** `@tilawa/core@0.4.0` exposes `createZipformerSession({ session, Tensor, corpus })` on React Native and `{ ort, model }` on the web. Correction issues arrive as `correction` messages (`state.phase === "error"`, `issue.kind`); the adapter acknowledges each with `correct("review_later")` so a take is never paused and the next issue can be raised. `possible_repetition` becomes an "extra word" in the summary, `unclear_ayah` becomes "not sure". A take is one ayah: `setExpected({ surah, ayah })` is set per take in Check, Hide and Revision.
- **Downloads.** Zipformer = model 69.2 MB + phoneme corpus 5.5 MB + `NPL-1.2.txt` (≈71 MiB total, shown as "about 71 MB"); FastConformer = model + `vocab.json` + `quran_ctc_tokens.json` + `quran.json` + `export_metadata.json` (≈99 MiB). URLs, sizes, SHA-256 (GitHub release digests) and MD5 (computed from the same verified downloads) are pinned in `apps/app/src/constants/recitation-models.ts`.
- **Manifest** covers every file of the engine (`files[]`), not one model plus a lexicon.
- **Memorization on disk is compact** (`memorization-codec.ts`: one-letter keys, epoch seconds) — ≈470 KB for all 6,236 ayahs, under the app's 1 MB safe row size. The in-memory record is the readable type in §10. `mergeMemorization` compares the stored `u` (updatedAt seconds).
- **Blob sync `merge` hook.** When a custom merge produces a value different from the server's, the tracker keeps the server's fingerprint so the next push sends the merged value (convergence after one round trip each).
- **No release flag** (D13). `isPracticeAvailable()` is `!isTV()` and every entry point asks it.
- **Routes.** The hub is `app/quran/practice/index.tsx` (same URL as `practice.tsx`). `ScreenLayout` has no trailing header slot, so the hub links to settings with a row at the bottom.
- **onnxruntime-react-native** is linked by React Native autolinking. Its own `app.plugin.js` hard-codes `../node_modules/onnxruntime-react-native`, which is wrong for this hoisted monorepo, so it is not added to `app.config.js`. TV excludes it in `react-native.config.js`, `withTvExpoModuleExcludes.cjs` and Metro (stub in `src/lib/tv-stubs/onnxruntime-react-native.ts`).
- **Web ORT** loads `ort.wasm.min.js` (UMD) from `/ort/` at run time — the ESM build uses `import.meta`, which Metro does not bundle — copied by `scripts/copy-ort-wasm.mjs` before `web` and `build:web`.
- **Microphone permission** strings are one shared sentence on `expo-audio` and `expo-speech-recognition`; `app.config.js` forces `expo-audio` recording off on TV prebuilds.
- **API JSON limit**: `/api/v1/sync` accepts 2 MB (`create-app.ts`).
- **Quran Lab (Phase 6).** SDK 3.x scores nothing and `model.reference` is null with the current build, so the drill judges one head per lesson against the calibration's `tau` (`pronunciation/judge.ts`); only heads whose calibration `status` is `validated` get a button. Keys: `EXPO_PUBLIC_QURANLAB_KEY_IOS|ANDROID|WEB` (unset → drill hidden). Analytics are off on every platform. The app never calls `sharing.ask()` and never hosts the native sharing sheet; on the **web** the SDK can show its own consent sheet when Quran Lab's config offers sharing, which an app cannot disable in code — so Settings → Qur'an practice always offers the sharing switch, "Delete what I shared" and the recovery code, and the privacy policy says so. Android: the AAR needs API 26 while the app's minSdk is 24 — `modules/munib-tajweedformer/app.plugin.js` adds `tools:overrideLibrary` and the JS only calls the module on API ≥ 26. iOS: SwiftPM via `spm_dependency` in the module podspec (iOS 15.1).
- **Supply-chain policy.** `@quran-lab/tajweedformer@3.1.6` (and every 3.x release) is newer than the workspace's minimum release age, so pnpm added it to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. Review that entry before release.
- **Copy review (D17)** was done by the AI assistant for English, Arabic and Urdu; all other locales were translated too.
- **Web model hosting (fix).** GitHub release assets send no CORS headers, so browsers could not download the listener ("No connection"). `scripts/fetch-recitation-models.mjs` (run by `web` and `build:web`) downloads the pinned files, verifies SHA-256, caches them in `node_modules/.cache/munib-recitation-models/`, and serves them from `/recitation-models/<engine>/<sha12>/` on the app's own origin (git-ignored, immutable cache header in `vercel.json`). Only the recommended engine is web-hosted; the alternate stays native-only. The pinned list moved to `src/constants/recitation-models.json` (shared by the app and the script).
- **"New" badge.** `lib/new-features.ts` + `stores/new-features-store.ts`: Qur'an practice has its own quick action (`quranPractice`, Library → Read, home Explore after Qur'an) with a "New" pill for 15 days from each device's first sighting. Customised home grids get the tile inserted once after Qur'an; removing it later is respected.
- **UX pass.** Hub: listener status strip (state + one action), one setup card (tap the passage to change surah/ayah via `PracticePassagePicker`, range incl. Custom, mode with a one-line explanation, then Start). Session: ayah progress chips (tap to jump), "Change" passage, live listening hint, auto-finish 1.2 s after the last word is reached (a word-progress signal — never silence), and a per-ayah result card (matched / try again / not sure / missed counts, the words in each group with tap-to-hear, Next / Recite again / Finish). Follow auto-advances only after a clean ayah, 2.5 s after the result shows. Settings: status strip + details row, "During a session" with help text for each choice, "On screen", revision limit in words, privacy card with a coloured microphone state.
- **Session polish (17 Nov 2026, second pass).**
  - *Flicker fix.* The session no longer treats "listener store not loaded yet" as "no listener": it stays `loading` until the manifest is read, so the dock no longer swaps Listen ↔ mic and the captions no longer come and go. While the listener prepares, the mic stays in place with a spinner and the status sits in the ayah card header (one line that is always there). The word row waits for the Quran.com study words (up to 1.5 s, then the whitespace fallback) so the ayah is laid out once instead of reflowing.
  - *Practice toolbar* (`components/quran/practice-toolbar.tsx`, in the header accessory): text size (same control as the reader), mode (not in revision; changing it starts a fresh session on the same passage), Hear reciter, translation, transliteration, tajweed colours, auto-advance (Follow only), and a gear to Settings → Qur'an practice. Mode and reciter are locked while the mic is live. This is the "header trailing control" of §9.1 for the session.
  - *Dock*: every control shares one icon slot and one label line; the mic is always centred.
  - *Result card*: a take where nothing was heard says so with a tip (louder, closer, from the first word) instead of a row of zeros; otherwise a proportion bar, dimmed zero counts, framed word groups, and centred text links for Move on / Finish.
  - *Auto-scroll* (§9.2): the word row reports the active word's window position; the session scrolls only when it leaves the band between the header and the dock, and never with reduced motion on.
- **Practice views (17 Nov 2026).** A `practiceView` pref (`ayah` | `page` | `mushaf`, default `ayah`; toolbar "View" chip and hub pills). Page and mushaf show the page holding the current ayah; ayahs outside the passage are dimmed and never hidden; tapping a passage ayah jumps to it (not while the mic is live). In the hide modes the words are blanked but the ayah-number markers stay, and words reveal as they are heard or with Reveal. The mushaf view maps each QPC V2 glyph token to its word with `lib/quran-companion/mushaf-tokens.ts` (tokens = Quran.com words + one end marker per ayah, checked against every line's `verseRange`, page-boundary continuation from the neighbouring pages); when the word counts are missing (offline, nothing cached) the page is shown with ayah-level marks only and a one-line note. `MushafLineRenderer` gained an optional `renderLineGlyphs` so the reader's renderer is reused unchanged otherwise. This supersedes §6's "v1 practice UI highlights the study-word row, not mushaf glyphs" for the opt-in mushaf view.
- **Hub: custom range and recent.** "Custom" is always a range pill and opens From / To ayah steppers (long-press steps by 10) seeded with the current range; a range picked in the passage sheet also lands there. A "Recent" card restarts one of the last three passages in its mode with one tap.
- **Deviations kept on purpose.** Audio is fed in 480 ms chunks rather than the 100–200 ms in §7 (the 2 s drop-oldest queue and the no-concurrent-feed rule are unchanged); re-check against highlight latency in the Phase 3 run and lower it if words light up late. Web inference runs on the page thread with single-threaded wasm — no Worker (the desktop Node run decoded at about 10× real time, which leaves headroom). The next ayah is the Next control or the ayah chips; there is no swipe gesture (the spec allows either). Only the recommended engine is web-hosted.
- **Tests added in the gap review:** `db/repositories/quran-companion-repositories.test.ts` (30-item cap, round-trips, newer-schema blobs left untouched, full-hafiz map under 600 KB), `lib/quran-companion/reminder-options.test.ts` (scheduler options read straight from the repositories), and `wipe-local-data.test.ts` (listener and pronunciation files removed). The two merge suites in §12 are one file, `merge.test.ts`.

---

## 24. What is still open

Nothing below can be closed from the repository alone.

| Item | Needs | Where it is tracked |
|---|---|---|
| Phase 3 device checklist on one iPhone and one Android phone: PCM delivery, latency, release-build model load, 16 KB alignment, store size, headsets, calls, playback after a session, battery | Physical phones, a release build | §11 Phase 3, §17 pending rows |
| iOS: compile the Swift side of `munib-tajweedformer` and `pnpm prebuild:app:tv:ios` | A Mac | §17 |
| Web: Safari capture, recognition quality, production static export | A browser session on the deployed build | §17 Web wasm |
| VoiceOver / TalkBack pass on hub, session, summary and settings | Devices | §11 Phase 5 |
| Deploy the API (sync entity names + 2 MB body limit) before any app build that pushes the new blobs | Deployment | §10 Release order, O4 |
| App Store privacy labels and Play Data safety answers (copy is in `docs/IOS_APP_COPY.md` / `docs/ANDROID_APP_COPY.md`) | Store consoles | §20 |
| Quran Lab: merged Android permissions from a release APK, which calibration heads are `validated` on device | Release APK, device | §17 |
| Tune the 10% uncertain cap for the ladder | Device checklist results | O2 |
| Review `minimumReleaseAgeExclude` for `@quran-lab/tajweedformer` | Before release | §23 |
| Admin module 15 `/quran-practice` is built (aggregates only). Confirm the memorization SQL against production Postgres, where `sync_records.data` is `text` | A production read | `docs/ADMIN.md` |
