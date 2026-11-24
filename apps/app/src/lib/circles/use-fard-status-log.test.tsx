import { act, renderHook } from "@testing-library/react-native";

import { ALL_FIVE, makeFardSignal } from "@/test-support/circles";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { createQueryWrapper } from "@/test-support/nearby";

jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/lib/circles/api", () => ({
  ...jest.requireActual("@/lib/circles/api"),
  putFardStatus: jest.fn(),
}));

import * as api from "@/lib/circles/api";

import { EMPTY_FARD_STATUS, fardOn } from "./family";
import { circleKeys, useFardStatusLog } from "./hooks";

const FROM = "2026-11-18";
const TODAY = "2026-11-24";
const KEY = circleKeys.signals("u-1", "c-1", FROM, TODAY);

beforeEach(() => {
  resetAuthMock();
  setMockAuth({
    session: { accessToken: "tok", userId: "u-1" },
    isAuthenticated: true,
    isGuest: false,
  });
  jest.mocked(api.putFardStatus).mockReset();
});

async function setup(initial: api.CircleSignal[]) {
  const { client, QueryWrapper } = createQueryWrapper();
  // The screen's signals query keeps this cached; with no observer here, keep it from being collected.
  client.setQueryDefaults(["circles"], { gcTime: Number.POSITIVE_INFINITY });
  client.setQueryData(KEY, initial);
  const hook = await renderHook(() => useFardStatusLog("c-1", FROM, TODAY), {
    wrapper: QueryWrapper,
  });
  return { client, hook };
}

describe("useFardStatusLog", () => {
  it("two quick taps send cumulative values (the second never reverts the first)", async () => {
    const pending: Array<() => void> = [];
    jest.mocked(api.putFardStatus).mockImplementation(
      (_token, _circle, input) =>
        new Promise((resolve) => {
          pending.push(() => resolve(makeFardSignal(input.memberId ?? "", input.date, input)));
        }),
    );
    const { client, hook } = await setup([]);

    let first: Promise<void> = Promise.resolve();
    let second: Promise<void> = Promise.resolve();
    await act(async () => {
      first = hook.result.current.toggle("kid-1", TODAY, "fajr");
      second = hook.result.current.toggle("kid-1", TODAY, "dhuhr");
    });

    // Optimistic: both ticks show straight away.
    expect(fardOn(client.getQueryData(KEY) ?? [], "kid-1", TODAY)).toEqual({
      ...EMPTY_FARD_STATUS,
      fajr: true,
      dhuhr: true,
    });
    const calls = jest.mocked(api.putFardStatus).mock.calls;
    expect(calls[0]?.[2]).toMatchObject({ memberId: "kid-1", date: TODAY, fajr: true });
    expect(calls[1]?.[2]).toMatchObject({ fajr: true, dhuhr: true });

    await act(async () => {
      for (const resolve of pending) resolve();
      await Promise.all([first, second]);
    });
  });

  it("rolls the day back and rethrows when the write fails", async () => {
    jest.mocked(api.putFardStatus).mockRejectedValue(new Error("offline"));
    const { client, hook } = await setup([makeFardSignal("kid-1", TODAY, ALL_FIVE)]);

    let error: unknown;
    await act(async () => {
      await hook.result.current.toggle("kid-1", TODAY, "isha").catch((e: unknown) => {
        error = e;
      });
    });
    expect(error).toBeInstanceOf(Error);
    expect(fardOn(client.getQueryData(KEY) ?? [], "kid-1", TODAY)).toEqual(ALL_FIVE);
  });
});
