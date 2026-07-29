"use server";

import {
  ADMIN_ROLES,
  type AdminRole,
  adminAuditLogTable,
  adminSessionsTable,
  adminUsersTable,
  appVersionsTable,
  authSessionsTable,
  inAppNotificationsTable,
  pushTokensTable,
} from "@munib-tracker/db/schema";
import { and, count, eq, gte, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAppVersionPlatform, isValidAppVersion } from "@/lib/app-versions";
import { writeAuditLog } from "@/lib/audit";
import {
  type ActionContext,
  AdminActionForbiddenError,
  AdminActionValidationError,
  assertManageAdmins,
  assertOpsActions,
  assertSupportActions,
} from "@/lib/auth/action-guards";
import { getDb } from "@/lib/db";
import { type PushTargetRow, sendBroadcastPush } from "@/lib/notifications/pushDelivery";
import { requireUserExists } from "@/lib/queries/users";
import { normalizeEmail } from "@/lib/utils";

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

function assertValidAdminRole(role: string): asserts role is AdminRole {
  if (!(ADMIN_ROLES as readonly string[]).includes(role)) {
    throw new AdminActionForbiddenError("Invalid admin role");
  }
}

/** Block demoting/disabling the target if it would leave zero active super admins. */
async function assertNotLastSuperAdmin(targetAdminUserId: number): Promise<void> {
  const db = getDb();
  const [target] = await db
    .select({ role: adminUsersTable.role, enabled: adminUsersTable.enabled })
    .from(adminUsersTable)
    .where(eq(adminUsersTable.id, targetAdminUserId))
    .limit(1);
  if (target?.role !== "super_admin" || !target.enabled) return;
  const [{ value }] = await db
    .select({ value: count() })
    .from(adminUsersTable)
    .where(and(eq(adminUsersTable.role, "super_admin"), eq(adminUsersTable.enabled, true)));
  if (Number(value) <= 1) {
    throw new AdminActionForbiddenError("Cannot demote or disable the last active super_admin");
  }
}

export async function revokeUserSession(ctx: ActionContext, sessionId: string, userId: string) {
  assertSupportActions(ctx);
  const db = getDb();
  await db
    .delete(authSessionsTable)
    .where(and(eq(authSessionsTable.id, sessionId), eq(authSessionsTable.userId, userId)));
  await audit(ctx, "revoke_user_session", "user", userId, { sessionId });
  revalidatePath(`/users/${userId}`);
}

export async function clearUserPushTokens(ctx: ActionContext, userId: string) {
  assertSupportActions(ctx);
  const db = getDb();
  await db.delete(pushTokensTable).where(eq(pushTokensTable.userId, userId));
  await audit(ctx, "clear_push_tokens", "user", userId);
  revalidatePath(`/users/${userId}`);
}

export async function revokeAdminSession(ctx: ActionContext, sessionId: number) {
  assertManageAdmins(ctx);
  const db = getDb();
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.id, sessionId));
  await audit(ctx, "revoke_admin_session", "admin_session", String(sessionId));
  revalidatePath("/administration");
}

export async function createAdminUser(
  ctx: ActionContext,
  input: { email: string; role: AdminRole },
) {
  assertManageAdmins(ctx);
  assertValidAdminRole(input.role);
  const db = getDb();
  await db.insert(adminUsersTable).values({
    email: normalizeEmail(input.email),
    role: input.role,
    createdByAdminId: ctx.adminUserId,
  });
  await audit(ctx, "create_admin_user", "admin_user", input.email, { role: input.role });
  revalidatePath("/administration");
}

export async function toggleAdminUser(ctx: ActionContext, adminUserId: number, enabled: boolean) {
  assertManageAdmins(ctx);
  if (adminUserId === ctx.adminUserId) {
    throw new AdminActionForbiddenError("You cannot disable your own account");
  }
  if (!enabled) {
    await assertNotLastSuperAdmin(adminUserId);
  }
  const db = getDb();
  await db
    .update(adminUsersTable)
    .set({ enabled, updatedAt: new Date() })
    .where(eq(adminUsersTable.id, adminUserId));
  await audit(
    ctx,
    enabled ? "enable_admin_user" : "disable_admin_user",
    "admin_user",
    String(adminUserId),
  );
  revalidatePath("/administration");
}

