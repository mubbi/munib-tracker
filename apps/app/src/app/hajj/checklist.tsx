import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PilgrimageChecklistView } from "@/components/hajj/pilgrimage-checklist-view";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { getHajjChecklistItems } from "@/lib/hajj-guide";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useEnsureHajjChecklistLoaded,
  useHajjChecklist,
  useHajjChecklistActions,
} from "@/stores/hajj-checklist-store";

export default function HajjChecklistScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  useEnsureHajjChecklistLoaded();
  const done = useHajjChecklist();
  const { toggle, reset } = useHajjChecklistActions();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const items = useMemo(() => getHajjChecklistItems(), [i18n.language, overlayVersion]);

  return (
    <ScreenLayout
      eyebrow={t("hajj.eyebrow")}
      title={t("hajj.hajjChecklistTitle")}
      subtitle={t("hajj.hajjChecklistSubtitle")}
      onBack={() => goBackOrReplace(router, "/hajj" as Href)}
    >
      <Seo path="/hajj/checklist" />
      <Stagger>
        <JannahCallout tone="info">{t("hajj.hajjChecklistIntro")}</JannahCallout>
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
