import { apiFetch } from "@munib-tracker/api-client";

import { apiAuthOptions } from "@/api/auth-options";
import { SessionStore } from "@/auth/session-store";
import type { WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import type { LiveActivityPushTokenEvent } from "@/lib/live-activity/native";
import { buildLiveActivityPushSchedule } from "@/lib/live-activity/schedule";

type PendingRegistration = {
  activityId: string;
  pushToken: string;
  environment: "sandbox" | "production";
  snapshot: WidgetSnapshot | null;
};

let pending: PendingRegistration | null = null;
let lastRegistrationKey: string | null = null;
let latestSnapshot: WidgetSnapshot | null = null;
/**
 * Registrations run one at a time. Two overlapping PUTs for the same activity
 * interleave server-side (both wipe, both insert), which could leave an older
 * schedule — or both — queued. Each queued run reads the latest `pending`, so
 * bursts of snapshot syncs collapse into the newest schedule.
 */
let flushChain: Promise<void> = Promise.resolve();

/**
 * Keep the latest widget snapshot so a late ActivityKit push-token event can
 * still schedule phase boundaries without waiting for the next sync tick.
 */
export function rememberLiveActivitySnapshot(snapshot: WidgetSnapshot | null): void {
  latestSnapshot = snapshot;
  if (pending && snapshot) {
    pending = { ...pending, snapshot };
    void flushLiveActivityRegistration();
  }
}

/** Called from the native `onPushToken` listener. */
export function handleLiveActivityPushToken(event: LiveActivityPushTokenEvent): void {
  pending = {
    activityId: event.activityId,
    pushToken: event.pushToken.trim().toLowerCase(),
    environment: event.environment,
    snapshot: latestSnapshot,
  };
  void flushLiveActivityRegistration();
}

/** Re-register with the latest snapshot after a local Live Activity sync. */
export async function registerLiveActivitySchedule(
  snapshot: WidgetSnapshot,
  enabled: boolean,
): Promise<void> {
  rememberLiveActivitySnapshot(enabled ? snapshot : null);
  if (!enabled) {
    pending = null;
    lastRegistrationKey = null;
    return;
  }
  if (pending) {
    pending = { ...pending, snapshot };
    await flushLiveActivityRegistration();
  }
}

export function notifyLiveActivityLifecycle(
  activityId: string,
  state: "ended" | "dismissed",
): Promise<void> {
  // Drop the pending registration first so no queued flush re-registers it,
  // then run behind any in-flight PUT — otherwise that PUT could land after
  // this call and flip the server row back to `active`.
  if (pending?.activityId === activityId) pending = null;
  lastRegistrationKey = null;
  const run = flushChain.then(() => sendLifecycle(activityId, state));
  flushChain = run.catch(() => undefined);
  return run;
}

async function sendLifecycle(activityId: string, state: "ended" | "dismissed"): Promise<void> {
  try {
    const session = await SessionStore.get();
    const accessToken = session?.accessToken;
    if (!accessToken) return;
    await apiFetch(
      {
        url: `/live-activities/${encodeURIComponent(activityId)}/lifecycle`,
        method: "PUT",
        body: JSON.stringify({ state }),
      },
      apiAuthOptions(accessToken),
    );
  } catch {
    // Best-effort; expired jobs are cleaned by cron / ActivityKit lifetime.
  }
}

function flushLiveActivityRegistration(): Promise<void> {
  const run = flushChain.then(flushLatestRegistration, flushLatestRegistration);
  flushChain = run.catch(() => undefined);
  return run;
}

async function flushLatestRegistration(): Promise<void> {
  const current = pending;
  if (!current?.snapshot || current.snapshot.locationDenied) return;
  if (!/^[0-9a-f]{64,512}$/.test(current.pushToken)) return;

  const updates = buildLiveActivityPushSchedule(current.snapshot);
  if (updates.length === 0) return;

  const registrationKey = [
    current.activityId,
    current.pushToken,
    current.environment,
    updates.map((u) => `${u.phase}:${u.executeAt}`).join("|"),
  ].join("::");
  if (registrationKey === lastRegistrationKey) return;

  try {
    const session = await SessionStore.get();
    const accessToken = session?.accessToken;
    if (!accessToken) return;

    await apiFetch(
      {
        url: "/live-activities",
        method: "PUT",
        body: JSON.stringify({
          activityId: current.activityId,
          pushToken: current.pushToken,
          environment: current.environment,
          updates,
        }),
      },
      apiAuthOptions(accessToken),
    );
    // The activity may have ended while the request was in flight.
    if (pending?.activityId === current.activityId) lastRegistrationKey = registrationKey;
  } catch {
    // Registration is best-effort (offline / unsigned / simulator).
  }
}
