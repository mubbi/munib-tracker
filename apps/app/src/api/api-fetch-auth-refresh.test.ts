import {
  ApiError,
  apiFetch,
  setTokenRefresher,
  WEB_COOKIE_SESSION_TOKEN,
} from "@munib-tracker/api-client";

describe("apiFetch auth refresh", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    setTokenRefresher(null);
    globalThis.fetch = originalFetch;
  });

  it("does not re-enter the token refresher for /auth/refresh (avoids deadlock)", async () => {
    let refresherCalls = 0;
    setTokenRefresher(async () => {
      refresherCalls += 1;
      return WEB_COOKIE_SESSION_TOKEN;
    });

    globalThis.fetch = jest.fn(async () =>
      Response.json({ message: "Invalid or expired refresh token" }, { status: 401 }),
    ) as typeof fetch;

    await expect(
      apiFetch(
        { url: "/auth/refresh", method: "POST", body: JSON.stringify({}) },
        { skipAuthRefresh: true },
      ),
    ).rejects.toBeInstanceOf(ApiError);

    expect(refresherCalls).toBe(0);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("skips refresh for /auth/refresh even without skipAuthRefresh", async () => {
    let refresherCalls = 0;
    setTokenRefresher(async () => {
      refresherCalls += 1;
      return "new-token";
    });

    globalThis.fetch = jest.fn(async () =>
      Response.json({ message: "Invalid or expired refresh token" }, { status: 401 }),
    ) as typeof fetch;

    await expect(
      apiFetch({ url: "/auth/refresh", method: "POST", body: JSON.stringify({}) }),
    ).rejects.toMatchObject({ status: 401 });

    expect(refresherCalls).toBe(0);
  });

  it("refreshes once then retries other authenticated endpoints on 401", async () => {
    let refresherCalls = 0;
    setTokenRefresher(async () => {
      refresherCalls += 1;
      return "fresh-access-token";
    });

    globalThis.fetch = jest
      .fn()
      .mockResolvedValueOnce(Response.json({ message: "expired" }, { status: 401 }))
      .mockResolvedValueOnce(Response.json({ userId: "u1", accountType: "user" })) as typeof fetch;

    const body = await apiFetch<{ userId: string }>(
      { url: "/auth/me", method: "GET" },
      { accessToken: "stale-token" },
    );

    expect(body.userId).toBe("u1");
    expect(refresherCalls).toBe(1);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    const retryHeaders = (globalThis.fetch as jest.Mock).mock.calls[1][1].headers as Record<
      string,
      string
    >;
    expect(retryHeaders.Authorization).toBe("Bearer fresh-access-token");
  });

  it("does not clear-and-retry when the refresher returns null", async () => {
    setTokenRefresher(async () => null);

    globalThis.fetch = jest.fn(async () =>
      Response.json({ message: "unauthorized" }, { status: 401 }),
    ) as typeof fetch;

    await expect(
      apiFetch({ url: "/auth/me", method: "GET" }, { accessToken: "stale-token" }),
    ).rejects.toMatchObject({ status: 401 });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
