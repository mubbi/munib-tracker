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
  const isAndroid = Platform.OS === "android";
  const title = t(isAndroid ? "externalCommands.titleAndroid" : "externalCommands.titleIos");
  const intro = t(isAndroid ? "externalCommands.introAndroid" : "externalCommands.introIos");

  return (
    <ScreenLayout title={title} onBack={() => goBackOrReplace(router, "/settings")}>
      <Seo title={title} />
      <Stagger>
        <ThemedText type="title">{title}</ThemedText>
        <ThemedText type="default" style={{ opacity: 0.85 }}>
          {intro}
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
