import AppTabs from "@/components/app-tabs";
import { useAppQuickActions } from "@/hooks/use-app-quick-actions";
import { useWidgetSnapshotSync } from "@/hooks/use-widget-snapshot-sync";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { isTV } from "@/lib/platform/is-tv";

/**
 * Home-screen app-icon quick actions (NF-1.30) and widget snapshot sync (NF-1.18).
 * Quick-action routing lives here (sub-layout) so cold-start shortcuts navigate correctly.
 * Skipped on TV — no home-screen widgets / icon shortcuts on Apple TV / Android TV.
 */
export default function TabsLayout() {
  const tv = isTV();
  // Any tab (incl. /tracker from prayer notifications) counts as first paint.
  useMarkColdStartReady();
  useAppQuickActions(!tv);
  useWidgetSnapshotSync(!tv);

  return <AppTabs />;
}
