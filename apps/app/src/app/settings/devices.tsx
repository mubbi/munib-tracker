import { SettingsScreen } from "@/components/settings/settings-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** Settings group (NF-3.0b): rendered from `lib/settings/defs/devices.ts`. */
export default function DevicesSettingsScreen() {
  return <SettingsScreen group="devices" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/devices");
