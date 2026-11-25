import * as Linking from "expo-linking";
import { type Href, Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { OAuthReturnPending } from "@/components/auth/oauth-return-pending";
import { OAUTH_RETURN_ERROR } from "@/components/auth/social-auth-errors";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { getWebAppOrigin } from "@/lib/auth/oauth-config";
import { loadAppleOAuthPendingSession } from "@/lib/oauth/oauth-pending";
import { sanitizeOAuthReturnTo } from "@/lib/oauth/oauth-return-to";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * HTTPS App Link return route for Apple OAuth (Android / iOS OAuth fallback).
 * Completes the pending PKCE exchange then returns to the screen that started
 * sign-in so the logged-in UI can render (same as web/iOS in-place completion).
 */
export default function AppleOAuthRedirectRoute() {
  const params = useLocalSearchParams<{ code?: string | string[]; state?: string | string[] }>();
  const { resumeAppleFromUrl } = useSocialAuth();
  const [href, setHref] = useState<Href | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void (async () => {
      const pending = await loadAppleOAuthPendingSession();
      const returnTo = sanitizeOAuthReturnTo(pending?.returnTo);

      const codeParam = Array.isArray(params.code) ? params.code[0] : params.code;
      const stateParam = Array.isArray(params.state) ? params.state[0] : params.state;

      let returnUrl: string | null = null;
      if (typeof codeParam === "string" && codeParam) {
        const query = new URLSearchParams({ code: codeParam });
        if (typeof stateParam === "string" && stateParam) query.set("state", stateParam);
        returnUrl = `${getWebAppOrigin()}/oauth/apple?${query.toString()}`;
      }
      if (!returnUrl) {
        returnUrl = await Linking.getInitialURL();
      }

      let outcome: "success" | "skipped" | "failed" = "skipped";
      if (returnUrl) {
        outcome = await resumeAppleFromUrl(returnUrl);
      }

      // D-32: a failed exchange tells the login screen why it is back there.
      setHref(
        outcome === "failed"
          ? { pathname: "/(auth)/login", params: { error: OAUTH_RETURN_ERROR } }
          : returnTo,
      );
    })();
  }, [params.code, params.state, resumeAppleFromUrl]);

  if (!href) return <OAuthReturnPending />;
  return <Redirect href={href} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/oauth/apple");
