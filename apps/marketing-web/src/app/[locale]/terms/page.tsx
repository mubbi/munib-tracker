import { APP_AUTHOR, APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

const PATH = "/terms";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

const linkClass = "font-medium text-brand hover:underline";

/** `t.rich` tag that renders an internal link to `href`. */
const linkTo = (href: string) => (chunks: ReactNode) => (
  <Link href={href} className={linkClass}>
    {chunks}
  </Link>
);

const license = (chunks: ReactNode) => (
  <a
    href="https://polyformproject.org/licenses/noncommercial/1.0.0"
    className={linkClass}
    rel="noopener noreferrer"
    target="_blank"
  >
    {chunks}
  </a>
);

export default function TermsPage() {
  const t = useTranslations("terms");
  const brand = { appName: APP_NAME, author: APP_AUTHOR };
  return (
    <ContentPage
      path={PATH}
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <p className="text-sm text-muted">{t("effectiveDate")}</p>

      <ContentSection heading={t("service.heading")}>
        <p className="text-muted">
          {t.rich("service.body", { ...brand, features: linkTo(SITE_PATHS.features) })}
        </p>
      </ContentSection>

      <ContentSection heading={t("use.heading")}>
        <p className="text-muted">{t("use.body", { appName: APP_NAME })}</p>
      </ContentSection>

      <ContentSection heading={t("accounts.heading")}>
        <p className="text-muted">{t("accounts.body")}</p>
      </ContentSection>

      <ContentSection heading={t("circles.heading")}>
        <p className="text-muted">{t("circles.body")}</p>
      </ContentSection>

      <ContentSection heading={t("vault.heading")}>
        <p className="text-muted">{t("vault.body")}</p>
      </ContentSection>

      <ContentSection heading={t("disclaimer.heading")}>
        <p className="text-muted">
          {t.rich("disclaimer.body", { credits: linkTo(SITE_PATHS.credits) })}
        </p>
      </ContentSection>

      <ContentSection heading={t("practical.heading")}>
        <p className="text-muted">{t("practical.body")}</p>
      </ContentSection>

      <ContentSection heading={t("ip.heading")}>
        <p className="text-muted">
          {t.rich("ip.body", { ...brand, license, home: linkTo(SITE_PATHS.home) })}
        </p>
      </ContentSection>

      <ContentSection heading={t("privacy.heading")}>
        <p className="text-muted">
          {t.rich("privacy.body", { privacy: linkTo(SITE_PATHS.privacy) })}
        </p>
      </ContentSection>

      <ContentSection heading={t("thirdParty.heading")}>
        <p className="text-muted">{t("thirdParty.body")}</p>
      </ContentSection>

      <ContentSection heading={t("warranty.heading")}>
        <p className="text-muted">{t("warranty.body")}</p>
      </ContentSection>

      <ContentSection heading={t("liability.heading")}>
        <p className="text-muted">{t("liability.body", { author: APP_AUTHOR })}</p>
      </ContentSection>

      <ContentSection heading={t("age.heading")}>
        <p className="text-muted">{t("age.body")}</p>
      </ContentSection>

      <ContentSection heading={t("changes.heading")}>
        <p className="text-muted">{t("changes.body")}</p>
      </ContentSection>

      <ContentSection heading={t("contact.heading")}>
        <p className="text-muted">
          {t.rich("contact.body", { contact: linkTo(SITE_PATHS.contact) })}
        </p>
      </ContentSection>
    </ContentPage>
  );
}
