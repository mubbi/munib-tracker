import { ReciteAlongGuideTopicScreen } from "@/components/quran/recite-along-guide-topic";
import { ruqyahTopicPassages } from "@/lib/recite-along/guides";
import { getRuqyahTopics, ruqyahGuideConfig } from "@/lib/ruqyah";
import { routeMetadata } from "@/lib/seo/route-metadata";

export function generateStaticParams() {
  return getRuqyahTopics().map((topic) => ({ topic: topic.id }));
}

/** Shared guide topic screen + a recite-along card on the Qur'anic-verse topics (D68). */
export default function RuqyahTopicScreen() {
  return (
    <ReciteAlongGuideTopicScreen config={ruqyahGuideConfig} passagesFor={ruqyahTopicPassages} />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/ruqyah/[topic]");
