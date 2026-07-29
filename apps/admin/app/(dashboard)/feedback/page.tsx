export const dynamic = "force-dynamic";

import { Star } from "lucide-react";
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
import { feedbackRatingVariant, humanizeEnum } from "@/lib/display";
import { APP_FEEDBACK_RATINGS, APP_FEEDBACK_TRIGGERS } from "@/lib/filter-options";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseClientPlatform,
  parseDateRangeParams,
  parseOptionalInt,
} from "@/lib/filters";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import {
  type AppFeedbackFilters,
  getAppFeedbackStats,
  listAppFeedback,
} from "@/lib/queries/feedback";
import { formatDate, formatNumber, maskEmail } from "@/lib/utils";

type FeedbackPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    rating?: string;
    platform?: string;
    trigger?: string;
  }>;
};

function truncateMessage(message: string | null, max = 120): string {
  if (!message?.trim()) return "—";
  const trimmed = message.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

export default async function FeedbackPage({ searchParams }: FeedbackPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/feedback");
  const params = await searchParams;
  const q = cleanParam(params.q);
  const page = parsePage(params.page);
  const { from, to, preset } = parseDateRangeParams(params);
  const rating = parseOptionalInt(cleanParam(params.rating));
  const platform = parseClientPlatform(params.platform);
  const triggerId = cleanParam(params.trigger);

  const filters: AppFeedbackFilters = {
    from,
    to,
    rating,
    platform,
    triggerId,
    q,
  };

  const filterActive = hasActiveFilters(
    params.period,
    params.from,
    params.to,
    params.rating,
    params.platform,
    params.trigger,
    q,
  );

  const paginationParams = filterParamsForPagination({
    q,
    period: preset ?? cleanParam(params.period),
    from: cleanParam(params.from),
    to: cleanParam(params.to),
    rating: params.rating,
    platform: params.platform,
    trigger: params.trigger,
  });

  const [feedbackRows, stats] = await Promise.all([
    listAppFeedback(PAGE_SIZE + 1, pageOffset(page), filters),
    getAppFeedbackStats(filters),
  ]);
  const { rows: feedback, hasNext } = takePage(feedbackRows);

  const ratingChartData = stats.byRating.map((r) => ({
    label: `${r.rating} star${r.rating === 1 ? "" : "s"}`,
    value: r.count,
  }));
  const triggerChartData = stats.byTrigger.map((r) => ({
    label: r.triggerId ? humanizeEnum(r.triggerId) : "(none)",
    value: r.count,
  }));

  return (
    <PageShell
      title="App feedback & reviews"
      moduleLabel="4"
      icon={<Star className="h-5 w-5" />}
      description="Low-star in-app review submissions (ratings 1–3) with optional free-text messages."
    >
      <SearchForm
        action="/feedback"
        defaultValue={q ?? ""}
        placeholder="Search message, device ID, or user email…"
      />

      <FilterBar action="/feedback" active={filterActive} hidden={{ q }}>
        <DateRangeFields
          period={preset ?? params.period}
          from={params.from}
          to={params.to}
          anyTimeLabel="Any submitted"
        />
        <FilterField label="Rating">
          <Select
            name="rating"
            defaultValue={params.rating ?? ""}
            className={FILTER_CONTROL_CLASS}
            aria-label="Rating"
          >
            <option value="">All ratings</option>
            {APP_FEEDBACK_RATINGS.map((value) => (
              <option key={value} value={value}>
                {value} star{value === 1 ? "" : "s"}
              </option>
            ))}
          </Select>
        </FilterField>
        <PlatformFilterField defaultValue={params.platform} />
        <FilterField label="Trigger">
          <Select
            name="trigger"
            defaultValue={params.trigger ?? ""}
            className={FILTER_CONTROL_CLASS}
            aria-label="Trigger"
          >
            <option value="">All triggers</option>
            {APP_FEEDBACK_TRIGGERS.map((value) => (
              <option key={value} value={value}>
                {humanizeEnum(value)}
              </option>
            ))}
          </Select>
        </FilterField>
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Submissions"
          value={formatNumber(stats.total)}
          accent="var(--chart-1)"
          hint={filterActive ? "Filtered" : "All time"}
        />
        <StatCard
          label="With message"
          value={formatNumber(stats.withMessage)}
          accent="var(--chart-3)"
          hint={
            stats.total > 0
              ? `${Math.round((stats.withMessage / stats.total) * 100)}% wrote text`
              : "No submissions yet"
          }
        />
        <StatCard
          label="Top platform"
          value={stats.byPlatform[0]?.platform ?? "—"}
          accent="var(--chart-6)"
          hint={
            stats.byPlatform[0]
              ? `${formatNumber(stats.byPlatform[0].count)} submission${stats.byPlatform[0].count === 1 ? "" : "s"}`
              : "No submissions yet"
          }
        />
      </div>

      {stats.total > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="By rating"
            description={filterActive ? "Filtered submissions" : "All submissions"}
          >
            <DonutChart data={ratingChartData} centerLabel="feedback" />
          </SectionCard>
          <SectionCard title="By trigger">
            <BarList colorByIndex data={triggerChartData} />
          </SectionCard>
        </div>
      ) : null}

      <SectionCard title="Submissions">
        <DataTable
          rows={feedback}
          rowKey={(row) => row.id}
          emptyMessage="No feedback matches these filters"
          columns={[
            {
              key: "id",
              header: "ID",
              render: (row) => <span className="font-mono text-xs text-fg-subtle">#{row.id}</span>,
            },
            {
              key: "rating",
              header: "Rating",
              render: (row) => (
                <Badge variant={feedbackRatingVariant(row.rating)} dot>
                  {row.rating}★
                </Badge>
              ),
            },
            {
              key: "message",
              header: "Message",
              render: (row) => <span className="text-fg">{truncateMessage(row.message)}</span>,
            },
            {
              key: "trigger",
              header: "Trigger",
              render: (row) => (row.triggerId ? humanizeEnum(row.triggerId) : "—"),
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
                  <span className="font-mono text-xs text-fg-subtle" title={row.deviceId}>
                    {row.deviceId.length > 16 ? `${row.deviceId.slice(0, 16)}…` : row.deviceId}
                  </span>
                ),
            },
            {
              key: "created",
              header: "Submitted",
              render: (row) => formatDate(row.createdAt),
            },
          ]}
        />
        <Pagination page={page} hasNext={hasNext} basePath="/feedback" params={paginationParams} />
      </SectionCard>
    </PageShell>
  );
}
