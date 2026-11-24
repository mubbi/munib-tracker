import type { TasbeehDesignId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ContentInlineLink } from "@/components/content/content-inline-link";
import { evidenceHref } from "@/components/self-review/evidence-links";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { designNoteFor } from "@/lib/tasbeeh/design-notes";

/**
 * The always-visible "About this design" note (D16) for designs that carry
 * evidence: Pebbles (the differing gradings) and Finger counting. It sits
 * outside the counter's tap target so its links stay reachable for screen
 * readers. Hadith open in the reader by corpus number — no text is typed here.
 */
export function TasbeehDesignNote({ design }: { design: TasbeehDesignId }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const note = designNoteFor(design);
  if (!note) return null;
  return (
    <Card variant="muted" padding="three" style={styles.card}>
      <View style={styles.header} accessibilityRole="header">
        <AppIcon
          icon={{ ios: "info.circle", android: "info", web: "info" }}
          size={16}
          tintColor={colors.mutedForeground}
        />
        <ThemedText type="smallBold">{t(note.titleKey)}</ThemedText>
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t(note.bodyKey)}
      </ThemedText>
      <View style={styles.refs}>
        {note.refs.map((ref) => (
          <ContentInlineLink
            key={`${ref.collection}:${ref.number}`}
            layout="list"
            textType="caption"
            label={t(ref.labelKey)}
            onPress={() =>
              router.push(
                evidenceHref({
                  kind: "hadith",
                  collection: ref.collection,
                  number: String(ref.number),
                  labelKey: ref.labelKey,
                }),
              )
            }
          />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "stretch",
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  refs: {
    gap: Spacing.one,
  },
});
