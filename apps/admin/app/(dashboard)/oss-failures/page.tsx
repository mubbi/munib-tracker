export const dynamic = "force-dynamic";

import { CloudOff } from "lucide-react";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { BarList, DonutChart } from "@/components/ui/charts";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FILTER_CONTROL_CLASS, FilterBar, FilterField } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { PlatformFilterField } from "@/components/ui/platform-filter-field";
import { SearchForm } from "@/components/ui/search-form";
import { DataTable, PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { humanizeEnum } from "@/lib/display";
import { OSS_CONTENT_ERROR_CODES, OSS_CONTENT_KINDS } from "@/lib/filter-options";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseClientPlatform,
  parseDateRangeParams,
} from "@/lib/filters";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import {
  getOssContentFailureStats,
  listOssContentFailures,
  type OssContentFailureFilters,
} from "@/lib/queries/oss-content-failures";
import { formatDate, formatNumber, maskEmail } from "@/lib/utils";

type OssFailuresPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    kind?: string;
    error?: string;
    provider?: string;
    platform?: string;
  }>;
};

function truncate(value: string, max = 64): string {
  const trimmed = value.trim();
  if (!trimmed) return "—";
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

export default async function OssFailuresPage({ searchParams }: OssFailuresPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/oss-failures");
  const params = await searchParams;
  const q = cleanParam(params.q);
  const page = parsePage(params.page);
  const { from, to, preset } = parseDateRangeParams(params);
  const contentKind = cleanParam(params.kind);
  const errorCode = cleanParam(params.error);
  const sourceProvider = cleanParam(params.provider);
  const platform = parseClientPlatform(params.platform);

  const filters: OssContentFailureFilters = {
    from,
    to,
    contentKind,
    errorCode,
    sourceProvider,
    platform,
    q,
  };

  const filterActive = hasActiveFilters(
    params.period,
    params.from,
    params.to,
    params.kind,
    params.error,
    params.provider,
    params.platform,
    q,
  );

  const paginationParams = filterParamsForPagination({
    q,
    period: preset ?? cleanParam(params.period),
    from: cleanParam(params.from),
    to: cleanParam(params.to),
    kind: params.kind,
    error: params.error,
    provider: params.provider,
    platform: params.platform,
  });

  const [rowsRaw, stats] = await Promise.all([
    listOssContentFailures(PAGE_SIZE + 1, pageOffset(page), filters),
    getOssContentFailureStats(filters),
  ]);
  const { rows, hasNext } = takePage(rowsRaw);

  const kindChartData = stats.byKind.map((r) => ({
    label: humanizeEnum(r.contentKind),
    value: r.count,
  }));
  const errorChartData = stats.byError.map((r) => ({
    label: humanizeEnum(r.errorCode),
    value: r.count,
  }));

  return (
    <PageShell
      title="OSS download failures"
      moduleLabel="13"
      icon={<CloudOff className="h-5 w-5" />}
      description="On-demand open-source CDN failures (Qur'an editions, hadith, fonts, audio) reported by the app — use these to find and fix broken upstream content."
    >
      <SearchForm
        action="/oss-failures"
        defaultValue={q ?? ""}
        placeholder="Search content key, URL, provider, meta, or user email…"
      />

      <FilterBar action="/oss-failures" active={filterActive} hidden={{ q }}>
        <DateRangeFields
          period={preset ?? params.period}
          from={params.from}
          to={params.to}
          anyTimeLabel="Any reported"
        />
        <FilterField label="Kind">
          <Select
            name="kind"
            defaultValue={params.kind ?? ""}
            className={FILTER_CONTROL_CLASS}
            aria-label="Content kind"
          >
            <option value="">All kinds</option>
            {OSS_CONTENT_KINDS.map((value) => (
              <option key={value} value={value}>
                {humanizeEnum(value)}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Error">
          <Select
            name="error"
            defaultValue={params.error ?? ""}
            className={FILTER_CONTROL_CLASS}
            aria-label="Error code"
          >
            <option value="">All errors</option>
            {OSS_CONTENT_ERROR_CODES.map((value) => (
              <option key={value} value={value}>
                {humanizeEnum(value)}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Provider">
          <Select
            name="provider"
            defaultValue={params.provider ?? ""}
            className={FILTER_CONTROL_CLASS}
            aria-label="Source provider"
          >
            <option value="">All providers</option>
            {stats.byProvider.map((row) => (
              <option key={row.sourceProvider} value={row.sourceProvider}>
                {row.sourceProvider} ({row.count})
              </option>
            ))}
          </Select>
        </FilterField>
        <PlatformFilterField defaultValue={params.platform} />
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Failures"
          value={formatNumber(stats.total)}
          accent="var(--chart-1)"
          hint={filterActive ? "Filtered" : "All time"}
        />
        <StatCard
          label="Top kind"
          value={stats.byKind[0] ? humanizeEnum(stats.byKind[0].contentKind) : "—"}
          accent="var(--chart-3)"
          hint={
            stats.byKind[0]
              ? `${formatNumber(stats.byKind[0].count)} report${stats.byKind[0].count === 1 ? "" : "s"}`
              : "No failures yet"
          }
        />
        <StatCard
          label="Top provider"
          value={stats.byProvider[0]?.sourceProvider ?? "—"}
          accent="var(--chart-6)"
          hint={
            stats.byProvider[0]
              ? `${formatNumber(stats.byProvider[0].count)} report${stats.byProvider[0].count === 1 ? "" : "s"}`
              : "No failures yet"
          }
        />
      </div>

      {stats.total > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="By content kind">
            <DonutChart data={kindChartData} centerLabel="failures" />
          </SectionCard>
          <SectionCard title="By error code">
            <BarList colorByIndex data={errorChartData} />
          </SectionCard>
        </div>
      ) : null}

      <SectionCard title="Recent failures">
        <DataTable
          rows={rows}
          rowKey={(row) => row.id}
          emptyMessage="No OSS download failures match these filters"
          columns={[
            {
              key: "kind",
              header: "Kind",
              render: (row) => <Badge>{humanizeEnum(row.contentKind)}</Badge>,
            },
            {
              key: "key",
              header: "Content",
              render: (row) => (
                <AdminLink href={`/oss-failures/${row.id}`} className="font-mono text-xs">
                  {truncate(row.contentKey, 48)}
                </AdminLink>
              ),
            },
            {
              key: "error",
              header: "Error",
              render: (row) => (
                <span className="text-fg">
                  {humanizeEnum(row.errorCode)}
                  {row.httpStatus != null ? ` · ${row.httpStatus}` : ""}
                </span>
              ),
            },
            {
              key: "provider",
              header: "Provider",
              render: (row) => (
                <span className="font-mono text-xs text-fg-subtle">
                  {truncate(row.sourceProvider, 28)}
                </span>
              ),
            },
            {
              key: "platform",
              header: "Platform",
              render: (row) => (
                <span className="font-mono text-xs text-fg-subtle">
                  {row.platform} · {row.appVersion}
                </span>
              ),
            },
            {
              key: "user",
              header: "User",
              render: (row) =>
                row.userId ? (
                  <AdminLink href={`/users/${row.userId}`}>{maskEmail(row.userEmail)}</AdminLink>
                ) : (
                  "—"
                ),
            },
            {
              key: "created",
              header: "Reported",
              render: (row) => formatDate(row.createdAt),
            },
          ]}
        />
        <Pagination
          page={page}
          hasNext={hasNext}
          basePath="/oss-failures"
          params={paginationParams}
        />
      </SectionCard>
    </PageShell>
  );
}
