import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FocusLockEvidence } from "@/components/focus-lock/focus-lock-evidence";
import {
  FocusLockSettingsForm,
  ToggleRow,
  useFocusLockPrefs,
} from "@/components/focus-lock/focus-lock-settings-form";
import { ScreenLayout } from "@/components/screen-layout";
import { ToolSeo } from "@/components/seo/tool-seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useFocusPlan } from "@/hooks/use-focus-lock";
import { focusLockCapability, focusLockPlatform, pickApps } from "@/lib/focus-lock/native";
import { asTranslate, windowPrayerLabel } from "@/lib/focus-lock/payload";
import { patchFocusLockPrefs, toggleQuietDate } from "@/lib/focus-lock/prefs";
import { emergencyCountLastWeek } from "@/lib/focus-lock/state";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { formatPrayerTime } from "@/lib/prayer-times";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { focusLockStore, useFocusLockDevice } from "@/stores/focus-lock-store";
import { usePreferences } from "@/stores/preferences-store";

const SETUP_HREF = "/focus-lock/setup" as Href;

/**
 * NF-3.13 Salah focus hub (Devices & integrations › Salah focus): status, the
 * on/off switch, pause today, chosen apps, timing & mode, and the neutral
 * emergency-unlock count. TV is read-only (set it up on the phone).
 */
export default function FocusLockScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  const { timeFormat, activeExcusedReason } = usePreferences();
  const [prefs, save] = useFocusLockPrefs();
  const plan = useFocusPlan();
  const device = useFocusLockDevice();
  const hard = focusLockCapability() === "hard";
  const platform = focusLockPlatform();
  const today = getLocalDateString(plan.now);
  const pausedToday = prefs.schedule.quietDates?.includes(today) ?? false;
  const needsSetup = !tv && hard && !device.setupDone;

  const statusLine = (() => {
    if (!prefs.enabled) return null;
    if (activeExcusedReason && prefs.pauseWhileExcused) return t("focusLock.hub.pausedExcused");
    if (pausedToday) return t("focusLock.hub.pausedToday");
    if (plan.active) {
      return t("focusLock.chip", { time: formatPrayerTime(plan.active.end, timeFormat) });
    }
    if (plan.next) {
      return t("focusLock.hub.next", {
        prayer: windowPrayerLabel(plan.next.prayers, asTranslate(t)),
        time: formatPrayerTime(plan.next.start, timeFormat),
      });
    }
    return t("focusLock.hub.none");
  })();

  const chooseApps = async () => {
    if (platform === "android") {
      router.push(`${SETUP_HREF}?step=apps` as Href);
      return;
    }
    const { count } = await pickApps();
    await focusLockStore.getState().patch({ appsCount: count });
  };

  return (
    <ScreenLayout
      eyebrow={t("focusLock.eyebrow")}
      title={t("focusLock.title")}
      subtitle={t("focusLock.subtitle")}
      onBack={() => goBackOrReplace(router, "/settings")}
    >
      <ToolSeo path="/focus-lock" name={t("focusLock.title")} />
      <Stagger>
        <Card padding="four">
          <SectionHeader
            title={t("focusLock.hub.statusTitle")}
            icon={{
              ios: "moon.circle.fill",
              android: "do_not_disturb_on",
              web: "do_not_disturb_on",
            }}
          />
          <View style={styles.stack}>
            {tv ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {t("focusLock.hub.tvNote")}
              </ThemedText>
            ) : null}
            {!tv && !hard ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {t("focusLock.hub.softNote")}
              </ThemedText>
            ) : null}
            {needsSetup ? (
              <Button label={t("focusLock.hub.setup")} onPress={() => router.push(SETUP_HREF)} />
            ) : (
              <ToggleRow
                label={t("focusLock.hub.enabled")}
                value={prefs.enabled}
                readOnly={tv}
                onChange={(enabled) => void save(patchFocusLockPrefs(prefs, { enabled }))}
              />
            )}
            {statusLine ? (
              <ThemedText type="smallBold" accessibilityLiveRegion="polite">
                {statusLine}
              </ThemedText>
            ) : null}
            {!tv && prefs.enabled ? (
              <Button
                variant="secondary"
                size="sm"
                label={pausedToday ? t("focusLock.hub.resumeToday") : t("focusLock.hub.pauseToday")}
                onPress={() => void save(toggleQuietDate(prefs, today, !pausedToday))}
              />
            ) : null}
            {!tv && hard && device.setupDone ? (
              <View style={styles.row}>
                <ThemedText type="small" style={styles.flex}>
                  {device.appsCount <= 0
                    ? t("focusLock.setup.apps.noneYet")
                    : platform === "ios"
                      ? t("focusLock.setup.apps.selectedItems", { count: device.appsCount })
                      : t("focusLock.setup.apps.selectedApps", { count: device.appsCount })}
                </ThemedText>
                <Button
                  variant="ghost"
                  size="sm"
                  label={t("focusLock.hub.chooseApps")}
                  onPress={() => void chooseApps()}
                />
              </View>
            ) : null}
            {!tv && !needsSetup ? (
              <Button
                variant="ghost"
                size="sm"
                label={t("focusLock.hub.setupAgain")}
                onPress={() => router.push(SETUP_HREF)}
              />
            ) : null}
          </View>
        </Card>

        <Card padding="four">
          <SectionHeader
            title={t("focusLock.hub.settingsTitle")}
            icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
          />
          <FocusLockSettingsForm iqamahAvailable={plan.iqamahAvailable} readOnly={tv} />
        </Card>

        {!tv ? (
          <Card padding="four">
            <ThemedText type="small" themeColor="mutedForeground">
              {t("focusLock.hub.unlocksWeek", {
                count: emergencyCountLastWeek(device.emergencyLog, plan.now),
              })}
            </ThemedText>
          </Card>
        ) : null}

        <FocusLockEvidence />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three, marginTop: Spacing.two },
  row: { alignItems: "center", flexDirection: "row", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/focus-lock");
