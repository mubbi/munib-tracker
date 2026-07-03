export interface HadithCollection {
  id: string; // "nawawi40", "riyad_assalihin", "bukhari", ...
  nameEnglish: string;
  nameArabic: string;
  bundled: boolean; // true for the offline highlight sets
  bookCount?: number;
}

export interface HadithItem {
  id: string; // stable: `${collection}:${number}`
  collection: string;
  book?: string;
  chapterId?: string;
  number: string;
  arabic: string;
  english: string;
  narrator?: string;
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
