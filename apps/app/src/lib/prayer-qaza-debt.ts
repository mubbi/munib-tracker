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

  // Prefer the persisted log status over UI/memory — calendar vs home can diverge.
  const priorStatus = existingLog?.status ?? previous;
  const wasInQazaDebtStatus = QAZA_DEBT_STATUSES.has(priorStatus);
  const isInQazaDebtStatus = QAZA_DEBT_STATUSES.has(next);

  if (isInQazaDebtStatus && !wasInQazaDebtStatus) {
    if (options?.addToQaza) {
      await QazaRepository.incrementRemaining(prayerId, 1);
      return true;
    }
    return false;
  }

  if (wasInQazaDebtStatus && !isInQazaDebtStatus) {
    // Only unwind debt we know was added. Legacy logs without the flag that were
    // already in a debt status keep the previous `!== false` behavior so old
    // missed entries still decrement once when cleared.
    const shouldUnwind =
      existingLog?.qazaDebtAdded === true ||
      (existingLog?.qazaDebtAdded == null && existingLog != null);
    if (shouldUnwind) {
      await QazaRepository.incrementRemaining(prayerId, -1);
    }
    return undefined;
  }

  return existingLog?.qazaDebtAdded;
}
