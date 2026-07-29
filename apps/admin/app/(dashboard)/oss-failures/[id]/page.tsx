export const dynamic = "force-dynamic";

import { CloudOff } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { DescriptionList } from "@/components/ui/description-list";
import { PageShell, SectionCard } from "@/components/ui/shell";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { humanizeEnum } from "@/lib/display";
import { getOssContentFailureById } from "@/lib/queries/oss-content-failures";
import { formatDate } from "@/lib/utils";

type OssFailureDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function OssFailureDetailPage({ params }: OssFailureDetailProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/oss-failures");
  const { id } = await params;
  const row = await getOssContentFailureById(id);
  if (!row) notFound();

  return (
    <PageShell
      title={`Failure ${row.id.slice(0, 8)}…`}
      moduleLabel="13"
      icon={<CloudOff className="h-5 w-5" />}
      description="Full identifying metadata for a failed on-demand OSS download."
      actions={
        <AdminLink href="/oss-failures" className="text-sm">
          ← All failures
        </AdminLink>
      }
    >
      <SectionCard title="Details">
        <DescriptionList
          items={[
            { term: "Kind", description: <Badge>{humanizeEnum(row.contentKind)}</Badge> },
            {
              term: "Content key",
              description: <span className="font-mono text-xs">{row.contentKey}</span>,
            },
            { term: "Error", description: humanizeEnum(row.errorCode) },
            {
              term: "HTTP status",
              description: row.httpStatus != null ? String(row.httpStatus) : "—",
            },
            { term: "Message", description: row.errorMessage },
            {
              term: "Source provider",
              description: <span className="font-mono text-xs">{row.sourceProvider}</span>,
            },
            {
              term: "Source URL",
              description: (
                <a
                  href={row.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-mono text-xs text-accent underline-offset-2 hover:underline"
                >
                  {row.sourceUrl}
                </a>
              ),
            },
            {
              term: "User",
              description: (
                <AdminLink href={`/users/${row.userId}`} className="font-mono text-xs">
                  {row.userEmail ?? row.userId}
                </AdminLink>
              ),
            },
            { term: "Platform", description: `${row.platform} · ${row.appVersion}` },
            { term: "UI locale", description: row.locale ?? "—" },
            { term: "Translation locale", description: row.translationLocale ?? "—" },
            { term: "Reported", description: formatDate(row.createdAt) },
            {
              term: "Content meta",
              description: (
                <pre className="max-h-80 overflow-auto rounded-md bg-canvas-muted p-2 text-xs">
                  {JSON.stringify(row.contentMeta, null, 2)}
                </pre>
              ),
            },
          ]}
        />
      </SectionCard>
    </PageShell>
  );
}
