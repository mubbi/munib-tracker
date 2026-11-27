import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FidyahCalculatorRepository } from "@/db/repositories/fidyah-calculator-repository";
import { computeFidyahEstimate, type FidyahScenario } from "@/lib/fidyah";
import { DEFAULT_NUMBER_FORMAT, formatMoneyAmount, parseNumberInput } from "@/lib/format-currency";
import { defaultCurrencyCode } from "@/lib/money-defaults";

const PERSIST_DEBOUNCE_MS = 350;

/** Settings default currency (first open only — a saved draft wins), else the device region. */
function resolveDefaultCurrency(): string {
  return defaultCurrencyCode();
}

/** Values a deep link may prefill (e.g. Ramadan "Days to make up" → `/fidyah?scenario=fidyah&days=3`). */
export type FidyahCalculatorPrefill = { scenario?: FidyahScenario; days?: string };

type RouteParam = string | string[] | undefined;

/**
 * Reads `scenario` / `days` route params into a prefill, ignoring anything
 * unexpected: only the two known scenarios, and `days` only as a whole number
 * from 1 to 10 000. Returns `undefined` when nothing usable was passed.
 */
export function parseFidyahRouteParams(params: {
  scenario?: RouteParam;
  days?: RouteParam;
}): FidyahCalculatorPrefill | undefined {
  const first = (value: RouteParam) => (Array.isArray(value) ? value[0] : value)?.trim();
  const rawScenario = first(params.scenario);
  const scenario = rawScenario === "fidyah" || rawScenario === "kaffarah" ? rawScenario : undefined;
  const rawDays = first(params.days);
  const n = rawDays && /^\d+$/.test(rawDays) ? Number(rawDays) : Number.NaN;
  const days = Number.isInteger(n) && n >= 1 && n <= 10_000 ? String(n) : undefined;
  if (!scenario && !days) return undefined;
  return { ...(scenario ? { scenario } : {}), ...(days ? { days } : {}) };
}

/**
 * Fidyah / kaffarah helper state, persisted as a draft. A `prefill` (from route
 * params) overrides the saved draft's scenario / days once, on load, and is
 * saved so the values survive leaving the screen.
 */
export function useFidyahCalculator(prefill?: FidyahCalculatorPrefill) {
  const [ready, setReady] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(resolveDefaultCurrency);
  const [scenario, setScenario] = useState<FidyahScenario>("fidyah");
  const [days, setDays] = useState("");
  const [mealCost, setMealCost] = useState("");
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Read once: the prefill applies to the first load only, never re-applied on re-render.
  const prefillRef = useRef(prefill);

  useEffect(() => {
    let cancelled = false;
    void FidyahCalculatorRepository.load(resolveDefaultCurrency()).then((draft) => {
      if (cancelled) return;
      const initial = prefillRef.current;
      const next = {
        ...draft,
        scenario: initial?.scenario ?? draft.scenario,
        days: initial?.days ?? draft.days,
      };
      setCurrencyCode(next.currencyCode);
      setScenario(next.scenario);
      setDays(next.days);
      setMealCost(next.mealCost);
      setReady(true);
      if (initial && (next.scenario !== draft.scenario || next.days !== draft.days)) {
        void FidyahCalculatorRepository.save(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(
    (next: { currencyCode: string; scenario: FidyahScenario; days: string; mealCost: string }) => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(() => {
        void FidyahCalculatorRepository.save(next);
      }, PERSIST_DEBOUNCE_MS);
    },
    [],
  );

  const update = useCallback(
    (
      patch: Partial<{
        currencyCode: string;
        scenario: FidyahScenario;
        days: string;
        mealCost: string;
      }>,
    ) => {
      const next = {
        currencyCode: patch.currencyCode ?? currencyCode,
        scenario: patch.scenario ?? scenario,
        days: patch.days ?? days,
        mealCost: patch.mealCost ?? mealCost,
      };
      if (patch.currencyCode != null) setCurrencyCode(patch.currencyCode);
      if (patch.scenario != null) setScenario(patch.scenario);
      if (patch.days != null) setDays(patch.days);
      if (patch.mealCost != null) setMealCost(patch.mealCost);
      persist(next);
    },
    [currencyCode, scenario, days, mealCost, persist],
  );

  const result = useMemo(
    () =>
      computeFidyahEstimate({
        scenario,
        days: parseNumberInput(days, DEFAULT_NUMBER_FORMAT) || 0,
        mealCost: parseNumberInput(mealCost, DEFAULT_NUMBER_FORMAT) || 0,
      }),
    [scenario, days, mealCost],
  );

  const money = useCallback(
    (amount: number) => formatMoneyAmount(amount, currencyCode, DEFAULT_NUMBER_FORMAT),
    [currencyCode],
  );

  const reset = useCallback(async () => {
    setScenario("fidyah");
    setDays("");
    setMealCost("");
    await FidyahCalculatorRepository.clear();
  }, []);

  return {
    ready,
    currencyCode,
    scenario,
    days,
    mealCost,
    result,
    money,
    setCurrencyCode: (code: string) => update({ currencyCode: code }),
    setScenario: (value: FidyahScenario) => update({ scenario: value }),
    setDays: (value: string) => update({ days: value }),
    setMealCost: (value: string) => update({ mealCost: value }),
    reset,
    hasInput: result.days > 0 && result.mealCost > 0,
  };
}
