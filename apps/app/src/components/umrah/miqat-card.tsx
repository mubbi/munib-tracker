import type { UmrahSession, UmrahTravelMode } from "@munib-tracker/shared/types";
import {
  type MiqatProximity,
  minutesUntilFlightMiqat,
  nextLocalTime,
} from "@munib-tracker/shared/utils";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Platform, StyleSheet, TextInput, View } from "react-native";

import { JannahCallout } from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Radius, Spacing } from "@/constants/theme";
import { useForegroundInterval } from "@/hooks/use-foreground-interval";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { triggerHaptic } from "@/lib/haptics";
import { checkMiqatProximity } from "@/lib/umrah/miqat";

/** Silent re-check cadence while the miqat step is open (foreground only). */
const RECHECK_MS = 2 * 60_000;
/** Flight countdown refresh (it shows whole minutes). */
const FLIGHT_TICK_MS = 30_000;
const LOCATION_ICON = { ios: "location.fill", android: "my_location", web: "my_location" } as const;
const TIMER_ICON = { ios: "timer", android: "timer", web: "timer" } as const;

type LandState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "result"; proximity: MiqatProximity }
  | { kind: "denied" }
  | { kind: "unavailable" };

type MiqatCardProps = {
  session: UmrahSession;
  onSetTravel: (patch: { travelMode?: UmrahTravelMode; flightMiqatAt?: string | null }) => void;
};

/**
 * Miqat step (NF-3.4). By land: a foreground proximity check against the five
 * bundled miqat points (≤ 20 km → "Approaching miqat"), re-checked quietly every
 * two minutes while this step is open and permission is already granted. By
 * air: GPS in flight is unreliable, so the pilgrim types when the flight
 * crosses the miqat and gets an in-app countdown. Nothing is sent anywhere.
 */
export function MiqatCard({ session, onSetTravel }: MiqatCardProps) {
  const { t } = useTranslation();
  const mode: UmrahTravelMode = session.travelMode ?? "land";
  return (
    <View style={styles.root}>
      <SegmentedControl
        options={[
          { id: "land", label: t("umrahMode.miqat.byLand") },
          { id: "air", label: t("umrahMode.miqat.byAir") },
        ]}
        value={mode}
        onChange={(travelMode) => onSetTravel({ travelMode })}
      />
      {mode === "land" ? (
        <LandCheck />
      ) : (
        <FlightTimer flightMiqatAt={session.flightMiqatAt} onSetTravel={onSetTravel} />
      )}
    </View>
  );
}

function LandCheck() {
  const { t } = useTranslation();
  const [state, setState] = useState<LandState>({ kind: "idle" });
  const wasApproaching = useRef(false);

  const run = useCallback(
    async (prompt: boolean) => {
      if (prompt) setState({ kind: "checking" });
      const result = await checkMiqatProximity(prompt);
      if (result.status === "ok") {
        setState({ kind: "result", proximity: result.proximity });
        if (result.proximity.approaching && !wasApproaching.current) {
          triggerHaptic("warning");
          AccessibilityInfo.announceForAccessibility?.(t("umrahMode.miqat.approachingTitle"));
        }
        wasApproaching.current = result.proximity.approaching;
      } else if (prompt) {
        setState({ kind: result.status });
      }
    },
    [t],
  );

  // Quiet re-checks (no permission prompt) while the step is open — foreground
  // only, so a phone left on this step never reads location in the background.
  useForegroundInterval(() => void run(false), RECHECK_MS);

  const proximity = state.kind === "result" ? state.proximity : null;
  const name = proximity ? t(`umrahMode.miqat.name.${proximity.miqat.id}`) : "";
  const km = proximity ? Math.max(1, Math.round(proximity.distanceKm)) : 0;

  return (
    <View style={styles.block}>
      {proximity?.approaching ? (
        <JannahCallout tone="warning">
          {t("umrahMode.miqat.approaching", { name, distance: km })}
        </JannahCallout>
      ) : null}
      {proximity && !proximity.approaching ? (
        <ThemedText type="small" testID="umrah-miqat-distance">
          {t("umrahMode.miqat.nearest", { name, distance: km })}
        </ThemedText>
      ) : null}
      {state.kind === "denied" ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("umrahMode.miqat.denied")}
        </ThemedText>
      ) : null}
      {state.kind === "unavailable" ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("umrahMode.miqat.unavailable")}
        </ThemedText>
      ) : null}
      <Button
        label={
          state.kind === "checking" ? t("umrahMode.miqat.checking") : t("umrahMode.miqat.check")
        }
        variant="secondary"
        icon={LOCATION_ICON}
        disabled={state.kind === "checking"}
        onPress={() => void run(true)}
      />
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("umrahMode.miqat.landHint")}
      </ThemedText>
    </View>
  );
}

function FlightTimer({
  flightMiqatAt,
  onSetTravel,
}: {
  flightMiqatAt: string | undefined;
  onSetTravel: MiqatCardProps["onSetTravel"];
}) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [input, setInput] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [now, setNow] = useState(() => new Date());
  // Countdown refresh: foreground only, and straight away on return to the app.
  useForegroundInterval(() => setNow(new Date()), FLIGHT_TICK_MS, {
    enabled: !!flightMiqatAt,
    immediate: false,
  });

  const minutes = minutesUntilFlightMiqat(flightMiqatAt, now);
  const save = () => {
    const at = nextLocalTime(input, new Date());
    if (!at) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setNow(new Date());
    onSetTravel({ travelMode: "air", flightMiqatAt: at.toISOString() });
  };
  let timeLabel = "";
  if (flightMiqatAt) {
    try {
      timeLabel = new Date(flightMiqatAt).toLocaleTimeString(i18n.language || "en", {
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      timeLabel = new Date(flightMiqatAt).toTimeString().slice(0, 5);
    }
  }

  return (
    <View style={styles.block}>
      {minutes != null && minutes > 0 ? (
        <JannahCallout tone={minutes <= 30 ? "warning" : "info"}>
          {t("umrahMode.miqat.flightCountdown", { minutes, time: timeLabel })}
        </JannahCallout>
      ) : null}
      {minutes != null && minutes <= 0 ? (
        <JannahCallout tone="warning">{t("umrahMode.miqat.flightNow")}</JannahCallout>
      ) : null}
      <ThemedText type="smallBold">{t("umrahMode.miqat.flightLabel")}</ThemedText>
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text.replace(/[^\d:]/g, "").slice(0, 5))}
          placeholder={t("umrahMode.miqat.flightPlaceholder")}
          placeholderTextColor={colors.mutedForeground}
          keyboardType="numbers-and-punctuation"
          accessibilityLabel={t("umrahMode.miqat.flightLabel")}
          onSubmitEditing={Platform.OS === "web" ? save : undefined}
          style={[styles.input, tokens.inputSurface, { color: colors.foreground }]}
          testID="umrah-flight-input"
        />
        <Button label={t("umrahMode.miqat.flightSet")} icon={TIMER_ICON} onPress={save} />
      </View>
      {invalid ? (
        <ThemedText type="caption" style={{ color: tokens.status.danger.text }}>
          {t("umrahMode.miqat.flightInvalid")}
        </ThemedText>
      ) : null}
      {flightMiqatAt ? (
        <Button
          label={t("umrahMode.miqat.flightClear")}
          variant="ghost"
          size="sm"
          onPress={() => onSetTravel({ flightMiqatAt: null })}
        />
      ) : null}
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("umrahMode.miqat.flightHint")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  block: { gap: Spacing.two },
  inputRow: { flexDirection: "row", gap: Spacing.two, alignItems: "center" },
  input: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
  },
});
