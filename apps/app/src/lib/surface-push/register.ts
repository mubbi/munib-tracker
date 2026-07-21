import { apiFetch } from "@munib-tracker/api-client";
import { Platform } from "react-native";

import { apiAuthOptions } from "@/api/auth-options";
import { SessionStore } from "@/auth/session-store";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import { nativeApplyOngoingPhasePayload } from "@/lib/external-commands/native-bridge";
import { buildOngoingNotificationState } from "@/lib/ongoing-notification/state";
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

let lastSurfaceRegistrationId: number | null = null;

/** Register / replace Expo or Web Push phase jobs for an active tracking session. */
export async function registerSurfacePushSchedule(input: {
  accessToken: string;
  channel: "expo" | "web_push";
  target: string;
  session: SalahTrackingSession;
  snapshot: WidgetSnapshot;
  stopLabel: string;
}): Promise<SurfacePushRegistrationResponse | null> {
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
  lastSurfaceRegistrationId = result.registrationId;
  return result;
}

export async function endSurfacePushRegistration(
  accessToken: string,
  registrationId?: number | null,
  state: "ended" | "dismissed" = "ended",
): Promise<void> {
  const id = registrationId ?? lastSurfaceRegistrationId;
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
    /* best-effort */
  }
  if (id === lastSurfaceRegistrationId) lastSurfaceRegistrationId = null;
}

export async function deleteSurfacePushRegistration(
  accessToken: string,
  registrationId?: number | null,
): Promise<void> {
  const id = registrationId ?? lastSurfaceRegistrationId;
  if (!id) return;
  try {
    await apiFetch({ url: `/surface-push/${id}`, method: "DELETE" }, apiAuthOptions(accessToken));
  } catch {
    /* best-effort */
  }
  if (id === lastSurfaceRegistrationId) lastSurfaceRegistrationId = null;
}

/**
 * Handle an Expo data notification for Salah surface phases (Android).
 * Local alarms remain authoritative; this corrects state when the process was killed.
 */
export async function handleSurfacePhaseDataMessage(
  data: Record<string, unknown> | undefined,
): Promise<void> {
  if (Platform.OS !== "android" || !data) return;
  if (data.type !== "salah_surface_phase" && data.type !== "salah_phase") return;
  const payload =
    typeof data.payload === "string"
      ? data.payload
      : typeof data.payloadJson === "string"
        ? data.payloadJson
        : null;
  if (!payload) return;
  await nativeApplyOngoingPhasePayload(payload);
}

export function getLastSurfaceRegistrationId(): number | null {
  return lastSurfaceRegistrationId;
}
