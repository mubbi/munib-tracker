import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { circleErrorStatus, redeemChildLink } from "@/lib/circles/api";
import { saveChildSession, useChildSession } from "@/lib/circles/child-session";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

const LINK_TOKEN_RE = /^mtl_[A-Za-z0-9_-]{16,64}$/;

/**
 * Child device: redeem the parent's one-time QR (5-minute token) for a scoped
 * child session. Opened from the QR (the phone camera opens the App Link
 * `…/kids/link?token=mtl_…`) or by pasting the token. No email, no password.
 */
export default function KidsLinkScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useChildSession();
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const fromLink = (Array.isArray(params.token) ? params.token[0] : params.token) ?? "";
  const [token, setToken] = useState(fromLink);
  const [status, setStatus] = useState<"idle" | "linking" | "error">("idle");
  const [errorKey, setErrorKey] = useState("kids.link.error");
  const autoRan = useRef(false);
  const valid = LINK_TOKEN_RE.test(token.trim());

  const redeem = async (value: string) => {
    setStatus("linking");
    try {
      const result = await redeemChildLink(value.trim());
      await saveChildSession(result.childToken, result.child);
      router.replace("/kids");
    } catch (error) {
      const code = circleErrorStatus(error);
      setErrorKey(
        code === 429
          ? "kids.link.rateLimited"
          : code === 0
            ? "circles.common.offline"
            : "kids.link.error",
      );
      setStatus("error");
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: redeem once per opened link.
  useEffect(() => {
    if (autoRan.current || !LINK_TOKEN_RE.test(fromLink)) return;
    autoRan.current = true;
    void redeem(fromLink);
  }, [fromLink]);

  return (
    <ScreenLayout
      eyebrow={t("kids.eyebrow")}
      title={t("kids.link.title")}
      subtitle={t("kids.link.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/kids/link" index={false} />
      <View style={styles.stack}>
        {isTV() ? (
          <Card padding="three">
            <ThemedText type="small" themeColor="mutedForeground">
              {t("kids.tvUnavailable")}
            </ThemedText>
          </Card>
        ) : session.token ? (
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small">{t("kids.link.already")}</ThemedText>
            <Button label={t("kids.link.open")} onPress={() => router.replace("/kids")} />
          </Card>
        ) : (
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("kids.link.howTo")}
            </ThemedText>
            <TextField
              label={t("kids.link.tokenLabel")}
              value={token}
              onChangeText={setToken}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {status === "error" ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {t(errorKey)}
              </ThemedText>
            ) : null}
            <Button
              label={status === "linking" ? t("circles.common.working") : t("kids.link.cta")}
              disabled={!valid || status === "linking"}
              onPress={() => void redeem(token)}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("kids.link.privacy")}
            </ThemedText>
          </Card>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids/link");
