import { ReciteAlongGuideTopicScreen } from "@/components/quran/recite-along-guide-topic";
import { getJanazahGuideTopics, janazahGuideConfig } from "@/lib/janazah-guide";
import { janazahHasFatihahCheck } from "@/lib/recite-along/guides";
import { routeMetadata } from "@/lib/seo/route-metadata";

export async function generateStaticParams(): Promise<Array<{ topic: string }>> {
  return getJanazahGuideTopics().map((topic) => ({ topic: topic.id }));
}

const noPassages = () => [];

/** Shared guide topic screen + the al-Fatihah check on the how-to-pray topics (D68). */
export default function JanazahTopicScreen() {
  return (
    <ReciteAlongGuideTopicScreen
      config={janazahGuideConfig}
      passagesFor={noPassages}
      fatihahCheck={janazahHasFatihahCheck}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/janazah/[topic]");
