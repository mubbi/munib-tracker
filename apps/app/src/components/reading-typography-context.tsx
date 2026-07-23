import type { ReadingSurface } from "@munib-tracker/shared/types";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, type TextStyle, View } from "react-native";

import { tvLearnReadingColumnStyle } from "@/components/learn-guide/tv-learn-chrome";
import { LearnTtsProvider, useLearnTts } from "@/components/learn-tts-context";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ThemedText, type ThemedTextProps } from "@/components/themed-text";
import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  DEFAULT_ARABIC_SIZE,
  DEFAULT_TRANSLATION_SIZE,
  type ReadingFontSizes,
  resolveArabicFontFamily,
  resolveReadingFontSizes,
} from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";
import {
  useReadingTextVisibility,
  useReadingTextVisibilityActions,
} from "@/stores/reading-text-visibility-store";

/** Roles for custom English/prose copy inside LearnReadingChrome. */
export type LearnProseRole = "title" | "body" | "caption";

/**
 * Font size + line height that track the in-context A−/A+ control for the
 * active reading surface. Use for educational prose that is not scripture
 * (timeline cards, glossaries, checklists, figure bios, etc.).
 */
export function useLearnProseStyle(proseRole: LearnProseRole = "body"): TextStyle {
  const { sizes } = useReadingTypography();
  const fontSize =
    proseRole === "title"
      ? sizes.translation + 2
      : proseRole === "caption"
        ? sizes.transliteration
        : sizes.translation;
  const lineHeightRatio = proseRole === "title" ? 1.35 : proseRole === "caption" ? 1.4 : 1.5;
  return { fontSize, lineHeight: Math.round(fontSize * lineHeightRatio) };
}

/**
 * ThemedText that scales with Learn text-size controls. Prefer this over a
 * bare ThemedText for long-form custom content on Learn screens.
 * Uses `proseRole` (not DOM `role`) so a11y lint does not treat it as ARIA.
 */
export function LearnProseText({
  proseRole = "body",
  style,
  type = proseRole === "title" ? "smallBold" : proseRole === "caption" ? "caption" : "small",
  ...rest
}: ThemedTextProps & { proseRole?: LearnProseRole }) {
  const proseStyle = useLearnProseStyle(proseRole);
  return <ThemedText type={type} style={[proseStyle, style]} {...rest} />;
}

const ReadingTypographyContext = createContext<ReadingSurface | null>(null);

/** Wrap a learn screen so descendants resolve font sizes for that surface. */
export function ReadingTypographyProvider({
  surface,
  children,
}: {
  surface: ReadingSurface;
  children: ReactNode;
}) {
  return (
    <ReadingTypographyContext.Provider value={surface}>
      {children}
    </ReadingTypographyContext.Provider>
  );
}

/** Resolved Arabic / transliteration / translation sizes for the active learn surface. */
export function useReadingTypography(explicitSurface?: ReadingSurface): {
  surface: ReadingSurface | null;
  sizes: ReadingFontSizes;
} {
  const fromContext = useContext(ReadingTypographyContext);
  const { fontPrefs } = usePreferences();
  const surface = explicitSurface ?? fromContext;

  const sizes = useMemo(() => {
    if (surface) return resolveReadingFontSizes(surface, fontPrefs);
    const arabic = fontPrefs.arabic.size ?? DEFAULT_ARABIC_SIZE;
    const translation = fontPrefs.translation.size ?? DEFAULT_TRANSLATION_SIZE;
    return {
      arabic,
      translation,
      transliteration: Math.max(12, translation - 1),
    };
  }, [surface, fontPrefs]);

  return { surface: surface ?? null, sizes };
}

export function useArabicFontFamily(): string | undefined {
  const { fontPrefs } = usePreferences();
  return resolveArabicFontFamily(fontPrefs.arabic.family);
}

