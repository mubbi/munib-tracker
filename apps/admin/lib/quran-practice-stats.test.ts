import { describe, expect, it } from "vitest";
import { formatShare, summarizePrefs, summarizeSessions, unwrapBlob } from "./quran-practice-stats";

const NOW = new Date("2026-11-17T12:00:00.000Z");

function session(over: Record<string, unknown> = {}) {
  return {
    id: "s1",
    mode: "check",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    startedAt: "2026-11-16T09:00:00.000Z",
    endedAt: "2026-11-16T09:05:00.000Z",
    durationMs: 300_000,
    engine: "tilawa-zipformer",
    engineVersion: "0.4.0",
    matched: 20,
    uncertain: 4,
    confirmedMismatch: 2,
    corrected: 0,
    notReached: 3,
    weakAyahs: [],
    ...over,
  };
}

/** Synced rows store `{ value }` as text. */
const row = (value: unknown) => JSON.stringify({ value });

describe("unwrapBlob", () => {
  it("reads the { value } wrapper from text or an object", () => {
    expect(unwrapBlob(row({ schemaVersion: 1, a: 1 }))).toEqual({ schemaVersion: 1, a: 1 });
    expect(unwrapBlob({ value: { schemaVersion: 1 } })).toEqual({ schemaVersion: 1 });
  });

  it("skips malformed JSON, missing values and newer schemas", () => {
    expect(unwrapBlob("{not json")).toBeNull();
    expect(unwrapBlob(JSON.stringify({ nope: 1 }))).toBeNull();
    expect(unwrapBlob(row({ schemaVersion: 2 }))).toBeNull();
    expect(unwrapBlob(row([1, 2]))).toBeNull();
  });
});

describe("summarizeSessions", () => {
  it("counts users, windows, modes, engines and listener shares", () => {
    const stats = summarizeSessions(
      [
        row({
          schemaVersion: 1,
          items: [
            session(),
            session({ id: "s2", mode: "follow", engine: "none", surah: 2, ayahEnd: 1 }),
          ],
        }),
        row({
          schemaVersion: 1,
          items: [
            session({
              id: "s3",
              endedAt: "2026-11-01T09:00:00.000Z",
              matched: 0,
              uncertain: 0,
              confirmedMismatch: 0,
              notReached: 7,
            }),
          ],
        }),
      ],
      NOW,
    );
    expect(stats.users).toBe(2);
    expect(stats.stored).toBe(3);
    expect(stats.last7Days).toBe(2);
    expect(stats.last30Days).toBe(3);
    expect(stats.modes[0]).toEqual({ label: "Check", value: 2 });
    expect(stats.engines.find((e) => e.label.startsWith("Listen only"))?.value).toBe(1);
    expect(stats.topSurahs[0]).toEqual({ label: "Surah 1", value: 2 });
    // Listener sessions exclude listen-only; one heard nothing.
    expect(stats.listener.sessions).toBe(2);
    expect(stats.listener.nothingHeard).toBe(1);
    // Words: heard 20, not sure 4, try again 2, not reached 3 + 7 = 36.
    expect(stats.listener.heardShare).toBeCloseTo(20 / 36);
    expect(stats.listener.notReachedShare).toBeCloseTo(10 / 36);
    expect(stats.medianDurationSec).toBe(300);
  });

  it("drops items cleared by Delete practice history, bad rows and future dates", () => {
    const stats = summarizeSessions(
      [
        row({
          schemaVersion: 1,
          clearedAt: "2026-11-16T10:00:00.000Z",
          items: [
            session(),
            session({ id: "late", endedAt: "2026-11-17T08:00:00.000Z" }),
            session({ id: "future", endedAt: "2026-12-30T08:00:00.000Z" }),
            session({ id: "bad", surah: 200 }),
            "nope",
          ],
        }),
        "{broken",
      ],
      NOW,
    );
    expect(stats.users).toBe(1);
    expect(stats.last30Days).toBe(1);
  });

  it("puts today's sessions in the last bucket of the 14-day series", () => {
    const stats = summarizeSessions(
      [row({ schemaVersion: 1, items: [session({ endedAt: NOW.toISOString() })] })],
      NOW,
    );
    expect(stats.dailyLast14).toHaveLength(14);
    expect(stats.dailyLast14[13]).toBe(1);
  });

  it("returns empty stats with no data", () => {
    const stats = summarizeSessions([], NOW);
    expect(stats.users).toBe(0);
    expect(stats.medianDurationSec).toBeNull();
    expect(stats.listener.heardShare).toBeNull();
  });
});

describe("summarizePrefs", () => {
  it("tallies the preference mix", () => {
    const stats = summarizePrefs([
      row({
        schemaVersion: 1,
        defaultMode: "hide-ayahs",
        engineChoice: "tilawa-zipformer",
        feedbackTiming: "ayah",
        dailyRevisionLimit: 10,
        hearBeforeRecite: "once",
        revisionReminder: true,
        wifiOnlyDownload: true,
        autoAdvance: false,
        pronunciationConsentAt: "2026-11-17T09:00:00.000Z",
      }),
      row({ schemaVersion: 1, defaultMode: "follow", wifiOnlyDownload: false }),
      row({ schemaVersion: 3, defaultMode: "future" }),
    ]);
    expect(stats.users).toBe(2);
    expect(stats.defaultModes.map((m) => m.label).sort()).toEqual(["Follow", "Hide ayahs"]);
    expect(stats.revisionReminderOn).toBe(1);
    expect(stats.wifiOnlyOn).toBe(1);
    expect(stats.autoAdvanceOn).toBe(1);
    expect(stats.pronunciationConsented).toBe(1);
    expect(stats.dailyLimits).toEqual([{ label: "10 a day", value: 1 }]);
    expect(stats.hearBeforeRecite).toEqual([{ label: "Once", value: 1 }]);
  });
});

describe("formatShare", () => {
  it("rounds to a percent, dash when empty", () => {
    expect(formatShare(0.456)).toBe("46%");
    expect(formatShare(null)).toBe("—");
  });
});
