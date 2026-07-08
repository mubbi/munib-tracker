import { describe, expect, it } from "@jest/globals";

import {
  clearPreferencesDirty,
  filterRemotePreferencesPatch,
  hasPendingPreferenceChanges,
  markPreferencesDirty,
  shouldApplyServerPreferenceField,
} from "@/lib/sync/preferences-cloud-sync";

describe("preferences-cloud-sync", () => {
  it("tracks dirty state", () => {
    clearPreferencesDirty();
    expect(hasPendingPreferenceChanges()).toBe(false);
    markPreferencesDirty();
    expect(hasPendingPreferenceChanges()).toBe(true);
    clearPreferencesDirty();
    expect(hasPendingPreferenceChanges()).toBe(false);
  });

  it("skips server fields while dirty", () => {
    expect(shouldApplyServerPreferenceField(true)).toBe(false);
    expect(shouldApplyServerPreferenceField(false)).toBe(true);
  });

  it("strips locale fields from remote patches while dirty", () => {
    const patch = filterRemotePreferencesPatch(
      { locale: "ar", translationLocale: "ur", timeFormat: "24" },
      true,
    );
    expect(patch.locale).toBeUndefined();
    expect(patch.translationLocale).toBeUndefined();
    expect(patch.timeFormat).toBe("24");
  });
});
