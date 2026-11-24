import { coercePrefs, DEFAULT_COMPANION_PREFS, isPristineCompanionPrefs } from "./prefs";

describe("coercePrefs", () => {
  it.each([null, "x", [1]])("returns defaults for %p", (value) => {
    expect(coercePrefs(value)).toEqual(DEFAULT_COMPANION_PREFS);
  });

  it("leaves blobs from a newer schema untouched", () => {
    expect(coercePrefs({ schemaVersion: 2 })).toBeNull();
  });

  it("keeps valid fields", () => {
    const value = {
      defaultMode: "check",
      practiceView: "mushaf",
      dailyRevisionLimit: 20,
      engineChoice: "tilawa-fastconformer",
    };
    expect(coercePrefs(value)).toMatchObject({ ...value, schemaVersion: 1 });
  });

  it("drops invalid fields back to defaults", () => {
    expect(
      coercePrefs({
        defaultMode: "x",
        practiceView: "y",
        dailyRevisionLimit: 7,
        engineChoice: "z",
      }),
    ).toMatchObject({
      defaultMode: DEFAULT_COMPANION_PREFS.defaultMode,
      practiceView: DEFAULT_COMPANION_PREFS.practiceView,
      dailyRevisionLimit: DEFAULT_COMPANION_PREFS.dailyRevisionLimit,
      engineChoice: DEFAULT_COMPANION_PREFS.engineChoice,
    });
  });
});

describe("isPristineCompanionPrefs", () => {
  it.each([null, 5, {}, DEFAULT_COMPANION_PREFS])("is pristine for %p", (value) => {
    expect(isPristineCompanionPrefs(value)).toBe(true);
  });

  it("ignores legacy reading toggles left in old blobs (D13)", () => {
    expect(isPristineCompanionPrefs({ ...DEFAULT_COMPANION_PREFS, showTranslation: false })).toBe(
      true,
    );
  });

  it.each([
    { lastPassage: { surah: 1 } },
    { pronunciationConsentAt: "2026-01-01" },
    { autoAdvance: false },
  ])("is not pristine for %o", (value) => {
    expect(isPristineCompanionPrefs(value)).toBe(false);
  });
});
