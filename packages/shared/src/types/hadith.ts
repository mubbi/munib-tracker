export interface HadithCollection {
  id: string; // "nawawi40", "riyad_assalihin", "bukhari", ...
  nameEnglish: string;
  nameArabic: string;
  bundled: boolean; // true for the offline highlight sets
  bookCount?: number;
}

/** One link in a transmission chain. Order ascends toward the Prophet (last link = Prophet). */
export interface HadithIsnadLink {
  order: number;
  nameArabic: string;
  nameEnglish?: string;
  role?: "companion" | "narrator" | "prophet";
}

export interface HadithItem {
  id: string; // stable: `${collection}:${number}`
  collection: string;
  book?: string;
  chapterId?: string;
  number: string;
  arabic: string;
  english: string;
  /** Dataset-sourced translations keyed by app locale (remote collections only). */
  translations?: Partial<Record<string, string>>;
  narrator?: string;
  /**
   * Structured isnad (NF-2.9). Absent when the corpus has no chain —
   * hide UI rather than inventing links.
   */
  isnad?: HadithIsnadLink[];
  /**
   * Classical Arabic sharh / explanation (NF-2.8). Absent = hide;
   * never AI-paraphrase into English.
   */
  sharhArabic?: string;
  /** "sahih" | "hasan" | ... (may be absent → show "ungraded") */
  grade?: string;
  gradedBy?: string;
  /** human-readable, e.g. "Sahih al-Bukhari 1" */
  reference: string;
  audioUri?: string;
}

/** A book/chapter within a collection, used to browse large collections. */
export interface HadithSection {
  id: string;
  name: string;
  count: number;
}

/** A collection's browsable data: its sections plus all (non-empty) hadith. */
export interface HadithCollectionData {
  sections: HadithSection[];
  items: HadithItem[];
}
