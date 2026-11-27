import * as Linking from "expo-linking";
import { useEffect } from "react";
import { invokeOpenWriteReview } from "@/features/reviews/lib/reviewPromptBridge";

/** `<scheme>://open-review` — e.g. from an email or the site: opens the store's write-review page. */
export function isReviewDeepLink(url: string): boolean {
  const parsed = Linking.parse(url);
  return (parsed.path?.replace(/^\//, "") ?? "") === "open-review";
}

/** Registers munib-tracker://open-review deep links (explicit user intent → store page). */
export function ReviewDeepLinkBridge(): null {
  useEffect(() => {
    const handle = (url: string | null) => {
      if (url && isReviewDeepLink(url)) invokeOpenWriteReview();
    };
    const sub = Linking.addEventListener("url", ({ url }) => handle(url));
    void Linking.getInitialURL().then(handle);
    return () => sub.remove();
  }, []);

  return null;
}
