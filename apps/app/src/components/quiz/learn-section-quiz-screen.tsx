import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useMadhhab } from "@/hooks/use-madhhab";
import {
  ensureSectionQuizContent,
  getLearnSectionDef,
  getQuestionsForSection,
  type LearnQuizSectionId,
  toQuizPlayerQuestions,
} from "@/lib/flash-cards";
import { goBackOrReplace } from "@/lib/navigation";

const EMPTY_ICON = { ios: "questionmark.circle", android: "quiz", web: "quiz" } as const;

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
  // `useEnsureContent` never cancels on unmount (Strict Mode / brief remounts)
  // and reports a cold failure as `error` so the gate offers "Try again" (G-35).
  const ensure = useCallback(() => ensureSectionQuizContent(sectionId), [sectionId]);
  const isCached = useCallback(() => def?.isReady() ?? false, [def]);
  const { ready, version, error, retry } = useEnsureContent(ensure, isCached);

  // School-dependent questions follow "My madhhab" (NF-3.0a).
  const { schoolFor } = useMadhhab();
  // biome-ignore lint/correctness/useExhaustiveDependencies: locale + content version
  const questions = useMemo(
    () => toQuizPlayerQuestions(getQuestionsForSection(sectionId, (key) => t(key), schoolFor)),
    [sectionId, i18n.language, version, t, schoolFor],
  );

  if (!def) {
    // Never a blank route (P8-01): chrome + a way back to Learn.
    return (
      <ScreenLayout
        title={t("common.learnQuiz.title")}
        onBack={() => goBackOrReplace(router, "/library" as Href)}
      >
        <EmptyState
          icon={EMPTY_ICON}
          title={t("learnKit.quizEmptyTitle")}
          description={t("learnKit.quizEmptyBody")}
          actionLabel={t("learnKit.backToGuide")}
          onAction={() => goBackOrReplace(router, "/library" as Href)}
        />
      </ScreenLayout>
    );
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
      <Seo path={String(def.quizPath ?? `${String(def.route)}/quiz`)} />
      <LearnContentGate ready={ready || questions.length > 0} error={error} onRetry={retry}>
        <Stagger>
          {questions.length === 0 ? (
            // Nothing is loading here — say plainly there is no quiz yet (G-36).
            <EmptyState
              icon={EMPTY_ICON}
              title={t("learnKit.quizEmptyTitle")}
              description={t("learnKit.quizEmptyBody")}
              actionLabel={t("learnKit.backToGuide")}
              onAction={() => goBackOrReplace(router, def.route)}
            />
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
