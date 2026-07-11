import { Redirect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSocialAuth } from "@/hooks/use-social-auth";
import { getWebAppOrigin } from "@/lib/auth/oauth-config";

/**
 * HTTPS App Link return route for Apple OAuth (Android / iOS OAuth fallback).
 * Completes the pending PKCE exchange then returns to the login screen.
 */
export default function AppleOAuthRedirectRoute() {
  const params = useLocalSearchParams<{ code?: string; state?: string }>();
  const { resumeAppleFromUrl } = useSocialAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams();
    if (typeof params.code === "string") query.set("code", params.code);
    if (typeof params.state === "string") query.set("state", params.state);
    const returnUrl = `${getWebAppOrigin()}/oauth/apple?${query.toString()}`;
    void resumeAppleFromUrl(returnUrl).finally(() => setDone(true));
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
