import * as Font from "expo-font";
import { useEffect, useState } from "react";

import { qcfPageFontFamily, qcfPageFontUrl } from "@/lib/arabic-fonts";

const loadedPages = new Set<number>();
const loadingPages = new Map<number, Promise<void>>();

async function loadQcfPageFont(page: number): Promise<void> {
  if (loadedPages.has(page)) return;
  const pending = loadingPages.get(page);
  if (pending) return pending;

  const family = qcfPageFontFamily(page);
  const promise = Font.loadAsync({ [family]: qcfPageFontUrl(page) }).then(() => {
    loadedPages.add(page);
    loadingPages.delete(page);
  });
  loadingPages.set(page, promise);
  return promise;
}

/** Lazy-load the QCF V2 glyph font for a mushaf page (cached in-memory). */
export function useQcfPageFont(page: number): { ready: boolean; fontFamily: string } {
  const [ready, setReady] = useState(loadedPages.has(page));
  const fontFamily = qcfPageFontFamily(page);

  useEffect(() => {
    if (loadedPages.has(page)) {
      setReady(true);
      return;
    }
    let cancelled = false;
    void loadQcfPageFont(page).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return { ready, fontFamily };
}
