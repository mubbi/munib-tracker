import type { PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { PrayerNotesModal } from "@/components/prayer-notes-modal";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  PRAYER_STATUS_META,
  PRAYER_STATUS_ORDER,
  statusToneColor,
  statusToneSoft,
} from "@/lib/prayer-ui";

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
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <>
      <Sheet visible={visible} onClose={onClose} variant="bottom">
        <ThemedText type="subtitle">{prayerLabel}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          How did this prayer go today?
        </ThemedText>

        <View style={styles.options}>
          {PRAYER_STATUS_ORDER.map((status) => {
            const meta = PRAYER_STATUS_META[status];
            const active = currentStatus === status;
            const toneColor = statusToneColor(meta.tone, colors, tokens);
            return (
              <PressableScale
                key={status}
                haptic="light"
                onPress={() => {
                  // Tapping the active status clears back to pending.
                  onSelect(active ? "pending" : status);
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
                  {meta.label}
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
            {currentNotes ? "Edit note" : "Add a note"}
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
        title={`${prayerLabel} — note`}
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
