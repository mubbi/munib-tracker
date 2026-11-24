import { SettingsScreen } from "@/components/settings/settings-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** Settings group (NF-3.16–3.18): rendered from `lib/settings/defs/circles.ts`. */
export default function CirclesSettingsScreen() {
  return <SettingsScreen group="circles" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/circles");
