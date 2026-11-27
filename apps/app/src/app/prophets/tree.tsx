import type { ProphetsGenealogyNode } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View, type ViewStyle } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { GenealogyTreeMap } from "@/components/prophets/genealogy-tree-map";
import { GenealogyNodeList } from "@/components/prophets/genealogy-tv-node-list";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  getProphetsGenealogyBranchOrder,
  getProphetsGenealogyNodes,
  searchProphetsGenealogy,
} from "@/lib/prophets-genealogy";
import { routeMetadata } from "@/lib/seo/route-metadata";

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
  const { wide } = useLearnWideLayout();
  // Tablet / desktop web: wrap chips so mouse users see every branch (no
  // shift+wheel horizontal scrolling needed).
  if (Platform.OS === "web" && wide) {
    return (
      <View accessibilityLabel={accessibilityLabel} style={styles.chipWrap}>
        {children}
      </View>
    );
  }
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
  // Phone / tablet / web: the map or the accessible list of people (G-33). TV
  // always shows both (list beside the map).
  const [view, setView] = useState<"map" | "list">("map");
  const overlayVersion = getContentOverlaysReadyVersion();
  const tv = isTV();

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlays change
  const allNodes = useMemo(() => getProphetsGenealogyNodes(), [i18n.language, overlayVersion]);
  const branchOrder = getProphetsGenealogyBranchOrder();

  const filtered = useMemo(() => searchProphetsGenealogy(query, 40, allNodes), [query, allNodes]);
  const searching = query.trim().length >= 2;
  const noMatches = searching && filtered.length === 0;

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

  const { split } = useLearnWideLayout();
  // TV (landscape 540dp): shorter overview map beside the D-pad node list.
  // Desktop (≥1200): taller map beside a sticky-feeling detail column.
  const mapHeight = tv
    ? Math.round(windowH * 0.5)
    : split
      ? Math.max(480, Math.min(780, windowH * 0.72))
      : Math.max(400, Math.min(620, windowH * 0.58));
  const tvListHeight = Math.round(windowH * 0.72);

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

  const detail =
    selected && selectedTone ? (
      <Card>
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
        {tv
          ? // TV picks from the node list, not the map.
            t("prophets.tree.listHintTv", {
              defaultValue: tTv(t, "prophets.tree.tapHint", "prophets.tree.tapHintTv"),
            })
          : view === "list"
            ? t("prophets.tree.listHint")
            : t("prophets.tree.tapHint")}
      </JannahCallout>
    );

  const map = (
    <GenealogyTreeMap
      nodes={allNodes}
      selectedId={selectedId}
      highlightIds={highlightIds}
      focusId={focusId}
      onSelect={onSelect}
      height={mapHeight}
    />
  );
  const list = (
    <GenealogyNodeList
      nodes={allNodes}
      branchOrder={branchOrder}
      selectedId={selectedId}
      highlightIds={highlightIds}
      onSelect={onSelect}
    />
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.tree.title")}
      subtitle={t("prophets.tree.subtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
      maxContentWidth={split ? 1320 : 1120}
    >
      <Seo path="/prophets/tree" />
      <View style={styles.stack}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("prophets.tree.intro")}
        </ThemedText>

        <View style={styles.controls}>
          <SearchField
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
          />

          <HorizontalChipRow accessibilityLabel={t("prophets.tree.allBranches")}>
            <Chip
              label={t("prophets.tree.allBranches")}
              selected={activeBranch === null}
              onPress={() => setActiveBranch(null)}
              style={styles.branchChip}
            />
            {branchOrder.map((branch) => {
              const selectedBranch = activeBranch === branch;
              return (
                <Chip
                  key={branch}
                  label={t(`prophets.tree.branch.${branch}`)}
                  selected={selectedBranch}
                  onPress={() => setActiveBranch(selectedBranch ? null : branch)}
                  style={styles.branchChip}
                />
              );
            })}
          </HorizontalChipRow>

          {searching && !noMatches && (tv || view === "map") ? (
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
                      tv && styles.chipTv,
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

        {tv ? null : (
          <SegmentedControl
            accessibilityLabel={t("prophets.tree.viewLabel")}
            options={[
              { id: "map", label: t("prophets.tree.viewMap") },
              { id: "list", label: t("prophets.tree.viewList") },
            ]}
            value={view}
            onChange={setView}
          />
        )}

        {noMatches ? (
          // One no-results pattern (P8-05) instead of "0 matches" over an empty chip row (G-34).
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("search.noResultsTitle")}
            description={t("search.noResultsDesc")}
            actionLabel={t("common.clearSearch")}
            onAction={() => setQuery("")}
          />
        ) : tv ? (
          // TV: list–detail — D-pad node list (start) + overview map & sourced note (end).
          <View style={styles.tvSplit}>
            <View style={styles.tvListColumn}>
              <GenealogyNodeList
                nodes={allNodes}
                branchOrder={branchOrder}
                selectedId={selectedId}
                highlightIds={highlightIds}
                onSelect={onSelect}
                height={tvListHeight}
              />
            </View>
            <View style={styles.tvDetailColumn}>
              {map}
              {detail}
            </View>
          </View>
        ) : split ? (
          // Desktop: map (or list) + selected-node detail side by side.
          <View style={styles.wideSplit}>
            <View style={styles.wideMapColumn}>{view === "map" ? map : list}</View>
            <View style={styles.wideDetailColumn}>{detail}</View>
          </View>
        ) : view === "map" ? (
          <>
            {map}
            {detail}
          </>
        ) : (
          <>
            {detail}
            {list}
          </>
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
  controls: { gap: Spacing.two, minWidth: 0, width: "100%" },
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
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
    justifyContent: "center",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.half,
  },
  wideSplit: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  wideMapColumn: { flex: 1, minWidth: 0 },
  wideDetailColumn: { width: 340, gap: Spacing.three },
  tvSplit: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.four,
  },
  tvListColumn: {
    width: "36%",
  },
  tvDetailColumn: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
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
  searchTitle: { marginBottom: Spacing.half },
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
    paddingStart: Spacing.twoHalf,
  },
  detailTitles: { flex: 1, minWidth: 140, gap: Spacing.half },
  note: { marginBottom: Spacing.two, paddingStart: Spacing.twoHalf },
  sources: { marginBottom: Spacing.two, paddingStart: Spacing.twoHalf },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/prophets/tree");
