import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { REMOTE_COLLECTIONS } from "@/api/hadith-remote";
import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getBundledCollection, getBundledCollections } from "@/lib/hadith";

export default function HadithHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const bundled = getBundledCollections();
  const remote = REMOTE_COLLECTIONS;

  const open = (id: string) =>
    router.push({ pathname: "/hadith/[collection]", params: { collection: id } });

  return (
    <ScreenLayout
      eyebrow={t("hadith.eyebrow")}
      title={t("hadith.title")}
      subtitle={t("hadith.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("hadith.highlights")}
            icon={{ ios: "star.fill", android: "star", web: "star" }}
          />
          <View style={styles.list}>
            {bundled.map((collection) => (
              <NavRow
                key={collection.id}
                icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
                label={collection.nameEnglish}
                count={getBundledCollection(collection.id)?.items.length}
                onPress={() => open(collection.id)}
              />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("hadith.fullCollections")}
            icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
          />
          <View style={styles.list}>
            {remote.map((collection) => (
              <NavRow
                key={collection.id}
                icon={{ ios: "book.fill", android: "book", web: "book" }}
                label={collection.nameEnglish}
                onPress={() => open(collection.id)}
              />
            ))}
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two, marginTop: Spacing.three },
});
