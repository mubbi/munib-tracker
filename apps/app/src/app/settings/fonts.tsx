import { SettingsScreen } from "@/components/settings/settings-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** Settings group (NF-3.0b): rendered from `lib/settings/defs/fonts.ts`. */
export default function FontSettingsScreen() {
  return <SettingsScreen group="fonts" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/fonts");
