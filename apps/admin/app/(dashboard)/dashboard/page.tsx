export const dynamic = "force-dynamic";

import {
  Activity,
  Bell,
  CalendarDays,
  Flag,
  LayoutDashboard,
  MessageSquare,
  Smartphone,
  UserPlus,
  Users,
} from "lucide-react";
import { AdminLink } from "@/components/ui/admin-link";
import { Alert } from "@/components/ui/alert";
import { BarList, DonutChart } from "@/components/ui/charts";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FilterBar } from "@/components/ui/filter-bar";
import { PlatformFilterField } from "@/components/ui/platform-filter-field";
import { PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { getAdminEnv } from "@/lib/env";
import { clientPlatformLabel } from "@/lib/filter-options";
import { hasActiveFilters, parseClientPlatform, parseDateRangeParams } from "@/lib/filters";
import { getDashboardAlertSignals, getDashboardMetrics } from "@/lib/queries/metrics";
import { formatDate, formatNumber } from "@/lib/utils";

type DashboardPageProps = {
  searchParams: Promise<{ period?: string; from?: string; to?: string; platform?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/dashboard");
  const params = await searchParams;
  const { from, to, preset } = parseDateRangeParams(params);
  const platform = parseClientPlatform(params.platform);
  const filterActive = hasActiveFilters(params.period, params.from, params.to, params.platform);
  const [metrics, alertSignals] = await Promise.all([
    getDashboardMetrics({ from, to, platform }),
    getDashboardAlertSignals(),
  ]);
  const env = getAdminEnv();

  const reportSpike =
    alertSignals.reports24h >= 10 &&
    alertSignals.reports24h > ((alertSignals.reports7d - alertSignals.reports24h) / 6) * 3;
  const cronStalled =
    !env.CRON_DISABLED &&
    alertSignals.cronAgeMs != null &&
    alertSignals.cronAgeMs > 26 * 60 * 60 * 1000;

  const providerData = metrics.signupsByProvider.map((r) => ({
    label: r.provider,
    value: Number(r.count),
  }));
  const platformData = metrics.platformSessions.map((r) => ({
    label: r.platform ?? "unknown",
    value: Number(r.count),
  }));
  const localeData = metrics.localeDist.map((r) => ({ label: r.label, value: r.count }));
  const accountMix = [
    { label: "Linked", value: metrics.linkedUsers },
    { label: "Guest", value: metrics.guestUsers },
  ];

  return (
    <PageShell
      title="Executive dashboard"
      moduleLabel="1"
      icon={<LayoutDashboard className="h-5 w-5" />}
      description={
        platform
          ? `Munib product health for ${clientPlatformLabel(platform)}.`
          : "Munib product health — users, reports, feedback, and broadcasts."
      }
    >
      <FilterBar action="/dashboard" active={filterActive} applyLabel="Apply filters">
        <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
        <PlatformFilterField defaultValue={params.platform} />
      </FilterBar>

      {metrics.periodSignups !== undefined ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Sign-ups in period"
            value={formatNumber(metrics.periodSignups)}
            icon={<UserPlus className="h-4 w-4" />}
            accent="var(--chart-1)"
          />
          <StatCard
            label="Active users in period"
            value={formatNumber(metrics.periodActiveUsers ?? 0)}
            icon={<Activity className="h-4 w-4" />}
            accent="var(--chart-3)"
            hint="Distinct users with auth sessions"
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={formatNumber(metrics.totalUsers)}
          icon={<Users className="h-4 w-4" />}
          accent="var(--chart-1)"
          hint={`${formatNumber(metrics.linkedUsers)} linked · ${formatNumber(metrics.guestUsers)} guest`}
        />
        <StatCard
          label="DAU (session proxy)"
          value={formatNumber(metrics.dau)}
          icon={<Activity className="h-4 w-4" />}
          accent="var(--chart-3)"
          hint="auth_sessions.createdAt"
        />
        <StatCard
          label="WAU / MAU"
          value={`${formatNumber(metrics.wau)} / ${formatNumber(metrics.mau)}`}
          icon={<CalendarDays className="h-4 w-4" />}
          accent="var(--chart-6)"
        />
        <StatCard
          label="Sign-ups 7d / 30d"
          value={`${formatNumber(metrics.signups7d)} / ${formatNumber(metrics.signups30d)}`}
          icon={<UserPlus className="h-4 w-4" />}
          accent="var(--chart-2)"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending content reports"
          value={formatNumber(metrics.pendingContentReports)}
          icon={<Flag className="h-4 w-4" />}
          accent="var(--chart-5)"
        />
        <StatCard
          label="Feedback 7d / 30d"
          value={`${formatNumber(metrics.feedback7d)} / ${formatNumber(metrics.feedback30d)}`}
          icon={<MessageSquare className="h-4 w-4" />}
          accent="var(--chart-4)"
        />
        <StatCard
          label="Open / processing broadcasts"
          value={`${formatNumber(metrics.openBroadcasts)} / ${formatNumber(metrics.processingBroadcasts)}`}
          icon={<Bell className="h-4 w-4" />}
          accent="var(--chart-3)"
        />
        <StatCard
          label="App version rows"
          value={formatNumber(metrics.appVersionRows)}
          icon={<Smartphone className="h-4 w-4" />}
          accent="var(--chart-2)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Account mix" description="Guest vs linked">
          <DonutChart data={accountMix} centerLabel="users" emptyMessage="No users" />
        </SectionCard>
        <SectionCard title="Sign-ups by provider" description="Linked accounts only">
          <DonutChart data={providerData} centerLabel="identities" emptyMessage="No providers" />
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Push locales" description="From push_tokens.locale">
          <BarList
            data={localeData}
            maxRows={10}
            color="var(--chart-2)"
            emptyMessage="No locale data"
          />
        </SectionCard>
        <SectionCard
          title="Client platforms"
          description="Distinct users by push_tokens.clientPlatform"
        >
          <DonutChart data={platformData} centerLabel="users" emptyMessage="No platform data" />
        </SectionCard>
      </div>

      {env.CRON_DISABLED ? (
        <Alert variant="warning">
          CRON_DISABLED is set — scheduled broadcast jobs are not running.
        </Alert>
      ) : null}
      {reportSpike ? (
        <Alert variant="warning">
          Content report spike: {formatNumber(alertSignals.reports24h)} in the last 24h (
          {formatNumber(alertSignals.pendingReports)} pending).{" "}
          <AdminLink href="/reports">Review reports →</AdminLink>
        </Alert>
      ) : null}
      {cronStalled ? (
        <Alert variant="warning">
          No cron run recorded in over 26h
          {alertSignals.latestCronRunAt
            ? ` (last: ${formatDate(alertSignals.latestCronRunAt)})`
            : ""}{" "}
          — scheduled jobs may be stalled.{" "}
          <AdminLink href="/notifications">Cron history →</AdminLink>
        </Alert>
      ) : null}

      <p className="text-sm text-fg-subtle">
        Quick links: <AdminLink href="/users">Users</AdminLink>
        {" · "}
        <AdminLink href="/reports">Reports</AdminLink>
        {" · "}
        <AdminLink href="/feedback">Feedback</AdminLink>
        {" · "}
        <AdminLink href="/notifications">Notifications</AdminLink>
      </p>
    </PageShell>
  );
}
