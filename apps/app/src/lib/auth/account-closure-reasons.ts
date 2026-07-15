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
