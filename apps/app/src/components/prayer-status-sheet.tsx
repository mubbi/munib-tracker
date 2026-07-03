import type { PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PrayerNotesModal } from "@/components/prayer-notes-modal";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";
import {
  PRAYER_STATUS_META,
  PRAYER_STATUS_ORDER,
  statusToneColor,
  statusToneSoft,
} from "@/lib/prayer-ui";

/** Maps the picked status to a fitting outcome haptic. */
function outcomeHaptic(status: PrayerStatus): HapticFeedback {
  switch (status) {
    case "completed":
    case "qaza":
      return "success";
    case "missed":
      return "warning";
    default:
      // delayed / pending (clear) — a neutral selection tick.
      return "selection";
  }
}

type PrayerStatusSheetProps = {
  visible: boolean;
  prayerLabel: string;
  currentStatus: PrayerStatus;
  currentNotes?: string;
  onSelect: (status: PrayerStatus) => void;
  onSaveNotes: (notes: string) => void;
  onClose: () => void;
};

export function PrayerStatusSheet({
  visible,
  prayerLabel,
  currentStatus,
  currentNotes,
  onSelect,
  onSaveNotes,
  onClose,
}: PrayerStatusSheetProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <>
      <Sheet visible={visible} onClose={onClose} variant="bottom">
        <ThemedText type="subtitle">{prayerLabel}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("statusSheet.prompt")}
        </ThemedText>

        <View style={styles.options}>
          {PRAYER_STATUS_ORDER.map((status) => {
            const meta = PRAYER_STATUS_META[status];
            const active = currentStatus === status;
            const toneColor = statusToneColor(meta.tone, colors, tokens);
            return (
              <PressableScale
                key={status}
                haptic={false}
                accessibilityRole="button"
                accessibilityLabel={t(`prayerStatus.${status}`)}
                accessibilityState={{ selected: active }}
                onPress={() => {
                  // Tapping the active status clears back to pending.
                  const next = active ? "pending" : status;
                  // Outcome-specific haptic: success for completed/qaza,
                  // warning for missed, a neutral tick for delayed/clear.
                  triggerHaptic(outcomeHaptic(next));
                  onSelect(next);
                  onClose();
                }}
                style={[
                  styles.option,
                  {
                    backgroundColor: active
                      ? statusToneSoft(meta.tone, colors.muted, tokens)
                      : colors.muted,
                    borderColor: active ? toneColor : "transparent",
                  },
                ]}
              >
                <SymbolView name={meta.icon} size={22} tintColor={toneColor} />
                <ThemedText type="smallBold" style={{ color: toneColor }}>
                  {t(`prayerStatus.${status}`)}
                </ThemedText>
              </PressableScale>
            );
          })}
        </View>

        <PressableScale
          haptic="light"
          onPress={() => setNotesOpen(true)}
          style={[styles.notesRow, { borderColor: colors.border }]}
        >
          <SymbolView
            name={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
            size={18}
            tintColor={colors.accent}
          />
          <ThemedText type="small" style={{ color: colors.accent }}>
            {currentNotes ? t("statusSheet.editNote") : t("statusSheet.addNote")}
          </ThemedText>
        </PressableScale>

        {currentNotes ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            “{currentNotes}”
          </ThemedText>
        ) : null}
      </Sheet>

      <PrayerNotesModal
        visible={notesOpen}
        title={t("statusSheet.noteTitle", { prayer: prayerLabel })}
        initialValue={currentNotes}
        onSave={onSaveNotes}
        onClose={() => setNotesOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  option: {
    flexGrow: 1,
    flexBasis: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
  notesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.two,
  },
});
