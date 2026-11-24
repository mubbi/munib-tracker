import { CIRCLE_LIMITS } from "@munib-tracker/shared/circles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { TextField } from "@/components/self-review/text-field";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { createCircle } from "@/lib/circles/api";
import { useCircleMutation } from "@/lib/circles/hooks";
import { isTV } from "@/lib/platform/is-tv";
import { useToast } from "@/providers/toast-provider";

/** "Start a family circle" (NF-3.16) — phone / web only; TV shows the setup note. */
export function CreateFamilyCard() {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const create = useCircleMutation((token, input: { name: string; displayName?: string }) =>
    createCircle(token, { type: "family", ...input }),
  );

  if (isTV()) {
    return (
      <Card padding="three">
        <ThemedText type="small" themeColor="mutedForeground">
          {t("family.tvSetup")}
        </ThemedText>
      </Card>
    );
  }

  const onCreate = async () => {
    try {
      await create.mutateAsync({
        name: name.trim(),
        displayName: displayName.trim() || undefined,
      });
      toast.success(t("family.created"));
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  return (
    <Card padding="three" style={styles.card}>
      <ThemedText type="subtitle">{t("family.create.title")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("family.create.body")}
      </ThemedText>
      <TextField
        label={t("family.create.name")}
        placeholder={t("family.create.namePlaceholder")}
        value={name}
        onChangeText={setName}
        maxLength={CIRCLE_LIMITS.nameMaxLength}
      />
      <TextField
        label={t("circles.join.displayName")}
        hint={t("circles.join.displayNameHint")}
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={CIRCLE_LIMITS.displayNameMaxLength}
      />
      <Button
        label={create.isPending ? t("circles.common.working") : t("family.create.cta")}
        disabled={!name.trim() || create.isPending}
        onPress={() => void onCreate()}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});
