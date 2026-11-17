import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LanguagePickerSheet, LanguageSelectRow } from "@/components/language-picker-sheet";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SETTINGS_TWO_COLUMN_MIN_WIDTH } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { goBackOrReplace } from "@/lib/navigation";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { setLocale, update } = usePreferencesActions();
  const { width, isTv } = useLargeScreenLayout();
  const twoUp = !isTv && width >= SETTINGS_TWO_COLUMN_MIN_WIDTH;
  const [appPickerOpen, setAppPickerOpen] = useState(false);
  const [translationPickerOpen, setTranslationPickerOpen] = useState(false);

  const appCard = (
    <Card padding="three" style={styles.fill}>
      <SectionHeader
        title={t("language.appLanguage")}
        icon={{ ios: "globe", android: "language", web: "language" }}
      />
      <LanguageSelectRow
        locale={prefs.locale}
        accessibilityLabel={t("language.appLanguage")}
        onPress={() => setAppPickerOpen(true)}
      />
    </Card>
  );

  const translationCard = (
    <Card padding="three" style={styles.fill}>
      <SectionHeader
        title={t("language.translationLanguage")}
        icon={{ ios: "character.book.closed.fill", android: "menu_book", web: "menu_book" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("language.translationHint")}
      </ThemedText>
      <LanguageSelectRow
        locale={prefs.translationLocale}
        accessibilityLabel={t("language.translationLanguage")}
        onPress={() => setTranslationPickerOpen(true)}
      />
    </Card>
  );

  const footer = (
    <ThemedText type="caption" themeColor="mutedForeground" style={styles.footer}>
      {t("language.footer")}
    </ThemedText>
  );

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("language.title")}
      subtitle={t("language.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/language" />
      {twoUp ? (
        // Wide web / tablets: UI language and scripture language side by side.
        <View style={styles.wideStack}>
          <ResponsiveGrid columns={2} gap={Spacing.four}>
            {appCard}
            {translationCard}
          </ResponsiveGrid>
          {footer}
        </View>
      ) : (
        <Stagger>
          {appCard}
          {translationCard}
          {footer}
        </Stagger>
      )}

      <LanguagePickerSheet
        visible={appPickerOpen}
        value={prefs.locale}
        onSelect={(locale) => void setLocale(locale)}
        onClose={() => setAppPickerOpen(false)}
      />
      <LanguagePickerSheet
        visible={translationPickerOpen}
        value={prefs.translationLocale}
        onSelect={(locale) => update({ translationLocale: locale })}
        onClose={() => setTranslationPickerOpen(false)}
        showScriptureStatus
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  fill: {
    flexGrow: 1,
  },
  wideStack: {
    gap: Spacing.four,
  },
  hint: {
    marginTop: Spacing.two,
  },
  footer: {
    textAlign: "center",
  },
});
