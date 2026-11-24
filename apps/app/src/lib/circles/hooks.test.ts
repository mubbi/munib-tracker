import { ApiError } from "@munib-tracker/api-client";

jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);

import { CIRCLE_QUERY_RETRIES, circleKeys, shouldRetryCircleQuery } from "./hooks";

describe("shouldRetryCircleQuery", () => {
  it("never retries a 4xx answer (not a member, gone, forbidden, rate limited)", () => {
    for (const status of [400, 401, 403, 404, 409, 410, 429]) {
      expect(shouldRetryCircleQuery(0, new ApiError("x", status))).toBe(false);
    }
  });

  it("retries network failures and 5xx a bounded number of times", () => {
    for (const error of [new TypeError("Network request failed"), new ApiError("x", 503)]) {
      expect(shouldRetryCircleQuery(0, error)).toBe(true);
      expect(shouldRetryCircleQuery(CIRCLE_QUERY_RETRIES - 1, error)).toBe(true);
      expect(shouldRetryCircleQuery(CIRCLE_QUERY_RETRIES, error)).toBe(false);
    }
  });
});

describe("circleKeys", () => {
  it("scopes every account key under the user's root, so one invalidation refreshes all", () => {
    const root = circleKeys.root("u-1");
    const keys = [
      circleKeys.list("u-1"),
      circleKeys.detail("u-1", "c"),
      circleKeys.signals("u-1", "c", "2026-11-01", "2026-11-07"),
      circleKeys.khatm("u-1", "c", "k"),
      circleKeys.fardLog("u-1", "c"),
      circleKeys.nearbyRequests("u-1", "c", "s"),
    ];
    for (const key of keys) expect(key.slice(0, root.length)).toEqual([...root]);
  });

  it("keeps the child-device key off any account root (and its shape stable)", () => {
    expect(circleKeys.childDeviceSignals("kid", "a", "b")).toEqual([
      "circles",
      "child-device",
      "kid",
      "a",
      "b",
    ]);
    expect(circleKeys.root(undefined)).toEqual(["circles", "anon"]);
  });
});
