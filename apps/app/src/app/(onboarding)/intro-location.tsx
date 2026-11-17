import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Brand, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import {
  canEnableLocalReminders,
  requestNotificationPermission,
} from "@/lib/notifications/permissions";
import { isWeb } from "@/lib/notifications/platform";
import { beginWebNotificationPermissionRequest } from "@/lib/notifications/web-environment";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { rescheduleAll } from "@/notifications/scheduler";
import { locationStore, useLocationActions, useLocationStatus } from "@/stores/location-store";
import { preferencesStore, usePreferencesActions } from "@/stores/preferences-store";

const LOCATION_ICON = {
  ios: "location.fill" as const,
  android: "location_on" as const,
  web: "location_on" as const,
};

/** Desktop / tablet web: split the step into visual + copy columns at this width. */
const WIDE_SPLIT_MIN_WIDTH = 900;

const HIGHLIGHT_ICON = {
  ios: "checkmark.circle.fill" as const,
  android: "check_circle" as const,
  web: "check_circle" as const,
};

function resolveNext(raw: string | string[] | undefined): Href {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "/login" ? "/login" : "/";
}

/**
 * Final onboarding step: explain location + reminder notifications, then request
 * both system permissions when the user taps Continue (App Store 5.1.1(iv): no
 * "Allow" CTA and no Later/skip that delays the iOS permission dialogs).
 * Android / web / TV may still offer "Set up later"; OS dialogs can also appear
 * later from the location picker or notifications screen.
 */
