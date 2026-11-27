import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward } from "@/lib/rtl";
import { UMRAH_MODE_ICON, UMRAH_STEP_COUNT, umrahStepNumber } from "@/lib/umrah/steps";
import { useActiveUmrahSession, useEnsureUmrahSessionsLoaded } from "@/stores/umrah-session-store";

/** `hiddenHomeModules` id for the resume card (Settings → Customize home). */
export const UMRAH_HOME_MODULE = "umrah-mode";

/** Whether the resume card should mount: an Umrah is in progress (never on TV). */
export function useShowUmrahHomeCard(hidden: ReadonlySet<string>): boolean {
  useEnsureUmrahSessionsLoaded();
  const session = useActiveUmrahSession();
  return session != null && !isTV() && !hidden.has(UMRAH_HOME_MODULE);
}

/**
 * Home "Continue your Umrah" card (NF-3.4): only while a session is in
 * progress, so the pilgrim lands back on the current step and counts.
 */
export function UmrahHomeCard() {
  const { t } = useTranslation();
  const router = useRouter();
  const arrowForward = useArrowForward();
  const session = useActiveUmrahSession();
  if (!session) return null;
  const counts =
    session.step === "tawaf"
      ? t("umrahMode.home.tawaf", { number: session.tawafLaps })
      : session.step === "sai"
        ? t("umrahMode.home.sai", { number: session.saiLaps })
        : null;
  return (
    <Card>
      <SectionHeader title={t("umrahMode.home.title")} icon={UMRAH_MODE_ICON} />
      <View style={styles.body}>
        <ThemedText type="smallBold">
          {t("umrahMode.stepOf", {
            number: umrahStepNumber(session.step),
            total: UMRAH_STEP_COUNT,
          })}
          {" · "}
          {t(`umrahMode.step.${session.step}.title`)}
        </ThemedText>
        {counts ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {counts}
          </ThemedText>
        ) : null}
        <Button
          label={t("umrahMode.home.continue")}
          variant="secondary"
          trailingIcon={arrowForward}
          onPress={() => router.push("/umrah" as Href)}
          fullWidth
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
});
