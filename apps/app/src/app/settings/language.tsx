import type { AppLocale } from "@munib-tracker/shared/types";
import { goBackOrReplace } from "@/lib/navigation";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

// `native` is the endonym — always shown in its own script regardless of the
// active UI language. The primary label is localized via `t("language.<id>")`.
const LOCALES: { id: AppLocale; native: string }[] = [
  { id: "en", native: "English" },
  { id: "ar", native: "العربية" },
  { id: "ur", native: "اردو" },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("language.title")}
      subtitle={t("language.subtitle")}
      onBack={() => (goBackOrReplace(router, "/"))}
    >
      <Seo path="/settings/language" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("language.appLanguage")}
            icon={{ ios: "globe", android: "language", web: "language" }}
          />
          <Choices value={prefs.locale} onChange={(id) => update({ locale: id })} />
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("language.translationLanguage")}
            icon={{ ios: "character.book.closed.fill", android: "menu_book", web: "menu_book" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("language.translationHint")}
          </ThemedText>
          <Choices
            value={prefs.translationLocale}
            onChange={(id) => update({ translationLocale: id })}
          />
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
          {t("language.footer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

function Choices({ value, onChange }: { value: AppLocale; onChange: (id: AppLocale) => void }) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  return (
    <View style={styles.rows}>
      {LOCALES.map((locale) => {
        const selected = locale.id === value;
        return (
          <PressableScale
            key={locale.id}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(locale.id)}
            style={[styles.row, { backgroundColor: selected ? tokens.accentSoft : colors.muted }]}
          >
            <View style={styles.rowBody}>
              <ThemedText type="small">{t(`language.${locale.id}`)}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {locale.native}
              </ThemedText>
            </View>
            {selected ? (
              <SymbolView
                name={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={22}
                tintColor={colors.accent}
              />
            ) : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: {
    gap: 2,
  },
  hint: {
    marginTop: Spacing.two,
  },
  footer: {
    textAlign: "center",
  },
});
