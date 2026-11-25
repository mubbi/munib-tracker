import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, type ViewInstance } from "react-native";

import { Card } from "@/components/ui/card";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { Spacing } from "@/constants/theme";
import {
  getSettingsGroup,
  type SettingsSubgroupMeta,
  subgroupOfSection,
} from "@/lib/settings/groups";
import { getPlatformCtx } from "@/lib/settings/platform";
import {
  isAtDefault,
  isSettingResettable,
  isSettingVisible,
  type SettingsSectionModel,
  sectionsForGroup,
} from "@/lib/settings/registry";
import { resetSection } from "@/lib/settings/reset";
import {
  type SettingsGroupId,
  type SettingsSubgroupId,
  settingsSubgroupPath,
} from "@/lib/settings/routes";
import { ensureSettingsStoresLoaded } from "@/lib/settings/snapshot";
import type { AnySettingDef, PlatformCtx } from "@/lib/settings/types";
import { useSettingsSelector } from "@/lib/settings/use-setting";

import { NotificationsGroupHeader } from "./editors/notifications-header";
import { ResetSectionButton } from "./reset-section-button";
import { SettingRow } from "./setting-row";
import { SettingsRow } from "./settings-rows";
import { SettingsSection } from "./settings-section";

/** Group-specific blocks above the sections (not settings themselves). */
const GROUP_HEADERS: Partial<Record<SettingsGroupId, () => React.ReactNode>> = {
  notifications: () => <NotificationsGroupHeader />,
};

/**
 * All sections of one settings group, rendered from the registry. Shared by the
 * group route (`SettingsScreen`) and the hub's master–detail pane.
 *
 * A split group (`subgroups` in `groups.ts`) shows its own sections (master
 * switch, upcoming preview) with one row per sub-screen after the first;
 * `subgroup` renders just that sub-screen's sections.
 */
export function SettingsGroupBody({
  group,
  subgroup = null,
  focusId,
  register,
  onOpenSubgroup,
}: {
  group: SettingsGroupId;
  /** A sub-screen of a split group; `null` = the group screen itself. */
  subgroup?: string | null;
  /** Setting to pulse (deep link `?focus=` or a search result). */
  focusId?: string | null;
  /** `useScrollToActive().register` so the focused row scrolls into view. */
  register?: (key: string) => (node: ViewInstance | null) => void;
  /** Master–detail opens a sub-screen in place; routes push it (default). */
  onOpenSubgroup?: (subgroup: SettingsSubgroupId) => void;
}) {
  const ctx = useMemo(getPlatformCtx, []);
  const meta = getSettingsGroup(group);
  const sections = useMemo(() => {
    const all = sectionsForGroup(group, ctx);
    if (!meta.subgroups) return all;
    const sub = subgroup ? meta.subgroups.find((s) => s.id === subgroup) : null;
    if (sub) return all.filter((section) => sub.sections.includes(section.key));
    return all.filter((section) => !subgroupOfSection(group, section.key));
  }, [group, ctx, meta, subgroup]);

  useEffect(() => {
    ensureSettingsStoresLoaded();
  }, []);

  const Header = subgroup ? undefined : GROUP_HEADERS[group];
  const collapsed = meta.collapsedSections;
  const subgroupLinks =
    meta.subgroups && !subgroup ? (
      <SubgroupLinks
        key="subgroups"
        group={group}
        subgroups={meta.subgroups}
        onOpen={onOpenSubgroup}
      />
    ) : null;
  return (
    <View style={styles.stack}>
      {Header ? Header() : null}
      {sections.map((section, index) => (
        <View key={section.key} style={styles.stack}>
          <GroupSection
            group={group}
            section={section}
            collapsible={collapsed?.includes(section.key) ?? false}
            focusId={focusId}
            register={register}
            ctx={ctx}
          />
          {index === 0 ? subgroupLinks : null}
        </View>
      ))}
      {sections.length === 0 ? subgroupLinks : null}
    </View>
  );
}

/** Rows opening each sub-screen of a split group (icon, title, what's inside). */
function SubgroupLinks({
  group,
  subgroups,
  onOpen,
}: {
  group: SettingsGroupId;
  subgroups: readonly SettingsSubgroupMeta[];
  onOpen?: (subgroup: SettingsSubgroupId) => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Card>
      <View style={styles.rows}>
        {subgroups.map((sub) => (
          <SettingsRow
            key={sub.id}
            icon={sub.icon}
            title={t(sub.titleKey)}
            subtitle={t(sub.subtitleKey)}
            onPress={() =>
              onOpen ? onOpen(sub.id) : router.push(settingsSubgroupPath(group, sub.id) as Href)
            }
          />
        ))}
      </View>
    </Card>
  );
}

function GroupSection({
  group,
  section,
  collapsible,
  focusId,
  register,
  ctx,
}: {
  group: SettingsGroupId;
  section: SettingsSectionModel;
  collapsible: boolean;
  focusId?: string | null;
  register?: (key: string) => (node: ViewInstance | null) => void;
  ctx: PlatformCtx;
}) {
  const { t } = useTranslation();
  const containsFocus = focusId != null && section.defs.some((def) => def.id === focusId);
  const [open, setOpen] = useState(!collapsible || containsFocus);
  // A deep link / search result into a folded section opens it.
  useEffect(() => {
    if (containsFocus) setOpen(true);
  }, [containsFocus]);
  const customised = useSettingsSelector((s) =>
    collapsible
      ? section.defs.filter((def) => isSettingResettable(def) && !isAtDefault(def, s)).length
      : 0,
  );
  const sectionTitle = t(section.key);
  const resettable = section.defs.some(isSettingResettable);
  return (
    <SettingsSection
      title={sectionTitle}
      disclosure={
        collapsible
          ? {
              open,
              onToggle: () => setOpen((value) => !value),
              summary:
                customised > 0 ? t("settingsPanel.customCount", { count: customised }) : undefined,
            }
          : undefined
      }
      action={
        resettable ? (
          <ResetSectionButton
            sectionTitle={sectionTitle}
            onReset={() => resetSection(group, section.key, ctx)}
          />
        ) : undefined
      }
    >
      {section.defs.map((def) => (
        <VisibleSetting key={def.id} def={def}>
          <FocusHighlight ref={register?.(def.id)} active={focusId === def.id} style={styles.row}>
            <SettingRow def={def} />
          </FocusHighlight>
        </VisibleSetting>
      ))}
    </SettingsSection>
  );
}

/** Renders `children` only while the def's `visibleWhen` holds (re-evaluated on store changes). */
function VisibleSetting({ def, children }: { def: AnySettingDef; children: React.ReactNode }) {
  const visible = useSettingsSelector((s) => isSettingVisible(def, s));
  return visible ? children : null;
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  rows: { gap: Spacing.two },
  row: { alignSelf: "stretch" },
});
