import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";

import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { HifzStatus } from "@/stores/hifz-store";

const HIFZ_ICON: Record<"memorized" | "review" | "none", SymbolViewProps["name"]> = {
  memorized: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
  review: { ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" },
  none: { ios: "book.closed", android: "menu_book", web: "menu_book" },
};

/**
 * The hifz toggle for one ayah (none → review → memorized → none), shared by
 * the ayah row and the ayah action sheet so label, colour and a11y stay one.
 */
export function HifzActionButton({
  status,
  onPress,
}: {
  status?: HifzStatus | null;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const key = status === "memorized" ? "memorized" : status === "review" ? "review" : "none";
  const tint =
    key === "memorized"
      ? tokens.status.success.color
      : key === "review"
        ? tokens.status.warning.color
        : colors.mutedForeground;
  return (
    <LabeledIconButton
      name={HIFZ_ICON[key]}
      label={
        key === "memorized"
          ? t("quran.actionMemorized")
          : key === "review"
            ? t("quran.actionReview")
            : t("hifz.short")
      }
      tintColor={tint}
      labelColor={tint}
      accessibilityLabel={
        key === "memorized"
          ? t("hifz.clear")
          : key === "review"
            ? t("hifz.markMemorized")
            : t("hifz.markReview")
      }
      accessibilityState={{ selected: key !== "none" }}
      haptic="selection"
      onPress={onPress}
    />
  );
}
