import type { AdminRole } from "@munib-tracker/db/schema";
import { adminAuditLogTable } from "@munib-tracker/db/schema";
import { getDb } from "./db";

export type AuditInput = {
  adminUserId?: number | null;
  adminEmail: string;
  adminRole: AdminRole;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
};

export async function writeAuditLog(input: AuditInput): Promise<number> {
  const db = getDb();
  const [row] = await db
    .insert(adminAuditLogTable)
    .values({
      adminUserId: input.adminUserId != null && input.adminUserId > 0 ? input.adminUserId : null,
      adminEmail: input.adminEmail,
      adminRole: input.adminRole,
      action: input.action,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      metadata: input.metadata ?? null,
      ipAddress: input.ipAddress ?? null,
    })
    .returning({ id: adminAuditLogTable.id });
  return row.id;
}
