import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GuideMadhhabNotes } from "@/components/fiqh/guide-madhhab-notes";
import { PilgrimageChecklistView } from "@/components/hajj/pilgrimage-checklist-view";
import { useLearnHubLayout } from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";
import { getUmrahChecklistItems } from "@/lib/hajj-guide";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureUmrahChecklistLoaded,
  useUmrahChecklist,
  useUmrahChecklistActions,
} from "@/stores/umrah-checklist-store";

export default function UmrahChecklistScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const wide = useLearnHubLayout();
  useEnsureUmrahChecklistLoaded();
  const done = useUmrahChecklist();
  const { toggle, reset } = useUmrahChecklistActions();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const items = useMemo(() => getUmrahChecklistItems(), [i18n.language, overlayVersion]);

  return (
    <ScreenLayout
      eyebrow={t("hajj.eyebrow")}
      title={t("hajj.umrahChecklistTitle")}
      subtitle={t("hajj.umrahChecklistSubtitle")}
      onBack={() => goBackOrReplace(router, "/hajj" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/umrah/checklist" />
      <Stagger>
        <JannahCallout tone="info">{t("hajj.umrahChecklistIntro")}</JannahCallout>
        <PilgrimageChecklistView
          items={items}
          done={done}
          onToggle={(id) => void toggle(id)}
          onReset={() => void reset()}
        />
        {/* NF-3.0a: tawaf needs wudu — a condition for most schools, wajib for Hanafis. */}
        <GuideMadhhabNotes ids={SCREEN_DIFFERENCES["/umrah/checklist"]} />
        <JannahDisclaimer textKey="hajj.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/umrah/checklist");
