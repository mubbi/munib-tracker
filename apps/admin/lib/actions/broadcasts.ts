"use server";

import {
  ADMIN_BROADCAST_CATEGORIES,
  type AdminBroadcastFilters,
  adminBroadcastsTable,
} from "@munib-tracker/db/schema";
import {
  ADMIN_BROADCAST_BODY_MAX,
  ADMIN_BROADCAST_INTERNAL_SCREENS,
  ADMIN_BROADCAST_LINK_TYPES,
  ADMIN_BROADCAST_PLATFORMS,
  ADMIN_BROADCAST_SCHEDULE_MODES,
  ADMIN_BROADCAST_SUBTITLE_MAX,
  ADMIN_BROADCAST_TITLE_MAX,
} from "@munib-tracker/shared/admin-broadcasts";
import { APP_LOCALE_CODES } from "@munib-tracker/shared/i18n";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeAuditLog } from "@/lib/audit";
import {
  AdminActionForbiddenError,
  AdminActionValidationError,
  assertBroadcastActions,
} from "@/lib/auth/action-guards";
import { getActionContext } from "@/lib/auth/guards";
import { getDb } from "@/lib/db";
import {
  countAudienceUsers,
  normalizeBroadcastFilters,
} from "@/lib/notifications/broadcastAudience";
import {
  buildBroadcastRouteData,
  parseScheduledWallClock,
  validateBroadcastLink,
} from "@/lib/notifications/broadcastRouteData";

const filtersSchema = z.object({
  locales: z
    .array(z.string().trim().min(2).max(10))
    .optional()
    .refine(
      (values) =>
        !values || values.every((v) => (APP_LOCALE_CODES as readonly string[]).includes(v)),
      "Invalid locale code",
    ),
  activeWithinDays: z.number().int().min(1).max(365).optional(),
  inactiveForDays: z.number().int().min(1).max(365).optional(),
  platforms: z.array(z.enum(ADMIN_BROADCAST_PLATFORMS)).optional(),
});

const createBroadcastSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(ADMIN_BROADCAST_TITLE_MAX),
  body: z.string().trim().min(1, "Body is required").max(ADMIN_BROADCAST_BODY_MAX),
  subtitle: z.string().trim().max(ADMIN_BROADCAST_SUBTITLE_MAX).optional(),
  category: z.enum(ADMIN_BROADCAST_CATEGORIES),
  sendInApp: z.boolean(),
  sendPush: z.boolean(),
  scheduleMode: z.enum(ADMIN_BROADCAST_SCHEDULE_MODES),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  linkType: z.enum(ADMIN_BROADCAST_LINK_TYPES),
  internalScreen: z.enum(ADMIN_BROADCAST_INTERNAL_SCREENS).optional(),
  externalUrl: z.string().trim().optional(),
  filters: filtersSchema.optional(),
});

export type CreateBroadcastInput = z.infer<typeof createBroadcastSchema>;

export async function createAdminBroadcast(
  raw: CreateBroadcastInput,
): Promise<{ broadcastId: number; totalUsers: number; scheduled: boolean }> {
  const ctx = await getActionContext();
  assertBroadcastActions(ctx);

  const parsed = createBroadcastSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid broadcast input";
    throw new AdminActionValidationError(first);
  }

  const input = parsed.data;
  if (!input.sendInApp && !input.sendPush) {
    throw new AdminActionValidationError("Enable at least one of in-app or push delivery");
  }

  validateBroadcastLink(input.linkType, input.internalScreen, input.externalUrl);

  const audience = "all_linked" as const;
  const filters = normalizeBroadcastFilters(input.filters ?? {});

  let scheduledAt: Date | null = null;
  let scheduledWallClock = null;
  if (input.scheduleMode !== "immediate") {
    if (!input.scheduleDate?.trim() || !input.scheduleTime?.trim()) {
      throw new AdminActionValidationError("Schedule date and time are required");
    }
    const parsedSchedule = parseScheduledWallClock(
      input.scheduleMode,
      input.scheduleDate,
      input.scheduleTime,
    );
    scheduledAt = parsedSchedule.scheduledAt;
    scheduledWallClock = parsedSchedule.scheduledWallClock;
  }

  const totalUsers = await countAudienceUsers({ audience, filters });
  if (totalUsers === 0) {
    throw new AdminActionValidationError("No users match the selected filters");
  }

  const db = getDb();
  const [row] = await db
    .insert(adminBroadcastsTable)
    .values({
      status: input.scheduleMode === "immediate" ? "pending" : "scheduled",
      category: input.category,
      audience,
      title: input.title,
      body: input.body,
      subtitle: input.subtitle?.trim() ? input.subtitle.trim() : null,
      routeData: null,
      filters,
      scheduleMode: input.scheduleMode,
      scheduledAt,
      scheduledWallClock,
      linkType: input.linkType,
      externalUrl: input.linkType === "external" ? (input.externalUrl?.trim() ?? null) : null,
      sendInApp: input.sendInApp,
      sendPush: input.sendPush,
      dedupeKeyPrefix: "admin-broadcast-pending",
      cursorUserId: "",
      totalUsers,
      createdByAdminId: ctx.adminUserId,
      createdByEmail: ctx.email,
    })
    .returning({ id: adminBroadcastsTable.id });

  const broadcastId = row.id;
  const dedupeKeyPrefix = `admin-broadcast-${broadcastId}`;
  const routeData = buildBroadcastRouteData({
    broadcastId,
    linkType: input.linkType,
    internalScreen: input.internalScreen,
    externalUrl: input.externalUrl,
  });

  await db
    .update(adminBroadcastsTable)
    .set({ dedupeKeyPrefix, routeData })
    .where(eq(adminBroadcastsTable.id, broadcastId));

  await writeAuditLog({
    adminUserId: ctx.adminUserId,
    adminEmail: ctx.email,
    adminRole: ctx.role,
    action: "create_admin_broadcast",
    targetType: "admin_broadcast",
    targetId: String(broadcastId),
    metadata: {
      category: input.category,
      audience,
      filters,
      scheduleMode: input.scheduleMode,
      sendInApp: input.sendInApp,
      sendPush: input.sendPush,
      totalUsers,
      title: input.title,
    },
    ipAddress: ctx.ipAddress,
  });

  revalidatePath("/notifications");
  revalidatePath("/notifications/broadcasts");
  return {
    broadcastId,
    totalUsers,
    scheduled: input.scheduleMode !== "immediate",
  };
}

