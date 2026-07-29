import type { ReadingSurface } from "@munib-tracker/shared/types";
import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReadingTtsButton } from "@/components/content/reading-tts-button";
import { ReferenceLine } from "@/components/content/reference-line";
import { ContentReportButton } from "@/components/content-report/content-report-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { PLAY_CIRCLE_ICON } from "@/constants/media-icons";
import { Spacing } from "@/constants/theme";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildDuroodActivity } from "@/lib/continue-activity";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { formatReadingShare } from "@/lib/share";
import { useAudioPlayerContext } from "@/providers/audio-player-provider";
import { recordContinueActivity } from "@/stores/continue-store";
import { usePreferences } from "@/stores/preferences-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

export type ReadingItem = {
  id?: string;
  title?: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  translations?: Partial<Record<string, string>>;
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
  /** When set, reuses a parent screen's share snapshot host (e.g. duplicate share buttons). */
  shareCard: shareCardProp,
  contentRef,
  /**
   * When true and there is no recorded `audioUri`, show a TTS play control
   * (voice sheet → mini-player). Used for user-authored custom adhkar.
   */
  enableTts,
  /**
   * Long-press context menu around the card. Off by default for nested /
   * full-width custom layouts — iOS `MenuView` Hosts can mis-size full cards.
   */
  enableContextMenu = true,
  /**
   * When false, renders content without the elevated `Card` chrome (for nesting
   * inside a parent card).
   */
  framed = true,
}: {
  item: ReadingItem;
  sourceHref?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  /** Reading surface for the in-context size override (NF-1.32). */
  surface?: ReadingSurface;
  shareCard?: ReturnType<typeof useShareContentCard>;
  /** When set, shows a report button for this content item. */
  contentRef?: ContentReportReference;
  enableTts?: boolean;
  enableContextMenu?: boolean;
  framed?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { fontPrefs, translationLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
  const displayTranslation = useScriptureTranslation(item);
  const audio = useAudioPlayerContext();
  const internalShare = useShareContentCard();
  const { share, isSharing, isGesturePending, SnapshotHost } = shareCardProp ?? internalShare;
  const shareKey = item.id ?? item.reference ?? sourceHref ?? "reading";
  const { arabic: arabicSize, translation: textSize } = resolveReadingFontSizes(surface, fontPrefs);

  const ttsEnabled = Boolean(enableTts && !item.audioUri);
  const ttsArabic = item.arabic.trim();
  const ttsTransliteration = item.transliteration?.trim() ?? "";
  const ttsTranslation = displayTranslation.trim();
  const showTts = ttsEnabled && Boolean(ttsArabic || ttsTransliteration || ttsTranslation);

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
    await share({
      message,
      sectionTitle: t("share.sectionReading"),
      contentLabel: item.title ?? item.reference,
      filenameSlug: "reading",
      shareKey,
      content: { kind: "reading", item },
    });
  };

  const menuActions: ContextMenuAction[] = [];
  if (onToggleFavorite) {
    menuActions.push({
      id: "favorite",
      title: isFavorite ? t("dua.unfavorite") : t("dua.favorite"),
      systemIcon: isFavorite ? "star.slash" : "star",
    });
  }
  if (item.audioUri) {
    menuActions.push({
      id: "play",
      title: t("common.play"),
      systemIcon: "play.circle.fill",
    });
  }
  menuActions.push({ id: "share", title: t("reading.share"), systemIcon: "square.and.arrow.up" });

  const onMenuAction = (id: string) => {
    if (id === "favorite") onToggleFavorite?.();
    else if (id === "play") playAudio();
    else if (id === "share") void onShare();
  };

  const transliteration = item.transliteration?.trim() ?? "";
  const translationText = displayTranslation.trim();
  const showTranslit = showTransliteration && Boolean(transliteration);
  const showMeaning = showTranslation && Boolean(translationText);
  const hasMeta = showTranslit || showMeaning || !!item.virtues?.trim() || !!item.reference?.trim();

  const body = (
    <>
      <View style={[styles.header, tv && styles.headerTv]}>
        {item.audioUri ? (
          <LabeledIconButton
            name={PLAY_CIRCLE_ICON}
            label={t("common.play")}
            iconSize={tv ? 22 : 18}
            tintColor={colors.accent}
            labelColor={colors.accent}
            background={tokens.accentSoft}
            accessibilityLabel={t("common.play")}
            onPress={playAudio}
          />
        ) : showTts ? (
          <ReadingTtsButton
            id={item.id ?? "reading"}
            title={item.title ?? item.reference ?? ""}
            subtitle={item.reference}
            sourceHref={sourceHref}
            arabic={ttsArabic}
            transliteration={ttsTransliteration}
            translation={ttsTranslation}
          />
        ) : (
          <View />
        )}
        <View style={[styles.headerActions, tv && styles.headerActionsTv]}>
          {onToggleFavorite ? (
            <LabeledIconButton
              name={
                isFavorite
                  ? { ios: "star.fill", android: "star", web: "star" }
                  : { ios: "star", android: "star_border", web: "star_border" }
              }
              label={isFavorite ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
              iconSize={tv ? 20 : 16}
              tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
              labelColor={isFavorite ? tokens.status.warning.color : undefined}
              accessibilityLabel={isFavorite ? t("dua.unfavorite") : t("dua.favorite")}
              accessibilityState={{ selected: !!isFavorite }}
              haptic="selection"
              onPress={onToggleFavorite}
            />
          ) : null}
          <LabeledIconButton
            name={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
            label={
              isGesturePending(shareKey)
                ? tTv(t, "share.tapToShare", "share.selectToShare")
                : t("common.share")
            }
            iconSize={tv ? 20 : 16}
            tintColor={colors.mutedForeground}
            accessibilityLabel={t("reading.share")}
            loading={isSharing(shareKey)}
            loadingLabel={t("share.preparing")}
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

      {hasMeta ? <View style={[styles.divider, { backgroundColor: tokens.hairline }]} /> : null}

      {showTranslit ? (
        <ThemedText
          type="small"
          style={[
            styles.transliteration,
            { color: colors.accentText },
            textSize ? { fontSize: textSize } : null,
          ]}
        >
          {transliteration}
        </ThemedText>
      ) : null}
      {showMeaning ? (
        <ThemedText
          type="default"
          style={[
            styles.translation,
            textSize ? translationReadingStyle(translationLocale, textSize) : null,
          ]}
        >
          {translationText}
        </ThemedText>
      ) : null}

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
    </>
  );

  const content = framed ? (
    <Card padding="four">{body}</Card>
  ) : (
    <View style={styles.embed}>{body}</View>
  );

  return (
    <>
      {shareCardProp ? null : SnapshotHost}
      {enableContextMenu ? (
        <ContextMenu actions={menuActions} onAction={onMenuAction}>
          {content}
        </ContextMenu>
      ) : (
        content
      )}
    </>
  );
}

const styles = StyleSheet.create({
  embed: {
    alignSelf: "stretch",
    gap: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  headerTv: {
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: Spacing.one,
  },
  headerActionsTv: {
    gap: Spacing.two,
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
