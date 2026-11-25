import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { APP_ICON_PREVIEWS } from "@/components/app-icon/app-icon-previews";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import {
  type AppIconOffer,
  type AppIconPreference,
  appIconPreferenceLabelKey,
  dismissAppIconOffer,
  isAppIconModuleAvailable,
  isAppIconPreference,
  pendingAppIconOffer,
} from "@/lib/app-icon";
import { useSetting } from "@/lib/settings/use-setting";
import { useToast } from "@/providers/toast-provider";
import { useStore } from "@/stores/create-store";
import { devicePreferencesStore, useDevicePreferences } from "@/stores/device-preferences-store";
import { useLocation } from "@/stores/location-store";

const THUMB = 56;

/**
 * Home gate for the one-time seasonal icon offer (D75): only where seasonal icons
 * are opt-in (Android), the user never chose in Settings, a season is on, and this
 * season's offer hasn't been answered on this device. Null everywhere else (iOS,
 * web, TV, older binaries) — mount the card only when this returns an offer.
 */
export function useAppIconOffer(): AppIconOffer | null {
  const ready = useStore(devicePreferencesStore, (s) => s.isReady);
  const device = useDevicePreferences();
  const location = useLocation();
  if (!ready || !isAppIconModuleAvailable()) return null;
  return pendingAppIconOffer({
    stored: isAppIconPreference(device.appIcon) ? device.appIcon : undefined,
    seen: device.appIconOffersSeen,
    date: new Date(),
    timeZone: location.timeZone,
  });
}

/**
 * "A Ramadan app icon is available": turns on seasonal icons through the settings
 * registry, or hides the offer until the next season. Android applies the icon only
 * after the user leaves the app, which the confirmation toast says.
 */
export function AppIconOfferCard({ offer }: { offer: AppIconOffer }) {
  const { t } = useTranslation();
  const { setValue } = useSetting<AppIconPreference>("appearance.appIcon");
  const toast = useToast();
  const name = t(appIconPreferenceLabelKey(offer.id));

  return (
    <Card>
      <View style={styles.row}>
        <Image
          source={APP_ICON_PREVIEWS[offer.id]}
          style={styles.thumb}
          contentFit="cover"
          accessible={false}
        />
        <View style={styles.text}>
          <ThemedText type="smallBold">{t("appIcon.offer.title", { name })}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("appIcon.offer.body")}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          label={t("appIcon.offer.accept")}
          fullWidth
          onPress={async () => {
            await setValue("seasonal");
            toast.success(t("appIcon.offer.applied"), t("appIcon.noteAndroid"));
          }}
        />
        <Button
          label={t("appIcon.offer.dismiss")}
          variant="ghost"
          fullWidth
          onPress={() => void dismissAppIconOffer(offer.key)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB * 0.225,
    borderCurve: "continuous",
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
