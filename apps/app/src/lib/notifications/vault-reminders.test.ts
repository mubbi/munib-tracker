import { DEFAULT_USER_PREFERENCES } from "@munib-tracker/shared/constants";
import type { UserPreferences } from "@munib-tracker/shared/types";

import { DEFAULT_LOCATION } from "@/lib/location";

import type { BuiltReminder } from "./build-reminders";
import { reminderBudgetTier } from "./reminder-budget";
import { pushVaultRecordReminders, type VaultReminderOptions } from "./vault-reminders";

const NOW = new Date(2026, 10, 23, 8, 0, 0);

function build(options: VaultReminderOptions, prefs: Partial<UserPreferences> = {}) {
  const reminders: BuiltReminder[] = [];
  pushVaultRecordReminders(reminders, {
    prefs: { ...DEFAULT_USER_PREFERENCES, ...prefs },
    location: { ...DEFAULT_LOCATION, timeZone: undefined },
    now: NOW,
    options,
    priority: { debts: 410, wasiyyahReview: 420 },
  });
  return reminders;
}

describe("vault record reminders (NF-3.8 / NF-3.9)", () => {
  it("schedules debts due 3 days before and on the day with generic text", () => {
    const r = build({ debtDueDates: ["2026-11-27"] });
    expect(r.map((x) => x.id)).toEqual(["debts:2026-11-24", "debts:2026-11-27"]);
    expect(r[0]).toMatchObject({ title: "Personal reminder", route: "/debts", repeat: "date" });
    expect(r[0]?.body).toBe("A payment is due. Open the app to see the details.");
    expect(r[0]?.fireAt.getHours()).toBe(9);
    expect(reminderBudgetTier(r[0]?.priority ?? 0)).toBe(4);
  });

  it("schedules the wasiyyah review weekly from the due date", () => {
    const r = build({ wasiyyahReviewDueOn: "2026-11-20" });
    expect(r.map((x) => x.id)).toEqual(["wasiyyahReview:2026-11-27", "wasiyyahReview:2026-12-04"]);
    expect(r[0]?.body).toBe("Time to review your wasiyyah.");
  });

  it("respects the notificationPrefs toggles (unset = on)", () => {
    const off = build(
      { debtDueDates: ["2026-11-27"], wasiyyahReviewDueOn: "2026-11-23" },
      {
        notificationPrefs: {
          ...DEFAULT_USER_PREFERENCES.notificationPrefs,
          debts: false,
          wasiyyahReview: false,
        },
      },
    );
    expect(off).toEqual([]);
  });

  it("keeps debt due dates firing during an excused period but pauses the wasiyyah review (D31)", () => {
    const r = build(
      { debtDueDates: ["2026-11-27"], wasiyyahReviewDueOn: "2026-11-20" },
      { activeExcusedReason: "hayd" },
    );
    expect(r.map((x) => x.id)).toEqual(["debts:2026-11-24", "debts:2026-11-27"]);
  });
});
