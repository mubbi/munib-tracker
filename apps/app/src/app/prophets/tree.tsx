import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { GenealogyTreeMap } from "@/components/prophets/genealogy-tree-map";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import {
  getProphetsGenealogyBranchOrder,
  getProphetsGenealogyNodes,
  searchProphetsGenealogy,
} from "@/lib/prophets-genealogy";

function CertaintyPill({ certainty }: { certainty: ProphetsGenealogyNode["certainty"] }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const tone =
    certainty === "quran"
      ? tokens.status.success
      : certainty === "authentic-hadith"
        ? tokens.status.info
        : tokens.status.warning;
  return (
    <Pill
      compact
      label={t(`prophets.tree.certainty.${certainty}`)}
      color={tone.color}
      background={tone.soft}
    />
  );
}

/** Horizontal chip row that actually scrolls on web (RN ScrollView often won't). */
function HorizontalChipRow({
  children,
  accessibilityLabel,
}: {
  children: ReactNode;
  accessibilityLabel: string;
}) {
  if (Platform.OS === "web") {
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        // Native DOM scrollport — RN web ScrollView nests poorly in ScreenLayout.
        className="munib-h-scroll"
        style={webChipScrollStyle}
      >
        {children}
      </View>
    );
  }

  return (
    <TvScrollView
      horizontal
      nestedScrollEnabled
      style={styles.chipScrollNative}
      contentContainerStyle={styles.chipRow}
      showsHorizontalScrollIndicator
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </TvScrollView>
  );
}

