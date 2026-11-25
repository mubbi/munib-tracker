import { APP_FEEDBACK_MAX_RATING } from "@munib-tracker/shared/reviews";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const RATINGS = Array.from({ length: APP_FEEDBACK_MAX_RATING }, (_, i) => i + 1);

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Rejects on failure (the caller sets `error`); the sheet stays open to retry. */
  onSubmit: (rating: number, message: string) => Promise<void>;
  offline?: boolean;
  error?: string | null;
};

/**
 * Settings → Send feedback (D76). A private note to the team with a 1–5
 * rating. It is opened only by the person, and whatever they pick it never
 * leads to — or away from — a store rating (no review gating).
 */
export function AppFeedbackSheet({ visible, onClose, onSubmit, offline = false, error }: Props) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setRating(0);
    setMessage("");
    setSubmitting(false);
  }, [visible]);

  const handleSubmit = async () => {
    if (rating < 1 || offline || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, message.trim());
      onClose();
    } catch {
      // `error` is surfaced by the caller; stay open so the person can retry.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      variant="bottom"
      scrollable={false}
      accessibilityLabel={t("reviews.feedbackTitle")}
    >
      <View style={styles.body}>
        <ThemedText type="subtitle" heading={2} style={styles.centered}>
          {t("reviews.feedbackTitle")}
        </ThemedText>
        <ThemedText type="small" themeColor="mutedForeground" style={styles.subtitle}>
          {t("reviews.feedbackBody")}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.centered}>
          {t("reviews.feedbackRatingLabel")}
        </ThemedText>
        {/* A rating is a single choice: radiogroup of five radios (P6-06). */}
        <View
          style={styles.starRow}
          accessibilityRole="radiogroup"
          accessibilityLabel={t("reviews.feedbackRatingLabel")}
        >
          {RATINGS.map((value) => (
            <PressableScale
              key={value}
              onPress={() => setRating(value)}
              haptic="selection"
              scaleTo={0.92}
              style={styles.starButton}
              accessibilityRole="radio"
              accessibilityState={{ checked: rating === value }}
              accessibilityLabel={t("reviews.starLabel", { count: value })}
            >
              <AppIcon
                icon={{
                  ios: rating >= value ? "star.fill" : "star",
                  android: rating >= value ? "star" : "star_border",
                  web: rating >= value ? "star" : "star_border",
                }}
                size={36}
                tintColor={colors.accent}
              />
            </PressableScale>
          ))}
        </View>
        <TextField
          label={t("reviews.feedbackLabel")}
          value={message}
          onChangeText={setMessage}
          placeholder={t("reviews.feedbackPlaceholder")}
          multiline
          maxLength={2000}
          optional
          error={error ?? undefined}
        />
        {offline ? <Callout tone="warning">{t("reviews.feedbackOffline")}</Callout> : null}
        <Button
          label={t("reviews.feedbackCta")}
          onPress={() => void handleSubmit()}
          fullWidth
          loading={submitting}
          disabled={offline || rating < 1}
          style={styles.cta}
        />
        <Button label={t("common.cancel")} onPress={onClose} variant="secondary" fullWidth />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  centered: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.two,
  },
  starButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cta: {
    marginTop: Spacing.one,
  },
});
