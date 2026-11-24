import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { hifzConfirmCopyKeys } from "@/lib/quran-surah-reader";
import { useToast } from "@/providers/toast-provider";
import { type HifzStatus, hifzKey, nextHifzStatus, useHifzActions } from "@/stores/hifz-store";

/**
 * Confirm-then-cycle for an ayah's hifz status (none → memorized → review → none):
 * `requestHifz` opens the dialog, `confirmHifz` applies it and toasts the result.
 * `dialog` carries the ConfirmDialog copy for the pending ayah.
 */
export function useHifzConfirm({
  surahName,
  hifzMap,
}: {
  surahName: string | undefined;
  hifzMap: Record<string, HifzStatus>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const { cycle: cycleHifz } = useHifzActions();
  const [hifzPending, setHifzPending] = useState<{ surah: number; ayah: number } | null>(null);

  /** Stable — ayah-row prop. */
  const requestHifz = useCallback((surahNum: number, ayahNum: number) => {
    setHifzPending({ surah: surahNum, ayah: ayahNum });
  }, []);

  const cancelHifz = useCallback(() => setHifzPending(null), []);

  const confirmHifz = useCallback(async () => {
    if (!hifzPending) return;
    const { surah: surahNum, ayah: ayahNum } = hifzPending;
    setHifzPending(null);
    const nextStatus = await cycleHifz(surahNum, ayahNum);
    const ref = t("hifz.toastRef", { surah: surahName ?? String(surahNum), ayah: ayahNum });
    if (nextStatus === "memorized") {
      toast.success(t("hifz.toastMemorizedTitle"), t("hifz.toastMemorizedBody", { ref }));
    } else if (nextStatus === "review") {
      toast.info(t("hifz.toastReviewTitle"), t("hifz.toastReviewBody", { ref }));
    } else {
      toast.info(t("hifz.toastClearedTitle"), t("hifz.toastClearedBody", { ref }));
    }
  }, [cycleHifz, hifzPending, surahName, t, toast]);

  const copy = hifzConfirmCopyKeys(
    hifzPending ? nextHifzStatus(hifzMap[hifzKey(hifzPending.surah, hifzPending.ayah)]) : null,
  );
  const pendingRef = hifzPending
    ? t("hifz.toastRef", {
        surah: surahName ?? String(hifzPending.surah),
        ayah: hifzPending.ayah,
      })
    : "";

  return {
    hifzPending,
    requestHifz,
    cancelHifz,
    confirmHifz,
    dialog: {
      visible: hifzPending != null,
      message: hifzPending != null ? t(copy.bodyKey, { ref: pendingRef }) : undefined,
      confirmLabel: t(copy.confirmKey),
      destructive: copy.destructive,
    },
  };
}
