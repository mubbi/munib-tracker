import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";
import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { ContentActions } from "@/components/content/content-actions";
import { ReferenceLine } from "@/components/content/reference-line";
import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { ContentReportFooterLink } from "@/components/content-report/content-report-footer-link";
import {
  HadithCitationBookmarkButton,
  QuranAyahBookmarkButton,
} from "@/components/jannah/bookmark-button";
import { tvLearnRowStyle } from "@/components/learn-guide/tv-learn-chrome";
import { useRegisterLearnListenText } from "@/components/learn-tts-context";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { useReciteAlongInlineEnabled } from "@/components/quran/recite-along-inline";
import { QuranAyahPlayButton } from "@/components/quran-guide/ayah-play-button";
import { LearnProseText, useReadingTypography } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Callout, type CalloutTone } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useQuranAyahRange } from "@/hooks/use-quran-ayah-range";
import { formatReadingShare, useShareContentCard } from "@/hooks/use-share-content-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { isLongPassage, passageFromRef } from "@/lib/recite-along/passages";
import { useChevronForward } from "@/lib/rtl";

/**
 * Highlight banner for key messages (intro, journey reminder, etc.) — the Learn
 * flavour of the shared `ui/callout.tsx` (body set in reading-surface prose).
 */
export function JannahCallout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: Exclude<CalloutTone, "danger">;
}) {
  const { colors } = useThemeTokens();
  return (
    <Callout tone={tone}>
      <LearnProseText type="small" style={[styles.calloutText, { color: colors.foreground }]}>
        {children}
      </LearnProseText>
    </Callout>
  );
}

/** Centered scholar disclaimer used at the bottom of Jannah screens. */
export function JannahDisclaimer({
  textKey = "jannah.disclaimer",
  contentRef,
}: {
  textKey?: string;
  contentRef?: ContentReportReference;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  return (
    <View>
      <View style={[styles.disclaimerWrap, { borderColor: tokens.hairline }]}>
        <TvReadableBlock>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
            {t(textKey)}
          </ThemedText>
        </TvReadableBlock>
      </View>
      {contentRef ? <ContentReportFooterLink contentRef={contentRef} /> : null}
    </View>
  );
}

/** Two-line navigation row with icon well — used on hub and inner pages. */
export function JannahNavRow({
  icon,
  title,
  subtitle,
  badge,
  onPress,
  href,
  tint,
  preferredFocus,
}: {
  icon: AppIconType;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
  /** Web: crawlable `<a href>` for the destination (see `PressableScale`). */
  href?: string;
  tint?: string;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
}) {
  const { colors } = useThemeTokens();
  const chevronForward = useChevronForward();
  const iconTint = tint ?? colors.accent;
  const accessibilityLabel = [title, subtitle, badge].filter(Boolean).join(". ");

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      href={href}
      {...(preferredFocus && isTV() ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.navRow,
        // Grid cells (wide hubs): fill the row height so tiles line up. Inert in
        // the phone stack, where the parent has no spare height to distribute.
        isTV() ? [tvLearnRowStyle, styles.navRowTv] : styles.navRowFill,
        { backgroundColor: colors.muted },
      ]}
    >
      <IconWell icon={icon} tint={iconTint} background={withAlpha(iconTint, 0.12)} />
      <View style={styles.navCopy}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={3}>
            {subtitle}
          </ThemedText>
        ) : null}
        {badge ? (
          <Pill
            label={badge}
            compact
            color={colors.mutedForeground}
            background={colors.card}
            style={styles.navBadge}
          />
        ) : null}
      </View>
      <SymbolView name={chevronForward} size={16} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

/**
 * `LearnActionRow` — pressable list row that also hosts its own secondary
 * control (e.g. a bookmark / save button). `actions` are never nested inside the row pressable (invalid nested
 * <button>s on RN Web). Phone/web: body pressable, then `actions`, then `trailing`
 * as siblings in the row — the same visual order as before. TV: nested focusables
 * are unreachable on tvOS (and awkward on Android TV), so the row splits into the
 * pressable body (with `trailing`) plus `actions` the D-pad reaches with Right.
 */
