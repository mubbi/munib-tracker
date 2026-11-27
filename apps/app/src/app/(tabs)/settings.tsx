import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsHubList } from "@/components/settings/settings-hub-list";
import { useSettingsMasterDetail } from "@/components/settings/settings-layout";
import {
  SettingsListDetail,
  useSettingsListNavigation,
} from "@/components/settings/settings-list-detail";
import { tTv } from "@/lib/i18n/t-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { availableGroups } from "@/lib/settings/groups";
import { getPlatformCtx } from "@/lib/settings/platform";

/**
 * Settings hub (NF-3.0b §4.5.3): search, account, "Finish setting up", then the
 * five clusters of groups, each row summarising its current values.
 *
 * Tablets and wide web (D-UX11) get list–detail: the same list beside the first
 * group. Picking a group opens its route (`/settings/<group>`), which renders
 * the same two panes with that group selected — so the URL, deep links,
 * `?focus=` and Back all behave as on a phone.
 */
export default function SettingsScreen() {
  const { t } = useTranslation();
  const ctx = useMemo(getPlatformCtx, []);
  const firstGroup = useMemo(() => availableGroups(ctx)[0]?.id ?? "about", [ctx]);
  const masterDetail = useSettingsMasterDetail();
  const openGroup = useSettingsListNavigation("hub");

  return (
    <ScreenLayout
      eyebrow={t("settings.eyebrow")}
      title={t("settings.title")}
      subtitle={tTv(t, "settings.subtitle", "settings.tvSubtitle")}
    >
      <Seo path="/settings" />
      {masterDetail ? (
        <SettingsListDetail from="hub" group={firstGroup} />
      ) : (
        <SettingsHubList selected={null} onOpenGroup={openGroup} />
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(tabs)/settings");
