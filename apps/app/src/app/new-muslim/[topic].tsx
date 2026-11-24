import { LearnGuideTopicScreen } from "@/components/learn-guide/learn-guide-screens";
import { getNewMuslimTopics, newMuslimGuideConfig } from "@/lib/new-muslim";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams() {
  return getNewMuslimTopics().map((topic) => ({ topic: topic.id }));
}

export default function NewMuslimTopicScreen() {
  return <LearnGuideTopicScreen config={newMuslimGuideConfig} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/new-muslim/[topic]");
