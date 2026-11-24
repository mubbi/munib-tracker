import type { MuhasabahConfig, MuhasabahRetentionDays } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { muhasabahPromptLabel } from "@/components/muhasabah/prompt-label";
import { useRecordAction } from "@/components/records/use-record-action";
import { ScreenLayout } from "@/components/screen-layout";
import { ChoiceChips } from "@/components/self-review/choice-chips";
import { PhoneOnlyNotice } from "@/components/self-review/phone-only-notice";
import { TextField } from "@/components/self-review/text-field";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { WallClockPicker } from "@/components/ui/wall-clock-picker";
import { VaultLockGate } from "@/components/vault";
import { Spacing } from "@/constants/theme";
import { createId } from "@/db/id";
import { expiredEntryDates } from "@/lib/muhasabah/logic";
import {
  customPromptKey,
  entriesWithRepentText,
  MUHASABAH_CUSTOM_PROMPT_MAX_LENGTH,
  MUHASABAH_MAX_PROMPTS,
  MUHASABAH_MIN_PROMPTS,
  MUHASABAH_PROMPT_CATALOG,
  MUHASABAH_RETENTION_OPTIONS,
  togglePrompt,
} from "@/lib/muhasabah/model";
import { muhasabahActions, useMuhasabah } from "@/lib/muhasabah/muhasabah-store";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import { formatHhMm, parseHhMm } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";

type TimeMode = "bedtime" | "isha+90" | "custom";

function timeModeOf(time: string): TimeMode {
  return time === "bedtime" || time === "isha+90" ? time : "custom";
}

