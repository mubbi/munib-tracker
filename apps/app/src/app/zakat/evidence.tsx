import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { ZakatEvidenceContent } from "@/components/zakat/zakat-evidence-content";

export default function ZakatEvidenceScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("zakat.eyebrow")}
      title={t("zakat.evidenceTitle")}
      subtitle={t("zakat.evidenceSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/zakat"))}
    >
      <Seo path="/zakat/evidence" />
      <Stagger>
        <LearnReadingChrome surface="jannah">
          <ZakatEvidenceContent />
        </LearnReadingChrome>
        <JannahDisclaimer textKey="zakat.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}
