import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Spacing } from "@/constants/theme";
import { KIDS_LEARN_ROUTES, KIDS_SURAHS } from "@/lib/circles/kids-content";
import { getSurahByNumber } from "@/lib/quran-meta";

/** Kids Learn tab: the existing Learn hubs (kid-safe views) + short surahs. */
export function KidsLearnTab() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <View style={styles.stack}>
      <Card padding="two" style={styles.gap}>
        <NavRow
          icon={{
            ios: "figure.mind.and.body",
            android: "self_improvement",
            web: "self_improvement",
          }}
          label={t("kids.learn.salah")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.salahGuide as Href)}
        />
        <NavRow
          icon={{ ios: "book.fill", android: "auto_stories", web: "auto_stories" }}
          label={t("kids.learn.prophets")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.prophets as Href)}
        />
        <NavRow
          icon={{ ios: "character.book.closed.fill", android: "abc", web: "abc" }}
          label={t("kids.learn.letters")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.letters as Href)}
        />
        <NavRow
          icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
          label={t("kids.learn.names")}
          onPress={() => router.push(KIDS_LEARN_ROUTES.names as Href)}
        />
      </Card>
      <ThemedText type="smallBold">{t("kids.learn.surahs")}</ThemedText>
      <Card padding="two" style={styles.gap}>
        {KIDS_SURAHS.map((n) => {
          const surah = getSurahByNumber(n);
          return (
            <NavRow
              key={n}
              icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
              label={surah ? `${n}. ${surah.nameTransliteration}` : String(n)}
              onPress={() =>
                router.push({ pathname: "/quran/[surah]", params: { surah: String(n) } })
              }
            />
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});
