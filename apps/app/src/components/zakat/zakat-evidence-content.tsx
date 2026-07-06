import { ZAKAT_HADITH_REFS, ZAKAT_QURAN_REFS } from "@munib-tracker/shared/content";
import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  JannahCallout,
  JannahHadithEvidence,
  JannahQuranEvidence,
} from "@/components/jannah/primitives";

export function ZakatEvidenceContent() {
  const { t } = useTranslation();

  const quranRefs = useMemo((): JannahQuranRef[] => {
    return ZAKAT_QURAN_REFS.map((ref, index) => ({
      ...ref,
      excerpt: t(`zakat.quran.${index}.excerpt`),
    }));
  }, [t]);

  const hadithRefs = useMemo((): JannahHadithRef[] => {
    return ZAKAT_HADITH_REFS.map((ref, index) => ({
      ...ref,
      excerpt: t(`zakat.hadith.${index}.excerpt`),
    }));
  }, [t]);

  return (
    <>
      <JannahCallout tone="info">{t("zakat.evidenceIntro")}</JannahCallout>
      <JannahQuranEvidence refs={quranRefs} />
      <JannahHadithEvidence refs={hadithRefs} />
    </>
  );
}
