import { JsonLdScript } from "@/components/content/primitives";
import type { FaqItem } from "@/content/types";
import {
  faqPageSchema,
  graph,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/lib/structured-data";

/** Sitewide Organization + WebSite graph (rendered once in the root layout). */
export function JsonLd() {
  return <JsonLdScript data={graph(organizationSchema(), websiteSchema())} />;
}

/** Feature list for the SoftwareApplication node on the home page. */
const HOME_FEATURE_LIST = [
  "Salah tracker with streaks, calendar and statistics",
  "Qaza (missed Salah) calculator, daily-pace planner and missed-fast tracking",
  "Zikr tracker with guided adhkar sessions, source hadith and a tasbeeh counter",
  "Offline Qur'an with word-by-word, tajweed colours, translations, tafsir and audio",
  "On-device AI Qur'an recitation practice with spaced revision",
  "Learn the Qur'an: Arabic letters, reading and tajweed lessons",
  "Salah times, Adhan and Qibla compass",
  "Widgets, Live Activities, Apple Watch, Wear OS, Apple TV and Android TV",
] as const;

/** SoftwareApplication structured data for the home page. */
export function SoftwareJsonLd() {
  return <JsonLdScript data={graph(softwareApplicationSchema(HOME_FEATURE_LIST))} />;
}

/** FAQPage structured data — only on the dedicated /faq page. */
export function FaqJsonLd({ items }: { items: readonly FaqItem[] }) {
  return <JsonLdScript data={graph(faqPageSchema(items))} />;
}
