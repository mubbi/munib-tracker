export const dynamic = "force-dynamic";

import { Flag } from "lucide-react";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FILTER_CONTROL_CLASS, FilterBar, FilterField } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SearchForm } from "@/components/ui/search-form";
import { DataTable, PageShell, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseDateRangeParams,
} from "@/lib/filters";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import {
  countContentReports,
  getContentReportStatusCounts,
  listContentReports,
} from "@/lib/queries/reports";
import { formatDate, formatNumber } from "@/lib/utils";

type ReportsPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    status?: string;
    issueType?: string;
  }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/reports");
  const params = await searchParams;
  const q = params.q ?? "";
  const page = parsePage(params.page);
  const { from, to, preset } = parseDateRangeParams(params);
  const status = cleanParam(params.status);
  const issueType = cleanParam(params.issueType);
  const filterActive = hasActiveFilters(
    params.period,
    params.from,
    params.to,
    params.status,
    params.issueType,
  );

  const filters = { q, from, to, status, issueType };
  const [rows, total, statusCounts] = await Promise.all([
    listContentReports(PAGE_SIZE + 1, pageOffset(page), filters),
    countContentReports(filters),
    getContentReportStatusCounts(),
  ]);
  const { rows: reports, hasNext } = takePage(rows, PAGE_SIZE);
  const pending = statusCounts.find((r) => r.status === "pending")?.count ?? 0;

  return (
    <PageShell
      title="Content reports"
      moduleLabel="3"
      icon={<Flag className="h-5 w-5" />}
      description="User-submitted content issues with attachments."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Matching rows" value={formatNumber(total)} />
        <StatCard label="Pending (all)" value={formatNumber(pending)} />
      </div>

      <SearchForm action="/reports" defaultValue={q} placeholder="Description, email, report id…" />
      <FilterBar action="/reports" active={filterActive} applyLabel="Apply" hidden={{ q }}>
        <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
        <FilterField label="Status">
          <Select name="status" defaultValue={status ?? ""} className={FILTER_CONTROL_CLASS}>
            <option value="">Any</option>
            <option value="pending">pending</option>
            <option value="in_review">in_review</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="spam">spam</option>
          </Select>
        </FilterField>
      </FilterBar>

      <DataTable
        rows={reports}
        rowKey={(r) => r.id}
        columns={[
          {
            key: "id",
            header: "Report",
            render: (r) => (
              <AdminLink href={`/reports/${r.id}`} className="font-mono text-xs">
                {r.id.slice(0, 8)}…
              </AdminLink>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => <Badge variant="muted">{r.status}</Badge>,
          },
          { key: "issue", header: "Issue", render: (r) => r.issueType },
          { key: "email", header: "User", render: (r) => r.userEmail ?? r.userId.slice(0, 8) },
          { key: "created", header: "Created", render: (r) => formatDate(r.createdAt) },
        ]}
      />
      <Pagination
        page={page}
        hasNext={hasNext}
        basePath="/reports"
        params={filterParamsForPagination({
          q,
          period: preset ?? cleanParam(params.period),
          from: cleanParam(params.from),
          to: cleanParam(params.to),
          status,
          issueType,
        })}
      />
    </PageShell>
  );
}
