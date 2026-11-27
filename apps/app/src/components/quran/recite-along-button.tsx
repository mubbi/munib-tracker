import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";

import { usePassageLabel } from "@/components/quran/recite-along-label";
import { ReciteAlongSectionSheet } from "@/components/quran/recite-along-section-sheet";
import { Button } from "@/components/ui/button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { Passage } from "@/lib/quran-companion/types";
import {
  isLongPassage,
  type ReciteAlongMode,
  reciteAlongHref,
  reciteAlongModeFor,
} from "@/lib/recite-along/passages";

/** The recite-along glyph — a microphone, on every recite-along entry point. */
export const RECITE_ALONG_ICON = { ios: "mic.fill", android: "mic", web: "mic" } as const;

export { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";

/**
 * One "Recite along" button for any screen that shows a passage to recite (D68).
 * Opens the on-device practice session on that passage — Follow by default, so
 * the words light up as they are recited ("Recite along"); `mode="check"` is the
 * "Check my recitation" take. A long passage (> 20 ayahs) first asks: follow the
 * whole passage, or take one 10-ayah section. Hidden where recite-along is
 * unavailable (TV, or a runtime the listener cannot run on).
 *
 * `appearance="icon"` draws a compact mic + "Recite" caption, matching the Play /
 * Save actions beside a quoted ayah. `habitId` (D74) marks the take as a Sunnah
 * habit's, so its summary can offer "Mark habit done".
 */
export function ReciteAlongButton({
  passage,
  mode = "follow",
  label,
  variant = "secondary",
  size = "md",
  appearance = "button",
  fullWidth,
  style,
  habitId,
}: {
  passage: Passage;
  mode?: ReciteAlongMode;
  /** Defaults to "Recite along" (follow) or "Check my recitation" (check). */
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  appearance?: "button" | "icon";
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  /** D74: the Sunnah habit this recite-along belongs to. */
  habitId?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const passageLabel = usePassageLabel();
  const available = useReciteAlongAvailable();
  const [sheetOpen, setSheetOpen] = useState(false);
  if (!available) return null;

  const long = isLongPassage(passage);
  const onPress = () => {
    if (long) {
      setSheetOpen(true);
      return;
    }
    router.push(reciteAlongHref(passage, reciteAlongModeFor(passage, mode), { habitId }));
  };
  const hint = t("reciteAlong.buttonHint", { passage: passageLabel(passage) });

  return (
    <>
      {appearance === "icon" ? (
        <LabeledIconButton
          name={RECITE_ALONG_ICON}
          label={t("reciteAlong.iconLabel")}
          tintColor={colors.accent}
          labelColor={colors.accentText}
          background={tokens.accentSoft}
          accessibilityLabel={t("reciteAlong.withPassage", { passage: passageLabel(passage) })}
          accessibilityHint={hint}
          onPress={onPress}
          style={style}
        />
      ) : (
        <Button
          label={
            label ?? (mode === "check" ? t("reciteAlong.checkButton") : t("reciteAlong.button"))
          }
          icon={RECITE_ALONG_ICON}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          style={style}
          accessibilityHint={hint}
          onPress={onPress}
        />
      )}
      {long ? (
        <ReciteAlongSectionSheet
          visible={sheetOpen}
          passage={passage}
          mode={mode}
          onClose={() => setSheetOpen(false)}
          onPick={(target, pickedMode) => {
            setSheetOpen(false);
            router.push(reciteAlongHref(target, pickedMode, { habitId }));
          }}
        />
      ) : null}
    </>
  );
}
