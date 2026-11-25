import type { ReadingSurface } from "@munib-tracker/shared/types";
import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { SymbolView } from "expo-symbols";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ContentActions } from "@/components/content/content-actions";
import { ReadingTtsButton } from "@/components/content/reading-tts-button";
import { ReferenceLine } from "@/components/content/reference-line";
import { ContentReportContext } from "@/components/content-report/content-report-context";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildDuroodActivity } from "@/lib/continue-activity";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import { parseQuranReference } from "@/lib/quran-ref-parse";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { useReadingDisplay } from "@/lib/settings/reading-display";
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
  translations?: Partial<Record<string, string>>;
  virtues?: string;
  reference?: string;
  audioUri?: string;
  variants?: Array<{
    arabic: string;
    transliteration?: string;
    translation?: string;
    reference?: string;
  }>;
};

/**
 * Dua screens (`/dua/…`, Umrah `DuaByRef`, `/jannah/duas`, `/jahannam/duas`) show
 * the bundled duas, whose "Quran X:Y" reference is the ayah the dua is from.
 * Adhkar are left out on purpose: some cite an ayah they only quote in part.
 */
export function isDuaReadingSource(sourceHref: string | undefined): boolean {
  if (!sourceHref) return false;
  return sourceHref.startsWith("/dua/") || /\/duas$/.test(sourceHref);
}

