import type { AdminBroadcastFilters } from "@munib-tracker/shared";
import { adminBroadcastCategoryLabel } from "@munib-tracker/shared";
import type { ReactNode } from "react";
import { estimateImmediateBroadcastDuration } from "@/lib/notifications/broadcastEstimate";
import { formatBroadcastFilterSummary } from "@/lib/notifications/broadcastFilterUtils";
import { formatNumber } from "@/lib/utils";

const SCHEDULE_LABELS: Record<string, string> = {
  immediate: "Immediately",
  fixed_utc: "Fixed UTC",
  user_local: "User local time",
};

export type BroadcastSendSummaryProps = {
  totalUsers: number;
  title: string;
  body: string;
  subtitle?: string;
  category: string;
  sendInApp: boolean;
  sendPush: boolean;
  scheduleMode: string;
  scheduleDate?: string;
  scheduleTime?: string;
  linkType: string;
  filters: AdminBroadcastFilters;
  activeFilterCount: number;
};

function deliveryChannels(sendInApp: boolean, sendPush: boolean): string {
  const parts: string[] = [];
  if (sendInApp) parts.push("In-app");
  if (sendPush) parts.push("Push");
  return parts.length > 0 ? parts.join(" + ") : "None";
}

function scheduleDetail(
  scheduleMode: string,
  scheduleDate?: string,
  scheduleTime?: string,
): string | null {
  if (scheduleMode === "immediate") return null;
  if (!scheduleDate || !scheduleTime) return "Date/time required";
  const when = `${scheduleDate} ${scheduleTime}`;
  if (scheduleMode === "fixed_utc") return `${when} UTC`;
  return `${when} per user timezone`;
}

function SummaryItem({ label, value, full }: { label: string; value: ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-fg-subtle">{label}</dt>
      <dd className="mt-0.5 text-xs font-medium text-fg">{value}</dd>
    </div>
  );
}

export function BroadcastSendSummary({
  totalUsers,
  title,
  body,
  subtitle,
  category,
  sendInApp,
  sendPush,
  scheduleMode,
  scheduleDate,
  scheduleTime,
  linkType,
  filters,
  activeFilterCount,
}: BroadcastSendSummaryProps) {
  const estimate =
    scheduleMode === "immediate" ? estimateImmediateBroadcastDuration(totalUsers) : null;
  const scheduleInfo = scheduleDetail(scheduleMode, scheduleDate, scheduleTime);
  const filterLines = formatBroadcastFilterSummary(filters);

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-line bg-surface-muted/20 p-3">
      <SummaryItem label="Recipients" value={`${formatNumber(totalUsers)} users`} />
      <SummaryItem label="Delivery" value={deliveryChannels(sendInApp, sendPush)} />
      <SummaryItem label="Category" value={adminBroadcastCategoryLabel(category)} />
      <SummaryItem
        label="Schedule"
        value={
          <>
            {SCHEDULE_LABELS[scheduleMode] ?? scheduleMode}
            {scheduleInfo ? (
              <span className="mt-0.5 block text-[10px] font-normal text-fg-subtle">
                {scheduleInfo}
              </span>
            ) : null}
          </>
        }
      />
      {scheduleMode === "immediate" && estimate && estimate.batchCount > 0 ? (
        <SummaryItem label="Est. duration" value={estimate.label} />
      ) : null}
      {linkType !== "none" ? (
        <SummaryItem label="Tap action" value={<span className="capitalize">{linkType}</span>} />
      ) : null}
      <SummaryItem
        label="Message"
        full
        value={
          <span className="block space-y-0.5 font-normal">
            <span className="block font-medium">{title}</span>
            {subtitle ? <span className="block text-fg-muted">{subtitle}</span> : null}
            <span className="line-clamp-2 text-fg-subtle">{body}</span>
          </span>
        }
      />
      <SummaryItem
        label="Targeting"
        full
        value={
          activeFilterCount > 0 ? (
            <ul className="space-y-0.5 font-normal text-fg-muted">
              {filterLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            "All active users"
          )
        }
      />
    </dl>
  );
}
