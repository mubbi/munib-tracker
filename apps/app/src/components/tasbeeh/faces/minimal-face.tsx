import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { NIGHT_PALETTE } from "@/lib/tasbeeh/materials";

import type { TasbeehFaceProps } from "./types";

/**
 * Focus / Night: very large dimmed numerals on true black (OLED). No
 * animation at all; distinct haptic pulses at every 33 and the target (from
 * the shell's feedback table) make it usable without looking — for qiyam and
 * counting after salah. The whole stage is the tap target.
 */
export default function MinimalFace({
  count,
  target,
  complete,
  size,
  preview = false,
}: TasbeehFaceProps) {
  const { t } = useTranslation();
  const numeral = Math.round(size * (String(count).length > 3 ? 0.26 : 0.36));
  return (
    <View
      style={[
        styles.stage,
        {
          minHeight: preview ? size : size * 1.15,
          borderRadius: preview ? Radius.md : Radius.lg,
          backgroundColor: NIGHT_PALETTE.background,
        },
      ]}
    >
      <ThemedText
        style={[
          styles.count,
          {
            fontSize: numeral,
            lineHeight: Math.round(numeral * 1.1),
            color: complete ? NIGHT_PALETTE.numeralComplete : NIGHT_PALETTE.numeral,
          },
        ]}
      >
        {count}
      </ThemedText>
      {preview ? null : (
        <ThemedText type="caption" style={{ color: NIGHT_PALETTE.caption }}>
          {target > 0
            ? complete
              ? t("tasbeehUi.complete")
              : t("tasbeehUi.ofTarget", { target })
            : t("tasbeehUi.unlimited")}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    borderCurve: "continuous",
  },
  count: {
    fontVariant: ["tabular-nums"],
    fontWeight: "300",
  },
});
