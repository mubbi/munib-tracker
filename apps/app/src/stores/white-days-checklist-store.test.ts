import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import {
  useEnsureWhiteDaysChecklistLoaded,
  useWhiteDaysChecklistActions,
  useWhiteDaysChecklistForMonth,
  whiteDaysCheckKey,
  whiteDaysChecklistStore,
} from "./white-days-checklist-store";

const MONTH_A = "1448-2";
const MONTH_B = "1448-3";

beforeEach(async () => {
  await AsyncStorage.clear();
  whiteDaysChecklistStore.setState({ done: {}, isReady: false });
});

describe("white-days-checklist-store", () => {
  it("scopes toggles by item id and Hijri month", async () => {
    const { toggle } = whiteDaysChecklistStore.getState();

    await toggle("day13", MONTH_A);
    expect(whiteDaysChecklistStore.getState().done).toEqual({
      [whiteDaysCheckKey("day13", MONTH_A)]: true,
    });

    // Same item, different month → independent bucket.
    await toggle("day13", MONTH_B);
    expect(whiteDaysChecklistStore.getState().done[whiteDaysCheckKey("day13", MONTH_B)]).toBe(true);
    expect(whiteDaysChecklistStore.getState().done[whiteDaysCheckKey("day13", MONTH_A)]).toBe(true);
  });

  it("toggles a day back off", async () => {
    const { toggle } = whiteDaysChecklistStore.getState();
    await toggle("day14", MONTH_A);
    await toggle("day14", MONTH_A);
    expect(whiteDaysChecklistStore.getState().done).toEqual({});
  });

  it("clears only the given month on resetMonth", async () => {
    const { toggle, resetMonth } = whiteDaysChecklistStore.getState();
    await toggle("day13", MONTH_A);
    await toggle("day15", MONTH_A);
    await toggle("day13", MONTH_B);

    await resetMonth(MONTH_A);

    expect(whiteDaysChecklistStore.getState().done).toEqual({
      [whiteDaysCheckKey("day13", MONTH_B)]: true,
    });
  });

  it("reloads persisted rows from disk", async () => {
    await whiteDaysChecklistStore.getState().toggle("day15", MONTH_A);

    whiteDaysChecklistStore.setState({ done: {}, isReady: false });
    await whiteDaysChecklistStore.getState().load();

    expect(whiteDaysChecklistStore.getState().isReady).toBe(true);
    expect(whiteDaysChecklistStore.getState().done).toEqual({
      [whiteDaysCheckKey("day15", MONTH_A)]: true,
    });
  });
});

describe("white days hooks", () => {
  function setup(monthKey: string) {
    return renderHook(() => {
      useEnsureWhiteDaysChecklistLoaded();
      return {
        forMonth: useWhiteDaysChecklistForMonth(monthKey),
        actions: useWhiteDaysChecklistActions(),
      };
    });
  }

  it("load on mount and filter rows to the month", async () => {
    await whiteDaysChecklistStore.getState().toggle("day13", MONTH_A);
    await whiteDaysChecklistStore.getState().toggle("day14", MONTH_B);
    whiteDaysChecklistStore.setState({ done: {}, isReady: false });

    const { result } = await setup(MONTH_A);

    await waitFor(() => expect(result.current.forMonth).toEqual({ day13: true }));
  });

  it("ignore entries explicitly marked false", async () => {
    whiteDaysChecklistStore.setState({
      isReady: true,
      done: { [whiteDaysCheckKey("day13", MONTH_A)]: false },
    });
    const { result } = await setup(MONTH_A);
    expect(result.current.forMonth).toEqual({});
  });

  it("route actions to the store", async () => {
    const { result } = await setup(MONTH_A);
    await act(async () => {
      await result.current.actions.load();
      await result.current.actions.toggle("day15", MONTH_A);
    });
    expect(result.current.forMonth).toEqual({ day15: true });

    await act(async () => {
      await result.current.actions.resetMonth(MONTH_A);
    });
    expect(result.current.forMonth).toEqual({});
  });
});
