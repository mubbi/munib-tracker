"use server";

import { userMediaTable } from "@munib-tracker/db/schema";
import {
  CONTENT_REPORT_STATUSES,
  type ContentReportStatus,
} from "@munib-tracker/shared/types/content-report";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "../audit";
import {
  type ActionContext,
  AdminActionValidationError,
  assertModerateReports,
  assertSupportActions,
} from "../auth/action-guards";
import { getDb } from "../db";
import { updateContentReportStatus } from "../queries/reports";

function audit(
  ctx: ActionContext,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>,
) {
  return writeAuditLog({
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

export async function triageContentReport(
  ctx: ActionContext,
  input: { id: string; status: string; adminNotes?: string },
) {
  assertModerateReports(ctx);
  const status = input.status.trim() as ContentReportStatus;
  if (!(CONTENT_REPORT_STATUSES as readonly string[]).includes(status)) {
    throw new AdminActionValidationError("Invalid report status");
  }
  const notes = input.adminNotes?.trim() ?? null;
  const updated = await updateContentReportStatus(input.id, {
    status,
    adminNotes: notes,
  });
  if (!updated) {
    throw new AdminActionValidationError("Report not found");
  }
  await audit(ctx, "triage_content_report", "content_report", input.id, { status });
  revalidatePath("/reports");
  revalidatePath(`/reports/${input.id}`);
}

export async function deleteUserMedia(ctx: ActionContext, mediaId: string) {
  assertSupportActions(ctx);
  const db = getDb();
  const [row] = await db
    .delete(userMediaTable)
    .where(eq(userMediaTable.id, mediaId))
    .returning({ id: userMediaTable.id, userId: userMediaTable.userId });
  if (!row) {
    throw new AdminActionValidationError("Media not found");
  }
  await audit(ctx, "delete_user_media", "user_media", mediaId, { userId: row.userId });
  revalidatePath("/media");
  revalidatePath(`/users/${row.userId}`);
}
