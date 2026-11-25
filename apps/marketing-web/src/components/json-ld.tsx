import { APP_NAME } from "@munib-tracker/shared/constants";
import { useLocale, useTranslations } from "next-intl";
import { JsonLdScript } from "@/components/content/primitives";
import type { FaqItem } from "@/content/types";
import {
  faqPageSchema,
  graph,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/structured-data";

/**
 * Sitewide Organization + WebSite graph (rendered once in the root layout).
 * Reads the locale from next-intl, so callers pass nothing.
 */
export function JsonLd() {
  const t = useTranslations("structuredData");
  const locale = useLocale();
  return (
    <JsonLdScript
      data={graph(
        organizationSchema(),
        websiteSchema({ locale, description: t("siteDescription", { appName: APP_NAME }) }),
      )}
    />
  );
}

/** Feature list for the SoftwareApplication node on the home page (keys of `structuredData.homeFeatures`). */
const HOME_FEATURE_IDS = [
  "salah",
  "qaza",
  "zikr",
  "quran",
  "practice",
  "learn",
  "times",
  "devices",
] as const;

/** SoftwareApplication structured data for the home page. */
export function SoftwareJsonLd() {
  const t = useTranslations("structuredData");
  const tMeta = useTranslations("metadata");
  const locale = useLocale();
  return (
    <JsonLdScript
      data={graph(
        softwareApplicationSchema({
          locale,
          description: t("siteDescription", { appName: APP_NAME }),
          slogan: tMeta("tagline"),
          featureList: HOME_FEATURE_IDS.map((id) => t(`homeFeatures.${id}`)),
        }),
      )}
    />
  );
}

/** FAQPage structured data — only on the dedicated /faq page. */
export function FaqJsonLd({ items }: { items: readonly FaqItem[] }) {
  return <JsonLdScript data={graph(faqPageSchema(items))} />;
}
