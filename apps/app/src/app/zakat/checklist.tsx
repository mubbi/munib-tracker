import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { ZakatChecklistContent } from "@/components/zakat/zakat-checklist-content";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function ZakatChecklistScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("zakat.eyebrow")}
      title={t("zakat.checklistTitle")}
      subtitle={t("zakat.checklistSubtitle")}
      onBack={() => goBackOrReplace(router, "/zakat")}
    >
      <Seo path="/zakat/checklist" />
      <Stagger>
        <LearnReadingChrome surface="jannah">
          <ZakatChecklistContent />
        </LearnReadingChrome>
        <JannahDisclaimer textKey="zakat.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/zakat/checklist");
