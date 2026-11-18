import type {
  LastDayQuizQuestion,
  QuranGuideQuizQuestion,
  SalahGuideQuizQuestion,
} from "@munib-tracker/shared/types";

import { condenseText, FLASH_EXPLANATION_MAX, isCompactCard } from "./mcq-helpers";
import type { StudyMcq, StudySourceId } from "./types";

type AuthoredQuiz = {
  id: string;
  type: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  explanation: string;
  category?: string;
};

function mapAuthored(
  sourceId: StudySourceId,
  questions: readonly AuthoredQuiz[],
  categoryPrefix?: string,
): StudyMcq[] {
  const out: StudyMcq[] = [];
  for (const question of questions) {
    if (question.type === "reflection") continue;
    if (question.correctIndex == null || !question.options?.length) continue;
    if (question.options.length < 2) continue;

    // Authored questions are kept only when already short; long ones are dropped.
    if (!isCompactCard({ ...question, options: question.options })) continue;

    out.push({
      id: `${sourceId}:authored:${question.id}`,
      sourceId,
      prompt: question.prompt,
      options: question.options,
      correctIndex: question.correctIndex,
      explanation: condenseText(question.explanation, FLASH_EXPLANATION_MAX),
      categoryLabelKey:
        categoryPrefix && question.category ? `${categoryPrefix}.${question.category}` : undefined,
    });
  }
  return out;
}

export function mcqsFromLastDayQuiz(questions: readonly LastDayQuizQuestion[]): StudyMcq[] {
  return mapAuthored("lastDay", questions);
}

export function mcqsFromQuranGuideQuiz(questions: readonly QuranGuideQuizQuestion[]): StudyMcq[] {
  return mapAuthored("learnQuran", questions, "learnQuran.quizCategory");
}

export function mcqsFromSalahGuideQuiz(questions: readonly SalahGuideQuizQuestion[]): StudyMcq[] {
  return mapAuthored("salahGuide", questions, "flashCards.category.salahGuide");
}
