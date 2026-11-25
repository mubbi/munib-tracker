import { type ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { TvNoteFocusPreview, useNoteHintLabel } from "@/components/quran/note-hints";
import { useQuranPlayback } from "@/components/quran/word-by-word";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { BorderWidth, Control, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { HifzStatus } from "@/stores/hifz-store";
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
  readingLabel,
}: {
  surahNumber: number;
  ayahNumber: number;
  children: ReactNode;
  /** TV: the whole card is one focus target; Select opens the ayah action sheet. */
  onSelect?: () => void;
  preferredFocus?: boolean;
  /**
   * TV: what the focused card speaks after its reference — the ayah's Arabic and
   * translation (G-01), since the card's label replaces its children's text.
   */
  readingLabel?: string;
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
    const label = [
      t("quran.ayahRef", { surah: surahNumber, ayah: ayahNumber }),
      readingLabel,
      noteLabel,
    ]
      .filter(Boolean)
      .join(", ");
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={t("quran.reader.opensActions")}
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
      style={isActive ? { borderColor: colors.accent, borderWidth: BorderWidth.thin } : undefined}
    >
      {children}
    </Card>
  );
}

/** "Ayah N" badge — spoken as "Ayah N", not a bare number (C-14). */
export function AyahNumberBadge({ ayahNumber }: { ayahNumber: number }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <View
      accessible
      accessibilityLabel={t("quran.reader.ayahBadge", { n: ayahNumber })}
      style={[styles.ayahBadge, { backgroundColor: tokens.accentSoft }]}
    >
      <ThemedText
        type="caption"
        numberOfLines={1}
        style={{ color: colors.accentText, textAlign: "center" }}
      >
        {ayahNumber}
      </ThemedText>
    </View>
  );
}

/** Sajda (prostration) ayah marker: the ۩ sign plus a written, spoken label (C-14). */
export function AyahSajdaPill() {
  const { t } = useTranslation();
  const label = t("quran.reader.sajdaAyah");
  return (
    <View accessible accessibilityLabel={label} testID="ayah-sajda-pill">
      <Pill compact tone="accent" label={`۩ ${label}`} />
    </View>
  );
}

/** Hifz status as text + glyph (never colour alone); changed from the "More" sheet. */
export function AyahHifzPill({ status }: { status: HifzStatus }) {
  const { t } = useTranslation();
  const memorized = status === "memorized";
  return (
    <Pill
      compact
      tone={memorized ? "success" : "warning"}
      icon={
        memorized
          ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
          : { ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }
      }
      label={memorized ? t("quran.reader.hifzMemorized") : t("quran.reader.hifzReview")}
    />
  );
}

export function AyahPlayButton({ ayahNumber, onPlay }: { ayahNumber: number; onPlay: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ayah, isPlaying, isBuffering } = useQuranPlayback();
  const mine = ayah === ayahNumber;
  const thisPlaying = mine && isPlaying;
  // Same three states as the shared PlayButton: play · pause · buffering (C-12).
  const thisBuffering = mine && isBuffering;
  return (
    <LabeledIconButton
      name={thisPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
      label={thisPlaying ? t("quran.actionPause") : t("quran.actionPlay")}
      tintColor={colors.accent}
      labelColor={colors.accentText}
      background={tokens.accentSoft}
      accessibilityLabel={
        thisPlaying ? t("quran.pauseAyah") : t("quran.playAyah", { n: ayahNumber })
      }
      // Playing state is spoken too, not only drawn (C-12).
      accessibilityState={{ selected: thisPlaying, busy: thisBuffering }}
      loading={thisBuffering}
      loadingLabel={t("player.loading")}
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
    borderWidth: BorderWidth.hairline,
  },
  ayahBadge: {
    minWidth: Control.sm,
    minHeight: Spacing.five,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  focusRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: BorderWidth.thin,
    borderCurve: "continuous",
  },
});
