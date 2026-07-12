import {
  canManageAdmins,
  canModerateReports,
  canPerformSupportActions,
  canSendBroadcasts,
} from "../permissions";
import type { AdminSessionPayload } from "./session";

export type ActionContext = AdminSessionPayload & { ipAddress?: string };

export class AdminActionForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "AdminActionForbiddenError";
  }
}

export class AdminActionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminActionValidationError";
  }
}

export function formatActionError(error: unknown): string {
  if (error instanceof AdminActionValidationError || error instanceof AdminActionForbiddenError) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function assertAuthenticated(ctx: ActionContext): void {
  if (!ctx.adminUserId || !ctx.email || !ctx.role) {
    throw new AdminActionForbiddenError("Unauthorized");
  }
}

export function assertSupportActions(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (!canPerformSupportActions(ctx.role)) {
    throw new AdminActionForbiddenError("Support actions require super_admin or support role");
  }
}

export function assertManageAdmins(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (!canManageAdmins(ctx.role)) {
    throw new AdminActionForbiddenError("Admin management requires super_admin role");
  }
}

/** super_admin-only gate for irreversible / highest-risk actions (e.g. account closure). */
export function assertSuperAdminOnly(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (ctx.role !== "super_admin") {
    throw new AdminActionForbiddenError("This action requires super_admin role");
  }
}

export function assertBreakGlassOps(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (ctx.role !== "super_admin" && ctx.role !== "ops") {
    throw new AdminActionForbiddenError("Break-glass requires super_admin or ops role");
  }
}

/** Release / platform management (app versions, etc.). */
export function assertOpsActions(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (ctx.role !== "super_admin" && ctx.role !== "ops") {
    throw new AdminActionForbiddenError("This action requires super_admin or ops role");
  }
}

export function assertComplianceActions(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (ctx.role !== "super_admin" && ctx.role !== "support") {
    throw new AdminActionForbiddenError("Compliance actions require super_admin or support role");
  }
}

export function assertModerateReports(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (!canModerateReports(ctx.role)) {
    throw new AdminActionForbiddenError(
      "Report moderation requires super_admin, support, or content role",
    );
  }
}

export function assertBroadcastActions(ctx: ActionContext): void {
  assertAuthenticated(ctx);
  if (!canSendBroadcasts(ctx.role)) {
    throw new AdminActionForbiddenError("Broadcasts require super_admin, ops, or content role");
  }
}
