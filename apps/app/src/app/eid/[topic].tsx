import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { eidGuideConfig, getEidGuideTopics } from "@/lib/eid-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getEidGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function EidTopicScreen() {
  return <LearnGuideTopicScreen config={eidGuideConfig} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/eid/[topic]");