/**
 * Shared reading view for religious text (zikr, dua, durood, names).
 *
 * Actions use the shared `ContentActions` row (Play · Save · Share · More, D-UX9:
 * `onToggleFavorite`/`isFavorite` drive the bookmark "Save" toggle — stored data
 * keeps its favorites names). Sharing is handled inline: native uses the
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
  /**
   * Offer "Recite along" (Check mode, D68) on the ayah in a "Quran X:Y"
   * reference. Defaults to on for dua screens ({@link isDuaReadingSource}).
   */
  reciteAlong,
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
  reciteAlong?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const { fontPrefs, translationLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingDisplay();
  const displayTranslation = useScriptureTranslation(item);
  const audio = useAudioPlayerContext();
  // Optional: cards rendered outside the report provider (tests, embeds) skip "Report".
  const contentReport = useContext(ContentReportContext);
  const internalShare = useShareContentCard();
  const { share, isSharing, isGesturePending, SnapshotHost } = shareCardProp ?? internalShare;
  const shareKey = item.id ?? item.reference ?? sourceHref ?? "reading";
  const { arabic: arabicSize, translation: textSize } = resolveReadingFontSizes(surface, fontPrefs);

  const ttsEnabled = Boolean(enableTts && !item.audioUri);
  const ttsArabic = item.arabic.trim();
  const ttsTransliteration = item.transliteration?.trim() ?? "";
  const ttsTranslation = displayTranslation.trim();
  // TV: no speech synthesis (expo-speech is stubbed) — never offer TTS there.
  const showTts = !tv && ttsEnabled && Boolean(ttsArabic || ttsTransliteration || ttsTranslation);

  const trackId = item.id ?? "reading";
  const playAudio = () => {
    if (!item.audioUri) return;
    audio.play(
      [
        {
          id: trackId,
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

  // "More" holds what isn't Play · Save · Share (today: report a mistake).
  const moreActions: ContextMenuAction[] = [];
  if (contentRef && contentReport) {
    moreActions.push({ id: "report", title: t("contentReport.reportIssue"), systemIcon: "flag" });
  }

  const menuActions: ContextMenuAction[] = [];
  if (onToggleFavorite) {
    menuActions.push({
      id: "favorite",
      title: isFavorite ? t("dua.unfavorite") : t("common.save"),
      systemIcon: isFavorite ? "bookmark.slash" : "bookmark",
    });
  }
  if (item.audioUri) {
    menuActions.push({
      id: "play",
      title: t("common.play"),
      systemIcon: "play.circle.fill",
    });
  }
  if (!tv) {
    menuActions.push({ id: "share", title: t("reading.share"), systemIcon: "square.and.arrow.up" });
  }
  menuActions.push(...moreActions);

  const onMenuAction = (id: string) => {
    if (id === "favorite") onToggleFavorite?.();
    else if (id === "play") playAudio();
    else if (id === "share") void onShare();
    else if (id === "report" && contentRef) contentReport?.openReport(contentRef);
  };

  const transliteration = item.transliteration?.trim() ?? "";
  const translationText = displayTranslation.trim();
  const arabicText = item.arabic.trim();
  const showTranslit = showTransliteration && Boolean(transliteration);
  const showMeaning = showTranslation && Boolean(translationText);
  const recitePassage =
    (reciteAlong ?? isDuaReadingSource(sourceHref)) ? parseQuranReference(item.reference) : null;
  const hasMeta = showTranslit || showMeaning || !!item.virtues?.trim() || !!item.reference?.trim();

  const body = (
    <>
      {/* One action row for scripture items: Play · Save · Share · More (P5-37). */}
      <View style={[styles.header, tv && styles.headerTv]}>
        {!item.audioUri && showTts ? (
          <ReadingTtsButton
            id={item.id ?? "reading"}
            title={item.title ?? item.reference ?? ""}
            subtitle={item.reference}
            sourceHref={sourceHref}
            arabic={ttsArabic}
            transliteration={ttsTransliteration}
            translation={ttsTranslation}
          />
        ) : null}
        <ContentActions
          labelled
          play={item.audioUri ? { trackId, onPlay: playAudio } : undefined}
          save={
            onToggleFavorite
              ? { saved: Boolean(isFavorite), onToggle: onToggleFavorite }
              : undefined
          }
          share={
            tv
              ? undefined
              : {
                  onShare: () => void onShare(),
                  loading: isSharing(shareKey),
                  loadingLabel: t("share.preparing"),
                  accessibilityLabel: t("reading.share"),
                  label: isGesturePending(shareKey)
                    ? tTv(t, "share.tapToShare", "share.selectToShare")
                    : undefined,
                }
          }
          more={
            moreActions.length > 0 ? { actions: moreActions, onAction: onMenuAction } : undefined
          }
        />
      </View>

      {arabicText ? (
        <ThemedText
          type="arabic"
          accessibilityLanguage="ar"
          style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize) : null]}
        >
          {arabicText}
        </ThemedText>
      ) : null}

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

      {recitePassage ? (
        <ReciteAlongButton passage={recitePassage} mode="check" size="sm" style={styles.recite} />
      ) : null}

      {item.variants?.length
        ? item.variants.map((variant) => {
            const variantArabic = variant.arabic.trim();
            const variantTranslit = variant.transliteration?.trim() ?? "";
            const variantMeaning = variant.translation?.trim() ?? "";
            const showVariantTranslit = showTransliteration && Boolean(variantTranslit);
            const showVariantMeaning = showTranslation && Boolean(variantMeaning);
            return (
              <View
                key={variant.reference ?? variantArabic}
                style={[styles.variantBlock, { borderTopColor: tokens.hairline }]}
              >
                <ThemedText
                  type="smallBold"
                  themeColor="mutedForeground"
                  style={styles.variantLabel}
                >
                  {t("zikr.alternateWording")}
                </ThemedText>
                {variantArabic ? (
                  <ThemedText
                    type="arabic"
                    accessibilityLanguage="ar"
                    style={[styles.arabic, arabicSize ? arabicReadingLayout(arabicSize) : null]}
                  >
                    {variantArabic}
                  </ThemedText>
                ) : null}
                {showVariantTranslit ? (
                  <ThemedText
                    type="small"
                    style={[
                      styles.transliteration,
                      { color: colors.accentText },
                      textSize ? { fontSize: textSize } : null,
                    ]}
                  >
                    {variantTranslit}
                  </ThemedText>
                ) : null}
                {showVariantMeaning ? (
                  <ThemedText
                    type="default"
                    style={[
                      styles.translation,
                      textSize ? translationReadingStyle(translationLocale, textSize) : null,
                    ]}
                  >
                    {variantMeaning}
                  </ThemedText>
                ) : null}
                {variant.reference ? (
                  <ReferenceLine reference={variant.reference} style={styles.reference} />
                ) : null}
              </View>
            );
          })
        : null}
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
    flexWrap: "wrap",
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  headerTv: {
    marginBottom: Spacing.four,
    gap: Spacing.three,
  },
  arabic: {},
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.three },
  transliteration: { fontStyle: "italic" },
  translation: { marginTop: Spacing.two },
  note: {
    flexDirection: "row",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  noteText: { flex: 1 },
  reference: { marginTop: Spacing.three },
  recite: { alignSelf: "flex-start", marginTop: Spacing.three },
  variantBlock: {
    marginTop: Spacing.four,
    paddingTop: Spacing.four,
    borderTopWidth: BorderWidth.hairline,
    gap: Spacing.two,
  },
  variantLabel: { marginBottom: Spacing.one },
});
