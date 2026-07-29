export const dynamic = "force-dynamic";

import { ShieldX } from "lucide-react";
import { BarList } from "@/components/ui/charts";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { hasActiveFilters, parseDateRangeParams } from "@/lib/filters";
import { getAbuseSignals, getAuthAbuseStats } from "@/lib/queries/metrics";
import { formatNumber } from "@/lib/utils";

type AuthAbusePageProps = {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
};

export default async function AuthAbusePage({ searchParams }: AuthAbusePageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/auth-abuse");
  const params = await searchParams;
  const { from, to, preset } = parseDateRangeParams(params);
  const filterActive = hasActiveFilters(params.period, params.from, params.to);
  const [stats, abuse] = await Promise.all([getAuthAbuseStats({ from, to }), getAbuseSignals()]);

  const byDay = stats.sessionsByDay.map((r) => ({ label: r.day, value: r.count }));

  return (
    <PageShell
      title="Auth & abuse"
      moduleLabel="9"
      icon={<ShieldX className="h-5 w-5" />}
      description="Session volume and content-report signals. IP-level abuse needs enriched auth_sessions."
    >
      <FilterBar action="/auth-abuse" active={filterActive} applyLabel="Apply">
        <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sessions (7d)" value={formatNumber(stats.sessions7d)} />
        <StatCard label="Reports (24h)" value={formatNumber(abuse.reports24h)} />
        <StatCard label="Pending reports" value={formatNumber(abuse.pendingReports)} />
        <StatCard label="Feedback (24h)" value={formatNumber(abuse.feedback24h)} />
      </div>

      <SectionCard title="Sessions by day (7d)">
        <BarList data={byDay} color="var(--chart-3)" emptyMessage="No sessions" />
      </SectionCard>

      <p className="text-sm text-fg-muted">{stats.note}</p>
    </PageShell>
  );
}
