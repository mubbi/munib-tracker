import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Seo } from "@/components/seo/seo";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

/**
 * Unknown route (D-36): one empty state with a description and a real button
 * back to Home — a D-pad focus target on TV and a 44pt target everywhere else.
 */
export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Seo title={t("notFound.title")} description={t("seo.notFound.description")} index={false} />
      <EmptyState
        icon={{ ios: "questionmark.folder", android: "search_off", web: "search_off" }}
        title={t("notFound.title")}
        description={t("notFound.description")}
        actionLabel={t("notFound.action")}
        actionPreferredFocus
        onAction={() => router.replace("/")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.four,
  },
});
