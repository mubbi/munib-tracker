import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Platform } from "react-native";

import { QCF_BSML_FONT_FAMILY, qcfPageFontFamily } from "@/lib/arabic-fonts";
import { isMushafPageFontReady, loadQcfBsmlFont, loadQcfPageFont } from "@/lib/qcf-font-cache";

type QcfPageFontState = {
  ready: boolean;
  /** Every source failed for this page — show a retry instead of an endless spinner. */
  failed: boolean;
  retry: () => void;
  fontFamily: string;
  basmalaFontFamily: string;
};

type LoadState = { page: number; ready: boolean; failed: boolean };

/** Lazy-load the QCF V2 page font + shared basmala font for mushaf rendering. */
export function useQcfPageFont(page: number, needsBsml = false): QcfPageFontState {
  const fontFamily = qcfPageFontFamily(page);
  const basmalaFontFamily = QCF_BSML_FONT_FAMILY;
  const [attempt, setAttempt] = useState(0);
  const [loadState, setLoadState] = useState<LoadState>(() => ({
    page,
    ready: isMushafPageFontReady(page, needsBsml),
    failed: false,
  }));
  const current = loadState.page === page;
  const ready = isMushafPageFontReady(page, needsBsml) || (current && loadState.ready);
  const failed = !ready && current && loadState.failed;

  // useLayoutEffect so stale `ready` from the previous page never paints.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` re-runs the load on retry.
  useLayoutEffect(() => {
    if (isMushafPageFontReady(page, needsBsml)) {
      setLoadState({ page, ready: true, failed: false });
      return;
    }
    setLoadState({ page, ready: false, failed: false });
    let cancelled = false;
    const loads = [loadQcfPageFont(page)];
    if (needsBsml) loads.push(loadQcfBsmlFont());
    void Promise.all(loads).then(
      () => {
        if (!cancelled) setLoadState({ page, ready: true, failed: false });
      },
      () => {
        if (!cancelled) setLoadState({ page, ready: false, failed: true });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [needsBsml, page, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Web: retry by itself when the browser reports the connection is back.
  useEffect(() => {
    if (!failed || Platform.OS !== "web" || typeof window === "undefined") return;
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [failed, retry]);

  return { ready, failed, retry, fontFamily, basmalaFontFamily };
}
