export type ShareableReading = {
  title?: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
};

export type { ShareContentBody, ShareContentPayload } from "@/hooks/use-share-content-card";
export {
  appendShareBranding,
  buildAyahSharePayload,
  buildHadithSharePayload,
  formatAchievementShare,
  formatAyahShare,
  formatGuideShare,
  formatHadithShare,
  formatReadingShare,
} from "@/hooks/use-share-content-card";
