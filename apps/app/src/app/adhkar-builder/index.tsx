import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { resolveArabicLineHeight } from "@/lib/reading-typography";
import {
  type CustomAdhkarInput,
  useCustomAdhkarActions,
  useCustomAdhkarList,
  useEnsureCustomAdhkarLoaded,
} from "@/stores/custom-adhkar-store";
import { usePreferences } from "@/stores/preferences-store";

const EMPTY: CustomAdhkarInput = { title: "", arabic: "" };

export default function AdhkarBuilderScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const arabicFontFamily = useArabicFontFamily();
  const arabicInputLineHeight = resolveArabicLineHeight(20, fontPrefs.arabic.family);
  useEnsureCustomAdhkarLoaded();
  const items = useCustomAdhkarList();
  const { create, remove } = useCustomAdhkarActions();

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<CustomAdhkarInput>(EMPTY);

  const canSave = draft.title.trim().length > 0 && draft.arabic.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    await create(draft);
    setDraft(EMPTY);
    setFormOpen(false);
  };

  const input = (
    key: keyof CustomAdhkarInput,
    labelKey: string,
    opts?: { multiline?: boolean; rtl?: boolean },
  ) => (
    <View style={styles.field}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t(labelKey)}
      </ThemedText>
      <TextInput
        value={draft[key] ?? ""}
        onChangeText={(v) => setDraft((prev) => ({ ...prev, [key]: v }))}
        placeholder={t(labelKey)}
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={t(labelKey)}
        multiline={opts?.multiline}
        style={[
          styles.input,
          opts?.multiline ? styles.inputMultiline : null,
          opts?.rtl
            ? [styles.inputRtl, { fontFamily: arabicFontFamily, lineHeight: arabicInputLineHeight }]
            : null,
          { backgroundColor: colors.muted, color: colors.foreground },
        ]}
      />
    </View>
  );

  return (
    <ScreenLayout
      eyebrow={t("customAdhkar.eyebrow")}
      title={t("customAdhkar.title")}
      subtitle={t("customAdhkar.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/zikr"))}
    >
      <Seo path="/adhkar-builder" />
      <Button
        label={t("customAdhkar.add")}
        icon={{ ios: "plus", android: "add", web: "add" }}
        fullWidth
        onPress={() => setFormOpen(true)}
        style={styles.addButton}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
          title={t("customAdhkar.emptyTitle")}
          description={t("customAdhkar.emptyDesc")}
        />
      ) : (
        <Stagger>
          {items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemHeader}>
                <ThemedText type="smallBold" style={styles.itemTitle}>
                  {item.title}
                </ThemedText>
                <IconButton
                  name={{ ios: "trash", android: "delete", web: "delete" }}
                  size={16}
                  tintColor={colors.mutedForeground}
                  accessibilityLabel={t("customAdhkar.delete")}
                  haptic="warning"
                  onPress={() => void remove(item.id)}
                />
              </View>
              <ReadingCard item={{ ...item, translation: item.translation ?? "" }} />
            </View>
          ))}
        </Stagger>
      )}

      <Sheet visible={formOpen} onClose={() => setFormOpen(false)} variant="bottom">
        <ThemedText type="subtitle" style={styles.sheetTitle}>
          {t("customAdhkar.newTitle")}
        </ThemedText>
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {input("title", "customAdhkar.field.title")}
          {input("arabic", "customAdhkar.field.arabic", { multiline: true, rtl: true })}
          {input("transliteration", "customAdhkar.field.transliteration", { multiline: true })}
          {input("translation", "customAdhkar.field.translation", { multiline: true })}
          {input("reference", "customAdhkar.field.reference")}
        </ScrollView>
        <Button
          label={t("common.save")}
          fullWidth
          disabled={!canSave}
          onPress={() => void save()}
          style={styles.saveButton}
        />
      </Sheet>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  addButton: { marginBottom: Spacing.three },
  item: { gap: Spacing.two },
  itemHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemTitle: { flex: 1, marginLeft: Spacing.one },
  sheetTitle: { marginBottom: Spacing.two },
  form: { alignSelf: "stretch", maxHeight: 380 },
  field: { gap: Spacing.one, marginBottom: Spacing.three },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: "top" },
  inputRtl: { writingDirection: "rtl", textAlign: "right", fontSize: 20 },
  saveButton: { marginTop: Spacing.two },
});
