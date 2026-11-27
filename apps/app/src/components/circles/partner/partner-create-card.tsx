import { CIRCLE_LIMITS } from "@munib-tracker/shared/circles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { LabeledInput } from "@/components/records/labeled-input";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { type CircleDetail, type CreateCircleInput, createCircle } from "@/lib/circles/api";
import { useCircleMutation } from "@/lib/circles/hooks";
import { useToast } from "@/providers/toast-provider";

/** Start a partner circle (2–5 members, joined by invite). Account required. */
export function PartnerCreateCard({ onCreated }: { onCreated: (circle: CircleDetail) => void }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const create = useCircleMutation((token, input: CreateCircleInput) => createCircle(token, input));

  const submit = async () => {
    try {
      const circle = await create.mutateAsync({
        type: "partner",
        name: name.trim() || t("partnerCircle.create.defaultName"),
        ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
      });
      onCreated(circle);
    } catch {
      toast.error(t("partnerCircle.create.error"));
    }
  };

  return (
    <Card style={styles.card}>
      <SectionHeader
        title={t("partnerCircle.create.title")}
        icon={{ ios: "person.2.fill", android: "group", web: "group" }}
      />
      <ThemedText type="small" themeColor="mutedForeground">
        {t("partnerCircle.create.body")}
      </ThemedText>
      <LabeledInput
        label={t("partnerCircle.create.nameLabel")}
        placeholder={t("partnerCircle.create.defaultName")}
        value={name}
        onChangeText={setName}
        maxLength={CIRCLE_LIMITS.nameMaxLength}
      />
      <LabeledInput
        label={t("circleMembership.nameLabel")}
        hint={t("circleMembership.nameHint")}
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={CIRCLE_LIMITS.displayNameMaxLength}
      />
      <Button
        label={t("partnerCircle.create.submit")}
        onPress={() => void submit()}
        disabled={create.isPending}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});
