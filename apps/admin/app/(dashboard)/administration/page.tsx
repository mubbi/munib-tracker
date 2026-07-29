export const dynamic = "force-dynamic";

import { ADMIN_ROLES } from "@munib-tracker/db/schema";
import { ShieldEllipsis, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarList, DonutChart } from "@/components/ui/charts";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { DateRangeFields } from "@/components/ui/date-range-fields";
import { DescriptionList } from "@/components/ui/description-list";
import { Field, FormActions } from "@/components/ui/field";
import { FILTER_CONTROL_CLASS, FilterBar, FilterField } from "@/components/ui/filter-bar";
import { Input, Select } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { DataTable, PageShell, SectionCard } from "@/components/ui/shell";
import {
  createAdminUser,
  revokeAdminSession,
  toggleAdminUser,
  updateAdminRole,
} from "@/lib/actions/support";
import { getGoogleRedirectUri } from "@/lib/auth/google";
import { getRequestMeta, requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { humanizeEnum } from "@/lib/display";
import { getAdminEnv } from "@/lib/env";
import {
  cleanParam,
  filterParamsForPagination,
  hasActiveFilters,
  parseDateRangeParams,
  parseOptionalBool,
} from "@/lib/filters";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import { canManageAdmins } from "@/lib/permissions";
import {
  type AuditLogFilters,
  getAuditActionCounts,
  listAdminSessions,
  listAdminUsers,
  listAuditLog,
} from "@/lib/queries/admin";
import { countBy, formatDate } from "@/lib/utils";

type AdministrationPageProps = {
  searchParams: Promise<{
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    action?: string;
    actor?: string;
    targetType?: string;
    role?: string;
    enabled?: string;
    sessionPeriod?: string;
    sessionFrom?: string;
    sessionTo?: string;
  }>;
};

export default async function AdministrationPage({ searchParams }: AdministrationPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/administration");
  const params = await searchParams;
  const page = parsePage(params.page);
  const { from, to, preset } = parseDateRangeParams(params);
  const sessionRange = parseDateRangeParams({
    period: params.sessionPeriod,
    from: params.sessionFrom,
    to: params.sessionTo,
  });
  const role = cleanParam(params.role) as (typeof ADMIN_ROLES)[number] | undefined;
  const enabled = parseOptionalBool(params.enabled);
  const auditFilters: AuditLogFilters = {
    from,
    to,
    action: cleanParam(params.action),
    adminEmail: cleanParam(params.actor),
    targetType: cleanParam(params.targetType),
  };

  const auditFilterActive = hasActiveFilters(
    params.period,
    params.from,
    params.to,
    params.action,
    params.actor,
    params.targetType,
  );
  const adminFilterActive = hasActiveFilters(params.role, params.enabled);
  const sessionFilterActive = hasActiveFilters(
    params.sessionPeriod,
    params.sessionFrom,
    params.sessionTo,
  );

  const paginationParams = filterParamsForPagination({
    period: preset ?? cleanParam(params.period),
    from: cleanParam(params.from),
    to: cleanParam(params.to),
    action: params.action,
    actor: params.actor,
    targetType: params.targetType,
    role: params.role,
    enabled: params.enabled,
    sessionPeriod: sessionRange.preset ?? cleanParam(params.sessionPeriod),
    sessionFrom: cleanParam(params.sessionFrom),
    sessionTo: cleanParam(params.sessionTo),
  });

  const [admins, sessions, auditRows, auditCounts] = await Promise.all([
    listAdminUsers({ role, enabled }),
    listAdminSessions({ from: sessionRange.from, to: sessionRange.to }),
    listAuditLog(PAGE_SIZE + 1, pageOffset(page), auditFilters),
    getAuditActionCounts(auditFilters),
  ]);
  const { rows: audit, hasNext: auditHasNext } = takePage(auditRows);
  const canManage = canManageAdmins(session.role);
  const env = getAdminEnv();
  const redirectUri = getGoogleRedirectUri();

  return (
    <PageShell
      title="Administration"
      moduleLabel="11"
      icon={<ShieldEllipsis className="h-5 w-5" />}
      description="Google allowlist, roles, sessions, and audit log."
    >
      {canManage ? (
        <SectionCard
          title="Provision admin"
          description="Add a Google account to the sign-in allowlist."
        >
          <form
            className="space-y-5"
            action={async (formData) => {
              "use server";
              const s = await requirePageSession();
              const m = await getRequestMeta();
              await createAdminUser(
                { ...s, ipAddress: m.ipAddress },
                {
                  email: String(formData.get("email") ?? ""),
                  role: String(formData.get("role") ?? "support") as (typeof ADMIN_ROLES)[number],
                },
              );
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Google email" required>
                <Input name="email" type="email" required placeholder="name@company.com" />
              </Field>
              <Field label="Role">
                <Select name="role">
                  {ADMIN_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <FormActions>
              <ConfirmSubmit
                variant="primary"
                size="sm"
                title="Provision admin"
                message="Add this Google email to the admin allowlist with the selected role?"
                confirmLabel="Provision"
              >
                Provision admin
              </ConfirmSubmit>
            </FormActions>
          </form>
        </SectionCard>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Admins by role">
          <DonutChart
            data={countBy(admins, (a) => humanizeEnum(a.role))}
            centerLabel="admins"
            emptyMessage="No admins"
          />
        </SectionCard>
        <SectionCard
          title="Top audit actions"
          description="Most frequent actions across the whole audit log"
        >
          <BarList
            colorByIndex
            data={auditCounts.map((r) => ({ label: r.action, value: r.count }))}
            emptyMessage="No audit entries"
          />
        </SectionCard>
      </div>

      {canManage ? (
        <SectionCard
          title="Google OAuth client (env)"
          description="Sign-in config for admin.munibtracker.app — separate from the mobile OAuth clients."
        >
          <DescriptionList
            items={[
              {
                term: "GOOGLE_CLIENT_ID",
                description: env.GOOGLE_CLIENT_ID ? (
                  <Badge variant="brand" dot>
                    set (server)
                  </Badge>
                ) : (
                  <Badge variant="danger" dot>
                    missing
                  </Badge>
                ),
              },
              {
                term: "GOOGLE_CLIENT_SECRET",
                description: env.GOOGLE_CLIENT_SECRET ? (
                  <Badge variant="brand" dot>
                    set (server)
                  </Badge>
                ) : (
                  <Badge variant="danger" dot>
                    missing
                  </Badge>
                ),
              },
              {
                term: "Authorized redirect URI",
                description: <span className="font-mono text-xs break-all">{redirectUri}</span>,
              },
              {
                term: "Admin origin",
                description: <span className="font-mono text-xs break-all">{env.ADMIN_URL}</span>,
              },
            ]}
          />
        </SectionCard>
      ) : null}

      <SectionCard title="Admin users">
        <FilterBar action="/administration" active={adminFilterActive} applyLabel="Filter admins">
          <FilterField label="Role">
            <Select
              name="role"
              defaultValue={params.role ?? ""}
              className={FILTER_CONTROL_CLASS}
              aria-label="Admin role"
            >
              <option value="">All roles</option>
              {ADMIN_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </FilterField>
          <FilterField label="Status">
            <Select
              name="enabled"
              defaultValue={params.enabled ?? ""}
              className={FILTER_CONTROL_CLASS}
              aria-label="Enabled status"
            >
              <option value="">All</option>
              <option value="1">Enabled</option>
              <option value="0">Disabled</option>
            </Select>
          </FilterField>
        </FilterBar>
        <DataTable
          rows={admins}
          rowKey={(a) => a.id}
          columns={[
            {
              key: "email",
              header: "Email",
              render: (a) => <span className="font-medium text-fg">{a.email}</span>,
            },
            { key: "role", header: "Role", render: (a) => <Badge>{humanizeEnum(a.role)}</Badge> },
            {
              key: "enabled",
              header: "Status",
              render: (a) => (
                <Badge variant={a.enabled ? "brand" : "muted"}>
                  {a.enabled ? "enabled" : "disabled"}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (a) =>
                canManage && a.id !== session.adminUserId ? (
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <form
                      className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center"
                      action={async (formData) => {
                        "use server";
                        const s = await requirePageSession();
                        const m = await getRequestMeta();
                        await updateAdminRole(
                          { ...s, ipAddress: m.ipAddress },
                          a.id,
                          String(formData.get("role") ?? a.role) as (typeof ADMIN_ROLES)[number],
                        );
                      }}
                    >
                      <Select
                        name="role"
                        defaultValue={a.role}
                        className="w-full py-1.5 text-xs sm:w-auto"
                        aria-label={`Role for ${a.email}`}
                      >
                        {ADMIN_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Select>
                      <ConfirmSubmit
                        variant="secondary"
                        size="sm"
                        title="Change admin role"
                        message={`Update ${a.email}'s role to the role selected in the dropdown?`}
                        confirmLabel="Set role"
                      >
                        Update
                      </ConfirmSubmit>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        const s = await requirePageSession();
                        const m = await getRequestMeta();
                        await toggleAdminUser({ ...s, ipAddress: m.ipAddress }, a.id, !a.enabled);
                      }}
                    >
                      <ConfirmSubmit
                        variant={a.enabled ? "danger" : "secondary"}
                        size="sm"
                        tone={a.enabled ? "danger" : "default"}
                        title={a.enabled ? "Disable admin" : "Enable admin"}
                        message={
                          a.enabled
                            ? `Disable ${a.email}? They lose admin access immediately and active sessions stop working.`
                            : `Re-enable admin access for ${a.email}?`
                        }
                        confirmLabel={a.enabled ? "Disable" : "Enable"}
                      >
                        {a.enabled ? "Disable" : "Enable"}
                      </ConfirmSubmit>
                    </form>
                  </div>
                ) : (
                  <span className="text-fg-faint">—</span>
                ),
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Admin sessions">
        <FilterBar
          action="/administration"
          active={sessionFilterActive}
          applyLabel="Filter sessions"
        >
          <FilterField label="Period">
            <Select
              name="sessionPeriod"
              defaultValue={sessionRange.preset ?? params.sessionPeriod ?? ""}
              className={FILTER_CONTROL_CLASS}
              aria-label="Session period"
            >
              <option value="">Any last used</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </Select>
          </FilterField>
          <FilterField label="From">
            <Input
              type="date"
              name="sessionFrom"
              defaultValue={params.sessionFrom ?? ""}
              className={FILTER_CONTROL_CLASS}
              aria-label="Session from"
            />
          </FilterField>
          <FilterField label="To">
            <Input
              type="date"
              name="sessionTo"
              defaultValue={params.sessionTo ?? ""}
              className={FILTER_CONTROL_CLASS}
              aria-label="Session to"
            />
          </FilterField>
        </FilterBar>
        <DataTable
          rows={sessions}
          rowKey={(s) => s.id}
          columns={[
            { key: "email", header: "Admin", render: (s) => s.email },
            {
              key: "role",
              header: "Role",
              render: (s) => <Badge>{s.role.replace("_", " ")}</Badge>,
            },
            { key: "ip", header: "IP", render: (s) => s.ipAddress ?? "—" },
            { key: "last", header: "Last used", render: (s) => formatDate(s.lastUsedAt) },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (s) =>
                canManage && s.id !== session.sessionId ? (
                  <div className="flex justify-end">
                    <RevokeSessionButton sessionId={s.id} />
                  </div>
                ) : (
                  <span className="text-fg-faint">—</span>
                ),
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Audit log">
        <FilterBar
          action="/administration"
          active={auditFilterActive}
          applyLabel="Filter audit log"
        >
          <DateRangeFields period={preset ?? params.period} from={params.from} to={params.to} />
          <FilterField label="Action">
            <Input
              name="action"
              defaultValue={params.action ?? ""}
              placeholder="action key"
              className={FILTER_CONTROL_CLASS}
              aria-label="Action"
            />
          </FilterField>
          <FilterField label="Actor email">
            <Input
              name="actor"
              defaultValue={params.actor ?? ""}
              placeholder="admin@…"
              className={FILTER_CONTROL_CLASS}
              aria-label="Actor email"
            />
          </FilterField>
          <FilterField label="Target type">
            <Input
              name="targetType"
              defaultValue={params.targetType ?? ""}
              placeholder="user, broadcast, report…"
              className={FILTER_CONTROL_CLASS}
              aria-label="Target type"
            />
          </FilterField>
        </FilterBar>
        <DataTable
          rows={audit}
          rowKey={(r) => r.id}
          columns={[
            { key: "when", header: "When", render: (r) => formatDate(r.createdAt) },
            { key: "who", header: "Actor", render: (r) => r.adminEmail },
            {
              key: "action",
              header: "Action",
              render: (r) => <Badge variant="muted">{r.action}</Badge>,
            },
            {
              key: "target",
              header: "Target",
              render: (r) => `${r.targetType ?? ""}:${r.targetId ?? ""}`,
            },
          ]}
        />
        <Pagination
          page={page}
          hasNext={auditHasNext}
          basePath="/administration"
          params={paginationParams}
        />
      </SectionCard>
    </PageShell>
  );
}

function RevokeSessionButton({ sessionId }: { sessionId: number }) {
  return (
    <form
      action={async () => {
        "use server";
        const actor = await requirePageSession();
        const m = await getRequestMeta();
        await revokeAdminSession({ ...actor, ipAddress: m.ipAddress }, sessionId);
      }}
    >
      <ConfirmSubmit
        variant="danger"
        size="sm"
        tone="danger"
        title="Revoke admin session"
        message="Revoke this admin session? That admin will be signed out."
        confirmLabel="Revoke"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        Revoke
      </ConfirmSubmit>
    </form>
  );
}
