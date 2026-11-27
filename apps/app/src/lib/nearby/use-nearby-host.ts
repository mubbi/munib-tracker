import { NEARBY_LIMITS } from "@munib-tracker/shared/circles/nearby";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { AppState } from "react-native";

import {
  circleErrorStatus,
  createNearbySession,
  decideNearbyRequest,
  endNearbySession,
  listNearbyRequests,
  type NearbyRequest,
  type NearbySession,
} from "@/lib/circles/api";
import { circleKeys, useCircleAuth } from "@/lib/circles/hooks";

import {
  blockReasonForError,
  NEARBY_HOST_IDLE,
  type NearbyHostState,
  type NearbyHostStopReason,
  nearbyHostReducer,
  nearbyPreflight,
} from "./machine";
import {
  addNearbyListener,
  isNearbyAvailable,
  type NearbyStopReason,
  nearbyErrorCode,
  nearbyRadioState,
  startNearbyAdvertising,
  stopNearbyAdvertising,
} from "./native";
import { checkNearbyPermission, requestNearbyPermission } from "./permissions";

export type NearbyHostOptions = {
  circleId: string;
  /** Role granted on accept (`parent` sessions are owner-only on the server). */
  role?: "parent" | "member";
  /** Link this child profile's device instead of inviting an adult. */
  childId?: string;
};

export type NearbyHost = {
  state: NearbyHostState;
  /** "Asking to join" (pending first, then answered ones). */
  requests: NearbyRequest[];
  /** "Make visible": preflight → rationale / blocked / advertise. */
  start: () => Promise<void>;
  /** From the rationale: show the OS prompt, then start. */
  grant: () => Promise<void>;
  /** Stop advertising and end the session. */
  stop: () => void;
  decide: (requestId: string, decision: "accept" | "decline") => Promise<void>;
};

const STOP_REASONS: Record<NearbyStopReason, NearbyHostStopReason> = {
  timeout: "timeout",
  background: "background",
  bluetoothOff: "bluetoothOff",
  error: "error",
  destroyed: "background",
};

/**
 * Host side of NF-3.25: advertise the circle while the invite screen is open
 * (D41). The phone advertises only between "Make visible" and stop / blur /
 * background / Bluetooth off / the 10-minute expiry; the session is ended on
 * the server at the same moments so nobody can ask after the host left. Asking
 * requests are polled every 3 s while visible and need an explicit Accept (D42).
 */
