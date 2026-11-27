import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";

import { Callout } from "@/components/ui/callout";
import { useLocation } from "@/stores/location-store";

/**
 * Warns when Salah times still use the seeded Makkah fallback (B-28): a
 * warning `Callout` with one "Set location" action. Renders nothing once a
 * real location is stored.
 */
export function DefaultLocationBanner({ style }: { style?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  const { t } = useTranslation();
  const location = useLocation();

  if (location.source !== "default") return null;

  return (
    <Callout
      tone="warning"
      title={t("location.defaultCityTitle")}
      action={{ label: t("location.setLocation"), onPress: () => router.push("/location") }}
      style={style}
      testID="default-location-callout"
    >
      {t("location.defaultTimesHint")}
    </Callout>
  );
}
