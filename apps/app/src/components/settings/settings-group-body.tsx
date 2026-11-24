import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, type ViewInstance } from "react-native";

import { FocusHighlight } from "@/components/ui/focus-highlight";
import { Spacing } from "@/constants/theme";
import { getPlatformCtx } from "@/lib/settings/platform";
import { isSettingResettable, isSettingVisible, sectionsForGroup } from "@/lib/settings/registry";
import { resetSection } from "@/lib/settings/reset";
import type { SettingsGroupId } from "@/lib/settings/routes";
import { ensureSettingsStoresLoaded } from "@/lib/settings/snapshot";
import type { AnySettingDef } from "@/lib/settings/types";
import { useSettingsSelector } from "@/lib/settings/use-setting";

import { NotificationsGroupHeader } from "./editors/notifications-header";
import { ResetSectionButton } from "./reset-section-button";
import { SettingRow } from "./setting-row";
import { SettingsSection } from "./settings-section";

/** Group-specific blocks above the sections (not settings themselves). */
const GROUP_HEADERS: Partial<Record<SettingsGroupId, () => React.ReactNode>> = {
  notifications: () => <NotificationsGroupHeader />,
};

/**
 * All sections of one settings group, rendered from the registry. Shared by the
 * group route (`SettingsScreen`) and the hub's master–detail pane.
 */
export function SettingsGroupBody({
  group,
  focusId,
  register,
}: {
  group: SettingsGroupId;
  /** Setting to pulse (deep link `?focus=` or a search result). */
  focusId?: string | null;
  /** `useScrollToActive().register` so the focused row scrolls into view. */
  register?: (key: string) => (node: ViewInstance | null) => void;
}) {
  const { t } = useTranslation();
  const ctx = useMemo(getPlatformCtx, []);
  const sections = useMemo(() => sectionsForGroup(group, ctx), [group, ctx]);

  useEffect(() => {
    ensureSettingsStoresLoaded();
  }, []);

  const Header = GROUP_HEADERS[group];
  return (
    <View style={styles.stack}>
      {Header ? Header() : null}
      {sections.map((section) => {
        const sectionTitle = t(section.key);
        const resettable = section.defs.some(isSettingResettable);
        return (
          <SettingsSection
            key={section.key}
            title={sectionTitle}
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
                <FocusHighlight
                  ref={register?.(def.id)}
                  active={focusId === def.id}
                  style={styles.row}
                >
                  <SettingRow def={def} />
                </FocusHighlight>
              </VisibleSetting>
            ))}
          </SettingsSection>
        );
      })}
    </View>
  );
}

/** Renders `children` only while the def's `visibleWhen` holds (re-evaluated on store changes). */
function VisibleSetting({ def, children }: { def: AnySettingDef; children: React.ReactNode }) {
  const visible = useSettingsSelector((s) => isSettingVisible(def, s));
  return visible ? children : null;
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  row: { alignSelf: "stretch" },
});
