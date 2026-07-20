import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  openReviewStoreListing,
  openReviewStoreListingUrl,
  resolveReviewStoreListingTarget,
  resolveReviewStoreListingUrl,
} from "@/lib/platform/storeReview";

type Step = "stars" | "store" | "feedback";

type Props = {
  visible: boolean;
  onClose: () => void;
  onDismissed: () => void;
  onStoreReviewRequested: () => void;
  onFeedbackSent: (rating: number, message: string) => Promise<void>;
  feedbackOffline?: boolean;
  feedbackError?: string | null;
};

export function ReviewPromptSheet({
  visible,
  onClose,
  onDismissed,
  onStoreReviewRequested,
  onFeedbackSent,
  feedbackOffline = false,
  feedbackError = null,
}: Props) {
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [step, setStep] = useState<Step>("stars");
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const storeListingTarget = resolveReviewStoreListingTarget();

  const reset = useCallback(() => {
    setStep("stars");
    setStars(0);
    setFeedback("");
    setSubmitting(false);
  }, []);

  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  const handleClose = () => {
    onDismissed();
    reset();
    onClose();
  };

  const handleStarPick = (value: number) => {
    setStars(value);
    if (value >= 4) {
      setStep("store");
      return;
    }
    setStep("feedback");
  };

  const finishStoreReview = () => {
    onStoreReviewRequested();
    reset();
    onClose();
  };

  const handleStoreReview = async () => {
    const opened = await openReviewStoreListing({ locale: i18n.language });
    if (!opened) return;
    finishStoreReview();
  };

  const handleStoreListingPress = async (target: "ios" | "android") => {
    await openReviewStoreListingUrl(resolveReviewStoreListingUrl(target, i18n.language));
    finishStoreReview();
  };

  const handleSendFeedback = async () => {
    if (stars < 1 || stars > 3 || feedbackOffline) return;
    setSubmitting(true);
    try {
      await onFeedbackSent(stars, feedback.trim());
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={handleClose} variant="bottom" scrollable={false}>
      <View style={styles.body}>
        {step === "stars" ? (
          <>
            <ThemedText type="subtitle" style={styles.title}>
              {t("reviews.rateTitle")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.subtitle}>
              {t("reviews.rateSubtitle")}
            </ThemedText>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((value) => (
                <PressableScale
                  key={value}
                  onPress={() => handleStarPick(value)}
                  haptic="selection"
                  scaleTo={0.92}
                  style={styles.starButton}
                  accessibilityRole="button"
                  accessibilityLabel={t("reviews.starLabel", { count: value })}
                >
                  <AppIcon
                    icon={{
                      ios: stars >= value ? "star.fill" : "star",
                      android: stars >= value ? "star" : "star_border",
                      web: stars >= value ? "star" : "star_border",
                    }}
                    size={36}
                    tintColor={colors.accent}
                  />
                </PressableScale>
              ))}
            </View>
          </>
        ) : null}

        {step === "store" ? (
          <>
            <ThemedText type="subtitle" style={styles.title}>
              {t("reviews.storeTitle")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.subtitle}>
              {t("reviews.storeBody")}
            </ThemedText>
            {storeListingTarget === "both" ? (
              <>
                <Button
                  label={t("settings.downloadIosBottomLine")}
                  onPress={() => void handleStoreListingPress("ios")}
                  fullWidth
                  style={styles.cta}
                />
                <Button
                  label={t("settings.downloadAndroidBottomLine")}
                  onPress={() => void handleStoreListingPress("android")}
                  fullWidth
                />
              </>
            ) : (
              <Button
                label={t("reviews.storeCta")}
                onPress={() => void handleStoreReview()}
                fullWidth
                style={styles.cta}
              />
            )}
            <Button
              label={t("reviews.maybeLater")}
              onPress={handleClose}
              variant="secondary"
              fullWidth
            />
          </>
        ) : null}

        {step === "feedback" ? (
          <>
            <ThemedText type="subtitle" style={styles.title}>
              {t("reviews.feedbackTitle")}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground" style={styles.subtitle}>
              {t("reviews.feedbackBody")}
            </ThemedText>
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder={t("reviews.feedbackPlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              multiline
              maxLength={2000}
              style={[
                styles.feedbackInput,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.muted,
                },
              ]}
            />
            {feedbackOffline ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("reviews.feedbackOffline")}
              </ThemedText>
            ) : null}
            {feedbackError ? (
              <ThemedText type="caption" style={{ color: tokens.status.danger.color }}>
                {feedbackError}
              </ThemedText>
            ) : null}
            <Button
              label={t("reviews.feedbackCta")}
              onPress={() => void handleSendFeedback()}
              fullWidth
              disabled={feedbackOffline || submitting}
              style={styles.cta}
            />
            <Button label={t("reviews.skip")} onPress={handleClose} variant="secondary" fullWidth />
          </>
        ) : null}
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
  title: {
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
    marginTop: Spacing.two,
  },
  starButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    textAlignVertical: "top",
  },
  cta: {
    marginTop: Spacing.one,
  },
});
