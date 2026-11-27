/**
 * Release gate for the Mirath calculator (plan NF-3.10, D6 + D11): the route
 * ships only while every fixture in `__fixtures__/` carries
 * `verifiedBy: "ai-review"` and at least one source. `fixtures.test.ts`
 * enforces that whenever `MIRATH_ENABLED` is true.
 */
export const MIRATH_ENABLED = true;

/** D11 review stamp for the fixture suite and proof log. */
export const MIRATH_REVIEW = {
  verifiedBy: "ai-review",
  verifiedAt: "2026-11-23",
  proofLog: "docs/proofs/mirath.md",
} as const;
