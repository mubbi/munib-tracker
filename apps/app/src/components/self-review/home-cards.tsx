import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { relativesOf, relativesVault } from "@/lib/family-ties/family-ties-store";
import { buildDueList } from "@/lib/family-ties/model";
import { computeLocationPrayerTimes, type StoredLocation } from "@/lib/location";
import {
  MUHASABAH_EVENING_FALLBACK_HOUR,
  type MuhasabahCardState,
  muhasabahCardState,
} from "@/lib/muhasabah/logic";
import { muhasabahDayKey } from "@/lib/muhasabah/model";
import { entriesOf, muhasabahActions, muhasabahVault } from "@/lib/muhasabah/muhasabah-store";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { useVaultLockJournals } from "@/lib/vault";
import { useLocation } from "@/stores/location-store";

/**
 * Home cards for the private self-review features (NF-3.6 / NF-3.7). Both load
 * their vault document lazily; a locked vault or TV simply shows nothing. The
 * family-ties card shows a count only — never a name.
 *
 * Home ids for `hiddenHomeModules`: {@link MUHASABAH_HOME_MODULE},
 * {@link FAMILY_TIES_HOME_MODULE}.
 */
export const MUHASABAH_HOME_MODULE = "muhasabah";
export const FAMILY_TIES_HOME_MODULE = "family-ties-due";

/** True from Isha until the 04:00 rollover (evening fallback without a location). */
export function isMuhasabahTime(now: Date, location: StoredLocation): boolean {
  if (now.getHours() < 4) return true;
  if (location.source === "default") return now.getHours() >= MUHASABAH_EVENING_FALLBACK_HOUR;
  return now.getTime() >= computeLocationPrayerTimes(location, now).isha.getTime();
}

/** The muhasabah Today card state (null = hide). Runs retention once per launch. */
export function useMuhasabahHomeCard(enabled: boolean): MuhasabahCardState {
  const location = useLocation();
  const active = enabled && !isTV();
  const status = muhasabahVault.useStatus().status;
  const items = muhasabahVault.useItems();
  const retentionRan = useRef(false);

  useEffect(() => {
    if (active) void muhasabahVault.actions.load();
  }, [active]);
  useEffect(() => {
    if (active && status === "ready" && !retentionRan.current) {
      retentionRan.current = true;
      // Best-effort housekeeping: a failed purge retries next launch, never breaks Home.
      muhasabahActions.runRetention().catch(() => {});
    }
  }, [active, status]);

  const now = new Date();
  const afterIsha = isMuhasabahTime(now, location);
  const dayKey = muhasabahDayKey(now);
  const yesterdayKey = addDays(getLocalDateString(now), -1);
  return useMemo(() => {
    if (!active || status !== "ready") return null;
    const entries = entriesOf(items);
    // The card only appears for people who have used the feature at least once.
    if (entries.length === 0 && !items.some((i) => i.kind === "config")) return null;
    const byDate = new Map(entries.map((e) => [e.date, e]));
    return muhasabahCardState({
      afterIsha,
      today: byDate.get(dayKey),
      yesterday: byDate.get(yesterdayKey),
    });
  }, [active, status, items, afterIsha, dayKey, yesterdayKey]);
}

/** Relatives due today (count only), or null when none / not tracked / locked / TV. */
export function useFamilyTiesDueCount(enabled: boolean): number | null {
  const active = enabled && !isTV();
  const status = relativesVault.useStatus().status;
  const items = relativesVault.useItems();
  useEffect(() => {
    if (active) void relativesVault.actions.load();
  }, [active]);
  const today = getLocalDateString();
  return useMemo(() => {
    if (!active || status !== "ready") return null;
    const count = buildDueList(relativesOf(items), today).length;
    return count > 0 ? count : null;
  }, [active, status, items, today]);
}

function HomeCard({
  icon,
  title,
  body,
  onPress,
  a11y,
}: {
  icon: SymbolViewProps["name"];
  title: string;
  body: string;
  onPress: () => void;
  a11y: string;
}) {
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  return (
    <Card onPress={onPress} accessibilityLabel={a11y}>
      <View style={styles.row}>
        <IconWell icon={icon} tint={colors.accent} background={tokens.accentSoft} />
        <View style={styles.copy}>
          <ThemedText type="smallBold">{title}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {body}
          </ThemedText>
        </View>
        <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
      </View>
    </Card>
  );
}

export function MuhasabahHomeCard({ state }: { state: NonNullable<MuhasabahCardState> }) {
  const { t } = useTranslation();
  const router = useRouter();
  const lockJournals = useVaultLockJournals();
  const title =
    state.kind === "intention" ? t("muhasabah.home.intentionTitle") : t("muhasabah.home.title");
  const body =
    state.kind === "reflect"
      ? t("muhasabah.home.reflect")
      : state.kind === "done"
        ? t("muhasabah.home.done")
        : // Journal text stays off the home screen when "Lock private journals" is on.
          lockJournals
          ? t("muhasabah.home.intentionLocked")
          : state.intention;
  return (
    <HomeCard
      icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
      title={title}
      body={body}
      a11y={`${title}. ${body}`}
      onPress={() => router.push("/muhasabah")}
    />
  );
}

export function FamilyTiesHomeCard({ count }: { count: number }) {
  const { t } = useTranslation();
  const router = useRouter();
  const body = t("familyTies.home.body", { count });
  return (
    <HomeCard
      icon={{ ios: "person.2.fill", android: "group", web: "group" }}
      title={t("familyTies.home.title")}
      body={body}
      a11y={`${t("familyTies.home.title")}. ${body}`}
      onPress={() => router.push("/family-ties")}
    />
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  copy: { flex: 1, gap: Spacing.half },
});
