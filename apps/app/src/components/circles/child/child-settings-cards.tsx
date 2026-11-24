import { CIRCLE_LIMITS, KIDS_MODE_MAX_AGE } from "@munib-tracker/shared/circles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { TextField } from "@/components/self-review/text-field";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import type { ChildProfile, UpdateChildInput } from "@/lib/circles/api";

/** Default target when a child has no reward yet. */
const DEFAULT_REWARD_DAYS = 7;

type SaveChild = (input: UpdateChildInput) => void;

/** "Reward after N days" — the child's own goal, shown as a calm progress bar in kids mode. */
export function ChildRewardCard({ child, onSave }: { child: ChildProfile; onSave: SaveChild }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(child.reward?.title ?? "");
  const [days, setDays] = useState(child.reward?.days ?? DEFAULT_REWARD_DAYS);
  const savedTitle = child.reward?.title;
  const savedDays = child.reward?.days;

  // Re-seed from the server copy when the saved reward changes (not on unrelated edits).
  useEffect(() => {
    setTitle(savedTitle ?? "");
    setDays(savedDays ?? DEFAULT_REWARD_DAYS);
  }, [savedTitle, savedDays]);

  return (
    <>
      <SectionHeader title={t("family.reward.title")} />
      <Card padding="three" style={styles.gap}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("family.reward.body")}
        </ThemedText>
        <TextField
          label={t("family.reward.what")}
          placeholder={t("family.reward.placeholder")}
          value={title}
          onChangeText={setTitle}
          maxLength={CIRCLE_LIMITS.rewardTitleMaxLength}
        />
        <ThemedText type="smallBold">{t("family.reward.days", { count: days })}</ThemedText>
        <Stepper
          value={days}
          min={1}
          label={t("family.reward.daysLabel")}
          onDecrement={() => setDays((d) => Math.max(1, d - 1))}
          onIncrement={() => setDays((d) => Math.min(CIRCLE_LIMITS.rewardMaxDays, d + 1))}
        />
        <View style={styles.row}>
          <Button
            label={t("family.reward.save")}
            disabled={!title.trim()}
            onPress={() => onSave({ reward: { title: title.trim(), days } })}
          />
          {child.reward ? (
            <Button
              label={t("family.reward.clear")}
              variant="secondary"
              onPress={() => onSave({ reward: null })}
            />
          ) : null}
        </View>
      </Card>
    </>
  );
}

/** Nickname + birth year (same range as "Add a child": kids mode is under 13). */
export function ChildProfileCard({ child, onSave }: { child: ChildProfile; onSave: SaveChild }) {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState(child.nickname);
  const [birthYear, setBirthYear] = useState(child.birthYear);
  const thisYear = new Date().getUTCFullYear();
  // A profile already past the kids range keeps its stored year as the floor instead of jumping.
  const minBirthYear = Math.min(child.birthYear, thisYear - KIDS_MODE_MAX_AGE);

  useEffect(() => {
    setNickname(child.nickname);
    setBirthYear(child.birthYear);
  }, [child.nickname, child.birthYear]);

  return (
    <>
      <SectionHeader title={t("family.child.profileTitle")} />
      <Card padding="three" style={styles.gap}>
        <TextField
          label={t("family.add.nickname")}
          value={nickname}
          onChangeText={setNickname}
          maxLength={CIRCLE_LIMITS.nicknameMaxLength}
        />
        <ThemedText type="smallBold">{`${t("family.add.birthYear")}: ${birthYear}`}</ThemedText>
        <Stepper
          value={birthYear}
          min={minBirthYear}
          label={t("family.add.birthYear")}
          onDecrement={() => setBirthYear((y) => Math.max(minBirthYear, y - 1))}
          onIncrement={() => setBirthYear((y) => Math.min(thisYear, y + 1))}
        />
        <Button
          label={t("family.saveProfile")}
          variant="secondary"
          disabled={!nickname.trim()}
          onPress={() => onSave({ nickname: nickname.trim(), birthYear })}
        />
      </Card>
    </>
  );
}

/** E13: let the child see the "graduate to your own account" offer before 13. */
export function ChildGraduationCard({ child, onSave }: { child: ChildProfile; onSave: SaveChild }) {
  const { t } = useTranslation();
  return (
    <>
      <SectionHeader title={t("family.graduation.title")} />
      <Card padding="three" style={styles.gap}>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("family.graduation.body")}
        </ThemedText>
        <View style={styles.switchRow}>
          <ThemedText type="small" style={styles.flex}>
            {t("family.graduation.early")}
          </ThemedText>
          <ThemedSwitch
            value={child.graduationUnlocked}
            onValueChange={(on) => onSave({ graduationUnlocked: on })}
            accessibilityLabel={t("family.graduation.early")}
          />
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.two },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
