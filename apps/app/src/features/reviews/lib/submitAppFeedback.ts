import { appFeedbackControllerSubmit, type SubmitAppFeedbackDto } from "@munib-tracker/api-client";
import type { AppFeedbackTriggerId } from "@munib-tracker/shared/reviews";

import { apiAuthOptions } from "@/api/auth-options";
import { SessionStore } from "@/auth/session-store";
import { resolveAppPlatform } from "@/lib/app/resolve-app-platform";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";

export type SubmitReviewFeedbackParams = {
  rating: number;
  message: string;
  triggerId?: AppFeedbackTriggerId;
  locale: string;
};

/** POST low-star feedback to the API. */
export async function submitReviewFeedback(params: SubmitReviewFeedbackParams): Promise<void> {
  const platform = resolveAppPlatform();
  if (platform !== "ios" && platform !== "android" && platform !== "web") {
    throw new Error("Review feedback requires a supported platform");
  }

  const session = await SessionStore.get();
  if (!session?.accessToken) {
    throw new Error("Review feedback requires an active session");
  }

  await appFeedbackControllerSubmit(
    {
      rating: params.rating,
      message: params.message || undefined,
      source: "in_app_review",
      triggerId: params.triggerId,
      appVersion: resolveAppVersion(),
      platform,
      locale: params.locale,
    } satisfies SubmitAppFeedbackDto,
    apiAuthOptions(session.accessToken),
  );
}
