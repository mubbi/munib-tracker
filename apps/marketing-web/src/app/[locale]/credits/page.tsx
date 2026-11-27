import {
  APP_NAME,
  BUNDLED_DATA_CREDITS,
  RUNTIME_DATA_CREDITS,
  SERVICE_DATA_CREDITS,
} from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ContentPage, ContentSection } from "@/components/content-page";
import { CreditList } from "@/components/credit-list";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("credits");
  return pageMetadata({
    locale: await getLocale(),
    path: "/credits",
    title: t("meta.title"),
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

export default function CreditsPage() {
  const t = useTranslations("credits");
  return (
    <ContentPage
      path="/credits"
      wide
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <ContentSection heading={t("sourceCode.heading")}>
        <p className="text-muted">
          {t.rich("sourceCode.body", {
            appName: APP_NAME,
            openSource: internal(SITE_PATHS.openSource),
            contributors: internal(SITE_PATHS.contributors),
          })}
        </p>
      </ContentSection>

      <ContentSection heading={t("bundled.heading")}>
        <CreditList sources={BUNDLED_DATA_CREDITS} />
      </ContentSection>

      <ContentSection heading={t("runtime.heading")}>
        <CreditList sources={RUNTIME_DATA_CREDITS} />
      </ContentSection>

      <ContentSection heading={t("services.heading")}>
        <CreditList sources={SERVICE_DATA_CREDITS} />
      </ContentSection>

      <ContentSection heading={t("authenticity.heading")}>
        <p className="text-muted">
          {t.rich("authenticity.body", { contact: internal(SITE_PATHS.contact) })}
        </p>
      </ContentSection>
    </ContentPage>
  );
}
