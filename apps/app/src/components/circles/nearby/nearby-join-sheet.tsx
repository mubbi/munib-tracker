import { CIRCLE_LIMITS } from "@munib-tracker/shared/circles";
import type { NearbyPurpose } from "@munib-tracker/shared/circles/nearby";
import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { TextField } from "@/components/self-review/text-field";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { canUseCircleType, circleHomeHref } from "@/lib/circles/family";
import { useCircleAuth } from "@/lib/circles/hooks";
import type { NearbyJoinState, NearbyListItem } from "@/lib/nearby/machine";
import { isNearbyAvailable } from "@/lib/nearby/native";
import { useNearbyJoin } from "@/lib/nearby/use-nearby-join";
import { useChevronForward } from "@/lib/rtl";

import { MatchCode } from "./match-code";
import { NearbyBlocked, NearbyRationale } from "./nearby-states";

const RADAR_ICON = {
  ios: "antenna.radiowaves.left.and.right",
  android: "bluetooth_searching",
  web: "bluetooth_searching",
} as const;

/**
 * "Join nearby" entry point (NF-3.25). Renders nothing where the nearby module
 * isn't available (web, TV, Expo Go, no BLE) — the code / QR path stays.
 * `purpose="child_link"` is the kids link screen (a child's phone, no account).
 */
export function JoinNearbyButton({ purpose = "member" }: { purpose?: NearbyPurpose }) {
  const { t } = useTranslation();
  const available = useMemo(() => isNearbyAvailable(), []);
  const [open, setOpen] = useState(false);
  if (!available) return null;
  const child = purpose === "child_link";
  return (
    <>
      <Button
        label={t(child ? "nearby.join.childButton" : "nearby.join.button")}
        variant="secondary"
        icon={RADAR_ICON}
        accessibilityHint={child ? undefined : t("nearby.join.buttonHint")}
        onPress={() => setOpen(true)}
      />
      <NearbyJoinSheet visible={open} purpose={purpose} onClose={() => setOpen(false)} />
    </>
  );
}

/**
 * Joiner flow: scan only while this sheet is open → pick a circle → compare the
 * 4 digits with the host's screen (D44) → "They match" sends the request →
 * wait for the host (D42) → joined (navigates like an invite join).
 */
