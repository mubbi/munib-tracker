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
    expect("locale" in patch).toBe(false);
    expect("translationLocale" in patch).toBe(false);
    expect(patch.timeFormat).toBe("24");
  });

  it("keeps locale fields when nothing is pending", () => {
    const patch = filterRemotePreferencesPatch(
      { locale: "ar", translationLocale: "ur", timeFormat: "24" },
      false,
    );
    expect(patch.locale).toBe("ar");
    expect(patch.translationLocale).toBe("ur");
  });
});
