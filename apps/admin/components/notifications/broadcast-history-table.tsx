import { adminBroadcastCategoryLabel, adminBroadcastStatusLabel } from "@munib-tracker/shared";
import { BroadcastRowActions } from "@/components/notifications/broadcast-row-actions";
import { DataTable } from "@/components/ui/shell";
import { formatBroadcastFilterSummary } from "@/lib/notifications/broadcastFilterUtils";
import type { AdminBroadcastRow } from "@/lib/queries/broadcasts";
import { formatDate, formatNumber } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-success-bg text-success ring-success-line/40",
  processing: "bg-brand-600/10 text-brand-600 ring-brand-500/20 dark:text-brand-300",
  scheduled: "bg-surface-muted text-fg ring-line/50",
  pending: "bg-surface-muted text-fg-subtle ring-line/50",
  failed: "bg-danger-bg text-danger ring-danger-line/40",
  cancelled: "bg-surface-muted text-fg-subtle ring-line/50",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}
    >
      {adminBroadcastStatusLabel(status)}
    </span>
  );
}

type BroadcastHistoryTableProps = {
  broadcasts: AdminBroadcastRow[];
};

export function BroadcastHistoryTable({ broadcasts }: BroadcastHistoryTableProps) {
  return (
    <DataTable
      rows={broadcasts}
      emptyMessage="No broadcasts yet — create one from New broadcast."
      columns={[
        { key: "id", header: "ID", render: (r) => r.id },
        {
          key: "title",
          header: "Notification",
          render: (r) => (
            <div className="min-w-[10rem] max-w-xs">
              <p className="truncate font-medium text-fg">{r.title}</p>
              {r.subtitle ? <p className="truncate text-xs text-fg-subtle">{r.subtitle}</p> : null}
            </div>
          ),
        },
        {
          key: "category",
          header: "Category",
          render: (r) => adminBroadcastCategoryLabel(r.category),
        },
        {
          key: "status",
          header: "Status",
          render: (r) => <StatusBadge status={r.status} />,
        },
        {
          key: "schedule",
          header: "Schedule",
          render: (r) => (
            <span className="text-sm capitalize text-fg-muted">
              {r.scheduleMode.replace(/_/g, " ")}
            </span>
          ),
        },
        {
          key: "reach",
          header: "Delivered",
          render: (r) => (
            <div className="text-sm tabular-nums">
              <p>
                {formatNumber(r.usersProcessed)} / {formatNumber(r.totalUsers ?? 0)} users
              </p>
              <p className="text-xs text-fg-subtle">
                {formatNumber(r.inAppSent)} in-app · {formatNumber(r.pushExpoSent + r.pushWebSent)}{" "}
                push
              </p>
            </div>
          ),
        },
        {
          key: "engagement",
          header: "Engagement",
          render: (r) => (
            <span className="text-sm tabular-nums text-fg-muted">
              {formatNumber(r.openedCount)} opened · {formatNumber(r.clickedCount)} clicked
            </span>
          ),
        },
        {
          key: "filters",
          header: "Filters",
          render: (r) => {
            const summary = formatBroadcastFilterSummary(r.filters ?? {});
            if (summary.length === 0) return <span className="text-fg-subtle">All users</span>;
            return (
              <span className="text-xs text-fg-muted" title={summary.join("\n")}>
                {summary.length} filter{summary.length === 1 ? "" : "s"}
              </span>
            );
          },
        },
        { key: "created", header: "Created", render: (r) => formatDate(r.createdAt) },
        { key: "by", header: "By", render: (r) => r.createdByEmail },
        {
          key: "actions",
          header: "",
          render: (r) => <BroadcastRowActions broadcast={r} />,
        },
      ]}
    />
  );
}
