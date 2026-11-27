import { SUNNAH_HABITS } from "@munib-tracker/shared/content/sunnah-habits";
import { SUNNAH_HABITS_MAX_SELECTED, type SunnahHabitsState } from "@munib-tracker/shared/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { OrderedListEditor } from "@/components/settings/ordered-list-editor";
import { habitTitle } from "@/components/sunnah-habits/habit-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { CUSTOM_TITLE_MAX, canAddHabit, resolveHabit } from "@/lib/sunnah-habits";
import { HABIT_TIME_GROUPS, habitIcon, habitTimeGroup } from "@/lib/sunnah-habits-ui";
import { useSunnahHabitsActions } from "@/stores/sunnah-habits-store";

const ADD = { ios: "plus.circle.fill", android: "add_circle", web: "add_circle" } as const;

type ManageHabitsSheetProps = {
  visible: boolean;
  onClose: () => void;
  state: SunnahHabitsState;
  /** Remove from the list (the caller offers Undo). */
  onRemove: (id: string, title: string) => void;
};

/**
 * "Edit list" (habits screen): the user's habits in order (reorder / remove via
 * the shared ordered-list editor), then the catalog grouped by time of day with
 * + buttons, and the custom-habit field last (not on TV — no D-pad keyboards).
 */
export function ManageHabitsSheet({ visible, onClose, state, onRemove }: ManageHabitsSheetProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const actions = useSunnahHabitsActions();
  const tv = isTV();
  const [customTitle, setCustomTitle] = useState("");
  const full = !canAddHabit(state);

  const labelFor = (id: string) => {
    const habit = resolveHabit(state, id);
    return habit ? habitTitle(t, habit) : id;
  };

  const onChange = (next: string[]) => {
    const removed = state.selected.filter((id) => !next.includes(id));
    if (removed.length === 1 && removed[0]) {
      onRemove(removed[0], labelFor(removed[0]));
      return;
    }
    void actions.reorder(next);
  };

  const addCustom = () => {
    const title = customTitle.trim();
    if (!title || full) return;
    void actions.addCustom(title);
    setCustomTitle("");
  };

  const unselected = SUNNAH_HABITS.filter((h) => !state.selected.includes(h.id));
  const groups = HABIT_TIME_GROUPS.map((group) => ({
    group,
    habits: unselected.filter((h) => habitTimeGroup(h) === group),
  })).filter((entry) => entry.habits.length > 0);

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      variant="bottom"
      title={t("sunnahHabits.editList")}
      solid
    >
      <View style={styles.body}>
        <View>
          <ThemedText type="smallBold">
            {t("sunnahHabits.myHabits", {
              number: state.selected.length,
              max: SUNNAH_HABITS_MAX_SELECTED,
            })}
          </ThemedText>
          {state.selected.length > 0 ? (
            <OrderedListEditor
              order={state.selected}
              allIds={state.selected}
              labelFor={labelFor}
              iconFor={(id) => ({ icon: habitIcon(id), tint: colors.accent })}
              onChange={onChange}
              removable
              testID="sunnah-habits-order"
            />
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.gapTop}>
              {t("sunnahHabits.emptyHint")}
            </ThemedText>
          )}
        </View>

        {groups.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="smallBold">{t("sunnahHabits.addMore")}</ThemedText>
            {full ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("sunnahHabits.manageSubtitle", { max: SUNNAH_HABITS_MAX_SELECTED })}
              </ThemedText>
            ) : null}
            {groups.map(({ group, habits }) => (
              <View key={group} style={styles.group}>
                <ThemedText type="caption" themeColor="mutedForeground" weight="semibold">
                  {t(`sunnahHabits.groups.${group}`)}
                </ThemedText>
                {habits.map((habit) => {
                  const title = t(`sunnahHabits.items.${habit.id}.title`);
                  return (
                    <View key={habit.id} style={styles.catalogRow}>
                      <IconWell icon={habitIcon(habit.id)} size={14} well={28} radius={Radius.sm} />
                      <ThemedText type="small" style={styles.flex} numberOfLines={2}>
                        {title}
                      </ThemedText>
                      <IconButton
                        name={ADD}
                        tintColor={colors.accent}
                        disabled={full}
                        accessibilityLabel={t("sunnahHabits.add", { title })}
                        onPress={() => void actions.add(habit.id)}
                        hitTarget={tv ? TvLayout.minFocusTargetDp : undefined}
                      />
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        ) : null}

        {/* TV: no free-text entry (D-pad keyboards); catalog habits only. */}
        {!tv ? (
          <View style={styles.section}>
            <View style={styles.customRow}>
              <TextField
                label={t("sunnahHabits.customLabel")}
                value={customTitle}
                onChangeText={setCustomTitle}
                maxLength={CUSTOM_TITLE_MAX}
                placeholder={t("sunnahHabits.customPlaceholder")}
                onSubmitEditing={addCustom}
                returnKeyType="done"
                style={styles.flex}
              />
              <Button
                label={t("sunnahHabits.customAdd")}
                size="sm"
                disabled={!customTitle.trim() || full}
                onPress={addCustom}
              />
            </View>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("sunnahHabits.customHint")}
            </ThemedText>
          </View>
        ) : null}

        <Button
          label={t("sunnahHabits.doneEditing")}
          variant="secondary"
          fullWidth
          onPress={onClose}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.four },
  section: { gap: Spacing.two },
  group: { gap: Spacing.one, marginTop: Spacing.one },
  catalogRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  customRow: { flexDirection: "row", alignItems: "flex-end", gap: Spacing.two },
  flex: { flex: 1, minWidth: 0 },
  gapTop: { marginTop: Spacing.two },
});
