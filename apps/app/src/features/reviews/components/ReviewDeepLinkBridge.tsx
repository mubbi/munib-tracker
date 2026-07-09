import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import {
  invokeOpenReviewFunnel,
  parseReviewReactivationTriggerId,
} from "@/features/reviews/lib/reviewPromptBridge";

function handleReviewDeepLink(url: string): void {
  const parsed = Linking.parse(url);
  const path = parsed.path?.replace(/^\//, "") ?? "";
  if (path !== "open-review") return;
  const triggerId =
    parseReviewReactivationTriggerId(parsed.queryParams?.triggerId) ??
    APP_FEEDBACK_TRIGGER_IDS.manual;
  invokeOpenReviewFunnel(triggerId);
}

/** Registers munib-tracker://open-review deep links. */
export function ReviewDeepLinkBridge(): null {
  useEffect(() => {
    const onUrl = ({ url }: { url: string }) => {
      handleReviewDeepLink(url);
    };
    const sub = Linking.addEventListener("url", onUrl);
    void Linking.getInitialURL().then((url) => {
      if (url) handleReviewDeepLink(url);
    });
    return () => sub.remove();
  }, []);

  return null;
}
