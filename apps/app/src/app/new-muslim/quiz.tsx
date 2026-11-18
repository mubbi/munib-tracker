import { LearnSectionQuizScreen } from "@/components/quiz/learn-section-quiz-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function QuizScreen() {
  return <LearnSectionQuizScreen sectionId="newMuslim" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/new-muslim/quiz");
