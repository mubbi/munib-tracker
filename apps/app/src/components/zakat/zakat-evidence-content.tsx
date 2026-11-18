import { ZAKAT_HADITH_REFS, ZAKAT_QURAN_REFS } from "@munib-tracker/shared/content/zakat-guide";
import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import {
  JannahCallout,
  JannahHadithEvidence,
  JannahQuranEvidence,
} from "@/components/jannah/primitives";
import { Spacing } from "@/constants/theme";

export function ZakatEvidenceContent() {
  const { t } = useTranslation();
  const wide = useLearnHubLayout();
  // Wide web / tablets: Qur'an and hadith evidence sit side by side.
  const columns = learnColumnsFor(wide.contentWidth, { minCell: 420, gap: Spacing.four, max: 2 });

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
      {columns > 1 ? (
        <LearnColumnsGrid columns={columns} gap={Spacing.four}>
          <JannahQuranEvidence refs={quranRefs} />
          <JannahHadithEvidence refs={hadithRefs} />
        </LearnColumnsGrid>
      ) : (
        <>
          <JannahQuranEvidence refs={quranRefs} />
          <JannahHadithEvidence refs={hadithRefs} />
        </>
      )}
    </>
  );
}
