import { renderHook } from "@testing-library/react-native";

import { loadQuranAyahRange } from "@/lib/quran-ayah-range";
import { tanstackQueryOptionsMock } from "@/test-support/mocks/tanstack-query";

import { useQuranAyahRange } from "./use-quran-ayah-range";

jest.mock(
  "@tanstack/react-query",
  () => require("@/test-support/mocks/tanstack-query").tanstackQueryOptionsMock,
);
jest.mock("@/lib/quran-ayah-range", () => ({ loadQuranAyahRange: jest.fn() }));

/** The options the last `useQuery` call received (this hook unwraps the result). */
function lastOptions() {
  const calls = tanstackQueryOptionsMock.useQuery.mock.calls;
  return calls[calls.length - 1][0];
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useQuranAyahRange", () => {
  it("loads a single ayah when no end is given", async () => {
    await renderHook(() => useQuranAyahRange(2, 255));
    const options = lastOptions();
    expect(options.queryKey).toEqual(["quran-ayah-range", 2, 255, 255]);
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(loadQuranAyahRange).toHaveBeenCalledWith(2, 255, undefined);
  });

  it("returns the loaded texts", async () => {
    tanstackQueryOptionsMock.useQuery.mockReturnValueOnce({ data: { arabic: "A" } } as never);
    const { result } = await renderHook(() => useQuranAyahRange(1, 1, 7));
    expect(lastOptions().queryKey).toEqual(["quran-ayah-range", 1, 1, 7]);
    expect(result.current).toEqual({ arabic: "A" });
  });

  it.each([
    [0, 1],
    [115, 1],
    [1, 0],
  ])("is disabled for surah %i ayah %i", async (surah, ayah) => {
    await renderHook(() => useQuranAyahRange(surah, ayah));
    expect(lastOptions().enabled).toBe(false);
  });
});
