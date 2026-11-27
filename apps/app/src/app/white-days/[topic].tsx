import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { getWhiteDaysGuideTopics, whiteDaysGuideConfig } from "@/lib/white-days-guide";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getWhiteDaysGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function WhiteDaysTopicScreen() {
  return <LearnGuideTopicScreen config={whiteDaysGuideConfig} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/white-days/[topic]");
