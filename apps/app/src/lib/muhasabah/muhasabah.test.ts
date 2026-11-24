import type { PrayerLog } from "@munib-tracker/shared/types";

import { makeMuhasabahEntry as entry } from "@/test-support/fixtures/self-review";

import {
  expiredEntryDates,
  muhasabahCardState,
  promptTrends,
  summarizeMuhasabahWeek,
  summarizeSalahForMuhasabah,
} from "./logic";
import {
  buildMuhasabahEntry,
  DEFAULT_MUHASABAH_CONFIG,
  emptyMuhasabahDraft,
  muhasabahDayKey,
  normalizeMuhasabahConfig,
  togglePrompt,
} from "./model";

function log(prayerId: PrayerLog["prayerId"], status: PrayerLog["status"], extra = {}): PrayerLog {
  return {
    id: `${prayerId}`,
    prayerId,
    date: "2026-11-23",
    status,
    updatedAt: "2026-11-23T20:00:00.000Z",
    source: "manual",
    ...extra,
  };
}

describe("muhasabah model", () => {
  it("normalizes configs: drops unknown and removed custom prompts, tops up to 3", () => {
    const config = normalizeMuhasabahConfig({
      prompts: ["bogus" as never, "custom:gone", "anger"],
      customPrompts: [{ id: "a", text: "  Did I smile?  " }],
      prefs: { time: "21:15", saveRepentText: false, retentionDays: 7 as never },
    });
    expect(config.prompts).toEqual(["anger", "tongue", "gaze"]);
    expect(config.customPrompts).toEqual([{ id: "a", text: "Did I smile?" }]);
    expect(config.prefs).toEqual({ time: "21:15", saveRepentText: false, retentionDays: 90 });
  });

  it("defaults to 90-day retention and saved repentance text", () => {
    expect(normalizeMuhasabahConfig(undefined)).toEqual(DEFAULT_MUHASABAH_CONFIG);
  });

  it("keeps the selection within 3–6 prompts", () => {
    expect(togglePrompt(["tongue", "gaze", "family"], "gaze")).toBeNull();
    expect(togglePrompt(["tongue", "gaze", "family", "time"], "gaze")).toEqual([
      "tongue",
      "family",
      "time",
    ]);
    const six = ["tongue", "gaze", "family", "trust", "time", "anger"] as const;
    expect(togglePrompt(six, "custom:x")).toBeNull();
  });

  it("rolls the review day over at 04:00", () => {
    expect(muhasabahDayKey(new Date(2026, 10, 24, 1, 30))).toBe("2026-11-23");
    expect(muhasabahDayKey(new Date(2026, 10, 24, 4, 0))).toBe("2026-11-24");
  });

  it("drops the repentance text (but keeps the fact) when saving text is off", () => {
    const draft = {
      ...emptyMuhasabahDraft(),
      answers: { tongue: "yes" as const, anger: "no" as const },
      repented: true,
      repentNote: "private words",
      gratitude: "  my mother's call ",
    };
    const saved = buildMuhasabahEntry({
      date: "2026-11-23",
      draft,
      prompts: ["tongue", "gaze", "family"],
      saveRepentText: false,
      durationMs: 61_234.4,
    });
    expect(saved).toEqual({
      kind: "entry",
      date: "2026-11-23",
      answers: { tongue: "yes" },
      gratitude: "my mother's call",
      repented: true,
      readIstighfar: false,
      durationMs: 61_234,
    });
    expect(JSON.stringify(saved)).not.toContain("private words");

    const withText = buildMuhasabahEntry({
      date: "2026-11-23",
      draft,
      prompts: ["tongue"],
      saveRepentText: true,
      durationMs: 0,
    });
    expect(withText.repentNote).toBe("private words");
  });
});

describe("muhasabah logic", () => {
  it("expires entries past the retention window; 0 keeps forever", () => {
    const entries = [entry("2026-08-24"), entry("2026-08-25"), entry("2026-11-22")];
    expect(expiredEntryDates(entries, "2026-11-22", 90)).toEqual(["2026-08-24"]);
    expect(expiredEntryDates(entries, "2026-11-22", 0)).toEqual([]);
  });

  it("tallies per-prompt answers over the last 30 days without an overall score", () => {
    const entries = [
      entry("2026-11-23", { answers: { tongue: "yes", gaze: "no" } }),
      entry("2026-11-01", { answers: { tongue: "partly" } }),
      entry("2026-10-20", { answers: { tongue: "no" } }), // outside the window
    ];
    const trends = promptTrends(entries, ["tongue", "gaze", "anger"], "2026-11-23");
    expect(trends).toEqual([
      { promptId: "tongue", tally: { yes: 1, partly: 1, no: 0 }, answered: 2 },
      { promptId: "gaze", tally: { yes: 0, partly: 0, no: 1 }, answered: 1 },
      { promptId: "anger", tally: { yes: 0, partly: 0, no: 0 }, answered: 0 },
    ]);
    expect(trends[0]).not.toHaveProperty("score");
  });

  it("weekly coach summary carries counts only — never text", () => {
    const entries = [
      entry("2026-11-16", { gratitude: "secret", repentNote: "secret", intention: "secret" }),
      entry("2026-11-22", { answers: { tongue: "no" }, readIstighfar: false }),
      entry("2026-11-23"),
    ];
    const summary = summarizeMuhasabahWeek(entries, "2026-11-16");
    expect(summary).toEqual({
      weekStart: "2026-11-16",
      reviewDays: 2,
      istighfarDays: 1,
      perPrompt: {
        tongue: { yes: 1, partly: 0, no: 1 },
        gaze: { yes: 0, partly: 1, no: 0 },
        family: { yes: 0, partly: 0, no: 1 },
      },
    });
    expect(JSON.stringify(summary)).not.toContain("secret");
  });

  it("summarizes the day's Salah read-only", () => {
    const recap = summarizeSalahForMuhasabah(
      [
        log("fajr", "completed"),
        log("dhuhr", "delayed"),
        log("asr", "missed"),
        log("maghrib", "completed"),
        log("witr", "completed"),
        log("duha", "completed"),
        { ...log("isha", "completed"), date: "2026-11-22" },
      ],
      "2026-11-23",
    );
    expect(recap).toEqual({
      fardOnTime: 2,
      fardLate: 1,
      fardTotal: 5,
      voluntary: 2,
      excusedReason: null,
    });
  });

  it("marks the recap excused from the active period or the day's logs", () => {
    expect(summarizeSalahForMuhasabah([], "2026-11-23", "hayd").excusedReason).toBe("hayd");
    expect(
      summarizeSalahForMuhasabah(
        [log("fajr", "pending", { isExcused: true, excusedReason: "travel" })],
        "2026-11-23",
      ).excusedReason,
    ).toBe("travel");
  });

  it("picks the Today card: reflect after Isha, intention by day, done once reviewed", () => {
    const yesterday = entry("2026-11-22", { intention: "Call my aunt" });
    expect(muhasabahCardState({ afterIsha: true, today: undefined, yesterday })).toEqual({
      kind: "reflect",
    });
    expect(muhasabahCardState({ afterIsha: true, today: entry("2026-11-23"), yesterday })).toEqual({
      kind: "done",
    });
    expect(muhasabahCardState({ afterIsha: false, today: undefined, yesterday })).toEqual({
      kind: "intention",
      intention: "Call my aunt",
    });
    expect(
      muhasabahCardState({ afterIsha: false, today: undefined, yesterday: entry("2026-11-22") }),
    ).toBeNull();
  });
});
