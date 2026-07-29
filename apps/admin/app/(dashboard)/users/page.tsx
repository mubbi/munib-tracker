export const dynamic = "force-dynamic";

import { Users } from "lucide-react";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { FILTER_CONTROL_CLASS, FilterBar, FilterField } from "@/components/ui/filter-bar";
import { Select } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SearchForm } from "@/components/ui/search-form";
import { DataTable, PageShell } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseDateRangeParams,
} from "@/lib/filters";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import { searchUsersExtended } from "@/lib/queries/users";
import { formatDate, maskEmail } from "@/lib/utils";

type UsersPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    provider?: string;
    accountType?: string;
  }>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/users");
  const params = await searchParams;
  const q = params.q ?? "";
  const page = parsePage(params.page);
  const { from, to, preset } = parseDateRangeParams(params);
  const provider = cleanParam(params.provider);
  const accountTypeRaw = cleanParam(params.accountType);
  const accountType =
    accountTypeRaw === "guest" || accountTypeRaw === "user" ? accountTypeRaw : undefined;

  const filterActive = hasActiveFilters(
    params.period,
    params.from,
    params.to,
    params.provider,
    params.accountType,
  );

  const paginationParams = filterParamsForPagination({
    q,
    period: preset ?? cleanParam(params.period),
    from: cleanParam(params.from),
    to: cleanParam(params.to),
    provider,
    accountType: accountTypeRaw,
  });

  const { rows: users, hasNext } = takePage(
    await searchUsersExtended(q, PAGE_SIZE + 1, pageOffset(page), {
      from,
      to,
      provider,
      accountType,
    }),
    PAGE_SIZE,
  );

  return (
    <PageShell
      title="Users"
      moduleLabel="2"
      icon={<Users className="h-5 w-5" />}
      description="Search by email, UUID, display name, device id, provider, or account type."
    >
      <SearchForm action="/users" defaultValue={q} placeholder="Email, UUID, device id…" />
      <FilterBar action="/users" active={filterActive} applyLabel="Apply filters" hidden={{ q }}>
        <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
        <FilterField label="Account type">
          <Select
            name="accountType"
            defaultValue={accountTypeRaw ?? ""}
            className={FILTER_CONTROL_CLASS}
          >
            <option value="">Any</option>
            <option value="user">Linked</option>
            <option value="guest">Guest</option>
          </Select>
        </FilterField>
        <FilterField label="Provider">
          <Select name="provider" defaultValue={provider ?? ""} className={FILTER_CONTROL_CLASS}>
            <option value="">Any</option>
            <option value="google">Google</option>
            <option value="apple">Apple</option>
            <option value="facebook">Facebook</option>
          </Select>
        </FilterField>
      </FilterBar>

      <DataTable
        rows={users}
        rowKey={(u) => u.id}
        columns={[
          {
            key: "id",
            header: "User",
            render: (u) => (
              <AdminLink href={`/users/${u.id}`} className="font-mono text-xs">
                {u.id.slice(0, 8)}…
              </AdminLink>
            ),
          },
          {
            key: "email",
            header: "Email",
            render: (u) => (u.email ? maskEmail(u.email) : "—"),
          },
          {
            key: "name",
            header: "Name",
            render: (u) => u.displayName ?? "—",
          },
          {
            key: "type",
            header: "Type",
            render: (u) => (
              <Badge variant={u.accountType === "user" ? "brand" : "muted"}>{u.accountType}</Badge>
            ),
          },
          {
            key: "provider",
            header: "Provider",
            render: (u) => u.provider ?? "—",
          },
          {
            key: "created",
            header: "Created",
            render: (u) => formatDate(u.createdAt),
          },
        ]}
      />
      <Pagination page={page} hasNext={hasNext} basePath="/users" params={paginationParams} />
    </PageShell>
  );
}
