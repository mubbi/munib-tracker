import { Link } from "expo-router";
import { useTranslation } from "react-i18next";

import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
      <Seo title={t("notFound.title")} description={t("seo.notFound.description")} index={false} />
      <ThemedText type="subtitle">{t("notFound.title")}</ThemedText>
      <Link href="/">
        <ThemedText type="linkPrimary">{t("notFound.action")}</ThemedText>
      </Link>
    </ThemedView>
  );
}
