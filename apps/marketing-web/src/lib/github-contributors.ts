import { OFFICIAL_SITE_ORIGIN } from "@munib-tracker/shared/constants";
import { cacheLife, cacheTag } from "next/cache";

const GITHUB_REPO = "mubbi/munib-tracker";
const CONTRIBUTORS_API = `https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=100`;

const BOT_LOGINS = new Set([
  "dependabot[bot]",
  "dependabot-preview[bot]",
  "github-actions[bot]",
  "renovate[bot]",
  "imgbot[bot]",
  "allcontributors[bot]",
]);

export type GitHubContributor = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
};

export function filterHumanContributors(data: GitHubContributor[]): GitHubContributor[] {
  return data.filter(
    (c) => c.type === "User" && !BOT_LOGINS.has(c.login) && !c.login.endsWith("[bot]"),
  );
}

export function getGitHubRepoUrl(): string {
  return `https://github.com/${GITHUB_REPO}`;
}

export function getGitHubContributorsGraphUrl(): string {
  return `${getGitHubRepoUrl()}/graphs/contributors`;
}

/**
 * Fetch public GitHub contributors for the marketing showoff page.
 * Cached via Cache Components (`"use cache"`) so `/contributors` can prerender.
 */
export async function fetchGitHubContributors(): Promise<GitHubContributor[]> {
  "use cache";
  cacheTag("github-contributors");
  cacheLife("days");

  try {
    const res = await fetch(CONTRIBUTORS_API, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "munib-tracker-marketing",
      },
    });

    if (!res.ok) {
      console.warn(`[contributors] GitHub API ${res.status}`);
      return [];
    }

    const data = (await res.json()) as GitHubContributor[];
    return filterHumanContributors(data);
  } catch (err) {
    console.warn("[contributors] fetch failed", err);
    return [];
  }
}

/** Fallback when the API is unavailable — still credit the primary author. */
export function getFallbackContributors(): GitHubContributor[] {
  return [
    {
      login: "mubbi",
      id: 0,
      avatar_url: "https://github.com/mubbi.png",
      html_url: "https://github.com/mubbi",
      contributions: 1,
      type: "User",
    },
  ];
}

export function getMarketingAttributionNotice(): string {
  return `Munib Tracker — ${OFFICIAL_SITE_ORIGIN}`;
}
