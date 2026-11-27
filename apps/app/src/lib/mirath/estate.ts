import type { MirathEstateInput } from "@munib-tracker/shared/mirath";

/** The optional estate form while it is being filled (every field may be blank). */
export type MirathEstateDraft = {
  gross?: number;
  funeral?: number;
  debts?: number;
  bequests?: number;
};

/**
 * Engine estate input from the form: blank deductions count as 0, and the
 * whole estate stays `undefined` (fractions only) until a positive gross is entered.
 */
export function estateInputFrom(
  draft: MirathEstateDraft,
  currency: string,
): MirathEstateInput | undefined {
  if ((draft.gross ?? 0) <= 0) return undefined;
  return {
    gross: draft.gross ?? 0,
    funeral: draft.funeral ?? 0,
    debts: draft.debts ?? 0,
    bequests: draft.bequests ?? 0,
    currency,
  };
}
