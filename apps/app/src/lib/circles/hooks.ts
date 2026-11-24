/**
 * TanStack Query hooks over `lib/circles/api.ts` (NF-3.16–3.18).
 *
 * - Polling: 60 s while a circle screen is mounted (§9.0 "Realtime") — TanStack
 *   only polls while an observer exists, and never in the background.
 * - Query keys are scoped by the signed-in user id so switching accounts never
 *   shows another account's circles.
 * - Every mutation invalidates the `circles` root for that user (cheap: a family
 *   has a handful of rows) so lists, details and signals stay consistent.
 */
import type { FardPrayer, FardStatusValue } from "@munib-tracker/shared/circles";
import { type QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { useAuth } from "@/providers/auth-provider";
import type { CircleSignal, CircleToken } from "./api";
import * as api from "./api";
import { EMPTY_FARD_STATUS, fardOn, toggleFard, upsertFardSignal } from "./family";

export const CIRCLE_POLL_MS = 60_000;

export const circleKeys = {
  root: (userId: string | undefined) => ["circles", userId ?? "anon"] as const,
  list: (userId: string | undefined) => [...circleKeys.root(userId), "list"] as const,
  detail: (userId: string | undefined, circleId: string) =>
    [...circleKeys.root(userId), "detail", circleId] as const,
  children: (userId: string | undefined, circleId: string) =>
    [...circleKeys.root(userId), "children", circleId] as const,
  invites: (userId: string | undefined, circleId: string) =>
    [...circleKeys.root(userId), "invites", circleId] as const,
  signals: (userId: string | undefined, circleId: string, from: string, to: string) =>
    [...circleKeys.root(userId), "signals", circleId, from, to] as const,
  nudges: (userId: string | undefined, circleId: string) =>
    [...circleKeys.root(userId), "nudges", circleId] as const,
  khatms: (userId: string | undefined, circleId: string) =>
    [...circleKeys.root(userId), "khatms", circleId] as const,
  khatm: (userId: string | undefined, circleId: string, khatmId: string) =>
    [...circleKeys.root(userId), "khatm", circleId, khatmId] as const,
  invitePreview: (userId: string | undefined, code: string) =>
    [...circleKeys.root(userId), "invite-preview", code] as const,
};

export type CircleAuthState = {
  token: CircleToken;
  userId: string | undefined;
  /** A session (guest or account) exists — khatm groups accept guests. */
  hasSession: boolean;
  /** Linked account (family / partner circles require one). */
  isAccount: boolean;
  isGuest: boolean;
};

/** Session facts every circles screen needs. */
export function useCircleAuth(): CircleAuthState {
  const { session, isAuthenticated, isGuest } = useAuth();
  return {
    token: session?.accessToken,
    userId: session?.userId,
    hasSession: session != null,
    isAccount: isAuthenticated,
    isGuest,
  };
}

type QueryOpts = { enabled?: boolean; poll?: boolean };

function useCircleQuery<T>(
  key: QueryKey,
  fn: (token: CircleToken) => Promise<T>,
  { enabled = true, poll = true }: QueryOpts = {},
) {
  const auth = useCircleAuth();
  return useQuery({
    queryKey: key,
    queryFn: () => fn(auth.token),
    enabled: enabled && auth.hasSession,
    refetchInterval: poll ? CIRCLE_POLL_MS : false,
    refetchIntervalInBackground: false,
    staleTime: 15_000,
    retry: (count, error) => {
      const status = api.circleErrorStatus(error);
      // 4xx are answers (not a member, gone, forbidden) — don't hammer the server.
      if (status >= 400 && status < 500) return false;
      return count < 2;
    },
  });
}

export function useCircles(opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(circleKeys.list(userId), (token) => api.listCircles(token), opts);
}

export function useCircle(circleId: string | undefined, opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.detail(userId, circleId ?? ""),
    (token) => api.getCircle(token, circleId as string),
    { ...opts, enabled: (opts?.enabled ?? true) && !!circleId },
  );
}

export function useChildProfiles(circleId: string | undefined, opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.children(userId, circleId ?? ""),
    (token) => api.listChildren(token, circleId as string),
    { ...opts, enabled: (opts?.enabled ?? true) && !!circleId },
  );
}

export function useCircleInvites(circleId: string | undefined, opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.invites(userId, circleId ?? ""),
    (token) => api.listInvites(token, circleId as string),
    { poll: false, ...opts, enabled: (opts?.enabled ?? true) && !!circleId },
  );
}

export function useCircleSignals(
  circleId: string | undefined,
  from: string,
  to: string,
  opts?: QueryOpts,
) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.signals(userId, circleId ?? "", from, to),
    (token) => api.listSignals(token, circleId as string, from, to),
    { ...opts, enabled: (opts?.enabled ?? true) && !!circleId },
  );
}

