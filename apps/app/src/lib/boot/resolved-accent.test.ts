import { contrastRatio } from "@munib-tracker/theme/color";
import { resolveTheme } from "@munib-tracker/theme/resolve";
import { STORAGE_KEYS } from "@munib-tracker/theme/types";
import { act, renderHook } from "@testing-library/react-native";

import {
  getResolvedAccent,
  peekStoredAccent,
  resolveCustomAccentTheme,
  setResolvedAccent,
  useResolvedAccent,
} from "@/lib/boot/resolved-accent";
import { CUSTOM_ACCENT_KEY } from "@/lib/theme-storage-keys";
import { createMemoryStorage, installBrowser } from "@/test-support/browser";

describe("peekStoredAccent", () => {
  let restore: () => void = () => {};
  afterEach(() => {
    restore();
    restore = () => {};
  });

  it("defaults without localStorage", () => {
    expect(peekStoredAccent()).toEqual({ accentColorId: "forest", customAccent: null });
  });

  it("reads and normalises the persisted mirror", () => {
    restore = installBrowser({
      window: {
        localStorage: createMemoryStorage({
          [STORAGE_KEYS.accent]: "rose",
          [CUSTOM_ACCENT_KEY]: "#ABC",
        }),
      },
    });
    expect(peekStoredAccent()).toEqual({ accentColorId: "rose", customAccent: "#aabbcc" });
  });

  it("drops invalid values and survives a throwing storage", () => {
    const storage = createMemoryStorage({
      [STORAGE_KEYS.accent]: "nope",
      [CUSTOM_ACCENT_KEY]: "not-a-colour",
    });
    restore = installBrowser({ window: { localStorage: storage } });
    expect(peekStoredAccent()).toEqual({ accentColorId: "forest", customAccent: null });

    storage.getItem.mockImplementation(() => {
      throw new Error("denied");
    });
    expect(peekStoredAccent()).toEqual({ accentColorId: "forest", customAccent: null });
  });
});

describe("resolved accent mirror", () => {
  afterEach(() => setResolvedAccent("forest", null));

  it("notifies subscribers only on change", async () => {
    const { result } = await renderHook(() => useResolvedAccent());
    const first = result.current;

    await act(() => setResolvedAccent(first.accentColorId, first.customAccent));
    expect(result.current).toBe(first);

    await act(() => setResolvedAccent("rose", "#123456"));
    expect(result.current).toEqual({ accentColorId: "rose", customAccent: "#123456" });
    expect(getResolvedAccent()).toBe(result.current);
  });
});

describe("resolveCustomAccentTheme", () => {
  it("overrides the accent roles and caches per scheme + hex", () => {
    const base = resolveTheme("dark", "dark");
    const themed = resolveCustomAccentTheme(base, "dark", "#3366cc");
    expect(themed.background).toBe(base.background);
    expect(themed.accent).not.toBe(base.accent);
    expect(resolveCustomAccentTheme(base, "dark", "#3366cc")).toBe(themed);
  });

  it("lifts a too-dark custom accent to a readable shade of the same hue", () => {
    const base = resolveTheme("dark", "dark");
    const themed = resolveCustomAccentTheme(base, "dark", "#0c390f");
    expect(themed.accent).not.toBe("#0c390f");
    expect(contrastRatio(themed.accent, base.background)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(themed.accent, base.card)).toBeGreaterThanOrEqual(3);
    // Still green: the green channel dominates.
    const g = Number.parseInt(themed.accent.slice(3, 5), 16);
    expect(g).toBeGreaterThan(Number.parseInt(themed.accent.slice(1, 3), 16));
  });
});
