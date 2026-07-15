import * as Linking from "expo-linking";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { APP_SCHEME, GOOGLE_OAUTH_REDIRECT_PATH } from "@/lib/auth/oauth-config";

/**
 * Google OAuth return handler for the app custom scheme / reversed-client-id path.
 * Used when Android Custom Tabs dismiss without delivering the auth-session result.
 */
export default function OAuth2RedirectRoute() {
  const params = useLocalSearchParams<{ code?: string | string[]; state?: string | string[] }>();
  const { resumeGoogleFromUrl } = useSocialAuth();
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
        returnUrl = `${APP_SCHEME}:/${GOOGLE_OAUTH_REDIRECT_PATH}?${query.toString()}`;
      }
      if (!returnUrl) {
        returnUrl = await Linking.getInitialURL();
      }
      if (returnUrl) {
        await resumeGoogleFromUrl(returnUrl);
      }
      setDone(true);
    })();
  }, [params.code, params.state, resumeGoogleFromUrl]);

  if (!done) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Redirect href="/(auth)/login" />;
}
