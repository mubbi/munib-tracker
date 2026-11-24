import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { HijriDateSettingsSection } from "@/components/hijri/hijri-date-settings-section";
import { ThemedText } from "@/components/themed-text";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { currencyPickerLabel } from "@/lib/format-currency";
import { LIBRARY_SECTIONS, orderLibrarySections } from "@/lib/library-menu";
import { useSetting } from "@/lib/settings/use-setting";

import { OrderedListEditor } from "../ordered-list-editor";
import { SettingsRow } from "../settings-rows";

/** Language & region › Hijri date (D14): the hijri feature's drop-in section (writes reschedule). */
export function HijriDateEditor() {
  return <HijriDateSettingsSection />;
}

/** Language & region › Default currency: seeds new zakat / fidyah / sadaqah drafts. */
export function DefaultCurrencyEditor({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { value, setValue, def } = useSetting<string>(settingId);
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingsRow
        icon={def.icon}
        title={t(def.titleKey)}
        subtitle={def.subtitleKey ? t(def.subtitleKey) : undefined}
        value={currencyPickerLabel(value)}
        onPress={() => setOpen(true)}
      />
      <CurrencyPickerSheet
        visible={open}
        selectedCode={value}
        onSelect={(code) => {
          setOpen(false);
          void setValue(code);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

/**
 * Appearance & home › Library order (D13): reorders the Library tab's sections
 * with the shared up/down editor (D-pad friendly on TV).
 */
export function LibraryOrderEditor({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { value, setValue, def } = useSetting<string[] | undefined>(settingId);
  const order = orderLibrarySections(LIBRARY_SECTIONS, value).map((section) => section.id);
  const labelFor = (id: string) => {
    const section = LIBRARY_SECTIONS.find((s) => s.id === id);
    return section ? t(section.titleKey) : id;
  };
  return (
    <View style={styles.block}>
      <ThemedText type="small">{t(def.titleKey)}</ThemedText>
      {def.subtitleKey ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(def.subtitleKey)}
        </ThemedText>
      ) : null}
      <OrderedListEditor
        testID="library-order-editor"
        order={order}
        allIds={order}
        labelFor={labelFor}
        onChange={(next) => void setValue(next)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.one },
});