export function LearnActionRow({
  onPress,
  accessibilityLabel,
  accessibilityRole = "link",
  style,
  children,
  actions,
  trailing,
}: {
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: "link" | "button";
  /** Row container style (flex row, padding, separators). */
  style?: StyleProp<ViewStyle>;
  /** Leading content (icon + copy). */
  children: ReactNode;
  /** Secondary focusable controls — moved beside the row on TV. */
  actions?: ReactNode;
  /** Non-interactive trailing glyph (chevron) — stays inside the row. */
  trailing?: ReactNode;
}) {
  if (!isTV() && !actions) {
    return (
      <PressableScale
        haptic="light"
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={style}
      >
        {children}
        {trailing}
      </PressableScale>
    );
  }
  const flat: ViewStyle = StyleSheet.flatten(style) ?? {};
  const bodyLayout = { alignItems: flat.alignItems ?? "center", gap: flat.gap ?? Spacing.three };
  if (!isTV()) {
    // Phone/web: `actions` are buttons, so they sit BESIDE the row pressable, never
    // inside it (a nested pressable is a <button> in a <button> on RN Web). Same
    // order as before — body, actions, chevron; the chevron is a second hit target
    // for the row, hidden from screen readers and the tab order (the body carries
    // the label).
    return (
      <View style={[style, styles.actionRowSplit]}>
        <PressableScale
          haptic="light"
          accessibilityRole={accessibilityRole}
          accessibilityLabel={accessibilityLabel}
          onPress={onPress}
          // The body lays its children out exactly as the row style did.
          style={[styles.actionRowBody, { alignItems: flat.alignItems, gap: flat.gap }]}
        >
          {children}
        </PressableScale>
        {actions}
        {trailing ? (
          <PressableScale
            haptic="light"
            onPress={onPress}
            accessible={false}
            focusable={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            {trailing}
          </PressableScale>
        ) : null}
      </View>
    );
  }
  return (
    <View style={[style, styles.actionRowTv]}>
      <PressableScale
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={[styles.actionRowBodyTv, bodyLayout]}
      >
        {children}
        {trailing}
      </PressableScale>
      {actions}
    </View>
  );
}

/** 2×2 quick-link grid for hub shortcuts (one row of 4 on wide hubs via `columns`). */
export function JannahQuickLinkGrid({
  items,
  columns = 2,
}: {
  /** Tiles per row — 2 (phone / aside default) or 4 (wide full-width hub). */
  columns?: 2 | 4;
  items: {
    id: string;
    icon: AppIconType;
    title: string;
    subtitle: string;
    tint: string;
    onPress: () => void;
    /** Web: crawlable `<a href>` for the destination (see `PressableScale`). */
    href?: string;
  }[];
}) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.quickGrid}>
      {items.map((item) => (
        <PressableScale
          key={item.id}
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={`${item.title}. ${item.subtitle}`}
          onPress={item.onPress}
          href={item.href}
          style={[
            styles.quickTile,
            columns === 4 && !isTV() ? styles.quickTileQuarter : null,
            { backgroundColor: colors.muted },
          ]}
        >
          <IconWell
            icon={item.icon}
            tint={item.tint}
            background={withAlpha(item.tint, 0.12)}
            well={40}
            size={18}
          />
          <ThemedText type="smallBold" numberOfLines={2} style={styles.quickTitle}>
            {item.title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {item.subtitle}
          </ThemedText>
        </PressableScale>
      ))}
    </View>
  );
}

