export const dynamic = "force-dynamic";

import { Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DescriptionList } from "@/components/ui/description-list";
import { PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { fetchApiHealth } from "@/lib/platform";
import { getMigrationJournalStatus } from "@/lib/queries/metrics";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function PlatformPage() {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/platform");
  const [health, migrations] = await Promise.all([fetchApiHealth(), getMigrationJournalStatus()]);
  const redis = health.redis;

  return (
    <PageShell
      title="Platform"
      moduleLabel="10"
      icon={<Server className="h-5 w-5" />}
      description="Nest API liveness (`/api/v1/health`), Redis status, and TypeORM migration status."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="API health"
          value={health.ok ? "OK" : "FAIL"}
          accent={health.ok ? "var(--chart-1)" : "var(--chart-5)"}
          hint={health.status ? `HTTP ${health.status}` : health.error}
        />
        <StatCard
          label="Redis"
          value={
            redis
              ? redis.connected
                ? "Connected"
                : redis.configured
                  ? "Down"
                  : "Not configured"
              : "Unknown"
          }
          accent={
            redis?.connected
              ? "var(--chart-1)"
              : redis?.configured
                ? "var(--chart-5)"
                : "var(--chart-4)"
          }
          hint={redis?.configured ? `${redis.connectAttempts ?? 0} connect attempts` : undefined}
        />
        <StatCard
          label="Applied migrations"
          value={migrations ? formatNumber(migrations.applied) : "—"}
          hint={
            migrations?.latestAt
              ? `Latest ${formatDate(migrations.latestAt)}`
              : "migrations table unavailable"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Redis"
          action={
            <Badge
              variant={redis?.connected ? "brand" : redis?.configured ? "danger" : "muted"}
              dot
            >
              {redis?.connected ? "Connected" : redis?.configured ? "Down" : "Not configured"}
            </Badge>
          }
        >
          {redis ? (
            <DescriptionList
              items={[
                { term: "Configured", description: redis.configured ? "yes" : "no" },
                { term: "Connected", description: redis.connected ? "yes" : "no" },
                {
                  term: "Connect attempts",
                  description: formatNumber(redis.connectAttempts ?? 0),
                },
                {
                  term: "Last connected",
                  description: redis.lastConnectedAt ? formatDate(redis.lastConnectedAt) : "—",
                },
                {
                  term: "Last error",
                  description: redis.lastErrorAt ? formatDate(redis.lastErrorAt) : "none",
                },
              ]}
            />
          ) : (
            <p className="text-sm text-fg-subtle">
              Health endpoint did not return a parseable Redis snapshot.
            </p>
          )}
        </SectionCard>

        <SectionCard title="API details">
          <DescriptionList
            items={[
              { term: "Status", description: health.ok ? "Healthy" : "Unhealthy" },
              { term: "Service", description: health.service ?? "—" },
              { term: "HTTP", description: health.status != null ? String(health.status) : "—" },
              { term: "Timestamp", description: health.timestamp ?? "—" },
              { term: "Error", description: health.error ?? "—" },
            ]}
          />
        </SectionCard>
      </div>
    </PageShell>
  );
}
