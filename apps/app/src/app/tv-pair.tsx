import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { claimTvPairing } from "@/api/endpoints";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useAuth } from "@/providers/auth-provider";

/**
 * Phone companion route: open from TV QR (`/tv-pair?code=…`), sign in if needed,
 * then claim the pairing so the TV receives a session.
 *
 * Claiming hands a full session for this account to whichever device created the
 * code, so it never happens on link open: anyone can mint a code (the create call
 * is unauthenticated) and send `/tv-pair?code=…` as a link. The user confirms
 * with a tap, next to the code to compare with the one on their TV.
 */
export default function TvPairScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ code?: string | string[] }>();
  const rawCode = Array.isArray(params.code) ? params.code[0] : params.code;
  const code = (rawCode ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  const { session, isAuthenticated, isGuest, isReady } = useAuth();
  const [status, setStatus] = useState<"idle" | "claiming" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const claimedRef = useRef(false);
  const tv = isTV();
  const { isWide } = useLargeScreenLayout();

  const claim = useCallback(async () => {
    if (!code || !session?.accessToken || claimedRef.current) return;
    if (isGuest) {
      setError(t("tv.qrNeedLinkedAccount"));
      setStatus("error");
      return;
    }
    claimedRef.current = true;
    setStatus("claiming");
    setError(null);
    try {
      await claimTvPairing(session.accessToken, code);
      setStatus("done");
    } catch {
      claimedRef.current = false;
      setError(t("tv.qrClaimError"));
      setStatus("error");
    }
  }, [code, session?.accessToken, isGuest, t]);

  // TV should not host the phone claim flow.
  if (tv) {
    return (
      <ScreenLayout title={t("tv.qrTitle")} onBack={() => goBackOrReplace(router, "/login")}>
        <View style={styles.body}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("tv.qrPhoneOnly")}
          </ThemedText>
          {/* Something must hold D-pad focus — jump to the TV QR sign-in panel. */}
          <Button
            label={t("tv.qrTitle")}
            fullWidth
            preferredFocus
            onPress={() => router.replace("/login")}
          />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("tv.qrEyebrow")}
      title={t("tv.qrPhoneTitle")}
      subtitle={code ? t("tv.qrPhoneSubtitle", { code }) : t("tv.qrMissingCode")}
      onBack={() => goBackOrReplace(router, "/")}
      // Wide web: align the header with the 420px claim column below.
      maxContentWidth={isWide ? PAIR_COLUMN_MAX_WIDTH + Spacing.four * 2 : undefined}
    >
      <Seo
        path="/tv-pair"
        title={t("tv.qrPhoneTitle")}
        description={t("tv.qrHint")}
        index={false}
      />

      <View style={styles.body}>
        {!code ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("tv.qrMissingCode")}
          </ThemedText>
        ) : null}

        {code && (!isAuthenticated || isGuest) ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("tv.qrSignInFirst")}
            </ThemedText>
            <SocialLoginButtons
              onSuccess={() => {
                // Signed in: the confirm button appears; the claim still needs a tap.
              }}
            />
          </>
        ) : null}

        {code && isReady && isAuthenticated && !isGuest && status === "idle" ? (
          <Button
            label={t("tv.qrPhoneTitle")}
            fullWidth
            preferredFocus
            onPress={() => void claim()}
          />
        ) : null}

        {status === "claiming" ? (
          <ActivityIndicator accessibilityLabel={t("tv.qrClaiming")} />
        ) : null}

        {status === "done" ? (
          <>
            <ThemedText type="smallBold">{t("tv.qrClaimSuccess")}</ThemedText>
            <Button
              label={t("common.done")}
              fullWidth
              preferredFocus
              onPress={() => goBackOrReplace(router, "/")}
            />
          </>
        ) : null}

        {error ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {error}
            </ThemedText>
            <Button
              label={t("tv.qrRetry")}
              fullWidth
              onPress={() => {
                claimedRef.current = false;
                void claim();
              }}
            />
          </>
        ) : null}
      </View>
    </ScreenLayout>
  );
}

const PAIR_COLUMN_MAX_WIDTH = 420;

const styles = StyleSheet.create({
  body: {
    gap: Spacing.four,
    maxWidth: PAIR_COLUMN_MAX_WIDTH,
    alignSelf: "center",
    width: "100%",
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/tv-pair");
