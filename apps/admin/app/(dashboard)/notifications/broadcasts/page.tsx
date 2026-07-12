export const dynamic = "force-dynamic";

import { Bell } from "lucide-react";
import { BroadcastHistoryTable } from "@/components/notifications/broadcast-history-table";
import { NotificationsTabNav } from "@/components/notifications/notifications-tab-nav";
import { Alert } from "@/components/ui/alert";
import { PageShell, SectionCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { canSendBroadcasts } from "@/lib/permissions";
import { listAdminBroadcasts } from "@/lib/queries/broadcasts";

export default async function NotificationsBroadcastsPage() {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/notifications");

  const broadcasts = await listAdminBroadcasts(50);
  const canBroadcast = canSendBroadcasts(session.role);

  return (
    <PageShell
      title="Broadcast history"
      moduleLabel="6"
      icon={<Bell className="h-5 w-5" />}
      description="Admin-initiated in-app and push broadcasts with delivery and engagement stats."
    >
      <NotificationsTabNav activeId="broadcasts" showNewTab={canBroadcast} />

      {!canBroadcast ? (
        <Alert variant="info">
          Broadcast sending requires the super_admin, ops, or content role. You can view history
          below.
        </Alert>
      ) : null}

      <SectionCard
        title="All broadcasts"
        description="Newest first — opens and clicks tracked via in-app engagement"
      >
        <BroadcastHistoryTable broadcasts={broadcasts} />
      </SectionCard>
    </PageShell>
  );
}
