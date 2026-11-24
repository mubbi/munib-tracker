/**
 * Closure survey reason codes — keep aligned with `AccountClosureReason` in
 * `apps/api/src/auth/dto/auth.dto.ts` and `POST /auth/delete-account`.
 */
export const ACCOUNT_CLOSURE_REASONS = [
  "privacy_concerns",
  "missing_features",
  "too_complicated",
  "switching_app",
  "not_using",
  "technical_issues",
  "other",
] as const;

export type AccountClosureReasonCode = (typeof ACCOUNT_CLOSURE_REASONS)[number];

export const ACCOUNT_CLOSURE_CONFIRMATION = "DELETE" as const;

export type DeleteAccountRequestBody = {
  confirmation: typeof ACCOUNT_CLOSURE_CONFIRMATION;
  primaryReason: AccountClosureReasonCode;
  details?: string;
};

/** Longest optional free-text detail the closure survey sends (the API rejects longer). */
export const ACCOUNT_CLOSURE_DETAILS_MAX = 500;

/** The final step unlocks only after the typed word, the acknowledgement and a reason. */
export function isAccountClosureConfirmed(
  typed: string,
  acknowledged: boolean,
  primaryReason: AccountClosureReasonCode | null,
): boolean {
  return typed.trim() === ACCOUNT_CLOSURE_CONFIRMATION && acknowledged && primaryReason != null;
}

/** `POST /auth/delete-account` body; blank details are omitted, long ones capped. */
export function buildDeleteAccountRequest(
  primaryReason: AccountClosureReasonCode,
  details: string,
): DeleteAccountRequestBody {
  const trimmed = details.trim();
  return {
    confirmation: ACCOUNT_CLOSURE_CONFIRMATION,
    primaryReason,
    ...(trimmed ? { details: trimmed.slice(0, ACCOUNT_CLOSURE_DETAILS_MAX) } : {}),
  };
}
