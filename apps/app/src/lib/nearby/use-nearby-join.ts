import {
  NEARBY_ERROR_CODES,
  NEARBY_LIMITS,
  NEARBY_SERVICE_UUID_PREFIX,
  type NearbyPurpose,
} from "@munib-tracker/shared/circles/nearby";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AppState, Platform } from "react-native";

import {
  cancelNearbyRequest,
  circleErrorCode,
  circleErrorStatus,
  type NearbySessionPreview,
  nearbyRequestStatus,
  previewNearbySession,
  requestNearbyJoin,
} from "@/lib/circles/api";
import { saveChildSession } from "@/lib/circles/child-session";
import { circleKeys, useCircleAuth } from "@/lib/circles/hooks";

import {
  blockReasonForError,
  NEARBY_JOIN_IDLE,
  type NearbyBeacons,
  type NearbyJoinError,
  type NearbyJoinState,
  type NearbyListItem,
  nearbyJoinReducer,
  nearbyListItems,
  nearbyPreflight,
  pruneBeacons,
  recordBeacon,
  shouldScan,
} from "./machine";
import {
  addNearbyListener,
  isNearbyAvailable,
  type NearbyStopReason,
  nearbyErrorCode,
  nearbyLocationServicesEnabled,
  nearbyRadioState,
  startNearbyScanning,
  stopNearbyScanning,
} from "./native";
import {
  checkNearbyPermission,
  nearbyScanNeedsLocationServices,
  requestNearbyPermission,
} from "./permissions";
import { nearbyScanStartLimiter } from "./scan-throttle";

const PRUNE_EVERY_MS = 2_000;

type ScanPauseReason = Extract<NearbyJoinState, { kind: "paused" }>["reason"];

/** Native scan stop → why the list is paused (an OS teardown reads as "background"). */
const SCAN_PAUSE_REASONS: Record<NearbyStopReason, ScanPauseReason> = {
  timeout: "timeout",
  background: "background",
  bluetoothOff: "bluetoothOff",
  error: "error",
  destroyed: "background",
};
const SCAN_MS = NEARBY_LIMITS.sessionTtlMinutes * 60_000;

export type NearbyJoin = {
  state: NearbyJoinState;
  /** Discovered circles (closest first). */
  items: NearbyListItem[];
  /** Preview of the circle being confirmed / asked. */
  selected: NearbySessionPreview | null;
  start: () => Promise<void>;
  grant: () => Promise<void>;
  select: (sessionId: string) => void;
  back: () => void;
  /** "They match" → send the request (D44). */
  confirm: (displayName?: string) => Promise<void>;
  /** Close the sheet: stop scanning, withdraw a pending request. */
  close: () => void;
};

/** API error → what the confirm step tells the joiner. */
export function nearbyJoinErrorOf(error: unknown): NearbyJoinError {
  const status = circleErrorStatus(error);
  const code = circleErrorCode(error);
  if (code === NEARBY_ERROR_CODES.matchMismatch) return "mismatch";
  if (code === NEARBY_ERROR_CODES.alreadyMember) return "alreadyMember";
  if (status === 401) return "needsAccount";
  if (status === 404 || status === 410) return "gone";
  if (status === 429) return "busy";
  return "offline";
}

/**
 * Joiner side of NF-3.25: scan only while the "Join nearby" sheet is open
 * (and in the foreground), list nearby circles, show the 4 digits to compare
 * (D44), send the request, then wait for the host's decision (D42). A child's
 * device (`purpose: "child_link"`) asks without an account and stores the
 * scoped child session it gets back.
 */
