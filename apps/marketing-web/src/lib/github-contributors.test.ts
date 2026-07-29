import { describe, expect, it } from "vitest";
import { filterHumanContributors, type GitHubContributor } from "./github-contributors";

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
