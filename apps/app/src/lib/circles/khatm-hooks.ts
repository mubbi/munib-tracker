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
import type { CircleMember, KhatmDetail, KhatmPartAction } from "./api";
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

export function useKhatmPartMutation(circleId: string, khatmId: string, myMemberId: string) {
  const queryClient = useQueryClient();
  const { token, userId } = useCircleAuth();
  const key = circleKeys.khatm(userId, circleId, khatmId);

  const mutation = useMutation({
    mutationFn: ({ partNo, action }: PartMutationVars) =>
      typeof action === "object"
        ? api.assignKhatmPart(token, circleId, khatmId, partNo, action.assign)
        : api.transitionKhatmPart(token, circleId, khatmId, partNo, action),
    onMutate: async ({ partNo, action }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<KhatmDetail>(key);
      if (previous) {
        queryClient.setQueryData<KhatmDetail>(
          key,
          applyOptimisticPartAction(previous, partNo, action, myMemberId),
        );
      }
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

  const run = useCallback(
    async (vars: PartMutationVars): Promise<PartMutationResult> => {
      try {
        await mutation.mutateAsync(vars);
        return { ok: true };
      } catch (error) {
        return { ok: false, error: classifyKhatmError(error) };
      }
    },
    [mutation],
  );

  return { run, isPending: mutation.isPending };
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
  const queryClient = useQueryClient();
  const { token, userId } = useCircleAuth();
  const key = circleKeys.khatm(userId, circleId, khatmId);

  const mutation = useMutation({
    mutationFn: () => api.dealKhatmParts(token, circleId, khatmId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<KhatmDetail>(key);
      if (previous) {
        queryClient.setQueryData<KhatmDetail>(key, applyOptimisticDeal(previous, members));
      }
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

  const run = useCallback(async (): Promise<PartMutationResult> => {
    try {
      await mutation.mutateAsync();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: classifyKhatmError(error) };
    }
  }, [mutation]);

  return { run, isPending: mutation.isPending };
}
