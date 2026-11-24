import type { KhatmUnit } from "@munib-tracker/shared/circles";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { CircleMember, KhatmPart } from "@/lib/circles/api";
import { memberById, memberInitials } from "@/lib/circles/khatm";

import { partAccessibilityLabel } from "./khatm-labels";

const CELL = 52;

/**
 * The part grid (30 juz by default; 60 hizb or 114 surahs). Each cell shows the
 * part number and the assignee's initials from their per-circle display name.
 * Calm colours by status — done, reading, claimed, open — and nothing that
 * ranks members.
 */
export function KhatmGrid({
  unit,
  parts,
  members,
  myMemberId,
  onPressPart,
}: {
  unit: KhatmUnit;
  parts: readonly KhatmPart[];
  members: readonly CircleMember[] | undefined;
  myMemberId: string;
  onPressPart?: (part: KhatmPart) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.grid} testID="khatm-grid">
      {parts.map((part) => {
        const mine = part.assigneeMemberId === myMemberId && part.assigneeMemberId != null;
        const member = memberById(members, part.assigneeMemberId);
        const initials = member?.isMe
          ? t("khatmGroups.youShort")
          : memberInitials(member?.displayName);
        const background =
          part.status === "done"
            ? tokens.status.success.soft
            : part.status === "reading"
              ? tokens.accentSoft
              : part.status === "assigned"
                ? colors.muted
                : "transparent";
        const border =
          part.status === "done"
            ? tokens.status.success.color
            : mine
              ? colors.accent
              : colors.border;
        const label = partAccessibilityLabel(unit, part, members, t);
        const content = (
          <View
            style={[
              styles.cell,
              {
                backgroundColor: background,
                borderColor: border,
                borderWidth: mine ? 2 : 1,
                borderStyle: part.status === "open" ? "dashed" : "solid",
              },
            ]}
          >
            <ThemedText type="smallBold">{part.partNo}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {part.status === "done" ? "✓" : initials || " "}
            </ThemedText>
            {part.stale ? (
              <View style={[styles.staleDot, { backgroundColor: tokens.status.warning.color }]} />
            ) : null}
          </View>
        );
        if (!onPressPart) {
          return (
            <View key={part.partNo} accessible accessibilityLabel={label}>
              {content}
            </View>
          );
        }
        return (
          <PressableScale
            key={part.partNo}
            onPress={() => onPressPart(part)}
            accessibilityRole="button"
            accessibilityLabel={label}
            testID={`khatm-part-${part.partNo}`}
          >
            {content}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  staleDot: {
    position: "absolute",
    top: 4,
    end: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
