import {
  ApiError,
  apiFetch,
  setTokenRefresher,
  WEB_COOKIE_SESSION_TOKEN,
} from "@munib-tracker/api-client";

import { fakeResponse, mockFetch } from "@/test-support/fetch";

describe("apiFetch auth refresh", () => {
  afterEach(() => setTokenRefresher(null));

  it("does not re-enter the token refresher for /auth/refresh (avoids deadlock)", async () => {
    let refresherCalls = 0;
    setTokenRefresher(async () => {
      refresherCalls += 1;
      return WEB_COOKIE_SESSION_TOKEN;
    });

    const fetchMock = mockFetch(
      fakeResponse({ message: "Invalid or expired refresh token" }, { status: 401 }),
    );

    await expect(
      apiFetch(
        { url: "/auth/refresh", method: "POST", body: JSON.stringify({}) },
        { skipAuthRefresh: true },
      ),
    ).rejects.toBeInstanceOf(ApiError);

    expect(refresherCalls).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("skips refresh for /auth/refresh even without skipAuthRefresh", async () => {
    let refresherCalls = 0;
    setTokenRefresher(async () => {
      refresherCalls += 1;
      return "new-token";
    });

    mockFetch(fakeResponse({ message: "Invalid or expired refresh token" }, { status: 401 }));

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

    const fetchMock = mockFetch(
      fakeResponse({ message: "expired" }, { status: 401 }),
      fakeResponse({ userId: "u1", accountType: "user" }),
    );

    const body = await apiFetch<{ userId: string }>(
      { url: "/auth/me", method: "GET" },
      { accessToken: "stale-token" },
    );

    expect(body.userId).toBe("u1");
    expect(refresherCalls).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const retryHeaders = (fetchMock.mock.calls[1] as unknown as [string, RequestInit])[1]
      .headers as Record<string, string>;
    expect(retryHeaders.Authorization).toBe("Bearer fresh-access-token");
  });

  it("does not clear-and-retry when the refresher returns null", async () => {
    setTokenRefresher(async () => null);

    const fetchMock = mockFetch(fakeResponse({ message: "unauthorized" }, { status: 401 }));

    await expect(
      apiFetch({ url: "/auth/me", method: "GET" }, { accessToken: "stale-token" }),
    ).rejects.toMatchObject({ status: 401 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
