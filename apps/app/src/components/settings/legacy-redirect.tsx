import { type Href, Redirect } from "expo-router";

import {
  LEGACY_SETTINGS_REDIRECTS,
  type LegacySettingsPath,
  settingHref,
} from "@/lib/settings/routes";

/** Old settings routes now open the right group with `?focus=` (§4.5.6). */
export function LegacySettingsRedirect({ from }: { from: LegacySettingsPath }) {
  return <Redirect href={settingHref(LEGACY_SETTINGS_REDIRECTS[from]) as Href} />;
}
