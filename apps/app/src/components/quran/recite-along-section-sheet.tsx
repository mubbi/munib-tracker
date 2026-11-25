import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { usePassageLabel } from "@/components/quran/recite-along-label";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import type { Passage } from "@/lib/quran-companion/types";
import { passageKey, type ReciteAlongMode, splitPassage } from "@/lib/recite-along/passages";

/**
 * Long passages (> 20 ayahs, e.g. all of al-Kahf): follow the whole passage —
 * always in Follow mode — or take one 10-ayah section in the caller's mode.
 */
export function ReciteAlongSectionSheet({
  visible,
  passage,
  mode,
  onClose,
  onPick,
}: {
  visible: boolean;
  passage: Passage;
  mode: ReciteAlongMode;
  onClose: () => void;
  onPick: (passage: Passage, mode: ReciteAlongMode) => void;
}) {
  const { t } = useTranslation();
  const passageLabel = usePassageLabel();
  const sections = splitPassage(passage);

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <View style={styles.stack}>
        <ThemedText type="subtitle" accessibilityRole="header">
          {t("reciteAlong.sheet.title", { passage: passageLabel(passage) })}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("reciteAlong.sheet.body")}
        </ThemedText>
        <Button
          label={t("reciteAlong.sheet.followWhole")}
          icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          variant="primary"
          fullWidth
          onPress={() => onPick(passage, "follow")}
        />
        <ThemedText type="smallBold">{t("reciteAlong.sheet.sections")}</ThemedText>
        <View style={styles.chips}>
          {sections.map((section) => (
            <Chip
              key={passageKey(section)}
              label={t("reciteAlong.sheet.section", {
                from: section.ayahStart,
                to: section.ayahEnd,
              })}
              selected={false}
              accessibilityLabel={passageLabel(section)}
              onPress={() => onPick(section, mode)}
            />
          ))}
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
