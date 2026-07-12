"use server";

import { CONTACT_MESSAGE_STATUSES, type ContactMessageStatus } from "@munib-tracker/db/schema";
import { revalidatePath } from "next/cache";
import { writeAuditLog } from "../audit";
import {
  type ActionContext,
  AdminActionValidationError,
  assertSupportActions,
} from "../auth/action-guards";
import { updateContactMessageTriage } from "../queries/contact-messages";

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

export async function triageContactMessage(
  ctx: ActionContext,
  input: { id: string; status: string; adminNotes?: string },
) {
  assertSupportActions(ctx);
  const status = input.status.trim() as ContactMessageStatus;
  if (!(CONTACT_MESSAGE_STATUSES as readonly string[]).includes(status)) {
    throw new AdminActionValidationError("Invalid contact message status");
  }
  const notes = input.adminNotes?.trim() ?? null;
  const updated = await updateContactMessageTriage(input.id, {
    status,
    adminNotes: notes,
  });
  if (!updated) {
    throw new AdminActionValidationError("Contact message not found");
  }
  await audit(ctx, "triage_contact_message", "contact_message", input.id, { status });
  revalidatePath("/contact-messages");
  revalidatePath(`/contact-messages/${input.id}`);
}
