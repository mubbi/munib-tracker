import type { NisabBasis } from "@munib-tracker/shared/fiqh";
import type { QazaCounter, QazaRozaCounter } from "@munib-tracker/shared/types";

import type { FidyahCalculatorDraft } from "@/db/repositories/fidyah-calculator-repository";
import type { ZakatCalculatorDraft } from "@/db/repositories/zakat-calculator-repository";
import { computeFidyahEstimate } from "@/lib/fidyah";
import { DEFAULT_NUMBER_FORMAT, parseNumberInput } from "@/lib/format-currency";
import {
  computeZakat,
  effectiveZakatNisab,
  goldValueFromWeight,
  nisabFromGoldPrice,
  nisabFromSilverPrice,
  resolveZakatFiqhSetup,
  silverValueFromWeight,
  ZAKAT_DRAFT_ASSET_FIELDS,
  type ZakatAssets,
  type ZakatSchoolRules,
} from "@/lib/zakat";

import { roundMoney } from "./debts";

/**
 * Religious obligations summary (NF-3.8), read-only from existing stores:
 * qaza Salah, qaza fasts, zakat due (zakat calculator draft), fidyah/kaffarah
 * (fidyah calculator draft) and unfulfilled vows. Feeds the wasiyyah (NF-3.9).
 */
export type ObligationId = "qaza_salah" | "qaza_fast" | "zakat" | "fidyah" | "kaffarah" | "vows";

export interface ObligationLine {
  id: ObligationId;
  /** Count (Salah, fasts, vows). */
  count?: number;
  /** Money estimate in `currency`. */
  amount?: number;
  currency?: string;
  route: string;
  /** Zakat line: the nisab basis the amount uses (shown, so the reader knows which view it is). */
  zakatBasis?: NisabBasis;
  /** Zakat line: no school chosen — the /zakat screen's all-views headline convention was used. */
  zakatAllViews?: boolean;
}

/** The madhhab inputs of the zakat estimate: the resolved school's zakat rules (`null` ⇒ all views) + `fiqhCustom.nisabBasis`. */
export interface ZakatFiqhInput {
  zakat: ZakatSchoolRules | null;
  customBasis: NisabBasis | null;
}

/** All views with no saved basis — the /zakat screen's default headline. */
export const ALL_VIEWS_ZAKAT_FIQH: ZakatFiqhInput = { zakat: null, customBasis: null };

/**
 * Zakat due from the saved calculator draft — the same inputs, formula and
 * madhhab setup as `useZakatCalculator` (`resolveZakatFiqhSetup`: the school's
 * nisab basis, gold+silver combining and personal-jewellery rule; with no
 * school, the user's saved basis else `lower`, pooled by value, jewellery
 * counted — the /zakat all-views headline). Manual prices only: the live
 * market feed is not consulted here, so an unsaved price refresh can differ.
 */
export function estimateZakatFromDraft(
  draft: ZakatCalculatorDraft | null,
  fiqh: ZakatFiqhInput = ALL_VIEWS_ZAKAT_FIQH,
): { due: number; basis: NisabBasis; allViews: boolean } {
  const setup = resolveZakatFiqhSetup(fiqh.zakat, fiqh.customBasis);
  if (!draft) return { due: 0, basis: setup.basis, allViews: setup.allViews };
  const num = (raw: string | undefined) => parseNumberInput(raw ?? "", draft.numberFormat);
  const assets: ZakatAssets = {};
  for (const key of ZAKAT_DRAFT_ASSET_FIELDS) assets[key] = num(draft.values[key]);
  assets.gold =
    (assets.gold ?? 0) +
    goldValueFromWeight(
      num(draft.goldWeight),
      draft.goldUnit,
      draft.goldKarat,
      num(draft.goldPrice),
    );
  assets.silver =
    (assets.silver ?? 0) +
    silverValueFromWeight(
      num(draft.silverWeight),
      draft.silverUnit,
      draft.silverPurity,
      num(draft.silverPrice),
    );
  const goldNisab = nisabFromGoldPrice(num(draft.nisabGoldPrice));
  const silverNisab = nisabFromSilverPrice(num(draft.nisabSilverPrice));
  const nisab = effectiveZakatNisab({
    basis: setup.basis,
    goldNisab,
    silverNisab,
    manual: draft.nisabManual,
    manualNisab: num(draft.nisab),
  });
  const result = computeZakat(
    assets,
    nisab,
    {
      livestock: {
        sheep: num(draft.sheepCount),
        cattle: num(draft.cattleCount),
        camels: num(draft.camelCount),
        sheepValue: num(draft.sheepValue),
        cattleValue: num(draft.cattleValue),
        camelValue: num(draft.camelValue),
      },
      agriculture: { harvestValue: num(draft.harvestValue), irrigation: draft.irrigation },
    },
    {
      combine: setup.combine,
      basis: setup.basis,
      goldNisab,
      silverNisab,
      includePersonalJewellery: setup.includePersonalJewellery,
    },
  );
  return { due: roundMoney(result.totalDue), basis: setup.basis, allViews: setup.allViews };
}

/** Zakat due only (see {@link estimateZakatFromDraft}). */
export function estimateZakatDueFromDraft(
  draft: ZakatCalculatorDraft | null,
  fiqh: ZakatFiqhInput = ALL_VIEWS_ZAKAT_FIQH,
): number {
  return estimateZakatFromDraft(draft, fiqh).due;
}

export function buildObligationsSummary(input: {
  qazaCounters: readonly QazaCounter[];
  roza: Pick<QazaRozaCounter, "remaining">;
  zakatDraft: ZakatCalculatorDraft | null;
  fidyahDraft: FidyahCalculatorDraft | null;
  unfulfilledVows: number;
  /** Madhhab inputs for the zakat line (default: all views). */
  zakatFiqh?: ZakatFiqhInput;
}): ObligationLine[] {
  const lines: ObligationLine[] = [];
  const salah = input.qazaCounters.reduce((sum, c) => sum + Math.max(0, c.remaining), 0);
  if (salah > 0) lines.push({ id: "qaza_salah", count: salah, route: "/qaza" });
  const fasts = Math.max(0, input.roza.remaining);
  if (fasts > 0) lines.push({ id: "qaza_fast", count: fasts, route: "/qaza" });

  const zakat = estimateZakatFromDraft(input.zakatDraft, input.zakatFiqh);
  if (zakat.due > 0 && input.zakatDraft) {
    lines.push({
      id: "zakat",
      amount: zakat.due,
      currency: input.zakatDraft.currencyCode,
      route: "/zakat",
      zakatBasis: zakat.basis,
      zakatAllViews: zakat.allViews,
    });
  }

  if (input.fidyahDraft) {
    const estimate = computeFidyahEstimate({
      scenario: input.fidyahDraft.scenario,
      days: parseNumberInput(input.fidyahDraft.days, DEFAULT_NUMBER_FORMAT),
      mealCost: parseNumberInput(input.fidyahDraft.mealCost, DEFAULT_NUMBER_FORMAT),
    });
    if (estimate.amountEstimate > 0) {
      lines.push({
        id: estimate.scenario,
        count: estimate.days,
        amount: roundMoney(estimate.amountEstimate),
        currency: input.fidyahDraft.currencyCode,
        route: "/fidyah",
      });
    }
  }

  if (input.unfulfilledVows > 0) {
    lines.push({ id: "vows", count: input.unfulfilledVows, route: "/debts" });
  }
  return lines;
}
