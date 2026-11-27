import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { OptionPickerSheet } from "@/components/quran/option-picker-sheet";
import { SelectChip, ToggleChip } from "@/components/quran/reading-toolbar";
import { ReadingFontControls } from "@/components/reading-font-controls";
import { GlassSurface } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { RECITERS } from "@/lib/quran-audio";
import type { PracticeMode, PracticeView } from "@/lib/quran-companion/types";
import { ltrControlViewProps } from "@/lib/rtl";
import { updateCompanionPrefs as update } from "@/lib/settings/companion-shortcuts";
import { updateQuranPrefs as updatePrefs } from "@/lib/settings/quran-shortcuts";
import { useReadingDisplayToggles } from "@/lib/settings/use-reading-display-toggles";
import { useCompanionPrefs } from "@/stores/quran-companion-prefs-store";
import { useQuranPrefs } from "@/stores/quran-store";

const ICONS = {
  textSize: { ios: "textformat.size", android: "format_size", web: "format_size" },
  mode: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
  view: { ios: "book.pages", android: "menu_book", web: "menu_book" },
  reciter: { ios: "person.wave.2.fill", android: "record_voice_over", web: "record_voice_over" },
  translation: { ios: "text.alignleft", android: "notes", web: "notes" },
  transliteration: { ios: "textformat.abc", android: "abc", web: "abc" },
  tajweed: { ios: "paintpalette.fill", android: "palette", web: "palette" },
  autoAdvance: { ios: "forward.end.fill", android: "skip_next", web: "skip_next" },
  settings: { ios: "gearshape", android: "settings", web: "settings" },
} as const;

const MODES: PracticeMode[] = ["follow", "check", "hide-words", "hide-ayahs"];
const MODE_LABEL_KEY: Record<PracticeMode, string> = {
  follow: "quranCompanion.mode.follow",
  check: "quranCompanion.mode.check",
  "hide-words": "quranCompanion.mode.hideWords",
  "hide-ayahs": "quranCompanion.mode.hideAyahs",
};
const RECITER_OPTIONS = RECITERS.map((r) => ({ id: r.dir, label: r.name }));
const VIEWS: PracticeView[] = ["ayah", "page", "mushaf"];
const VIEW_LABEL_KEY: Record<PracticeView, string> = {
  ayah: "quran.layoutAyah",
  page: "quran.layoutPage",
  mushaf: "quran.layoutMushaf",
};

/**
 * Practice tools under the session header (like the reader's toolbar, but only
 * what helps while reciting): text size, mode, the Hear reciter, translation,
 * transliteration, tajweed colours, auto-advance (Follow), and practice settings.
 * Mode and reciter are locked while the mic is live so a take is never changed
 * under the person.
 */
