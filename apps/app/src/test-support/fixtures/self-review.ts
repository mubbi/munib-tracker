import type { MuhasabahEntry, Relative, RelativeContactLog } from "@munib-tracker/shared/types";

/** Shared fixtures for the NF-3.6 muhasabah and NF-3.7 family-ties suites. */

export function makeMuhasabahEntry(
  date: string,
  overrides: Partial<MuhasabahEntry> = {},
): MuhasabahEntry {
  return {
    kind: "entry",
    date,
    answers: { tongue: "yes", gaze: "partly", family: "no" },
    readIstighfar: true,
    durationMs: 60_000,
    ...overrides,
  };
}

export function makeRelative(overrides: Partial<Relative> = {}): Relative {
  return {
    type: "relative",
    name: "Test Relative",
    kinship: "sibling",
    cadenceDays: 7,
    createdAt: "2026-11-01T10:00:00.000Z",
    ...overrides,
  };
}

export function makeContactLog(
  relativeId: string,
  date: string,
  contact: RelativeContactLog["contact"] = "call",
): RelativeContactLog {
  return { type: "log", relativeId, date, contact };
}