export function useCircleNudges(circleId: string | undefined, opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.nudges(userId, circleId ?? ""),
    (token) => api.listNudges(token, circleId as string),
    { ...opts, enabled: (opts?.enabled ?? true) && !!circleId },
  );
}

export function useKhatms(circleId: string | undefined, opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.khatms(userId, circleId ?? ""),
    (token) => api.listKhatms(token, circleId as string),
    { ...opts, enabled: (opts?.enabled ?? true) && !!circleId },
  );
}

export function useKhatm(
  circleId: string | undefined,
  khatmId: string | undefined,
  opts?: QueryOpts,
) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.khatm(userId, circleId ?? "", khatmId ?? ""),
    (token) => api.getKhatm(token, circleId as string, khatmId as string),
    { ...opts, enabled: (opts?.enabled ?? true) && !!circleId && !!khatmId },
  );
}

export function useInvitePreview(code: string | undefined, opts?: QueryOpts) {
  const { userId } = useCircleAuth();
  return useCircleQuery(
    circleKeys.invitePreview(userId, code ?? ""),
    (token) => api.previewInvite(token, code as string),
    { poll: false, ...opts, enabled: (opts?.enabled ?? true) && !!code },
  );
}

/**
 * Generic circles mutation: runs `fn(token, vars)` and invalidates the user's
 * circles cache on success. Usage:
 * `const join = useCircleMutation((token, input: JoinCircleInput) => api.joinCircle(token, input));`
 */
export function useCircleMutation<TVars, TResult>(
  fn: (token: CircleToken, vars: TVars) => Promise<TResult>,
) {
  const queryClient = useQueryClient();
  const { token, userId } = useCircleAuth();
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: circleKeys.root(userId) }),
    [queryClient, userId],
  );
  return useMutation({
    mutationFn: (vars: TVars) => fn(token, vars),
    onSuccess: () => {
      void invalidate();
    },
  });
}

/** Mutation without variables (leave, delete, create a device link…): `run.mutateAsync()`. */
export function useCircleAction<TResult>(fn: (token: CircleToken) => Promise<TResult>) {
  return useCircleMutation<void, TResult>((token) => fn(token));
}

/** Invalidate every circles query for the signed-in user (pull-to-refresh, focus). */
export function useInvalidateCircles(): () => Promise<void> {
  const queryClient = useQueryClient();
  const { userId } = useCircleAuth();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: circleKeys.root(userId) }),
    [queryClient, userId],
  );
}

/**
 * Log fard statuses on someone's behalf (parent view, child detail, parent
 * "Child: <nickname>" kids mode) with an **optimistic** update of the signals
 * window the screen shows. Each tap is computed from the cached value, which
 * the previous tap already updated — so quickly ticking Fajr then Dhuhr never
 * sends a write that reverts the first. A failed write rolls that member's day
 * back and rethrows (the screen shows the offline toast); the circles cache is
 * re-read once the last pending write settles.
 */
export function useFardStatusLog(circleId: string | undefined, from: string, to: string) {
  const queryClient = useQueryClient();
  const { token, userId } = useCircleAuth();
  const mutationKey = [...circleKeys.root(userId), "fard-log", circleId ?? ""] as const;
  const signalsKey = useMemo(
    () => circleKeys.signals(userId, circleId ?? "", from, to),
    [userId, circleId, from, to],
  );
  const mutation = useMutation({
    mutationKey,
    mutationFn: (input: api.FardStatusInput) => api.putFardStatus(token, circleId as string, input),
    onSettled: () => {
      // Only the last write in a burst refetches (no flicker back to an older value).
      if (queryClient.isMutating({ mutationKey }) <= 1) {
        void queryClient.invalidateQueries({ queryKey: circleKeys.root(userId) });
      }
    },
  });
  const { mutateAsync } = mutation;

  const write = useCallback(
    async (memberId: string, date: string, next: FardStatusValue, previous: FardStatusValue) => {
      void queryClient.cancelQueries({ queryKey: signalsKey });
      queryClient.setQueryData<CircleSignal[]>(signalsKey, (current) =>
        upsertFardSignal(current ?? [], memberId, date, next),
      );
      try {
        await mutateAsync({ date, memberId, ...next });
      } catch (error) {
        queryClient.setQueryData<CircleSignal[]>(signalsKey, (current) =>
          upsertFardSignal(current ?? [], memberId, date, previous),
        );
        throw error;
      }
    },
    [queryClient, mutateAsync, signalsKey],
  );

  /** Flip one prayer for `memberId` on `date`, from the freshest cached value. */
  const toggle = useCallback(
    (memberId: string, date: string, prayer: FardPrayer) => {
      const cached = queryClient.getQueryData<CircleSignal[]>(signalsKey) ?? [];
      const current = fardOn(cached, memberId, date) ?? EMPTY_FARD_STATUS;
      return write(memberId, date, toggleFard(current, prayer), current);
    },
    [queryClient, write, signalsKey],
  );

  return { toggle, isPending: mutation.isPending };
}
