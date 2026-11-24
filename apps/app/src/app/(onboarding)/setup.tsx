import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Platform } from "react-native";

import {
  DoneStep,
  LanguageStep,
  LocationStep,
  MadhhabStep,
  PersonaliseStep,
  RemindersStep,
  type SetupStepProps,
} from "@/components/onboarding/setup-steps";
import { Seo } from "@/components/seo/seo";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { goBackOrReplace } from "@/lib/navigation";
import {
  adjacentStep,
  completeCoreSetup,
  isCoreSetupDoneAt,
  markSetupStepReviewed,
  readSetupProgress,
  resolveSetupStep,
  type SetupStepId,
  saveSetupProgress,
  setupDestination,
  setupStepPosition,
  setupStepsFor,
} from "@/lib/onboarding/setup-flow";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { getPlatformCtx } from "@/lib/settings/platform";
import { ensureSettingsStoresLoaded } from "@/lib/settings/snapshot";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * Setup wizard — first run (after the welcome screen) and Help & about ›
 * "Run setup again". Language → location & calculation → madhhab → reminders
 * → optional extras → summary. Every control is the registered setting, so the
 * wizard shows the current values and never resets anything. First-run
 * progress is saved per step (a restart resumes it); the app counts as set up
 * once the core steps are done, so the optional ones never block it.
 */
export default function SetupScreen() {
  useMarkColdStartReady();
  const router = useRouter();
  const { t } = useTranslation();
  const { scheme } = useThemeTokens();
  const params = useLocalSearchParams<{ step?: string; next?: string }>();
  const steps = useMemo(() => setupStepsFor(getPlatformCtx()), []);
  const onboarded = useStore(preferencesStore, (s) => s.prefs.hasCompletedOnboarding);
  // Captured once: started after onboarding = "Run setup again".
  const [rerun] = useState(onboarded);
  const [saved] = useState(() => (rerun ? null : readSetupProgress()));
  const [destination] = useState(() => setupDestination(params.next ?? saved?.next));
  const [step, setStep] = useState<SetupStepId>(() =>
    resolveSetupStep(params.step ?? saved?.step, steps),
  );
  // Opened from the summary: the step's Next returns there.
  const [returnToSummary, setReturnToSummary] = useState(false);

  useEffect(() => {
    ensureSettingsStoresLoaded();
  }, []);

  useEffect(() => {
    void saveSetupProgress(step, destination);
  }, [step, destination]);

  const goTo = useCallback(
    (target: SetupStepId) => {
      setStep(target);
      router.setParams({ step: target });
    },
    [router],
  );

  const finish = useCallback(async () => {
    await completeCoreSetup();
    if (rerun) goBackOrReplace(router, "/settings/about");
    else router.replace(destination);
  }, [destination, rerun, router]);

  const advance = useCallback(async () => {
    await markSetupStepReviewed(step);
    const target = returnToSummary ? "done" : adjacentStep(step, steps, 1);
    setReturnToSummary(false);
    if (!target) {
      await finish();
      return;
    }
    if (isCoreSetupDoneAt(target, steps)) await completeCoreSetup();
    goTo(target);
  }, [finish, goTo, returnToSummary, step, steps]);

  const goBack = useCallback(() => {
    const previous = returnToSummary ? "done" : adjacentStep(step, steps, -1);
    setReturnToSummary(false);
    if (previous) goTo(previous);
    else if (rerun) goBackOrReplace(router, "/settings/about");
    // First step of the first run: back to the welcome screen's last page.
    else router.replace({ pathname: "/intro", params: { at: "end" } });
  }, [goTo, rerun, returnToSummary, router, step, steps]);

  // Android back / TV remote Back walk the steps instead of leaving setup.
  // Web has no hardware back (RN Web's BackHandler only logs an error); the
  // browser Back button walks the `?step=` history instead.
  const goBackRef = useRef(goBack);
  goBackRef.current = goBack;
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web") return;
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        goBackRef.current();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  const { position, total } = setupStepPosition(step, steps);
  const props: SetupStepProps = {
    chrome: { position, total, done: step === "done", onBack: goBack },
    onNext: () => void advance(),
  };

  return (
    <>
      <Seo path="/setup" title={t("seo.intro.title")} index={false} />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      {step === "language" ? (
        <LanguageStep key={step} {...props} />
      ) : step === "location" ? (
        <LocationStep key={step} {...props} />
      ) : step === "madhhab" ? (
        <MadhhabStep key={step} {...props} quiet={!rerun} />
      ) : step === "reminders" ? (
        <RemindersStep key={step} {...props} />
      ) : step === "personalise" ? (
        <PersonaliseStep key={step} {...props} />
      ) : (
        <DoneStep
          key={step}
          chrome={props.chrome}
          rerun={rerun}
          destination={destination}
          onFinish={() => void finish()}
          onJump={(target) => {
            setReturnToSummary(true);
            goTo(target);
          }}
        />
      )}
    </>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(onboarding)/setup");