function SettingsContent() {
  const { t } = useTranslation();
  const toast = useToast();
  const run = useRecordAction();
  const nightlyReminder = useSetting<boolean>("notifications.personal.muhasabah");
  const { config, entries, status, error } = useMuhasabah();
  const [customText, setCustomText] = useState("");
  const [clearNotes, setClearNotes] = useState<number | null>(null);
  // A shorter retention deletes older reviews on the next open: confirm first.
  const [pendingRetention, setPendingRetention] = useState<{
    days: MuhasabahRetentionDays;
    deletes: number;
  } | null>(null);

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;

  const save = (next: MuhasabahConfig) => void run(muhasabahActions.saveConfig(next));
  const mode = timeModeOf(config.prefs.time);
  const allPrompts = [
    ...MUHASABAH_PROMPT_CATALOG,
    ...config.customPrompts.map(customPromptKey),
  ] as const;

  const toggle = (id: (typeof allPrompts)[number]) => {
    const next = togglePrompt(config.prompts, id);
    if (!next) {
      toast.info(
        t("muhasabah.settings.promptBounds", {
          min: MUHASABAH_MIN_PROMPTS,
          max: MUHASABAH_MAX_PROMPTS,
        }),
      );
      return;
    }
    save({ ...config, prompts: next });
  };

  const addCustom = () => {
    const text = customText.trim();
    if (!text) return;
    const prompt = { id: createId("p"), text: text.slice(0, MUHASABAH_CUSTOM_PROMPT_MAX_LENGTH) };
    const key = customPromptKey(prompt);
    const selectable = config.prompts.length < MUHASABAH_MAX_PROMPTS;
    const prompts = selectable ? [...config.prompts, key] : config.prompts;
    save({ ...config, customPrompts: [...config.customPrompts, prompt], prompts });
    setCustomText("");
    if (!selectable) {
      toast.info(t("privateUx.muhasabah.customAddedOff", { max: MUHASABAH_MAX_PROMPTS }));
    }
  };

  const setRetention = (days: MuhasabahRetentionDays) => {
    const deletes = expiredEntryDates(entries, getLocalDateString(), days).length;
    if (deletes > 0) {
      setPendingRetention({ days, deletes });
      return;
    }
    save({ ...config, prefs: { ...config.prefs, retentionDays: days } });
  };

  const removeCustom = (id: string) => {
    const key = `custom:${id}`;
    save({
      ...config,
      customPrompts: config.customPrompts.filter((p) => p.id !== id),
      prompts: config.prompts.filter((p) => p !== key),
    });
  };

  const clock = parseHhMm(mode === "custom" ? config.prefs.time : "22:00", {
    hour: 22,
    minute: 0,
  });

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <SectionHeader
          title={t("muhasabah.settings.promptsTitle")}
          subtitle={t("muhasabah.settings.promptsSub", {
            min: MUHASABAH_MIN_PROMPTS,
            max: MUHASABAH_MAX_PROMPTS,
          })}
          icon={{ ios: "list.bullet", android: "list", web: "list" }}
        />
        <View style={styles.list}>
          {allPrompts.map((id) => {
            const label = muhasabahPromptLabel(t, id, config);
            const custom = id.startsWith("custom:");
            return (
              <View key={id} style={styles.switchRow}>
                <ThemedText type="small" style={styles.flex}>
                  {label}
                </ThemedText>
                {custom ? (
                  <Button
                    label={t("muhasabah.settings.removeCustom")}
                    variant="ghost"
                    size="sm"
                    onPress={() => removeCustom(id.slice("custom:".length))}
                  />
                ) : null}
                <ThemedSwitch
                  value={config.prompts.includes(id)}
                  onValueChange={() => toggle(id)}
                  accessibilityLabel={label}
                />
              </View>
            );
          })}
          <TextField
            label={t("muhasabah.settings.customLabel")}
            value={customText}
            onChangeText={setCustomText}
            placeholder={t("muhasabah.settings.customPlaceholder")}
            maxLength={MUHASABAH_CUSTOM_PROMPT_MAX_LENGTH}
            onSubmitEditing={addCustom}
          />
          <Button
            label={t("muhasabah.settings.customAdd")}
            variant="secondary"
            disabled={!customText.trim()}
            onPress={addCustom}
          />
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("muhasabah.settings.reminderTitle")}
          icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
        />
        <View style={styles.list}>
          <View style={styles.switchRow}>
            <ThemedText type="small" style={styles.flex}>
              {t("muhasabah.settings.reminderToggle")}
            </ThemedText>
            <ThemedSwitch
              value={nightlyReminder.value}
              onValueChange={(on) => void nightlyReminder.setValue(on)}
              accessibilityLabel={t("muhasabah.settings.reminderToggle")}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("muhasabah.settings.reminderPrivacy")}
          </ThemedText>
          {/* The time only matters once the reminder is on (progressive disclosure). */}
          {nightlyReminder.value ? (
            <ChoiceChips<TimeMode>
              options={[
                { id: "bedtime", label: t("muhasabah.settings.timeBedtime") },
                { id: "isha+90", label: t("muhasabah.settings.timeIsha") },
                { id: "custom", label: t("muhasabah.settings.timeCustom") },
              ]}
              value={mode}
              onChange={(next) =>
                save({
                  ...config,
                  prefs: {
                    ...config.prefs,
                    time: next === "custom" ? formatHhMm(clock.hour, clock.minute) : next,
                  },
                })
              }
              accessibilityLabel={t("muhasabah.settings.reminderTitle")}
            />
          ) : null}
          {nightlyReminder.value && mode === "custom" ? (
            <WallClockPicker
              value={clock}
              onChange={(value) =>
                save({
                  ...config,
                  prefs: { ...config.prefs, time: formatHhMm(value.hour, value.minute) },
                })
              }
            />
          ) : null}
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("muhasabah.settings.privacyTitle")}
          icon={{ ios: "lock.fill", android: "lock", web: "lock" }}
        />
        <View style={styles.list}>
          <View style={styles.switchRow}>
            <ThemedText type="small" style={styles.flex}>
              {t("muhasabah.settings.saveRepentText")}
            </ThemedText>
            <ThemedSwitch
              value={config.prefs.saveRepentText}
              onValueChange={(saveRepentText) => {
                save({ ...config, prefs: { ...config.prefs, saveRepentText } });
                // Turning it off only stops new text; offer to clear what's already saved.
                const saved = entriesWithRepentText(entries).length;
                if (!saveRepentText && saved > 0) setClearNotes(saved);
              }}
              accessibilityLabel={t("muhasabah.settings.saveRepentText")}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("muhasabah.settings.saveRepentTextSub")}
          </ThemedText>
          <ThemedText type="smallBold">{t("muhasabah.settings.retentionTitle")}</ThemedText>
          <ChoiceChips<`${MuhasabahRetentionDays}`>
            options={MUHASABAH_RETENTION_OPTIONS.map((days) => ({
              id: `${days}` as `${MuhasabahRetentionDays}`,
              label:
                days === 0
                  ? t("muhasabah.settings.retentionForever")
                  : t("muhasabah.settings.retentionDays", { count: days }),
            }))}
            value={`${config.prefs.retentionDays}` as `${MuhasabahRetentionDays}`}
            onChange={(value) => setRetention(Number(value) as MuhasabahRetentionDays)}
            accessibilityLabel={t("muhasabah.settings.retentionTitle")}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("muhasabah.settings.retentionSub")}
          </ThemedText>
        </View>
      </Card>
      <ConfirmDialog
        visible={clearNotes != null}
        title={t("privateUx.muhasabah.clearNotesTitle")}
        message={t("privateUx.muhasabah.clearNotesBody", { count: clearNotes ?? 0 })}
        confirmLabel={t("privateUx.muhasabah.clearNotesConfirm")}
        cancelLabel={t("privateUx.muhasabah.clearNotesKeep")}
        destructive
        onConfirm={() => {
          setClearNotes(null);
          void muhasabahActions.clearRepentNotes().then(
            () => toast.success(t("privateUx.muhasabah.clearNotesDone")),
            () => toast.error(t("privateUx.saveFailed")),
          );
        }}
        onClose={() => setClearNotes(null)}
      />
      <ConfirmDialog
        visible={pendingRetention != null}
        title={t("privateUx.muhasabah.retentionTitle")}
        message={t("privateUx.muhasabah.retentionBody", { count: pendingRetention?.deletes ?? 0 })}
        confirmLabel={t("privateUx.muhasabah.retentionConfirm")}
        destructive
        onConfirm={() => {
          const next = pendingRetention;
          setPendingRetention(null);
          if (!next) return;
          void muhasabahActions
            .saveConfig({ ...config, prefs: { ...config.prefs, retentionDays: next.days } })
            .then(() => muhasabahActions.runRetention());
        }}
        onClose={() => setPendingRetention(null)}
      />
    </View>
  );
}

export default function MuhasabahSettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("muhasabah.eyebrow")}
      title={t("muhasabah.settings.title")}
      subtitle={t("muhasabah.settings.subtitle")}
      onBack={() => goBackOrReplace(router, "/muhasabah")}
    >
      <Seo path="/muhasabah/settings" />
      {isTV() ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <SettingsContent />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/muhasabah/settings");
