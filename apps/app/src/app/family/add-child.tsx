import {
  CIRCLE_LIMITS,
  childAgeBand,
  isValidChildBirthYear,
  KIDS_MODE_MAX_AGE,
} from "@munib-tracker/shared/circles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { ParentalConsent } from "@/components/circles/parental-consent";
import { ScreenLayout } from "@/components/screen-layout";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/ui/stepper";
import { Spacing } from "@/constants/theme";
import { type CreateChildInput, createChild } from "@/lib/circles/api";
import { CHILD_CONSENT_POLICY_VERSION } from "@/lib/circles/consent";
import { useCircleAuth, useCircleMutation } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

/**
 * Add a child profile (D7): nickname + birth year ONLY, plus the parent's
 * consent recorded with the policy version. No email, no photo, no birth date.
 */
export default function AddChildScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const auth = useCircleAuth();
  const { circleId } = useLocalSearchParams<{ circleId?: string }>();
  const thisYear = new Date().getUTCFullYear();
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState(thisYear - 7);
  const [consent, setConsent] = useState(false);
  const create = useCircleMutation((token, input: CreateChildInput) =>
    createChild(token, circleId as string, input),
  );
  const back = () => goBackOrReplace(router, "/family");
  const validYear = isValidChildBirthYear(birthYear);
  const band = childAgeBand(birthYear);

  const onSave = async () => {
    try {
      await create.mutateAsync({
        nickname: nickname.trim(),
        birthYear,
        parentalConsent: true,
        consentPolicyVersion: CHILD_CONSENT_POLICY_VERSION,
      });
      toast.success(t("family.add.saved"));
      back();
    } catch {
      toast.error(t("family.add.error"));
    }
  };

  return (
    <ScreenLayout eyebrow={t("family.eyebrow")} title={t("family.add.title")} onBack={back}>
      <Seo path="/family/add-child" index={false} />
      {!auth.isAccount ? (
        <CircleAccountGate />
      ) : isTV() || !circleId ? (
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("family.tvSetup")}
          </ThemedText>
        </Card>
      ) : (
        <View style={styles.stack}>
          <Card padding="three" style={styles.gap}>
            <TextField
              label={t("family.add.nickname")}
              hint={t("family.add.nicknameHint")}
              value={nickname}
              onChangeText={setNickname}
              maxLength={CIRCLE_LIMITS.nicknameMaxLength}
              autoComplete="off"
            />
            <ThemedText type="smallBold">{t("family.add.birthYear")}</ThemedText>
            <Stepper
              value={birthYear}
              min={thisYear - KIDS_MODE_MAX_AGE}
              onDecrement={() => setBirthYear((y) => Math.max(thisYear - KIDS_MODE_MAX_AGE, y - 1))}
              onIncrement={() => setBirthYear((y) => Math.min(thisYear, y + 1))}
              label={t("family.add.birthYear")}
            />
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("family.add.birthYearHint")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t(`family.bandHint.${band}`)}
            </ThemedText>
          </Card>
          <ParentalConsent value={consent} onChange={setConsent} />
          <Button
            label={create.isPending ? t("circles.common.working") : t("family.add.save")}
            disabled={!nickname.trim() || !validYear || !consent || create.isPending}
            onPress={() => void onSave()}
          />
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family/add-child");
