export const dynamic = "force-dynamic";

import { Pencil, Smartphone, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { Field, FormActions } from "@/components/ui/field";
import { Input, Select } from "@/components/ui/input";
import { DataTable, PageShell, SectionCard } from "@/components/ui/shell";
import { deleteAppVersion, upsertAppVersion } from "@/lib/actions/support";
import { APP_VERSION_PLATFORMS } from "@/lib/app-versions";
import { getRequestMeta, requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { canManageAppVersions } from "@/lib/permissions";
import { getAppVersions } from "@/lib/queries/metrics";
import { formatDate } from "@/lib/utils";

type VersionsPageProps = { searchParams: Promise<{ edit?: string }> };

export default async function VersionsPage({ searchParams }: VersionsPageProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/versions");
  const versions = await getAppVersions();
  const canManage = canManageAppVersions(session.role);
  const { edit } = await searchParams;
  const editing = canManage && edit ? versions.find((v) => v.platform === edit) : undefined;

  return (
    <PageShell
      title="App versions & force update"
      moduleLabel="5"
      icon={<Smartphone className="h-5 w-5" />}
      description="Per-platform latest, soft, and hard minimum versions. Soft = dismissible card; hard = blocking update."
    >
      {canManage ? (
        <SectionCard
          title={editing ? `Edit ${editing.platform}` : "Add or update a platform"}
          description="Configuration is keyed by platform — saving an existing platform overwrites it."
          action={
            editing ? (
              <Link href="/versions" className={buttonClasses("ghost", undefined, "sm")}>
                Cancel
              </Link>
            ) : undefined
          }
        >
          <form
            className="space-y-5"
            action={async (formData) => {
              "use server";
              const s = await requirePageSession();
              const m = await getRequestMeta();
              await upsertAppVersion(
                { ...s, ipAddress: m.ipAddress },
                {
                  platform: String(formData.get("platform") ?? ""),
                  latestVersion: String(formData.get("latestVersion") ?? ""),
                  minSoftVersion: String(formData.get("minSoftVersion") ?? ""),
                  minHardVersion: String(formData.get("minHardVersion") ?? ""),
                  message: String(formData.get("message") ?? ""),
                  storeUrl: String(formData.get("storeUrl") ?? ""),
                },
              );
              redirect("/versions");
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Platform" required>
                <Select name="platform" defaultValue={editing?.platform ?? "ios"} required>
                  {APP_VERSION_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Latest version" required>
                <Input
                  name="latestVersion"
                  required
                  placeholder="1.2.0"
                  defaultValue={editing?.latestVersion ?? ""}
                />
              </Field>
              <Field label="Soft min" hint="Below this: dismissible prompt" required>
                <Input
                  name="minSoftVersion"
                  required
                  placeholder="1.1.0"
                  defaultValue={editing?.minSoftVersion ?? ""}
                />
              </Field>
              <Field label="Hard min" hint="Below this: forced update" required>
                <Input
                  name="minHardVersion"
                  required
                  placeholder="1.0.0"
                  defaultValue={editing?.minHardVersion ?? ""}
                />
              </Field>
              <Field label="Store URL" className="sm:col-span-2">
                <Input
                  name="storeUrl"
                  type="url"
                  placeholder="https://…"
                  defaultValue={editing?.storeUrl ?? ""}
                />
              </Field>
              <Field label="Update message" className="sm:col-span-2">
                <Input
                  name="message"
                  placeholder="A new version is available…"
                  defaultValue={editing?.message ?? ""}
                />
              </Field>
            </div>
            <FormActions className="flex-col gap-4 sm:flex-row sm:justify-between">
              <p className="text-xs text-fg-subtle">
                Changes reach clients within ~5 min (API version cache).
              </p>
              <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                {editing ? (
                  <Link href="/versions" className={buttonClasses("secondary", undefined, "sm")}>
                    Cancel
                  </Link>
                ) : null}
                <ConfirmSubmit
                  variant="primary"
                  size="sm"
                  title="Save version requirements"
                  message="Save these version requirements? This controls soft/hard update prompts for all clients on the selected platform."
                  confirmLabel="Save"
                >
                  {editing ? "Save changes" : "Add platform"}
                </ConfirmSubmit>
              </div>
            </FormActions>
          </form>
        </SectionCard>
      ) : (
        <Alert variant="info">
          Read-only for your role. App version control requires the ops or super_admin role.
        </Alert>
      )}

      <SectionCard title="Configured versions">
        <DataTable
          rows={versions}
          emptyMessage="No app_versions rows — add one above"
          columns={[
            {
              key: "platform",
              header: "Platform",
              render: (v) => <span className="font-medium text-fg">{v.platform}</span>,
            },
            { key: "latest", header: "Latest", render: (v) => v.latestVersion },
            { key: "soft", header: "Soft min", render: (v) => v.minSoftVersion ?? "—" },
            { key: "hard", header: "Hard min", render: (v) => v.minHardVersion ?? "—" },
            { key: "message", header: "Message", render: (v) => v.message ?? "—" },
            { key: "store", header: "Store URL", render: (v) => v.storeUrl ?? "—" },
            { key: "updated", header: "Updated", render: (v) => formatDate(v.updatedAt) },
            ...(canManage
              ? [
                  {
                    key: "actions",
                    header: "Actions",
                    className: "text-right",
                    render: (v: (typeof versions)[number]) => (
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                          href={`/versions?edit=${v.platform}`}
                          className={buttonClasses("secondary", undefined, "sm")}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            const s = await requirePageSession();
                            const m = await getRequestMeta();
                            await deleteAppVersion({ ...s, ipAddress: m.ipAddress }, v.platform);
                          }}
                        >
                          <ConfirmSubmit
                            variant="danger"
                            size="sm"
                            tone="danger"
                            title="Delete version config"
                            message={`Delete the version config for "${v.platform}"? Clients on this platform get no update gate until a new row is added.`}
                            confirmLabel="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                            Delete
                          </ConfirmSubmit>
                        </form>
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </SectionCard>
    </PageShell>
  );
}