/** Summary highlight at the top of a topic page. */
export function JannahTakeaway({ text }: { text: string }) {
  const { colors, tokens } = useThemeTokens();
  useRegisterLearnListenText(text);

  return (
    <TvReadableBlock>
      <View
        style={[
          styles.takeaway,
          { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
        ]}
      >
        <LearnProseText proseRole="title" type="smallBold" style={{ color: colors.accentText }}>
          {text}
        </LearnProseText>
      </View>
    </TvReadableBlock>
  );
}

/** Readable body copy block. */
export function JannahBody({
  paragraphs,
  uniform = false,
}: {
  paragraphs: string[];
  /** When true, every paragraph uses the same secondary body style. */
  uniform?: boolean;
}) {
  useRegisterLearnListenText(paragraphs);

  return (
    <View style={styles.bodyBlock}>
      {paragraphs.map((paragraph, index) => (
        <TvReadableBlock key={paragraph.slice(0, 48)}>
          <LearnProseText
            type={uniform || index > 0 ? "small" : "default"}
            themeColor={uniform || index > 0 ? "mutedForeground" : "foreground"}
            style={styles.bodyParagraph}
          >
            {paragraph}
          </LearnProseText>
        </TvReadableBlock>
      ))}
    </View>
  );
}

function QuranEvidenceItem({ refItem }: { refItem: JannahQuranRef }) {
  const { colors, tokens } = useThemeTokens();
  const range = useQuranAyahRange(refItem.surah, refItem.ayahFrom, refItem.ayahTo);
  // D68: a compact recite-along beside Play — short quotes only (long ranges are
  // left to the screen's own recite-along card / section sheet).
  const inlineRecite = useReciteAlongInlineEnabled();
  const recitePassage = inlineRecite ? passageFromRef(refItem) : null;

  return (
    <View
      testID="learn-quran-quote"
      style={[
        styles.quranQuote,
        // Logical colour with the logical width (C-04): the bar stays on the
        // reading-start edge — and keeps its colour — in ar / ur / fa / ps / ku.
        { borderStartColor: colors.accent, backgroundColor: tokens.accentSoft },
      ]}
    >
      <View style={styles.quranHeader}>
        <View style={styles.quranRef}>
          <ReferenceLine reference={refItem.label} />
        </View>
        <View style={styles.hadithMetaActions}>
          <QuranAyahPlayButton
            surah={refItem.surah}
            ayahFrom={refItem.ayahFrom}
            ayahTo={refItem.ayahTo}
          />
          {recitePassage && !isLongPassage(recitePassage) ? (
            <ReciteAlongButton passage={recitePassage} appearance="icon" />
          ) : null}
          <QuranAyahBookmarkButton surah={refItem.surah} ayah={refItem.ayahFrom} />
        </View>
      </View>
      <TvReadableBlock>
        <ReligiousTextStack
          arabic={range?.arabic}
          transliteration={range?.transliteration}
          translation={refItem.excerpt}
          quranRef={refItem}
          compact
        />
      </TvReadableBlock>
    </View>
  );
}

/**
 * Qur'an evidence for a lesson. Default: its own card with a "Qur'an" header.
 * `plain`: just the quote list — use when the caller already sits inside a card
 * or supplies its own heading (no card-in-card, G-49).
 */
export function QuranEvidence({
  refs,
  plain = false,
}: {
  refs: JannahQuranRef[];
  plain?: boolean;
}) {
  const { t } = useTranslation();
  const list = (
    <View style={plain ? styles.evidenceListPlain : styles.evidenceList}>
      {refs.map((ref) => (
        <QuranEvidenceItem key={ref.label} refItem={ref} />
      ))}
    </View>
  );
  if (plain) return list;

  return (
    <Card>
      <SectionHeader
        title={t("jannah.quranTitle")}
        icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
      />
      {list}
    </Card>
  );
}

/**
 * The one hadith quote block (G-30): citation + grade + save on a single meta
 * line, then the meaning through `ScriptureMeaning` (D45) in reading prose.
 * Typographic quotes come from the catalog (`learnKit.quoted`), never JSX
 * literals (G-47). `surface`: `muted` (default, on a card) or `accent` (a
 * featured quote on the page background).
 */
export function HadithQuote({
  hadith,
  surface = "muted",
  emphasis = false,
}: {
  hadith: JannahHadithRef;
  surface?: "muted" | "accent";
  /** Body-size text (featured quotes); default is the secondary small size. */
  emphasis?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const accent = surface === "accent";

  return (
    <View
      testID="learn-hadith-quote"
      style={[styles.hadithQuote, { backgroundColor: accent ? tokens.accentSoft : colors.muted }]}
    >
      <View style={styles.hadithMeta}>
        <ThemedText
          type="caption"
          style={[
            styles.hadithCitation,
            { color: accent ? tokens.accentOnSoft : colors.accentText },
          ]}
        >
          {hadith.collection} · {hadith.citation}
        </ThemedText>
        <View style={styles.hadithMetaActions}>
          {hadith.grade ? (
            <Pill label={t(`jannah.grade.${hadith.grade}`)} compact tone="success" />
          ) : null}
          <HadithCitationBookmarkButton collection={hadith.collection} citation={hadith.citation} />
        </View>
      </View>
      <TvReadableBlock>
        <ScriptureMeaning english={hadith.excerpt}>
          {(text) => (
            <LearnProseText
              type={emphasis ? "default" : "small"}
              themeColor="mutedForeground"
              style={styles.quoteText}
            >
              {t("learnKit.quoted", { text })}
            </LearnProseText>
          )}
        </ScriptureMeaning>
      </TvReadableBlock>
    </View>
  );
}

/**
 * Hadith evidence for a lesson. Default: its own card with a "Hadith" header.
 * `plain`: just the quotes (inside an existing card / list — G-49).
 */
export function HadithEvidence({
  refs,
  plain = false,
  surface,
}: {
  refs: JannahHadithRef[];
  plain?: boolean;
  surface?: "muted" | "accent";
}) {
  const { t } = useTranslation();
  const list = (
    <View style={plain ? styles.evidenceListPlain : styles.evidenceList}>
      {refs.map((ref) => (
        <HadithQuote key={`${ref.collection}-${ref.citation}`} hadith={ref} surface={surface} />
      ))}
    </View>
  );
  if (plain) return list;

  return (
    <Card>
      <SectionHeader
        title={t("jannah.hadithTitle")}
        icon={{ ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" }}
      />
      {list}
    </Card>
  );
}

/** @deprecated Kit name: `QuranEvidence`. */
export const JannahQuranEvidence = QuranEvidence;
/** @deprecated Kit name: `HadithEvidence`. */
export const JannahHadithEvidence = HadithEvidence;
/** @deprecated Kit name: `LearnActionRow`. */
export const JannahActionRow = LearnActionRow;

/** Numbered practical steps — easier to scan and remember. */
export function JannahActionSteps({ steps }: { steps: string[] }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  useRegisterLearnListenText(steps);

  return (
    <Card>
      <SectionHeader
        title={t("jannah.actionsTitle")}
        icon={{ ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" }}
      />
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <TvReadableBlock key={step}>
            <View style={styles.stepRow}>
              <View style={[styles.stepBadge, { backgroundColor: tokens.accentSoft }]}>
                <ThemedText type="smallBold" style={{ color: tokens.accentOnSoft }}>
                  {index + 1}
                </ThemedText>
              </View>
              <LearnProseText type="small" themeColor="mutedForeground" style={styles.stepText}>
                {step}
              </LearnProseText>
            </View>
          </TvReadableBlock>
        ))}
      </View>
    </Card>
  );
}

/** Featured du'a block with Arabic typography. */
export function JannahDuaBlock({
  title,
  arabic,
  transliteration,
  translation,
  reference,
}: {
  title?: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const { share, isSharing, SnapshotHost } = useShareContentCard();
  const shareKey = reference ?? title ?? arabic.slice(0, 24);
  const onShare = () =>
    share({
      message: formatReadingShare({ title, arabic, transliteration, translation, reference }),
      sectionTitle: t("share.sectionReading"),
      contentLabel: title ?? reference,
      filenameSlug: "reading",
      shareKey,
      content: {
        kind: "reading",
        item: { title, arabic, transliteration, translation, reference },
      },
    });

  return (
    <TvReadableBlock>
      <Card>
        <View style={styles.duaHeader}>
          {title ? (
            <ThemedText type="smallBold" style={styles.duaTitle}>
              {title}
            </ThemedText>
          ) : (
            <View style={styles.duaTitle} />
          )}
          <ContentActions share={{ onShare, loading: isSharing(shareKey) }} />
        </View>
        <View
          style={[
            styles.duaInner,
            { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
          ]}
        >
          <ReligiousTextStack
            arabic={arabic}
            transliteration={transliteration}
            translation={translation}
            compact
          />
        </View>
        {reference ? (
          <ThemedText
            type="caption"
            themeColor="mutedForeground"
            style={[styles.duaRef, { fontSize: sizes.transliteration }]}
          >
            {reference}
          </ThemedText>
        ) : null}
        {SnapshotHost}
      </Card>
    </TvReadableBlock>
  );
}

const styles = StyleSheet.create({
  calloutText: { flex: 1 },
  disclaimerWrap: {
    borderTopWidth: BorderWidth.hairline,
    paddingTop: Spacing.three,
    marginTop: Spacing.one,
  },
  disclaimer: { textAlign: "center" },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.twoHalf,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 56,
  },
  navRowTv: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  navRowFill: { flexGrow: 1 },
  navCopy: { flex: 1, gap: Spacing.half, minWidth: 0 },
  actionRowTv: { alignItems: "center" },
  actionRowSplit: { flexDirection: "row" },
  actionRowBody: { flex: 1, flexDirection: "row", minWidth: 0 },
  actionRowBodyTv: {
    flex: 1,
    flexDirection: "row",
    minHeight: TvLayout.minFocusTarget,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  navBadge: { alignSelf: "flex-start", marginTop: Spacing.half },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  quickTile: {
    // Slightly under half so `gap` does not push a row past the card edge.
    width: "47%",
    flexGrow: 1,
    flexShrink: 1,
    maxWidth: "100%",
    minWidth: 140,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  // Wide hubs: one row of four (gap-aware, grows to fill the row).
  quickTileQuarter: { width: "23%", minWidth: 0 },
  quickTitle: { marginTop: Spacing.half },
  takeaway: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  bodyBlock: { gap: Spacing.three, width: "100%", alignSelf: "stretch" },
  bodyParagraph: { flexShrink: 1, alignSelf: "stretch" },
  evidenceList: { gap: Spacing.three, marginTop: Spacing.three },
  evidenceListPlain: { gap: Spacing.three },
  quranQuote: {
    borderStartWidth: 3,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
  quranHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  quranRef: { flex: 1 },
  hadithQuote: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  hadithMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  hadithMetaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  hadithCitation: { flex: 1 },
  quoteText: { fontStyle: "italic" },
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepBadge: {
    width: tvDp(28),
    height: tvDp(28),
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepText: { flex: 1 },
  duaHeader: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.two },
  duaTitle: { flex: 1 },
  duaInner: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    gap: Spacing.two,
  },
  duaArabic: { lineHeight: 34 },
  duaTranslit: { lineHeight: 18 },
  duaTranslation: { lineHeight: 24 },
  duaRef: { marginTop: Spacing.two },
});
