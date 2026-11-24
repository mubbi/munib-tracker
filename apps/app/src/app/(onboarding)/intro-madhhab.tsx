import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AsrOfferCard, useMadhhabChooser } from "@/components/fiqh/madhhab-chooser";
import { type MadhhabChoice, MadhhabPicker } from "@/components/fiqh/madhhab-picker";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { Seo } from "@/components/seo/seo";
import { SetupChecklistCard } from "@/components/settings/setup-checklist-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Brand, MaxContentWidth, Spacing, withAlpha } from "@/constants/theme";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useMadhhab } from "@/hooks/use-madhhab";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { settingHref } from "@/lib/settings/routes";
import type { SetupItem } from "@/lib/settings/setup-checklist";
import { useLocation } from "@/stores/location-store";

function resolveNext(raw: string | string[] | undefined): Href {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "/login" ? "/login" : "/";
}

/**
 * Onboarding step after location (NF-3.0a §4.1.1 item 1): "My madhhab" with the
 * shared picker. Picking saves immediately and may offer the matching Asr
 * calculation (never applied automatically). "Decide later" leaves it unset,
 * so the one-time home card asks again.
 */
export default function OnboardingMadhhabScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useAppSafeAreaInsets();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { madhhab } = useMadhhab();
  const location = useLocation();
  const chooser = useMadhhabChooser();
  const [picked, setPicked] = useState(false);

  const finish = () => {
    triggerHaptic("light");
    router.replace(resolveNext(next));
  };

  // Onboarding is already complete by this step, so an item opens its setting.
  const openSetup = (item: SetupItem) => {
    triggerHaptic("light");
    router.replace(settingHref(item.settingId) as Href);
  };

  const onPick = (choice: MadhhabChoice) => {
    setPicked(true);
    void chooser.choose(choice);
  };

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
        gradientBackground(
          `linear-gradient(180deg, ${Brand.heroTop} 0%, ${Brand.heroGlow} 48%, ${Brand.heroBottom} 100%)`,
        ),
      ]}
    >
      <Seo
        path="/intro-madhhab"
        title={t("fiqhRetrofit.onboarding.title")}
        description={t("fiqhRetrofit.onboarding.body")}
        index={false}
      />
      <StatusBar style="light" />
      <MosqueSilhouette color={Brand.heroBottom} opacity={0.3} scale={1.6} />
      <TvScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          <ThemedText type="label" style={{ color: Brand.heroAccent }}>
            {t("fiqhRetrofit.onboarding.eyebrow")}
          </ThemedText>
          <ThemedText type="title" heading={1} style={{ color: Brand.heroText }}>
            {t("fiqhRetrofit.onboarding.title")}
          </ThemedText>
          <ThemedText type="default" style={{ color: Brand.heroSubtext }}>
            {t("fiqhRetrofit.onboarding.body")}
          </ThemedText>

          <MadhhabPicker value={picked ? madhhab : undefined} onChange={onPick} />

          {chooser.offer ? (
            <AsrOfferCard
              offer={chooser.offer}
              currentAsr={location.madhab}
              onAccept={() => void chooser.acceptOffer()}
              onDecline={chooser.declineOffer}
            />
          ) : null}

          {/* Same "Finish setting up" checklist as the Settings hub (§4.5.3); this step asks the madhhab itself. */}
          <SetupChecklistCard
            onOpen={openSetup}
            exclude={["madhhab"]}
            dismissible={false}
            hintKey="settingsGaps.onboarding.setupHint"
          />

          <View style={styles.actions}>
            <Button
              label={t("fiqhRetrofit.onboarding.continue")}
              fullWidth
              disabled={!picked}
              onPress={finish}
            />
            {picked ? null : (
              <Button
                label={t("fiqhRetrofit.onboarding.later")}
                variant="ghost"
                fullWidth
                labelColor={Brand.heroText}
                onPress={finish}
                style={{
                  backgroundColor: Brand.onHeroStrongSurface,
                  borderColor: withAlpha(Brand.heroText, 0.32),
                }}
              />
            )}
          </View>
        </View>
      </TvScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, padding: Spacing.four, alignItems: "center" },
  column: { width: "100%", maxWidth: MaxContentWidth, gap: Spacing.three },
  actions: { gap: Spacing.two, marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(onboarding)/intro-madhhab");
