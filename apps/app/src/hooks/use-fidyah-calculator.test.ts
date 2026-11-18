import { act, renderHook } from "@testing-library/react-native";

import { FidyahCalculatorRepository } from "@/db/repositories/fidyah-calculator-repository";
import { deferred } from "@/test-support/async";
import {
  resetMockDeviceLocales,
  setMockDeviceLocales,
} from "@/test-support/mocks/expo-localization";

import { useFidyahCalculator } from "./use-fidyah-calculator";

jest.mock("@/db/repositories/fidyah-calculator-repository", () => ({
  FidyahCalculatorRepository: {
    load: jest.fn(),
    save: jest.fn(async () => undefined),
    clear: jest.fn(async () => undefined),
  },
}));

const repo = FidyahCalculatorRepository as unknown as Record<"load" | "save" | "clear", jest.Mock>;

const SAVED = { currencyCode: "EUR", scenario: "kaffarah", days: "2", mealCost: "5" };

async function setup() {
  const hook = await renderHook(() => useFidyahCalculator());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  repo.load.mockImplementation(async (currencyCode: string) => ({
    currencyCode,
    scenario: "fidyah",
    days: "",
    mealCost: "",
  }));
});

afterEach(() => {
  jest.useRealTimers();
  resetMockDeviceLocales();
});

describe("useFidyahCalculator", () => {
  it("starts empty with the USD fallback", async () => {
    const { result } = await setup();
    expect(repo.load).toHaveBeenCalledWith("USD");
    expect(result.current.ready).toBe(true);
    expect(result.current.currencyCode).toBe("USD");
    expect(result.current.hasInput).toBe(false);
  });

  it.each([
    [[{ currencyCode: "gbp" }], "GBP"],
    [[{ currencyCode: "XYZ" }], "USD"],
    [[], "USD"],
  ])("resolves the device currency %j to %s", async (locales, expected) => {
    setMockDeviceLocales(locales);
    await setup();
    expect(repo.load).toHaveBeenCalledWith(expected);
  });

  it("restores the saved draft", async () => {
    repo.load.mockResolvedValueOnce(SAVED);
    const { result } = await setup();
    expect(result.current.currencyCode).toBe("EUR");
    expect(result.current.scenario).toBe("kaffarah");
    expect(result.current.result.mealsDue).toBe(120);
    expect(result.current.result.amountEstimate).toBe(600);
    expect(result.current.hasInput).toBe(true);
  });

  it("ignores a draft that loads after unmount", async () => {
    const draft = deferred<typeof SAVED>();
    repo.load.mockReturnValueOnce(draft.promise);
    const { result, unmount } = await renderHook(() => useFidyahCalculator());
    await unmount();
    await act(async () => draft.resolve(SAVED));
    expect(result.current.ready).toBe(false);
  });

  it("estimates fidyah from days and meal cost", async () => {
    const { result } = await setup();
    await act(async () => {
      result.current.setDays("3");
    });
    await act(async () => {
      result.current.setMealCost("4.5");
    });
    expect(result.current.result.amountEstimate).toBe(13.5);
    expect(result.current.hasInput).toBe(true);
    expect(result.current.money(13.5)).toContain("13.50");
  });

  it("debounces saving the latest values", async () => {
    jest.useFakeTimers();
    const { result } = await setup();
    await act(async () => {
      result.current.setScenario("kaffarah");
    });
    await act(async () => {
      result.current.setCurrencyCode("EUR");
    });
    expect(repo.save).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(350);
    });
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({
      currencyCode: "EUR",
      scenario: "kaffarah",
      days: "",
      mealCost: "",
    });
  });

  it("resets the inputs and clears the saved draft", async () => {
    repo.load.mockResolvedValueOnce(SAVED);
    const { result } = await setup();
    await act(async () => {
      await result.current.reset();
    });
    expect(result.current.scenario).toBe("fidyah");
    expect(result.current.days).toBe("");
    expect(result.current.currencyCode).toBe("EUR");
    expect(repo.clear).toHaveBeenCalled();
  });
});
