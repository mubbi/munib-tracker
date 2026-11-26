import { OBLIGATORY_PRAYERS, SUNNAH_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { ContentState } from "@/components/ui/content-state";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { TextField } from "@/components/ui/text-field";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { tTv } from "@/lib/i18n/t-tv";
import { averageRating, groupByDate, KHUSHU_MAX, KHUSHU_MIN, type KhushuEntry } from "@/lib/khushu";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import type { SttErrorKind } from "@/lib/stt";
import { useToast } from "@/providers/toast-provider";
import { useStore } from "@/stores/create-store";
import {
  khushuStore,
  useEnsureKhushuLoaded,
  useKhushuActions,
  useKhushuEntries,
} from "@/stores/khushu-store";
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

type PendingAction = { kind: "discard" } | { kind: "overwrite" };

function defaultDraft(): FormDraft {
  return {
    mode: "new",
    date: getLocalDateString(),
    prayerId: "fajr",
    // No preselected rating: presence is the user's own call.
    rating: 0,
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
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const gap = compact ? Spacing.half : Spacing.one;
  const interactive = onChange != null;
  const levelName = (star: number) => t(`journal.level${star}`);

  return (
    <View
      style={[styles.stars, { gap }]}
      // Editable: a radio group of five levels. Read-only: one described value.
      accessibilityRole={interactive ? "radiogroup" : undefined}
      accessibilityLabel={
        interactive
          ? t("journal.fieldRating")
          : value > 0
            ? t("journal.ratingA11y", { rating: value, max: KHUSHU_MAX, level: levelName(value) })
            : undefined
      }
      accessible={interactive || value <= 0 ? undefined : true}
    >
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
              accessibilityRole="radio"
              accessibilityLabel={`${star}, ${levelName(star)}`}
              accessibilityState={{ selected: star === value }}
              onPress={() => onChange(star)}
              scaleTo={0.85}
              haptic="selection"
              // 44pt square (chip-sized on TV) so the focus ring frames the star.
              style={tv ? styles.starTv : styles.starTarget}
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

/** "Reflect on today": today's completed Salah that have no reflection yet. */
function ReflectToday({
  prayers,
  onPick,
  title,
}: {
  prayers: readonly PrayerId[];
  onPick: (id: PrayerId) => void;
  title: string;
}) {
  const { t } = useTranslation();
  if (prayers.length === 0) return null;
  return (
    <Card style={styles.reflectCard}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <View style={styles.prayerChips}>
        {prayers.map((id) => (
          <Chip
            key={id}
            icon={PRAYER_ICONS[id]}
            label={t(`prayers.${id}`)}
            accessibilityLabel={t("journal.reflectOn", { prayer: t(`prayers.${id}`) })}
            selected={false}
            onPress={() => onPick(id)}
          />
        ))}
      </View>
    </Card>
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
  const tv = isTV();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { formatIso } = useFormatCalendarDate();
  const toast = useToast();
  const undoToast = useUndoToast();
  useEnsureKhushuLoaded();
  const ready = useStore(khushuStore, (s) => s.isReady);
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

  // Today's completed salah that have no reflection yet — the "Reflect on today" list.
  const unreflectedToday = useMemo(
    () =>
      completedToday.filter(
        (id) => !entries.some((entry) => entry.date === today && entry.prayerId === id),
      ),
    [completedToday, entries, today],
  );

  const openNewForm = (prayerId?: PrayerId) => {
    const firstPrayer = prayerId ?? unreflectedToday[0] ?? completedToday[0];
    if (!firstPrayer) {
      // Nothing completed yet: the only useful step is the tracker.
      router.push("/tracker");
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
    toast.success(t("journal.saved"));
  };

  /** Delete is cheap to reverse: remove now, offer Undo (no confirm dialog). */
  const deleteWithUndo = (entry: KhushuEntry) => {
    void undoToast.run({
      do: () => remove(entry.date, entry.prayerId),
      undo: () =>
        save({
          date: entry.date,
          prayerId: entry.prayerId,
          rating: entry.rating,
          note: entry.note,
        }),
      messageKey: "journal.deleted",
    });
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
  }, [draft.prayerId, pending, t]);

  const handleConfirm = () => {
    if (!pending) return;

    if (pending.kind === "discard") {
      closeForm();
      return;
    } else if (pending.kind === "overwrite") {
      void doSave();
      return;
    }

    setPending(null);
  };

  /** Cancel the confirm — back to the form (the sheet stays open). */
  const handleConfirmClose = () => {
    setPending(null);
  };

  return (
    <ScreenLayout
      eyebrow={t("journal.eyebrow")}
      title={t("journal.title")}
      subtitle={t("journal.subtitle")}
      onBack={() => goBackOrReplace(router, "/tracker")}
    >
      {/* TV: toasts take no focus — the Undo lives on the page (B-04). */}
      <TvUndoButton controller={undoToast} preferredFocus />
      <Seo path="/journal" />

      {!ready ? (
        <ContentState status="loading" skeleton="card" skeletonCount={2} />
      ) : entries.length === 0 ? (
        <View style={styles.listSection}>
          <ReflectToday
            prayers={unreflectedToday}
            onPick={(id) => openNewForm(id)}
            title={t("journal.reflectToday")}
          />
          <EmptyState
            icon={{ ios: "heart.text.square", android: "favorite", web: "favorite" }}
            title={t("journal.emptyTitle")}
            description={t("journal.emptyDesc")}
            actionLabel={completedToday.length > 0 ? t("journal.add") : t("journal.openTracker")}
            onAction={() => openNewForm()}
          />
        </View>
      ) : (
        <Stagger>
          <ReflectToday
            prayers={unreflectedToday}
            onPick={(id) => openNewForm(id)}
            title={t("journal.reflectToday")}
          />
          <Card variant="muted">
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
                    style={[styles.khushuLearnMore, tv ? styles.khushuLearnMoreTv : null]}
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
              onActionPress={() => openNewForm()}
            />

            {/* Wide web / tablets: day cards in a 2–3 column grid. TV stays one column. */}
            <ResponsiveGrid
              columns={tv ? 1 : undefined}
              maxColumns={3}
              gap={Spacing.three}
              style={styles.groupList}
            >
              {groups.map((group) => (
                <Card key={group.date} style={styles.groupCard}>
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
                          hitTarget={44}
                          onPress={() => deleteWithUndo(entry)}
                        />
                      </View>
                    ))}
                  </View>
                </Card>
              ))}
            </ResponsiveGrid>
          </View>
        </Stagger>
      )}

      {/*
        The discard / overwrite confirm renders INSIDE the sheet, replacing the
        form. A sibling <ConfirmDialog> is a second RN Modal, and iOS can't
        present it while this sheet's Modal is up — the confirm never appeared
        and the sheet could not be closed after changing the Salah pill.
        While it shows, dismissing the sheet (swipe / scrim / Back) just goes
        back to the form.
      */}
      <Sheet
        accessibilityLabel={
          confirmCopy
            ? confirmCopy.title
            : draft.mode === "edit"
              ? t("journal.editTitle")
              : t("journal.newTitle")
        }
        visible={formOpen}
        onClose={pending ? handleConfirmClose : requestCloseForm}
        variant="bottom"
      >
        {confirmCopy ? (
          <View style={styles.confirm} testID="journal-inline-confirm">
            <ThemedText type="subtitle" role="alert" accessibilityLiveRegion="polite">
              {confirmCopy.title}
            </ThemedText>
            {confirmCopy.message ? (
              <ThemedText type="small" themeColor="mutedForeground">
                {confirmCopy.message}
              </ThemedText>
            ) : null}
            <View style={styles.formActions}>
              <Button
                label={t("common.cancel")}
                variant="ghost"
                fullWidth
                preferredFocus
                onPress={handleConfirmClose}
                style={styles.formActionButton}
              />
              <Button
                label={confirmCopy.confirmLabel}
                variant={confirmCopy.destructive ? "destructive" : "primary"}
                fullWidth
                onPress={handleConfirm}
                style={styles.formActionButton}
              />
            </View>
          </View>
        ) : (
          <>
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
            <View style={styles.prayerChips} accessibilityRole="radiogroup">
              {pickerPrayers.map((id) => (
                <Chip
                  key={id}
                  role="radio"
                  variant="solid"
                  icon={PRAYER_ICONS[id]}
                  label={t(`prayers.${id}`)}
                  selected={draft.prayerId === id}
                  onPress={() => setDraft((current) => ({ ...current, prayerId: id }))}
                />
              ))}
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
                {draft.rating >= KHUSHU_MIN
                  ? t(`journal.level${draft.rating}`)
                  : t("journal.ratingNone")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {tTv(t, "journal.ratingHint", "journal.ratingHintTv")}
              </ThemedText>
            </View>

            <TextField
              label={t("journal.fieldNote")}
              value={draft.note}
              onChangeText={(note) => {
                if (stt.listening) stt.abort();
                setDraft((current) => ({ ...current, note }));
              }}
              placeholder={t("journal.notePlaceholder")}
              helperText={stt.listening ? t("journal.stt.listening") : undefined}
              multiline
              minLines={3}
              style={styles.noteField}
              // No microphone dictation on TV remotes (phone-only capability).
              trailing={
                stt.available && !tv ? (
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
                ) : undefined
              }
            />

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
                accessibilityHint={draft.rating < KHUSHU_MIN ? t("journal.ratingNone") : undefined}
                onPress={attemptSave}
                style={styles.formActionButton}
              />
            </View>
          </>
        )}
      </Sheet>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stars: { flexDirection: "row", alignItems: "center" },
  reflectCard: { gap: Spacing.two },
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
    gap: Spacing.one,
  },
  khushuLearnMoreTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  starTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  starTv: {
    minWidth: TvLayout.chipMinHeight,
    minHeight: TvLayout.chipMinHeight,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.md,
  },
  summaryValueRow: { flexDirection: "row", alignItems: "baseline", gap: Spacing.one },
  summaryNumber: { lineHeight: 34 },
  levelHint: { marginTop: Spacing.half },
  listSection: { gap: Spacing.two },
  groupList: { marginTop: Spacing.two },
  groupCard: { flexGrow: 1 },
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
  ratingPanel: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  ratingLabel: { marginTop: Spacing.one },
  noteField: { marginTop: Spacing.three },
  formActions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  formActionButton: { flex: 1 },
  confirm: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/journal");
