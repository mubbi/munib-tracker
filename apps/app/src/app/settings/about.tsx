import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { DownloadNativeAppsSection } from "@/components/settings/download-native-apps-section";
import { SettingsColumns, useSettingsTwoColumn } from "@/components/settings/settings-layout";
import { SettingsRow } from "@/components/settings/settings-rows";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useReviewPrompt } from "@/features/reviews/context/ReviewPromptContext";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";

const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app";
const PRIVACY_URL = `${SITE_URL}/privacy`;
const TERMS_URL = `${SITE_URL}/terms`;

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { maybePromptReview, canRateApp } = useReviewPrompt();
  const version = resolveAppVersion();
  const isWeb = Platform.OS === "web";
  const tv = isTV();
  // Wide web / tablets: brand + reading cards on the start side, credits and
  // links on the end side instead of one long stretched stack.
  const twoColumn = useSettingsTwoColumn();
  /** TV has no in-app browser — show the link as a QR to open on a phone instead. */
  const [qrLink, setQrLink] = useState<{ url: string; title: string } | null>(null);

  const openLink = (url: string, title: string) => {
    if (tv) {
      setQrLink({ url, title });
      return;
    }
    void openBrowserAsync(url);
  };

  const heroCard = (
    <Card style={styles.hero}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/munib-logo.png")}
        accessibilityLabel={APP_NAME}
      />
      <ThemedText type="subtitle">{APP_NAME}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.tagline}>
        {t("common.appTagline")}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("about.version", { version })}
      </ThemedText>
    </Card>
  );

  const creditsCard = (
    <Card padding="three">
      <SectionHeader
        title={t("about.credits")}
        icon={{ ios: "person.2.fill", android: "group", web: "group" }}
      />
      <View style={styles.creditRows}>
        <Credit label={t("about.authorLabel")} value={APP_AUTHOR} />
        <Credit
          label={t("about.authorWebsiteLabel")}
          value={APP_AUTHOR_URL.replace(/^https?:\/\//, "")}
          onPress={() => openLink(APP_AUTHOR_URL, t("about.authorWebsiteLabel"))}
          linkColor={colors.accent}
        />
        <Credit label={t("about.collaboratorsLabel")} value={t("about.collaboratorsValue")} />
      </View>
    </Card>
  );

  const duaCard = (
    <Card variant="muted" padding="three">
      <ThemedText type="smallBold">{t("about.duaTitle")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.dua}>
        {t("about.duaBody")}
      </ThemedText>
    </Card>
  );

  const authenticityCard = (
    <Card padding="three">
      <SectionHeader
        title={t("about.authenticityTitle")}
        icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
      />
      <ThemedText type="small" themeColor="mutedForeground" style={styles.authenticity}>
        {t("about.authenticityBody")}
      </ThemedText>
    </Card>
  );

  const downloadCard = isWeb ? (
    <Card padding="three">
      <SectionHeader
        title={t("settings.downloadNativeApps")}
        icon={{ ios: "arrow.down.app.fill", android: "download", web: "download" }}
      />
      <DownloadNativeAppsSection />
    </Card>
  ) : null;

  const linksCard = (
    <Card padding="three">
      <View style={styles.links}>
        {/* Store review prompts are a no-op on TV. */}
        {!isWeb && !tv && canRateApp ? (
          <SettingsRow
            icon={{ ios: "star.fill", android: "star", web: "star" }}
            title={t("settings.rateApp")}
            subtitle={t("settings.rateAppDesc")}
            onPress={maybePromptReview}
          />
        ) : null}
        <SettingsRow
          icon={{ ios: "hand.raised.fill", android: "privacy_tip", web: "privacy_tip" }}
          title={t("about.privacyPolicy")}
          preferredFocus={tv}
          onPress={() => openLink(PRIVACY_URL, t("about.privacyPolicy"))}
        />
        <SettingsRow
          icon={{ ios: "doc.text.fill", android: "description", web: "description" }}
          title={t("about.termsOfService")}
          onPress={() => openLink(TERMS_URL, t("about.termsOfService"))}
        />
      </View>
    </Card>
  );

  return (
    <ScreenLayout
      eyebrow={t("about.eyebrow")}
      title={t("about.title")}
      subtitle={t("about.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/about" />
      {twoColumn ? (
        <SettingsColumns
          start={
            <>
              {heroCard}
              {duaCard}
              {authenticityCard}
            </>
          }
          end={
            <>
              {creditsCard}
              {downloadCard}
              {linksCard}
            </>
          }
        />
      ) : (
        <Stagger>
          {heroCard}
          {creditsCard}
          {duaCard}
          {authenticityCard}
          {downloadCard}
          {linksCard}
        </Stagger>
      )}

      {tv ? (
        <Sheet visible={qrLink != null} onClose={() => setQrLink(null)}>
          {qrLink ? (
            <View style={styles.qrSheet}>
              <ThemedText type="subtitle">{qrLink.title}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground" style={styles.qrHint}>
                {t("about.scanOnPhoneTv")}
              </ThemedText>
              <BrandQrCode data={qrLink.url} size={tvDp(240)} accessibilityLabel={qrLink.title} />
              <ThemedText type="caption" themeColor="mutedForeground" selectable>
                {qrLink.url.replace(/^https?:\/\//, "")}
              </ThemedText>
              {/* Gives the D-pad a target inside the sheet; remote Back also closes it. */}
              <Button
                label={t("common.done")}
                variant="secondary"
                preferredFocus
                onPress={() => setQrLink(null)}
              />
            </View>
          ) : null}
        </Sheet>
      ) : null}
    </ScreenLayout>
  );
}

function Credit({
  label,
  value,
  onPress,
  linkColor,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  linkColor?: string;
}) {
  const tv = isTV();
  const valueNode = (
    <ThemedText type="small" style={linkColor ? { color: linkColor } : undefined}>
      {value}
    </ThemedText>
  );

  return (
    <View style={styles.credit}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      {onPress ? (
        <PressableScale
          accessibilityRole="link"
          onPress={onPress}
          // TV: a bare text link is too small to see focus on — give it a chip.
          style={tv ? styles.linkTv : undefined}
        >
          {valueNode}
        </PressableScale>
      ) : (
        valueNode
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 22,
    marginBottom: Spacing.one,
  },
  tagline: {
    textAlign: "center",
    maxWidth: 280,
  },
  creditRows: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  credit: {
    gap: 2,
  },
  dua: {
    marginTop: Spacing.two,
  },
  authenticity: {
    marginTop: Spacing.three,
  },
  links: {
    gap: Spacing.two,
  },
  linkTv: {
    alignSelf: "flex-start",
    minHeight: TvLayout.chipMinHeight,
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
  },
  qrSheet: {
    alignItems: "center",
    gap: Spacing.three,
  },
  qrHint: {
    textAlign: "center",
  },
});
