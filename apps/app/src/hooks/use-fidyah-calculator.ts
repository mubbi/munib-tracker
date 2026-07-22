import * as Localization from "expo-localization";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCurrencyInfo } from "@/constants/currencies";
import { FidyahCalculatorRepository } from "@/db/repositories/fidyah-calculator-repository";
import { computeFidyahEstimate, type FidyahScenario } from "@/lib/fidyah";
import { DEFAULT_NUMBER_FORMAT, formatMoneyAmount, parseNumberInput } from "@/lib/format-currency";

const PERSIST_DEBOUNCE_MS = 350;

function resolveDefaultCurrency(): string {
  const device = Localization.getLocales()[0]?.currencyCode?.toUpperCase();
  if (device && getCurrencyInfo(device)) return device;
  return "USD";
}

export function useFidyahCalculator() {
  const [ready, setReady] = useState(false);
  const [currencyCode, setCurrencyCode] = useState(resolveDefaultCurrency);
  const [scenario, setScenario] = useState<FidyahScenario>("fidyah");
  const [days, setDays] = useState("");
  const [mealCost, setMealCost] = useState("");
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void FidyahCalculatorRepository.load(resolveDefaultCurrency()).then((draft) => {
      if (cancelled) return;
      setCurrencyCode(draft.currencyCode);
      setScenario(draft.scenario);
      setDays(draft.days);
      setMealCost(draft.mealCost);
      setReady(true);
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
