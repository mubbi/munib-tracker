import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { groupLibraryMenuBySection, LIBRARY_MENU_META, LIBRARY_SECTIONS } from "@/lib/library-menu";

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const grouped = useMemo(() => groupLibraryMenuBySection(LIBRARY_MENU_META), []);

  const sections = useMemo(
    () => LIBRARY_SECTIONS.filter((section) => grouped[section.id].length > 0),
    [grouped],
  );

  return (
    <ScreenLayout
      eyebrow={t("library.eyebrow")}
      title={t("library.title")}
      subtitle={t("library.subtitle")}
    >
      <Seo path="/library" />
      <Stagger>
        {sections.map((section) => (
          <Card key={section.id} padding="three">
            <SectionHeader title={t(section.titleKey)} icon={section.icon} />
            <View style={styles.rows}>
              {grouped[section.id].map((entry) => (
                <NavRow
                  key={entry.id}
                  icon={entry.icon}
                  label={t(entry.labelKey)}
                  onPress={() => router.push(entry.route)}
                />
              ))}
            </View>
          </Card>
        ))}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
