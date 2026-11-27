import { MADHHAB_RULES } from "@munib-tracker/shared/fiqh";
import { act, renderHook } from "@testing-library/react-native";

import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useMadhhab, useMadhhabFor } from "./use-madhhab";

afterEach(resetPreferences);

async function madhhab() {
  const { result } = await renderHook(() => useMadhhab());
  return result;
}

describe("useMadhhab", () => {
  it("reports never-asked users as unset and all-views", async () => {
    await setPreferences({});
    const r = await madhhab();
    expect(r.current).toMatchObject({ madhhab: undefined, isUnset: true, isAllViews: true });
    expect(r.current.schoolFor("salah")).toBeNull();
    expect(r.current.rules("salah")).toBeNull();
  });

  it("treats an explicit null as all views but not unset", async () => {
    await setPreferences({ madhhab: null });
    const r = await madhhab();
    expect(r.current).toMatchObject({ madhhab: null, isUnset: false, isAllViews: true });
  });

  it("resolves the global school, domain overrides and custom values", async () => {
    await setPreferences({
      madhhab: "hanafi",
      madhhabOverrides: { zakat: "shafii" },
      fiqhCustom: { haydMaxDays: 12 },
    });
    const r = await madhhab();
    expect(r.current.isAllViews).toBe(false);
    expect(r.current.schoolFor("salah")).toBe("hanafi");
    expect(r.current.schoolFor("zakat")).toBe("shafii");
    expect(r.current.rules("zakat")?.zakat.personalJewelleryZakatable).toBe(false);
    expect(r.current.rules("taharah")?.hayd.maxDays).toBe(12);
    expect(r.current.resolve("zakat")).toMatchObject({
      school: "shafii",
      isOverride: true,
      customKeys: ["haydMaxDays"],
    });
  });

  it("re-renders with new rules when the school changes", async () => {
    await setPreferences({ madhhab: "hanafi" });
    const r = await madhhab();
    expect(r.current.rules("salah")?.witr.status).toBe("wajib");
    await act(() => setPreferences({ madhhab: "maliki" }));
    expect(r.current.rules("salah")).toBe(MADHHAB_RULES.maliki);
  });

  it("ignores a malformed synced value", async () => {
    await setPreferences({ madhhab: "zahiri" as never });
    const r = await madhhab();
    expect(r.current).toMatchObject({ madhhab: undefined, isUnset: true });
  });
});

describe("useMadhhabFor", () => {
  it("returns the school for one domain", async () => {
    await setPreferences({ madhhab: "hanbali", madhhabOverrides: { travel: null } });
    const { result } = await renderHook(() => [useMadhhabFor("salah"), useMadhhabFor("travel")]);
    expect(result.current).toEqual(["hanbali", null]);
  });
});
