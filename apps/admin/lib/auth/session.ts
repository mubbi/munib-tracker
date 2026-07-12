import { createHash, randomBytes } from "node:crypto";
import {
  type AdminRole,
  type AdminUser,
  adminSessionsTable,
  adminUsersTable,
} from "@munib-tracker/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getDb } from "../db";
import { getAdminEnv, requireAdminEnv } from "../env";
import { normalizeEmail } from "../utils";

import { isLocalAuthBypassEnabled, SESSION_COOKIE } from "./constants";

export { SESSION_COOKIE };

const SESSION_DAYS = 7;

export type AdminSessionPayload = {
  sessionId: number;
  adminUserId: number;
  email: string;
  role: AdminRole;
};

const LOCAL_DEV_BYPASS_EMAIL = "local-dev@localhost";

/**
 * Ensure a real allowlisted super_admin exists for local bypass so FK columns
 * (created_by_admin_id, audit) stay valid.
 */
async function getLocalBypassSession(): Promise<AdminSessionPayload> {
  const db = getDb();
  const existing = await lookupAdminByEmail(LOCAL_DEV_BYPASS_EMAIL);
  if (existing) {
    if (!existing.enabled || existing.role !== "super_admin") {
      await db
        .update(adminUsersTable)
        .set({ enabled: true, role: "super_admin", updatedAt: new Date() })
        .where(eq(adminUsersTable.id, existing.id));
    }
    return {
      sessionId: 0,
      adminUserId: existing.id,
      email: LOCAL_DEV_BYPASS_EMAIL,
      role: "super_admin",
    };
  }

  const [row] = await db
    .insert(adminUsersTable)
    .values({
      email: LOCAL_DEV_BYPASS_EMAIL,
      role: "super_admin",
      enabled: true,
    })
    .returning({ id: adminUsersTable.id });

  return {
    sessionId: 0,
    adminUserId: row.id,
    email: LOCAL_DEV_BYPASS_EMAIL,
    role: "super_admin",
  };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getSecretKey(): Uint8Array {
  const { ADMIN_SESSION_SECRET } = requireAdminEnv();
  return new TextEncoder().encode(ADMIN_SESSION_SECRET);
}

export async function createAdminSession(
  admin: AdminUser,
  meta: { ipAddress?: string; userAgent?: string },
): Promise<string> {
  const db = getDb();
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const [row] = await db
    .insert(adminSessionsTable)
    .values({
      adminUserId: admin.id,
      tokenHash,
      ipAddress: meta.ipAddress ?? null,
      userAgent: meta.userAgent ?? null,
      expiresAt,
      lastUsedAt: new Date(),
    })
    .returning({ id: adminSessionsTable.id });

  const jwt = await new SignJWT({
    sessionId: row.id,
    adminUserId: admin.id,
    email: admin.email,
    role: admin.role,
  } satisfies AdminSessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());

  return jwt;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: getAdminEnv().ADMIN_URL.startsWith("https"),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSessionPayload | null> {
  if (isLocalAuthBypassEnabled()) {
    return getLocalBypassSession();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const session = payload as AdminSessionPayload;
    if (
      typeof session.sessionId !== "number" ||
      typeof session.adminUserId !== "number" ||
      typeof session.email !== "string" ||
      typeof session.role !== "string"
    ) {
      return null;
    }

    const db = getDb();
    const now = new Date();
    // Join admin_users so role + enabled are read LIVE each request — a demoted
    // or disabled admin loses access immediately instead of after the JWT TTL.
    const [row] = await db
      .select({
        id: adminSessionsTable.id,
        email: adminUsersTable.email,
        role: adminUsersTable.role,
        enabled: adminUsersTable.enabled,
      })
      .from(adminSessionsTable)
      .innerJoin(adminUsersTable, eq(adminSessionsTable.adminUserId, adminUsersTable.id))
      .where(
        and(
          eq(adminSessionsTable.id, session.sessionId),
          eq(adminSessionsTable.adminUserId, session.adminUserId),
          gt(adminSessionsTable.expiresAt, now),
        ),
      )
      .limit(1);

    if (!row?.enabled) return null;

    await db
      .update(adminSessionsTable)
      .set({ lastUsedAt: now })
      .where(eq(adminSessionsTable.id, session.sessionId));

    return {
      sessionId: session.sessionId,
      adminUserId: session.adminUserId,
      email: row.email,
      role: row.role,
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AdminSessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function lookupAdminByEmail(email: string): Promise<AdminUser | null> {
  const db = getDb();
  const normalized = normalizeEmail(email);
  const [row] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, normalized))
    .limit(1);
  return row ?? null;
}

export async function revokeSession(sessionId: number): Promise<void> {
  if (sessionId <= 0) return;
  const db = getDb();
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.id, sessionId));
}

export async function revokeAllSessionsForAdmin(adminUserId: number): Promise<void> {
  const db = getDb();
  await db.delete(adminSessionsTable).where(eq(adminSessionsTable.adminUserId, adminUserId));
}
