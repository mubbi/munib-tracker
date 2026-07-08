import { useEffect, useState } from "react";

import { QCF_BSML_FONT_FAMILY, qcfPageFontFamily } from "@/lib/arabic-fonts";
import {
  isQcfBsmlFontLoaded,
  isQcfPageFontLoaded,
  loadQcfBsmlFont,
  loadQcfPageFont,
} from "@/lib/qcf-font-cache";

type QcfPageFontState = {
  ready: boolean;
  fontFamily: string;
  basmalaFontFamily: string;
};

/** Lazy-load the QCF V2 page font + shared basmala font for mushaf rendering. */
export function useQcfPageFont(page: number, needsBsml = false): QcfPageFontState {
  const [ready, setReady] = useState(
    isQcfPageFontLoaded(page) && (!needsBsml || isQcfBsmlFontLoaded()),
  );
  const fontFamily = qcfPageFontFamily(page);
  const basmalaFontFamily = QCF_BSML_FONT_FAMILY;

  useEffect(() => {
    if (isQcfPageFontLoaded(page) && (!needsBsml || isQcfBsmlFontLoaded())) {
      setReady(true);
      return;
    }
    let cancelled = false;
    const loads = [loadQcfPageFont(page)];
    if (needsBsml) loads.push(loadQcfBsmlFont());
    void Promise.all(loads).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [needsBsml, page]);

  return { ready, fontFamily, basmalaFontFamily };
}
