import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { RECITATION_MODELS } from "@/constants/recitation-models";
import { quranComRecitationId } from "@/constants/tajweed";
import { useAyahWordSegments } from "@/hooks/use-quran";
import { setTaggedKeepAwake } from "@/lib/audio-keep-awake";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { singleAyahTrack } from "@/lib/quran-audio";
import { alignPracticeWords } from "@/lib/quran-companion/align-words";
import { enterRecordMode, restorePlaybackMode } from "@/lib/quran-companion/audio/audio-mode";
import { useRecitationCapture } from "@/lib/quran-companion/audio/capture";
import type { MicPermission, RecitationCapture } from "@/lib/quran-companion/audio/types";
import type { RecitationEngine } from "@/lib/quran-companion/engine/types";
import { reportPracticeError, toPracticeErrorCode } from "@/lib/quran-companion/error-codes";
import { isListenerUsable } from "@/lib/quran-companion/model/download-job";
import { modeNeedsListener, passageAyahs } from "@/lib/quran-companion/passage";
import {
  beginTake,
  createAyahState,
  createSessionState,
  reduceSession,
  type SessionState,
  tryAgainIndexes,
  withAyah,
} from "@/lib/quran-companion/reduce-session";
import { buildPracticeSummary, ladderOutcomes } from "@/lib/quran-companion/summary";
import type {
  CompanionEvent,
  Passage,
  PracticeErrorCode,
  PracticeMode,
  PracticeSummary,
  SessionMode,
} from "@/lib/quran-companion/types";
import { activeWordIndexAt } from "@/lib/quran-word-timing";
import { claimMicrophone, releaseMicrophone } from "@/lib/speech/mic-owner";
import { useAudioPlayerContext, useAudioProgressContext } from "@/providers/audio-player-provider";
import { useStore } from "@/stores/create-store";
import { quranCompanionPrefsStore, useCompanionPrefs } from "@/stores/quran-companion-prefs-store";
import {
  loadInstalledModel,
  quranListenerStore,
  useListenerState,
} from "@/stores/quran-listener-store";
import { quranMemorizationStore } from "@/stores/quran-memorization-store";
import { quranPracticeStore } from "@/stores/quran-practice-store";
import { useQuranPrefs } from "@/stores/quran-store";

import { type PracticeAyahText, usePracticeAyahText } from "./use-practice-ayah-text";

/**
 * Practice session controller (§7, §8, §9.2). One ayah on screen at a time; a
 * take is one ayah: tap the mic to start, tap again to finish (never on silence).
 * Backgrounding or a call stops the mic and leaves the route idle. Leaving the
 * route disposes the engine and releases the recorder in `finally`.
 */

export const PRACTICE_KEEP_AWAKE_TAG = "munib-quran-practice";

/** Tail after the last word is reached before the take ends by itself. */
const AUTO_FINISH_TAIL_MS = 1200;
/** How long a clean ayah's result stays up before Follow moves on. */
const AUTO_ADVANCE_DELAY_MS = 2500;

export type EngineStatus = "loading" | "ready" | "listen-only" | "failed";

export type MicState = "idle" | "starting" | "listening" | "settling";

export type UsePracticeSessionResult = {
  passage: Passage;
  /** Mode the text is shown in (revision resolves to a hide mode or the chosen default). */
  displayMode: PracticeMode;
  ayahs: number[];
  index: number;
  ayah: number;
  row: PracticeAyahText | undefined;
  rows: Record<number, PracticeAyahText>;
  surahWordCounts: Record<number, number> | null;
  hiddenOf: (ayah: number) => Set<number>;
  wordsLoading: boolean;
  session: SessionState;
  engineStatus: EngineStatus;
  engineError: PracticeErrorCode | null;
  confirmsMismatches: boolean;
  mic: MicState;
  micPermission: MicPermission | null;
  /** Ayahs whose take is settled — hide modes reveal them, try-again lines show. */
  settledAyahs: Set<number>;
  /** Hidden study word indexes for the current ayah (hide modes). */
  hidden: Set<number>;
  /** Active word while Hear plays (recitation timing), else null. */
  hearWordIndex: number | null;
  isHearing: boolean;
  tryAgain: number[];
  toggleMic: () => Promise<void>;
  hear: () => Promise<void>;
  hearWord: (index: number) => Promise<void>;
  revealNext: () => void;
  revealAll: () => void;
  retry: () => void;
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  finish: () => Promise<PracticeSummary>;
};

