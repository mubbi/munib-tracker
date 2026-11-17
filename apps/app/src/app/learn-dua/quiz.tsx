import { LearnSectionQuizScreen } from "@/components/quiz/learn-section-quiz-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function QuizScreen() {
  return <LearnSectionQuizScreen sectionId="learnDua" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-dua/quiz");
