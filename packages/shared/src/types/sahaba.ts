/** Companion category filters on the Sahaba directory. */
export type SahabaCategory = "caliphs" | "ashara" | "family" | "women" | "notable";

/** One companion profile in the Sahaba Learn module. */
export interface SahabaProfile {
  id: string;
  name: string;
  /** Arabic display name when useful. */
  arabicName?: string;
  epithet?: string;
  categories: SahabaCategory[];
  /** Approximate lifespan label, e.g. "d. 13 AH". */
  lifespan?: string;
  summary: string;
  body: string;
}
