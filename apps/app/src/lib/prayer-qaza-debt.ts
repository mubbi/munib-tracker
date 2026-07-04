import type { PrayerId, PrayerLog, PrayerStatus } from "@munib-tracker/shared/types";
import { isQazaPrayer } from "@munib-tracker/shared/validators";

import { QazaRepository } from "@/db";

const QAZA_DEBT_STATUSES = new Set<PrayerStatus>(["missed", "qaza"]);

export type ReconcileQazaDebtOptions = {
  addToQaza?: boolean;
};

/** Updates the obligatory qaza counter when entering or leaving missed/qaza status. */
export async function reconcileQazaDebtForStatusChange(
  prayerId: PrayerId,
  previous: PrayerStatus,
  next: PrayerStatus,
  existingLog: PrayerLog | undefined,
  options?: ReconcileQazaDebtOptions,
): Promise<boolean | undefined> {
  if (!isQazaPrayer(prayerId)) {
    return existingLog?.qazaDebtAdded;
  }

  const wasInQazaDebtStatus = QAZA_DEBT_STATUSES.has(previous);
  const isInQazaDebtStatus = QAZA_DEBT_STATUSES.has(next);

  if (isInQazaDebtStatus && !wasInQazaDebtStatus) {
    if (options?.addToQaza) {
      await QazaRepository.incrementRemaining(prayerId, 1);
      return true;
    }
    return false;
  }

  if (wasInQazaDebtStatus && !isInQazaDebtStatus) {
    if (existingLog?.qazaDebtAdded !== false) {
      await QazaRepository.incrementRemaining(prayerId, -1);
    }
    return undefined;
  }

  return existingLog?.qazaDebtAdded;
}
