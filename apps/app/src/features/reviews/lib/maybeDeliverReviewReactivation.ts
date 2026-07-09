import type { AppFeedbackTriggerId } from "@munib-tracker/shared/reviews";
import {
  reviewReactivationDedupeKey,
  reviewReactivationWindowKey,
} from "@munib-tracker/shared/reviews";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { SessionStore } from "@/auth/session-store";
import { getReviewPromptRuntime } from "@/features/reviews/lib/reviewEngagementBridge";
import { canSendReviewReactivationPush } from "@/features/reviews/lib/reviewGating";
import type { ReviewFunnelTriggerId } from "@/features/reviews/lib/reviewPromptBridge";
import {
  readReviewGating,
  readReviewReactivationDedupe,
  writeReviewReactivationDedupe,
} from "@/features/reviews/lib/reviewStorage";
import i18n from "@/i18n";
import { preferencesStore } from "@/stores/preferences-store";

/** OS-only nudge into the in-app review funnel (no inbox row). Max once per 60 days. */
export async function maybeDeliverReviewReactivation(
  triggerId: ReviewFunnelTriggerId,
): Promise<boolean> {
  if (Platform.OS === "web") return false;

  const prefs = preferencesStore.getState().prefs;
  if (prefs.notificationPrefs.reviewReactivationEnabled === false) return false;

  const gating = await readReviewGating();
  const runtime = getReviewPromptRuntime();
  const gate = canSendReviewReactivationPush(gating, runtime);
  if (!gate.allowed) return false;

  const deviceId = await SessionStore.getDeviceId();
  const windowKey = reviewReactivationWindowKey();
  const dedupeKey = reviewReactivationDedupeKey(deviceId, windowKey);
  const prior = await readReviewReactivationDedupe();
  if (prior === dedupeKey) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("localNotifications.reviewReactivationTitle"),
      body: i18n.t("localNotifications.reviewReactivationBody"),
      data: {
        type: "review_reactivation",
        action: "open_review_funnel",
        triggerId: triggerId satisfies AppFeedbackTriggerId,
      },
    },
    trigger: null,
  });

  await writeReviewReactivationDedupe(dedupeKey);
  return true;
}
