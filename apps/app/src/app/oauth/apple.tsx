import * as Linking from "expo-linking";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { getWebAppOrigin } from "@/lib/auth/oauth-config";

/**
 * HTTPS App Link return route for Apple OAuth (Android / iOS OAuth fallback).
 * Completes the pending PKCE exchange then returns to the login screen.
 */
export default function AppleOAuthRedirectRoute() {
  const params = useLocalSearchParams<{ code?: string | string[]; state?: string | string[] }>();
  const { resumeAppleFromUrl } = useSocialAuth();
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void (async () => {
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
      if (returnUrl) {
        await resumeAppleFromUrl(returnUrl);
      }
      setDone(true);
    })();
  }, [params.code, params.state, resumeAppleFromUrl]);

  if (!done) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Redirect href="/(auth)/login" />;
}