function LearnListenButton() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tts = useLearnTts();
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const tv = isTV();
  if (!tts?.hasText) return null;

  const hit = tv ? TvLayout.minFocusTarget : 36;

  return (
    <>
      <IconButton
        name={
          tts.speaking
            ? { ios: "stop.fill", android: "stop", web: "stop" }
            : { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }
        }
        size={tv ? 22 : 18}
        tintColor={tts.speaking ? colors.accent : colors.mutedForeground}
        accessibilityLabel={tts.speaking ? t("reading.listenStop") : t("reading.listen")}
        accessibilityHint={t("reading.listenHint")}
        accessibilityState={{ selected: tts.speaking }}
        onPress={() => {
          if (tts.speaking) tts.stop();
          else setVoiceSheetOpen(true);
        }}
        background={tts.speaking ? tokens.accentSoft : colors.muted}
        hitTarget={hit}
        wellRadius={hit / 2}
      />
      <TtsVoiceSheet
        visible={voiceSheetOpen}
        onClose={() => setVoiceSheetOpen(false)}
        lang={tts.lang}
        selectedVoiceId={tts.preferredVoiceId}
        onSelectVoice={(voiceId) => tts.startWithVoice(voiceId)}
      />
    </>
  );
}

/** A−/A+ bar — place at the top of learn screens with Arabic or translated religious text. */
export function ReadingTypographyBar({
  surface,
  textVisibility = false,
}: {
  surface: ReadingSurface;
  /**
   * When true, shows persistent transliteration/translation toggles (used on
   * tasbeeh screens that display scripture body text).
   */
  textVisibility?: boolean;
}) {
  const { t } = useTranslation();
  const tv = isTV();

  return (
    <View style={[styles.bar, tv && styles.barTv]}>
      {tv ? null : (
        <ThemedText type="smallBold" style={styles.label}>
          {t("reading.textSize")}
        </ThemedText>
      )}
      <View style={[styles.barEnd, tv && styles.barEndTv]}>
        <ReadingFontControls surface={surface} />
        {textVisibility ? <ReadingTextVisibilityToggles /> : null}
        <LearnListenButton />
      </View>
    </View>
  );
}

function ReadingTextVisibilityToggles() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
  const { toggleTransliteration, toggleTranslation } = useReadingTextVisibilityActions();
  const tv = isTV();
  const hit = tv ? TvLayout.minFocusTarget : 36;

  return (
    <>
      <IconButton
        name={{ ios: "textformat.abc", android: "abc", web: "abc" }}
        size={tv ? 20 : 16}
        hitTarget={hit}
        wellRadius={hit / 2}
        tintColor={showTransliteration ? colors.accent : colors.mutedForeground}
        background={showTransliteration ? tokens.accentSoft : colors.muted}
        accessibilityLabel={
          showTransliteration ? t("reading.hideTransliteration") : t("reading.showTransliteration")
        }
        accessibilityState={{ selected: showTransliteration }}
        haptic="selection"
        onPress={() => void toggleTransliteration()}
      />
      <IconButton
        name={{ ios: "text.alignleft", android: "notes", web: "notes" }}
        size={tv ? 20 : 16}
        hitTarget={hit}
        wellRadius={hit / 2}
        tintColor={showTranslation ? colors.accent : colors.mutedForeground}
        background={showTranslation ? tokens.accentSoft : colors.muted}
        accessibilityLabel={
          showTranslation ? t("reading.hideTranslation") : t("reading.showTranslation")
        }
        accessibilityState={{ selected: showTranslation }}
        haptic="selection"
        onPress={() => void toggleTranslation()}
      />
    </>
  );
}

/** Provider + font-size bar + listen control for Learn topic screens. */
export function LearnReadingChrome({
  surface,
  listenText,
  children,
}: {
  surface: ReadingSurface;
  /**
   * Optional full article text for TTS. When omitted, prose inside
   * `JannahBody` / `JannahTakeaway` / `JannahActionSteps` auto-registers.
   */
  listenText?: string | null;
  children: ReactNode;
}) {
  const tv = isTV();

  return (
    <LearnTtsProvider listenText={listenText}>
      <ReadingTypographyProvider surface={surface}>
        <View style={tv ? tvLearnReadingColumnStyle : undefined}>
          <ReadingTypographyBar surface={surface} />
          <View style={[styles.content, tv && styles.contentTv]}>{children}</View>
        </View>
      </ReadingTypographyProvider>
    </LearnTtsProvider>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  barTv: {
    justifyContent: "flex-start",
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  label: {
    flexShrink: 1,
  },
  barEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  barEndTv: {
    flexGrow: 0,
    gap: Spacing.three,
  },
  content: {
    gap: Spacing.four,
  },
  contentTv: {
    gap: Spacing.five,
  },
});
