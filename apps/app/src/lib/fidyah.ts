import type {
  FidyahEstimateInput,
  FidyahEstimateResult,
  FidyahScenario,
} from "@munib-tracker/shared/types/fidyah";

/**
 * Pure estimate helpers for fidyah / kaffarah planning amounts.
 * Not a fatwa engine — meal counts follow Qur'an 2:184 (1 poor person / day)
 * and Sahih Muslim 1111 (60 poor persons / kaffarah feeding option).
 */
export function computeFidyahEstimate(input: FidyahEstimateInput): FidyahEstimateResult {
  const days = Number.isFinite(input.days) ? Math.max(0, Math.floor(input.days)) : 0;
  const mealCost = Number.isFinite(input.mealCost) ? Math.max(0, input.mealCost) : 0;
  const scenario = input.scenario === "kaffarah" ? "kaffarah" : "fidyah";

  if (scenario === "kaffarah") {
    const mealsDue = days * 60;
    return {
      scenario,
      days,
      mealCost,
      mealsDue,
      amountEstimate: mealsDue * mealCost,
      consecutiveFastDays: days * 60,
    };
  }

  const mealsDue = days;
  return {
    scenario,
    days,
    mealCost,
    mealsDue,
    amountEstimate: mealsDue * mealCost,
    consecutiveFastDays: null,
  };
}

export type { FidyahEstimateInput, FidyahEstimateResult, FidyahScenario };
