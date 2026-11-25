import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { FaqList } from "@/components/content/primitives";
import { ContentPage } from "@/components/content-page";
import { FaqJsonLd } from "@/components/json-ld";
import { getFaqItems } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";

const PATH = "/faq";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  return pageMetadata({
    locale: await getLocale(),
    path: PATH,
    title: t("meta.title"),
    description: t("meta.description"),
  });
}

export default function FaqPage() {
  const t = useTranslations("faq");
  const items = getFaqItems(t);
  return (
    <ContentPage
      path={PATH}
      wide
      eyebrow={t("page.eyebrow")}
      title={t("page.title")}
      intro={t("page.intro")}
    >
      <FaqJsonLd items={items} />
      <FaqList items={items} headingLevel="h2" />
    </ContentPage>
  );
}
