import type { JannahHadithRef } from "../types/jannah";
import type { ExcusedReason } from "../types/prayer";

/** Deep-link route for each excused-reason guide screen. */
export const EXCUSED_GUIDE_ROUTES: Record<ExcusedReason, string> = {
  hayd: "/hayd",
  sick: "/sick",
  travel: "/travel",
};

export type ExcusedGuideHadithRef = Omit<JannahHadithRef, "excerpt">;

export type ExcusedGuideConfig = {
  /** i18n namespace (`hayd`, `sick`, or `travel`). */
  namespace: "hayd" | "sick" | "travel";
  hadith: ExcusedGuideHadithRef[];
  /** Number of obligation bullet keys: `{namespace}.obligations.{n}`. */
  obligationCount: number;
  /** Optional extra guide cards (travel qasr/jam/when). */
  extraSections?: readonly string[];
};

export const EXCUSED_GUIDES: Record<ExcusedReason, ExcusedGuideConfig> = {
  hayd: {
    namespace: "hayd",
    obligationCount: 4,
    extraSections: ["duration", "istihada", "nifas", "purity"],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "321",
        grade: "sahih",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "304",
        grade: "sahih",
      },
    ],
  },
  sick: {
    namespace: "sick",
    obligationCount: 5,
    extraSections: ["positions", "rukuSujud", "unable", "fastingQaza"],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "1117",
        grade: "sahih",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1936",
        grade: "sahih",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "1118",
        grade: "sahih",
      },
    ],
  },
  travel: {
    namespace: "travel",
    obligationCount: 6,
    hadith: [],
  },
};
