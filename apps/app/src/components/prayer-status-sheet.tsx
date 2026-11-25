import { masjidKey } from "@munib-tracker/shared/masjid";
import type { PrayerCombineMode, PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import { isObligatoryPrayer, isQazaPrayer, isWitrPrayer } from "@munib-tracker/shared/validators";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type RefObject, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PrayerCombinePicker } from "@/components/prayer-combine-picker";
import { PrayerInfoButton } from "@/components/prayer-info-button";
import { PrayerNotesModal } from "@/components/prayer-notes-modal";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { NavRow } from "@/components/ui/nav-row";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { SwitchRow } from "@/components/ui/switch-row";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useWitrQaza } from "@/hooks/use-rawatib";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { UndoToastController } from "@/hooks/use-undo-toast";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { type HapticFeedback, triggerHaptic } from "@/lib/haptics";
import { useHomeMasjid } from "@/lib/masjid/home-masjid";
import { isTV } from "@/lib/platform/is-tv";
import type { PrayerCombined } from "@/lib/prayer-combining";
import type { PrayerInfoId } from "@/lib/prayer-info";
import {
  PRAYER_MASJID_ICON,
  PRAYER_STATUS_META,
  selectablePrayerStatuses,
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
  /** Congregation flag for this prayer (NF-1.5); toggle shown for all obligatory prayers. */
  isJama?: boolean;
  onToggleJama?: (next: boolean) => void;
  /** Jam' flag (NF-3.0a) — the picker shows only when the school allows combining this prayer. */
  combined?: PrayerCombined | null;
  onSetCombined?: (mode: PrayerCombineMode | null) => void;
  /**
   * "Prayed at the masjid" (NF-3.11) — shown for obligatory prayers when a home
   * masjid is set (an existing flag is always shown so it can be cleared).
   * `masjidId` is the home masjid OSM ref, or null to clear.
   */
  atMasjid?: boolean;
  onToggleAtMasjid?: (masjidId: string | null) => void;
  onSelect: (status: PrayerStatus, options?: PrayerStatusSelectionOptions) => void;
  onSaveNotes: (notes: string) => void;
  onClose: () => void;
  /** The control that opened the sheet — focus returns to it on close. */
  returnFocusRef?: RefObject<{ focus?: () => void } | null>;
  /**
   * The caller's Missed / Qaza undo (`useUndoToast`). TV toasts take no focus,
   * so the sheet shows its Undo in the sheet while the window is open (B-04);
   * phone / web reach it from the toast, which the open sheet hosts (B-01).
   */
  undo?: Pick<UndoToastController, "undoAvailable" | "undo">;
};

/**
 * Status sheet for one Salah (P5-03). Choosing a status records it and keeps
 * the sheet open so congregation / masjid / combine / notes can follow; **Done**
 * closes it. Statuses are a radio group; "Clear status" resets to not marked.
 * Undo for Missed / Qaza is offered by the caller's toast (`usePrayerStatusController`),
 * drawn above this sheet while it is open (and in the sheet on TV — `undo`).
 */
