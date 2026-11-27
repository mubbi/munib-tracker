import { ReciteAlongGuideTopicScreen } from "@/components/quran/recite-along-guide-topic";
import { getNewMuslimTopics, newMuslimGuideConfig } from "@/lib/new-muslim";
import { newMuslimHasFatihahCheck, newMuslimTopicPassages } from "@/lib/recite-along/guides";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams() {
  return getNewMuslimTopics().map((topic) => ({ topic: topic.id }));
}

/**
 * Shared guide topic screen + recite-along (D68): the al-Fatihah check on the
 * Salah topics, and Surah al-Ikhlas on "Who is Allah?".
 */
export default function NewMuslimTopicScreen() {
  return (
    <ReciteAlongGuideTopicScreen
      config={newMuslimGuideConfig}
      passagesFor={newMuslimTopicPassages}
      fatihahCheck={newMuslimHasFatihahCheck}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/new-muslim/[topic]");
