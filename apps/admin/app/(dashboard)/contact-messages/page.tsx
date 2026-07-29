export const dynamic = "force-dynamic";

import { Mail } from "lucide-react";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FILTER_CONTROL_CLASS, FilterBar, FilterField } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SearchForm } from "@/components/ui/search-form";
import { DataTable, PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { humanizeEnum } from "@/lib/display";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseDateRangeParams,
} from "@/lib/filters";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import {
  CONTACT_MESSAGE_STATUSES,
  type ContactMessageFilters,
  getContactMessageStatusCounts,
  listContactMessages,
} from "@/lib/queries/contact-messages";
import { formatDate, formatNumber } from "@/lib/utils";

type ContactMessagesPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    status?: string;
  }>;
};

function truncateMessage(message: string, max = 100): string {
  const trimmed = message.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

function statusVariant(status: string): "default" | "warning" | "brand" | "muted" {
  if (status === "new") return "warning";
  if (status === "in_progress") return "default";
  if (status === "closed") return "brand";
  return "muted";
}

export default async function ContactMessagesPage({ searchParams }: ContactMessagesPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/contact-messages");
  const params = await searchParams;
  const q = cleanParam(params.q);
  const page = parsePage(params.page);
  const { from, to, preset } = parseDateRangeParams(params);
  const status = cleanParam(params.status);

  const filters: ContactMessageFilters = { from, to, status, q };

  const filterActive = hasActiveFilters(params.period, params.from, params.to, params.status, q);

  const paginationParams = filterParamsForPagination({
    q,
    period: preset ?? cleanParam(params.period),
    from: cleanParam(params.from),
    to: cleanParam(params.to),
    status,
  });

  const [rowsPlus, statusCounts] = await Promise.all([
    listContactMessages(PAGE_SIZE + 1, pageOffset(page), filters),
    getContactMessageStatusCounts(),
  ]);
  const { rows, hasNext } = takePage(rowsPlus);

  const countByStatus = Object.fromEntries(statusCounts.map((s) => [s.status, Number(s.count)]));
  const total = statusCounts.reduce((sum, s) => sum + Number(s.count), 0);

  return (
    <PageShell
      title="Contact messages"
      moduleLabel="14"
      icon={<Mail className="h-5 w-5" />}
      description="Marketing-site contact form submissions. Add notes for context and reminders."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={formatNumber(total)} />
        <StatCard label="New" value={formatNumber(countByStatus.new ?? 0)} />
        <StatCard label="In progress" value={formatNumber(countByStatus.in_progress ?? 0)} />
        <StatCard label="Closed" value={formatNumber(countByStatus.closed ?? 0)} />
      </div>

      <SearchForm
        action="/contact-messages"
        defaultValue={q}
        placeholder="Search name, email, message…"
      />

      <FilterBar action="/contact-messages" active={filterActive} hidden={{ q }}>
        <FilterField label="Status">
          <Select name="status" defaultValue={status ?? ""} className={FILTER_CONTROL_CLASS}>
            <option value="">All statuses</option>
            {CONTACT_MESSAGE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {humanizeEnum(s)}
              </option>
            ))}
          </Select>
        </FilterField>
        <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
      </FilterBar>

      <SectionCard title="Inbox">
        <DataTable
          rows={rows}
          rowKey={(row) => row.id}
          emptyMessage="No contact messages match these filters"
          columns={[
            {
              key: "status",
              header: "Status",
              render: (row) => (
                <Badge variant={statusVariant(row.status)} dot>
                  {humanizeEnum(row.status)}
                </Badge>
              ),
            },
            {
              key: "from",
              header: "From",
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-xs text-fg-muted">{row.email}</span>
                </div>
              ),
            },
            {
              key: "message",
              header: "Message",
              render: (row) => (
                <AdminLink href={`/contact-messages/${row.id}`} className="text-sm">
                  {truncateMessage(row.message)}
                </AdminLink>
              ),
            },
            {
              key: "notes",
              header: "Notes",
              render: (row) =>
                row.adminNotes?.trim() ? (
                  <span className="text-xs text-fg-muted">
                    {truncateMessage(row.adminNotes, 60)}
                  </span>
                ) : (
                  "—"
                ),
            },
            {
              key: "created",
              header: "Received",
              render: (row) => formatDate(row.createdAt),
            },
          ]}
        />
        <Pagination
          page={page}
          hasNext={hasNext}
          basePath="/contact-messages"
          params={paginationParams}
        />
      </SectionCard>
    </PageShell>
  );
}
