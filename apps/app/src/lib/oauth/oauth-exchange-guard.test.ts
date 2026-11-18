import { deferred } from "@/test-support/async";

import {
  clearAppleAuthorizationCodeExchangeGuard,
  getOrCreateAppleOAuthExchange,
  shouldSkipAppleAuthorizationCodeExchange,
} from "./apple-oauth-exchange-guard";
import {
  clearGoogleAuthorizationCodeExchangeGuard,
  getOrCreateGoogleOAuthExchange,
  shouldSkipGoogleAuthorizationCodeExchange,
} from "./google-oauth-exchange-guard";

const guards = [
  {
    name: "Google",
    run: getOrCreateGoogleOAuthExchange as (
      code: string,
      start: () => Promise<unknown>,
    ) => Promise<unknown>,
    skip: shouldSkipGoogleAuthorizationCodeExchange,
    clear: clearGoogleAuthorizationCodeExchangeGuard,
    result: "token",
  },
  {
    name: "Apple",
    run: getOrCreateAppleOAuthExchange as (
      code: string,
      start: () => Promise<unknown>,
    ) => Promise<unknown>,
    skip: shouldSkipAppleAuthorizationCodeExchange,
    clear: clearAppleAuthorizationCodeExchangeGuard,
    result: undefined,
  },
];

describe.each(guards)("$name OAuth exchange guard", ({ run, skip, clear, result }) => {
  beforeEach(clear);

  it("shares one in-flight exchange between concurrent callers", async () => {
    const pending = deferred<unknown>();
    const start = jest.fn(() => pending.promise);
    const first = run("code-1", start);
    const second = run("code-1", start);
    pending.resolve(result);
    await expect(first).resolves.toBe(result);
    await expect(second).resolves.toBe(result);
    expect(start).toHaveBeenCalledTimes(1);
  });

  it("skips a code that was already exchanged", async () => {
    await run("code-2", async () => result);
    expect(skip("code-2")).toBe(true);
    const start = jest.fn(async () => result);
    await expect(run("code-2", start)).resolves.toBeNull();
    expect(start).not.toHaveBeenCalled();
  });

  it("allows a retry after a failed exchange", async () => {
    await expect(
      run("code-3", async () => Promise.reject(new Error("invalid_grant"))),
    ).rejects.toThrow("invalid_grant");
    expect(skip("code-3")).toBe(false);
    await expect(run("code-3", async () => result)).resolves.toBe(result);
  });

  it("forgets exchanged codes when cleared", async () => {
    await run("code-4", async () => result);
    clear();
    expect(skip("code-4")).toBe(false);
  });
});
