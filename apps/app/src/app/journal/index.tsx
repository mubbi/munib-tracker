import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { averageRating, groupByDate, KHUSHU_MAX, KHUSHU_MIN, type KhushuEntry } from "@/lib/khushu";
import { goBackOrReplace } from "@/lib/navigation";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import type { SttErrorKind } from "@/lib/stt";
import { useToast } from "@/providers/toast-provider";
import { useEnsureKhushuLoaded, useKhushuActions, useKhushuEntries } from "@/stores/khushu-store";
import { useTodayPrayers } from "@/stores/tracker-store";

const RATINGS = [1, 2, 3, 4, 5] as const;

// Every salah the tracker can log, in a stable display order (fard → witr →
// sunnah/nafl), so the reflection picker and history list share one ordering.
const ALL_TRACKED_PRAYERS: readonly PrayerId[] = [
  ...OBLIGATORY_PRAYERS,
  WITR_PRAYER,
  ...SUNNAH_PRAYERS,
];

const PRAYER_ORDER = new Map<string, number>(ALL_TRACKED_PRAYERS.map((id, index) => [id, index]));

type FormDraft = {
  mode: "new" | "edit";
  date: string;
  entryId?: string;
  prayerId: PrayerId;
  rating: number;
  note: string;
};

type PendingAction =
  | { kind: "delete"; entry: KhushuEntry }
  | { kind: "discard" }
  | { kind: "overwrite" };

function defaultDraft(): FormDraft {
  return {
    mode: "new",
    date: getLocalDateString(),
    prayerId: "fajr",
    rating: 3,
    note: "",
  };
}

