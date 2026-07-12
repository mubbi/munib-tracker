export const dynamic = "force-dynamic";

import { authSessionsTable, pushTokensTable, syncRecordsTable } from "@munib-tracker/db/schema";
import { count } from "drizzle-orm";
import { RefreshCw } from "lucide-react";
import { DataTable, PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { getDb } from "@/lib/db";
import { getSyncEntityCounts } from "@/lib/queries/media";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function SyncPage() {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/sync");
  const db = getDb();
  const [sessions, tokens, syncRows, entityCounts] = await Promise.all([
    db.select({ count: count() }).from(authSessionsTable),
    db.select({ count: count() }).from(pushTokensTable),
    db.select({ count: count() }).from(syncRecordsTable),
    getSyncEntityCounts(),
  ]);

  return (
    <PageShell
      title="Sync & devices"
      moduleLabel="8"
      icon={<RefreshCw className="h-5 w-5" />}
      description="Auth sessions, push tokens, and sync record volume by entity."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Auth sessions" value={formatNumber(sessions[0]?.count ?? 0)} />
        <StatCard label="Push tokens" value={formatNumber(tokens[0]?.count ?? 0)} />
        <StatCard label="Sync records" value={formatNumber(syncRows[0]?.count ?? 0)} />
      </div>

      <SectionCard title="Records by entity">
        <DataTable
          rows={entityCounts}
          rowKey={(r) => r.entity}
          emptyMessage="No sync records"
          columns={[
            { key: "entity", header: "Entity", render: (r) => r.entity },
            { key: "count", header: "Count", render: (r) => formatNumber(r.count) },
            { key: "latest", header: "Latest update", render: (r) => formatDate(r.latest) },
          ]}
        />
      </SectionCard>

      <SectionCard title="Privacy">
        <p className="text-sm text-fg-muted">
          Sync payloads are opaque user data. This view shows aggregates only — do not browse
          individual record blobs from the admin console.
        </p>
      </SectionCard>
    </PageShell>
  );
}