export function PrayerStatusSheet({
  visible,
  prayerId,
  prayerLabel,
  currentStatus,
  currentNotes,
  isJama,
  onToggleJama,
  combined,
  onSetCombined,
  atMasjid,
  onToggleAtMasjid,
  onSelect,
  onSaveNotes,
  onClose,
  returnFocusRef,
  undo,
}: PrayerStatusSheetProps) {
  const homeMasjid = useHomeMasjid();
  const { colors, tokens } = useThemeTokens();
  const { t } = useTranslation();
  const router = useRouter();
  const [notesOpen, setNotesOpen] = useState(false);
  const witrQaza = useWitrQaza();
  const [qazaPromptOpen, setQazaPromptOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PrayerStatus | null>(null);
  const tv = isTV();
  // Sunnah salah only offer Completed / Missed (no Delayed or Qaza).
  const statusOptions = selectablePrayerStatuses(prayerId);
  // TV: open on the current status, or on "completed" when still pending, so
  // Select → Select marks the prayer prayed without hunting for the option.
  const preferredStatus = statusOptions.includes(currentStatus) ? currentStatus : statusOptions[0];
  const obligatory = isObligatoryPrayer(prayerId);

  useEffect(() => {
    if (!visible) {
      setQazaPromptOpen(false);
      setPendingStatus(null);
      setNotesOpen(false);
    }
  }, [visible]);

  const finishQazaPrompt = (addToQaza: boolean) => {
    if (pendingStatus) {
      onSelect(pendingStatus, { addToQaza });
    }
    setPendingStatus(null);
    setQazaPromptOpen(false);
  };

  const handleStatusPress = (status: PrayerStatus) => {
    // A radio never un-checks itself — "Clear status" is the explicit reset.
    if (currentStatus === status) return;
    triggerHaptic(outcomeHaptic(status));

    // Witr qaza accrual follows the school default (on only for Hanafi) or the
    // user's explicit choice (§4.1.4 retrofit); with it off, Witr is just marked.
    const offersQaza = isQazaPrayer(prayerId) && (!isWitrPrayer(prayerId) || witrQaza.enabled);
    const fromDebt = currentStatus === "missed" || currentStatus === "qaza";
    if ((status === "missed" || status === "qaza") && !fromDebt && offersQaza) {
      setPendingStatus(status);
      setQazaPromptOpen(true);
      return;
    }

    onSelect(status);
  };

  const clearStatus = () => {
    triggerHaptic(outcomeHaptic("pending"));
    onSelect("pending");
  };

  return (
    <>
      <Sheet
        visible={visible && !qazaPromptOpen && !notesOpen}
        onClose={onClose}
        variant="bottom"
        title={prayerLabel}
        returnFocusRef={returnFocusRef}
      >
        <View style={styles.promptRow}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.prompt}>
            {t("statusSheet.prompt")}
          </ThemedText>
          {PRAYER_STATUS_INFO_IDS[prayerId] ? (
            <PrayerInfoButton prayerId={prayerId as PrayerInfoId} />
          ) : null}
        </View>

        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={t("statusSheet.statusGroupA11y", { prayer: prayerLabel })}
          style={styles.options}
        >
          {statusOptions.map((status) => {
            const meta = PRAYER_STATUS_META[status];
            const active = currentStatus === status;
            const toneColor = statusToneColor(meta.tone, colors, tokens);
            const toneText =
              meta.tone === "muted" ? colors.foreground : tokens.status[meta.tone].onSoft;
            return (
              <PressableScale
                key={status}
                haptic={false}
                accessibilityRole="radio"
                accessibilityLabel={t(`prayerStatus.${status}`)}
                accessibilityState={{ checked: active }}
                aria-checked={active}
                onPress={() => handleStatusPress(status)}
                {...(tv && status === preferredStatus ? { hasTVPreferredFocus: true } : {})}
                style={[
                  styles.option,
                  tv ? styles.optionTv : null,
                  {
                    backgroundColor: active
                      ? statusToneSoft(meta.tone, colors.muted, tokens)
                      : colors.muted,
                    // TV: selected = soft tone fill + hairline; the thick ring is focus only.
                    borderColor: active ? (tv ? tokens.hairline : toneColor) : "transparent",
                  },
                ]}
              >
                <SymbolView name={meta.icon} size={IconSize.lg} tintColor={toneColor} />
                <ThemedText type="smallBold" style={[styles.optionLabel, { color: toneText }]}>
                  {t(`prayerStatus.${status}`)}
                </ThemedText>
                {active ? (
                  <SymbolView
                    name={{ ios: "checkmark", android: "check", web: "check" }}
                    size={IconSize.md}
                    tintColor={toneText}
                  />
                ) : null}
              </PressableScale>
            );
          })}
        </View>

        {currentStatus !== "pending" ? (
          <Button
            variant="ghost"
            size="md"
            icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
            label={t("statusSheet.clearStatus")}
            onPress={clearStatus}
            style={styles.clear}
          />
        ) : null}
        {undo ? <TvUndoButton controller={undo} size="md" style={styles.clear} /> : null}

        <View style={styles.toggles}>
          {onToggleJama && obligatory ? (
            <SwitchRow
              surface="filled"
              icon={{ ios: "person.3", android: "groups", web: "groups" }}
              title={t("statusSheet.jama")}
              value={!!isJama}
              onValueChange={(next) => onToggleJama(next)}
            />
          ) : null}

          {onToggleAtMasjid && obligatory && (homeMasjid || atMasjid) ? (
            <SwitchRow
              surface="filled"
              icon={PRAYER_MASJID_ICON}
              title={t("masjidLog.toggle")}
              subtitle={homeMasjid?.name ?? undefined}
              value={!!atMasjid}
              onValueChange={() =>
                onToggleAtMasjid(atMasjid || !homeMasjid ? null : masjidKey(homeMasjid))
              }
            />
          ) : null}

          {onSetCombined && obligatory ? (
            <PrayerCombinePicker
              prayerId={prayerId}
              combined={combined ?? null}
              onChange={onSetCombined}
            />
          ) : null}
        </View>

        <View style={styles.links}>
          <NavRow
            icon={{ ios: "square.and.pencil", android: "edit_note", web: "edit_note" }}
            label={currentNotes ? t("statusSheet.editNote") : t("statusSheet.addNote")}
            subtitle={currentNotes ? `“${currentNotes}”` : undefined}
            onPress={() => setNotesOpen(true)}
          />

          {obligatory ? (
            <NavRow
              icon={{
                ios: "hands.and.sparkles.fill",
                android: "volunteer_activism",
                web: "volunteer_activism",
              }}
              label={t("statusSheet.afterSalahAdhkar")}
              onPress={() => {
                router.push(afterSalahAdhkarRoute(prayerId));
                onClose();
              }}
            />
          ) : null}
        </View>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          label={t("common.done")}
          onPress={onClose}
          style={styles.done}
        />
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

/** Salah with a prayer-info entry (every tracked id except the rawatib chips). */
const PRAYER_STATUS_INFO_IDS: Partial<Record<PrayerId, true>> = {
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
  witr: true,
  tahajjud: true,
  ishraq: true,
  duha: true,
  tahiyyatul_masjid: true,
  hajat_istikhara: true,
};

const styles = StyleSheet.create({
  promptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  prompt: {
    flex: 1,
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
    minHeight: Control.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
  },
  optionLabel: {
    flex: 1,
  },
  /** TV: hairline at rest so selection never mimics the D-pad focus ring. */
  optionTv: {
    minHeight: TvLayout.minFocusTarget,
    borderWidth: BorderWidth.hairline,
  },
  clear: {
    alignSelf: "flex-start",
    marginTop: Spacing.two,
  },
  toggles: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  links: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  done: {
    marginTop: Spacing.four,
  },
});
