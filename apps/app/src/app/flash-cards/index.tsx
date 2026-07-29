import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlashCardPlayer } from "@/components/flash-cards/flash-card-player";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { ensureFlashCardContent, getFlashCardPool, type StudyMcq } from "@/lib/flash-cards";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";

export default function FlashCardsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const [poolVersion, setPoolVersion] = useState(0);

  useEffect(() => {
    // Do not cancel on unmount — Strict Mode / brief remounts would leave the
    // pool empty on first visit while the warm corpora settle (same class of
    // bug as the learn-hub lazy ensure race).
    void ensureFlashCardContent().then(() => {
      setReady(true);
      setPoolVersion((v) => v + 1);
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: rebuild when locale or warm pool changes
  const pool: StudyMcq[] = useMemo(
    () => getFlashCardPool((key) => t(key)),
    [i18n.language, poolVersion, t],
  );

  return (
    <ScreenLayout
      readingProgress
      eyebrow={t("flashCards.eyebrow")}
      title={t("flashCards.title")}
      subtitle={t("flashCards.subtitle")}
      onBack={() => goBackOrReplace(router, "/" as Href)}
    >
      <Seo path="/flash-cards" />
      <LearnContentGate ready={ready || pool.length > 0}>
        <Stagger>
          <FlashCardPlayer
            pool={pool}
            intro={
              <JannahCallout tone="info">
                {tTv(t, "flashCards.intro", "flashCards.introTv")}
              </JannahCallout>
            }
            footer={<JannahDisclaimer textKey="flashCards.disclaimer" />}
          />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}
