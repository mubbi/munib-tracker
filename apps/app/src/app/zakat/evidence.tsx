import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { ZakatEvidenceContent } from "@/components/zakat/zakat-evidence-content";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function ZakatEvidenceScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("zakat.eyebrow")}
      title={t("zakat.evidenceTitle")}
      subtitle={t("zakat.evidenceSubtitle")}
      onBack={() => goBackOrReplace(router, "/zakat")}
    >
      <Seo path="/zakat/evidence" />
      <Stagger>
        <LearnReadingChrome surface="finance">
          <ZakatEvidenceContent />
        </LearnReadingChrome>
        <JannahDisclaimer textKey="zakat.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zakat/evidence");
