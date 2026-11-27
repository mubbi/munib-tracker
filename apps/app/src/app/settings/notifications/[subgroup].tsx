import { useLocalSearchParams } from "expo-router";

import { SettingsScreen } from "@/components/settings/settings-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { SETTINGS_SUBGROUPS } from "@/lib/settings/routes";

/** Static export: one page per sub-screen of Reminders & notifications. */
export function generateStaticParams(): Array<{ subgroup: string }> {
  return SETTINGS_SUBGROUPS.notifications.map((subgroup) => ({ subgroup }));
}

/**
 * Reminders & notifications › one sub-screen (Salah & Adhan, Zikr & Qur'an,
 * Fasting & seasonal, Personal & family, Daily content & app) — sections from
 * `lib/settings/groups.ts`; an unknown id bounces to the group screen.
 */
export default function NotificationSubgroupScreen() {
  const { subgroup } = useLocalSearchParams<{ subgroup?: string }>();
  const id = typeof subgroup === "string" && subgroup ? subgroup : "unknown";
  return <SettingsScreen group="notifications" subgroup={id} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/notifications/[subgroup]");
