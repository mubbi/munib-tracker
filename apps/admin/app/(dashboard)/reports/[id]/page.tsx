export const dynamic = "force-dynamic";

import { CONTENT_REPORT_STATUSES } from "@munib-tracker/shared/types/content-report";
import { Flag } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { DescriptionList } from "@/components/ui/description-list";
import { Select, Textarea } from "@/components/ui/input";
import { DataTable, PageShell, SectionCard } from "@/components/ui/shell";
import { triageContentReport } from "@/lib/actions/reports";
import { getActionContext, requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { canModerateReports } from "@/lib/permissions";
import { getContentReport } from "@/lib/queries/reports";
import { formatBytes, formatDate } from "@/lib/utils";

type ReportDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportDetailPage({ params }: ReportDetailProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/reports");
  const { id } = await params;
  const detail = await getContentReport(id);
  if (!detail) notFound();

  const { report, attachments } = detail;
  const canTriage = canModerateReports(session.role);

  return (
    <PageShell
      title={`Report ${report.id.slice(0, 8)}…`}
      moduleLabel="3"
      icon={<Flag className="h-5 w-5" />}
      description="Triage status, notes, and attachment evidence."
      actions={
        <AdminLink href="/reports" className="text-sm">
          ← All reports
        </AdminLink>
      }
    >
      <SectionCard title="Details">
        <DescriptionList
          items={[
            { term: "Status", description: <Badge>{report.status}</Badge> },
            { term: "Issue", description: report.issueType },
            {
              term: "User",
              description: (
                <AdminLink href={`/users/${report.userId}`} className="font-mono text-xs">
                  {report.userEmail ?? report.userId}
                </AdminLink>
              ),
            },
            { term: "Platform", description: report.platform ?? "—" },
            { term: "App version", description: report.appVersion ?? "—" },
            { term: "Created", description: formatDate(report.createdAt) },
            { term: "Resolved", description: formatDate(report.resolvedAt) },
            { term: "Description", description: report.description },
            { term: "Suggested correction", description: report.suggestedCorrection ?? "—" },
            { term: "User reference", description: report.userReference ?? "—" },
            {
              term: "Content snapshot",
              description: (
                <pre className="max-h-48 overflow-auto rounded-md bg-canvas-muted p-2 text-xs">
                  {JSON.stringify(report.content, null, 2)}
                </pre>
              ),
            },
          ]}
        />
      </SectionCard>

      {canTriage ? (
        <SectionCard title="Triage">
          <form
            className="flex flex-col gap-3"
            action={async (formData) => {
              "use server";
              const ctx = await getActionContext();
              await triageContentReport(ctx, {
                id: report.id,
                status: String(formData.get("status") ?? ""),
                adminNotes: String(formData.get("adminNotes") ?? ""),
              });
            }}
          >
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Select is a native <select> via component */}
            <label className="text-sm">
              Status
              <Select name="status" defaultValue={report.status} className="mt-1 w-full">
                {CONTENT_REPORT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </label>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Textarea is a native <textarea> via component */}
            <label className="text-sm">
              Admin notes
              <Textarea
                name="adminNotes"
                defaultValue={report.adminNotes ?? ""}
                rows={4}
                className="mt-1 w-full"
              />
            </label>
            <ConfirmSubmit message="Save triage changes?" confirmLabel="Save">
              Save triage
            </ConfirmSubmit>
          </form>
        </SectionCard>
      ) : null}

      <SectionCard title="Attachments">
        <DataTable
          rows={attachments}
          rowKey={(a) => a.id}
          emptyMessage="No attachments"
          columns={[
            { key: "filename", header: "File", render: (a) => a.filename },
            { key: "mime", header: "Type", render: (a) => a.mimeType },
            { key: "size", header: "Size", render: (a) => formatBytes(a.sizeBytes) },
            {
              key: "path",
              header: "Storage",
              render: (a) => (
                <span className="font-mono text-xs">{a.storagePath.slice(0, 48)}</span>
              ),
            },
            { key: "created", header: "Created", render: (a) => formatDate(a.createdAt) },
          ]}
        />
        <p className="mt-2 text-xs text-fg-muted">
          Attachment bytes are stored via Cloudinary or disk on the API. Open storage paths from the
          API host or Cloudinary console when investigating evidence.
        </p>
      </SectionCard>
    </PageShell>
  );
}
