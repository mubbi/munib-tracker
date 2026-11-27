import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  fetchGitHubContributors,
  type GitHubContributor,
  getFallbackContributors,
  getGitHubContributorsGraphUrl,
  getGitHubRepoUrl,
} from "@/lib/github-contributors";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contributors");
  return pageMetadata({
    locale: await getLocale(),
    path: "/contributors",
    title: t("meta.title", { appName: APP_NAME }),
    description: t("meta.description", { appName: APP_NAME }),
  });
}

/** `t.rich` renderer for an internal link. */
function internal(href: string) {
  return (chunks: ReactNode) => (
    <Link href={href} className="font-medium text-brand hover:underline">
      {chunks}
    </Link>
  );
}

function ContributorGrid({ contributors }: { contributors: GitHubContributor[] }) {
  const t = useTranslations("contributors");
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
                {t("github.contributions", { count: person.contributions })}
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
  const t = await getTranslations("contributors");

  return (
    <ContentSection heading={t("github.heading")}>
      <p className="text-muted">
        {fromApi ? t("github.sourceApi") : t("github.sourceFallback")}{" "}
        {t.rich("github.history", {
          graph: (chunks) => (
            <a
              href={getGitHubContributorsGraphUrl()}
              className="font-medium text-brand hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <div className="mt-6">
        <ContributorGrid contributors={contributors} />
      </div>
    </ContentSection>
  );
}

export default function ContributorsPage() {
  const t = useTranslations("contributors");
  return (
    <ContentPage
      path="/contributors"
      wide
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <Suspense fallback={<ContributorsSkeleton />}>
        <GitHubContributorsSection />
      </Suspense>

      <ContentSection heading={t("contribute.heading")}>
        <p className="text-muted">
          {t.rich("contribute.body", {
            appName: APP_NAME,
            openSource: internal(SITE_PATHS.openSource),
            home: internal(SITE_PATHS.home),
          })}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={getGitHubRepoUrl()} variant="primary" size="sm">
            {t("contribute.viewOnGitHub")}
          </Button>
          <Button href={SITE_PATHS.openSource} variant="outline" size="sm">
            {t("contribute.licenseTerms")}
          </Button>
          <Button
            href={`${getGitHubRepoUrl()}/blob/main/CONTRIBUTING.md`}
            variant="outline"
            size="sm"
          >
            {t("contribute.contributingGuide")}
          </Button>
          <Button href={SITE_PATHS.credits} variant="outline" size="sm">
            {t("contribute.contentSources")}
          </Button>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
