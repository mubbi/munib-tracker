"use server";

import { cannedRepliesTable } from "@munib-tracker/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "@/lib/audit";
import {
  type ActionContext,
  AdminActionValidationError,
  assertSupportActions,
} from "@/lib/auth/action-guards";
import { getDb } from "@/lib/db";

async function audit(
  ctx: ActionContext,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>,
) {
  await writeAuditLog({
    adminUserId: ctx.adminUserId,
    adminEmail: ctx.email,
    adminRole: ctx.role,
    action,
    targetType,
    targetId,
    metadata,
    ipAddress: ctx.ipAddress,
  });
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CannedReplyInput = { slug: string; title: string; body: string; tags?: string };

type NormalizedCannedReply = { slug: string; title: string; body: string; tags: string[] };

/** Validate + normalize a canned-reply form payload (slug is the unique key). */
function normalizeCannedReply(input: CannedReplyInput): NormalizedCannedReply {
  const slug = input.slug.trim().toLowerCase().slice(0, 80);
  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 8000);
  if (!slug || !title || !body) {
    throw new AdminActionValidationError("Slug, title, and body are required");
  }
  if (!SLUG_RE.test(slug)) {
    throw new AdminActionValidationError(
      "Slug must be lowercase letters, numbers, and dashes (e.g. sync-help)",
    );
  }
  const tags = [
    ...new Set(
      (input.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  ].slice(0, 20);
  return { slug, title, body, tags };
}

function revalidate() {
  revalidatePath("/playbooks");
}

export async function createCannedReply(ctx: ActionContext, input: CannedReplyInput) {
  assertSupportActions(ctx);
  const { slug, title, body, tags } = normalizeCannedReply(input);
  const db = getDb();
  const [existing] = await db
    .select({ id: cannedRepliesTable.id })
    .from(cannedRepliesTable)
    .where(eq(cannedRepliesTable.slug, slug))
    .limit(1);
  if (existing) {
    throw new AdminActionValidationError(`Slug "${slug}" already exists`);
  }
  const [row] = await db
    .insert(cannedRepliesTable)
    .values({ slug, title, body, tags })
    .returning({ id: cannedRepliesTable.id });
  await audit(ctx, "create_canned_reply", "canned_reply", String(row.id), { slug, tags });
  revalidate();
}

export async function updateCannedReply(ctx: ActionContext, id: number, input: CannedReplyInput) {
  assertSupportActions(ctx);
  const { slug, title, body, tags } = normalizeCannedReply(input);
  const db = getDb();
  const [clash] = await db
    .select({ id: cannedRepliesTable.id })
    .from(cannedRepliesTable)
    .where(and(eq(cannedRepliesTable.slug, slug), ne(cannedRepliesTable.id, id)))
    .limit(1);
  if (clash) {
    throw new AdminActionValidationError(`Slug "${slug}" is already used by another reply`);
  }
  await db
    .update(cannedRepliesTable)
    .set({ slug, title, body, tags, updatedAt: new Date() })
    .where(eq(cannedRepliesTable.id, id));
  await audit(ctx, "update_canned_reply", "canned_reply", String(id), { slug });
  revalidate();
}

export async function deleteCannedReply(ctx: ActionContext, id: number) {
  assertSupportActions(ctx);
  const db = getDb();
  const deleted = await db
    .delete(cannedRepliesTable)
    .where(eq(cannedRepliesTable.id, id))
    .returning({ id: cannedRepliesTable.id });
  // Only audit a real deletion — a stale/duplicate submit just refreshes the list.
  if (deleted.length > 0) {
    await audit(ctx, "delete_canned_reply", "canned_reply", String(id));
  }
  revalidate();
}
