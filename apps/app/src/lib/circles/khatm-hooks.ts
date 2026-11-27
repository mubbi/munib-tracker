/**
 * NF-3.18 group-khatm part mutations with optimistic UI.
 *
 * The grid flips immediately; the server's `KhatmDetail` replaces it on
 * success. A lost race (409 — someone else claimed / changed the part) or any
 * other failure rolls back to the snapshot, refetches the khatm and returns the
 * classified error so the screen can show a gentle message.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { CircleMember, CircleToken, KhatmDetail, KhatmPartAction } from "./api";
import * as api from "./api";
import { circleKeys, useCircleAuth } from "./hooks";
import {
  applyOptimisticDeal,
  applyOptimisticPartAction,
  classifyKhatmError,
  type KhatmErrorKind,
} from "./khatm";

export type PartMutationVars = {
  partNo: number;
  action: KhatmPartAction | { assign: string | null };
};

export type PartMutationResult = { ok: true } | { ok: false; error: KhatmErrorKind };

/**
 * One optimistic khatm write: snapshot → `optimistic(previous, vars)` →
 * server detail on success, snapshot back on failure, and the user's circles
 * cache re-read either way. `run` never throws — it returns the classified error.
 */
function useOptimisticKhatmMutation<TVars>(
  circleId: string,
  khatmId: string,
  send: (token: CircleToken, vars: TVars) => Promise<KhatmDetail>,
  optimistic: (previous: KhatmDetail, vars: TVars) => KhatmDetail,
) {
  const queryClient = useQueryClient();
  const { token, userId } = useCircleAuth();
  const key = circleKeys.khatm(userId, circleId, khatmId);

  const mutation = useMutation({
    mutationFn: (vars: TVars) => send(token, vars),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<KhatmDetail>(key);
      if (previous) queryClient.setQueryData<KhatmDetail>(key, optimistic(previous, vars));
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSuccess: (detail) => {
      queryClient.setQueryData(key, detail);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: circleKeys.root(userId) });
    },
  });
  const { mutateAsync } = mutation;

  const run = useCallback(
    async (vars: TVars): Promise<PartMutationResult> => {
      try {
        await mutateAsync(vars);
        return { ok: true };
      } catch (error) {
        return { ok: false, error: classifyKhatmError(error) };
      }
    },
    [mutateAsync],
  );

  return { run, isPending: mutation.isPending };
}

export function useKhatmPartMutation(circleId: string, khatmId: string, myMemberId: string) {
  return useOptimisticKhatmMutation<PartMutationVars>(
    circleId,
    khatmId,
    (token, { partNo, action }) =>
      typeof action === "object"
        ? api.assignKhatmPart(token, circleId, khatmId, partNo, action.assign)
        : api.transitionKhatmPart(token, circleId, khatmId, partNo, action),
    (previous, { partNo, action }) =>
      applyOptimisticPartAction(previous, partNo, action, myMemberId),
  );
}

/**
 * Round-robin "Deal remaining parts" (managers). The grid is dealt optimistically
 * with the same shared plan the server runs (`planKhatmDeal`); the server's
 * answer replaces it, and any failure rolls back and refetches.
 */
export function useKhatmDealMutation(
  circleId: string,
  khatmId: string,
  members: readonly CircleMember[],
) {
  const { run, isPending } = useOptimisticKhatmMutation<void>(
    circleId,
    khatmId,
    (token) => api.dealKhatmParts(token, circleId, khatmId),
    (previous) => applyOptimisticDeal(previous, members),
  );
  return { run: useCallback(() => run(undefined), [run]), isPending };
}
