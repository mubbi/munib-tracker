import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { ContentPage, ContentSection } from "@/components/content-page";
import { Link } from "@/i18n/navigation";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return pageMetadata({
    locale: await getLocale(),
    path: "/contact",
    title: t("meta.title"),
    description: t("meta.description", { appName: APP_NAME }),
  });
}

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <ContentPage path="/contact" wide eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ContentSection heading={t("corrections.heading")}>
            <p className="text-sm text-muted">{t("corrections.body")}</p>
          </ContentSection>
          <ContentSection heading={t("privacy.heading")}>
            <p className="text-sm text-muted">
              {t.rich("privacy.body", {
                link: (chunks) => (
                  <Link
                    href={SITE_PATHS.privacy}
                    className="font-medium text-brand hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </ContentSection>
          <ContentSection heading={t("response.heading")}>
            <p className="text-sm text-muted">{t("response.body", { appName: APP_NAME })}</p>
          </ContentSection>
        </div>
      </div>
    </ContentPage>
  );
}