const WORDS_WAIT_MS = 1500;
const EMPTY_SET: Set<number> = new Set();
const EMPTY_ROWS: Record<number, PracticeAyahText> = {};

function resolveDisplayMode(mode: SessionMode, defaultMode: PracticeMode): PracticeMode {
  if (mode !== "revision") return mode;
  return defaultMode === "follow" ? "hide-ayahs" : defaultMode;
}

function initialHidden(mode: PracticeMode, wordCount: number): Set<number> {
  if (mode === "hide-words") {
    // Keep the first word as a cue; hide the rest.
    return new Set(Array.from({ length: Math.max(0, wordCount - 1) }, (_, i) => i + 1));
  }
  if (mode === "hide-ayahs") return new Set(Array.from({ length: wordCount }, (_, i) => i));
  return new Set();
}

export function usePracticeSession(input: {
  passage: Passage;
  mode: SessionMode;
  language: string;
  surahName: string;
}): UsePracticeSessionResult {
  const { passage, mode, language, surahName } = input;
  const prefs = useCompanionPrefs();
  const quranPrefs = useQuranPrefs();
  const listener = useListenerState();
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const audio = useAudioPlayerContext();
  const progress = useAudioProgressContext();

  const displayMode = resolveDisplayMode(mode, prefs.defaultMode);
  const ayahs = useMemo(() => passageAyahs(passage), [passage]);
  const {
    rows: liveRows,
    wordsLoading,
    surahWordCounts,
  } = usePracticeAyahText(passage.surah, ayahs, language);
  // Hold the word row until the study words arrive (or a short wait passes), so the
  // ayah is laid out once instead of reflowing from the whitespace fallback (§6).
  const [wordsWaitOver, setWordsWaitOver] = useState(false);
  useEffect(() => {
    if (!wordsLoading) return;
    const timer = setTimeout(() => setWordsWaitOver(true), WORDS_WAIT_MS);
    return () => clearTimeout(timer);
  }, [wordsLoading]);
  const textReady = !wordsLoading || wordsWaitOver;
  const rows = useMemo(() => (textReady ? liveRows : EMPTY_ROWS), [liveRows, textReady]);

  const [index, setIndex] = useState(0);
  const ayah = ayahs[Math.min(index, ayahs.length - 1)] ?? passage.ayahStart;
  const row = rows[ayah];

  // ── Engine ────────────────────────────────────────────────────────────────
  const engineRef = useRef<RecitationEngine | null>(null);
  const [engineStatus, setEngineStatus] = useState<EngineStatus>("loading");
  const [engineError, setEngineError] = useState<PracticeErrorCode | null>(null);
  const listenerUsable = isListenerUsable(listener) && !isTV();
  // Until the listener store has read its manifest, the state is unknown — stay
  // "loading" rather than flashing listen-only and back (dock + captions flicker).
  const listenerLoaded = useStore(quranListenerStore, (st) => st.isReady);
  // expo-audio's `useAudioStream` owns the native stream on iOS / Android; the
  // capture is stable for the session, the ref keeps callbacks off its identity.
  const capture = useRecitationCapture();
  const captureRef = useRef<RecitationCapture | null>(capture);
  captureRef.current = capture;

  useEffect(() => {
    let cancelled = false;
    if (!listenerLoaded && !isTV()) return;
    if (!listenerUsable || !captureRef.current?.available) {
      setEngineStatus("listen-only");
      return;
    }
    setEngineStatus((current) => (current === "ready" && engineRef.current ? current : "loading"));
    if (engineRef.current) {
      setEngineStatus("ready");
      return;
    }
    void (async () => {
      try {
        const { manifest, assets } = await loadInstalledModel();
        // Lazy: the engine (and @tilawa/core) load only from the practice route (§7).
        const { createPlatformEngine } = await import("@/lib/quran-companion/engine/tilawa");
        const engine = await createPlatformEngine(manifest.engine, assets);
        if (cancelled) {
          await engine.dispose();
          return;
        }
        engineRef.current = engine;
        setEngineStatus("ready");
      } catch (error) {
        if (cancelled) return;
        const code = toPracticeErrorCode(error, "engine-init-failed");
        reportPracticeError(error, code, "session-init");
        setEngineError(code);
        setEngineStatus("failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [listenerLoaded, listenerUsable]);

  // ── Session state ─────────────────────────────────────────────────────────
  const [session, setSession] = useState<SessionState>(() => createSessionState());
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const apply = useCallback((fn: (s: SessionState) => SessionState) => {
    setSession((prev) => {
      const next = fn(prev);
      sessionRef.current = next;
      return next;
    });
  }, []);

  // Build/refresh each ayah row once its words (and the engine's words) are known.
  useEffect(() => {
    const engine = engineStatus === "ready" ? engineRef.current : null;
    apply((prev) => {
      let next = prev;
      for (const a of ayahs) {
        const r = rows[a];
        if (!r) continue;
        const existing = prev.ayahs[a];
        const engineWords = engine?.engineWords(passage.surah, a) ?? [];
        const sameWords = existing && existing.words.join(" ") === r.words.join(" ");
        const hasAlignment = !!existing?.alignment;
        if (sameWords && hasAlignment === (engine != null && engineWords.length > 0)) continue;
        if (existing?.takes) continue; // never reflow a row that already has marks
        const alignment =
          engine && engineWords.length ? alignPracticeWords(r.arabic, r.words, engineWords) : null;
        next = withAyah(next, createAyahState(a, r.words, alignment));
      }
      return next;
    });
  }, [apply, ayahs, engineStatus, passage.surah, rows]);

  // ── Hidden words (hide modes) ─────────────────────────────────────────────
  const [hiddenByAyah, setHiddenByAyah] = useState<Record<number, Set<number>>>({});
  const hidden = useMemo(() => {
    if (displayMode !== "hide-words" && displayMode !== "hide-ayahs") return new Set<number>();
    return hiddenByAyah[ayah] ?? initialHidden(displayMode, row?.words.length ?? 0);
  }, [ayah, displayMode, hiddenByAyah, row?.words.length]);

  const setHidden = useCallback(
    (fn: (current: Set<number>) => Set<number>) => {
      setHiddenByAyah((prev) => ({ ...prev, [ayah]: fn(hidden) }));
    },
    [ayah, hidden],
  );

  const revealNext = useCallback(() => {
    if (displayMode === "hide-ayahs") {
      setHidden(() => new Set());
      return;
    }
    setHidden((current) => {
      const sorted = [...current].sort((a, b) => a - b);
      const next = new Set(current);
      if (sorted.length) next.delete(sorted[0]);
      return next;
    });
  }, [displayMode, setHidden]);

  const revealAll = useCallback(() => setHidden(() => new Set()), [setHidden]);

  /** Hidden words of any ayah in the passage (page and mushaf views show several). */
  const hiddenOf = useCallback(
    (a: number): Set<number> => {
      if (a === ayah) return hidden;
      if (displayMode !== "hide-words" && displayMode !== "hide-ayahs") return EMPTY_SET;
      return hiddenByAyah[a] ?? initialHidden(displayMode, rows[a]?.words.length ?? 0);
    },
    [ayah, displayMode, hidden, hiddenByAyah, rows],
  );

  // Matched words reveal themselves in Hide words.
  const ayahState = session.ayahs[ayah];
  useEffect(() => {
    if (displayMode !== "hide-words" || !ayahState) return;
    const heard = ayahState.states
      .map((s, i) => (s === "matched" || s === "corrected" ? i : -1))
      .filter((i) => i >= 0 && hidden.has(i));
    if (heard.length) {
      setHidden((current) => {
        const next = new Set(current);
        for (const i of heard) next.delete(i);
        return next;
      });
    }
  }, [ayahState, displayMode, hidden, setHidden]);

  // ── Mic + take lifecycle ──────────────────────────────────────────────────
  // Mic-owner preemption (another feature started listening): end the take like a
  // call would. Stable identity for the whole screen; the latest stopTake via ref.
  const stopTakeRef = useRef<(reason: "interrupted") => Promise<void>>(async () => {});
  const onMicPreempted = useCallback(() => stopTakeRef.current("interrupted"), []);
  const [mic, setMicState] = useState<MicState>("idle");
  const micRef = useRef<MicState>("idle");
  // The ref moves synchronously so awaits in toggleMic / stopTake see the latest state.
  const setMic = useCallback((next: MicState) => {
    micRef.current = next;
    setMicState(next);
  }, []);
  /** Read through a function: TS would keep `micRef.current` narrowed across awaits. */
  const isMicStarting = useCallback(() => micRef.current === "starting", []);
  const [micPermission, setMicPermission] = useState<MicPermission | null>(null);
  const [settledAyahs, setSettledAyahs] = useState<Set<number>>(new Set());
  const visitedRef = useRef<Set<number>>(new Set([passage.ayahStart]));
  const startedAtRef = useRef(new Date());
  const engineRanRef = useRef(false);
  const takeAyahRef = useRef<number | null>(null);
  const lastHapticRef = useRef(0);

  useEffect(() => {
    visitedRef.current.add(ayah);
  }, [ayah]);

  useEffect(() => {
    void captureRef.current?.getPermission().then(setMicPermission);
  }, []);

  // Engine events → reducer.
  useEffect(() => {
    const engine = engineStatus === "ready" ? engineRef.current : null;
    if (!engine) return;
    return engine.subscribe((event: CompanionEvent) => {
      if (event.type === "failed") {
        // Keep the text up; one caption; Reveal keeps working (§9.2).
        setEngineError(event.code);
        releaseMicrophone(onMicPreempted);
        void captureRef.current?.stop();
        void restorePlaybackMode();
        setMic("idle");
      }
      if (event.type === "position" && prefsRef.current.feedbackTiming !== "end") {
        const now = Date.now();
        // One light tap per newly settled word, not per audio frame.
        const before =
          sessionRef.current.ayahs[event.ayah]?.states.filter((s) => s === "matched").length ?? 0;
        const after = reduceSession(sessionRef.current, event).ayahs[event.ayah]?.states.filter(
          (s) => s === "matched",
        ).length;
        if ((after ?? 0) > before && now - lastHapticRef.current > 180) {
          lastHapticRef.current = now;
          triggerHaptic("light");
        }
      }
      apply((s) => reduceSession(s, event));
    });
  }, [apply, engineStatus, onMicPreempted, setMic]);

  const stopTake = useCallback(
    async (reason: "user" | "background" | "interrupted" | "leave") => {
      const state = micRef.current;
      if (state !== "listening" && state !== "starting") return;
      setMic("settling");
      releaseMicrophone(onMicPreempted);
      try {
        await captureRef.current?.stop();
      } catch {
        // already stopped
      }
      await restorePlaybackMode();
      const engine = engineRef.current;
      try {
        if (engine && reason !== "leave") await engine.stop();
      } catch (error) {
        reportPracticeError(error, toPracticeErrorCode(error, "engine-runtime"), "take-stop");
      }
      const taken = takeAyahRef.current;
      takeAyahRef.current = null;
      if (taken != null && reason !== "leave") {
        setSettledAyahs((prev) => new Set(prev).add(taken));
        if (displayMode === "hide-ayahs") {
          setHiddenByAyah((prev) => ({ ...prev, [taken]: new Set() }));
        }
      }
      setMic("idle");
    },
    [displayMode, onMicPreempted, setMic],
  );
  stopTakeRef.current = stopTake;

  const toggleMic = useCallback(async () => {
    if (micRef.current === "listening" || micRef.current === "starting") {
      await stopTake("user");
      return;
    }
    const engine = engineRef.current;
    const capture = captureRef.current;
    if (!engine || engineStatus !== "ready" || !capture?.available) return;
    let permission = await capture.getPermission();
    if (permission !== "granted") permission = await capture.requestPermission();
    setMicPermission(permission);
    if (permission !== "granted") return;

    setMic("starting");
    // Hearing the reference and the take never overlap (§7.6).
    audio.stop();
    await claimMicrophone("quran-practice", onMicPreempted);
    await enterRecordMode();
    takeAyahRef.current = ayah;
    setSettledAyahs((prev) => {
      const next = new Set(prev);
      next.delete(ayah);
      return next;
    });
    apply((s) => beginTake(s, ayah));
    const engineMode = modeNeedsListener(displayMode) ? "correction" : "tracking";
    try {
      await engine.start({ surah: passage.surah, ayahStart: ayah, ayahEnd: ayah }, engineMode);
      await capture.start(
        (pcm) => engine.feed(pcm),
        (status) => {
          if (status.interrupted) void stopTake("interrupted");
        },
      );
      if (!isMicStarting()) {
        // Stopped while starting (background, a call, another listener): close the mic.
        releaseMicrophone(onMicPreempted);
        await capture.stop().catch(() => {});
        return;
      }
      engineRanRef.current = true;
      setMic("listening");
    } catch (error) {
      const code = toPracticeErrorCode(error, "capture-failed");
      if ((error as { code?: string })?.code === "mic-denied" || code === "mic-denied")
        setMicPermission("denied");
      reportPracticeError(error, code, "take-start");
      takeAyahRef.current = null;
      releaseMicrophone(onMicPreempted);
      await capture.stop().catch(() => {});
      await restorePlaybackMode();
      setMic("idle");
    }
  }, [
    apply,
    audio,
    ayah,
    displayMode,
    engineStatus,
    isMicStarting,
    onMicPreempted,
    passage.surah,
    setMic,
    stopTake,
  ]);

  // Auto-finish: once the engine has reached the ayah's last word (nothing left
  // "upcoming"), end the take after a short tail so the person is never left
  // staring at a fully marked ayah with the mic still open. This is a word-progress
  // signal, not a silence timeout — a pause mid-ayah never ends the take (§7.4).
  const ayahComplete =
    mic === "listening" &&
    !!ayahState?.alignment &&
    ayahState.reached &&
    ayahState.states.length > 0 &&
    ayahState.states.every((s) => s !== "upcoming");
  useEffect(() => {
    if (!ayahComplete) return;
    const timer = setTimeout(() => void stopTake("user"), AUTO_FINISH_TAIL_MS);
    return () => clearTimeout(timer);
  }, [ayahComplete, stopTake]);

  // Background or a call: stop the mic, keep the partial summary, never auto-restart (§9.2).
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active") void stopTake("background");
    });
    return () => sub.remove();
  }, [stopTake]);

  // Keep the screen awake while this route is focused (own tag, released on blur).
  useFocusEffect(
    useCallback(() => {
      if (!prefs.keepAwake) return;
      void setTaggedKeepAwake(PRACTICE_KEEP_AWAKE_TAG, true);
      return () => {
        void setTaggedKeepAwake(PRACTICE_KEEP_AWAKE_TAG, false);
      };
    }, [prefs.keepAwake]),
  );

  // Leaving the route: dispose the engine and release the recorder in `finally`.
  useEffect(() => {
    return () => {
      const capture = captureRef.current;
      const engine = engineRef.current;
      engineRef.current = null;
      releaseMicrophone(onMicPreempted);
      // Best-effort teardown: a failing step must neither skip the others nor
      // escape as an unhandled rejection from this fire-and-forget cleanup.
      void (async () => {
        const steps = [() => capture?.stop(), restorePlaybackMode, () => engine?.dispose()];
        for (const step of steps) {
          try {
            await step();
          } catch {
            // ignore — the screen is gone; nothing left to report to
          }
        }
      })();
    };
  }, [onMicPreempted]);

  // ── Hear (reference recitation) ───────────────────────────────────────────
  const recitationId = quranComRecitationId(quranPrefs.preferredReciterDir);
  const trackId = `${passage.surah}:${ayah}`;
  const isHearing = audio.isPlaying && audio.current?.id === trackId;
  const segmentsQuery = useAyahWordSegments(recitationId, passage.surah, ayah, isHearing);
  const hearWordIndex = useMemo(() => {
    if (!isHearing) return null;
    return activeWordIndexAt(progress.position, segmentsQuery.data ?? null, {
      wordCount: row?.words.length,
      durationSec: audio.duration,
    });
  }, [audio.duration, isHearing, progress.position, row?.words.length, segmentsQuery.data]);

  const hear = useCallback(async () => {
    if (micRef.current === "listening" || micRef.current === "starting") await stopTake("user");
    await restorePlaybackMode();
    if (isHearing) {
      audio.stop();
      return;
    }
    audio.play(
      [singleAyahTrack(quranPrefs.preferredReciterDir, surahName, passage.surah, ayah)],
      0,
      {
        sourceHref: `/quran/${passage.surah}?ayah=${ayah}`,
      },
    );
  }, [audio, ayah, isHearing, passage.surah, quranPrefs.preferredReciterDir, stopTake, surahName]);

  const hearWord = useCallback(
    async (wordIndex: number) => {
      if (micRef.current === "listening" || micRef.current === "starting") await stopTake("user");
      await restorePlaybackMode();
      const url = row?.wordAudio[wordIndex];
      if (url) {
        audio.play(
          [
            {
              id: `word:${trackId}:${wordIndex}`,
              title: surahName,
              subtitle: row?.words[wordIndex] ?? "",
              uri: url,
            },
          ],
          0,
        );
        return;
      }
      // No cached word audio → the whole ayah.
      audio.play(
        [singleAyahTrack(quranPrefs.preferredReciterDir, surahName, passage.surah, ayah)],
        0,
      );
    },
    [audio, ayah, passage.surah, quranPrefs.preferredReciterDir, row, stopTake, surahName, trackId],
  );

  // "Hear before recite": once (first ayah) or every ayah. Never on by default.
  // Fires when the ayah on screen changes only — refs keep it off the other deps.
  const heardOnceRef = useRef(false);
  const hearRef = useRef(hear);
  hearRef.current = hear;
  const hearModeRef = useRef(prefs.hearBeforeRecite);
  hearModeRef.current = prefs.hearBeforeRecite;
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run only when the ayah changes
  useEffect(() => {
    const modeNow = hearModeRef.current;
    if (modeNow === "off") return;
    if (modeNow === "once" && heardOnceRef.current) return;
    heardOnceRef.current = true;
    void hearRef.current();
  }, [ayah]);

  // ── Navigation within the range ───────────────────────────────────────────
  const goTo = useCallback(
    (nextIndex: number) => {
      if (micRef.current === "listening" || micRef.current === "starting") return;
      setIndex(Math.max(0, Math.min(ayahs.length - 1, nextIndex)));
    },
    [ayahs.length],
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const previous = useCallback(() => goTo(index - 1), [goTo, index]);
  const retry = useCallback(() => {
    setHiddenByAyah((prev) => {
      const copy = { ...prev };
      delete copy[ayah];
      return copy;
    });
    setSettledAyahs((prev) => {
      const nextSet = new Set(prev);
      nextSet.delete(ayah);
      return nextSet;
    });
    apply((s) => {
      const a = s.ayahs[ayah];
      return a
        ? withAyah(s, { ...createAyahState(ayah, a.words, a.alignment), takes: a.takes })
        : s;
    });
  }, [apply, ayah]);

  const tryAgain = useMemo(
    () => (ayahState && settledAyahs.has(ayah) ? tryAgainIndexes(ayahState) : []),
    [ayah, ayahState, settledAyahs],
  );

  // Auto-advance: Follow only, and only after a clean ayah (every word heard).
  // The result card stays up long enough to read before moving on.
  const cleanAyah =
    !!ayahState && ayahState.states.every((st) => st === "matched" || st === "corrected");
  useEffect(() => {
    if (!prefs.autoAdvance || displayMode !== "follow" || mode === "revision") return;
    if (!settledAyahs.has(ayah) || tryAgain.length || !cleanAyah || index >= ayahs.length - 1)
      return;
    const timer = setTimeout(() => goTo(index + 1), AUTO_ADVANCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [
    ayah,
    ayahs.length,
    cleanAyah,
    displayMode,
    goTo,
    index,
    mode,
    prefs.autoAdvance,
    settledAyahs,
    tryAgain.length,
  ]);

  // ── Finish ────────────────────────────────────────────────────────────────
  const finish = useCallback(async () => {
    await stopTake("user");
    audio.stop();
    const engine = engineRef.current;
    const engineRan = engineRanRef.current && engine != null;
    const spec = engine ? RECITATION_MODELS[engine.id] : null;
    const summary = buildPracticeSummary({
      state: sessionRef.current,
      visited: visitedRef.current,
      passage,
      mode,
      startedAt: startedAtRef.current,
      endedAt: new Date(),
      engine: engineRan && engine ? engine.id : "none",
      engineVersion: engineRan && spec ? spec.version : "",
      confirmsMismatches: engine?.confirmsMismatches ?? false,
    });
    const outcomes = ladderOutcomes({
      state: sessionRef.current,
      visited: visitedRef.current,
      surah: passage.surah,
      mode: mode === "revision" ? "revision" : displayMode,
      engineRan,
    });
    await quranPracticeStore.getState().addSummary(summary);
    await quranMemorizationStore.getState().applyOutcomes(outcomes);
    if (mode !== "revision") {
      await quranCompanionPrefsStore.getState().update({
        lastPassage: { ...passage, mode: displayMode },
        coachDismissed: true,
      });
    } else if (!prefs.coachDismissed) {
      await quranCompanionPrefsStore.getState().update({ coachDismissed: true });
    }
    return summary;
  }, [audio, displayMode, mode, passage, prefs.coachDismissed, stopTake]);

  return {
    passage,
    displayMode,
    ayahs,
    index,
    ayah,
    row,
    rows,
    surahWordCounts,
    wordsLoading,
    session,
    engineStatus,
    engineError,
    confirmsMismatches: engineRef.current?.confirmsMismatches ?? false,
    mic,
    micPermission,
    settledAyahs,
    hidden,
    hiddenOf,
    hearWordIndex,
    isHearing,
    tryAgain,
    toggleMic,
    hear,
    hearWord,
    revealNext,
    revealAll,
    retry,
    next,
    previous,
    goTo,
    finish,
  };
}
