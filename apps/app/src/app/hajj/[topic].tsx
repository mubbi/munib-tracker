import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { getHajjGuideTopics, hajjGuideConfig } from "@/lib/hajj-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getHajjGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function HajjTopicScreen() {
  return <LearnGuideTopicScreen config={hajjGuideConfig} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/hajj/[topic]");
