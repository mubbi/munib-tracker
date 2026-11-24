import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { MirathCalculator } from "@/components/mirath/mirath-calculator";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * NF-3.10 Mirath (inheritance) calculator — all four schools (D6), one engine
 * (`@munib-tracker/shared/mirath`). Nothing entered here is stored. On TV the
 * heir steppers work with the remote; estate amounts are phone/web only.
 */
export default function MirathScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t } = useTranslation();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromWasiyyah = from === "wasiyyah";
  return (
    <ScreenLayout
      eyebrow={t("mirath.eyebrow")}
      title={t("mirath.title")}
      subtitle={t("mirath.subtitle")}
      onBack={() => goBackOrReplace(router, fromWasiyyah ? "/wasiyyah/edit" : "/library")}
    >
      <Seo path="/mirath" />
      {madhhabPrompt.sheet}
      <MirathCalculator fromWasiyyah={fromWasiyyah} />
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/mirath");
