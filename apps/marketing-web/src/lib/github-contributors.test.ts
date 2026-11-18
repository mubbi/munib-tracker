import { OFFICIAL_SITE_ORIGIN } from "@munib-tracker/shared/constants";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchGitHubContributors,
  filterHumanContributors,
  type GitHubContributor,
  getFallbackContributors,
  getGitHubContributorsGraphUrl,
  getGitHubRepoUrl,
  getMarketingAttributionNotice,
} from "./github-contributors";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

function stub(
  partial: Partial<GitHubContributor> & Pick<GitHubContributor, "login">,
): GitHubContributor {
  return {
    id: 1,
    avatar_url: "https://github.com/example.png",
    html_url: "https://github.com/example",
    contributions: 1,
    type: "User",
    ...partial,
  };
}

describe("filterHumanContributors", () => {
  it("keeps human users and drops bots", () => {
    const result = filterHumanContributors([
      stub({ login: "mubbi" }),
      stub({ login: "dependabot[bot]", type: "Bot" }),
      stub({ login: "github-actions[bot]" }),
      stub({ login: "some-bot[bot]" }),
    ]);
    expect(result.map((c) => c.login)).toEqual(["mubbi"]);
  });
});

describe("fetchGitHubContributors", () => {
  function setup(fetchImpl: () => Promise<Response>) {
    const fetchMock = vi.fn(fetchImpl);
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns human contributors from the GitHub API", async () => {
    const fetchMock = setup(async () =>
      Response.json([stub({ login: "mubbi" }), stub({ login: "renovate[bot]" })]),
    );
    await expect(fetchGitHubContributors()).resolves.toEqual([stub({ login: "mubbi" })]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/contributors"),
      expect.objectContaining({
        headers: expect.objectContaining({ "User-Agent": expect.any(String) }),
      }),
    );
  });

  it("returns an empty list when GitHub responds with an error status", async () => {
    setup(async () => new Response("rate limited", { status: 403 }));
    await expect(fetchGitHubContributors()).resolves.toEqual([]);
    expect(console.warn).toHaveBeenCalledWith("[contributors] GitHub API 403");
  });

  it("returns an empty list when the request fails", async () => {
    setup(async () => {
      throw new Error("offline");
    });
    await expect(fetchGitHubContributors()).resolves.toEqual([]);
  });
});

describe("github-contributors links", () => {
  it("points at the public repository and its contributor graph", () => {
    expect(getGitHubRepoUrl()).toMatch(/^https:\/\/github\.com\/[^/]+\/munib-tracker$/);
    expect(getGitHubContributorsGraphUrl()).toBe(`${getGitHubRepoUrl()}/graphs/contributors`);
  });

  it("falls back to crediting the primary author", () => {
    expect(getFallbackContributors()).toEqual([
      expect.objectContaining({ login: "mubbi", type: "User" }),
    ]);
  });

  it("builds the attribution notice from the official origin", () => {
    expect(getMarketingAttributionNotice()).toBe(`Munib Tracker — ${OFFICIAL_SITE_ORIGIN}`);
  });
});
