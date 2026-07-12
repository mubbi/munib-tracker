export const dynamic = "force-dynamic";

import { ImageIcon } from "lucide-react";
import { AdminLink } from "@/components/ui/admin-link";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { Pagination } from "@/components/ui/pagination";
import { DataTable, PageShell, StatCard } from "@/components/ui/shell";
import { deleteUserMedia } from "@/lib/actions/reports";
import { getActionContext, requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { PAGE_SIZE, pageOffset, parsePage, takePage } from "@/lib/pagination";
import { canPerformSupportActions } from "@/lib/permissions";
import { countUserMedia, listUserMedia } from "@/lib/queries/media";
import { formatBytes, formatDate, formatNumber, maskEmail } from "@/lib/utils";

type MediaPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MediaPage({ searchParams }: MediaPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/media");
  const params = await searchParams;
  const page = parsePage(params.page);
  const [rows, total] = await Promise.all([
    listUserMedia(PAGE_SIZE + 1, pageOffset(page)),
    countUserMedia(),
  ]);
  const { rows: media, hasNext } = takePage(rows, PAGE_SIZE);
  const canAct = canPerformSupportActions(session.role);

  return (
    <PageShell
      title="User media"
      moduleLabel="7"
      icon={<ImageIcon className="h-5 w-5" />}
      description="Private custom-adhkar images. Takedown removes the DB row (clean Cloudinary separately if needed)."
    >
      <StatCard label="Total media" value={formatNumber(total)} />
      <DataTable
        rows={media}
        rowKey={(m) => m.id}
        emptyMessage="No user media"
        columns={[
          {
            key: "user",
            header: "User",
            render: (m) => (
              <AdminLink href={`/users/${m.userId}`} className="text-sm">
                {m.userEmail ? maskEmail(m.userEmail) : m.userId.slice(0, 8)}
              </AdminLink>
            ),
          },
          { key: "file", header: "Filename", render: (m) => m.filename },
          { key: "mime", header: "Type", render: (m) => m.mimeType },
          { key: "size", header: "Size", render: (m) => formatBytes(m.sizeBytes) },
          { key: "created", header: "Created", render: (m) => formatDate(m.createdAt) },
          {
            key: "actions",
            header: "",
            render: (m) =>
              canAct ? (
                <form
                  action={async () => {
                    "use server";
                    const ctx = await getActionContext();
                    await deleteUserMedia(ctx, m.id);
                  }}
                >
                  <ConfirmSubmit
                    className="text-xs text-danger"
                    message="Delete this media row?"
                    confirmLabel="Delete"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              ) : null,
          },
        ]}
      />
      <Pagination page={page} hasNext={hasNext} basePath="/media" params={{}} />
    </PageShell>
  );
}
