import { useIsFocused } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  useVoiceTasbeeh,
  type VoiceStartResult,
  type VoiceTasbeeh,
} from "@/hooks/use-voice-tasbeeh";
import type { VoiceStopReason } from "@/lib/tasbeeh-voice/session";
import { stepVoiceDecision, VOICE_RESUME_DELAY_MS } from "@/lib/tasbeeh-voice/steps";
import { sameVoiceZikr, type VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";

type Options = {
  /** The zikr of the step on screen (null = nothing to listen for). */
  zikr: VoiceZikr | null;
  /** This step can be counted hands-free (`isHandsFreeStep`). */
  eligible: boolean;
  count: number;
  target: number;
  /** A counting step is showing (not advancing to the next, not finished). */
  active: boolean;
  /** The screen's single counting path — the same one a tap uses. */
  onVoiceCount: () => void;
};

export type VoiceSteps = {
  voice: VoiceTasbeeh;
  /** The platform can listen (never on TV): show the hands-free toggle. */
  offered: boolean;
  /** This step can be counted by voice. */
  eligible: boolean;
  /** Hands-free is switched on for this screen. */
  on: boolean;
  /** Untaught zikr: "teach it, or count every pause?" (D50). */
  needsChoice: boolean;
  /** The current step is at its target (the next one is coming). */
  atLimit: boolean;
  /** Why hands-free switched itself off (silence, background, …). */
  stopNotice: VoiceStopReason | null;
  /** First use / microphone permission sheet. */
  sheetOpen: boolean;
  toggle: () => void;
  teach: () => void;
  skipTeaching: () => void;
  closeSheet: () => void;
};

function identityOf(zikr: VoiceZikr | null): string {
  return zikr ? `${zikr.key ?? "other"}|${zikr.label ?? ""}` : "";
}

/**
 * Hands-free counting that follows a run of zikr (D69): guided adhkar sessions
 * switch it on once and it moves with them. Each step listens for its own zikr —
 * by the taught voice pattern when there is one, otherwise by pauses once the
 * person chose "Skip — count every pause" — and every repeat goes through the
 * screen's own counting path, so taps keep working to correct a miscount (D51).
 *
 * The microphone is open only while a counting step is active: it closes when a
 * step reaches its target (and reopens on the next one after a short pause),
 * when the screen is covered or left, in the background, and on unmount.
 */
export function useVoiceTasbeehSteps({
  zikr,
  eligible,
  count,
  target,
  active,
  onVoiceCount,
}: Options): VoiceSteps {
  const focused = useIsFocused();
  const [on, setOn] = useState(false);
  const [pausePreferred, setPausePreferred] = useState(false);
  const [stopNotice, setStopNotice] = useState<VoiceStopReason | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Screens rebuild the zikr object every render: keep one per identity.
  const stableZikr = useRef(zikr);
  if (!sameVoiceZikr(stableZikr.current, zikr)) stableZikr.current = zikr;
  const current = eligible ? stableZikr.current : null;
  const identity = identityOf(current);
  const atLimit = target > 0 && count >= target;

  const countRef = useRef(onVoiceCount);
  countRef.current = onVoiceCount;
  const voice = useVoiceTasbeeh({
    zikr: current,
    atLimit,
    onVoiceCount: () => countRef.current(),
    onAutoStop: (reason) => {
      // Target: the next step reopens the microphone. Anything else switches off.
      if (reason === "target") return;
      setOn(false);
      setStopNotice(reason);
    },
  });
  const voiceRef = useRef(voice);
  voiceRef.current = voice;

  const busy = voice.listening || voice.preparing;
  const teaching = voice.teach.status === "recording";

  // Which zikr the open microphone is listening for.
  const listeningFor = useRef<string | null>(null);
  if (!busy) listeningFor.current = null;
  else if (listeningFor.current === null) listeningFor.current = identity;

  // "Skip — count every pause" chosen in the first-use sheet applies to the next steps too.
  useEffect(() => {
    if (voice.listening && voice.countingMode === "pause" && !voice.taught) setPausePreferred(true);
  }, [voice.listening, voice.countingMode, voice.taught]);

  const decision = stepVoiceDecision({
    on,
    eligible: eligible && voice.available,
    active: active && focused,
    atLimit,
    taught: voice.taught,
    pausePreferred,
    busy,
    teaching,
    listeningOther: busy && listeningFor.current !== identity,
    blocked: sheetOpen,
  });

  const handleStartResult = useCallback((result: VoiceStartResult) => {
    if (result === "started") return;
    if (result === "needs-permission" || result === "denied" || result === "needs-model") {
      setSheetOpen(true);
      return;
    }
    if (result === "error") {
      setOn(false);
      setStopNotice("error");
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: acts once per decision and step.
  useEffect(() => {
    const live = voiceRef.current;
    if (decision === "stop") {
      live.stop("user");
      return;
    }
    if (decision === "cancel-teach") {
      live.cancelTeaching();
      return;
    }
    if (decision !== "start" && decision !== "start-pause") return;
    const timer = setTimeout(() => {
      void voiceRef.current
        .start(decision === "start-pause" ? { skipTeaching: true } : undefined)
        .then(handleStartResult);
    }, VOICE_RESUME_DELAY_MS);
    return () => clearTimeout(timer);
  }, [decision, identity]);

  const toggle = useCallback(() => {
    const live = voiceRef.current;
    setStopNotice(null);
    if (on) {
      setOn(false);
      if (live.listening || live.preparing) live.stop("user");
      if (live.teach.status === "recording") live.cancelTeaching();
      return;
    }
    setOn(true);
    // First use: the sheet explains what stays on the device and asks for the microphone.
    if (live.permission !== "granted") setSheetOpen(true);
  }, [on]);

  const teach = useCallback(() => {
    void voiceRef.current.startTeaching().then(handleStartResult);
  }, [handleStartResult]);

  const skipTeaching = useCallback(() => setPausePreferred(true), []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    const live = voiceRef.current;
    // "Not now" (nothing started) switches hands-free back off.
    if (!live.listening && !live.preparing && live.teach.status !== "recording") setOn(false);
  }, []);

  return {
    voice,
    offered: voice.platformAvailable,
    eligible,
    on,
    needsChoice: decision === "choose",
    atLimit,
    stopNotice: on ? null : stopNotice,
    sheetOpen,
    toggle,
    teach,
    skipTeaching,
    closeSheet,
  };
}
