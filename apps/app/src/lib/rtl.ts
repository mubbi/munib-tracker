import type { SymbolViewProps } from "expo-symbols";
import { I18nManager } from "react-native";

type IconName = SymbolViewProps["name"];

/**
 * Direction-aware icon names for navigation chrome. A right-to-left layout flip
 * only takes effect after an app reload (see `i18n-provider.tsx`), so
 * `I18nManager.isRTL` is stable for the session and these can be resolved once
 * at module load.
 *
 * Concept icons (clock, calendar, mosque, moon, search, …) must NOT be mirrored
 * and are intentionally absent here — only glyphs that encode reading direction
 * belong in this module.
 */
const rtl = I18nManager.isRTL;

/**
 * Disclosure / "forward" chevron pointing toward the reading direction — right
 * in LTR, left in RTL. Use for nav rows, list items, and "open" affordances.
 */
export const chevronForward: IconName = rtl
  ? { ios: "chevron.left", android: "chevron_left", web: "chevron_left" }
  : { ios: "chevron.right", android: "chevron_right", web: "chevron_right" };

/**
 * "Back" chevron pointing against the reading direction — left in LTR, right in
 * RTL. Use for back buttons and dismiss-to-previous affordances.
 */
export const chevronBack: IconName = rtl
  ? { ios: "chevron.right", android: "arrow_forward", web: "arrow_forward" }
  : { ios: "chevron.left", android: "arrow_back", web: "arrow_back" };

/**
 * "Forward" arrow (e.g. an onboarding Next button) — right in LTR, left in RTL.
 */
export const arrowForward: IconName = rtl
  ? { ios: "arrow.left", android: "arrow_back", web: "arrow_back" }
  : { ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" };
