export const dynamic = "force-dynamic";

import { Bell } from "lucide-react";
import { NotificationsTabNav } from "@/components/notifications/notifications-tab-nav";
import { AdminLink } from "@/components/ui/admin-link";
import { DonutChart } from "@/components/ui/charts";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FILTER_CONTROL_CLASS, FilterBar, FilterField } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { DataTable, PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { ADMIN_CRON_HTTP_BUCKETS } from "@/lib/admin-cron-buckets";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { getAdminEnv } from "@/lib/env";
import { cleanParam, hasActiveFilters, parseDateRangeParams } from "@/lib/filters";
import { canSendBroadcasts } from "@/lib/permissions";
import { listCronRuns } from "@/lib/queries/admin";
import { getNotificationStats } from "@/lib/queries/metrics";
import { formatDate, formatNumber } from "@/lib/utils";

type NotificationsOverviewPageProps = {
  searchParams: Promise<{
    period?: string;
    from?: string;
    to?: string;
    bucket?: string;
    status?: string;
  }>;
};

export default async function NotificationsOverviewPage({
  searchParams,
}: NotificationsOverviewPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/notifications");
  const params = await searchParams;
  const { from, to, preset } = parseDateRangeParams(params);
  const bucketId = cleanParam(params.bucket);
  const status = cleanParam(params.status);
  const filterActive = hasActiveFilters(
    params.period,
    params.from,
    params.to,
    params.bucket,
    params.status,
  );

  const [stats, cronRuns] = await Promise.all([
    getNotificationStats(),
    listCronRuns({ from, to, bucketId, status }),
  ]);
  const env = getAdminEnv();
  const showNew = canSendBroadcasts(session.role);

  const platformData = stats.pushByPlatform.map((r) => ({
    label: r.platform === "expo" ? "Mobile (Expo)" : r.platform,
    value: r.count,
  }));

  return (
    <PageShell
      title="Notifications"
      moduleLabel="6"
      icon={<Bell className="h-5 w-5" />}
      description="Push token inventory and broadcast cron health."
      actions={
        showNew ? (
          <AdminLink href="/notifications/new" className="text-sm font-semibold">
            New broadcast →
          </AdminLink>
        ) : null
      }
    >
      <NotificationsTabNav activeId="overview" showNewTab={showNew} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Push tokens" value={formatNumber(stats.pushTotal)} />
        <StatCard label="Open broadcasts" value={formatNumber(stats.openBroadcasts)} />
        <StatCard
          label="Cron"
          value={env.CRON_DISABLED ? "Disabled" : "Enabled"}
          hint={env.CRON_DISABLED ? "CRON_DISABLED is set" : undefined}
        />
      </div>

      <SectionCard title="Push by platform">
        <DonutChart data={platformData} centerLabel="tokens" emptyMessage="No push tokens" />
      </SectionCard>

      <FilterBar action="/notifications" active={filterActive} applyLabel="Apply">
        <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
        <FilterField label="Bucket">
          <Select name="bucket" defaultValue={bucketId ?? ""} className={FILTER_CONTROL_CLASS}>
            <option value="">Any</option>
            {ADMIN_CRON_HTTP_BUCKETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Status">
          <Select name="status" defaultValue={status ?? ""} className={FILTER_CONTROL_CLASS}>
            <option value="">Any</option>
            <option value="ok">ok</option>
            <option value="error">error</option>
          </Select>
        </FilterField>
      </FilterBar>

      <SectionCard title="Recent cron runs">
        <DataTable
          rows={cronRuns}
          rowKey={(r) => String(r.id)}
          emptyMessage="No cron runs"
          columns={[
            { key: "bucket", header: "Bucket", render: (r) => r.bucketId },
            { key: "status", header: "Status", render: (r) => r.status },
            { key: "started", header: "Started", render: (r) => formatDate(r.startedAt) },
            {
              key: "duration",
              header: "Duration",
              render: (r) => (r.durationMs != null ? `${r.durationMs}ms` : "—"),
            },
          ]}
        />
      </SectionCard>
    </PageShell>
  );
}