export function NearbyJoinSheet({
  visible,
  purpose,
  onClose,
}: {
  visible: boolean;
  purpose: NearbyPurpose;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useCircleAuth();
  const join = useNearbyJoin({ purpose });
  const { state, start, close } = join;
  const [displayName, setDisplayName] = useState("");
  const child = purpose === "child_link";

  // Open → preflight (rationale / blocked / scan). Close → stop + withdraw.
  useEffect(() => {
    if (visible) void start();
    else close();
  }, [visible, start, close]);

  const dismiss = () => {
    close();
    onClose();
  };

  const openResult = () => {
    if (state.kind !== "joined") return;
    dismiss();
    if (state.childLinked) router.replace("/kids");
    else if (state.circleId) {
      router.replace(circleHomeHref({ id: state.circleId, type: state.circleType }) as Href);
    }
  };

  const restart = () => {
    close();
    void start();
  };

  const body = () => {
    switch (state.kind) {
      case "idle":
        return <Spinner label={t("circles.common.loading")} />;
      case "rationale":
        return (
          <NearbyRationale mode="scan" onContinue={() => void join.grant()} onCancel={dismiss} />
        );
      case "blocked":
        return <NearbyBlocked reason={state.reason} onRetry={() => void start()} />;
      case "scanning":
        return (
          <View style={styles.stack}>
            <Spinner
              label={t(child ? "nearby.join.childScanning" : "nearby.join.scanning")}
              hint={t(child ? "nearby.join.childScanningHint" : "nearby.join.scanningHint")}
            />
            {join.items.map((item) => (
              <NearbyRow
                key={item.sessionId}
                item={item}
                child={child}
                onPress={() => join.select(item.sessionId)}
              />
            ))}
          </View>
        );
      case "paused":
        return (
          <View style={styles.stack}>
            <ThemedText type="small" accessibilityLiveRegion="polite">
              {t(`nearby.join.paused.${state.reason}`)}
            </ThemedText>
            <Button label={t("nearby.join.scanAgain")} onPress={restart} />
          </View>
        );
      case "confirming":
      case "requesting": {
        const preview = join.selected;
        if (!preview) return <Spinner label={t("circles.common.loading")} />;
        const sending = state.kind === "requesting";
        const error = state.kind === "confirming" ? state.error : undefined;
        const needsAccount = !child && !canUseCircleType(preview.circleType, auth.isAccount);
        return (
          <View style={styles.stack}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(`circles.type.${preview.circleType}`)}
            </ThemedText>
            <ThemedText type="subtitle">{preview.circleName}</ThemedText>
            {child ? null : (
              <ThemedText type="small" themeColor="mutedForeground">
                {t("circles.join.members", { count: preview.memberCount })}
              </ThemedText>
            )}
            <ThemedText type="smallBold" accessibilityRole="header">
              {t("nearby.join.compareTitle")}
            </ThemedText>
            <MatchCode code={preview.matchCode} />
            <ThemedText type="small" themeColor="mutedForeground">
              {t("nearby.join.compareBody")}
            </ThemedText>
            {error ? (
              <ThemedText type="small" accessibilityLiveRegion="assertive">
                {t(error === "offline" ? "circles.common.offline" : `nearby.join.error.${error}`)}
              </ThemedText>
            ) : null}
            {needsAccount || error === "needsAccount" ? (
              <CircleAccountGate />
            ) : (
              <>
                {child ? null : (
                  <TextField
                    label={t("circles.join.displayName")}
                    hint={t("circles.join.displayNameHint")}
                    value={displayName}
                    onChangeText={setDisplayName}
                    maxLength={CIRCLE_LIMITS.displayNameMaxLength}
                  />
                )}
                <Button
                  label={sending ? t("nearby.join.sending") : t("nearby.join.match")}
                  disabled={sending || error === "alreadyMember"}
                  onPress={() => void join.confirm(child ? undefined : displayName)}
                />
              </>
            )}
            <Button
              label={t("nearby.join.noMatch")}
              variant="secondary"
              disabled={sending}
              onPress={join.back}
            />
          </View>
        );
      }
      case "waiting":
        return (
          <View style={styles.stack}>
            <Spinner label={t("nearby.join.waiting")} hint={t("nearby.join.waitingHint")} />
            <Button label={t("nearby.join.cancel")} variant="secondary" onPress={restart} />
          </View>
        );
      case "joined":
        return (
          <View style={styles.stack} accessibilityLiveRegion="polite">
            <ThemedText type="subtitle">
              {state.childLinked
                ? t("nearby.join.childLinked")
                : t("nearby.join.joined", { name: join.selected?.circleName ?? "" })}
            </ThemedText>
            <Button label={t("nearby.join.open")} onPress={openResult} />
          </View>
        );
      case "declined":
      case "expired":
        return (
          <View style={styles.stack}>
            <ThemedText type="small" accessibilityLiveRegion="polite">
              {t(state.kind === "declined" ? "nearby.join.declined" : "nearby.join.expired")}
            </ThemedText>
            <Button label={t("nearby.join.scanAgain")} onPress={restart} />
          </View>
        );
    }
  };

  return (
    <Sheet visible={visible} onClose={dismiss} variant="bottom">
      <View style={styles.sheet}>
        {/* One way back per step: "They don't match" returns to the list while confirming. */}
        <ThemedText type="subtitle" accessibilityRole="header">
          {t(child ? "nearby.join.childTitle" : "nearby.join.title")}
        </ThemedText>
        {body()}
        {showsFallback(state.kind) ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("nearby.join.fallback")}
          </ThemedText>
        ) : null}
        {state.kind === "joined" ? null : (
          <Button label={t("nearby.join.close")} variant="ghost" onPress={dismiss} />
        )}
      </View>
    </Sheet>
  );
}

/**
 * "Can't find it? Use the code…" only while the joiner is still looking (or
 * can't look). Once a circle is picked it would only add noise to the
 * compare / waiting steps.
 */
export function showsFallback(kind: NearbyJoinState["kind"]): boolean {
  return (
    kind === "idle" ||
    kind === "rationale" ||
    kind === "blocked" ||
    kind === "scanning" ||
    kind === "paused" ||
    kind === "declined" ||
    kind === "expired"
  );
}

function Spinner({ label, hint }: { label: string; hint?: string }) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.spinner} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.accent} />
      <View style={styles.flex}>
        <ThemedText type="smallBold">{label}</ThemedText>
        {hint ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function NearbyRow({
  item,
  child,
  onPress,
}: {
  item: NearbyListItem;
  child: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const chevron = useChevronForward();
  const type = t(`circles.type.${item.preview.circleType}`);
  const proximity = t(`nearby.join.proximity.${item.proximity}`);
  const name = item.preview.circleName || type;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("nearby.join.itemA11y", { name, type, proximity })}
      accessibilityHint={child ? t("nearby.join.childItem") : undefined}
      style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}
    >
      <View style={styles.flex}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {name}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {child ? t("nearby.join.childItem") : `${type} · ${proximity}`}
        </ThemedText>
      </View>
      <AppIcon icon={chevron} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  sheet: { gap: Spacing.three },
  stack: { gap: Spacing.two },
  flex: { flex: 1 },
  spinner: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: 56,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
