import { useTranslation } from "react-i18next";

import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { usePassageLabel } from "@/components/quran/recite-along-label";
import { passageKey } from "@/lib/recite-along/passages";
import { zikrRecitePassages } from "@/lib/tasbeeh-voice/recite-instead";

/**
 * "Recite along" for a Qur'anic remembrance on a single counter (Ayat al-Kursi,
 * the Quls …): these ayahs are recited with the on-device listener rather than
 * counted by voice. Renders nothing for other zikr or where practice is
 * unavailable (TV) — `ReciteAlongCard` gates itself.
 */
export function ZikrReciteAlongCard({ zikrId }: { zikrId: string }) {
  const { t } = useTranslation();
  const passages = zikrRecitePassages(zikrId);
  if (passages.length === 0) return null;
  return (
    <ReciteAlongCard
      passages={passages}
      title={t("handsFreeZikr2.reciteInstead.title")}
      body={t("handsFreeZikr2.reciteInstead.body")}
    />
  );
}

/**
 * Compact "Recite along" buttons for the guided session footer: one per passage
 * (labelled by reference when there are several, e.g. the three Quls). The
 * session is pushed, so finishing or going back returns to the same step.
 */
export function ZikrReciteAlongButtons({ zikrId }: { zikrId: string }) {
  const passageLabel = usePassageLabel();
  const passages = zikrRecitePassages(zikrId);
  if (passages.length === 0) return null;
  const single = passages.length === 1;
  return (
    <>
      {passages.map((p) => (
        <ReciteAlongButton
          key={passageKey(p)}
          passage={p}
          variant="ghost"
          size="sm"
          label={single ? undefined : passageLabel(p)}
        />
      ))}
    </>
  );
}
