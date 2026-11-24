import type { UmrahRoundKind } from "@munib-tracker/shared/types";
import { saiDirection, UMRAH_ROUNDS } from "@munib-tracker/shared/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type AccessibilityActionEvent, AccessibilityInfo, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { triggerHaptic } from "@/lib/haptics";
import { useArrowForward } from "@/lib/rtl";

const UNDO_ICON = {
  ios: "arrow.uturn.backward",
  android: "undo",
  web: "undo",
} as const;

const ROUNDS = Array.from({ length: UMRAH_ROUNDS }, (_, index) => index + 1);

/** "m:ss" for the per-lap timer. */
export function formatLapDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

type RoundCounterProps = {
  kind: UmrahRoundKind;
  laps: number;
  onCount: () => void;
  onUndo: () => void;
  /** Per-lap durations (ms) — shown when the optional timer is on. */
  durations?: readonly number[];
  /** When the current (uncounted) round started — drives the live timer. */
  currentStartedAt?: string;
  showTimer?: boolean;
  /** Read-only (TV / locked): tiles show progress but don't count. */
  readOnly?: boolean;
};

/**
 * Tawaf / sa'i counter (NF-3.4): seven big tiles, one per circuit or course.
 * The next tile is the tap target; every count — tile tap, desktop Space /
 * Enter, or a screen-reader "increment" — goes through one `countOnce()` path
 * with a haptic per round, a success haptic at seven, and an announcement.
 * Undo removes the last round. Sa'i shows the direction of the next course.
 */
export function RoundCounter({
  kind,
  laps,
  onCount,
  onUndo,
  durations = [],
  currentStartedAt,
  showTimer = false,
  readOnly = false,
}: RoundCounterProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const forwardIcon = useArrowForward();
  const done = laps >= UMRAH_ROUNDS;

  const countOnce = () => {
    if (readOnly || done) return;
    const next = laps + 1;
    triggerHaptic(next >= UMRAH_ROUNDS ? "success" : "medium");
    AccessibilityInfo.announceForAccessibility?.(
      t(`umrahMode.counter.counted.${kind}`, { number: next, total: UMRAH_ROUNDS }),
    );
    onCount();
  };
  const undo = () => {
    if (readOnly || laps <= 0) return;
    triggerHaptic("light");
    AccessibilityInfo.announceForAccessibility?.(
      t(`umrahMode.counter.undone.${kind}`, { number: laps }),
    );
    onUndo();
  };

  useWebScreenKeyHandler((event) => {
    if (event.key !== " " && event.key !== "Enter") return undefined;
    if (isWebInteractiveTarget(event.target)) return undefined;
    if (!event.repeat) countOnce();
    return true;
  }, !readOnly && !done);

  // Live timer for the round in progress (ticks once a second while visible).
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!showTimer || done || !currentStartedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [showTimer, done, currentStartedAt]);
  const currentMs = currentStartedAt ? now - Date.parse(currentStartedAt) : 0;

  const direction = kind === "sai" ? saiDirection(laps) : null;
  const handleA11yAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === "increment" || event.nativeEvent.actionName === "activate")
      countOnce();
    if (event.nativeEvent.actionName === "decrement") undo();
  };

  return (
    <View style={styles.root} testID={`umrah-counter-${kind}`}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={t(`umrahMode.counter.a11yLabel.${kind}`)}
        accessibilityValue={{ min: 0, max: UMRAH_ROUNDS, now: laps, text: `${laps} / 7` }}
        accessibilityActions={
          readOnly
            ? []
            : [
                { name: "increment", label: t("umrahMode.counter.countAction") },
                { name: "decrement", label: t("umrahMode.counter.undo") },
              ]
        }
        onAccessibilityAction={handleA11yAction}
        style={styles.summary}
      >
        <ThemedText type="display" style={{ color: colors.accentText }}>
          {laps}
          <ThemedText type="title" themeColor="mutedForeground">
            {" "}
            / {UMRAH_ROUNDS}
          </ThemedText>
        </ThemedText>
        <ThemedText type="smallBold" themeColor="mutedForeground">
          {done
            ? t(`umrahMode.counter.done.${kind}`)
            : t(`umrahMode.counter.next.${kind}`, { number: laps + 1 })}
        </ThemedText>
      </View>

      {direction && direction !== "done" ? (
        <View
          style={[styles.direction, { backgroundColor: tokens.accentSoft }]}
          testID="umrah-sai-direction"
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t(`umrahMode.sai.direction.${direction}`)}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.grid}>
        {ROUNDS.map((round) => {
          const isDone = round <= laps;
          const isNext = round === laps + 1;
          const enabled = isNext && !readOnly;
          const label = isDone
            ? t(`umrahMode.counter.tileDone.${kind}`, { number: round })
            : t(`umrahMode.counter.tileCount.${kind}`, { number: round });
          return (
            <PressableScale
              key={round}
              testID={`umrah-round-${kind}-${round}`}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ disabled: !enabled, selected: isDone }}
              disabled={!enabled}
              haptic={false}
              onPress={countOnce}
              style={[
                styles.tile,
                {
                  backgroundColor: isDone ? colors.accent : tokens.surfaceRaised,
                  borderColor: isNext ? colors.accent : tokens.hairline,
                  borderWidth: isNext ? 2 : StyleSheet.hairlineWidth,
                  opacity: !isDone && !isNext ? 0.6 : 1,
                },
              ]}
            >
              <ThemedText
                type="title"
                style={{ color: isDone ? colors.accentForeground : colors.foreground }}
              >
                {round}
              </ThemedText>
              {showTimer && isDone && durations[round - 1] != null ? (
                <ThemedText type="caption" style={{ color: colors.accentForeground }}>
                  {formatLapDuration(durations[round - 1] ?? 0)}
                </ThemedText>
              ) : null}
              {showTimer && isNext && !readOnly && currentStartedAt ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {formatLapDuration(currentMs)}
                </ThemedText>
              ) : null}
            </PressableScale>
          );
        })}
      </View>

      {readOnly ? null : (
        <View style={styles.actions}>
          {!done ? (
            <Button
              label={t(`umrahMode.counter.next.${kind}`, { number: laps + 1 })}
              icon={forwardIcon}
              onPress={countOnce}
              style={styles.flex}
            />
          ) : null}
          <Button
            label={t("umrahMode.counter.undo")}
            variant="secondary"
            icon={UNDO_ICON}
            disabled={laps <= 0}
            onPress={undo}
            style={done ? styles.flex : undefined}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  summary: { alignItems: "center", gap: Spacing.one },
  direction: {
    alignSelf: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: Spacing.two },
  tile: {
    width: 72,
    minHeight: 72,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.half,
  },
  actions: { flexDirection: "row", gap: Spacing.two },
  flex: { flex: 1 },
});
