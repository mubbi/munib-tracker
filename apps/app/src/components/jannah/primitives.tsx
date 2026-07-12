import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";
import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import { ContentReportFooterLink } from "@/components/content-report/content-report-footer-link";
import {
  HadithCitationBookmarkButton,
  QuranAyahBookmarkButton,
} from "@/components/jannah/bookmark-button";
import { useReadingTypography } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon as AppIconType } from "@/lib/names-of-allah-ui";
import { useChevronForward } from "@/lib/rtl";

type CalloutTone = "info" | "success" | "accent" | "warning";

const CALLOUT_ICON: Record<CalloutTone, AppIconType> = {
  info: { ios: "info.circle.fill", android: "info", web: "info" },
  success: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  accent: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  warning: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
};

/** Highlight banner for key messages (intro, journey reminder, etc.). */
export function JannahCallout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: CalloutTone;
}) {
  const { colors, tokens } = useThemeTokens();
  const palette =
    tone === "success"
      ? tokens.status.success
      : tone === "warning"
        ? tokens.status.warning
        : tone === "accent"
          ? { color: colors.accent, soft: tokens.accentSoft }
          : tokens.status.info;

  return (
    <View
      style={[
        styles.callout,
        { backgroundColor: palette.soft, borderColor: withAlpha(palette.color, 0.25) },
      ]}
    >
      <IconWell
        icon={CALLOUT_ICON[tone]}
        tint={palette.color}
        background={withAlpha(palette.color, 0.12)}
        well={36}
        size={16}
      />
      <ThemedText type="small" style={[styles.calloutText, { color: colors.foreground }]}>
        {children}
      </ThemedText>
    </View>
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
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
          {t(textKey)}
        </ThemedText>
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
  tint,
}: {
  icon: AppIconType;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
  tint?: string;
}) {
  const { colors } = useThemeTokens();
  const chevronForward = useChevronForward();
  const iconTint = tint ?? colors.accent;

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={[styles.navRow, { backgroundColor: colors.muted }]}
    >
      <IconWell icon={icon} tint={iconTint} background={withAlpha(iconTint, 0.12)} />
      <View style={styles.navCopy}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {badge ? (
        <Pill label={badge} compact color={colors.mutedForeground} background={colors.card} />
      ) : null}
      <SymbolView name={chevronForward} size={16} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

/** 2×2 quick-link grid for hub shortcuts. */
export function JannahQuickLinkGrid({
  items,
}: {
  items: {
    id: string;
    icon: AppIconType;
    title: string;
    subtitle: string;
    tint: string;
    onPress: () => void;
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
          style={[styles.quickTile, { backgroundColor: colors.muted }]}
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
  const { sizes } = useReadingTypography();

  return (
    <View
      style={[
        styles.takeaway,
        { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{
          color: colors.accentText,
          fontSize: sizes.translation,
          lineHeight: sizes.translation * 1.45,
        }}
      >
        {text}
      </ThemedText>
    </View>
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
  const { sizes } = useReadingTypography();

  return (
    <View style={styles.bodyBlock}>
      {paragraphs.map((paragraph, index) => (
        <ThemedText
          key={paragraph.slice(0, 48)}
          type={uniform || index > 0 ? "small" : "default"}
          themeColor={uniform || index > 0 ? "mutedForeground" : "foreground"}
          style={[
            styles.bodyParagraph,
            { fontSize: sizes.translation, lineHeight: sizes.translation * 1.5 },
          ]}
        >
          {paragraph}
        </ThemedText>
      ))}
    </View>
  );
}

export function JannahQuranEvidence({ refs }: { refs: JannahQuranRef[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();

  return (
    <Card padding="three">
      <SectionHeader
        title={t("jannah.quranTitle")}
        icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
      />
      <View style={styles.evidenceList}>
        {refs.map((ref) => (
          <View
            key={ref.label}
            style={[
              styles.quranQuote,
              { borderLeftColor: colors.accent, backgroundColor: tokens.accentSoft },
            ]}
          >
            <View style={styles.quranHeader}>
              <View style={styles.quranRef}>
                <ReferenceLine reference={ref.label} />
              </View>
              <QuranAyahBookmarkButton surah={ref.surah} ayah={ref.ayahFrom} />
            </View>
            {ref.excerpt ? (
              <ThemedText
                type="small"
                style={[
                  styles.quoteText,
                  {
                    color: colors.foreground,
                    fontSize: sizes.translation,
                    lineHeight: sizes.translation * 1.45,
                  },
                ]}
              >
                {ref.excerpt}
              </ThemedText>
            ) : null}
          </View>
        ))}
      </View>
    </Card>
  );
}

export function JannahHadithEvidence({ refs }: { refs: JannahHadithRef[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();

  return (
    <Card padding="three">
      <SectionHeader
        title={t("jannah.hadithTitle")}
        icon={{ ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" }}
      />
      <View style={styles.evidenceList}>
        {refs.map((ref) => (
          <View
            key={`${ref.collection}-${ref.citation}`}
            style={[styles.hadithQuote, { backgroundColor: colors.muted }]}
          >
            <View style={styles.hadithMeta}>
              <ThemedText type="caption" style={{ color: colors.accent, flex: 1 }}>
                {ref.collection} · {ref.citation}
              </ThemedText>
              <View style={styles.hadithMetaActions}>
                {ref.grade ? (
                  <Pill
                    label={t(`jannah.grade.${ref.grade}`)}
                    compact
                    color={tokens.status.success.color}
                    background={tokens.status.success.soft}
                  />
                ) : null}
                <HadithCitationBookmarkButton collection={ref.collection} citation={ref.citation} />
              </View>
            </View>
            <ThemedText
              type="small"
              themeColor="mutedForeground"
              style={[
                styles.quoteText,
                { fontSize: sizes.translation, lineHeight: sizes.translation * 1.45 },
              ]}
            >
              “{ref.excerpt}”
            </ThemedText>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** Numbered practical steps — easier to scan and remember. */
export function JannahActionSteps({ steps }: { steps: string[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();

  return (
    <Card padding="three">
      <SectionHeader
        title={t("jannah.actionsTitle")}
        icon={{ ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" }}
      />
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={[styles.stepBadge, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="smallBold" style={{ color: colors.accent }}>
                {index + 1}
              </ThemedText>
            </View>
            <ThemedText
              type="small"
              themeColor="mutedForeground"
              style={[
                styles.stepText,
                { fontSize: sizes.translation, lineHeight: sizes.translation * 1.45 },
              ]}
            >
              {step}
            </ThemedText>
          </View>
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
  const { tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();

  return (
    <Card padding="three">
      {title ? (
        <ThemedText type="smallBold" style={styles.duaTitle}>
          {title}
        </ThemedText>
      ) : null}
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
    </Card>
  );
}

const styles = StyleSheet.create({
  callout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  calloutText: { flex: 1, lineHeight: 22 },
  disclaimerWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
    marginTop: Spacing.one,
  },
  disclaimer: { textAlign: "center", lineHeight: 18 },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    minHeight: 56,
  },
  navCopy: { flex: 1, gap: 2 },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  quickTile: {
    width: "48%",
    flexGrow: 1,
    minWidth: 140,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  quickTitle: { marginTop: Spacing.half },
  takeaway: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  bodyBlock: { gap: Spacing.three, width: "100%", alignSelf: "stretch" },
  bodyParagraph: { lineHeight: 24, flexShrink: 1, alignSelf: "stretch" },
  evidenceList: { gap: Spacing.three, marginTop: Spacing.three },
  quranQuote: {
    borderLeftWidth: 3,
    paddingStart: Spacing.three,
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
  quoteText: { lineHeight: 22, fontStyle: "italic" },
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepText: { flex: 1, lineHeight: 22 },
  duaTitle: { marginBottom: Spacing.two },
  duaInner: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    gap: Spacing.two,
  },
  duaArabic: { textAlign: "right", lineHeight: 34 },
  duaTranslit: { lineHeight: 18 },
  duaTranslation: { lineHeight: 24 },
  duaRef: { marginTop: Spacing.two, lineHeight: 18 },
});
