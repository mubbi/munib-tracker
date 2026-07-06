import AppTabs from "@/components/app-tabs";
import { useAppQuickActions } from "@/hooks/use-app-quick-actions";
import { useWidgetSnapshotSync } from "@/hooks/use-widget-snapshot-sync";

/**
 * Home-screen app-icon quick actions (NF-1.30) and widget snapshot sync (NF-1.18).
 * Quick-action routing lives here (sub-layout) so cold-start shortcuts navigate correctly.
 */
export default function TabsLayout() {
  useAppQuickActions();
  useWidgetSnapshotSync();

  return <AppTabs />;
}
