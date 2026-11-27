import { ReciteAlongGuideTopicScreen } from "@/components/quran/recite-along-guide-topic";
import { fridayGuideConfig, getFridayGuideTopics } from "@/lib/friday-guide";
import { fridayTopicPassages } from "@/lib/recite-along/guides";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getFridayGuideTopics().map((topic) => ({ topic: topic.id }));
}

/** Shared guide topic screen + a recite-along card on the al-Kahf topic (D68). */
export default function FridayTopicScreen() {
  return (
    <ReciteAlongGuideTopicScreen config={fridayGuideConfig} passagesFor={fridayTopicPassages} />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/friday/[topic]");
