import { isNisabBasis } from "@munib-tracker/shared/fiqh";
import { useEffect, useMemo, useState } from "react";

import {
  type FidyahCalculatorDraft,
  FidyahCalculatorRepository,
} from "@/db/repositories/fidyah-calculator-repository";
import {
  type ZakatCalculatorDraft,
  ZakatCalculatorRepository,
} from "@/db/repositories/zakat-calculator-repository";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";
import { useQazaCounters, useRoza } from "@/stores/tracker-store";

import type { VowEntry } from "./debts";
import { buildObligationsSummary, type ObligationLine, type ZakatFiqhInput } from "./obligations";

/**
 * Religious obligations summary for the debts screen and the wasiyyah import.
 * Qaza comes from the tracker store; the zakat and fidyah drafts are read from
 * their repositories once per mount (they are only edited on their own screens).
 * Zakat follows the same madhhab setup as /zakat (school rules, or all views).
 */
export function useObligationsSummary(vows: readonly VowEntry[]): ObligationLine[] {
  const qazaCounters = useQazaCounters();
  const roza = useRoza();
  const [drafts, setDrafts] = useState<{
    zakat: ZakatCalculatorDraft | null;
    fidyah: FidyahCalculatorDraft | null;
  }>({ zakat: null, fidyah: null });

  useEffect(() => {
    let alive = true;
    void Promise.all([
      ZakatCalculatorRepository.get().catch(() => null),
      FidyahCalculatorRepository.load("USD").catch(() => null),
    ]).then(([zakat, fidyah]) => {
      if (alive) setDrafts({ zakat, fidyah });
    });
    return () => {
      alive = false;
    };
  }, []);

  // `useMadhhab()` is memoised on the fiqh prefs, so this stays referentially
  // stable (the wasiyyah wizard re-imports whenever the summary changes).
  const madhhab = useMadhhab();
  const rawCustomBasis = useStore(preferencesStore, (s) => s.prefs.fiqhCustom?.nisabBasis);
  const customBasis = isNisabBasis(rawCustomBasis) ? rawCustomBasis : null;
  const zakatFiqh = useMemo(
    (): ZakatFiqhInput => ({
      zakat: madhhab.resolve("zakat").rules?.zakat ?? null,
      customBasis,
    }),
    [madhhab, customBasis],
  );

  const unfulfilledVows = vows.filter((v) => !v.fulfilled).length;
  return useMemo(
    () =>
      buildObligationsSummary({
        qazaCounters,
        roza,
        zakatDraft: drafts.zakat,
        fidyahDraft: drafts.fidyah,
        unfulfilledVows,
        zakatFiqh,
      }),
    [qazaCounters, roza, drafts, unfulfilledVows, zakatFiqh],
  );
}
