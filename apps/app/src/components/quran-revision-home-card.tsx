import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { useArrowForward } from "@/lib/rtl";
import { useEnsureHifzLoaded } from "@/stores/hifz-store";
import { useEnsureCompanionPrefsLoaded } from "@/stores/quran-companion-prefs-store";
import { useDueQueue, useEnsureMemorizationLoaded } from "@/stores/quran-memorization-store";

/** `hiddenHomeModules` id for the revision card (Settings → Customize home). */
export const QURAN_REVISION_HOME_MODULE = "quran-revision";

const ICON = {
  ios: "arrow.triangle.2.circlepath",
  android: "autorenew",
  web: "autorenew",
} as const;

/**
 * Number of ayahs due for revision today when the home card should show, else 0:
 * practice available here (not TV), the card not hidden, and something is due.
 */
export function useQuranRevisionHomeDue(hidden: ReadonlySet<string>): number {
  useEnsureHifzLoaded();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  const due = useDueQueue().length;
  if (hidden.has(QURAN_REVISION_HOME_MODULE) || !isPracticeAvailable()) return 0;
  return due;
}

/**
 * Home "N ayahs to revise" card (D68 discoverability): only while the Qur'an
 * practice revision queue has ayahs due today; opens the revision sitting.
 * Personal only — nothing here is shared.
 */
export function QuranRevisionHomeCard({ due }: { due: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const arrowForward = useArrowForward();
  if (due <= 0) return null;
  return (
    <Card>
      <SectionHeader title={t("handsFreeZikr2.home.revisionTitle")} icon={ICON} />
      <View style={styles.body}>
        <ThemedText type="smallBold">
          {t("handsFreeZikr2.home.revisionDue", { count: due })}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("handsFreeZikr2.home.revisionBody")}
        </ThemedText>
        <Button
          label={t("handsFreeZikr2.home.revisionAction")}
          variant="secondary"
          trailingIcon={arrowForward}
          onPress={() => router.push("/quran/revision" as Href)}
          fullWidth
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
});
