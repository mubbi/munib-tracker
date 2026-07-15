import { HAJJ_GUIDE_SECTIONS } from "@munib-tracker/shared/content/hajj-guide";
import type { HajjGuideSection } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/hajj` route chunk.
 * Lazy `import()` left the hub empty/partial on first paint.
 */
export function isHajjGuideContentReady(): boolean {
  return true;
}

export async function ensureHajjGuideContent(): Promise<HajjGuideSection[]> {
  return HAJJ_GUIDE_SECTIONS as HajjGuideSection[];
}

export function getHajjGuideSections(): HajjGuideSection[] {
  return localizeList(
    HAJJ_GUIDE_SECTIONS as HajjGuideSection[],
    overlayList("HAJJ_GUIDE_SECTIONS"),
  );
}
