import { getTafsirEdition } from "@munib-tracker/shared/i18n";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { hasEditionAyahs } from "@/api/quran-remote";
import { TafsirAyahSheet } from "@/components/quran/tafsir-ayah-sheet";
import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import { useTafsirSurah } from "@/hooks/use-quran";
import { resolvePreferredTafsirId } from "@/lib/quran-tafsir-options";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { usePreferences } from "@/stores/preferences-store";
import { useQuranPrefs } from "@/stores/quran-store";

/**
 * Self-contained tafsir for one ayah, for ayah cards outside the surah reader
 * (the Adhkar Qur'an cards): resolves the reader's tafsir choice, fetches that
 * surah's tafsir cache-first only once an ayah is asked for, and — with no
 * tafsir chosen yet — offers the picker first, then shows the ayah's tafsir.
 */
export function AyahTafsirSheetHost({
  surah,
  ayah,
  onClose,
}: {
  surah: number;
  /** The ayah whose tafsir is open, or `null` (closed). */
  ayah: number | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const prefs = useQuranPrefs();
  const { translationLocale, locale: appLocale } = usePreferences();
  const tafsirId = resolvePreferredTafsirId(prefs.preferredTafsirId, translationLocale, appLocale);
  const edition = tafsirId ? getTafsirEdition(tafsirId) : undefined;
  const open = ayah != null;
  const query = useTafsirSurah(open && tafsirId ? tafsirId : null, surah);
  const tafsirMap = hasEditionAyahs(query.data) ? query.data : undefined;
  const loading = Boolean(tafsirId) && open && query.isPending;
  const offline = Boolean(tafsirId) && !loading && query.isError && !tafsirMap;
  const preferredLanguages = useMemo(
    () => [translationLocale, appLocale],
    [translationLocale, appLocale],
  );
  const refetch = query.refetch;
  // The picker closes itself right after a choice: keep the ayah open for its tafsir.
  const pickedRef = useRef(false);

  return (
    <>
      <TafsirPickerSheet
        visible={open && !tafsirId}
        title={t("quran.tafsir")}
        allowNone={false}
        selectedId=""
        preferredLanguages={preferredLanguages}
        // Choosing one keeps `ayah` set, so its tafsir opens right after.
        onSelect={(id) => {
          pickedRef.current = Boolean(id);
          void updateQuranPrefs({ preferredTafsirId: id });
        }}
        onClose={() => {
          if (pickedRef.current) {
            pickedRef.current = false;
            return;
          }
          onClose();
        }}
      />
      <TafsirAyahSheet
        visible={open && Boolean(tafsirId)}
        onClose={onClose}
        surah={surah}
        ayah={ayah ?? 1}
        editionName={edition?.name ?? t("quran.tafsir")}
        author={edition?.author ?? ""}
        text={ayah != null ? tafsirMap?.[String(ayah)] : undefined}
        direction={edition?.direction ?? "ltr"}
        loading={loading}
        offline={offline}
        onRetry={() => void refetch()}
      />
    </>
  );
}
