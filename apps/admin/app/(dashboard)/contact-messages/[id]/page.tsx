export const dynamic = "force-dynamic";

import { Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminLink } from "@/components/ui/admin-link";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { DescriptionList } from "@/components/ui/description-list";
import { Select, Textarea } from "@/components/ui/input";
import { PageShell, SectionCard } from "@/components/ui/shell";
import { triageContactMessage } from "@/lib/actions/contact-messages";
import { getActionContext, requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { humanizeEnum } from "@/lib/display";
import { canPerformSupportActions } from "@/lib/permissions";
import { CONTACT_MESSAGE_STATUSES, getContactMessage } from "@/lib/queries/contact-messages";
import { formatDate } from "@/lib/utils";

type ContactMessageDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ContactMessageDetailPage({ params }: ContactMessageDetailProps) {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/contact-messages");
  const { id } = await params;
  const message = await getContactMessage(id);
  if (!message) notFound();

  const canTriage = canPerformSupportActions(session.role);

  return (
    <PageShell
      title={`Contact ${message.id.slice(0, 8)}…`}
      moduleLabel="14"
      icon={<Mail className="h-5 w-5" />}
      description="View the submission and add internal notes for context or reminders."
      actions={
        <AdminLink href="/contact-messages" className="text-sm">
          ← All messages
        </AdminLink>
      }
    >
      <SectionCard title="Details">
        <DescriptionList
          items={[
            {
              term: "Status",
              description: <Badge>{humanizeEnum(message.status)}</Badge>,
            },
            { term: "Name", description: message.name },
            { term: "Email", description: message.email },
            { term: "Received", description: formatDate(message.createdAt) },
            { term: "Updated", description: formatDate(message.updatedAt) },
            { term: "IP", description: message.ipAddress ?? "—" },
            {
              term: "User agent",
              description: (
                <span className="break-all font-mono text-xs">{message.userAgent ?? "—"}</span>
              ),
            },
            {
              term: "Message",
              description: <p className="whitespace-pre-wrap text-sm">{message.message}</p>,
            },
            {
              term: "Admin notes",
              description: message.adminNotes?.trim() ? (
                <p className="whitespace-pre-wrap text-sm">{message.adminNotes}</p>
              ) : (
                "—"
              ),
            },
          ]}
        />
      </SectionCard>

      {canTriage ? (
        <SectionCard title="Triage & notes">
          <form
            className="flex flex-col gap-3"
            action={async (formData) => {
              "use server";
              const ctx = await getActionContext();
              await triageContactMessage(ctx, {
                id: message.id,
                status: String(formData.get("status") ?? ""),
                adminNotes: String(formData.get("adminNotes") ?? ""),
              });
            }}
          >
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Select is a native <select> via component */}
            <label className="text-sm">
              Status
              <Select name="status" defaultValue={message.status} className="mt-1 w-full">
                {CONTACT_MESSAGE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {humanizeEnum(s)}
                  </option>
                ))}
              </Select>
            </label>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: Textarea is a native <textarea> via component */}
            <label className="text-sm">
              Admin notes
              <Textarea
                name="adminNotes"
                defaultValue={message.adminNotes ?? ""}
                rows={4}
                className="mt-1 w-full"
                placeholder="Context, follow-ups, reminders…"
              />
            </label>
            <ConfirmSubmit message="Save triage changes?" confirmLabel="Save">
              Save
            </ConfirmSubmit>
          </form>
        </SectionCard>
      ) : null}
    </PageShell>
  );
}