export function PracticeToolbar({
  mode,
  locked,
  showModeChip,
  onChangeMode,
  onOpenSettings,
}: {
  mode: PracticeMode;
  /** True while a take is live. */
  locked: boolean;
  /** Revision sittings keep their own mode. */
  showModeChip: boolean;
  onChangeMode: (mode: PracticeMode) => void;
  onOpenSettings: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const prefs = useCompanionPrefs();
  const quranPrefs = useQuranPrefs();
  // Toolbar chips are shortcuts to Settings (Qur'an › Practice, Text & fonts).
  const { showTranslation, showTransliteration, toggleTranslation, toggleTransliteration } =
    useReadingDisplayToggles();
  const scrollRef = useHorizontalWheelScroll();
  const [picker, setPicker] = useState<"mode" | "reciter" | "view" | null>(null);

  const reciter = RECITERS.find((r) => r.dir === quranPrefs.preferredReciterDir) ?? RECITERS[0];

  return (
    <View style={[styles.bar, { borderBottomColor: tokens.hairline }]}>
      <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
        <GlassSurface style={StyleSheet.absoluteFill} intensity={50} />
      </View>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            pointerEvents: "none",
            backgroundColor: withAlpha(colors.card, tokens.isDark ? 0.5 : 0.62),
          },
        ]}
      />
      <View style={styles.row}>
        <ScrollView
          ref={scrollRef}
          horizontal
          style={styles.scroll}
          showsHorizontalScrollIndicator={Platform.OS === "web"}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View
            {...ltrControlViewProps()}
            style={[styles.fontChip, { backgroundColor: colors.muted }]}
          >
            <SymbolView name={ICONS.textSize} size={16} tintColor={colors.mutedForeground} />
            <ReadingFontControls surface="quran" />
          </View>
          <SelectChip
            icon={ICONS.view}
            value={t(VIEW_LABEL_KEY[prefs.practiceView])}
            accessibilityLabel={t("quranCompanion.view.title")}
            onPress={() => setPicker("view")}
          />
          {showModeChip ? (
            <View style={locked ? styles.locked : null}>
              <SelectChip
                icon={ICONS.mode}
                value={t(MODE_LABEL_KEY[mode])}
                accessibilityLabel={t("quranCompanion.hub.modeTitle")}
                onPress={() => {
                  if (!locked) setPicker("mode");
                }}
              />
            </View>
          ) : null}
          <View style={locked ? styles.locked : null}>
            <SelectChip
              icon={ICONS.reciter}
              value={reciter.name}
              accessibilityLabel={t("quran.reciter")}
              onPress={() => {
                if (!locked) setPicker("reciter");
              }}
            />
          </View>
          <ToggleChip
            icon={ICONS.translation}
            label={t("quran.translation")}
            enabled={showTranslation}
            accessibilityLabel={t("quran.showTranslation")}
            onPress={() => void toggleTranslation()}
          />
          <ToggleChip
            icon={ICONS.transliteration}
            label={t("quran.transliteration")}
            enabled={showTransliteration}
            accessibilityLabel={t("quran.showTransliteration")}
            onPress={() => void toggleTransliteration()}
          />
          <ToggleChip
            icon={ICONS.tajweed}
            label={t("quran.showTajweed")}
            enabled={prefs.showTajweedColors}
            accessibilityLabel={t("quran.showTajweed")}
            onPress={() => void update({ showTajweedColors: !prefs.showTajweedColors })}
          />
          {mode === "follow" ? (
            <ToggleChip
              icon={ICONS.autoAdvance}
              label={t("quranCompanion.settings.autoAdvance")}
              enabled={prefs.autoAdvance}
              accessibilityLabel={t("quranCompanion.settings.autoAdvance")}
              onPress={() => void update({ autoAdvance: !prefs.autoAdvance })}
            />
          ) : null}
        </ScrollView>
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("quranCompanion.settings.title")}
          onPress={onOpenSettings}
          style={[styles.iconBtn, { backgroundColor: colors.muted }]}
        >
          <SymbolView name={ICONS.settings} size={18} tintColor={colors.foreground} />
        </PressableScale>
      </View>

      <OptionPickerSheet
        visible={picker === "mode"}
        title={t("quranCompanion.hub.modeTitle")}
        options={MODES.map((m) => ({ id: m, label: t(MODE_LABEL_KEY[m]) }))}
        selectedId={mode}
        onSelect={(id) => {
          if (id !== mode) onChangeMode(id as PracticeMode);
        }}
        onClose={() => setPicker(null)}
      />
      <OptionPickerSheet
        visible={picker === "view"}
        title={t("quranCompanion.view.title")}
        options={VIEWS.map((v) => ({ id: v, label: t(VIEW_LABEL_KEY[v]) }))}
        selectedId={prefs.practiceView}
        onSelect={(id) => void update({ practiceView: id as PracticeView })}
        onClose={() => setPicker(null)}
      />
      <OptionPickerSheet
        visible={picker === "reciter"}
        title={t("quran.reciter")}
        options={RECITER_OPTIONS}
        selectedId={reciter.dir}
        onSelect={(id) => void updatePrefs({ preferredReciterDir: id })}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { overflow: "hidden", borderBottomWidth: BorderWidth.hairline },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingEnd: Spacing.three,
    width: "100%",
  },
  scroll: { flex: 1, minWidth: 0 },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  fontChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.oneHalf,
    paddingStart: Spacing.three,
    paddingEnd: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  locked: { opacity: 0.45 },
});