export async function previewBroadcastAudience(input: {
  filters?: AdminBroadcastFilters;
}): Promise<{ totalUsers: number }> {
  const ctx = await getActionContext();
  assertBroadcastActions(ctx);
  const filters = normalizeBroadcastFilters(input.filters ?? {});
  const totalUsers = await countAudienceUsers({ audience: "all_linked", filters });
  return { totalUsers };
}

const RESUMABLE_STATUSES = new Set(["failed", "processing", "pending"]);
const CANCELLABLE_STATUSES = new Set(["pending", "scheduled", "processing"]);

export async function cancelAdminBroadcast(broadcastId: number): Promise<void> {
  const ctx = await getActionContext();
  assertBroadcastActions(ctx);

  const db = getDb();
  const [row] = await db
    .select({ id: adminBroadcastsTable.id, status: adminBroadcastsTable.status })
    .from(adminBroadcastsTable)
    .where(eq(adminBroadcastsTable.id, broadcastId))
    .limit(1);

  if (!row) throw new AdminActionValidationError("Broadcast not found");
  if (!CANCELLABLE_STATUSES.has(row.status)) {
    throw new AdminActionValidationError(`Cannot cancel a broadcast with status "${row.status}"`);
  }

  await db
    .update(adminBroadcastsTable)
    .set({ status: "cancelled", completedAt: new Date(), errorMessage: null })
    .where(eq(adminBroadcastsTable.id, broadcastId));

  await writeAuditLog({
    adminUserId: ctx.adminUserId,
    adminEmail: ctx.email,
    adminRole: ctx.role,
    action: "cancel_admin_broadcast",
    targetType: "admin_broadcast",
    targetId: String(broadcastId),
    metadata: { previousStatus: row.status },
    ipAddress: ctx.ipAddress,
  });

  revalidatePath("/notifications/broadcasts");
}

export async function resumeAdminBroadcast(broadcastId: number): Promise<void> {
  const ctx = await getActionContext();
  assertBroadcastActions(ctx);

  const db = getDb();
  const [row] = await db
    .select()
    .from(adminBroadcastsTable)
    .where(eq(adminBroadcastsTable.id, broadcastId))
    .limit(1);

  if (!row) throw new AdminActionValidationError("Broadcast not found");
  if (row.status === "completed" || row.status === "cancelled") {
    throw new AdminActionValidationError(`Cannot resume a broadcast with status "${row.status}"`);
  }
  if (!RESUMABLE_STATUSES.has(row.status)) {
    throw new AdminActionValidationError(`Broadcast is already ${row.status}`);
  }

  const nextStatus = row.scheduleMode === "immediate" ? "pending" : "scheduled";
  await db
    .update(adminBroadcastsTable)
    .set({ status: nextStatus, errorMessage: null, completedAt: null })
    .where(eq(adminBroadcastsTable.id, broadcastId));

  await writeAuditLog({
    adminUserId: ctx.adminUserId,
    adminEmail: ctx.email,
    adminRole: ctx.role,
    action: "resume_admin_broadcast",
    targetType: "admin_broadcast",
    targetId: String(broadcastId),
    metadata: { previousStatus: row.status, nextStatus },
    ipAddress: ctx.ipAddress,
  });

  revalidatePath("/notifications/broadcasts");
}

export { AdminActionForbiddenError, AdminActionValidationError };
