import type { WasiyyahData } from "@munib-tracker/shared/types";

import { normalizeDayInput } from "@/lib/records/day";

/**
 * One line per wizard section for the review step ("check each section"),
 * as i18n keys + values so the UI stays a dumb list. Pure; no copy here.
 */
export type WasiyyahSummaryStep =
  | "testator"
  | "funeral"
  | "debts"
  | "trusts"
  | "bequests"
  | "people"
  | "distribution"
  | "witnesses";

export interface WasiyyahSummaryLine {
  step: WasiyyahSummaryStep;
  /** i18n key, or `null` when {@link text} (the person's own words) is shown as-is. */
  key: string | null;
  text?: string;
  values?: Record<string, string | number>;
  /** A required part is still empty (only the testator's name today). */
  missing?: boolean;
}

const K = "wasiyyah.reviewSummary";

function confirmedLine(
  step: WasiyyahSummaryStep,
  lines: readonly { confirmed: boolean }[],
): WasiyyahSummaryLine {
  if (lines.length === 0) return { step, key: `${K}.none` };
  return {
    step,
    key: `${K}.confirmed`,
    values: { done: lines.filter((l) => l.confirmed).length, total: lines.length },
  };
}

export function wasiyyahSummaryLine(
  step: WasiyyahSummaryStep,
  data: WasiyyahData,
): WasiyyahSummaryLine {
  switch (step) {
    case "testator": {
      const name = data.testator.name.trim();
      if (!name) return { step, key: `${K}.nameMissing`, missing: true };
      // The date is required too; an unreadable one blocks saving.
      if (normalizeDayInput(data.testator.date) == null) {
        return { step, key: `${K}.dateInvalid`, missing: true };
      }
      return { step, key: null, text: name };
    }
    case "funeral": {
      const wishes = [
        data.funeral.sunnahRites,
        data.funeral.muslimCemetery,
        data.funeral.avoidInnovations,
      ];
      return {
        step,
        key: `${K}.selected`,
        values: { done: wishes.filter(Boolean).length, total: wishes.length },
      };
    }
    case "debts":
      return confirmedLine(step, data.debts);
    case "trusts":
      return confirmedLine(step, data.trusts);
    case "bequests":
      return data.bequests.length
        ? { step, key: `${K}.added`, values: { total: data.bequests.length } }
        : { step, key: `${K}.none` };
    case "people": {
      const names = [...data.guardians, data.executor ?? ""].map((n) => n.trim()).filter(Boolean);
      return names.length
        ? { step, key: null, text: names.join(", ") }
        : { step, key: `${K}.none` };
    }
    case "distribution":
      return { step, key: data.mirathSnapshot ? `${K}.snapshot` : `${K}.noSnapshot` };
    case "witnesses":
      return {
        step,
        key: `${K}.named`,
        values: { done: data.witnesses.filter((w) => w.trim()).length, total: 2 },
      };
  }
}
