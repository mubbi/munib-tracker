import { type ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { TvNoteFocusPreview, useNoteHintLabel } from "@/components/quran/note-hints";
import { useQuranPlayback } from "@/components/quran/word-by-word";
import { Card } from "@/components/ui/card";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { AyahFocusTrackerContext } from "./ayah-focus-tracker";
import { FOCUS_HIGHLIGHT_FADE_MS, FOCUS_HIGHLIGHT_HOLD_MS } from "./constants";

/** Deep-link focus ring — only mounted for the target ayah, not every row. */
function AyahFocusRing({ color }: { color: string }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(opacity);
    opacity.value = 1;
    opacity.value = withDelay(
      FOCUS_HIGHLIGHT_HOLD_MS,
      withTiming(0, { duration: FOCUS_HIGHLIGHT_FADE_MS }),
    );
  }, [opacity]);

  const focusBorderStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.focusRing,
        { borderColor: color, borderRadius: Radius.lg, pointerEvents: "none" },
        focusBorderStyle,
      ]}
    />
  );
}

export function AyahStudyCard({
  surahNumber,
  ayahNumber,
  children,
  onSelect,
  preferredFocus,
}: {
  surahNumber: number;
  ayahNumber: number;
  children: ReactNode;
  /** TV: the whole card is one focus target; Select opens the ayah action sheet. */
  onSelect?: () => void;
  preferredFocus?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah } = useQuranPlayback();
  const tracker = useContext(AyahFocusTrackerContext);
  const isActive = ayah === ayahNumber;
  // NF-3.21 TV note hint: the focused card shows its note inline, read-only.
  const [tvFocused, setTvFocused] = useState(false);
  const noteLabel = useNoteHintLabel(surahNumber, ayahNumber);

  if (onSelect) {
    const focus = tracker?.current;
    // Follow-along: hand focus to the newly playing ayah only when the reader
    // was resting on the previously playing card — never steal it from chrome
    // or from an ayah the user browsed to.
    const follow = Boolean(
      isActive &&
        focus &&
        focus.focused != null &&
        focus.focused !== ayahNumber &&
        focus.focused === focus.prevPlaying,
    );
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={
          noteLabel
            ? `${t("quran.ayahRef", { surah: surahNumber, ayah: ayahNumber })}, ${noteLabel}`
            : t("quran.ayahRef", { surah: surahNumber, ayah: ayahNumber })
        }
        accessibilityState={{ selected: isActive }}
        onPress={onSelect}
        onFocus={() => {
          if (focus) focus.focused = ayahNumber;
          if (noteLabel) setTvFocused(true);
        }}
        onBlur={() => {
          if (focus && focus.focused === ayahNumber) focus.focused = null;
          setTvFocused(false);
        }}
        {...(preferredFocus || follow ? { hasTVPreferredFocus: true } : {})}
        scaleTo={0.99}
        style={[
          styles.ayahCardTv,
          // Playing = soft fill + hairline; the accent ring is reserved for focus.
          isActive
            ? {
                backgroundColor: tokens.accentSoft,
                borderColor: withAlpha(colors.accent, 0.35),
              }
            : { backgroundColor: colors.card, borderColor: tokens.hairline },
        ]}
      >
        {children}
        {tvFocused && noteLabel ? (
          <TvNoteFocusPreview surah={surahNumber} ayah={ayahNumber} />
        ) : null}
      </PressableScale>
    );
  }

  return (
    <Card
      padding="four"
      style={isActive ? { borderColor: colors.accent, borderWidth: 1 } : undefined}
    >
      {children}
    </Card>
  );
}

export function AyahPlayButton({ ayahNumber, onPlay }: { ayahNumber: number; onPlay: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah, isPlaying } = useQuranPlayback();
  const thisPlaying = ayah === ayahNumber && isPlaying;
  return (
    <LabeledIconButton
      name={thisPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
      label={thisPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
      tintColor={colors.accent}
      labelColor={colors.accent}
      background={tokens.accentSoft}
      accessibilityLabel={
        thisPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayahNumber })
      }
      onPress={onPlay}
    />
  );
}

export function AyahContinuePill({
  ayahNumber,
  highlighted,
}: {
  ayahNumber: number;
  highlighted?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah } = useQuranPlayback();
  if (!highlighted || ayah === ayahNumber) return null;
  return (
    <Pill
      compact
      label={t("quran.continueReading")}
      color={colors.accentText}
      background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
    />
  );
}

export function AyahFocusRingIfNeeded({
  ayahNumber,
  highlighted,
}: {
  ayahNumber: number;
  highlighted?: boolean;
}) {
  const { colors } = useThemeTokens();
  const { ayah } = useQuranPlayback();
  if (!highlighted || ayah === ayahNumber) return null;
  return <AyahFocusRing color={colors.accent} />;
}

const styles = StyleSheet.create({
  ayahCardTv: {
    width: "100%",
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  focusRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderCurve: "continuous",
  },
});
