import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { StyleProp, TextStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { parseReference, referenceHref } from "@/lib/reference-link";

/**
 * Renders an item's `reference`. When it resolves to a Qur'an ayah or a hadith
 * (via `parseReference`), it becomes a link that opens the reader scrolled/
 * filtered to that source; otherwise it stays plain muted text.
 */
export function ReferenceLine({
  reference,
  style,
}: {
  reference: string;
  style?: StyleProp<TextStyle>;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const router = useRouter();
  const target = useMemo(() => parseReference(reference), [reference]);
  const label = t("reading.reference", { ref: reference });

  if (!target) {
    return (
      <ThemedText type="caption" themeColor="mutedForeground" style={style}>
        {label}
      </ThemedText>
    );
  }

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={t("reading.openReference", { ref: reference })}
      onPress={() => router.push(referenceHref(target))}
    >
      <ThemedText type="caption" style={[{ color: colors.accent }, styles.link, style]}>
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = { link: { textDecorationLine: "underline" as const } };