export default function OnboardingLocationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useAppSafeAreaInsets();
  const { next: nextParam } = useLocalSearchParams<{ next?: string }>();
  const { update, setNotificationPrefs } = usePreferencesActions();
  const { requestDeviceLocation } = useLocationActions();
  const status = useLocationStatus();
  const [busy, setBusy] = useState(false);
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Wide (non-TV) windows: icon art beside the copy, actions under the copy
  // instead of a phone column + full-bleed buttons floating in a huge canvas.
  const wide = !tv && width >= WIDE_SPLIT_MIN_WIDTH;
  // Apple 5.1.1(iv): after the pre-prompt, users must proceed to the system
  // permission request — no Later/skip on iPhone/iPad.
  const showSkip = tv || Platform.OS !== "ios";

  const highlights = [
    tTv(t, "onboarding.locationHighlight1", "onboarding.locationHighlight1Tv"),
    tTv(t, "onboarding.locationHighlight2", "onboarding.locationHighlight2Tv"),
    tTv(t, "onboarding.locationHighlight3", "onboarding.locationHighlight3Tv"),
    tTv(t, "onboarding.locationHighlight4", "onboarding.locationHighlight4Tv"),
  ];

  const finish = async () => {
    await update({ hasCompletedOnboarding: true });
    router.replace(resolveNext(nextParam));
  };

  const requestRemindersIfSupported = async () => {
    // Reminder notifications aren't a TV use case — this path is unreachable
    // there anyway since onContinue() returns early for isTV(), but guard explicitly.
    if (isTV()) return;
    if (Platform.OS !== "web" && !canEnableLocalReminders()) return;
    const webGesture = isWeb ? beginWebNotificationPermissionRequest() : null;
    const result = await requestNotificationPermission({
      webPermissionRequest: webGesture,
    });
    if (!result.granted) return;
    await setNotificationPrefs({ masterEnabled: true });
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
  };

  const onContinue = async () => {
    if (busy) return;
    setBusy(true);
    triggerHaptic("light");
    try {
      if (isTV()) {
        // No GPS on TV — finish onboarding (lands on Home or the QR sign-in the
        // user picked), then stack city search on top so Back / picking a city
        // returns there instead of dropping the chosen /login step.
        await finish();
        router.push("/location" as Href);
        return;
      }
      await requestDeviceLocation();
      // Location granted/denied/error — still offer reminders in the same gesture.
      await requestRemindersIfSupported();
      await finish();
    } finally {
      setBusy(false);
    }
  };

  const onSkip = () => {
    if (busy) return;
    triggerHaptic("light");
    void finish();
  };

  const locating = busy || status === "loading";

  const actions = (
    <View style={[styles.actions, tv ? styles.actionsTv : null, wide ? styles.actionsWide : null]}>
      <Button
        label={
          locating
            ? t("onboarding.locationLocating")
            : tv
              ? t("qibla.setLocation")
              : t("onboarding.locationAllow")
        }
        fullWidth
        preferredFocus={tv}
        disabled={locating}
        icon={LOCATION_ICON}
        onPress={() => void onContinue()}
        style={tv || wide ? styles.actionTv : undefined}
      />
      {showSkip ? (
        <Button
          label={t("onboarding.locationSkip")}
          variant="ghost"
          fullWidth
          disabled={locating}
          labelColor={Brand.heroText}
          onPress={onSkip}
          style={[
            tv || wide ? styles.actionTv : null,
            {
              backgroundColor: Brand.onHeroStrongSurface,
              borderColor: withAlpha(Brand.heroText, 0.32),
            },
          ]}
        />
      ) : null}
    </View>
  );

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top },
        gradientBackground(
          `linear-gradient(180deg, ${Brand.heroTop} 0%, ${Brand.heroGlow} 48%, ${Brand.heroBottom} 100%)`,
        ),
      ]}
    >
      <Seo
        path="/intro-location"
        title={t("seo.introLocation.title")}
        description={t("seo.introLocation.description")}
        index={false}
      />
      <StatusBar style="light" />
      <MosqueSilhouette color={Brand.heroBottom} opacity={0.3} scale={1.6} />

      {/* Spacer that mirrors the intro's Skip row; TV reclaims the height. */}
      {tv ? null : (
        <View style={styles.skipRow}>
          <View style={styles.skipButton} />
        </View>
      )}

      <TvScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          tv ? { paddingHorizontal: TvLayout.contentPaddingX } : null,
        ]}
        scrollEnabled={!tv}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TV (landscape, non-scrolling): icon beside a start-aligned copy column. */}
        <View
          style={[styles.content, tv ? styles.contentTv : null, wide ? styles.contentWide : null]}
        >
          <View
            style={[
              styles.icon,
              tv ? styles.iconTv : null,
              wide ? styles.iconWide : null,
              { backgroundColor: Brand.onHeroStrongSurface },
            ]}
          >
            <SymbolView
              name={LOCATION_ICON}
              size={tv ? 56 : wide ? 104 : 52}
              tintColor={Brand.heroAccent}
            />
          </View>

          <View style={tv || wide ? styles.textColTv : styles.textCol}>
            <ThemedText
              type="label"
              style={[
                styles.eyebrow,
                tv || wide ? styles.textStartTv : null,
                { color: Brand.heroAccent },
              ]}
            >
              {t("onboarding.locationEyebrow")}
            </ThemedText>
            <ThemedText
              type="title"
              style={[
                styles.title,
                tv || wide ? styles.textStartTv : null,
                { color: Brand.heroText },
              ]}
            >
              {t("onboarding.locationTitle")}
            </ThemedText>
            <ThemedText
              type="default"
              style={[
                styles.body,
                tv
                  ? [styles.bodyTv, styles.textStartTv]
                  : wide
                    ? [styles.textStartTv, styles.textWide]
                    : null,
                { color: Brand.heroSubtext },
              ]}
            >
              {tTv(t, "onboarding.locationBody", "onboarding.locationBodyTv")}
            </ThemedText>

            <View
              style={[
                styles.highlights,
                tv ? styles.highlightsTv : null,
                wide ? styles.textWide : null,
              ]}
            >
              {highlights.map((line) => (
                <View key={line} style={styles.highlightRow}>
                  <SymbolView name={HIGHLIGHT_ICON} size={18} tintColor={Brand.heroAccent} />
                  <ThemedText
                    type="small"
                    style={[styles.highlightText, { color: Brand.heroText }]}
                  >
                    {line}
                  </ThemedText>
                </View>
              ))}
            </View>

            {!tv ? (
              <View
                style={[
                  styles.privacyCard,
                  wide ? styles.textWide : null,
                  { backgroundColor: Brand.onHeroMutedSurface },
                ]}
              >
                <ThemedText type="smallBold" style={{ color: Brand.heroText }}>
                  {t("onboarding.locationPrivacyTitle")}
                </ThemedText>
                <ThemedText type="small" style={[styles.privacyBody, { color: Brand.heroSubtext }]}>
                  {t("onboarding.locationPrivacyBody")}
                </ThemedText>
              </View>
            ) : null}

            {wide ? actions : null}
          </View>
        </View>
      </TvScrollView>

      {wide ? null : (
        <TvFocusGuide
          autoFocus={tv}
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + Spacing.four,
              paddingHorizontal: tv ? TvLayout.contentPaddingX : Spacing.four,
            },
            tv ? styles.footerTv : null,
          ]}
        >
          {actions}
        </TvFocusGuide>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  skipRow: {
    alignItems: "flex-end",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  skipButton: {
    minWidth: 44,
    minHeight: 44,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Spacing.three,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  contentTv: {
    paddingHorizontal: 0,
    width: "100%",
    maxWidth: tvDp(840),
    alignSelf: "center",
    flexDirection: "row",
    gap: Spacing.five,
  },
  /** Phone: transparent passthrough so the centered column is unchanged. */
  textCol: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: Spacing.two,
  },
  textColTv: {
    flex: 1,
    minWidth: 0,
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  textStartTv: {
    textAlign: "auto",
  },
  iconTv: {
    width: tvDp(144),
    height: tvDp(144),
    borderRadius: tvDp(40),
    marginBottom: 0,
  },
  /** Wide web: visual column beside the copy column (mirrors the TV row). */
  contentWide: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    gap: Spacing.six,
    paddingHorizontal: Spacing.five,
  },
  iconWide: {
    width: 240,
    height: 240,
    borderRadius: 72,
    marginBottom: 0,
  },
  textWide: {
    maxWidth: 520,
  },
  actionsWide: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 520,
    marginTop: Spacing.four,
  },
  footerTv: {
    alignItems: "center",
  },
  actionsTv: {
    flexDirection: "row",
    gap: Spacing.three,
    width: "100%",
    maxWidth: tvDp(640),
  },
  actionTv: {
    flex: 1,
  },
  icon: {
    width: 108,
    height: 108,
    borderRadius: 36,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  eyebrow: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    maxWidth: 320,
  },
  bodyTv: {
    maxWidth: tvDp(560),
    fontSize: TvLayout.bodyFontSize,
    lineHeight: TvLayout.bodyFontSize + 8,
  },
  highlights: {
    width: "100%",
    maxWidth: 340,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  highlightsTv: {
    maxWidth: tvDp(560),
    marginTop: Spacing.one,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  highlightText: {
    flex: 1,
  },
  privacyCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    padding: Spacing.three,
    gap: Spacing.one + 2,
    marginTop: Spacing.three,
  },
  privacyBody: {
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.four,
  },
  actions: {
    gap: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(onboarding)/intro-location");
