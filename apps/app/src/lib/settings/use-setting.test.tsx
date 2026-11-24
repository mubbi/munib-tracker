import { act, renderHook } from "@testing-library/react-native";

import { resetSettingsStores } from "@/test-support/settings";

import { useSetting } from "./use-setting";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

const { rescheduleAll } = jest.requireMock("@/notifications/scheduler") as {
  rescheduleAll: jest.Mock;
};

beforeEach(async () => {
  await resetSettingsStores();
  rescheduleAll.mockClear();
});

describe("useSetting", () => {
  it("returns the value, def and enabled state", async () => {
    const { result } = await renderHook(() => useSetting<string>("language.timeFormat"));
    expect(result.current.value).toBe("24");
    expect(result.current.def.group).toBe("language");
    expect(result.current.enabled).toBe(true);
  });

  it("re-renders only when its own value changes", async () => {
    let renders = 0;
    const { result } = await renderHook(() => {
      renders += 1;
      return useSetting<string>("language.defaultCalendar");
    });
    const before = renders;
    // An unrelated write (another store field) must not re-render this row.
    const other = await renderHook(() => useSetting<string>("language.timeFormat"));
    await act(async () => {
      await other.result.current.setValue("12");
    });
    expect(renders).toBe(before);
    await act(async () => {
      await result.current.setValue("gregorian");
    });
    expect(renders).toBeGreaterThan(before);
    expect(result.current.value).toBe("gregorian");
  });

  it("runs declared side effects: reminder settings reschedule", async () => {
    const { result } = await renderHook(() => useSetting<boolean>("notifications.content.friday"));
    await act(async () => {
      await result.current.setValue(true);
    });
    expect(rescheduleAll).toHaveBeenCalledTimes(1);
  });

  it("settings without side effects don't reschedule", async () => {
    const { result } = await renderHook(() => useSetting<boolean>("content.hadith.showGrade"));
    await act(async () => {
      await result.current.setValue(false);
    });
    expect(rescheduleAll).not.toHaveBeenCalled();
    expect(result.current.value).toBe(false);
  });

  it("throws for an unknown id", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useSetting("nope.nothing"))).rejects.toThrow(/Unknown setting/);
  });
});
