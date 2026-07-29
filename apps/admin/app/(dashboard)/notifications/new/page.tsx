export const dynamic = "force-dynamic";

import { Bell } from "lucide-react";
import { redirect } from "next/navigation";
import { BroadcastWizard } from "@/components/notifications/broadcast-wizard";
import { NotificationsTabNav } from "@/components/notifications/notifications-tab-nav";
import { PageShell } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { countAudienceUsers } from "@/lib/notifications/broadcastAudience";
import { buildBroadcastFilterOptions } from "@/lib/notifications/broadcastFilterOptions";
import { webPushAvailable } from "@/lib/notifications/pushDelivery";
import { canSendBroadcasts } from "@/lib/permissions";
import { getDashboardMetrics } from "@/lib/queries/metrics";

export default async function NewBroadcastPage() {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/notifications");

  if (!canSendBroadcasts(session.role)) {
    redirect("/notifications/broadcasts");
  }

  const [estimatedAllUsers, dashboard] = await Promise.all([
    countAudienceUsers({ audience: "all_linked" }),
    getDashboardMetrics(),
  ]);

  const filterOptions = buildBroadcastFilterOptions({
    localeDist: dashboard.localeDist,
    platformSessions: dashboard.platformSessions,
  });

  return (
    <PageShell
      title="New broadcast"
      moduleLabel="6"
      icon={<Bell className="h-5 w-5" />}
      description="Compose, target linked users, and send in three steps."
    >
      <NotificationsTabNav activeId="new" showNewTab />

      <BroadcastWizard
        estimatedAllUsers={estimatedAllUsers}
        webPushConfigured={webPushAvailable()}
        filterOptions={filterOptions}
      />
    </PageShell>
  );
}
