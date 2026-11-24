import type { ExcusedReason, PrayerLog, ZikrItem } from "@munib-tracker/shared/types";
import { useEffect, useMemo, useState } from "react";

import { PrayerRepository } from "@/db";
import { SAYYID_AL_ISTIGHFAR_ZIKR_ID } from "@/lib/muhasabah/flow";
import { type MuhasabahSalahRecap, summarizeSalahForMuhasabah } from "@/lib/muhasabah/logic";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";

/**
 * Read-only inputs for one review night: the Salah recap from the tracker's
 * logs and the bundled Sayyid al-Istighfar (loads the zikr corpus if needed).
 */
export function useMuhasabahDay(
  date: string,
  activeExcusedReason: ExcusedReason | null | undefined,
): { recap: MuhasabahSalahRecap; istighfar: ZikrItem | undefined } {
  const [logs, setLogs] = useState<PrayerLog[]>([]);
  const [istighfar, setIstighfar] = useState<ZikrItem | undefined>(() =>
    getZikrById(SAYYID_AL_ISTIGHFAR_ZIKR_ID),
  );

  useEffect(() => {
    let alive = true;
    void PrayerRepository.getByDate(date).then((rows) => {
      if (alive) setLogs(rows);
    });
    if (!istighfar) {
      void ensureZikrCorpus().then(() => {
        if (alive) setIstighfar(getZikrById(SAYYID_AL_ISTIGHFAR_ZIKR_ID));
      });
    }
    return () => {
      alive = false;
    };
  }, [date, istighfar]);

  const recap = useMemo(
    () => summarizeSalahForMuhasabah(logs, date, activeExcusedReason),
    [logs, date, activeExcusedReason],
  );

  return { recap, istighfar };
}
