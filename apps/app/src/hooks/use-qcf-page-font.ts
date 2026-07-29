import { useLayoutEffect, useState } from "react";

import { QCF_BSML_FONT_FAMILY, qcfPageFontFamily } from "@/lib/arabic-fonts";
import { isMushafPageFontReady, loadQcfBsmlFont, loadQcfPageFont } from "@/lib/qcf-font-cache";

type QcfPageFontState = {
  ready: boolean;
  fontFamily: string;
  basmalaFontFamily: string;
};

/** Lazy-load the QCF V2 page font + shared basmala font for mushaf rendering. */
export function useQcfPageFont(page: number, needsBsml = false): QcfPageFontState {
  const fontFamily = qcfPageFontFamily(page);
  const basmalaFontFamily = QCF_BSML_FONT_FAMILY;
  const [readyState, setReadyState] = useState(() => ({
    page,
    ready: isMushafPageFontReady(page, needsBsml),
  }));
  const ready =
    isMushafPageFontReady(page, needsBsml) || (readyState.page === page && readyState.ready);

  // useLayoutEffect so stale `ready` from the previous page never paints.
  useLayoutEffect(() => {
    if (isMushafPageFontReady(page, needsBsml)) {
      setReadyState({ page, ready: true });
      return;
    }
    setReadyState({ page, ready: false });
    let cancelled = false;
    const loads = [loadQcfPageFont(page)];
    if (needsBsml) loads.push(loadQcfBsmlFont());
    void Promise.all(loads).then(() => {
      if (!cancelled) setReadyState({ page, ready: true });
    });
    return () => {
      cancelled = true;
    };
  }, [needsBsml, page]);

  return { ready, fontFamily, basmalaFontFamily };
}
