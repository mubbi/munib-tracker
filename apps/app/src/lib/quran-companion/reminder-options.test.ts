import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "@/db/keys";
import { QuranCompanionPrefsRepository } from "@/db/repositories/quran-companion-prefs-repository";
import { QuranMemorizationRepository } from "@/db/repositories/quran-memorization-repository";
import { writeJSON } from "@/db/store";

import { quranRevisionReminderOptions } from "./reminder-options";
import type { MemorizationRecord } from "./types";

/**
 * §10 Revision reminder: the scheduler's options are read straight from the
 * repositories (the practice stores are lazy and not loaded at launch).
 */

jest.mock("@/lib/platform/is-tv", () => ({ isTV: jest.fn(() => false) }));

const NOW = new Date(2026, 10, 17, 8, 0, 0); // local 17 Nov 2026, 08:00

function due(nextReviewAt: string): MemorizationRecord {
  return {
    status: "practising",
    successStreak: 1,
    intervalDays: 1,
    nextReviewAt,
    lastAttemptAt: "2026-11-16T09:00:00.000Z",
    lapses: 0,
    updatedAt: "2026-11-16T09:00:00.000Z",
  };
}

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("quranRevisionReminderOptions", () => {
  it("is off while the pref is off, whatever is due", async () => {
    await QuranMemorizationRepository.upsert({ "1:1": due("2026-11-17") });
    expect(await quranRevisionReminderOptions(NOW)).toEqual({ revisionReminderEnabled: false });
  });

  it("reads prefs, memorization and hifz from storage when the pref is on", async () => {
    await QuranCompanionPrefsRepository.update({ revisionReminder: true });
    await QuranMemorizationRepository.upsert({
      "1:1": due("2026-11-17"),
      "1:2": due("2026-11-18"),
    });
    await writeJSON(DB_KEYS.hifz, { "2:255": "review" });

    const options = await quranRevisionReminderOptions(NOW);
    expect(options.revisionReminderEnabled).toBe(true);
    const counts = Object.values(options.revisionDueByDay ?? {});
    // Today: 1:1 + the hifz "review" ayah. Tomorrow adds 1:2.
    expect(counts[0]).toBe(2);
    expect(counts[1]).toBe(3);
  });

  it("leaves hifz review rows out when includeHifzReview is off", async () => {
    await QuranCompanionPrefsRepository.update({
      revisionReminder: true,
      includeHifzReview: false,
    });
    await writeJSON(DB_KEYS.hifz, { "2:255": "review" });
    const options = await quranRevisionReminderOptions(NOW);
    expect(Object.values(options.revisionDueByDay ?? {}).every((n) => n === 0)).toBe(true);
  });
});
