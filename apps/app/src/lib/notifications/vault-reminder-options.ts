import type { DebtsVaultItem, WasiyyahVaultItem } from "@munib-tracker/shared/types";

import { debtEntries } from "@/lib/debts/debts";
import { liveItems, vault } from "@/lib/vault";
import { wasiyyahReviewDueOn } from "@/lib/wasiyyah/review";
import { settingsOf, versionsOf } from "@/lib/wasiyyah/wasiyyah-store";

import type { VaultReminderOptions } from "./vault-reminders";

/**
 * Reads the debts and wasiyyah vault documents for `buildReminders`. Only dates
 * leave this function. A locked or empty vault yields no vault reminders (the
 * next reschedule after unlock catches up).
 */
export async function vaultReminderOptions(): Promise<VaultReminderOptions> {
  const [debts, wasiyyah] = await Promise.all([
    vault.read<DebtsVaultItem>("debts").catch(() => null),
    vault.read<WasiyyahVaultItem>("wasiyyah").catch(() => null),
  ]);
  const out: VaultReminderOptions = {};
  if (debts) {
    out.debtDueDates = debtEntries(liveItems(debts))
      .filter((d) => d.status === "open" && d.dueOn)
      .map((d) => d.dueOn as string);
  }
  if (wasiyyah) {
    const items = liveItems(wasiyyah);
    out.wasiyyahReviewDueOn = wasiyyahReviewDueOn(
      settingsOf(items),
      versionsOf(items)[0]?.createdAt,
    );
  }
  return out;
}
