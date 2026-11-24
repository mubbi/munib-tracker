import type { RawatibPreset } from "@munib-tracker/shared/types";
import type { RawatibConfig } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { RAWATIB_ROUTE } from "@/lib/rawatib";

const ICON = { ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" } as const;

type RawatibHeaderCardProps = {
  config: RawatibConfig;
  /** Day's excused reason (hayd is handled by the caller — the card is not rendered). */
  excusedReason: string | null | undefined;
  /** Mu'akkadah rakahs logged that day. */
  rakahsDone: number;
  isToday: boolean;
  /** Today only: show every row instead of only those due now. */
  showAll?: boolean;
  onToggleShowAll?: () => void;
  /** Answer to the first-run question (no madhhab chosen). */
  onChoose: (choice: RawatibPreset | "off") => void;
  /** Rows collapsed while travelling, rendered by the caller. */
  optionalContent?: ReactNode;
};

/**
 * Rawatib header on the tracker (NF-3.1): today's rakahs toward 12 / 10, the
 * evidence citation (Sahih Muslim 728 — the text opens in the hub, by
 * reference), a link to evidence & settings, and the first-run question when
 * no madhhab is chosen (never silently picks a school).
 */
export function RawatibHeaderCard({
  config,
  excusedReason,
  rakahsDone,
  isToday,
  showAll,
  onToggleShowAll,
  onChoose,
  optionalContent,
}: RawatibHeaderCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const target = config.preset;

  if (config.needsChoice) {
    return (
      <Card padding="three">
        <SectionHeader title={t("rawatib.card.title")} icon={ICON} />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("rawatib.card.askBody")}
        </ThemedText>
        <View style={styles.actions}>
          <Button
            label={t("rawatib.card.askTwelve")}
            size="sm"
            onPress={() => onChoose(12)}
            style={styles.action}
          />
          <Button
            label={t("rawatib.card.askTen")}
            size="sm"
            variant="secondary"
            onPress={() => onChoose(10)}
            style={styles.action}
          />
        </View>
        <Button
          label={t("rawatib.card.askNotNow")}
          size="sm"
          variant="ghost"
          onPress={() => onChoose("off")}
        />
      </Card>
    );
  }

  const hint =
    excusedReason === "travel"
      ? t("rawatib.card.travelHint")
      : excusedReason === "sick"
        ? t("rawatib.card.sickHint")
        : tv
          ? t("rawatib.card.hintTv")
          : t("rawatib.card.hint");

  return (
    <Card padding="three">
      <SectionHeader
        title={t("rawatib.card.title")}
        subtitle={t("rawatib.card.evidence", { count: target })}
        icon={ICON}
        badge={
          <Pill
            compact
            label={t("rawatib.card.progress", { done: rakahsDone, total: target })}
            color={rakahsDone >= target ? tokens.status.success.text : undefined}
            background={rakahsDone >= target ? tokens.status.success.soft : undefined}
          />
        }
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {hint}
      </ThemedText>
      {optionalContent ? (
        <View style={styles.optional}>
          <ThemedText type="smallBold">{t("rawatib.card.optionalWhileTravelling")}</ThemedText>
          {optionalContent}
        </View>
      ) : null}
      {isToday && onToggleShowAll ? (
        <PressableScale
          haptic="selection"
          accessibilityRole="button"
          accessibilityState={{ expanded: !!showAll }}
          onPress={onToggleShowAll}
          style={styles.toggle}
        >
          <ThemedText type="label" style={{ color: colors.accentText }}>
            {showAll ? t("rawatib.card.showDue") : t("rawatib.card.showAll")}
          </ThemedText>
        </PressableScale>
      ) : null}
      <View style={styles.rows}>
        <NavRow
          icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          label={t("rawatib.card.openHub")}
          onPress={() => router.push(RAWATIB_ROUTE)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: Spacing.two,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  action: {
    flex: 1,
  },
  optional: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  toggle: {
    alignSelf: "flex-start",
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: Spacing.two,
    marginTop: Spacing.one,
  },
  rows: {
    marginTop: Spacing.two,
  },
});
