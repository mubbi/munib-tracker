import { getLocalDateString } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import { khatmTotalForUnit } from "@/lib/khatm";

import { khatmStore, useEnsureKhatmLoaded, useKhatm, useKhatmActions } from "./khatm-store";

const PLAN = { days: 30, startDate: "2026-07-01", unit: "page" as const };

beforeEach(async () => {
  await AsyncStorage.clear();
  khatmStore.setState({ plan: null, ayahsRead: 0, unit: "ayah", isReady: false });
});

const state = () => khatmStore.getState();
const stored = () => readJSON(DB_KEYS.khatm, null);

describe("load", () => {
  it("defaults to no plan in ayah units", async () => {
    await state().load();
    expect(state()).toMatchObject({ plan: null, ayahsRead: 0, unit: "ayah", isReady: true });
  });

  it.each([
    ["the stored unit", { plan: PLAN, ayahsRead: 4, unit: "ayah" }, "ayah"],
    ["the plan's unit for legacy rows", { plan: PLAN, ayahsRead: 4 }, "page"],
    ["ayah when neither is set", { plan: null, ayahsRead: 4 }, "ayah"],
  ])("uses %s", async (_label, data, unit) => {
    await writeJSON(DB_KEYS.khatm, data);
    await state().load();
    expect(state()).toMatchObject({ ayahsRead: 4, unit });
  });
});

describe("actions", () => {
  it("start creates a plan from today and resets progress", async () => {
    khatmStore.setState({ ayahsRead: 99 });
    await state().start(60, "page");
    const plan = { days: 60, startDate: getLocalDateString(), unit: "page" };
    expect(state()).toMatchObject({ plan, ayahsRead: 0, unit: "page" });
    expect(await stored()).toEqual({ plan, ayahsRead: 0, unit: "page" });
  });

  it("start defaults to ayah units", async () => {
    await state().start(30);
    expect(state().plan?.unit).toBe("ayah");
  });

  it.each([
    [12.6, 13],
    [-5, 0],
    [1e9, khatmTotalForUnit("ayah")],
  ])("setAyahsRead(%p) rounds and clamps to %p", async (input, expected) => {
    await state().setAyahsRead(input);
    expect(state().ayahsRead).toBe(expected);
    expect(await stored()).toMatchObject({ ayahsRead: expected, unit: "ayah" });
  });

  it("setAyahsRead clamps to the page total when tracking pages", async () => {
    khatmStore.setState({ unit: undefined, plan: PLAN });
    await state().setAyahsRead(10_000);
    expect(state().ayahsRead).toBe(khatmTotalForUnit("page"));
  });

  it("setAyahsRead falls back to ayah units with no unit or plan", async () => {
    khatmStore.setState({ unit: undefined, plan: null });
    await state().setAyahsRead(10_000);
    expect(state().ayahsRead).toBe(khatmTotalForUnit("ayah"));
  });

  it("setUnit switches the plan's unit and resets progress", async () => {
    khatmStore.setState({ plan: PLAN, ayahsRead: 30, unit: "page" });
    await state().setUnit("ayah");
    expect(state()).toMatchObject({ plan: { ...PLAN, unit: "ayah" }, ayahsRead: 0, unit: "ayah" });
  });

  it("setUnit without a plan only changes the unit", async () => {
    await state().setUnit("page");
    expect(await stored()).toEqual({ plan: null, ayahsRead: 0, unit: "page" });
  });

  it("clear removes the plan", async () => {
    khatmStore.setState({ plan: PLAN, ayahsRead: 30, unit: "page" });
    await state().clear();
    expect(await stored()).toEqual({ plan: null, ayahsRead: 0, unit: "ayah" });
  });
});

describe("hooks", () => {
  function setup() {
    return renderHook(() => {
      useEnsureKhatmLoaded();
      return { khatm: useKhatm(), actions: useKhatmActions(), ready: state().isReady };
    });
  }

  it("load the plan on mount", async () => {
    await writeJSON(DB_KEYS.khatm, { plan: PLAN, ayahsRead: 5, unit: "page" });
    const { result } = await setup();
    await waitFor(() =>
      expect(result.current.khatm).toEqual({ plan: PLAN, ayahsRead: 5, unit: "page" }),
    );
  });

  it("derive the unit from the plan when the store has none", async () => {
    khatmStore.setState({ isReady: true, unit: undefined, plan: PLAN });
    const { result } = await setup();
    expect(result.current.khatm.unit).toBe("page");
  });

  it("default the unit to ayah", async () => {
    khatmStore.setState({ isReady: true, unit: undefined, plan: null });
    const { result } = await setup();
    expect(result.current.khatm.unit).toBe("ayah");
  });

  it("route actions to the store", async () => {
    const { result } = await setup();
    await act(async () => {
      await result.current.actions.load();
      await result.current.actions.start(30, "page");
      await result.current.actions.setAyahsRead(10);
      await result.current.actions.setUnit("ayah");
      await result.current.actions.setAyahsRead(3);
    });
    expect(result.current.khatm).toMatchObject({ ayahsRead: 3, unit: "ayah" });

    await act(async () => {
      await result.current.actions.clear();
    });
    expect(result.current.khatm.plan).toBeNull();
  });
});
