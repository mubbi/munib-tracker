import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useReviewPrompt } from "@/features/reviews/context/ReviewPromptContext";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import { isTV } from "@/lib/platform/is-tv";

import { SettingsRow } from "../settings-rows";

const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app";
const PRIVACY_URL = `${SITE_URL}/privacy`;
const TERMS_URL = `${SITE_URL}/terms`;

/**
 * Version, credits, the authenticity note, rate the app, privacy policy and
 * terms (Help & about). Web's "get the native app" lives in Devices.
 */
export function AboutPanel() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { canWriteReview, openWriteReview, openFeedback } = useReviewPrompt();
  const version = resolveAppVersion();
  const tv = isTV();
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
    <Card padding="four" style={styles.hero}>
      <Image
        style={styles.logo}
        source={require("@/assets/images/munib-logo-gold.png")}
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
    <Card>
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
          linkColor={colors.accentText}
        />
        <Credit label={t("about.collaboratorsLabel")} value={t("about.collaboratorsValue")} />
      </View>
    </Card>
  );

  const duaCard = (
    <Card variant="muted">
      <ThemedText type="smallBold">{t("about.duaTitle")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground" style={styles.dua}>
        {t("about.duaBody")}
      </ThemedText>
    </Card>
  );

  const authenticityCard = (
    <Card>
      <SectionHeader
        title={t("about.authenticityTitle")}
        icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
      />
      <ThemedText type="small" themeColor="mutedForeground" style={styles.authenticity}>
        {t("about.authenticityBody")}
      </ThemedText>
    </Card>
  );

  const linksCard = (
    <Card>
      <View style={styles.links}>
        {/* Always available on store builds: opens the store's write-review page
            (never the OS review sheet, which may silently not show — D76). */}
        {canWriteReview ? (
          <SettingsRow
            icon={{ ios: "star.fill", android: "star", web: "star" }}
            title={t("settings.rateApp")}
            subtitle={t("settings.rateAppDesc")}
            onPress={() => void openWriteReview()}
          />
        ) : null}
        {/* Private note to the team — needs a keyboard, so not on TV. */}
        {!tv ? (
          <SettingsRow
            icon={{ ios: "envelope.fill", android: "mail", web: "mail" }}
            title={t("settings.sendFeedback")}
            subtitle={t("settings.sendFeedbackDesc")}
            onPress={openFeedback}
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
    <View style={styles.stack}>
      {heroCard}
      {linksCard}
      {creditsCard}
      {authenticityCard}
      {duaCard}
      {tv ? (
        <Sheet
          accessibilityLabel={qrLink?.title ?? ""}
          visible={qrLink != null}
          onClose={() => setQrLink(null)}
        >
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
    </View>
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
  stack: {
    gap: Spacing.three,
  },
  hero: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: Radius.lg,
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
    gap: Spacing.half,
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
