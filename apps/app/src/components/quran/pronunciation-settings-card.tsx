import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ToggleRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatBytes } from "@/lib/cache-manager";
import { useToast } from "@/providers/toast-provider";
import { useEnsureCompanionPrefsLoaded } from "@/stores/quran-companion-prefs-store";
import {
  quranPronunciationStore,
  useEnsurePronunciationLoaded,
  usePronunciationState,
} from "@/stores/quran-pronunciation-store";

import { PronunciationConsentSheet } from "./pronunciation-consent-sheet";
import { useQuranLabSharingTheme } from "./use-quran-lab-sharing-theme";

/**
 * Phase 6 settings: the pronunciation listener's state, delete, and the
 * learner's recitation-sharing switch with "Delete what I shared". The app never
 * offers sharing itself; SDK 4 asks every learner on its own sheet (D66), so the
 * switch shows whenever Quran Lab has sharing on. Hidden when the SDK is
 * unavailable (TV, no key, old OS).
 */
export function PronunciationSettingsCard() {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const toast = useToast();
  useEnsureCompanionPrefsLoaded();
  useEnsurePronunciationLoaded();
  const state = usePronunciationState();
  useQuranLabSharingTheme();
  const [consentOpen, setConsentOpen] = useState(false);
  const [pending, setPending] = useState<"delete" | "deleteShared" | null>(null);

  if (state.status === "unavailable") return null;

  const statusLine = (() => {
    switch (state.status) {
      case "needs-consent":
        return t("quranCompanion.pronunciation.notSetUp");
      case "not-downloaded":
        return t("quranCompanion.pronunciation.notOnDevice");
      case "downloading":
        return t("quranCompanion.listener.downloadingBytes", {
          done: formatBytes(state.bytesDone),
          total: formatBytes(state.bytesTotal),
        });
      case "ready":
        return t("quranCompanion.pronunciation.ready", { version: state.cached?.version ?? "" });
      default:
        return t(pronunciationErrorKey(state.error, state.errorNeeds));
    }
  })();

  return (
    <Card>
      <SectionHeader
        title={t("quranCompanion.pronunciation.title")}
        icon={{ ios: "waveform.badge.mic", android: "record_voice_over", web: "record_voice_over" }}
      />
      <View style={styles.rows}>
        <ThemedText type="small">{statusLine}</ThemedText>
        {state.status === "downloading" && state.bytesTotal > 0 ? (
          <ProgressBar
            value={state.bytesDone / state.bytesTotal}
            accessibilityLabel={t("a11yProgress.modelDownload")}
          />
        ) : null}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranCompanion.pronunciation.explainer")}
        </ThemedText>
        <View style={styles.actions}>
          {state.status === "needs-consent" ? (
            <Button
              label={t("quranCompanion.pronunciation.setUp")}
              onPress={() => setConsentOpen(true)}
            />
          ) : null}
          {state.status === "not-downloaded" || state.status === "failed" ? (
            <Button
              label={t("quranCompanion.listener.download")}
              onPress={() => void quranPronunciationStore.getState().download()}
            />
          ) : null}
          {state.status === "ready" || state.status === "failed" ? (
            <Button
              label={t("quranCompanion.pronunciation.shareDiagnostics")}
              variant="ghost"
              onPress={() => {
                void quranPronunciationStore
                  .getState()
                  .diagnose()
                  .then(async (report) => {
                    if (report) await Share.share({ message: report });
                    else toast.error(t("quranCompanion.pronunciation.sharingFailed"));
                  })
                  .catch(() => toast.error(t("quranCompanion.pronunciation.sharingFailed")));
              }}
            />
          ) : null}
          {state.status === "ready" ? (
            <Button
              label={t("quranCompanion.listener.delete")}
              variant="ghost"
              onPress={() => setPending("delete")}
              style={{ borderColor: tokens.status.danger.border }}
            />
          ) : null}
        </View>

        {state.sharing.isAvailable || state.sharing.isOn ? (
          <View style={styles.rows}>
            <ToggleRow
              title={t("quranCompanion.pronunciation.sharingSwitch")}
              subtitle={t("quranCompanion.pronunciation.sharingSub")}
              value={state.sharing.isOn}
              onValueChange={(on) => {
                void quranPronunciationStore
                  .getState()
                  .setSharingOn(on)
                  .catch(() => toast.error(t("quranCompanion.pronunciation.sharingFailed")));
              }}
            />
            <Button
              label={t("quranCompanion.pronunciation.deleteShared")}
              variant="ghost"
              onPress={() => setPending("deleteShared")}
            />
            {state.sharing.recoveryCode ? (
              <ThemedText type="caption" themeColor="mutedForeground" selectable>
                {t("quranCompanion.pronunciation.recoveryCode", {
                  code: state.sharing.recoveryCode,
                })}
              </ThemedText>
            ) : null}
          </View>
        ) : null}
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("quranCompanion.pronunciation.sourcesLine")}
        </ThemedText>
      </View>

      <PronunciationConsentSheet
        visible={consentOpen}
        onClose={() => setConsentOpen(false)}
        onAgree={() => {
          setConsentOpen(false);
          void quranPronunciationStore.getState().consentAndDownload();
        }}
      />
      <ConfirmDialog
        visible={pending != null}
        title={
          pending === "deleteShared"
            ? t("quranCompanion.pronunciation.deleteSharedTitle")
            : t("quranCompanion.pronunciation.deleteTitle")
        }
        message={
          pending === "deleteShared"
            ? t("quranCompanion.pronunciation.deleteSharedBody")
            : t("quranCompanion.pronunciation.deleteBody")
        }
        confirmLabel={t("quranCompanion.listener.confirmRemove")}
        destructive
        onConfirm={() => {
          const p = pending;
          setPending(null);
          if (p === "delete") void quranPronunciationStore.getState().remove();
          if (p === "deleteShared") {
            void quranPronunciationStore
              .getState()
              .deleteShared()
              .then((ok) =>
                ok
                  ? toast.success(t("quranCompanion.pronunciation.deletedShared"))
                  : toast.error(t("quranCompanion.pronunciation.sharingFailed")),
              )
              .catch(() => toast.error(t("quranCompanion.pronunciation.sharingFailed")));
          }
        }}
        onClose={() => setPending(null)}
      />
    </Card>
  );
}

/** QuranLabErrorCode (+ SDK 4 `errorCause.needs`) → full i18n key. */
export function pronunciationErrorKey(code: string | null, needs: string | null = null): string {
  switch (code) {
    case "needs_connection":
      return needs === "lease"
        ? "quranCompanion.pronunciation.error.needsRenewal"
        : "quranCompanion.pronunciation.error.noConnection";
    case "download_failed":
      return "quranCompanion.pronunciation.error.busy";
    case "invalid_key":
      return "quranCompanion.pronunciation.error.paused";
    case "server_rejected":
      return "quranCompanion.pronunciation.error.deviceRefused";
    case "sdk_too_old":
      return "quranCompanion.pronunciation.error.updateApp";
    case "session_open":
      return "quranCompanion.pronunciation.error.inUse";
    case "storage_full":
      return "quranCompanion.pronunciation.error.noSpace";
    case "model_unavailable":
      return "quranCompanion.pronunciation.error.notYet";
    case "microphone_denied":
      return "quranCompanion.pronunciation.error.micDenied";
    case "runtime_unsupported":
      return "quranCompanion.pronunciation.error.unsupported";
    default:
      return "quranCompanion.pronunciation.error.generic";
  }
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