export default function ProphetsTreeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { height: windowH } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>("ibrahim");
  const [focusId, setFocusId] = useState<string | null>("ibrahim");
  const [activeBranch, setActiveBranch] = useState<string | null>(null);
  const overlayVersion = getContentOverlaysReadyVersion();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlays change
  const allNodes = useMemo(() => getProphetsGenealogyNodes(), [i18n.language, overlayVersion]);
  const branchOrder = getProphetsGenealogyBranchOrder();

  const filtered = useMemo(() => searchProphetsGenealogy(query, 40, allNodes), [query, allNodes]);
  const searching = query.trim().length >= 2;

  const selected = useMemo(
    () => allNodes.find((n) => n.id === selectedId) ?? null,
    [allNodes, selectedId],
  );

  const highlightIds = useMemo(() => {
    if (searching) return new Set(filtered.map((n) => n.id));
    if (activeBranch) {
      return new Set(allNodes.filter((n) => n.branch === activeBranch).map((n) => n.id));
    }
    return null;
  }, [searching, filtered, activeBranch, allNodes]);

  const mapHeight = Math.max(400, Math.min(620, windowH * 0.58));

  const onSelect = (node: ProphetsGenealogyNode) => {
    setSelectedId(node.id);
    setFocusId(node.id);
  };

  const selectedTone = selected
    ? selected.certainty === "quran"
      ? tokens.status.success
      : selected.certainty === "authentic-hadith"
        ? tokens.status.info
        : tokens.status.warning
    : null;

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.tree.title")}
      subtitle={t("prophets.tree.subtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
      maxContentWidth={1120}
    >
      <Seo path="/prophets/tree" />
      <View style={styles.stack}>
        <ThemedText type="small" themeColor="mutedForeground" style={styles.intro}>
          {t("prophets.tree.intro")}
        </ThemedText>

        <View style={styles.controls}>
          <View
            style={[
              styles.searchRow,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <TextInput
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (text.trim().length >= 2) {
                  const hits = searchProphetsGenealogy(text, 1, allNodes);
                  if (hits[0]) {
                    setSelectedId(hits[0].id);
                    setFocusId(hits[0].id);
                  }
                }
              }}
              placeholder={t("prophets.tree.searchPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("prophets.tree.searchPlaceholder")}
              style={[styles.searchInput, { color: colors.foreground }]}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          <HorizontalChipRow accessibilityLabel={t("prophets.tree.allBranches")}>
            <PressableScale
              onPress={() => setActiveBranch(null)}
              accessibilityRole="button"
              accessibilityState={{ selected: activeBranch === null }}
              style={styles.branchChip}
            >
              <Pill
                compact
                label={t("prophets.tree.allBranches")}
                color={activeBranch === null ? colors.accent : colors.mutedForeground}
                background={activeBranch === null ? tokens.accentSoft : colors.card}
              />
            </PressableScale>
            {branchOrder.map((branch) => {
              const selectedBranch = activeBranch === branch;
              return (
                <PressableScale
                  key={branch}
                  onPress={() => setActiveBranch(selectedBranch ? null : branch)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedBranch }}
                  style={styles.branchChip}
                >
                  <Pill
                    compact
                    label={t(`prophets.tree.branch.${branch}`)}
                    color={selectedBranch ? colors.accent : colors.mutedForeground}
                    background={selectedBranch ? tokens.accentSoft : colors.card}
                  />
                </PressableScale>
              );
            })}
          </HorizontalChipRow>

          {searching ? (
            <View
              style={[
                styles.hitsPanel,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.searchTitle}>
                {t("prophets.tree.searchResults", { count: filtered.length })}
              </ThemedText>
              <HorizontalChipRow accessibilityLabel={t("prophets.tree.searchPlaceholder")}>
                {filtered.map((node) => (
                  <PressableScale
                    key={node.id}
                    onPress={() => onSelect(node)}
                    style={[
                      styles.hit,
                      {
                        backgroundColor: selectedId === node.id ? tokens.accentSoft : colors.muted,
                        borderColor: selectedId === node.id ? colors.accent : colors.border,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={node.name}
                  >
                    <ThemedText type="smallBold">{node.name}</ThemedText>
                  </PressableScale>
                ))}
              </HorizontalChipRow>
            </View>
          ) : null}
        </View>

        <GenealogyTreeMap
          nodes={allNodes}
          selectedId={selectedId}
          highlightIds={highlightIds}
          focusId={focusId}
          onSelect={onSelect}
          height={mapHeight}
        />

        {selected && selectedTone ? (
          <Card padding="three">
            <View style={styles.detailBody}>
              <View style={[styles.detailAccent, { backgroundColor: selectedTone.color }]} />
              <View style={styles.detailHeader}>
                <View style={styles.detailTitles}>
                  <ThemedText type="subtitle">{selected.name}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t(`prophets.tree.branch.${selected.branch}`)}
                  </ThemedText>
                </View>
                <CertaintyPill certainty={selected.certainty} />
              </View>
              <ThemedText type="small" style={styles.note}>
                {selected.relationNote}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.sources}>
                {t("prophets.tree.sources")}: {selected.sources.join(" · ")}
              </ThemedText>
              {selected.prophetId ? (
                <JannahNavRow
                  icon={{ ios: "text.book.closed", android: "article", web: "article" }}
                  title={t("prophets.tree.openBio")}
                  subtitle={selected.name}
                  onPress={() =>
                    router.push({
                      pathname: "/prophets/[topic]",
                      params: { topic: selected.prophetId },
                    } as Href)
                  }
                />
              ) : null}
            </View>
          </Card>
        ) : (
          <JannahCallout tone="info">
            {tTv(t, "prophets.tree.tapHint", "prophets.tree.tapHintTv")}
          </JannahCallout>
        )}

        <JannahDisclaimer textKey="prophets.tree.disclaimer" />
      </View>
    </ScreenLayout>
  );
}

const webChipScrollStyle = {
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: Spacing.two,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  alignSelf: "stretch",
  paddingVertical: Spacing.half,
  paddingEnd: Spacing.three,
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  overscrollBehaviorX: "contain",
} as ViewStyle;

const styles = StyleSheet.create({
  stack: { gap: Spacing.three, minWidth: 0, width: "100%" },
  intro: { lineHeight: 20 },
  controls: { gap: Spacing.two, minWidth: 0, width: "100%" },
  searchRow: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchInput: { fontSize: 16, paddingVertical: Spacing.one },
  chipScrollNative: {
    flexGrow: 0,
    width: "100%",
    minWidth: 0,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: Spacing.two,
    paddingVertical: Spacing.half,
    paddingEnd: Spacing.three,
  },
  branchChip: {
    flexShrink: 0,
  },
  hitsPanel: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
    minWidth: 0,
  },
  searchTitle: { marginBottom: 2 },
  hit: {
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexShrink: 0,
  },
  detailBody: { position: "relative" },
  detailAccent: {
    position: "absolute",
    start: 0,
    top: 2,
    bottom: 2,
    width: 3,
    borderRadius: 2,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
    paddingStart: Spacing.two + 2,
  },
  detailTitles: { flex: 1, minWidth: 140, gap: 2 },
  note: { lineHeight: 21, marginBottom: Spacing.two, paddingStart: Spacing.two + 2 },
  sources: { lineHeight: 18, marginBottom: Spacing.two, paddingStart: Spacing.two + 2 },
});
