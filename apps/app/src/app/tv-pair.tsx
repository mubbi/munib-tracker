import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { claimTvPairing } from "@/api/endpoints";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { EmptyState } from "@/components/ui/empty-state";
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
      // D-35: with no code the body says it once (no duplicated subtitle).
      subtitle={code ? t("tv.qrPhoneSubtitle", { code }) : undefined}
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
          <EmptyState
            icon={{ ios: "qrcode.viewfinder", android: "qr_code_scanner", web: "qr_code_scanner" }}
            title={t("tv.qrMissingCodeTitle")}
            description={t("tv.qrScanAgain")}
            actionLabel={t("notFound.action")}
            onAction={() => goBackOrReplace(router, "/")}
          />
        ) : null}

        {code && (!isAuthenticated || isGuest) ? (
          <>
            <ThemedText type="small" themeColor="mutedForeground">
              {/* Guests already have a session — they need a linked account, not "sign in". */}
              {isGuest ? t("tv.qrNeedLinkedAccount") : t("tv.qrSignInFirst")}
            </ThemedText>
            <SocialLoginButtons
              onSuccess={() => {
                // Signed in: the confirm button appears; the claim still needs a tap.
              }}
            />
          </>
        ) : null}

        {code &&
        isReady &&
        isAuthenticated &&
        !isGuest &&
        (status === "idle" || status === "claiming") ? (
          <Button
            label={status === "claiming" ? t("tv.qrClaiming") : t("tv.qrPhoneTitle")}
            fullWidth
            preferredFocus
            loading={status === "claiming"}
            onPress={() => void claim()}
          />
        ) : null}

        {status === "done" ? (
          <>
            <Callout tone="success">{t("tv.qrClaimSuccess")}</Callout>
            <Button
              label={t("common.done")}
              fullWidth
              preferredFocus
              onPress={() => goBackOrReplace(router, "/")}
            />
          </>
        ) : null}

        {/* Guests already see the one "link an account" message above — no doomed Retry. */}
        {error && !isGuest ? (
          <Callout
            tone="danger"
            action={{
              label: t("tv.qrRetry"),
              onPress: () => {
                claimedRef.current = false;
                void claim();
              },
            }}
          >
            {error}
          </Callout>
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
