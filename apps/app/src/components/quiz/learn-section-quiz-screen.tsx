import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import {
  ensureSectionQuizContent,
  getLearnSectionDef,
  getQuestionsForSection,
  type LearnQuizSectionId,
  toQuizPlayerQuestions,
} from "@/lib/flash-cards";
import { goBackOrReplace } from "@/lib/navigation";

type LearnSectionQuizScreenProps = {
  sectionId: LearnQuizSectionId;
};

/**
 * Shared scored quiz shell for Learn hubs — draws a finite sample from the
 * section's study bank and plays it through QuizPlayer.
 */
export function LearnSectionQuizScreen({ sectionId }: LearnSectionQuizScreenProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const def = getLearnSectionDef(sectionId);
  const [ready, setReady] = useState(() => def?.isReady() ?? false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Do not cancel on unmount — Strict Mode / brief remounts would leave the
    // quiz empty on first visit while ensure settles.
    void ensureSectionQuizContent(sectionId).then(() => {
      setReady(true);
      setVersion((v) => v + 1);
    });
  }, [sectionId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: locale + content version
  const questions = useMemo(
    () => toQuizPlayerQuestions(getQuestionsForSection(sectionId, (key) => t(key))),
    [sectionId, i18n.language, version, t],
  );

  if (!def) {
    return null;
  }

  const ns = def.i18nNamespace;
  const title = i18n.exists(`${ns}.quizTitle`) ? t(`${ns}.quizTitle`) : t("common.learnQuiz.title");
  const subtitle = i18n.exists(`${ns}.quizSubtitle`)
    ? t(`${ns}.quizSubtitle`)
    : t("common.learnQuiz.subtitle");
  const eyebrow = i18n.exists(`${ns}.eyebrow`) ? t(`${ns}.eyebrow`) : t("flashCards.eyebrow");
  const intro = i18n.exists(`${ns}.quizIntro`) ? t(`${ns}.quizIntro`) : t("common.learnQuiz.intro");
  const disclaimerKey = `${ns}.disclaimer`;
  const hasDisclaimer = i18n.exists(disclaimerKey);

  return (
    <ScreenLayout
      readingProgress
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      onBack={() => goBackOrReplace(router, def.route)}
    >
      <Seo path={String(def.quizPath)} />
      <LearnContentGate ready={ready || questions.length > 0}>
        <Stagger>
          {questions.length === 0 ? (
            <JannahCallout tone="warning">{t("common.learnQuiz.empty")}</JannahCallout>
          ) : (
            <QuizPlayer
              questions={questions}
              intro={<JannahCallout tone="info">{intro}</JannahCallout>}
              categoryLabel={(question) => {
                if (!question.category) return undefined;
                const label = t(question.category);
                return label === question.category ? undefined : label;
              }}
              footer={hasDisclaimer ? <JannahDisclaimer textKey={disclaimerKey} /> : undefined}
            />
          )}
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}
