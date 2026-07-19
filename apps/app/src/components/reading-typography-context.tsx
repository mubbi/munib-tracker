import type { ReadingSurface } from "@munib-tracker/shared/types";
import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LearnTtsProvider, useLearnTts } from "@/components/learn-tts-context";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { ThemedText } from "@/components/themed-text";
import { TtsVoiceSheet } from "@/components/tts-voice-sheet";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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
  if (!tts?.hasText) return null;

  return (
    <>
      <IconButton
        name={
          tts.speaking
            ? { ios: "stop.fill", android: "stop", web: "stop" }
            : { ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }
        }
        size={18}
        tintColor={tts.speaking ? colors.accent : colors.mutedForeground}
        accessibilityLabel={tts.speaking ? t("reading.listenStop") : t("reading.listen")}
        accessibilityHint={t("reading.listenHint")}
        accessibilityState={{ selected: tts.speaking }}
        onPress={() => {
          if (tts.speaking) tts.stop();
          else setVoiceSheetOpen(true);
        }}
        background={tts.speaking ? tokens.accentSoft : colors.muted}
        hitTarget={36}
        wellRadius={18}
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

  return (
    <View style={styles.bar}>
      <ThemedText type="smallBold" style={styles.label}>
        {t("reading.textSize")}
      </ThemedText>
      <View style={styles.barEnd}>
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

  return (
    <>
      <IconButton
        name={{ ios: "textformat.abc", android: "abc", web: "abc" }}
        size={16}
        hitTarget={36}
        wellRadius={18}
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
        size={16}
        hitTarget={36}
        wellRadius={18}
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
  return (
    <LearnTtsProvider listenText={listenText}>
      <ReadingTypographyProvider surface={surface}>
        <ReadingTypographyBar surface={surface} />
        <View style={styles.content}>{children}</View>
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
  label: {
    flexShrink: 1,
  },
  barEnd: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 0,
  },
  content: {
    gap: Spacing.four,
  },
});
