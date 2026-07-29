import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PilgrimageChecklistView } from "@/components/hajj/pilgrimage-checklist-view";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { getUmrahChecklistItems } from "@/lib/hajj-guide";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useEnsureUmrahChecklistLoaded,
  useUmrahChecklist,
  useUmrahChecklistActions,
} from "@/stores/umrah-checklist-store";

export default function UmrahChecklistScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
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
        <JannahDisclaimer textKey="hajj.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}
