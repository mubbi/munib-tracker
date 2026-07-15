import type { HadithItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
import { useHadithTranslation } from "@/hooks/use-hadith-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureHadithItem, hadithCollectionId, hadithExcerpt } from "@/lib/prayer-info";

type HadithExcerptCardProps = {
  hadithId: string;
  maxExcerpt?: number;
};

export function HadithExcerptCard({ hadithId, maxExcerpt = 220 }: HadithExcerptCardProps) {
  const router = useRouter();
  const { colors } = useThemeTokens();
  const [hadith, setHadith] = useState<HadithItem | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void ensureHadithItem(hadithId).then((item) => {
      if (!cancelled) setHadith(item ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [hadithId]);

  if (hadith === undefined) {
    return (
      <View style={[styles.card, { backgroundColor: colors.muted }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!hadith) return null;

  return (
    <HadithExcerptCardContent
      hadith={hadith}
      maxExcerpt={maxExcerpt}
      onOpen={() =>
        router.push({
          pathname: "/hadith/[collection]",
          params: {
            collection: hadithCollectionId(hadithId),
            q: hadith.reference,
          },
        })
      }
    />
  );
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
  const translation = useHadithTranslation(hadith);

  return (
    <View style={[styles.card, { backgroundColor: colors.muted }]}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {hadith.reference}
      </ThemedText>
      <ThemedText type="small" themeColor="foreground">
        {hadithExcerpt({ ...hadith, english: translation }, maxExcerpt)}
      </ThemedText>
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
});