function formatAverage(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function StarRating({
  value,
  onChange,
  size = 22,
  compact,
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  compact?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  const gap = compact ? Spacing.half : Spacing.one;

  return (
    <View style={[styles.stars, { gap }]}>
      {RATINGS.map((star) => {
        const filled = star <= value;
        const icon: SymbolViewProps["name"] = filled
          ? { ios: "star.fill", android: "star", web: "star" }
          : { ios: "star", android: "star_border", web: "star_border" };
        const color = filled ? tokens.status.warning.color : colors.mutedForeground;

        if (onChange) {
          return (
            <PressableScale
              key={star}
              accessibilityRole="button"
              accessibilityLabel={String(star)}
              onPress={() => onChange(star)}
              scaleTo={0.85}
              haptic="selection"
              hitSlop={8}
            >
              <SymbolView name={icon} size={size} tintColor={color} />
            </PressableScale>
          );
        }

        return <SymbolView key={star} name={icon} size={size} tintColor={color} />;
      })}
    </View>
  );
}

function sortedGroups(entries: KhushuEntry[]) {
  return groupByDate(entries).map((group) => ({
    ...group,
    entries: [...group.entries].sort(
      (a, b) => (PRAYER_ORDER.get(a.prayerId) ?? 99) - (PRAYER_ORDER.get(b.prayerId) ?? 99),
    ),
  }));
}

export default function JournalScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { formatIso } = useFormatCalendarDate();
  const toast = useToast();
  useEnsureKhushuLoaded();
  const entries = useKhushuEntries();
  const { save, remove } = useKhushuActions();
  const { status: todayStatus } = useTodayPrayers();

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<FormDraft>(defaultDraft);
  const [savedDraft, setSavedDraft] = useState<FormDraft>(defaultDraft);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const handleSttError = useCallback(
    (kind: SttErrorKind) => {
      switch (kind) {
        case "permission":
          toast.warning(t("journal.stt.permissionDenied"));
          break;
        case "unavailable":
          toast.warning(t("journal.stt.unavailable"));
          break;
        case "noSpeech":
          toast.info(t("journal.stt.couldNotHear"));
          break;
        default:
          toast.error(t("journal.stt.errorGeneric"));
      }
    },
    [t, toast],
  );

  const handleTranscript = useCallback((text: string) => {
    setDraft((current) => ({ ...current, note: text }));
  }, []);

  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: handleTranscript,
    onError: handleSttError,
  });

  useEffect(() => {
    if (!formOpen) stt.abort();
  }, [formOpen, stt.abort]);

  const groups = useMemo(() => sortedGroups(entries), [entries]);
  const avg = averageRating(entries);
  const today = getLocalDateString();

  // A reflection can only be recorded for a salah actually prayed today —
  // obligatory, witr, or sunnah/nafl — so the picker mirrors what the tracker
  // has marked completed for the current day.
  const completedToday = useMemo(
    () => ALL_TRACKED_PRAYERS.filter((id) => (todayStatus[id] ?? "pending") === "completed"),
    [todayStatus],
  );

  // In edit mode the entry's own salah stays selectable even if it isn't among
  // today's completed prayers (e.g. editing yesterday's reflection).
  const pickerPrayers = useMemo(() => {
    if (draft.mode === "edit" && !completedToday.includes(draft.prayerId)) {
      return [draft.prayerId, ...completedToday];
    }
    return completedToday;
  }, [completedToday, draft.mode, draft.prayerId]);

  const isDirty = useMemo(
    () =>
      draft.prayerId !== savedDraft.prayerId ||
      draft.rating !== savedDraft.rating ||
      draft.note !== savedDraft.note,
    [draft, savedDraft],
  );

  const formatDate = useCallback(
    (iso: string, style: "short" | "long" = "short") => {
      if (iso === today) return t("journal.today");
      return formatIso(iso, {
        weekday: style === "long" ? "long" : "short",
        day: "numeric",
        month: style === "long" ? "long" : "short",
      });
    },
    [formatIso, t, today],
  );

  const openNewForm = () => {
    const firstPrayer = completedToday[0];
    if (!firstPrayer) {
      toast.info(t("journal.noCompletedTitle"), t("journal.noCompletedDesc"));
      return;
    }
    const next = { ...defaultDraft(), prayerId: firstPrayer };
    setDraft(next);
    setSavedDraft(next);
    setFormOpen(true);
  };

  const openEditForm = (entry: KhushuEntry) => {
    const next: FormDraft = {
      mode: "edit",
      date: entry.date,
      entryId: entry.id,
      prayerId: entry.prayerId,
      rating: entry.rating,
      note: entry.note ?? "",
    };
    setDraft(next);
    setSavedDraft(next);
    setFormOpen(true);
  };

  const closeForm = () => {
    stt.abort();
    setFormOpen(false);
    setPending(null);
  };

  const requestCloseForm = () => {
    if (isDirty) {
      setPending({ kind: "discard" });
      return;
    }
    closeForm();
  };

  const toggleNoteDictate = () => {
    if (stt.listening && stt.activeField === "note") {
      stt.stop();
      return;
    }
    void stt.start("note", draft.note, "other");
  };

  const doSave = async () => {
    await save({
      date: draft.date,
      prayerId: draft.prayerId,
      rating: draft.rating,
      note: draft.note,
    });
    trackReviewInteraction("save_khushu");
    closeForm();
  };

  const attemptSave = () => {
    const existing = entries.find(
      (entry) => entry.date === draft.date && entry.prayerId === draft.prayerId,
    );
    const isOverwrite = existing != null && existing.id !== draft.entryId;
    if (isOverwrite) {
      setPending({ kind: "overwrite" });
      return;
    }
    void doSave();
  };

  const confirmCopy = useMemo(() => {
    if (!pending) return null;

    if (pending.kind === "delete") {
      const prayer = t(`prayers.${pending.entry.prayerId}`);
      return {
        title: t("journal.confirmDeleteTitle"),
        message: t("journal.confirmDeleteMsg", {
          prayer,
          date: formatDate(pending.entry.date, "long"),
        }),
        confirmLabel: t("common.delete"),
        destructive: true,
      };
    }

    if (pending.kind === "discard") {
      return {
        title: t("journal.confirmDiscardTitle"),
        message: t("journal.confirmDiscardMsg"),
        confirmLabel: t("journal.discard"),
        destructive: true,
      };
    }

    return {
      title: t("journal.confirmOverwriteTitle"),
      message: t("journal.confirmOverwriteMsg", {
        prayer: t(`prayers.${draft.prayerId}`),
      }),
      confirmLabel: t("common.save"),
      destructive: false,
    };
  }, [draft.prayerId, formatDate, pending, t]);

  const handleConfirm = () => {
    if (!pending) return;

    if (pending.kind === "delete") {
      void remove(pending.entry.date, pending.entry.prayerId);
    } else if (pending.kind === "discard") {
      closeForm();
      return;
    } else if (pending.kind === "overwrite") {
      void doSave();
      return;
    }

    setPending(null);
  };

  const handleConfirmClose = () => {
    if (pending?.kind === "discard" && formOpen) {
      setPending(null);
      return;
    }
    setPending(null);
  };

  return (
    <ScreenLayout
      eyebrow={t("journal.eyebrow")}
      title={t("journal.title")}
      subtitle={t("journal.subtitle")}
      onBack={() => goBackOrReplace(router, "/tracker")}
    >
      <Seo path="/journal" />

      {entries.length === 0 ? (
        <EmptyState
          icon={{ ios: "heart.text.square", android: "favorite", web: "favorite" }}
          title={t("journal.emptyTitle")}
          description={t("journal.emptyDesc")}
          actionLabel={t("journal.add")}
          onAction={openNewForm}
        />
      ) : (
        <Stagger>
          <Card variant="muted" padding="three">
            <View style={styles.summary}>
              <View style={styles.summaryMain}>
                <View style={styles.avgLabelRow}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("journal.avgLabel")}
                  </ThemedText>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={t("journal.khushuInfoA11y")}
                    accessibilityHint={t("journal.khushuInfoHint")}
                    onPress={() => router.push("/salah-guide/khushu")}
                    haptic="light"
                    hitSlop={6}
                    style={styles.khushuLearnMore}
                  >
                    <SymbolView
                      name={{ ios: "info.circle", android: "info", web: "info" }}
                      size={13}
                      tintColor={colors.mutedForeground}
                    />
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("prayerInfo.learnMore")}
                    </ThemedText>
                  </PressableScale>
                </View>
                <View style={styles.summaryValueRow}>
                  <ThemedText type="title" style={styles.summaryNumber}>
                    {avg != null ? formatAverage(avg) : "—"}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("journal.outOf", { max: KHUSHU_MAX })}
                  </ThemedText>
                </View>
                <StarRating value={Math.round(avg ?? 0)} size={16} compact />
                {avg != null ? (
                  <ThemedText type="caption" themeColor="mutedForeground" style={styles.levelHint}>
                    {t(`journal.level${Math.round(avg)}`)}
                  </ThemedText>
                ) : null}
              </View>
              <Pill
                label={t("journal.totalReflections", { count: entries.length })}
                icon={{ ios: "text.book.closed", android: "menu_book", web: "menu_book" }}
                color={colors.accent}
              />
            </View>
          </Card>

          <View style={styles.listSection}>
            <SectionHeader
              title={t("journal.recentTitle")}
              icon={{ ios: "list.bullet.rectangle", android: "list", web: "list" }}
              actionLabel={t("journal.addShort")}
              actionIcon={{ ios: "plus", android: "add", web: "add" }}
              actionAccessibilityLabel={t("journal.add")}
              onActionPress={openNewForm}
            />

            <View style={styles.groupList}>
              {groups.map((group) => (
                <Card key={group.date} padding="three">
                  <ThemedText type="smallBold" style={styles.groupDate}>
                    {formatDate(group.date, "long")}
                  </ThemedText>
                  <View style={styles.entryList}>
                    {group.entries.map((entry) => (
                      <View
                        key={entry.id}
                        style={[styles.entryRow, { backgroundColor: colors.muted }]}
                      >
                        <PressableScale
                          accessibilityRole="button"
                          accessibilityLabel={t("journal.editA11y", {
                            prayer: t(`prayers.${entry.prayerId}`),
                          })}
                          onPress={() => openEditForm(entry)}
                          scaleTo={0.985}
                          haptic="light"
                          style={styles.entryMain}
                        >
                          <IconWell icon={PRAYER_ICONS[entry.prayerId]} well={40} size={18} />
                          <View style={styles.entryBody}>
                            <View style={styles.entryHead}>
                              <ThemedText type="smallBold">
                                {t(`prayers.${entry.prayerId}`)}
                              </ThemedText>
                              <Pill
                                label={t(`journal.level${entry.rating}`)}
                                compact
                                color={tokens.status.warning.color}
                                background={tokens.status.warning.soft}
                              />
                            </View>
                            <StarRating value={entry.rating} size={13} compact />
                            {entry.note ? (
                              <ThemedText
                                type="caption"
                                themeColor="mutedForeground"
                                numberOfLines={2}
                                style={styles.entryNote}
                              >
                                {entry.note}
                              </ThemedText>
                            ) : (
                              <ThemedText type="caption" themeColor="mutedForeground">
                                {t("journal.noNote")}
                              </ThemedText>
                            )}
                          </View>
                        </PressableScale>
                        <IconButton
                          name={{ ios: "trash", android: "delete", web: "delete" }}
                          size={16}
                          tintColor={colors.mutedForeground}
                          accessibilityLabel={t("journal.delete")}
                          haptic="warning"
                          hitTarget={40}
                          onPress={() => setPending({ kind: "delete", entry })}
                        />
                      </View>
                    ))}
                  </View>
                </Card>
              ))}
            </View>
          </View>
        </Stagger>
      )}

      <Sheet visible={formOpen} onClose={requestCloseForm} variant="bottom">
        <ThemedText type="subtitle" style={styles.sheetTitle}>
          {draft.mode === "edit" ? t("journal.editTitle") : t("journal.newTitle")}
        </ThemedText>
        {draft.mode === "edit" ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.sheetDate}>
            {formatDate(draft.date, "long")}
          </ThemedText>
        ) : null}

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
          {t("journal.fieldPrayer")}
        </ThemedText>
        <View style={styles.prayerChips}>
          {pickerPrayers.map((id) => {
            const active = draft.prayerId === id;
            const contentColor = active ? colors.accentForeground : colors.foreground;
            return (
              <PressableScale
                key={id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setDraft((current) => ({ ...current, prayerId: id }))}
                scaleTo={0.94}
                haptic="selection"
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.accent : colors.muted,
                    borderColor: active ? colors.accent : tokens.hairline,
                  },
                ]}
              >
                <AppIcon icon={PRAYER_ICONS[id]} size={15} tintColor={contentColor} />
                <ThemedText type="caption" style={{ color: contentColor }}>
                  {t(`prayers.${id}`)}
                </ThemedText>
              </PressableScale>
            );
          })}
        </View>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
          {t("journal.fieldRating")}
        </ThemedText>
        <View style={[styles.ratingPanel, { backgroundColor: colors.muted }]}>
          <StarRating
            value={draft.rating}
            onChange={(rating) => setDraft((current) => ({ ...current, rating }))}
            size={28}
          />
          <ThemedText type="smallBold" style={styles.ratingLabel}>
            {t(`journal.level${draft.rating}`)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("journal.ratingHint")}
          </ThemedText>
        </View>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldLabel}>
          {t("journal.fieldNote")}
        </ThemedText>
        <View
          style={[
            styles.noteField,
            {
              backgroundColor: colors.muted,
              borderWidth: stt.listening ? 1.5 : 0,
              borderColor: stt.listening ? colors.accent : "transparent",
            },
          ]}
        >
          <TextInput
            value={draft.note}
            onChangeText={(note) => {
              if (stt.listening) stt.abort();
              setDraft((current) => ({ ...current, note }));
            }}
            placeholder={t("journal.notePlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("journal.fieldNote")}
            multiline
            style={[
              styles.noteInput,
              {
                color: colors.foreground,
                paddingEnd: stt.available ? Spacing.three + 44 : Spacing.three,
              },
            ]}
          />
          {stt.available ? (
            <View style={styles.noteMic}>
              <VoiceInputButton
                size="sm"
                listening={stt.listening}
                level={stt.level}
                accessibilityLabel={
                  stt.listening ? t("journal.stt.stopDictate") : t("journal.stt.dictate")
                }
                accessibilityHint={stt.listening ? t("journal.stt.listening") : undefined}
                onPress={toggleNoteDictate}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.formActions}>
          <Button
            label={t("common.cancel")}
            variant="ghost"
            fullWidth
            onPress={requestCloseForm}
            style={styles.formActionButton}
          />
          <Button
            label={t("common.save")}
            fullWidth
            disabled={draft.rating < KHUSHU_MIN || draft.rating > KHUSHU_MAX}
            onPress={attemptSave}
            style={styles.formActionButton}
          />
        </View>
      </Sheet>

      <ConfirmDialog
        visible={pending != null}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        confirmLabel={confirmCopy?.confirmLabel}
        destructive={confirmCopy?.destructive}
        onConfirm={handleConfirm}
        onClose={handleConfirmClose}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stars: { flexDirection: "row", alignItems: "center" },
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  summaryMain: { flex: 1, gap: Spacing.half },
  avgLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  khushuLearnMore: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: Spacing.half + 2,
  },
  summaryValueRow: { flexDirection: "row", alignItems: "baseline", gap: Spacing.one },
  summaryNumber: { lineHeight: 34 },
  levelHint: { marginTop: Spacing.half },
  listSection: { gap: Spacing.two },
  groupList: { gap: Spacing.three, marginTop: Spacing.two },
  groupDate: { marginBottom: Spacing.two },
  entryList: { gap: Spacing.two },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingStart: Spacing.two,
    paddingEnd: Spacing.half,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  entryMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  entryBody: { flex: 1, gap: Spacing.half },
  entryHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  entryNote: { marginTop: Spacing.half },
  sheetTitle: { marginBottom: Spacing.one },
  sheetDate: { marginBottom: Spacing.two },
  fieldLabel: { marginTop: Spacing.three, marginBottom: Spacing.one },
  prayerChips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  ratingPanel: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  ratingLabel: { marginTop: Spacing.one },
  noteField: {
    position: "relative",
    minHeight: 88,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "visible",
  },
  noteInput: {
    minHeight: 88,
    padding: Spacing.three,
    textAlignVertical: "top",
    fontSize: 15,
  },
  noteMic: {
    position: "absolute",
    top: Spacing.one,
    end: Spacing.one,
  },
  formActions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  formActionButton: { flex: 1 },
});
