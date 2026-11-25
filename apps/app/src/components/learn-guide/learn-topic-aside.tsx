import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useChevronBackward, useChevronForward } from "@/lib/rtl";

export type LearnAsideTopic = {
  id: string;
  title: string;
  href: Href;
};

type LearnTopicAsideProps = {
  /** Module title (e.g. "Learn the Qur'an") — the heading links back to the hub. */
  title: string;
  hubHref: Href;
  topics: LearnAsideTopic[];
  currentId?: string;
  /** When provided, shows a progress bar and check marks on completed topics. */
  completedIds?: readonly string[];
  /** Extra aside cards (related links, quiz entry…) rendered under the topic list. */
  children?: ReactNode;
};

/**
 * Desktop "in this module" navigation for Learn topic pages: module progress,
 * the full topic list with the current topic highlighted, and previous / next
 * topic buttons. Rendered only inside `LearnSplitLayout` (≥1200, non-TV).
 */
export function LearnTopicAside({
  title,
  hubHref,
  topics,
  currentId,
  completedIds,
  children,
}: LearnTopicAsideProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { height } = useLearnWideLayout();
  const chevronBackward = useChevronBackward();
  const chevronForward = useChevronForward();

  const index = currentId ? topics.findIndex((topic) => topic.id === currentId) : -1;
  const prev = index > 0 ? topics[index - 1] : undefined;
  const next = index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined;
  const completed = completedIds ? new Set(completedIds) : null;
  const doneCount = completed ? topics.filter((topic) => completed.has(topic.id)).length : 0;
  // Keep the sticky aside within the viewport: the list scrolls on its own.
  const listMaxHeight = Math.max(220, height - 360);

  return (
    <>
      <Card>
        <PressableScale
          haptic="light"
          accessibilityRole="link"
          accessibilityLabel={title}
          onPress={() => router.push(hubHref)}
          style={styles.heading}
        >
          <ThemedText type="smallBold" numberOfLines={2} style={styles.headingText}>
            {title}
          </ThemedText>
          {completed ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {`${doneCount}/${topics.length}`}
            </ThemedText>
          ) : null}
        </PressableScale>
        {completed ? (
          <ProgressBar
            value={topics.length > 0 ? doneCount / topics.length : 0}
            accessibilityLabel={t("a11yProgress.topicsCompleted")}
            height={6}
            style={styles.progress}
          />
        ) : null}

        <ScrollView
          style={[styles.list, { maxHeight: listMaxHeight }]}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator
        >
          {topics.map((topic, i) => {
            const active = topic.id === currentId;
            const done = completed?.has(topic.id) ?? false;
            return (
              <PressableScale
                key={topic.id}
                haptic="selection"
                accessibilityRole="link"
                accessibilityLabel={topic.title}
                accessibilityState={{ selected: active }}
                onPress={() => {
                  if (!active) router.push(topic.href);
                }}
                style={[styles.row, active && { backgroundColor: tokens.accentSoft }]}
              >
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor: done
                        ? tokens.status.success.soft
                        : active
                          ? colors.accent
                          : colors.muted,
                    },
                  ]}
                >
                  {done ? (
                    <SymbolView
                      name={{ ios: "checkmark", android: "check", web: "check" }}
                      size={12}
                      tintColor={tokens.status.success.color}
                    />
                  ) : (
                    <ThemedText
                      type="caption"
                      style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
                    >
                      {i + 1}
                    </ThemedText>
                  )}
                </View>
                <ThemedText
                  type={active ? "smallBold" : "small"}
                  numberOfLines={2}
                  style={[styles.rowText, active && { color: colors.accentText }]}
                >
                  {topic.title}
                </ThemedText>
              </PressableScale>
            );
          })}
        </ScrollView>

        {prev || next ? (
          <View style={styles.pager}>
            <Button
              label={t("common.previous")}
              variant="secondary"
              size="sm"
              icon={chevronBackward}
              disabled={!prev}
              accessibilityHint={prev?.title}
              onPress={() => prev && router.push(prev.href)}
              style={styles.pagerButton}
            />
            <Button
              label={t("common.next")}
              variant="secondary"
              size="sm"
              trailingIcon={chevronForward}
              disabled={!next}
              accessibilityHint={next?.title}
              onPress={() => next && router.push(next.href)}
              style={styles.pagerButton}
            />
          </View>
        ) : null}
      </Card>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  headingText: { flex: 1 },
  progress: { marginTop: Spacing.two },
  list: { marginTop: Spacing.three },
  listContent: { gap: Spacing.half },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.oneHalf,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: { flex: 1, minWidth: 0 },
  pager: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  pagerButton: { flex: 1 },
});
