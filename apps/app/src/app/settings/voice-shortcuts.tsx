import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { goBackOrReplace } from "@/lib/navigation";

export default function VoiceShortcutsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      title={t("externalCommands.title")}
      onBack={() => goBackOrReplace(router, "/settings")}
    >
      <Seo title={t("externalCommands.title")} />
      <Stagger>
        <ThemedText type="title">{t("externalCommands.title")}</ThemedText>
        <ThemedText type="default" style={{ opacity: 0.85 }}>
          {t("externalCommands.intro")}
        </ThemedText>

        {Platform.OS === "ios" ? (
          <Card>
            <SectionHeader title={t("externalCommands.siriTitle")} />
            <ThemedText>{t("externalCommands.siriHint")}</ThemedText>
          </Card>
        ) : null}

        {Platform.OS === "android" ? (
          <Card>
            <SectionHeader title={t("externalCommands.assistantTitle")} />
            <ThemedText>{t("externalCommands.assistantHint")}</ThemedText>
          </Card>
        ) : null}

        {Platform.OS === "ios" ? (
          <Card>
            <SectionHeader title={t("externalCommands.watchTitle")} />
            <ThemedText>{t("externalCommands.watchHint")}</ThemedText>
          </Card>
        ) : null}

        {Platform.OS === "android" ? (
          <Card>
            <SectionHeader title={t("externalCommands.wearTitle")} />
            <ThemedText>{t("externalCommands.wearHint")}</ThemedText>
          </Card>
        ) : null}

        {Platform.OS === "web" ? (
          <Card>
            <ThemedText>{t("pinLock.webUnavailable")}</ThemedText>
          </Card>
        ) : null}
      </Stagger>
    </ScreenLayout>
  );
}
