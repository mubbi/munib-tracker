import { APP_NAME } from "@munib-tracker/shared/constants";
import { Code2, GitFork, HeartHandshake, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Button } from "@/components/ui/button";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_LICENSE_URL,
  GITHUB_NOTICE_URL,
  NO_FUNDING_NOTICE,
  OPEN_SOURCE_NOT_PERMITTED,
  OPEN_SOURCE_PERMITTED,
  OPEN_SOURCE_SUMMARY,
  PROJECT_LICENSE_NAME,
  PROJECT_LICENSE_URL,
  PROJECT_REQUIRED_NOTICE,
} from "@/lib/open-source";
import { GITHUB_REPO_URL, SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Open source",
  description: `${APP_NAME} is source-available on GitHub for personal and educational use under the ${PROJECT_LICENSE_NAME}.`,
};

export default function OpenSourcePage() {
  return (
    <ContentPage
      wide
      eyebrow="Open source"
      title={`Built in the open for the ummah`}
      intro={OPEN_SOURCE_SUMMARY}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Code2,
            title: "Source on GitHub",
            body: "Browse the monorepo — Expo app (phone + TV), NestJS API, admin console, and this marketing site — in one place.",
          },
          {
            icon: Scale,
            title: "Clear license",
            body: "Non-commercial use, modification, and redistribution with required attribution.",
          },
          {
            icon: GitFork,
            title: "Fork & improve",
            body: "Adapt for your community’s non-commercial needs — keep the credit and the link.",
          },
          {
            icon: HeartHandshake,
            title: "Contribute",
            body: "Code, docs, translations, and careful content corrections are all welcome.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="rounded-[var(--radius-card)] border border-border/50 bg-card/60 p-5"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="size-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </article>
        ))}
      </div>

      <ContentSection heading="What the license allows">
        <ul className="list-inside list-disc space-y-2 text-muted">
          {OPEN_SOURCE_PERMITTED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection heading="What is not allowed">
        <ul className="list-inside list-disc space-y-2 text-muted">
          {OPEN_SOURCE_NOT_PERMITTED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Full legal text:{" "}
          <a
            href={PROJECT_LICENSE_URL}
            className="font-medium text-brand hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            {PROJECT_LICENSE_NAME}
          </a>
          . Attribution requirements live in our{" "}
          <a
            href={GITHUB_NOTICE_URL}
            className="font-medium text-brand hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            NOTICE
          </a>{" "}
          file on GitHub.
        </p>
      </ContentSection>

      <ContentSection heading="Required attribution">
        <p className="text-muted">
          Anyone who uses, modifies, or redistributes {APP_NAME} must keep the license and NOTICE,
          credit <strong>{APP_NAME}</strong>, and include a visible link to{" "}
          <Link href={SITE_PATHS.home} className="font-medium text-brand hover:underline">
            munibtracker.app
          </Link>
          .
        </p>
        <pre className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border/50 bg-surface p-4 font-mono text-xs leading-relaxed text-foreground">
          {`Required Notice: ${PROJECT_REQUIRED_NOTICE}`}
        </pre>
      </ContentSection>

      <ContentSection heading="No sponsorship or donations">
        <p className="text-muted">{NO_FUNDING_NOTICE}</p>
        <p className="mt-4 text-muted">
          There is no official Patreon, GitHub Sponsors, crypto wallet, or payment link for this
          project at this time. Help by contributing code, docs, translations, or careful content
          corrections — see{" "}
          <a
            href={GITHUB_CONTRIBUTING_URL}
            className="font-medium text-brand hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            CONTRIBUTING.md
          </a>
          .
        </p>
      </ContentSection>

      <ContentSection heading="How to contribute">
        <p className="text-muted">
          Start with the{" "}
          <a
            href={GITHUB_CONTRIBUTING_URL}
            className="font-medium text-brand hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            contributing guide
          </a>
          . Good first steps: docs typos, UI polish, translations, and content accuracy reports. See
          everyone who has helped on our{" "}
          <Link href={SITE_PATHS.contributors} className="font-medium text-brand hover:underline">
            Contributors
          </Link>{" "}
          page. Religious datasets remain under their own licenses — listed on{" "}
          <Link href={SITE_PATHS.credits} className="font-medium text-brand hover:underline">
            Credits
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={GITHUB_REPO_URL} variant="primary" size="sm">
            View repository
          </Button>
          <Button href={GITHUB_CONTRIBUTING_URL} variant="outline" size="sm">
            Contributing guide
          </Button>
          <Button href={GITHUB_LICENSE_URL} variant="outline" size="sm">
            License on GitHub
          </Button>
          <Button href={SITE_PATHS.contributors} variant="outline" size="sm">
            Meet contributors
          </Button>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
