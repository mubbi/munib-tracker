import { type Href, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, type ViewInstance } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronBack } from "@/lib/rtl";
import { getSettingsGroup, getSettingsSubgroup } from "@/lib/settings/groups";
import {
  type SettingsGroupId,
  type SettingsSubgroupId,
  settingHref,
  settingsGroupPath,
} from "@/lib/settings/routes";

import { SettingsGroupBody } from "./settings-group-body";
import { SettingsHubList } from "./settings-hub-list";

/** Width of the group list pane (the detail pane takes the rest). */
const LIST_PANE_WIDTH = 360;

/**
 * Where a list–detail selection navigates (D-UX11). The selection IS the route:
 * the hub (`/settings`) pushes the group route exactly like a phone tap, and a
 * group route swaps itself for the next group (replace), so Back always leaves
 * the group the way it does on a phone — to the hub, or to the screen that
 * deep-linked here. `focus` goes through `settingHref`, so `?focus=` rows on
 * sub-screens keep forwarding.
 */
export function useSettingsListNavigation(from: "hub" | "group") {
  const router = useRouter();
  return useCallback(
    (group: SettingsGroupId, focus?: string) => {
      const href = (focus ? settingHref(focus) : settingsGroupPath(group)) as Href;
      if (from === "hub") router.push(href);
      else router.replace(href);
    },
    [from, router],
  );
}

/**
 * Tablet / desktop settings (D-UX11): the hub list on the start side, the
 * selected group (or one of its sub-screens) on the end side. Rendered by the
 * hub and by every group route on wide windows; phones and TV never use it.
 */
export function SettingsListDetail({
  from,
  group,
  subgroup = null,
  focusId = null,
  register,
}: {
  /** Which route renders the panes — decides push (hub) vs replace (group route). */
  from: "hub" | "group";
  group: SettingsGroupId;
  subgroup?: SettingsSubgroupId | null;
  focusId?: string | null;
  register?: (key: string) => (node: ViewInstance | null) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const chevronBack = useChevronBack();
  const openGroup = useSettingsListNavigation(from);
  const meta = getSettingsGroup(group);
  const sub = subgroup ? getSettingsSubgroup(group, subgroup) : null;
  const groupTitle = t(meta.titleKey);

  return (
    <View style={styles.columns}>
      <View style={styles.listPane}>
        <SettingsHubList selected={group} onOpenGroup={openGroup} />
      </View>
      <View style={styles.detailPane}>
        <View style={styles.detailHeader}>
          {sub ? (
            <Button
              label={groupTitle}
              icon={chevronBack}
              variant="ghost"
              size="sm"
              // Same target as the header Back on a phone sub-screen.
              onPress={() => goBackOrReplace(router, settingsGroupPath(group) as Href)}
              style={styles.detailBack}
            />
          ) : null}
          <ThemedText type="subtitle" accessibilityRole="header">
            {t(sub?.titleKey ?? meta.titleKey)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(sub?.subtitleKey ?? meta.subtitleKey)}
          </ThemedText>
        </View>
        <SettingsGroupBody
          key={`${group}:${sub?.id ?? ""}`}
          group={group}
          subgroup={sub?.id ?? null}
          focusId={focusId}
          {...(register ? { register } : {})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  listPane: { width: LIST_PANE_WIDTH, maxWidth: "40%" },
  detailPane: { flex: 1, minWidth: 0, gap: Spacing.three },
  detailHeader: { gap: Spacing.half },
  detailBack: { alignSelf: "flex-start" },
});
