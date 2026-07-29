import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Button } from "@/components/ui/button";
import {
  fetchGitHubContributors,
  type GitHubContributor,
  getFallbackContributors,
  getGitHubContributorsGraphUrl,
  getGitHubRepoUrl,
} from "@/lib/github-contributors";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contributors",
  description: `People who build and improve ${APP_NAME} — join us on GitHub.`,
};

function ContributorGrid({ contributors }: { contributors: GitHubContributor[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {contributors.map((person) => (
        <li key={person.login}>
          <a
            href={person.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-border/50 bg-card/60 p-4 text-center transition-colors hover:border-brand/40 hover:bg-card"
          >
            <Image
              src={person.avatar_url}
              alt=""
              width={80}
              height={80}
              className="size-16 rounded-full bg-muted"
              unoptimized
            />
            <span className="text-sm font-medium text-foreground">{person.login}</span>
            {person.contributions > 0 ? (
              <span className="text-xs text-muted">
                {person.contributions} contribution{person.contributions === 1 ? "" : "s"}
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ContributorsSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" aria-hidden>
      {["a", "b", "c", "d"].map((id) => (
        <li
          key={id}
          className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-border/50 bg-card/40 p-4"
        >
          <span className="size-16 animate-pulse rounded-full bg-muted" />
          <span className="h-4 w-20 animate-pulse rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}

async function GitHubContributorsSection() {
  const remote = await fetchGitHubContributors();
  const contributors = remote.length > 0 ? remote : getFallbackContributors();
  const fromApi = remote.length > 0;

  return (
    <ContentSection heading="GitHub contributors">
      <p className="text-muted">
        {fromApi
          ? "Avatars below come from the public GitHub contributors API (bots excluded)."
          : "Live GitHub data is temporarily unavailable — showing the project maintainer until the next refresh."}{" "}
        Full history lives on the{" "}
        <a
          href={getGitHubContributorsGraphUrl()}
          className="font-medium text-brand hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          contributors graph
        </a>
        .
      </p>
      <div className="mt-6">
        <ContributorGrid contributors={contributors} />
      </div>
    </ContentSection>
  );
}

export default function ContributorsPage() {
  return (
    <ContentPage
      wide
      eyebrow="Community"
      title="Contributors"
      intro={`${APP_NAME} is built in the open. Every commit, review, translation, and content correction helps Muslims track their journey back to Allah — thank you.`}
    >
      <Suspense fallback={<ContributorsSkeleton />}>
        <GitHubContributorsSection />
      </Suspense>

      <ContentSection heading="Contribute">
        <p className="text-muted">
          We welcome non-commercial contributions — bug fixes, docs, translations, and careful
          content corrections. Please read our contributing guide on GitHub before opening a PR.
          License terms, attribution, and what you may (and may not) do are summarized on{" "}
          <Link href={SITE_PATHS.openSource} className="font-medium text-brand hover:underline">
            Open source
          </Link>
          . Redistributions must credit {APP_NAME} and link back to{" "}
          <Link href={SITE_PATHS.home} className="font-medium text-brand hover:underline">
            munibtracker.app
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={getGitHubRepoUrl()} variant="primary" size="sm">
            View on GitHub
          </Button>
          <Button href={SITE_PATHS.openSource} variant="outline" size="sm">
            License &amp; terms
          </Button>
          <Button
            href={`${getGitHubRepoUrl()}/blob/main/CONTRIBUTING.md`}
            variant="outline"
            size="sm"
          >
            Contributing guide
          </Button>
          <Button href={SITE_PATHS.credits} variant="outline" size="sm">
            Content sources
          </Button>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
