import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { isObligatoryPrayer, isQazaPrayer } from "@munib-tracker/shared/validators";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PrayerNotesModal } from "@/components/prayer-notes-modal";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
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

export type PrayerStatusSelectionOptions = {
  addToQaza?: boolean;
};

type PrayerStatusSheetProps = {
  visible: boolean;
  prayerId: PrayerId;
  prayerLabel: string;
  currentStatus: PrayerStatus;
  currentNotes?: string;
  onSelect: (status: PrayerStatus, options?: PrayerStatusSelectionOptions) => void;
  onSaveNotes: (notes: string) => void;
  onClose: () => void;
};

export function PrayerStatusSheet({
  visible,
  prayerId,
  prayerLabel,
  currentStatus,
  currentNotes,
  onSelect,
  onSaveNotes,
  onClose,
}: PrayerStatusSheetProps) {
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const router = useRouter();
  const [notesOpen, setNotesOpen] = useState(false);
  const [qazaPromptOpen, setQazaPromptOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PrayerStatus | null>(null);

  useEffect(() => {
    if (!visible) {
      setQazaPromptOpen(false);
      setPendingStatus(null);
    }
  }, [visible]);

  const finishQazaPrompt = (addToQaza: boolean) => {
    if (pendingStatus) {
      onSelect(pendingStatus, { addToQaza });
    }
    setPendingStatus(null);
    setQazaPromptOpen(false);
    onClose();
  };

  const handleStatusPress = (status: (typeof PRAYER_STATUS_ORDER)[number]) => {
    const active = currentStatus === status;
    const next = active ? "pending" : status;
    triggerHaptic(outcomeHaptic(next));

    if ((status === "missed" || status === "qaza") && !active && isQazaPrayer(prayerId)) {
      setPendingStatus(status);
      setQazaPromptOpen(true);
      return;
    }

    onSelect(next);
    onClose();
  };

  return (
    <>
      <Sheet visible={visible && !qazaPromptOpen} onClose={onClose} variant="bottom">
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
                onPress={() => handleStatusPress(status)}
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

        {isObligatoryPrayer(prayerId) ? (
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            onPress={() => {
              onClose();
              router.push(afterSalahAdhkarRoute(prayerId));
            }}
            style={[styles.adhkarRow, { backgroundColor: tokens.accentSoft }]}
          >
            <SymbolView
              name={{
                ios: "hands.and.sparkles.fill",
                android: "volunteer_activism",
                web: "volunteer_activism",
              }}
              size={18}
              tintColor={colors.accent}
            />
            <ThemedText type="smallBold" style={{ color: colors.accent }}>
              {t("statusSheet.afterSalahAdhkar")}
            </ThemedText>
          </PressableScale>
        ) : null}
      </Sheet>

      <ConfirmDialog
        visible={visible && qazaPromptOpen}
        title={t("statusSheet.qazaPromptTitle")}
        message={t("statusSheet.qazaPromptMessage", { prayer: prayerLabel })}
        confirmLabel={t("statusSheet.qazaPromptConfirm")}
        cancelLabel={t("statusSheet.qazaPromptDecline")}
        onConfirm={() => finishQazaPrompt(true)}
        onCancel={() => finishQazaPrompt(false)}
        onClose={() => {
          setQazaPromptOpen(false);
          setPendingStatus(null);
        }}
      />

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
  adhkarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginTop: Spacing.two,
  },
});
