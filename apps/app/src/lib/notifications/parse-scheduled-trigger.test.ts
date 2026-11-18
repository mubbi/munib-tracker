import {
  parseScheduledTriggerAtMs,
  scheduledFireAtIso,
} from "@/lib/notifications/parse-scheduled-trigger";

describe("parseScheduledTriggerAtMs", () => {
  const now = new Date("2026-07-06T12:00:00").getTime();

  it("reads Android date triggers from value (milliseconds)", () => {
    const ms = parseScheduledTriggerAtMs(
      { type: "date", value: new Date("2026-07-07T05:30:00").getTime() },
      now,
    );
    expect(ms).toBe(new Date("2026-07-07T05:30:00").getTime());
  });

  it("reads expo date triggers from timestamp", () => {
    const instant = new Date("2026-07-07T05:30:00").getTime();
    expect(parseScheduledTriggerAtMs({ type: "date", timestamp: instant }, now)).toBe(instant);
  });

  it("reads daily triggers from hour and minute", () => {
    const ms = parseScheduledTriggerAtMs({ type: "daily", hour: 15, minute: 30 }, now);
    const parsed = new Date(ms ?? 0);
    expect(parsed.getHours()).toBe(15);
    expect(parsed.getMinutes()).toBe(30);
    expect(ms).not.toBeNull();
  });

  it("reads iOS timeInterval triggers relative to now", () => {
    const ms = parseScheduledTriggerAtMs({ type: "timeInterval", seconds: 600 }, now);
    expect(ms).toBe(now + 600_000);
  });

  it("returns null for unknown triggers", () => {
    expect(parseScheduledTriggerAtMs({ type: "channel", channelId: "prayer" }, now)).toBeNull();
  });
});

describe("scheduledFireAtIso", () => {
  it("returns ISO for valid instants", () => {
    const ms = new Date("2026-07-07T05:30:00").getTime();
    expect(scheduledFireAtIso(ms)).toBe(new Date(ms).toISOString());
  });

  it("does not throw for out-of-range values", () => {
    expect(scheduledFireAtIso(Number.MAX_SAFE_INTEGER)).toBeNull();
  });
});

describe("parseScheduledTriggerAtMs edge cases", () => {
  const NOW = new Date("2026-07-03T10:00:00").getTime();

  it.each([
    [
      "an ISO date string",
      { type: "date", date: "2026-07-03T12:00:00.000Z" },
      Date.parse("2026-07-03T12:00:00.000Z"),
    ],
    ["epoch seconds", { type: "date", value: 1_780_000_000 }, 1_780_000_000_000],
    ["an invalid date string", { type: "date", date: "nope" }, null],
    ["a date trigger without an instant", { type: "date" }, null],
    ["a non-object", "daily" as never, null],
  ])("handles %s", (_label, trigger, expected) => {
    expect(parseScheduledTriggerAtMs(trigger as never, NOW)).toBe(expected);
  });

  it("reads iOS calendar dateComponents and rolls past times to tomorrow", () => {
    const at = parseScheduledTriggerAtMs(
      { type: "calendar", dateComponents: { hour: 9 } } as never,
      NOW,
    );
    const expected = new Date(NOW);
    expected.setDate(expected.getDate() + 1);
    expected.setHours(9, 0, 0, 0);
    expect(at).toBe(expected.getTime());
  });

  it("resolves clock-time triggers against nowMs, not the wall clock", () => {
    const longAgo = new Date("2020-01-15T08:00:00").getTime();
    const at = parseScheduledTriggerAtMs({ type: "daily", hour: 9, minute: 15 }, longAgo);
    expect(at).toBe(new Date("2020-01-15T09:15:00").getTime());
  });

  it("uses dateComponents minutes when present", () => {
    const at = parseScheduledTriggerAtMs(
      { type: "calendar", dateComponents: { hour: 11, minute: 30 } } as never,
      NOW,
    );
    expect(new Date(at as number).getMinutes()).toBe(30);
  });
});
