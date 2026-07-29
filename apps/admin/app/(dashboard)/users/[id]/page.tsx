export const dynamic = "force-dynamic";

import { UserCog } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { DescriptionList } from "@/components/ui/description-list";
import { DataTable, PageShell, SectionCard, StatCard } from "@/components/ui/shell";
import {
  clearUserPushTokens,
  markAllNotificationsRead,
  revokeUserSession,
  sendTestPushToUser,
} from "@/lib/actions/support";
import { getRequestMeta, requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { canPerformSupportActions } from "@/lib/permissions";
import { getUserDetail } from "@/lib/queries/users";
import { formatDate, formatNumber, maskEmail } from "@/lib/utils";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/users");
  const { id: userId } = await params;
  if (!userId?.trim()) notFound();

  const detail = await getUserDetail(userId);
  if (!detail) notFound();

  const canAct = canPerformSupportActions(session.role);
  const meta = await getRequestMeta();

  return (
    <PageShell
      title={detail.user.displayName || detail.user.email || `User ${detail.user.id.slice(0, 8)}`}
      moduleLabel="2"
      icon={<UserCog className="h-5 w-5" />}
      description="Account, auth sessions, push tokens, and recent in-app notifications."
      actions={
        <AdminLink href="/users" className="text-sm">
          ← All users
        </AdminLink>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Account type" value={detail.user.accountType} />
        <StatCard label="Auth sessions" value={formatNumber(detail.sessions.length)} />
        <StatCard label="Push tokens" value={formatNumber(detail.pushTokens.length)} />
      </div>

      <SectionCard title="Account">
        <DescriptionList
          items={[
            {
              term: "User ID",
              description: <span className="font-mono text-xs">{detail.user.id}</span>,
            },
            { term: "Email", description: detail.user.email ? maskEmail(detail.user.email) : "—" },
            { term: "Display name", description: detail.user.displayName ?? "—" },
            { term: "Provider", description: detail.user.provider ?? "—" },
            { term: "Device ID", description: detail.user.deviceId ?? "—" },
            { term: "Created", description: formatDate(detail.user.createdAt) },
          ]}
        />
      </SectionCard>

      <SectionCard title="Auth sessions">
        <DataTable
          rows={detail.sessions}
          rowKey={(s) => s.id}
          emptyMessage="No sessions"
          columns={[
            {
              key: "id",
              header: "Session",
              render: (s) => <span className="font-mono text-xs">{s.id.slice(0, 8)}…</span>,
            },
            { key: "created", header: "Created", render: (s) => formatDate(s.createdAt) },
            {
              key: "expires",
              header: "Refresh expires",
              render: (s) => formatDate(s.refreshExpiresAt),
            },
            {
              key: "actions",
              header: "",
              render: (s) =>
                canAct ? (
                  <form
                    action={async () => {
                      "use server";
                      const ctx = { ...session, ...meta };
                      await revokeUserSession(ctx, s.id, userId);
                    }}
                  >
                    <ConfirmSubmit
                      className="text-xs text-danger"
                      message="Revoke this auth session?"
                      confirmLabel="Revoke"
                    >
                      Revoke
                    </ConfirmSubmit>
                  </form>
                ) : null,
            },
          ]}
        />
      </SectionCard>

      <SectionCard title="Push tokens">
        <DataTable
          rows={detail.pushTokens}
          rowKey={(t) => String(t.id)}
          emptyMessage="No push tokens"
          columns={[
            {
              key: "platform",
              header: "Platform",
              render: (t) => <Badge variant="muted">{t.platform}</Badge>,
            },
            { key: "client", header: "Client", render: (t) => t.clientPlatform ?? "—" },
            { key: "locale", header: "Locale", render: (t) => t.locale ?? "—" },
            { key: "device", header: "Device", render: (t) => t.deviceId ?? "—" },
          ]}
        />
        {canAct ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <form
              action={async () => {
                "use server";
                const ctx = { ...session, ...meta };
                await sendTestPushToUser(ctx, userId);
              }}
            >
              <ConfirmSubmit message="Send a delivery-test push?" confirmLabel="Send">
                Send test push
              </ConfirmSubmit>
            </form>
            <form
              action={async () => {
                "use server";
                const ctx = { ...session, ...meta };
                await clearUserPushTokens(ctx, userId);
              }}
            >
              <ConfirmSubmit message="Clear all push tokens for this user?" confirmLabel="Clear">
                Clear tokens
              </ConfirmSubmit>
            </form>
            <form
              action={async () => {
                "use server";
                const ctx = { ...session, ...meta };
                await markAllNotificationsRead(ctx, userId);
              }}
            >
              <ConfirmSubmit
                message="Mark all in-app notifications as read?"
                confirmLabel="Mark read"
              >
                Mark notifications read
              </ConfirmSubmit>
            </form>
          </div>
        ) : null}
      </SectionCard>

      <SectionCard title="Recent in-app notifications">
        <DataTable
          rows={detail.notifications}
          rowKey={(n) => String(n.id)}
          emptyMessage="No notifications"
          columns={[
            { key: "kind", header: "Kind", render: (n) => n.kind },
            { key: "title", header: "Title", render: (n) => n.title },
            { key: "created", header: "Created", render: (n) => formatDate(n.createdAt) },
            { key: "read", header: "Read", render: (n) => (n.readAt ? formatDate(n.readAt) : "—") },
          ]}
        />
      </SectionCard>
    </PageShell>
  );
}
