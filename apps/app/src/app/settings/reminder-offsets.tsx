import { LegacySettingsRedirect } from "@/components/settings/legacy-redirect";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** Moved into a settings group (NF-3.0b §4.5.6) — kept so old links and deep links work. */
export default function ReminderOffsetsRedirect() {
  return <LegacySettingsRedirect from="/settings/reminder-offsets" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/reminder-offsets");
