import { FindAyahScreen } from "@/components/quran/find-ayah-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Library entry to "Find an ayah" (Type · Recite, best-match detector).
 * `?mode=recite` opens the on-device listener. Same screen as `/quran/search`
 * (C-08); TV explains the missing microphone and offers text search.
 */
export default function QuranVerseDetectorScreen() {
  return <FindAyahScreen entry="detector" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/verse-detector");
