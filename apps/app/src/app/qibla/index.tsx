import { Coordinates, Qibla } from "adhan";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Magnetometer } from "expo-sensors";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const KAABA = { lat: 21.4225, lng: 39.8262 };

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function QiblaScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [bearing, setBearing] = useState<number | null>(null);
  const [heading, setHeading] = useState(0);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCompass, setHasCompass] = useState(false);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (mounted) setError("qibla.locationDenied");
        return;
      }
      try {
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        if (!mounted) return;
        setBearing(Qibla(new Coordinates(latitude, longitude)));
        setDistance(haversineKm(latitude, longitude, KAABA.lat, KAABA.lng));
      } catch {
        if (mounted) setError("qibla.locationError");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    void (async () => {
      const available = await Magnetometer.isAvailableAsync().catch(() => false);
      if (!available) return;
      setHasCompass(true);
      Magnetometer.setUpdateInterval(100);
      subscription = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        setHeading(angle);
      });
    })();
    return () => subscription?.remove();
  }, []);

  const arrowAngle = bearing != null ? (bearing - heading + 360) % 360 : 0;

  return (
    <ScreenLayout
      eyebrow={t("qibla.eyebrow")}
      title={t("settings.qibla")}
      subtitle={t("qibla.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card style={styles.compassCard}>
          <View style={[styles.dial, { borderColor: tokens.hairline }]}>
            <View
              style={[
                styles.needle,
                {
                  transform: [{ rotate: `${hasCompass ? arrowAngle : (bearing ?? 0)}deg` }],
                },
              ]}
            >
              <SymbolView
                name={{ ios: "location.north.fill", android: "navigation", web: "navigation" }}
                size={72}
                tintColor={colors.accent}
              />
            </View>
            <View style={[styles.kaaba, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="caption" style={{ color: colors.accent }}>
                🕋
              </ThemedText>
            </View>
          </View>

          {bearing != null ? (
            <ThemedText type="header">{Math.round(bearing)}°</ThemedText>
          ) : (
            <ThemedText type="small" themeColor="mutedForeground">
              {error ? t(error) : t("qibla.locating")}
            </ThemedText>
          )}
          {distance != null ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("qibla.distanceKm", { km: distance.toLocaleString() })}
            </ThemedText>
          ) : null}
        </Card>

        {!hasCompass && bearing != null ? (
          <Card variant="muted" padding="three">
            <ThemedText type="small" themeColor="mutedForeground">
              {Platform.OS === "web" ? t("qibla.webHint") : t("qibla.noCompassHint")}
            </ThemedText>
          </Card>
        ) : (
          <Card variant="muted" padding="three">
            <ThemedText type="small" themeColor="mutedForeground">
              {t("qibla.calibrateHint")}
            </ThemedText>
          </Card>
        )}

        {error && bearing == null ? (
          <Button label={t("qibla.tryAgain")} onPress={() => router.replace("/qibla")} />
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  compassCard: {
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  dial: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  needle: {
    alignItems: "center",
    justifyContent: "center",
  },
  kaaba: {
    position: "absolute",
    top: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
