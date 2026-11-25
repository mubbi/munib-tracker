import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { fidyahGuideConfig, getFidyahGuideTopics } from "@/lib/fidyah-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getFidyahGuideTopics().map((topic) => ({ topic: topic.id }));
}

export default function FidyahTopicScreen() {
  return <LearnGuideTopicScreen config={fidyahGuideConfig} surface="finance" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/fidyah/[topic]");
