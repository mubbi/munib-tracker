import { trimRemindersToBudget } from "@/lib/notifications/build-reminders";
import { PRIORITY_IQAMAH } from "@/lib/notifications/iqamah-reminders";
import { PREFERRED_TIME_PRIORITY } from "@/lib/notifications/preferred-time-reminders";
import {
  budgetPriority,
  normalizedBudgetPriority,
  priorityForKind,
  REMINDER_BUDGET_TIER,
  reminderBudgetTier,
} from "@/lib/notifications/reminder-budget";
import { PRIORITY_SUHOOR } from "@/lib/voluntary-fasting/reminders";
import { buildReminder } from "@/test-support/fixtures/notifications";

const at = (h: number) => new Date(`2026-07-03T${String(h).padStart(2, "0")}:00:00.000Z`);

describe("reminder budget tiers (§11)", () => {
  it("maps the §11 table", () => {
    expect(REMINDER_BUDGET_TIER.prayer).toBe(1);
    expect(REMINDER_BUDGET_TIER.adhan).toBe(1);
    expect(REMINDER_BUDGET_TIER.qaza).toBe(1);
    expect(REMINDER_BUDGET_TIER.iqamah).toBe(2);
    expect(REMINDER_BUDGET_TIER.suhoor).toBe(2);
    expect(REMINDER_BUDGET_TIER.fastIntent).toBe(3);
    expect(REMINDER_BUDGET_TIER.seasonal).toBe(3);
    expect(REMINDER_BUDGET_TIER.debtsDue).toBe(4);
    expect(REMINDER_BUDGET_TIER.wasiyyahReview).toBe(4);
    expect(REMINDER_BUDGET_TIER.muhasabah).toBe(5);
    expect(REMINDER_BUDGET_TIER.rawatibNudge).toBe(5);
  });

  it("keeps tier 1 to Salah, Adhan and Qaza — zikr nudges and extras sit lower (M3)", () => {
    const tierOne = Object.entries(REMINDER_BUDGET_TIER)
      .filter(([, tier]) => tier === 1)
      .map(([kind]) => kind);
    expect(tierOne.sort()).toEqual(["adhan", "prayer", "qaza"]);
    expect(REMINDER_BUDGET_TIER.salahZikr).toBe(3);
    expect(REMINDER_BUDGET_TIER.preferredTime).toBe(2);
  });

  it("ranks suhoor at or above iqamah, and the preferred time below both (M3)", () => {
    expect(reminderBudgetTier(PRIORITY_SUHOOR)).toBe(2);
    expect(PRIORITY_SUHOOR).toBeLessThanOrEqual(PRIORITY_IQAMAH);
    expect(PREFERRED_TIME_PRIORITY).toBeGreaterThan(PRIORITY_IQAMAH);
    expect(PREFERRED_TIME_PRIORITY).toBeGreaterThan(PRIORITY_SUHOOR);
    expect(reminderBudgetTier(PREFERRED_TIME_PRIORITY)).toBe(2);
  });

  it("encodes tier × 100 + rank, clamping the rank", () => {
    expect(budgetPriority(1, 10)).toBe(110);
    expect(budgetPriority(5)).toBe(599);
    expect(budgetPriority(2, -4)).toBe(200);
    expect(budgetPriority(3, 400)).toBe(399);
    expect(priorityForKind("suhoor", 50)).toBe(250);
  });

  it("treats a bare tier as the last rank of that tier", () => {
    expect(normalizedBudgetPriority(3)).toBe(399);
    expect(normalizedBudgetPriority(170)).toBe(170);
    expect(reminderBudgetTier(4)).toBe(4);
    expect(reminderBudgetTier(priorityForKind("coach"))).toBe(5);
    expect(reminderBudgetTier(9999)).toBe(5);
    expect(reminderBudgetTier(0)).toBe(1);
  });
});

describe("trimRemindersToBudget — priority tiers", () => {
  it("drops the lowest tier first, then the highest rank, then the latest fire", () => {
    const reminders = [
      buildReminder({ id: "muhasabah", priority: priorityForKind("muhasabah"), fireAt: at(1) }),
      buildReminder({ id: "debt", priority: priorityForKind("debtsDue"), fireAt: at(2) }),
      buildReminder({ id: "intent", priority: priorityForKind("fastIntent", 70), fireAt: at(3) }),
      buildReminder({ id: "daily", priority: priorityForKind("dailyNudge", 80), fireAt: at(4) }),
      buildReminder({ id: "suhoor", priority: priorityForKind("suhoor", 50), fireAt: at(5) }),
      buildReminder({ id: "fajr", priority: priorityForKind("prayer", 10), fireAt: at(6) }),
    ];
    expect(trimRemindersToBudget(reminders, 5).map((r) => r.id)).toEqual([
      "debt",
      "intent",
      "daily",
      "suhoor",
      "fajr",
    ]);
    expect(trimRemindersToBudget(reminders, 3).map((r) => r.id)).toEqual([
      "intent",
      "suhoor",
      "fajr",
    ]);
    expect(trimRemindersToBudget(reminders, 1).map((r) => r.id)).toEqual(["fajr"]);
  });

  it("a full budget keeps suhoor over the preferred time and the zikr nudges (M3)", () => {
    const reminders = [
      buildReminder({ id: "fajr", priority: priorityForKind("prayer", 10), fireAt: at(1) }),
      buildReminder({
        id: "afterDhuhr",
        priority: priorityForKind("salahZikr", 75),
        fireAt: at(2),
      }),
      buildReminder({ id: "preferred", priority: PREFERRED_TIME_PRIORITY, fireAt: at(3) }),
      buildReminder({ id: "suhoor", priority: PRIORITY_SUHOOR, fireAt: at(4) }),
      buildReminder({ id: "intent", priority: priorityForKind("fastIntent", 70), fireAt: at(5) }),
    ];
    expect(trimRemindersToBudget(reminders, 2).map((r) => r.id)).toEqual(["fajr", "suhoor"]);
    expect(trimRemindersToBudget(reminders, 3).map((r) => r.id)).toEqual([
      "fajr",
      "preferred",
      "suhoor",
    ]);
    expect(trimRemindersToBudget(reminders, 4).map((r) => r.id)).toEqual([
      "fajr",
      "preferred",
      "suhoor",
      "intent",
    ]);
  });

  it("never lets a bare-tier kind outrank a Salah reminder", () => {
    const reminders = [
      buildReminder({ id: "habit", priority: 5, fireAt: at(1) }),
      buildReminder({ id: "qaza", priority: priorityForKind("qaza", 70), fireAt: at(9) }),
    ];
    expect(trimRemindersToBudget(reminders, 1).map((r) => r.id)).toEqual(["qaza"]);
  });

  it("returns nothing for a zero budget", () => {
    expect(trimRemindersToBudget([buildReminder(), buildReminder({ id: "b" })], 0)).toEqual([]);
  });
});
