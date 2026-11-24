import { SettingsScreen } from "@/components/settings/settings-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** Settings group (NF-3.0b): rendered from `lib/settings/defs/prayer-times.ts`. */
export default function PrayerTimesSettingsScreen() {
  return <SettingsScreen group="prayer-times" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/prayer-times");
