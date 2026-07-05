import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { QUICK_ACTION_META } from "@/lib/quick-actions";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

/** Home modules the user can hide (NF-1.21). */
const HOME_MODULES = ["continue", "knowledge", "quickActions", "qaza", "schedule"] as const;

const ALL_ACTION_IDS = QUICK_ACTION_META.map((a) => a.id);

function CustomizeList({
  order,
  allIds,
  labelFor,
  onMove,
  onToggle,
}: {
  order: string[];
  allIds: string[];
  labelFor: (id: string) => string;
  onMove: (index: number, direction: -1 | 1) => void;
  onToggle: (id: string, on: boolean) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const hiddenItems = allIds.filter((id) => !order.includes(id));

  return (
    <>
      <View style={styles.rows}>
        {order.map((id, index) => (
          <View key={id} style={[styles.row, { backgroundColor: colors.muted }]}>
            <ThemedText type="small" style={styles.rowLabel} numberOfLines={1}>
              {labelFor(id)}
            </ThemedText>
            <IconButton
              name={{
                ios: "chevron.up",
                android: "keyboard_arrow_up",
                web: "keyboard_arrow_up",
              }}
              size={18}
              tintColor={colors.foreground}
              accessibilityLabel={t("zikr.moveUp")}
              disabled={index === 0}
              onPress={() => onMove(index, -1)}
            />
            <IconButton
              name={{
                ios: "chevron.down",
                android: "keyboard_arrow_down",
                web: "keyboard_arrow_down",
              }}
              size={18}
              tintColor={colors.foreground}
              accessibilityLabel={t("zikr.moveDown")}
              disabled={index === order.length - 1}
              onPress={() => onMove(index, 1)}
            />
            <IconButton
              name={{
                ios: "minus.circle.fill",
                android: "remove_circle",
                web: "remove_circle",
              }}
              size={18}
              tintColor={tokens.status.danger.color}
              accessibilityLabel={t("homeCustomize.remove")}
              onPress={() => onToggle(id, false)}
            />
          </View>
        ))}
      </View>

      {hiddenItems.length > 0 ? (
        <>
          <ThemedText type="smallBold" style={styles.hiddenHeader}>
            {t("homeCustomize.available")}
          </ThemedText>
          <View style={styles.rows}>
            {hiddenItems.map((id) => (
              <View key={id} style={[styles.row, { backgroundColor: colors.muted }]}>
                <ThemedText
                  type="small"
                  themeColor="mutedForeground"
                  style={styles.rowLabel}
                  numberOfLines={1}
                >
                  {labelFor(id)}
                </ThemedText>
                <IconButton
                  name={{ ios: "plus.circle.fill", android: "add_circle", web: "add_circle" }}
                  size={18}
                  tintColor={colors.accent}
                  accessibilityLabel={t("homeCustomize.add")}
                  onPress={() => onToggle(id, true)}
                />
              </View>
            ))}
          </View>
        </>
      ) : null}
    </>
  );
}

export default function HomeCustomizeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  const hidden = new Set(prefs.hiddenHomeModules ?? []);
  const actionOrder = prefs.quickActionOrder ?? ALL_ACTION_IDS;

  const toggleModule = (id: string, visible: boolean) => {
    const next = new Set(hidden);
    if (visible) next.delete(id);
    else next.add(id);
    void update({ hiddenHomeModules: [...next] });
  };

  const toggleAction = (id: string, on: boolean) => {
    const next = on ? [...actionOrder, id] : actionOrder.filter((x) => x !== id);
    void update({ quickActionOrder: next });
  };

  const moveAction = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= actionOrder.length) return;
    const next = [...actionOrder];
    [next[index], next[target]] = [next[target], next[index]];
    void update({ quickActionOrder: next });
  };

  const labelForAction = (id: string) => {
    const meta = QUICK_ACTION_META.find((a) => a.id === id);
    return meta ? t(meta.labelKey) : id;
  };

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("homeCustomize.title")}
      subtitle={t("homeCustomize.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/settings"))}
    >
      <Seo path="/settings/home" />
      <Stagger>
        <Card padding="three">
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

        <Card padding="three">
          <SectionHeader
            title={t("homeCustomize.actionsTitle")}
            icon={{ ios: "square.grid.3x3.fill", android: "apps", web: "apps" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("homeCustomize.actionsHint")}
          </ThemedText>
          <CustomizeList
            order={actionOrder}
            allIds={ALL_ACTION_IDS}
            labelFor={labelForAction}
            onMove={moveAction}
            onToggle={toggleAction}
          />
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  hint: { marginTop: Spacing.two },
  hiddenHeader: { marginTop: Spacing.four },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    padding: Spacing.two + 2,
    paddingLeft: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowLabel: { flex: 1 },
});
