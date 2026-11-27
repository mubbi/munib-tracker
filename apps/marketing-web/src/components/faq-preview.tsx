import { useTranslations } from "next-intl";
import { FaqList } from "@/components/content/primitives";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { getFaqItems } from "@/lib/faq";
import { SITE_PATHS } from "@/lib/site";

export function FaqPreview() {
  const t = useTranslations("faq");
  return (
    <Section
      eyebrow={t("preview.eyebrow")}
      title={t("preview.title")}
      description={t("preview.description")}
    >
      <div className="mx-auto max-w-3xl">
        <FaqList items={getFaqItems(t, 5)} />
      </div>
      <p className="mt-10 text-center">
        <TrackedLink
          href={SITE_PATHS.faq}
          className="font-semibold text-brand transition-opacity hover:opacity-80"
          track="cta"
          cta="view_all_faq"
          placement="home_faq"
        >
          {t("preview.viewAll")}
        </TrackedLink>
      </p>
    </Section>
  );
}
