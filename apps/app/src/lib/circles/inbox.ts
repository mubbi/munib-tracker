/**
 * Circle events in the in-app inbox and OS push (NF-3.16–3.18, D33).
 *
 * The server writes inbox rows with `kind: "circle"` and
 * `routeData = { type: "circle", event, circleId, khatmId? }` plus English
 * fallback copy. The app localizes by `routeData.event` and routes by the same
 * data, so an inbox tap and a push tap land on the same screen. Copy is fixed and
 * content-free: no names, no intentions, no salah status.
 *
 * D40 adds `family_digest`: the weekly parent digest, whose row also carries the
 * aggregate counts (`prayed`, `possible` — never names) and opens `/family`.
 */
import {
  familyDigestHref,
  circleEventHref as sharedCircleEventHref,
} from "@munib-tracker/shared/circles/push";
import type { TFunction } from "i18next";

export const CIRCLE_EVENTS = [
  "khatm_part_done",
  "khatm_completed",
  "dua_received",
  "family_digest",
] as const;
export type CircleEvent = (typeof CIRCLE_EVENTS)[number];

export type CircleRouteData = {
  type: "circle";
  event: CircleEvent;
  circleId: string;
  khatmId?: string;
  /** `family_digest` only: aggregate counts for the week (absent on push data). */
  prayed?: number;
  possible?: number;
};

function count(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : undefined;
}

function isCircleEvent(value: unknown): value is CircleEvent {
  return typeof value === "string" && (CIRCLE_EVENTS as readonly string[]).includes(value);
}

/** Narrow an untrusted `routeData` / push `data` object to a circle event. */
export function parseCircleRouteData(data: unknown): CircleRouteData | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (record.type !== "circle" || !isCircleEvent(record.event)) return null;
  if (typeof record.circleId !== "string" || !record.circleId) return null;
  return {
    type: "circle",
    event: record.event,
    circleId: record.circleId,
    ...(typeof record.khatmId === "string" && record.khatmId ? { khatmId: record.khatmId } : {}),
    ...(record.event === "family_digest" &&
    count(record.prayed) !== undefined &&
    count(record.possible) !== undefined
      ? { prayed: count(record.prayed), possible: count(record.possible) }
      : {}),
  };
}

/** Where a circle event opens (khatm → that khatm; dua → the partner circle; digest → family). */
export function circleEventHref(data: CircleRouteData): string {
  // One routing source with the server (`@munib-tracker/shared/circles/push`).
  if (data.event === "family_digest") return familyDigestHref(data.circleId);
  return sharedCircleEventHref({
    type: data.event,
    circleId: data.circleId,
    khatmId: data.khatmId,
  });
}

/**
 * Localized, content-free title/body for a circle event. The digest fills in
 * its aggregate counts; without them (malformed row) the caller keeps the
 * server's copy.
 */
export function circleEventCopy(
  event: CircleEvent,
  t: TFunction,
  counts?: Pick<CircleRouteData, "prayed" | "possible">,
): { title: string; body: string } {
  return {
    title: t(`circles.inbox.${event}.title`),
    body: t(`circles.inbox.${event}.body`, counts ?? {}),
  };
}

/**
 * Localize an inbox row when it is a circle event (else return it unchanged).
 * Keeps the server's English copy only if routeData is malformed.
 */
export function localizeCircleInboxItem<T extends { title: string; body: string }>(
  item: T & { kind?: string; routeData?: Record<string, unknown> | null },
  t: TFunction,
): T {
  if (item.kind !== "circle") return item;
  const data = parseCircleRouteData(item.routeData);
  if (!data) return item;
  if (data.event === "family_digest" && data.prayed === undefined) return item;
  return {
    ...item,
    ...circleEventCopy(data.event, t, { prayed: data.prayed, possible: data.possible }),
  };
}
