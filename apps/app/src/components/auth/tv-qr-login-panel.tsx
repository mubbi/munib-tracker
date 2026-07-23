import type { AuthSessionResponseDto } from "@munib-tracker/api-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { createTvPairing, pollTvPairing, type TvPairingCreateResponse } from "@/api/endpoints";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildHttpsAppUrl } from "@/lib/app-links";

const POLL_MS = 2500;

type TvQrLoginPanelProps = {
  onSession: (session: AuthSessionResponseDto) => Promise<void>;
  /** Prefer focus on the refresh/retry control when the QR is ready. */
  preferredFocus?: boolean;
};

/**
 * Living-room QR companion login: TV shows a code; phone scans and signs in;
 * TV polls until a session arrives.
 */
export function TvQrLoginPanel({ onSession, preferredFocus }: TvQrLoginPanelProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [pairing, setPairing] = useState<TvPairingCreateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const claimedRef = useRef(false);

  const startPairing = useCallback(async () => {
    setBusy(true);
    setError(null);
    claimedRef.current = false;
    try {
      const next = await createTvPairing();
      // Prefer app-built HTTPS URL so local EXPO_PUBLIC_APP_URL overrides apply.
      setPairing({
        ...next,
        claimUrl: buildHttpsAppUrl(`/tv-pair?code=${encodeURIComponent(next.code)}`),
      });
    } catch {
      setError(t("tv.qrCreateError"));
      setPairing(null);
    } finally {
      setBusy(false);
    }
  }, [t]);

  useEffect(() => {
    void startPairing();
  }, [startPairing]);

  useEffect(() => {
    if (!pairing || claimedRef.current) return;

    const tick = async () => {
      try {
        const status = await pollTvPairing(pairing.code);
        if (status.status === "expired") {
          setError(t("tv.qrExpired"));
          setPairing(null);
          return;
        }
        if (status.status === "ready" && status.session && !claimedRef.current) {
          claimedRef.current = true;
          await onSession(status.session);
        }
      } catch {
        // Keep polling through transient network blips.
      }
    };

    const id = setInterval(() => void tick(), POLL_MS);
    void tick();
    return () => clearInterval(id);
  }, [pairing, onSession, t]);

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: tokens.accentBorder,
        },
      ]}
      accessibilityLabel={t("tv.qrA11y")}
    >
      <ThemedText type="smallBold" style={{ fontSize: TvLayout.bodyFontSize }}>
        {t("tv.qrTitle")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("tv.qrHint")}
      </ThemedText>

      {busy && !pairing ? <ActivityIndicator color={colors.accent} style={styles.spinner} /> : null}

      {pairing ? (
        <>
          <BrandQrCode
            data={pairing.claimUrl}
            size={200}
            accessibilityLabel={t("tv.qrImageA11y")}
          />
          <ThemedText type="title" style={[styles.code, { color: colors.accentText }]}>
            {pairing.displayCode}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("tv.qrWaiting")}
          </ThemedText>
        </>
      ) : null}

      {error ? (
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
          {error}
        </ThemedText>
      ) : null}

      <Button
        label={pairing ? t("tv.qrRefresh") : t("tv.qrRetry")}
        variant="secondary"
        fullWidth
        preferredFocus={preferredFocus && !pairing}
        onPress={() => void startPairing()}
        disabled={busy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  hint: {
    textAlign: "center",
    maxWidth: 420,
  },
  spinner: {
    marginVertical: Spacing.four,
  },
  code: {
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
});
