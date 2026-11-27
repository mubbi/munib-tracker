import { getTafsirEdition } from "@munib-tracker/shared/i18n";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import { TranslationPickerSheet } from "@/components/quran/translation-picker-sheet";
import { ALL_QURAN_TRANSLATIONS } from "@/lib/quran-translation-options";
import { useSetting } from "@/lib/settings/use-setting";
import { usePreferences } from "@/stores/preferences-store";

import { SettingsRow } from "../settings-rows";

/**
 * Primary translation, second translation or tafsir — a row with the edition
 * name that opens the reader's own picker sheet (same write path via `useSetting`).
 */
export function QuranEditionControl({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { value, setValue, def } = useSetting<string>(settingId);
  const [open, setOpen] = useState(false);
  const isTafsir = settingId === "quran.reader.tafsir";
  const allowNone = settingId !== "quran.reader.translation";
  const title = t(def.titleKey);
  const preferredLanguages = [prefs.translationLocale, prefs.locale];

  const name = isTafsir
    ? getTafsirEdition(value)?.name
    : ALL_QURAN_TRANSLATIONS.find((e) => e.id === value)?.name;
  const display = value ? (name ?? value) : t("settingsPanel.none");

  return (
    <>
      <SettingsRow
        icon={def.icon}
        title={title}
        subtitle={def.subtitleKey ? t(def.subtitleKey) : undefined}
        value={display}
        onPress={() => setOpen(true)}
      />
      {isTafsir ? (
        <TafsirPickerSheet
          visible={open}
          title={title}
          selectedId={value}
          allowNone
          preferredLanguages={preferredLanguages}
          onSelect={(id) => void setValue(id)}
          onClose={() => setOpen(false)}
        />
      ) : (
        <TranslationPickerSheet
          visible={open}
          title={title}
          selectedId={value}
          allowNone={allowNone}
          preferredLanguages={preferredLanguages}
          onSelect={(id) => void setValue(id)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
