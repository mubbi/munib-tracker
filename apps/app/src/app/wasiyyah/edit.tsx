import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ScrollViewInstance } from "react-native";

import { PrivateRecordsTvUnavailable } from "@/components/records/tv-unavailable";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { VaultLockGate } from "@/components/vault";
import { initialWasiyyahData, WasiyyahWizard } from "@/components/wasiyyah/wasiyyah-wizard";
import { useWizardFooterSlot } from "@/components/wizard/wizard-shell";
import { useHydrationSafeReducedMotion } from "@/hooks/use-hydration-safe-reduced-motion";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useWasiyyah } from "@/lib/wasiyyah/wasiyyah-store";

function WizardLoader({ onStepChange }: { onStepChange: () => void }) {
  const { t } = useTranslation();
  const { versions, draft, isReady } = useWasiyyah();
  // Chrome stays mounted; the body shows a skeleton until the vault doc loads (R-19).
  if (!isReady) {
    return <SkeletonPlaceholder preset="card" accessibilityLabel={t("common.loadingRoute")} />;
  }
  return (
    <WasiyyahWizard
      initialData={initialWasiyyahData(draft, versions[0]?.data)}
      onStepChange={onStepChange}
    />
  );
}

/** The wasiyyah wizard (sections 1–8 + review). Hidden on TV. */
export default function WasiyyahEditScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduceMotion = useHydrationSafeReducedMotion();
  const scrollRef = useRef<ScrollViewInstance>(null);
  // Each step starts at its title, not wherever the previous step was scrolled to.
  const scrollToTop = useCallback(
    () => scrollRef.current?.scrollTo({ y: 0, animated: !reduceMotion }),
    [reduceMotion],
  );
  // The step Back / Next row pins above the keyboard and tab bar on phones.
  const footerSlot = useWizardFooterSlot();
  return (
    <ScreenLayout
      eyebrow={t("wasiyyah.title")}
      title={t("wasiyyah.wizard.title")}
      onBack={() => goBackOrReplace(router, "/wasiyyah")}
      scrollRef={scrollRef}
      footer={footerSlot.footer}
    >
      <Seo path="/wasiyyah/edit" />
      {isTV() ? (
        <PrivateRecordsTvUnavailable bodyKey="wasiyyah.tvBody" />
      ) : (
        <VaultLockGate>
          <footerSlot.Provider>
            <WizardLoader onStepChange={scrollToTop} />
          </footerSlot.Provider>
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/wasiyyah/edit");
