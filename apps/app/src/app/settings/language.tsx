import { SettingsScreen } from "@/components/settings/settings-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** Settings group (NF-3.0b): rendered from `lib/settings/defs/language.ts`. */
export default function LanguageSettingsScreen() {
  return <SettingsScreen group="language" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/language");
