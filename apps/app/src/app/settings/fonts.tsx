import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

const ARABIC_SIZES = [
  { id: "s", label: "Small", size: 22 },
  { id: "m", label: "Medium", size: 28 },
  { id: "l", label: "Large", size: 36 },
] as const;

const TEXT_SIZES = [
  { id: "s", label: "Small", size: 14 },
  { id: "m", label: "Medium", size: 16 },
  { id: "l", label: "Large", size: 18 },
] as const;

type SizeId = "s" | "m" | "l";

function idForSize(
  sizes: readonly { id: SizeId; size: number }[],
  value: number | undefined,
  fallback: SizeId,
): SizeId {
  return sizes.find((s) => s.size === value)?.id ?? fallback;
}

export default function FontsScreen() {
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  const arabicSize = prefs.fontPrefs.arabic.size ?? 28;
  const translationSize = prefs.fontPrefs.translation.size ?? 16;

  const setArabic = (id: SizeId) => {
    const size = ARABIC_SIZES.find((s) => s.id === id)?.size ?? 28;
    void update({ fontPrefs: { ...prefs.fontPrefs, arabic: { ...prefs.fontPrefs.arabic, size } } });
  };
  const setTranslation = (id: SizeId) => {
    const size = TEXT_SIZES.find((s) => s.id === id)?.size ?? 16;
    void update({
      fontPrefs: { ...prefs.fontPrefs, translation: { ...prefs.fontPrefs.translation, size } },
    });
  };

  return (
    <ScreenLayout
      eyebrow="Settings"
      title="Fonts"
      subtitle="Size the text you read most"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card variant="muted" style={styles.preview}>
          <ThemedText type="label" themeColor="mutedForeground">
            Preview
          </ThemedText>
          <ThemedText
            type="arabic"
            style={[styles.arabic, { fontSize: arabicSize, lineHeight: arabicSize * 1.8 }]}
          >
            سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
          </ThemedText>
          <ThemedText style={{ fontSize: translationSize, lineHeight: translationSize * 1.5 }}>
            Glory is to Allah and praise is to Him.
          </ThemedText>
        </Card>

        <Card padding="three">
          <ThemedText type="smallBold" style={styles.label}>
            Arabic text
          </ThemedText>
          <SegmentedControl<SizeId>
            options={ARABIC_SIZES.map((s) => ({ id: s.id, label: s.label }))}
            value={idForSize(ARABIC_SIZES, arabicSize, "m")}
            onChange={setArabic}
          />
        </Card>

        <Card padding="three">
          <ThemedText type="smallBold" style={styles.label}>
            Translation & transliteration
          </ThemedText>
          <SegmentedControl<SizeId>
            options={TEXT_SIZES.map((s) => ({ id: s.id, label: s.label }))}
            value={idForSize(TEXT_SIZES, translationSize, "m")}
            onChange={setTranslation}
          />
        </Card>

        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={{ color: tokens.status.info.color }}
        >
          Applied across zikr, dua, and tasbeeh reading views.
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    gap: Spacing.two,
  },
  arabic: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  label: {
    marginBottom: Spacing.three,
  },
});
