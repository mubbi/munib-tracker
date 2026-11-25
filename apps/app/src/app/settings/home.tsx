import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { OrderedListEditor } from "@/components/settings/ordered-list-editor";
import { ToggleRow } from "@/components/settings/settings-rows";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  DEFAULT_QUICK_ACTION_ORDER,
  QUICK_ACTION_META,
  resolveQuickActionTint,
  TV_HIDDEN_QUICK_ACTION_IDS,
} from "@/lib/quick-actions";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { HOME_MODULES } from "@/lib/settings/home-modules";
import { useSetting } from "@/lib/settings/use-setting";

export default function HomeCustomizeScreen() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  // Both lists write through the registry (single write path, §4.5.4).
  const homeCards = useSetting<string[]>("appearance.homeCards");
  const quickActions = useSetting<string[] | undefined>("appearance.quickActions");
  const tv = isTV();
  const { isListDetail } = useLargeScreenLayout();
  const twoColumn = tv || isListDetail;

  const allActionIds = useMemo(
    () =>
      QUICK_ACTION_META.filter((a) => !(isTV() && TV_HIDDEN_QUICK_ACTION_IDS.has(a.id))).map(
        (a) => a.id,
      ),
    [],
  );

  const hidden = new Set(homeCards.value);
  const actionOrder = (quickActions.value ?? DEFAULT_QUICK_ACTION_ORDER).filter((id) =>
    allActionIds.includes(id),
  );

  const toggleModule = (id: string, visible: boolean) => {
    const next = new Set(hidden);
    if (visible) next.delete(id);
    else next.add(id);
    void homeCards.setValue([...next]);
  };

  const labelForAction = (id: string) => {
    const meta = QUICK_ACTION_META.find((a) => a.id === id);
    return meta ? t(meta.labelKey) : id;
  };

  const iconForAction = (id: string) => {
    const meta = QUICK_ACTION_META.find((a) => a.id === id);
    if (!meta) return undefined;
    return { icon: meta.icon, tint: resolveQuickActionTint(meta.tone, { colors, tokens }) };
  };

  const modulesCard = (
    <Card style={twoColumn ? styles.tvColumn : undefined}>
      <SectionHeader
        title={t("homeCustomize.modulesTitle")}
        icon={{ ios: "square.grid.2x2.fill", android: "dashboard", web: "dashboard" }}
      />
      <View style={styles.rows}>
        {HOME_MODULES.map((id) => (
          <ToggleRow
            key={id}
            title={t(`homeCustomize.module.${id}`)}
            value={!hidden.has(id)}
            onValueChange={(visible) => toggleModule(id, visible)}
          />
        ))}
      </View>
    </Card>
  );

  const actionsCard = (
    <Card style={twoColumn ? styles.tvColumn : undefined}>
      <SectionHeader
        title={t("homeCustomize.actionsTitle")}
        icon={{ ios: "square.grid.3x3.fill", android: "apps", web: "apps" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("homeCustomize.actionsHint")}
      </ThemedText>
      <OrderedListEditor
        order={actionOrder}
        allIds={allActionIds}
        labelFor={labelForAction}
        iconFor={iconForAction}
        removable
        onChange={(next) => void quickActions.setValue(next)}
      />
    </Card>
  );

  return (
    <SettingsDetailScreen
      parent="appearance"
      path="/settings/home"
      title={t("homeCustomize.title")}
      subtitle={t("homeCustomize.subtitle")}
      // Lays out its own two columns on TV / wide windows.
      wide
    >
      {twoColumn ? (
        // TV: modules beside quick actions so the landscape width is used.
        // Wide web / tablets reuse the same two columns.
        <View style={styles.tvColumns}>
          {modulesCard}
          {actionsCard}
        </View>
      ) : (
        <Stagger>
          {modulesCard}
          {actionsCard}
        </Stagger>
      )}
    </SettingsDetailScreen>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  hint: { marginTop: Spacing.two },
  tvColumns: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  tvColumn: { flex: 1, minWidth: 0 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/home");
