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
