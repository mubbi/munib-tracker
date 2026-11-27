import { FindAyahScreen } from "@/components/quran/find-ayah-screen";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Qur'an hub entry to "Find an ayah" (Text · Root · Recite). Deep links keep
 * working: `?mode=root&q=…` opens root search, `?mode=recite` the listener.
 * Same screen as `/verse-detector` (C-08).
 */
export default function QuranSearchScreen() {
  return <FindAyahScreen entry="search" />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/search");
