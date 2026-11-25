import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type ReactNode, type RefObject, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { PrayerRepository } from "@/db";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useAfterSalahAdhkarReminder } from "@/hooks/use-after-salah-adhkar-reminder";
import { useUndoToast } from "@/hooks/use-undo-toast";
import {
  type SetPrayerStatusOptions,
  usePrayerAtMasjidMap,
  usePrayerCombinedMap,
  usePrayerJamaMap,
  useTodayPrayers,
  useTrackerActions,
  useTrackerDate,
} from "@/stores/tracker-store";

const isDebtStatus = (status: PrayerStatus) => status === "missed" || status === "qaza";

type FocusableRef = RefObject<{ focus?: () => void } | null>;

export type PrayerStatusController = {
  /** Opens the full status sheet for `prayerId` (focus returns to `returnFocusRef`). */
  open: (prayerId: PrayerId, returnFocusRef?: FocusableRef) => void;
  /**
   * One-tap mark from a row / hero (P5-02): `completed`, or the status it
   * replaced. A Qaza debt unwound by the mark is re-added when it is undone.
   */
  quickSelect: (prayerId: PrayerId, next: PrayerStatus) => Promise<void>;
  /** The mounted sheet — render once in the screen. */
  sheet: ReactNode;
};

/**
 * Today's Salah status flow shared by Home (hero cell) and the Tracker rows:
 * one status sheet, the review / after-Salah-adhkar side effects, a toast with
 * **Undo** for Missed / Qaza (which can add to the Qaza counter — B-08) and the
 * one-tap "prayed" toggle. No new writes: everything goes through the tracker
 * store actions the tracker already used.
 */
export function usePrayerStatusController(): PrayerStatusController {
  const { t } = useTranslation();
  const date = useTrackerDate();
  const { status, notes } = useTodayPrayers();
  const jamaMap = usePrayerJamaMap();
  const atMasjidMap = usePrayerAtMasjidMap();
  const combinedMap = usePrayerCombinedMap();
  const {
    setPrayerStatus,
    setPrayerNotes,
    setPrayerJama,
    setPrayerCombinedOnDate,
    setPrayerAtMasjidOnDate,
  } = useTrackerActions();
  const remindAfterSalahAdhkar = useAfterSalahAdhkarReminder();
  const undoToast = useUndoToast();
  const [activePrayer, setActivePrayer] = useState<PrayerId | null>(null);
  const returnFocusRef = useRef<FocusableRef | undefined>(undefined);
  // Read the latest status inside async handlers without re-binding them.
  const statusRef = useRef(status);
  statusRef.current = status;
  // Whether a one-tap "prayed" unwound a Qaza debt, so its undo can restore it.
  const unwoundDebtRef = useRef<Partial<Record<PrayerId, boolean>>>({});

  // Keep the sheet mounted with a valid prayer id after it first opens so it can
  // play its close animation with stable content instead of unmounting instantly.
  const lastActivePrayer = useRef<PrayerId | null>(activePrayer);
  if (activePrayer) lastActivePrayer.current = activePrayer;
  const sheetPrayer = activePrayer ?? lastActivePrayer.current;

  const markPrayerStatus = useCallback(
    async (prayerId: PrayerId, next: PrayerStatus, options?: SetPrayerStatusOptions) => {
      const previous = statusRef.current[prayerId] ?? "pending";
      await setPrayerStatus(prayerId, next, options);
      if (next !== "pending" && next !== previous) {
        trackReviewInteraction("mark_prayer");
      }
      remindAfterSalahAdhkar(prayerId, previous, next);
    },
    [remindAfterSalahAdhkar, setPrayerStatus],
  );

  const selectFromSheet = useCallback(
    async (prayerId: PrayerId, next: PrayerStatus, options?: SetPrayerStatusOptions) => {
      const previous = statusRef.current[prayerId] ?? "pending";
      // B-10: a sheet choice supersedes what a one-tap mark remembered for this Salah.
      delete unwoundDebtRef.current[prayerId];
      if (isDebtStatus(next) && next !== previous) {
        // Undo goes back to the previous status; leaving a debt status through
        // the store unwinds exactly the Qaza debt this change added.
        await undoToast.run({
          do: () => markPrayerStatus(prayerId, next, options),
          undo: () => markPrayerStatus(prayerId, previous),
          messageKey: "tracker.statusMarkedToast",
          messageOptions: {
            salah: t(`prayers.${prayerId}`),
            status: t(`prayerStatus.${next}`),
          },
          type: "info",
        });
        return;
      }
      await markPrayerStatus(prayerId, next, options);
    },
    [markPrayerStatus, t, undoToast],
  );

  const quickSelect = useCallback(
    async (prayerId: PrayerId, next: PrayerStatus) => {
      const previous = statusRef.current[prayerId] ?? "pending";
      if (next === "completed" && isDebtStatus(previous)) {
        // Mirror `reconcileQazaDebtForStatusChange`: the debt it will unwind.
        const log = await PrayerRepository.getLog(prayerId, date || getLocalDateString());
        unwoundDebtRef.current[prayerId] =
          log?.qazaDebtAdded === true || (log?.qazaDebtAdded == null && log != null);
      }
      const options = isDebtStatus(next)
        ? { addToQaza: unwoundDebtRef.current[prayerId] ?? false }
        : undefined;
      if (isDebtStatus(next)) delete unwoundDebtRef.current[prayerId];
      await markPrayerStatus(prayerId, next, options);
    },
    [date, markPrayerStatus],
  );

  const open = useCallback((prayerId: PrayerId, focusRef?: FocusableRef) => {
    returnFocusRef.current = focusRef;
    setActivePrayer(prayerId);
  }, []);

  const today = getLocalDateString();
  const sheet = sheetPrayer ? (
    <PrayerStatusSheet
      visible={activePrayer != null}
      prayerId={sheetPrayer}
      prayerLabel={t(`prayers.${sheetPrayer}`)}
      currentStatus={status[sheetPrayer] ?? "pending"}
      currentNotes={notes[sheetPrayer]}
      isJama={jamaMap[sheetPrayer] ?? false}
      onToggleJama={(next) => setPrayerJama(sheetPrayer, next)}
      combined={combinedMap[sheetPrayer] ?? null}
      onSetCombined={(mode) => setPrayerCombinedOnDate(today, sheetPrayer, mode)}
      atMasjid={atMasjidMap[sheetPrayer] ?? false}
      onToggleAtMasjid={(masjidId) => setPrayerAtMasjidOnDate(today, sheetPrayer, masjidId)}
      onSelect={(next, options) => void selectFromSheet(sheetPrayer, next, options)}
      onSaveNotes={(text) => setPrayerNotes(sheetPrayer, text)}
      onClose={() => setActivePrayer(null)}
      returnFocusRef={returnFocusRef.current}
      undo={undoToast}
    />
  ) : null;

  return { open, quickSelect, sheet };
}
