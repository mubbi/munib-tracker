import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";

import { EmptyState } from "@/components/ui/empty-state";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";

type UnavailableOnDeviceProps = {
  /** Defaults to "Available on your phone" (TV) / "Available in the mobile app". */
  title?: string;
  /** One sentence on where the feature is available. */
  description?: string;
  /** The focusable next step; defaults to "Go back" (to `fallbackHref` when there is no history). */
  actionLabel?: string;
  onAction?: () => void;
  /** Where "Go back" lands when the stack cannot pop. Default `/`. */
  fallbackHref?: Href;
  style?: StyleProp<ViewStyle>;
};

/**
 * The single "not on this device" treatment (D-40): an `EmptyState` with one
 * focusable action, so a gated TV / web screen is never a focus dead end. Use
 * for `notOnTv` tools and native-only features opened on web.
 */
export function UnavailableOnDevice({
  title,
  description,
  actionLabel,
  onAction,
  fallbackHref = "/",
  style,
}: UnavailableOnDeviceProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const tv = isTV();

  return (
    <EmptyState
      icon={
        tv
          ? { ios: "tv", android: "tv", web: "tv" }
          : { ios: "iphone", android: "smartphone", web: "smartphone" }
      }
      title={title ?? t(tv ? "uiFeedback.availableOnPhone" : "uiFeedback.availableInApp")}
      description={
        description ?? t(tv ? "uiFeedback.availableOnPhoneBody" : "uiFeedback.availableInAppBody")
      }
      actionLabel={actionLabel ?? t("common.goBack")}
      onAction={onAction ?? (() => goBackOrReplace(router, fallbackHref))}
      actionPreferredFocus
      style={style}
    />
  );
}
