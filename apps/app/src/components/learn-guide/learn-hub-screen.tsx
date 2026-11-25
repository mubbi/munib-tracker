import type { ContentReportReference } from "@munib-tracker/shared/types/content-report";
import { accentOnSurface } from "@munib-tracker/theme/color";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ReactNode, type RefObject, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  StyleSheet,
  View,
} from "react-native";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnSplitLayout,
  LearnTopicGrid,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import {
  type CategoryHueKey,
  CategoryHues,
  Control,
  IconSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronForward } from "@/lib/rtl";

/** One destination on a Learn hub (a topic, a list page, a tool). */
export type LearnHubItem = {
  /** Destination id — unique across the whole hub (one entry per destination, C-16). */
  id: string;
  icon: AppIcon;
  title: string;
  subtitle?: string;
  /** Short neutral badge (importance, "3/12"). */
  badge?: string;
  href: Href;
  /** Icon hue — browse palette (`CategoryHues`), never status colours (C-09). Default `accent`. */
  hue?: CategoryHueKey;
  /** Coming soon: muted, announced disabled, not pressable (`badge` carries the label). */
  disabled?: boolean;
  /** TV: request initial D-pad focus on this row. */
  preferredFocus?: boolean;
};

/** Small "Related" card after Tools (same markup every hub used to hand-build). */
export type LearnHubRelated = {
  title: string;
  items: LearnHubItem[];
  maxColumns?: number;
};

/** A titled group of destinations (topics) on a Learn hub. */
export type LearnHubSection = {
  id: string;
  title: string;
  hint?: string;
  icon?: AppIcon;
  items?: LearnHubItem[];
  /** Custom body under the rows (featured dua, people list, tiles…). */
  children?: ReactNode;
  /** Grid columns on wide screens (default 2). */
  maxColumns?: number;
  /** Columns on TV (default 1) — long directories use the landscape width. */
  tvColumns?: number;
};

/** Lesson progress shown as one row on the hub (and as the body of `/progress`). */
export type LearnHubProgress = {
  title: string;
  completed: number;
  total: number;
  /** Optional line under the count (e.g. "Mark lessons complete as you read"). */
  hint?: string;
  /** Detail route; omit to render a static summary (on the progress route itself). */
  href?: Href;
};

const DEFAULT_SECTION_ICON: AppIcon = { ios: "book.fill", android: "menu_book", web: "menu_book" };
const TOOLS_ICON: AppIcon = {
  ios: "wrench.and.screwdriver.fill",
  android: "construction",
  web: "construction",
};
const RELATED_ICON: AppIcon = { ios: "link", android: "link", web: "link" };
const QUIZ_ICON: AppIcon = { ios: "questionmark.circle.fill", android: "quiz", web: "quiz" };

/** Destination ids that appear more than once in a hub config (C-16 guard). */
export function findDuplicateDestinations(
  sections: readonly LearnHubSection[],
  tools: readonly LearnHubItem[] = [],
): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  const all = [...sections.flatMap((section) => section.items ?? []), ...tools];
  for (const item of all) {
    if (seen.has(item.id)) dupes.add(item.id);
    seen.add(item.id);
  }
  return [...dupes];
}

/** Resolves a hub-item hue to an icon tint that reads on the muted row surface. */
function useHueTint(): (hue: CategoryHueKey | undefined) => string {
  const { colors } = useThemeTokens();
  return useMemo(() => {
    const cache = new Map<CategoryHueKey, string>();
    return (hue = "accent") => {
      const hit = cache.get(hue);
      if (hit) return hit;
      const raw = hue === "accent" ? colors.accent : CategoryHues[hue];
      const tint = accentOnSurface(raw, colors.muted, 3);
      cache.set(hue, tint);
      return tint;
    };
  }, [colors.accent, colors.muted]);
}

