import { apiFetch, isApiOriginUrl, setTokenRefresher } from "@munib-tracker/api-client";

import { fakeResponse, mockFetch } from "@/test-support/fetch";

/** Bearer header + credentials mode `apiFetch` used for its (single) request. */
function sentAuth(fetchMock: jest.Mock): { authorization?: string; credentials?: string } {
  const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  const headers = init.headers as Record<string, string>;
  return { authorization: headers.Authorization, credentials: init.credentials };
}

describe("apiFetch session scoping", () => {
  const prev = process.env.EXPO_PUBLIC_API_URL;

  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.munibtracker.app/api/v1";
  });

  afterAll(() => {
    if (prev === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = prev;
    }
  });

  afterEach(() => setTokenRefresher(null));

  it.each([
    ["a relative path", "/auth/me", true],
    ["an Orval /api/v1 path", "/api/v1/sync", true],
    ["an absolute API URL", "https://api.munibtracker.app/api/v1/auth/me", true],
    ["another host", "https://cdn.example.com/data.json", false],
    ["the API host over http", "http://api.munibtracker.app/api/v1/auth/me", false],
    ["the API host on another port", "https://api.munibtracker.app:8443/api/v1/x", false],
    ["a lookalike host", "https://api.munibtracker.app.evil.example/api/v1", false],
  ])("treats %s as API origin: %s", (_label, url, expected) => {
    expect(isApiOriginUrl(url)).toBe(expected);
  });

  it("keeps Bearer + credentials for relative API paths", async () => {
    const fetchMock = mockFetch(fakeResponse({ ok: true }));
    await apiFetch({ url: "/auth/me", method: "GET" }, { accessToken: "jwt-abc" });
    expect(sentAuth(fetchMock)).toEqual({
      authorization: "Bearer jwt-abc",
      credentials: "include",
    });
  });

  it("keeps Bearer + credentials for an absolute URL on the API origin", async () => {
    const fetchMock = mockFetch(fakeResponse({ ok: true }));
    await apiFetch(
      { url: "https://api.munibtracker.app/api/v1/auth/me", method: "GET" },
      { accessToken: "jwt-abc" },
    );
    expect(sentAuth(fetchMock)).toEqual({
      authorization: "Bearer jwt-abc",
      credentials: "include",
    });
  });

  it("never sends the token or cookies to a foreign origin", async () => {
    const fetchMock = mockFetch(fakeResponse({ ok: true }));
    await apiFetch(
      { url: "https://attacker.example/collect", method: "GET" },
      { accessToken: "jwt-abc" },
    );
    expect(sentAuth(fetchMock)).toEqual({
      authorization: undefined,
      credentials: "same-origin",
    });
  });

  it("does not run the token refresher on a foreign-origin 401", async () => {
    const refresher = jest.fn(async () => "new-token");
    setTokenRefresher(refresher);
    const fetchMock = mockFetch(fakeResponse({ message: "nope" }, { status: 401 }));

    await expect(
      apiFetch({ url: "https://attacker.example/x", method: "GET" }, { accessToken: "jwt-abc" }),
    ).rejects.toMatchObject({ status: 401 });

    expect(refresher).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
