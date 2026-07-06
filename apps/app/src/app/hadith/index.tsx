import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { REMOTE_COLLECTIONS } from "@/api/hadith-remote";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { HadithRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { dailyHadith } from "@/lib/daily-hadith";
import { getBundledCollection, getBundledCollections } from "@/lib/hadith";
import { collectionPageSchema } from "@/lib/seo/structured-data";

const HADITH_ITEMS = getBundledCollections().map((collection) => ({
  name: collection.nameEnglish,
  path: `/hadith/${collection.id}`,
}));

export default function HadithHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  const bundled = getBundledCollections();
  const remote = REMOTE_COLLECTIONS;
  const today = dailyHadith(getLocalDateString());
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    let active = true;
    void HadithRepository.getBookmarks().then((list) => {
      if (active) setBookmarkCount(list.length);
    });
    return () => {
      active = false;
    };
  }, []);

  const open = (id: string) =>
    router.push({ pathname: "/hadith/[collection]", params: { collection: id } });

  return (
    <ScreenLayout
      eyebrow={t("hadith.eyebrow")}
      title={t("hadith.title")}
      subtitle={t("hadith.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo
        path="/hadith"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("hadith.title"), path: "/hadith" },
        ]}
        jsonLd={[
          collectionPageSchema({
            path: "/hadith",
            name: "Hadith Collections",
            description:
              "Authentic hadith from the major collections — the sayings and traditions of the Prophet Muhammad ﷺ.",
            items: HADITH_ITEMS,
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("hadith.title"), path: "/hadith" },
            ],
          }),
        ]}
      />
      <Stagger>
        <SavedNavCard
          title={t("hadith.bookmarks")}
          viewLabel={t("hadith.viewBookmarks")}
          count={bookmarkCount > 0 ? bookmarkCount : undefined}
          headerIcon={{ ios: "bookmark.fill", android: "bookmark", web: "bookmark" }}
          rowIcon={{ ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }}
          onPress={() => router.push("/hadith/bookmarks")}
        />

        {today ? (
          <Card
            padding="three"
            onPress={() => router.push("/hadith/daily")}
            accessibilityLabel={t("dailyHadith.title")}
            style={{
              backgroundColor: tokens.status.info.soft,
              borderColor: tokens.status.info.color,
              borderWidth: StyleSheet.hairlineWidth,
            }}
          >
            <View style={styles.dailyHead}>
              <SymbolView
                name={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
                size={16}
                tintColor={tokens.status.info.color}
              />
              <ThemedText type="smallBold" style={{ color: tokens.status.info.text }}>
                {t("dailyHadith.cardTitle")}
              </ThemedText>
            </View>
            <ThemedText type="default" numberOfLines={3} style={styles.dailyBody}>
              {today.english}
            </ThemedText>
            <ThemedText type="caption" style={{ color: tokens.status.info.text }}>
              {today.reference} · {t("dailyHadith.seeArchive")}
            </ThemedText>
          </Card>
        ) : null}

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
  dailyHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  dailyBody: { marginBottom: Spacing.two },
});