export function useNearbyHost({ circleId, role, childId }: NearbyHostOptions): NearbyHost {
  const auth = useCircleAuth();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(nearbyHostReducer, NEARBY_HOST_IDLE);
  const sessionRef = useRef<NearbySession | null>(null);
  const tokenRef = useRef(auth.token);
  tokenRef.current = auth.token;

  /** Stop the radio and end the server session (best effort, never throws). */
  const teardown = useCallback(
    (session: NearbySession | null) => {
      void stopNearbyAdvertising();
      if (session) {
        endNearbySession(tokenRef.current, circleId, session.sessionId).catch(() => undefined);
      }
    },
    [circleId],
  );

  const halt = useCallback(
    (reason: NearbyHostStopReason | null) => {
      const session = sessionRef.current;
      sessionRef.current = null;
      teardown(session);
      dispatch(reason ? { type: "stopped", reason } : { type: "reset" });
    },
    [teardown],
  );

  const begin = useCallback(async () => {
    try {
      const session = await createNearbySession(
        tokenRef.current,
        circleId,
        childId ? { childId } : { role: role ?? "member" },
      );
      // Set before advertising, so stop / unmount mid-start also ends it.
      sessionRef.current = session;
      await startNearbyAdvertising(
        session.serviceUuid,
        new Date(session.expiresAt).getTime() - Date.now(),
      );
      if (sessionRef.current !== session) return; // stopped meanwhile
      dispatch({ type: "visible", session });
    } catch (error) {
      const session = sessionRef.current;
      sessionRef.current = null;
      teardown(session);
      const code = nearbyErrorCode(error);
      if (code === "ERR_CANCELLED") return;
      const reason = blockReasonForError(code);
      dispatch(reason ? { type: "blocked", reason } : { type: "stopped", reason: "error" });
    }
  }, [circleId, childId, role, teardown]);

  const start = useCallback(async () => {
    const permission = await checkNearbyPermission("advertise");
    const result = nearbyPreflight({
      available: isNearbyAvailable(),
      permission,
      radio: nearbyRadioState(),
      locationServices: true,
    });
    dispatch({ type: "preflight", result });
    if (result.kind === "ready") await begin();
  }, [begin]);

  const grant = useCallback(async () => {
    const permission = await requestNearbyPermission("advertise");
    if (permission !== "granted") {
      dispatch({
        type: "blocked",
        reason: permission === "blocked" ? "permissionBlocked" : "permissionDenied",
      });
      return;
    }
    await start();
  }, [start]);

  const stop = useCallback(() => halt(null), [halt]);

  // Native stop (timeout, Bluetooth off, background) → end the session too.
  useEffect(
    () =>
      addNearbyListener("onStopped", (event) => {
        if (event.role === "advertise" && sessionRef.current) halt(STOP_REASONS[event.reason]);
      }),
    [halt],
  );

  // Backgrounding stops advertising (no background BLE modes) and the session.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (next === "background" && sessionRef.current) halt("background");
    });
    return () => subscription.remove();
  }, [halt]);

  // Expiry (the native timer fires too; this keeps the UI honest without it).
  const visibleSession = state.kind === "visible" ? state.session : null;
  useEffect(() => {
    if (!visibleSession) return;
    const ms = new Date(visibleSession.expiresAt).getTime() - Date.now();
    const timer = setTimeout(() => halt("timeout"), Math.max(0, ms));
    return () => clearTimeout(timer);
  }, [visibleSession, halt]);

  // Leaving the screen ends everything.
  useEffect(() => () => teardown(sessionRef.current), [teardown]);

  const requests = useQuery({
    queryKey: circleKeys.nearbyRequests(auth.userId, circleId, visibleSession?.sessionId ?? ""),
    queryFn: () =>
      listNearbyRequests(tokenRef.current, circleId, (visibleSession as NearbySession).sessionId),
    enabled: visibleSession != null,
    refetchInterval: NEARBY_LIMITS.pollMs,
    refetchIntervalInBackground: false,
    retry: false,
  });

  // A single-use session (parent invite, child link) was used, or it ended server-side.
  const serverActive = requests.data?.active;
  useEffect(() => {
    if (visibleSession && serverActive === false) halt("used");
  }, [visibleSession, serverActive, halt]);

  const decide = useCallback(
    async (requestId: string, decision: "accept" | "decline") => {
      const session = sessionRef.current;
      if (!session) return;
      try {
        await decideNearbyRequest(
          tokenRef.current,
          circleId,
          session.sessionId,
          requestId,
          decision,
        );
      } finally {
        await queryClient.invalidateQueries({ queryKey: circleKeys.root(auth.userId) });
      }
    },
    [auth.userId, circleId, queryClient],
  );

  return {
    state,
    requests: sortRequests(requests.data?.items ?? []),
    start,
    grant,
    stop,
    decide,
  };
}

/** Pending first (oldest first), then answered ones. */
export function sortRequests(items: readonly NearbyRequest[]): NearbyRequest[] {
  const rank = (r: NearbyRequest) => (r.status === "pending" ? 0 : 1);
  return [...items].sort((a, b) => rank(a) - rank(b) || a.createdAt.localeCompare(b.createdAt));
}

/** HTTP status → the copy key a failed Accept / Decline shows. */
export function nearbyDecisionErrorKey(error: unknown): string {
  const status = circleErrorStatus(error);
  if (status === 409) return "nearby.host.errorFull";
  if (status === 410) return "nearby.host.errorEnded";
  if (status === 403) return "nearby.host.errorForbidden";
  return "circles.common.offline";
}
