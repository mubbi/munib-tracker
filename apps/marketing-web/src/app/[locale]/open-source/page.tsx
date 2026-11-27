import { APP_NAME } from "@munib-tracker/shared/constants";
import { Code2, GitFork, HeartHandshake, Scale } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  GITHUB_CONTRIBUTING_URL,
  GITHUB_LICENSE_URL,
  GITHUB_NOTICE_URL,
  OPEN_SOURCE_NOT_PERMITTED,
  OPEN_SOURCE_PERMITTED,
  PROJECT_LICENSE_NAME,
  PROJECT_LICENSE_URL,
  PROJECT_REQUIRED_NOTICE_LINE,
} from "@/lib/open-source";
import { pageMetadata } from "@/lib/seo";
import { GITHUB_REPO_URL, SITE_PATHS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("openSource");
  return pageMetadata({
    locale: await getLocale(),
    path: "/open-source",
    title: t("meta.title", { appName: APP_NAME }),
    description: t("meta.description", { appName: APP_NAME, license: PROJECT_LICENSE_NAME }),
  });
}

const CARDS = [
  { id: "source", icon: Code2 },
  { id: "license", icon: Scale },
  { id: "fork", icon: GitFork },
  { id: "contribute", icon: HeartHandshake },
] as const;

const linkClass = "font-medium text-brand hover:underline";

/** `t.rich` renderer for an internal link. */
function internal(href: string) {
  return (chunks: ReactNode) => (
    <Link href={href} className={linkClass}>
      {chunks}
    </Link>
  );
}

/** `t.rich` renderer for an external link (new tab). */
function external(href: string) {
  return (chunks: ReactNode) => (
    <a href={href} className={linkClass} rel="noopener noreferrer" target="_blank">
      {chunks}
    </a>
  );
}

export default function OpenSourcePage() {
  const t = useTranslations("openSource");
  return (
    <ContentPage
      path="/open-source"
      wide
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("summary", { appName: APP_NAME })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map(({ id, icon: Icon }) => (
          <article
            key={id}
            className="rounded-[var(--radius-card)] border border-border/50 bg-card/60 p-5"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="size-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              {t(`cards.${id}.title`)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t(`cards.${id}.body`)}</p>
          </article>
        ))}
      </div>

      <ContentSection heading={t("permitted.heading")}>
        <ul className="list-inside list-disc space-y-2 text-muted">
          {OPEN_SOURCE_PERMITTED.map((id) => (
            <li key={id}>{t(`permitted.items.${id}`)}</li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection heading={t("notPermitted.heading")}>
        <ul className="list-inside list-disc space-y-2 text-muted">
          {OPEN_SOURCE_NOT_PERMITTED.map((id) => (
            <li key={id}>{t(`notPermitted.items.${id}`, { appName: APP_NAME })}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          {t.rich("notPermitted.legal", {
            license: PROJECT_LICENSE_NAME,
            licenseLink: external(PROJECT_LICENSE_URL),
            notice: external(GITHUB_NOTICE_URL),
          })}
        </p>
      </ContentSection>

      <ContentSection heading={t("attribution.heading")}>
        <p className="text-muted">
          {t.rich("attribution.body", {
            appName: APP_NAME,
            strong: (chunks) => <strong>{chunks}</strong>,
            home: internal(SITE_PATHS.home),
          })}
        </p>
        <pre
          dir="ltr"
          className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-border/50 bg-surface p-4 font-mono text-xs leading-relaxed text-foreground"
        >
          {PROJECT_REQUIRED_NOTICE_LINE}
        </pre>
      </ContentSection>

      <ContentSection heading={t("noFunding.heading")}>
        <p className="text-muted">{t("noFunding.notice", { appName: APP_NAME })}</p>
        <p className="mt-4 text-muted">
          {t.rich("noFunding.body", { contributing: external(GITHUB_CONTRIBUTING_URL) })}
        </p>
      </ContentSection>

      <ContentSection heading={t("contribute.heading")}>
        <p className="text-muted">
          {t.rich("contribute.body", {
            guide: external(GITHUB_CONTRIBUTING_URL),
            contributors: internal(SITE_PATHS.contributors),
            credits: internal(SITE_PATHS.credits),
          })}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={GITHUB_REPO_URL} variant="primary" size="sm">
            {t("contribute.viewRepository")}
          </Button>
          <Button href={GITHUB_CONTRIBUTING_URL} variant="outline" size="sm">
            {t("contribute.contributingGuide")}
          </Button>
          <Button href={GITHUB_LICENSE_URL} variant="outline" size="sm">
            {t("contribute.licenseOnGitHub")}
          </Button>
          <Button href={SITE_PATHS.contributors} variant="outline" size="sm">
            {t("contribute.meetContributors")}
          </Button>
        </div>
      </ContentSection>
    </ContentPage>
  );
}
