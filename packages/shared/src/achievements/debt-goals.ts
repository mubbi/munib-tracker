import type { DebtProgress, MilestoneProgress } from "./types";

export type { DebtProgress } from "./types";

export function summarizeQazaDebt(
  counters: Pick<DebtProgress, "remaining" | "completed">[],
): DebtProgress | null {
  const remaining = counters.reduce((sum, c) => sum + c.remaining, 0);
  const completed = counters.reduce((sum, c) => sum + c.completed, 0);
  const total = remaining + completed;
  if (total === 0) return null;
  return { total, completed, remaining };
}

export function summarizeRozaDebt(
  roza: Pick<DebtProgress, "remaining" | "completed">,
): DebtProgress | null {
  const total = roza.remaining + roza.completed;
  if (total === 0) return null;
  return { total, completed: roza.completed, remaining: roza.remaining };
}

function debtMilestoneId(
  trackId: "qaza" | "roza",
  debt: DebtProgress,
  kind: "active" | "cleared",
): string {
  if (kind === "active") return `${trackId}:debt:${debt.total}`;
  return `${trackId}:debt:${debt.total}:cleared`;
}

function buildDebtMilestone(
  trackId: "qaza" | "roza",
  debt: DebtProgress,
  kind: "active" | "cleared",
): MilestoneProgress {
  const cleared = debt.remaining === 0;
  const isClearedMilestone = kind === "cleared";

  const titles =
    trackId === "qaza"
      ? { active: "Clear Qaza Debt", cleared: "Qaza Debt Cleared" }
      : { active: "Clear Roza Debt", cleared: "Roza Debt Cleared" };

  const descriptions =
    trackId === "qaza"
      ? {
          active: (total: number) => `Make up ${total} qaza ${total === 1 ? "prayer" : "prayers"}`,
          cleared: (total: number) =>
            `Cleared all ${total} tracked qaza ${total === 1 ? "prayer" : "prayers"}`,
        }
      : {
          active: (total: number) => `Make up ${total} missed ${total === 1 ? "fast" : "fasts"}`,
          cleared: (total: number) =>
            `Cleared all ${total} tracked missed ${total === 1 ? "fast" : "fasts"}`,
        };

  return {
    id: debtMilestoneId(trackId, debt, kind),
    trackId,
    level: 1,
    title: isClearedMilestone ? titles.cleared : titles.active,
    description: isClearedMilestone
      ? descriptions.cleared(debt.total)
      : descriptions.active(debt.total),
    threshold: debt.total,
    value: debt.completed,
    unlocked: isClearedMilestone ? cleared : false,
    progress: debt.total > 0 ? Math.min(debt.completed / debt.total, 1) : 0,
  };
}

/** Active debt goal when the user has qaza or roza configured; omitted when total is 0. */
export function buildActiveDebtGoals(debt: {
  qaza: DebtProgress | null;
  roza: DebtProgress | null;
}): MilestoneProgress[] {
  const goals: MilestoneProgress[] = [];
  if (debt.qaza && debt.qaza.remaining > 0) {
    goals.push(buildDebtMilestone("qaza", debt.qaza, "active"));
  }
  if (debt.roza && debt.roza.remaining > 0) {
    goals.push(buildDebtMilestone("roza", debt.roza, "active"));
  }
  return goals;
}

/** Milestones earned when a debt cycle is fully cleared. */
export function buildClearedDebtMilestones(debt: {
  qaza: DebtProgress | null;
  roza: DebtProgress | null;
}): MilestoneProgress[] {
  const cleared: MilestoneProgress[] = [];
  if (debt.qaza && debt.qaza.remaining === 0) {
    cleared.push(buildDebtMilestone("qaza", debt.qaza, "cleared"));
  }
  if (debt.roza && debt.roza.remaining === 0) {
    cleared.push(buildDebtMilestone("roza", debt.roza, "cleared"));
  }
  return cleared;
}

function parseDebtMilestoneId(
  id: string,
): { trackId: "qaza" | "roza"; total: number; kind: "active" | "cleared" } | null {
  const clearedMatch = /^(qaza|roza):debt:(\d+):cleared$/.exec(id);
  if (clearedMatch) {
    return {
      trackId: clearedMatch[1] as "qaza" | "roza",
      total: Number(clearedMatch[2]),
      kind: "cleared",
    };
  }

  const activeMatch = /^(qaza|roza):debt:(\d+)$/.exec(id);
  if (activeMatch) {
    return {
      trackId: activeMatch[1] as "qaza" | "roza",
      total: Number(activeMatch[2]),
      kind: "active",
    };
  }

  return null;
}

export function getDebtMilestoneById(
  id: string,
  debt: { qaza: DebtProgress | null; roza: DebtProgress | null },
): MilestoneProgress | undefined {
  const parsed = parseDebtMilestoneId(id);
  if (!parsed) return undefined;

  const { trackId, total, kind } = parsed;
  const current = trackId === "qaza" ? debt.qaza : debt.roza;

  if (kind === "cleared") {
    return buildDebtMilestone(trackId, { total, completed: total, remaining: 0 }, "cleared");
  }

  if (current) {
    return buildDebtMilestone(trackId, current, "active");
  }

  return buildDebtMilestone(trackId, { total, completed: 0, remaining: total }, "active");
}
