import { useTranslation } from "react-i18next";

import type { Passage } from "@/lib/quran-companion/types";
import { getSurahByNumber } from "@/lib/quran-meta";

/** "Al-Kahf 1–10" / "Al-Fatihah 1–7" style label (surah meta only, no ayah JSON). */
export function usePassageLabel() {
  const { t } = useTranslation();
  return (p: Passage) => {
    const surah = getSurahByNumber(p.surah)?.nameTransliteration ?? String(p.surah);
    return p.ayahStart === p.ayahEnd
      ? t("quranCompanion.passage.single", { surah, ayah: p.ayahStart })
      : t("quranCompanion.passage.range", { surah, from: p.ayahStart, to: p.ayahEnd });
  };
}
