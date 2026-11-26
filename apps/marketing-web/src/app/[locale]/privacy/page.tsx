import { APP_AUTHOR, APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

const PATH = "/privacy";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

const linkClass = "font-medium text-brand hover:underline";

const contact = (chunks: ReactNode) => (
  <Link href={SITE_PATHS.contact} className={linkClass}>
    {chunks}
  </Link>
);

const credits = (chunks: ReactNode) => (
  <Link href={SITE_PATHS.credits} className={linkClass}>
    {chunks}
  </Link>
);

const nowrap = (chunks: ReactNode) => <span className="whitespace-nowrap">{chunks}</span>;

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  return (
    <ContentPage
      path={PATH}
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <p className="text-sm text-muted">{t("effectiveDate")}</p>

      <ContentSection heading={t("whoWeAre.heading")}>
        <p className="text-muted">
          {t.rich("whoWeAre.body", { appName: APP_NAME, author: APP_AUTHOR, contact, nowrap })}
        </p>
      </ContentSection>

      <ContentSection heading={t("device.heading")}>
        <p className="text-muted">{t("device.body")}</p>
      </ContentSection>

      <ContentSection heading={t("location.heading")}>
        <p className="text-muted">{t("location.body")}</p>
      </ContentSection>

      <ContentSection heading={t("microphone.heading")}>
        <p className="text-muted">{t("microphone.body")}</p>
        <p className="mt-3 text-muted">{t("microphone.listener")}</p>
        <p className="mt-3 text-muted">{t("microphone.pronunciation")}</p>
      </ContentSection>

      <ContentSection heading={t("masjid.heading")}>
        <p className="text-muted">{t("masjid.body")}</p>
        <p className="mt-3 text-muted">{t("masjid.timetable")}</p>
      </ContentSection>

      <ContentSection heading={t("focusLock.heading")}>
        <p className="text-muted">{t("focusLock.body")}</p>
      </ContentSection>

      <ContentSection heading={t("surfaces.heading")}>
        <p className="text-muted">{t("surfaces.body")}</p>
        <p className="mt-3 text-muted">{t("surfaces.live")}</p>
      </ContentSection>

      <ContentSection heading={t("vault.heading")}>
        <p className="text-muted">{t("vault.body")}</p>
        <p className="mt-3 text-muted">{t("vault.excused")}</p>
        <p className="mt-3 text-muted">{t("vault.sync")}</p>
        <p className="mt-3 text-muted">{t("vault.reminders")}</p>
      </ContentSection>

      <ContentSection heading={t("circles.heading")}>
        <p className="text-muted">{t("circles.body")}</p>
        <p className="mt-3 text-muted">{t("circles.members")}</p>
        <p className="mt-3 text-muted">{t("circles.nearby")}</p>
      </ContentSection>

      <ContentSection heading={t("notifications.heading")}>
        <p className="text-muted">{t("notifications.body")}</p>
        <p className="mt-3 text-muted">{t("notifications.circles")}</p>
      </ContentSection>

      <ContentSection heading={t("account.heading")}>
        <p className="text-muted">{t("account.body")}</p>
        <p className="mt-3 text-muted">{t("account.guest")}</p>
      </ContentSection>

      <ContentSection heading={t("appLock.heading")}>
        <p className="text-muted">{t("appLock.body")}</p>
      </ContentSection>

      <ContentSection heading={t("backups.heading")}>
        <p className="text-muted">{t("backups.body")}</p>
      </ContentSection>

      <ContentSection heading={t("reports.heading")}>
        <p className="text-muted">{t("reports.body")}</p>
        <p className="mt-3 text-muted">{t("reports.feedback")}</p>
        <p className="mt-3 text-muted">{t("reports.diagnostics")}</p>
      </ContentSection>

      <ContentSection heading={t("thirdParty.heading")}>
        <p className="text-muted">{t.rich("thirdParty.body", { credits })}</p>
      </ContentSection>

      <ContentSection heading={t("website.heading")}>
        <p className="text-muted">{t("website.body")}</p>
      </ContentSection>

      <ContentSection heading={t("children.heading")}>
        <p className="text-muted">{t("children.body")}</p>
        <p className="mt-3 text-muted">{t("children.deletion")}</p>
      </ContentSection>

      <ContentSection heading={t("retention.heading")}>
        <p className="text-muted">{t("retention.body")}</p>
      </ContentSection>

      <ContentSection heading={t("rights.heading")}>
        <p className="text-muted">{t.rich("rights.body", { contact })}</p>
      </ContentSection>

      <ContentSection heading={t("transfers.heading")}>
        <p className="text-muted">{t("transfers.body")}</p>
      </ContentSection>

      <ContentSection heading={t("changes.heading")}>
        <p className="text-muted">{t("changes.body")}</p>
      </ContentSection>

      <ContentSection heading={t("contact.heading")}>
        <p className="text-muted">{t.rich("contact.body", { contact })}</p>
      </ContentSection>
    </ContentPage>
  );
}
