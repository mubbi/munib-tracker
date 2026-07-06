import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
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
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { averageRating, groupByDate, KHUSHU_MAX, KHUSHU_MIN, type KhushuEntry } from "@/lib/khushu";
import { PRAYER_ICONS } from "@/lib/prayer-ui";
import { useEnsureKhushuLoaded, useKhushuActions, useKhushuEntries } from "@/stores/khushu-store";

const RATINGS = [1, 2, 3, 4, 5] as const;

const PRAYER_ORDER = new Map<string, number>(OBLIGATORY_PRAYERS.map((id, index) => [id, index]));

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
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { formatIso } = useFormatCalendarDate();
  useEnsureKhushuLoaded();
  const entries = useKhushuEntries();
  const { save, remove } = useKhushuActions();

  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<FormDraft>(defaultDraft);
  const [savedDraft, setSavedDraft] = useState<FormDraft>(defaultDraft);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const groups = useMemo(() => sortedGroups(entries), [entries]);
  const avg = averageRating(entries);
  const today = getLocalDateString();

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
    const next = defaultDraft();
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

  const doSave = async () => {
    await save({
      date: draft.date,
      prayerId: draft.prayerId,
      rating: draft.rating,
      note: draft.note,
    });
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
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/tracker"))}
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
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("journal.avgLabel")}
                </ThemedText>
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
          {OBLIGATORY_PRAYERS.map((id) => {
            const active = draft.prayerId === id;
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
                <ThemedText
                  type="caption"
                  style={{ color: active ? colors.accentForeground : colors.foreground }}
                >
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
        <TextInput
          value={draft.note}
          onChangeText={(note) => setDraft((current) => ({ ...current, note }))}
          placeholder={t("journal.notePlaceholder")}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={t("journal.fieldNote")}
          multiline
          style={[styles.noteInput, { backgroundColor: colors.muted, color: colors.foreground }]}
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
            onPress={attemptSave}
            style={styles.formActionButton}
          />
        </View>
      </Sheet>

      {confirmCopy ? (
        <ConfirmDialog
          visible={pending != null}
          title={confirmCopy.title}
          message={confirmCopy.message}
          confirmLabel={confirmCopy.confirmLabel}
          destructive={confirmCopy.destructive}
          onConfirm={handleConfirm}
          onClose={handleConfirmClose}
        />
      ) : null}
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
  noteInput: {
    minHeight: 88,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.three,
    textAlignVertical: "top",
    fontSize: 15,
  },
  formActions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  formActionButton: { flex: 1 },
});