function HubRows({
  items,
  maxColumns,
  tvColumns,
}: {
  items: LearnHubItem[];
  maxColumns?: number;
  tvColumns?: number;
}) {
  const router = useRouter();
  const tintFor = useHueTint();
  return (
    <LearnTopicGrid
      style={styles.rows}
      maxColumns={maxColumns}
      tvColumns={tvColumns}
      items={items.map((item) => ({
        id: item.id,
        icon: item.icon,
        title: item.title,
        subtitle: item.subtitle,
        badge: item.badge,
        tint: tintFor(item.hue),
        disabled: item.disabled,
        preferredFocus: item.preferredFocus,
        onPress: () => router.push(item.href),
      }))}
    />
  );
}

/**
 * Lesson progress as one row (with `href`) or a static summary card (without).
 * Hubs show the row; the module's `/progress` route renders the same component
 * as its summary, so the two never drift.
 */
export function LearnProgressSummary({ title, completed, total, hint, href }: LearnHubProgress) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const chevron = useChevronForward();
  const safeTotal = Math.max(0, total);
  const value = safeTotal > 0 ? Math.min(1, completed / safeTotal) : 0;
  const count = t("learnKit.progressCount", { completed, total: safeTotal });

  const body = (
    <>
      <View style={styles.progressCopy}>
        <View style={styles.progressHead}>
          <ThemedText type="smallBold" style={styles.flex}>
            {title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {count}
          </ThemedText>
        </View>
        <ProgressBar value={value} accessibilityLabel={title} />
        {hint ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      {href ? (
        <SymbolView name={chevron} size={IconSize.md} tintColor={colors.mutedForeground} />
      ) : null}
    </>
  );

  if (!href) {
    return <Card style={styles.progressRow}>{body}</Card>;
  }
  return (
    <PressableScale
      testID="learn-progress-summary"
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={[title, count, hint].filter(Boolean).join(". ")}
      onPress={() => router.push(href)}
      style={[styles.progressRow, styles.progressPressable, { backgroundColor: colors.muted }]}
    >
      {body}
    </PressableScale>
  );
}

export type LearnHubScreenProps = {
  /** i18n namespace owning `.eyebrow`, `.title`, `.subtitle`, `.intro`, `.disclaimer`. */
  ns: string;
  /** Hub route (SEO path, quiz path base). */
  basePath: string;
  /** Override the default `${ns}.title` / `.eyebrow` / `.subtitle`. */
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  /** Intro callout body (default `t(`${ns}.intro`)`); `null` hides it. */
  intro?: ReactNode | null;
  /** "Continue where you left off" block (optional). */
  continueSlot?: ReactNode;
  /** Lesson progress row. */
  progress?: LearnHubProgress;
  /** Topic sections, in reading order. */
  sections: LearnHubSection[];
  /** Tools (glossary, timeline, tree, verses…). The quiz is appended last. */
  tools?: LearnHubItem[];
  /** Adds "Review quiz" to Tools (`${basePath}/quiz`, or the given href). */
  quiz?: boolean | Href;
  /** "Related" links card, rendered after `footer` (last block before the disclaimer). */
  related?: LearnHubRelated;
  /** Extra blocks after Tools (related modules, tour), before the disclaimer. */
  footer?: ReactNode;
  /** Disclaimer key (default `${ns}.disclaimer`); `null` hides it. */
  disclaimerKey?: string | null;
  contentRef?: ContentReportReference;
  /** Lazy corpus state from `useEnsureContent` (omit for sync content). */
  content?: { ready: boolean; error?: unknown; retry?: () => void };
  /** Back fallback when there is no history (default Home). */
  backHref?: Href;
  /** Forwarded to `ScreenLayout` (e.g. `useScreenFocus` deep-link scrolling). */
  scrollRef?: RefObject<ScrollViewInstance | null>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

/**
 * The one Learn hub template (P5-39). Order on every hub: intro → continue /
 * progress → topic sections → tools (quiz last) → footer → disclaimer. At
 * ≥1200 (non-TV) continue / progress / tools move into the sticky aside.
 * Destinations are listed once (dev warning on duplicate ids); icon tints come
 * from the browse hues, never status colours; no roadmap / version pills.
 */
export function LearnHubScreen({
  ns,
  basePath,
  title,
  eyebrow,
  subtitle,
  intro,
  continueSlot,
  progress,
  sections,
  tools = [],
  quiz = false,
  related,
  footer,
  disclaimerKey,
  contentRef,
  content,
  backHref = "/",
  scrollRef,
  onScroll,
}: LearnHubScreenProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { split, maxContentWidth } = useLearnWideLayout();

  const allTools = useMemo<LearnHubItem[]>(() => {
    if (!quiz) return tools;
    return [
      ...tools,
      {
        id: "quiz",
        icon: QUIZ_ICON,
        title: t("common.learnQuiz.title"),
        subtitle: t("common.learnQuiz.hint"),
        href: quiz === true ? (`${basePath}/quiz` as Href) : quiz,
      },
    ];
  }, [tools, quiz, basePath, t]);

  if (__DEV__) {
    const dupes = findDuplicateDestinations(sections, allTools);
    if (dupes.length) console.warn(`LearnHubScreen(${ns}): duplicate destinations`, dupes);
  }

  const introBody = intro === undefined ? t(`${ns}.intro`) : intro;
  const disclaimer = disclaimerKey === undefined ? `${ns}.disclaimer` : disclaimerKey;

  const introNode =
    introBody === null ? null : <JannahCallout tone="info">{introBody}</JannahCallout>;
  const progressNode = progress ? <LearnProgressSummary {...progress} /> : null;
  const sectionNodes = sections.map((section) =>
    section.items?.length || section.children ? (
      <Card key={section.id}>
        <SectionHeader title={section.title} icon={section.icon ?? DEFAULT_SECTION_ICON} />
        {section.hint ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {section.hint}
          </ThemedText>
        ) : null}
        {section.items?.length ? (
          <HubRows
            items={section.items}
            maxColumns={section.maxColumns}
            tvColumns={section.tvColumns}
          />
        ) : null}
        {section.children ? <View style={styles.custom}>{section.children}</View> : null}
      </Card>
    ) : null,
  );
  const toolsNode = allTools.length ? (
    <View testID="learn-hub-tools">
      <Card>
        <SectionHeader title={t("learnKit.toolsTitle")} icon={TOOLS_ICON} />
        <HubRows items={allTools} maxColumns={split ? 1 : 2} />
      </Card>
    </View>
  ) : null;
  const relatedNode = related?.items.length ? (
    <View testID="learn-hub-related">
      <Card>
        <SectionHeader title={related.title} icon={RELATED_ICON} />
        <HubRows items={related.items} maxColumns={related.maxColumns} />
      </Card>
    </View>
  ) : null;
  const disclaimerNode = disclaimer ? (
    <JannahDisclaimer textKey={disclaimer} contentRef={contentRef} />
  ) : null;

  return (
    <ScreenLayout
      eyebrow={eyebrow ?? t(`${ns}.eyebrow`)}
      title={title ?? t(`${ns}.title`)}
      subtitle={subtitle ?? t(`${ns}.subtitle`)}
      onBack={() => goBackOrReplace(router, backHref)}
      maxContentWidth={maxContentWidth}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path={basePath} />
      <LearnContentGate
        ready={content?.ready ?? true}
        error={content?.error}
        onRetry={content?.retry}
      >
        <LearnSplitLayout
          aside={
            <>
              {continueSlot}
              {progressNode}
              {toolsNode}
            </>
          }
          fallback={
            <Stagger>
              {introNode}
              {continueSlot}
              {progressNode}
              {sectionNodes}
              {toolsNode}
              {footer}
              {relatedNode}
              {disclaimerNode}
            </Stagger>
          }
        >
          <Stagger>
            {introNode}
            {sectionNodes}
            {footer}
            {relatedNode}
            {disclaimerNode}
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  hint: { marginTop: Spacing.one },
  custom: { marginTop: Spacing.three, gap: Spacing.three },
  progressRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  progressPressable: {
    minHeight: Control.row,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  progressCopy: { flex: 1, minWidth: 0, gap: Spacing.two },
  progressHead: { flexDirection: "row", alignItems: "baseline", gap: Spacing.two },
});
