/** Inputs for the fidyah / kaffarah estimate helper (not a fatwa engine). */
export type FidyahScenario = "fidyah" | "kaffarah";

export interface FidyahEstimateInput {
  scenario: FidyahScenario;
  /** Missed or broken fast-days (fidyah) or count of kaffarah units (usually 1). */
  days: number;
  /** Local cost of feeding one poor person one meal (or local fidya unit). */
  mealCost: number;
}

export interface FidyahEstimateResult {
  scenario: FidyahScenario;
  days: number;
  mealCost: number;
  /** Meals / poor people to feed (1×days for fidyah; 60×days for kaffarah). */
  mealsDue: number;
  /** Monetary estimate = mealsDue × mealCost. */
  amountEstimate: number;
  /** Consecutive fast days if choosing the fasting option (kaffarah only). */
  consecutiveFastDays: number | null;
}
