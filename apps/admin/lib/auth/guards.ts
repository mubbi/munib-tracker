import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ActionContext } from "./action-guards";
import type { AdminSessionPayload } from "./session";
import { getSession } from "./session";

export async function requirePageSession(): Promise<AdminSessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function getRequestMeta(): Promise<{ ipAddress?: string; userAgent?: string }> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ipAddress = forwarded?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? undefined;
  const userAgent = h.get("user-agent") ?? undefined;
  return { ipAddress, userAgent };
}

/**
 * Resolve the session + request IP into an `ActionContext` for a server action.
 * Replaces the repeated `requirePageSession()` + `getRequestMeta()` boilerplate
 * in inline form actions (runs both in parallel).
 */
export async function getActionContext(): Promise<ActionContext> {
  const [session, meta] = await Promise.all([requirePageSession(), getRequestMeta()]);
  return { ...session, ipAddress: meta.ipAddress };
}
