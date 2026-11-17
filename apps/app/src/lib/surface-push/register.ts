import { apiFetch } from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { apiAuthOptions } from "@/api/auth-options";
import { SessionStore } from "@/auth/session-store";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import { nativeApplyOngoingPhasePayload } from "@/lib/external-commands/native-bridge";
import { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";
import { isTV } from "@/lib/platform/is-tv";
import {
  buildSalahPhaseSchedule,
  SALAH_WEB_PUSH_HORIZON_MS,
  type SalahTrackingSession,
} from "@/lib/salah-phase";

export type SurfacePushRegistrationResponse = {
  registrationId: number;
  channel: string;
  scheduled: number;
  sessionId?: string | null;
};

/**
 * Persisted so "Stop" / sign-out after an app restart (or a reloaded PWA tab)
 * can still end the server registration. Memory-only, the id was lost and the
 * API kept pushing phases for a session the user had already stopped.
 */
const SURFACE_REGISTRATION_ID_KEY = "@munib_tracker_surface_push_registration_id";

let lastSurfaceRegistrationId: number | null = null;

async function rememberRegistrationId(id: number | null): Promise<void> {
  lastSurfaceRegistrationId = id;
  try {
    if (id == null) await AsyncStorage.removeItem(SURFACE_REGISTRATION_ID_KEY);
    else await AsyncStorage.setItem(SURFACE_REGISTRATION_ID_KEY, String(id));
  } catch {
    /* in-memory id still covers this process */
  }
}

async function resolveRegistrationId(explicit?: number | null): Promise<number | null> {
  if (explicit) return explicit;
  if (lastSurfaceRegistrationId) return lastSurfaceRegistrationId;
  try {
    const stored = Number(await AsyncStorage.getItem(SURFACE_REGISTRATION_ID_KEY));
    return Number.isInteger(stored) && stored > 0 ? stored : null;
  } catch {
    return null;
  }
}

async function forgetRegistrationId(id: number): Promise<void> {
  if ((await resolveRegistrationId()) === id) await rememberRegistrationId(null);
}

/** Register / replace Expo or Web Push phase jobs for an active tracking session. */
export async function registerSurfacePushSchedule(input: {
  accessToken: string;
  channel: "expo" | "web_push";
  target: string;
  session: SalahTrackingSession;
  snapshot: WidgetSnapshot;
  stopLabel: string;
}): Promise<SurfacePushRegistrationResponse | null> {
  if (Platform.OS !== "web" && isTV()) return null;
  const { accessToken, channel, target, session, snapshot, stopLabel } = input;
  const boundaries = buildSalahPhaseSchedule({
    snapshot,
    sessionId: session.sessionId,
    stopLabel,
    horizonMs: channel === "web_push" ? SALAH_WEB_PUSH_HORIZON_MS : undefined,
  });
  if (boundaries.length === 0) return null;

  const deviceId = await SessionStore.getDeviceId();
  const updates = boundaries.map((boundary) => {
    const payload =
      channel === "expo"
        ? buildOngoingNotificationState({
            snapshot,
            sessionId: session.sessionId,
            boundaries: [boundary],
            requestPromoted: true,
            now: new Date(boundary.executeAt),
          })
        : {
            version: 1,
            type: "salah_phase",
            title: boundary.title,
            body: boundary.body,
            subtitle: boundary.prayerName,
            tag: `salah-${session.sessionId}-${boundary.prayerId}`,
            collapseId: `salah-${session.sessionId}-${boundary.prayerId}`,
            data: {
              type: "prayer",
              phase: boundary.phase,
              sessionId: session.sessionId,
              url: boundary.webPath,
              href: boundary.webPath,
            },
            actions: [
              { action: "open", title: boundary.actionLabel },
              { action: "dismiss", title: stopLabel },
            ],
          };

    return {
      phase: boundary.phase,
      executeAt: boundary.executeAt,
      staleAt: boundary.staleAt,
      dedupeKey: boundary.dedupeKey,
      payload: payload as unknown as Record<string, unknown>,
    };
  });

  const result = await apiFetch<SurfacePushRegistrationResponse>(
    {
      url: "/surface-push",
      method: "PUT",
      body: JSON.stringify({
        channel,
        target,
        sessionId: session.sessionId,
        deviceId,
        expiresAt: session.endsAt,
        updates,
      }),
    },
    apiAuthOptions(accessToken),
  );
  await rememberRegistrationId(result.registrationId);
  return result;
}

export async function endSurfacePushRegistration(
  accessToken: string,
  registrationId?: number | null,
  state: "ended" | "dismissed" = "ended",
): Promise<void> {
  if (Platform.OS !== "web" && isTV()) return;
  const id = await resolveRegistrationId(registrationId);
  if (!id) return;
  try {
    await apiFetch(
      {
        url: `/surface-push/${id}/lifecycle`,
        method: "PUT",
        body: JSON.stringify({ state }),
      },
      apiAuthOptions(accessToken),
    );
  } catch {
    // Keep the id so a later stop / sign-out can retry; the server also
    // expires the registration at the session's `endsAt`.
    return;
  }
  await forgetRegistrationId(id);
}

export async function deleteSurfacePushRegistration(
  accessToken: string,
  registrationId?: number | null,
): Promise<void> {
  if (Platform.OS !== "web" && isTV()) return;
  const id = await resolveRegistrationId(registrationId);
  if (!id) return;
  try {
    await apiFetch({ url: `/surface-push/${id}`, method: "DELETE" }, apiAuthOptions(accessToken));
  } catch {
    return;
  }
  await forgetRegistrationId(id);
}

/**
 * Handle an Expo data notification for Salah surface phases (Android).
 * Local alarms remain authoritative; this corrects state when the process was killed.
 */
export async function handleSurfacePhaseDataMessage(
  data: Record<string, unknown> | undefined,
): Promise<void> {
  if (Platform.OS !== "android" || isTV() || !data) return;
  if (data.type !== "salah_surface_phase" && data.type !== "salah_phase") return;
  const payload =
    typeof data.payload === "string"
      ? data.payload
      : typeof data.payloadJson === "string"
        ? data.payloadJson
        : null;
  if (!payload) return;
  if (!(await isPayloadForActiveSession(payload))) return;
  await nativeApplyOngoingPhasePayload(payload);
}

/**
 * Server jobs can outlive the session (lifecycle call failed offline, or the
 * push was already in flight when the user tapped Stop). Native only guards
 * *dismissed* sessions, so without this a late push re-posted a promoted Live
 * Update for a session the user had ended. Fails open: if preferences cannot be
 * read, local state is still authoritative on the next app sync.
 */
async function isPayloadForActiveSession(payloadJson: string): Promise<boolean> {
  let sessionId: unknown;
  try {
    sessionId = (JSON.parse(payloadJson) as { sessionId?: unknown }).sessionId;
  } catch {
    return false;
  }
  if (typeof sessionId !== "string" || sessionId === "ambient") return true;
  try {
    // Lazy: this module is on the headless-task boot path (index.js).
    const { PreferencesRepository } = await import("@/db");
    const session = (await PreferencesRepository.get()).salahTrackingSession;
    return (
      session?.sessionId === sessionId &&
      session.status === "active" &&
      !session.dismissed &&
      Date.parse(session.endsAt) > Date.now()
    );
  } catch {
    return true;
  }
}

export function getLastSurfaceRegistrationId(): number | null {
  return lastSurfaceRegistrationId;
}
