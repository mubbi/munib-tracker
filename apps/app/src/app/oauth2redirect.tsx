import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { APP_SCHEME, GOOGLE_OAUTH_REDIRECT_PATH } from "@/lib/auth/oauth-config";

/**
 * Google OAuth return handler for the app custom scheme / reversed-client-id path.
 * Used when Android Custom Tabs dismiss without delivering the auth-session result.
 */
export default function OAuth2RedirectRoute() {
  const params = useLocalSearchParams<{ code?: string; state?: string }>();
  const { resumeGoogleFromUrl } = useSocialAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams();
    if (typeof params.code === "string") query.set("code", params.code);
    if (typeof params.state === "string") query.set("state", params.state);
    const returnUrl = `${APP_SCHEME}:/${GOOGLE_OAUTH_REDIRECT_PATH}?${query.toString()}`;
    void resumeGoogleFromUrl(returnUrl).finally(() => setDone(true));
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
