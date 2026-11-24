import { Redirect, useLocalSearchParams } from "expo-router";

import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Old onboarding step URL — the steps now live in the setup wizard
 * (`/setup`). Kept so bookmarks and deep links still land on the same step.
 */
export default function LegacyOnboardingStep() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  return (
    <Redirect
      href={{ pathname: "/setup", params: next ? { step: "madhhab", next } : { step: "madhhab" } }}
    />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(onboarding)/intro-madhhab");
