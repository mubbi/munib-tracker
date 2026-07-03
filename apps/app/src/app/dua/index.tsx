import { DUA_CATEGORY_LABELS, duasByCategory } from "@munib-tracker/shared/content";
import type { DuaCategoryId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";

const CATEGORY_ICONS: Record<DuaCategoryId, SymbolViewProps["name"]> = {
  sunnah: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  quranic: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  daily: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
};

const CATEGORIES: DuaCategoryId[] = ["sunnah", "quranic", "daily"];

export default function DuaHomeScreen() {
  const router = useRouter();

  return (
    <ScreenLayout
      eyebrow="Supplication"
      title="Duas"
      subtitle="Sunnah, Quranic, and daily duas"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.list}>
            {CATEGORIES.map((categoryId) => (
              <NavRow
                key={categoryId}
                icon={CATEGORY_ICONS[categoryId]}
                label={DUA_CATEGORY_LABELS[categoryId]}
                count={duasByCategory(categoryId).length}
                onPress={() =>
                  router.push({ pathname: "/dua/[category]", params: { category: categoryId } })
                }
              />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <NavRow
            icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
            label="Duroods & Salawat"
            onPress={() => router.push("/duroods")}
          />
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
});
