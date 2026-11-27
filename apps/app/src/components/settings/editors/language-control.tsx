import type { AppLocale } from "@munib-tracker/shared/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LanguagePickerSheet, LanguageSelectRow } from "@/components/language-picker-sheet";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useSetting } from "@/lib/settings/use-setting";

/** App language or translation language: current choice + the shared picker sheet. */
export function LanguageControl({ settingId }: { settingId: string }) {
  const { t } = useTranslation();
  const { value, setValue, def } = useSetting<AppLocale>(settingId);
  const [open, setOpen] = useState(false);
  const title = t(def.titleKey);
  return (
    <View style={styles.block}>
      <ThemedText type="small">{title}</ThemedText>
      {def.subtitleKey ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(def.subtitleKey)}
        </ThemedText>
      ) : null}
      <LanguageSelectRow locale={value} accessibilityLabel={title} onPress={() => setOpen(true)} />
      <LanguagePickerSheet
        visible={open}
        value={value}
        onSelect={(locale) => void setValue(locale)}
        onClose={() => setOpen(false)}
        showScriptureStatus={settingId === "language.translation"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
});
