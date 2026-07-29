import type { CannedReply } from "@munib-tracker/db/schema";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { Field, FormActions } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/shell";
import {
  createCannedReply,
  deleteCannedReply,
  updateCannedReply,
} from "@/lib/actions/canned-replies";
import { formatActionError } from "@/lib/auth/action-guards";
import { getRequestMeta, requirePageSession } from "@/lib/auth/guards";

function tagsToText(tags: string[] | null): string {
  return tags?.join(", ") ?? "";
}

function payload(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    tags: String(formData.get("tags") ?? ""),
  };
}

/**
 * Manage reusable support responses (`canned_replies`). Read-only for roles that
 * can't act; full create/edit/delete for support + super_admin. Validation
 * errors surface via the `/playbooks?error=` banner.
 */
export function CannedRepliesManager({ rows, canAct }: { rows: CannedReply[]; canAct: boolean }) {
  return (
    <SectionCard
      title="Canned replies"
      description="Reusable support responses for content reports, sync, and push issues."
    >
      {canAct ? (
        <form
          className="space-y-5"
          action={async (formData) => {
            "use server";
            try {
              const s = await requirePageSession();
              const m = await getRequestMeta();
              await createCannedReply({ ...s, ipAddress: m.ipAddress }, payload(formData));
            } catch (error) {
              redirect(`/playbooks?error=${encodeURIComponent(formatActionError(error))}`);
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug" required hint="lowercase-kebab, unique">
              <Input name="slug" required placeholder="e.g. report-acknowledged" />
            </Field>
            <Field label="Title" required>
              <Input name="title" required placeholder="Short title" />
            </Field>
            <Field label="Tags" className="sm:col-span-2" hint="Comma-separated (optional)">
              <Input name="tags" placeholder="reports, sync, push" />
            </Field>
            <Field label="Body" required className="sm:col-span-2">
              <Textarea name="body" required placeholder="Reply text the agent will copy…" />
            </Field>
          </div>
          <FormActions>
            <ConfirmSubmit
              variant="primary"
              size="sm"
              title="Create canned reply"
              message="Add this canned reply?"
              confirmLabel="Create reply"
            >
              Create reply
            </ConfirmSubmit>
          </FormActions>
        </form>
      ) : null}

      <div className={canAct ? "mt-6 space-y-4 border-t border-line pt-6" : "space-y-4"}>
        {rows.length === 0 ? (
          <p className="text-sm text-fg-subtle">No canned replies yet.</p>
        ) : null}
        {rows.map((reply) => (
          <div
            key={reply.id}
            className="rounded-xl border border-line bg-surface-muted/30 p-4 sm:p-5"
          >
            {canAct ? (
              <>
                <form
                  className="space-y-4"
                  action={async (formData) => {
                    "use server";
                    try {
                      const s = await requirePageSession();
                      const m = await getRequestMeta();
                      await updateCannedReply(
                        { ...s, ipAddress: m.ipAddress },
                        reply.id,
                        payload(formData),
                      );
                    } catch (error) {
                      redirect(`/playbooks?error=${encodeURIComponent(formatActionError(error))}`);
                    }
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Slug" required>
                      <Input name="slug" required defaultValue={reply.slug} />
                    </Field>
                    <Field label="Title" required>
                      <Input name="title" required defaultValue={reply.title} />
                    </Field>
                    <Field label="Tags" className="sm:col-span-2">
                      <Input
                        name="tags"
                        defaultValue={tagsToText(reply.tags)}
                        placeholder="Comma-separated"
                      />
                    </Field>
                    <Field label="Body" required className="sm:col-span-2">
                      <Textarea name="body" required defaultValue={reply.body} />
                    </Field>
                  </div>
                  <FormActions>
                    <ConfirmSubmit
                      variant="secondary"
                      size="sm"
                      title="Save canned reply"
                      message="Save changes to this canned reply?"
                      confirmLabel="Save changes"
                    >
                      Save changes
                    </ConfirmSubmit>
                  </FormActions>
                </form>
                <form
                  className="mt-3 flex justify-end border-t border-line pt-3"
                  action={async () => {
                    "use server";
                    try {
                      const s = await requirePageSession();
                      const m = await getRequestMeta();
                      await deleteCannedReply({ ...s, ipAddress: m.ipAddress }, reply.id);
                    } catch (error) {
                      redirect(`/playbooks?error=${encodeURIComponent(formatActionError(error))}`);
                    }
                  }}
                >
                  <ConfirmSubmit
                    variant="danger"
                    size="sm"
                    tone="danger"
                    title="Delete canned reply"
                    message="Delete this canned reply? This cannot be undone."
                    confirmLabel="Delete"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-fg">{reply.title}</p>
                  <span className="font-mono text-xs text-fg-subtle">{reply.slug}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-fg-muted">{reply.body}</p>
                {reply.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {reply.tags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
