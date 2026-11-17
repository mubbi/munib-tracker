import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type GenealogyTvNodeListProps = {
  nodes: ProphetsGenealogyNode[];
  branchOrder: readonly string[];
  selectedId: string | null;
  /** Search / branch filter matches — non-matches are dimmed, not hidden. */
  highlightIds?: Set<string> | null;
  onSelect: (node: ProphetsGenealogyNode) => void;
  /** Fixed list height; the list scrolls itself as D-pad focus moves. */
  height: number;
};

/**
 * TV-only D-pad alternative to the pan/pinch genealogy map: every person on
 * the tree as a vertical, branch-grouped list. Select picks the node (detail
 * card + the map recentres on it). Up/Down move one person at a time.
 */
export function GenealogyTvNodeList({
  nodes,
  branchOrder,
  selectedId,
  highlightIds,
  onSelect,
  height,
}: GenealogyTvNodeListProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  // Initial focus lands on the person selected at mount only — later selection
  // changes (e.g. while typing a search) must not yank focus into the list.
  const [initialSelectedId] = useState(selectedId);

  return (
    <TvFocusGuide autoFocus style={[styles.guide, { height }]}>
      <TvScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {branchOrder.map((branch) => {
          const members = nodes.filter((node) => node.branch === branch);
          if (members.length === 0) return null;
          return (
            <View key={branch} style={styles.group}>
              <ThemedText type="label" themeColor="mutedForeground" style={styles.groupTitle}>
                {t(`prophets.tree.branch.${branch}`)}
              </ThemedText>
              {members.map((node) => {
                const selected = node.id === selectedId;
                const dimmed = Boolean(
                  highlightIds && highlightIds.size > 0 && !highlightIds.has(node.id),
                );
                const tone =
                  node.certainty === "quran"
                    ? tokens.status.success
                    : node.certainty === "authentic-hadith"
                      ? tokens.status.info
                      : tokens.status.warning;
                return (
                  <PressableScale
                    key={node.id}
                    onPress={() => onSelect(node)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${node.name}, ${t(`prophets.tree.certainty.${node.certainty}`)}`}
                    {...(node.id === initialSelectedId ? { hasTVPreferredFocus: true } : {})}
                    style={[
                      styles.row,
                      {
                        // Selected = soft fill + hairline; focus ring comes from PressableScale.
                        backgroundColor: selected ? tokens.accentSoft : colors.card,
                        borderColor: selected ? tokens.accentBorder : colors.border,
                        opacity: dimmed ? 0.45 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.dot, { backgroundColor: tone.color }]} />
                    <View style={styles.copy}>
                      <ThemedText type="smallBold" numberOfLines={1}>
                        {node.name}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                        {t(`prophets.tree.certainty.${node.certainty}`)}
                      </ThemedText>
                    </View>
                  </PressableScale>
                );
              })}
            </View>
          );
        })}
      </TvScrollView>
    </TvFocusGuide>
  );
}

const styles = StyleSheet.create({
  guide: {
    width: "100%",
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.three,
    // Room for the focus ring + scale on the outermost rows.
    padding: Spacing.two,
  },
  group: {
    gap: Spacing.two,
  },
  groupTitle: {
    marginStart: Spacing.one,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: {
    width: tvDp(10),
    height: tvDp(10),
    borderRadius: tvDp(5),
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
});
