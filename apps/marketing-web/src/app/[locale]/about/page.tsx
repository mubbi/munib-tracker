import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Blocks } from "@/components/content/blocks";
import { ContentPage, ContentSection } from "@/components/content-page";
import { TrackedLink } from "@/components/tracked-link";
import { Link } from "@/i18n/navigation";
import { MUNIB_AYAHS, munibAyahTranslation } from "@/lib/munib-ayahs";
import { pageMetadata } from "@/lib/seo";
import { appQuranAyahUrl, GITHUB_REPO_URL, SITE_PATHS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return pageMetadata({
    locale: await getLocale(),
    path: "/about",
    title: t("meta.title", { appName: APP_NAME }),
    description: t("meta.description", { appName: APP_NAME }),
  });
}

const linkClass = "font-medium text-brand hover:underline";

/** `t.rich` renderer for an internal link. */
function internal(href: string) {
  return (chunks: ReactNode) => (
    <Link href={href} className={linkClass}>
      {chunks}
    </Link>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();
  const em = (chunks: ReactNode) => <em>{chunks}</em>;

  /** The two ayahs that use the word munib, rendered from the app's bundled text. */
  const munibEvidence = MUNIB_AYAHS.map((a) => {
    const translation = munibAyahTranslation(a, locale);
    return {
      type: "evidence" as const,
      kind: "quran" as const,
      arabic: a.arabic,
      translation,
      reference: t("evidence.reference", { surah: a.surah, ayah: a.ayah }),
      href: appQuranAyahUrl(a.surah, a.ayah, locale),
      // Names the translator; Arabic pages show the Arabic alone.
      note: translation ? t("evidence.note") : undefined,
    };
  });

  return (
    <ContentPage
      path="/about"
      eyebrow={t("eyebrow")}
      title={t("title", { appName: APP_NAME })}
      intro={t("intro", { appName: APP_NAME })}
    >
      <ContentSection heading={t("meaning.heading")}>
        <p className="text-muted">
          {t.rich("meaning.definition", {
            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
            ar: (chunks) => <span lang="ar">{chunks}</span>,
          })}
        </p>
        <p className="text-muted">{t.rich("meaning.quran", { em })}</p>
        <Blocks blocks={munibEvidence} />
        <p className="text-muted">{t.rich("meaning.root", { em })}</p>
      </ContentSection>

      <ContentSection heading={t("name.heading")}>
        <p className="text-muted">{t("name.cycle", { appName: APP_NAME })}</p>
        <p className="text-muted">{t.rich("name.thesis", { em })}</p>
        <p className="text-muted">{t("name.rules")}</p>
      </ContentSection>

      <ContentSection heading={t("mission.heading")}>
        <p className="text-muted">{t("mission.body", { appName: APP_NAME })}</p>
      </ContentSection>

      <ContentSection heading={t("audience.heading")}>
        <p className="text-muted">{t("audience.body", { appName: APP_NAME })}</p>
      </ContentSection>

      <ContentSection heading={t("design.heading")}>
        <p className="text-muted">{t("design.body")}</p>
      </ContentSection>

      <ContentSection heading={t("built.heading")}>
        <p className="text-muted">
          {t.rich("built.body", {
            appName: APP_NAME,
            duaCount: DUA_COUNT,
            features: internal(SITE_PATHS.features),
          })}
        </p>
      </ContentSection>

      <ContentSection heading={t("openSource.heading")}>
        <p className="text-muted">
          {t.rich("openSource.body", {
            appName: APP_NAME,
            github: (chunks) => (
              <a
                href={GITHUB_REPO_URL}
                className={linkClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                {chunks}
              </a>
            ),
            openSource: internal(SITE_PATHS.openSource),
            contributors: internal(SITE_PATHS.contributors),
          })}
        </p>
      </ContentSection>

      <ContentSection heading={t("author.heading")}>
        <p className="text-muted">
          {t.rich("author.body", {
            appName: APP_NAME,
            author: APP_AUTHOR,
            authorLink: (chunks) => (
              <TrackedLink
                href={APP_AUTHOR_URL}
                className={linkClass}
                track="outbound"
                linkText={APP_AUTHOR}
                placement="about"
              >
                {chunks}
              </TrackedLink>
            ),
          })}
        </p>
      </ContentSection>

      <ContentSection heading={t("noFunding.heading")}>
        <p className="text-muted">{t("noFunding.body", { appName: APP_NAME })}</p>
      </ContentSection>

      <ContentSection heading={t("dua.heading")}>
        <p className="font-serif text-lg leading-relaxed text-muted">{t("dua.body")}</p>
      </ContentSection>

      <ContentSection heading={t("authenticity.heading")}>
        <p className="text-muted">
          {t.rich("authenticity.body", { credits: internal(SITE_PATHS.credits) })}
        </p>
      </ContentSection>
    </ContentPage>
  );
}
