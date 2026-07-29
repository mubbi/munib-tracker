import type { HadithItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureHadithItem, hadithCollectionId, hadithExcerpt } from "@/lib/prayer-info";
import { arabicReadingLayout, translationReadingStyle } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

type HadithExcerptCardProps = {
  hadithId: string;
  maxExcerpt?: number;
};

export function HadithExcerptCard({ hadithId, maxExcerpt = 220 }: HadithExcerptCardProps) {
  const router = useRouter();
  const { colors } = useThemeTokens();
  const { translationLocale } = usePreferences();
  const [hadith, setHadith] = useState<HadithItem | null | undefined>(undefined);

  // Re-resolve when the meaning locale changes so excerpts match preferences.
  // biome-ignore lint/correctness/useExhaustiveDependencies: translationLocale intentionally triggers reload
  useEffect(() => {
    let cancelled = false;
    setHadith(undefined);
    void ensureHadithItem(hadithId).then((item) => {
      if (!cancelled) setHadith(item ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [hadithId, translationLocale]);

  if (hadith === undefined) {
    return (
      <View style={[styles.card, { backgroundColor: colors.muted }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!hadith) return null;

  const openHadith = () =>
    router.push({
      pathname: "/hadith/[collection]",
      params: {
        collection: hadithCollectionId(hadithId),
        q: hadith.reference,
      },
    });

  return <HadithExcerptCardContent hadith={hadith} maxExcerpt={maxExcerpt} onOpen={openHadith} />;
}

function HadithExcerptCardContent({
  hadith,
  maxExcerpt,
  onOpen,
}: {
  hadith: HadithItem;
  maxExcerpt: number;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { translationLocale } = usePreferences();
  const translation = useHadithTranslation(hadith);
  const translationText = hadithExcerpt({ ...hadith, english: translation }, maxExcerpt);

  return (
    <View style={[styles.card, { backgroundColor: colors.muted }]}>
      {hadith.arabic ? (
        <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(22)]}>
          {hadith.arabic}
        </ThemedText>
      ) : null}

      {hadith.arabic && translationText ? (
        <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />
      ) : null}

      {hadith.narrator ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {hadith.narrator}
        </ThemedText>
      ) : null}

      {translationText ? (
        <ThemedText
          type="small"
          themeColor="foreground"
          style={translationReadingStyle(translationLocale, 15)}
        >
          {translationText}
        </ThemedText>
      ) : null}

      <PressableScale
        accessibilityRole="link"
        accessibilityLabel={t("reading.openReference", { ref: hadith.reference })}
        onPress={onOpen}
        hitSlop={8}
        haptic="light"
        style={styles.referenceHit}
      >
        <ThemedText type="caption" style={{ color: colors.accent }}>
          {t("reading.reference", { ref: hadith.reference })}
        </ThemedText>
      </PressableScale>

      <Button
        label={t("prayerInfo.viewHadith")}
        variant="secondary"
        size="sm"
        trailingIcon={{ ios: "arrow.up.right", android: "open_in_new", web: "open_in_new" }}
        onPress={onOpen}
        style={{ borderColor: tokens.hairline }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  referenceHit: {
    alignSelf: "flex-start",
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.one,
    marginHorizontal: -Spacing.one,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  arabic: {
    lineHeight: 36,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    marginVertical: Spacing.one,
  },
});
