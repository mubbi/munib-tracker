import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { getJanazahGuideTopics, janazahGuideConfig } from "@/lib/janazah-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getJanazahGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function JanazahTopicScreen() {
  return <LearnGuideTopicScreen config={janazahGuideConfig} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/janazah/[topic]");
