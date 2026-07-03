import type { PrayerStatus } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { PrayerNotesModal } from "@/components/prayer-notes-modal";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { PRAYER_STATUS_META, PRAYER_STATUS_ORDER, type StatusTone } from "@/lib/prayer-ui";

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

  const toneColor = (tone: StatusTone) =>
    tone === "muted" ? colors.mutedForeground : tokens.status[tone].color;
  const toneSoft = (tone: StatusTone) =>
    tone === "muted" ? colors.muted : tokens.status[tone].soft;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.scrim, { backgroundColor: tokens.scrim }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.handle} />
          <ThemedText type="subtitle">{prayerLabel}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            How did this prayer go today?
          </ThemedText>

          <View style={styles.options}>
            {PRAYER_STATUS_ORDER.map((status) => {
              const meta = PRAYER_STATUS_META[status];
              const active = currentStatus === status;
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
                      backgroundColor: active ? toneSoft(meta.tone) : colors.muted,
                      borderColor: active ? toneColor(meta.tone) : "transparent",
                    },
                  ]}
                >
                  <SymbolView name={meta.icon} size={22} tintColor={toneColor(meta.tone)} />
                  <ThemedText type="smallBold" style={{ color: toneColor(meta.tone) }}>
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
        </Pressable>
      </Pressable>

      <PrayerNotesModal
        visible={notesOpen}
        title={`${prayerLabel} — note`}
        initialValue={currentNotes}
        onSave={onSaveNotes}
        onClose={() => setNotesOpen(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(128,128,128,0.4)",
    marginBottom: Spacing.two,
  },
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
