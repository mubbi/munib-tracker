import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { isTV } from "@/lib/platform/is-tv";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backgroundColor: colors.background,
      }}
    >
      <Seo title={t("notFound.title")} description={t("seo.notFound.description")} index={false} />
      <ThemedText type="subtitle">{t("notFound.title")}</ThemedText>
      {isTV() ? (
        // A text Link isn't a D-pad focus target — give the remote a real button.
        <Button label={t("notFound.action")} preferredFocus onPress={() => router.replace("/")} />
      ) : (
        <Link href="/">
          <ThemedText type="linkPrimary">{t("notFound.action")}</ThemedText>
        </Link>
      )}
    </View>
  );
}
