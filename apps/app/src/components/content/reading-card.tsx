import type { ReadingSurface } from "@munib-tracker/shared/types";
import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { Platform, Share, StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildDuroodActivity } from "@/lib/continue-activity";
import { arabicReadingLayout, resolveReadingFontSizes } from "@/lib/reading-typography";
import { formatReadingShare } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { usePreferences } from "@/stores/preferences-store";

export type ReadingItem = {
  id?: string;
  title?: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  virtues?: string;
  reference?: string;
  audioUri?: string;
};

/**
 * Shared reading view for religious text (zikr, dua, durood, names).
 *
 * `onToggleFavorite`/`isFavorite` render an inline favorite toggle in the header
 * (parity across zikr/dua/durood). Sharing is handled inline: native uses the
 * OS share sheet, web falls back to `navigator.share` or a clipboard copy so web
 * users are never left without a way to share.
 */
export function ReadingCard({
  item,
  sourceHref,
  isFavorite,
  onToggleFavorite,
  surface = "dua_zikr",
  contentRef,
}: {
  item: ReadingItem;
  sourceHref?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  /** Reading surface for the in-context size override (NF-1.32). */
  surface?: ReadingSurface;
  /** When set, shows a report button for this content item. */
  contentRef?: ContentReportReference;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs } = usePreferences();
  const audio = useAudioPlayerContext();
  const { arabic: arabicSize, translation: textSize } = resolveReadingFontSizes(surface, fontPrefs);

  const playAudio = () => {
    if (!item.audioUri) return;
    audio.play(
      [
        {
          id: item.id ?? "reading",
          title: item.title ?? "",
          subtitle: item.reference,
          uri: item.audioUri,
        },
      ],
      0,
      sourceHref ? { sourceHref } : undefined,
    );
    if (sourceHref === "/duroods") {
      recordContinueActivity(buildDuroodActivity(item, { isAudio: true }));
    }
  };

  const onShare = async () => {
    const message = formatReadingShare(item);
    if (Platform.OS === "web") {
      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      try {
        if (nav?.share) {
          await nav.share({ text: message });
        } else if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(message);
        }
      } catch {
        // user cancelled or share/clipboard unavailable
      }
      return;
    }
    try {
      await Share.share({ message });
    } catch {
      // user cancelled or share unavailable
    }
  };

  return (
    <Card padding="four">
      <View style={styles.header}>
        {item.audioUri ? (
          <IconButton
            name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
            size={16}
            tintColor={colors.accent}
            background={tokens.accentSoft}
            accessibilityLabel={t("common.play")}
            onPress={playAudio}
          />
        ) : (
          <View />
        )}
        <View style={styles.headerActions}>
          {onToggleFavorite ? (
            <IconButton
              name={
                isFavorite
                  ? { ios: "star.fill", android: "star", web: "star" }
                  : { ios: "star", android: "star_border", web: "star_border" }
              }
              size={18}
              tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
              accessibilityLabel={isFavorite ? t("dua.unfavorite") : t("dua.favorite")}
              accessibilityState={{ selected: !!isFavorite }}
              haptic="selection"
              onPress={onToggleFavorite}
            />
          ) : null}
          <IconButton
            name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            size={18}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("reading.share")}
            onPress={onShare}
          />
          {contentRef ? <ContentReportButton contentRef={contentRef} /> : null}
        </View>
      </View>

      <ThemedText
        type="arabic"
        style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize) : null]}
      >
        {item.arabic}
      </ThemedText>

      <View style={[styles.divider, { backgroundColor: tokens.hairline }]} />

      {item.transliteration ? (
        <ThemedText
          type="small"
          style={[
            styles.transliteration,
            { color: colors.accentText },
            textSize ? { fontSize: textSize } : null,
          ]}
        >
          {item.transliteration}
        </ThemedText>
      ) : null}
      <ThemedText
        type="default"
        style={[styles.translation, textSize ? { fontSize: textSize } : null]}
      >
        {item.translation}
      </ThemedText>

      {item.virtues ? (
        <View style={[styles.note, { backgroundColor: tokens.status.success.soft }]}>
          <SymbolView
            name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            size={16}
            tintColor={tokens.status.success.color}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.noteText}>
            {item.virtues}
          </ThemedText>
        </View>
      ) : null}

      {item.reference ? (
        <ReferenceLine reference={item.reference} style={styles.reference} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  arabic: {},
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.three },
  transliteration: { fontStyle: "italic" },
  translation: { marginTop: Spacing.two },
  note: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 14,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  noteText: { flex: 1 },
  reference: { marginTop: Spacing.three },
});
