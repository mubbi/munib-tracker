import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { getLaylatAlQadrTopics, laylatAlQadrGuideConfig } from "@/lib/laylat-al-qadr";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams() {
  return getLaylatAlQadrTopics().map((topic) => ({ topic: topic.id }));
}

export default function LaylatAlQadrTopicScreen() {
  return <LearnGuideTopicScreen config={laylatAlQadrGuideConfig} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/laylat-al-qadr/[topic]");