export async function updateAdminRole(ctx: ActionContext, adminUserId: number, role: AdminRole) {
  assertManageAdmins(ctx);
  assertValidAdminRole(role);
  if (adminUserId === ctx.adminUserId) {
    throw new AdminActionForbiddenError("You cannot change your own role");
  }
  if (role !== "super_admin") {
    await assertNotLastSuperAdmin(adminUserId);
  }
  const db = getDb();
  await db
    .update(adminUsersTable)
    .set({ role, updatedAt: new Date() })
    .where(eq(adminUsersTable.id, adminUserId));
  await audit(ctx, "update_admin_role", "admin_user", String(adminUserId), { role });
  revalidatePath("/administration");
}

export async function upsertAppVersion(
  ctx: ActionContext,
  input: {
    platform: string;
    latestVersion: string;
    minSoftVersion: string;
    minHardVersion: string;
    message?: string;
    storeUrl?: string;
  },
) {
  assertOpsActions(ctx);
  const platform = input.platform.trim().toLowerCase();
  if (!isAppVersionPlatform(platform)) {
    throw new AdminActionForbiddenError("Platform must be ios, android, or web");
  }
  const latestVersion = input.latestVersion.trim();
  const minSoftVersion = input.minSoftVersion.trim();
  const minHardVersion = input.minHardVersion.trim();
  if (![latestVersion, minSoftVersion, minHardVersion].every(isValidAppVersion)) {
    throw new AdminActionForbiddenError("Versions must be in x.y.z format (e.g. 1.2.0)");
  }
  const message = input.message?.trim().slice(0, 500) || null;
  const storeUrl = input.storeUrl?.trim() || null;
  if (storeUrl && !/^https:\/\//i.test(storeUrl)) {
    throw new AdminActionForbiddenError("Store URL must start with https://");
  }

  const db = getDb();
  await db
    .insert(appVersionsTable)
    .values({ platform, latestVersion, minSoftVersion, minHardVersion, message, storeUrl })
    .onConflictDoUpdate({
      target: appVersionsTable.platform,
      set: {
        latestVersion,
        minSoftVersion,
        minHardVersion,
        message,
        storeUrl,
        updatedAt: new Date(),
      },
    });
  await audit(ctx, "upsert_app_version", "app_version", platform, {
    latestVersion,
    minSoftVersion,
    minHardVersion,
  });
  revalidatePath("/versions");
}

export async function deleteAppVersion(ctx: ActionContext, platform: string) {
  assertOpsActions(ctx);
  const p = platform.trim().toLowerCase();
  if (!isAppVersionPlatform(p)) {
    throw new AdminActionForbiddenError("Unknown platform");
  }
  const db = getDb();
  await db.delete(appVersionsTable).where(eq(appVersionsTable.platform, p));
  await audit(ctx, "delete_app_version", "app_version", p);
  revalidatePath("/versions");
}

export async function markAllNotificationsRead(ctx: ActionContext, userId: string) {
  assertSupportActions(ctx);
  const db = getDb();
  await db
    .update(inAppNotificationsTable)
    .set({ readAt: new Date() })
    .where(and(eq(inAppNotificationsTable.userId, userId), isNull(inAppNotificationsTable.readAt)));
  await audit(ctx, "mark_all_notifications_read", "user", userId);
  revalidatePath(`/users/${userId}`);
}

export async function sendTestPushToUser(ctx: ActionContext, userId: string) {
  assertSupportActions(ctx);
  await requireUserExists(userId);
  const db = getDb();

  const since = new Date(Date.now() - 60_000);
  const [recent] = await db
    .select({ id: adminAuditLogTable.id })
    .from(adminAuditLogTable)
    .where(
      and(
        eq(adminAuditLogTable.action, "send_test_push"),
        eq(adminAuditLogTable.targetId, userId),
        gte(adminAuditLogTable.createdAt, since),
      ),
    )
    .limit(1);
  if (recent) {
    throw new AdminActionValidationError(
      "A test push was sent to this user in the last minute — please wait.",
    );
  }

  const tokens: PushTargetRow[] = await db
    .select({
      userId: pushTokensTable.userId,
      token: pushTokensTable.token,
      platform: pushTokensTable.platform,
    })
    .from(pushTokensTable)
    .where(eq(pushTokensTable.userId, userId));

  if (tokens.length === 0) {
    throw new AdminActionValidationError("User has no push tokens registered");
  }

  const stats = await sendBroadcastPush(tokens, {
    title: "Test notification",
    body: "Delivery test from Munib Tracker support — no action needed.",
    collapseId: `admin_test_${userId}`,
  });
  await audit(ctx, "send_test_push", "user", userId, {
    tokens: tokens.length,
    expoSent: stats.expoSent,
    webSent: stats.webSent,
    failed: stats.failed,
  });
  revalidatePath(`/users/${userId}`);
  return stats;
}
