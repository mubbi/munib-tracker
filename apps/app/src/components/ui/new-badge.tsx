import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";

import { Pill } from "@/components/ui/pill";

/**
 * A small "New" pill for recently released features (see `lib/new-features.ts`).
 * A `Pill` preset (accent tone, AA label on the soft tint). Purely visual:
 * callers add the word to their own accessibility label.
 */
export function NewBadge({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  return <Pill tone="accent" compact label={t("common.newBadge")} style={[styles.badge, style]} />;
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", pointerEvents: "none" },
});
