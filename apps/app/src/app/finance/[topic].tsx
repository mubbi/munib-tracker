import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { getIslamicFinanceTopics, islamicFinanceGuideConfig } from "@/lib/islamic-finance";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams() {
  return getIslamicFinanceTopics().map((topic) => ({ topic: topic.id }));
}

export default function FinanceTopicScreen() {
  return <LearnGuideTopicScreen config={islamicFinanceGuideConfig} surface="finance" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/finance/[topic]");