export function useNearbyJoin({ purpose }: { purpose: NearbyPurpose }): NearbyJoin {
  const auth = useCircleAuth();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(nearbyJoinReducer, NEARBY_JOIN_IDLE);
  const [beacons, setBeacons] = useState<NearbyBeacons>({});
  const [previews, setPreviews] = useState<Record<string, NearbySessionPreview | null>>({});
  const fetched = useRef(new Set<string>());
  const stateRef = useRef(state);
  stateRef.current = state;

  const start = useCallback(async () => {
    const permission = await checkNearbyPermission("scan");
    const result = nearbyPreflight({
      available: isNearbyAvailable(),
      permission,
      radio: nearbyRadioState(),
      locationServices: nearbyScanNeedsLocationServices() ? nearbyLocationServicesEnabled() : true,
    });
    dispatch({ type: "preflight", result });
  }, []);

  const grant = useCallback(async () => {
    const permission = await requestNearbyPermission("scan");
    if (permission !== "granted") {
      dispatch({
        type: "blocked",
        reason: permission === "blocked" ? "permissionBlocked" : "permissionDenied",
      });
      return;
    }
    await start();
  }, [start]);

  // Radio on only while the list / confirm step is showing.
  const scanning = shouldScan(state);
  useEffect(() => {
    if (!scanning) return;
    let active = true;
    const offFound = addNearbyListener("onDiscovered", (event) => {
      setBeacons((current) => recordBeacon(current, event, Date.now()));
    });
    const offStopped = addNearbyListener("onStopped", (event) => {
      if (event.role !== "scan") return;
      dispatch({ type: "paused", reason: SCAN_PAUSE_REASONS[event.reason] });
    });
    const beginScan = () => {
      nearbyScanStartLimiter.record(Date.now());
      startNearbyScanning(NEARBY_SERVICE_UUID_PREFIX, SCAN_MS).catch((error: unknown) => {
        if (!active) return;
        const code = nearbyErrorCode(error);
        if (code === "ERR_CANCELLED") return;
        const reason = blockReasonForError(code);
        dispatch(reason ? { type: "blocked", reason } : { type: "paused", reason: "error" });
      });
    };
    // Android silently throttles a 6th scan start within 30 s (see scan-throttle.ts),
    // e.g. after quick app switches: wait out the window instead of scanning blind.
    const wait = Platform.OS === "android" ? nearbyScanStartLimiter.delay(Date.now()) : 0;
    const startTimer = wait > 0 ? setTimeout(beginScan, wait) : undefined;
    if (!startTimer) beginScan();
    const prune = setInterval(() => {
      setBeacons((current) => pruneBeacons(current, Date.now()));
    }, PRUNE_EVERY_MS);
    return () => {
      active = false;
      offFound();
      offStopped();
      clearInterval(prune);
      if (startTimer) clearTimeout(startTimer);
      void stopNearbyScanning();
    };
  }, [scanning]);

  // Foreground only: pause on background, resume when the user comes back.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      const current = stateRef.current;
      if (next === "background" && shouldScan(current)) {
        dispatch({ type: "paused", reason: "background" });
      } else if (
        next === "active" &&
        current.kind === "paused" &&
        current.reason === "background"
      ) {
        dispatch({ type: "scanning" });
      }
    });
    return () => subscription.remove();
  }, []);

  // Preview each newly discovered beacon once (circle name, type, digits).
  useEffect(() => {
    for (const sessionId of Object.keys(beacons)) {
      if (fetched.current.has(sessionId)) continue;
      fetched.current.add(sessionId);
      previewNearbySession(sessionId)
        .then((preview) => setPreviews((current) => ({ ...current, [sessionId]: preview })))
        .catch(() => {
          // Ended / unknown / rate-limited: keep it hidden; a later sighting won't refetch.
          setPreviews((current) => ({ ...current, [sessionId]: null }));
        });
    }
  }, [beacons]);

  const select = useCallback((sessionId: string) => dispatch({ type: "select", sessionId }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);

  const selectedId =
    state.kind === "confirming" || state.kind === "requesting" || state.kind === "waiting"
      ? state.sessionId
      : null;
  const selected = selectedId ? (previews[selectedId] ?? null) : null;

  const confirm = useCallback(
    async (displayName?: string) => {
      const current = stateRef.current;
      if (current.kind !== "confirming") return;
      const preview = previews[current.sessionId];
      if (!preview) return;
      dispatch({ type: "requesting" });
      try {
        const created = await requestNearbyJoin(
          preview.purpose === "child_link" ? null : auth.token,
          current.sessionId,
          { matchCode: preview.matchCode, displayName: displayName?.trim() || undefined },
        );
        dispatch({
          type: "waiting",
          requestId: created.requestId,
          requestToken: created.requestToken,
        });
      } catch (error) {
        dispatch({ type: "failed", error: nearbyJoinErrorOf(error) });
      }
    },
    [auth.token, previews],
  );

  // Wait for the host's decision.
  const waiting = state.kind === "waiting" ? state : null;
  useEffect(() => {
    if (!waiting) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      try {
        const answer = await nearbyRequestStatus(
          waiting.sessionId,
          waiting.requestId,
          waiting.requestToken,
        );
        let childLinked = false;
        if (answer.childToken && answer.child) {
          // Returned exactly once: store it even if the sheet just closed.
          await saveChildSession(answer.childToken, answer.child);
          childLinked = true;
        }
        if (cancelled) return;
        dispatch({ type: "answer", answer: { ...answer, childLinked } });
        if (answer.status === "accepted" && answer.circleId) {
          void queryClient.invalidateQueries({ queryKey: circleKeys.root(auth.userId) });
          return;
        }
        if (answer.status !== "pending" && answer.status !== "accepted") return;
      } catch (error) {
        if (cancelled) return;
        if (circleErrorStatus(error) === 404) {
          dispatch({
            type: "answer",
            answer: { status: "expired", circleType: "family", circleId: null },
          });
          return;
        }
        // Offline blip: keep waiting.
      }
      timer = setTimeout(() => void tick(), NEARBY_LIMITS.pollMs);
    };
    timer = setTimeout(() => void tick(), NEARBY_LIMITS.pollMs);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [waiting, queryClient, auth.userId]);

  const close = useCallback(() => {
    const current = stateRef.current;
    if (current.kind === "waiting") {
      cancelNearbyRequest(current.sessionId, current.requestId, current.requestToken).catch(
        () => undefined,
      );
    }
    dispatch({ type: "reset" });
    setBeacons({});
    setPreviews({});
    fetched.current.clear();
  }, []);

  const items = useMemo(
    () => nearbyListItems(beacons, previews, purpose),
    [beacons, previews, purpose],
  );

  return { state, items, selected, start, grant, select, back, confirm, close };
}
