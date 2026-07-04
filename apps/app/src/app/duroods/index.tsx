import { DUROOD_ITEMS } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ReadingCard } from "@/components/content/reading-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { webPageSchema } from "@/lib/seo/structured-data";

export default function DuroodsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("duroods.eyebrow")}
      title={t("duroods.title")}
      subtitle={t("duroods.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/duroods"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("duroods.title"), path: "/duroods" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/duroods",
            name: "Duroods & Salawat",
            description:
              "Recite Durood and Salawat — sending blessings upon the Prophet Muhammad ﷺ.",
            type: "CollectionPage",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("duroods.title"), path: "/duroods" },
            ],
          }),
        ]}
      />
      <Stagger>
        {DUROOD_ITEMS.map((item) => (
          <View key={item.id} style={styles.item}>
            <ThemedText type="smallBold" style={styles.title}>
              {item.title}
            </ThemedText>
            <ReadingCard item={item} sourceHref="/duroods" />
          </View>
        ))}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: Spacing.two,
  },
  title: {
    marginLeft: Spacing.one,
  },
});
