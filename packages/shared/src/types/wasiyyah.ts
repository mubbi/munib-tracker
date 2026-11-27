import type { HeirType } from "./heirs";
import type { MadhhabId } from "./preferences";

/**
 * Wasiyyah (Islamic will) builder (NF-3.9). Stored only in the encrypted vault
 * document `wasiyyah` (D2). Sections 1 and 7 are required; the rest optional.
 */

/** Where a debts/obligations line came from (NF-3.8 import) or `manual`. */
export type WasiyyahDebtSource =
  | "debt"
  | "qaza_salah"
  | "qaza_fast"
  | "zakat"
  | "fidyah"
  | "kaffarah"
  | "vow"
  | "manual";

export interface WasiyyahDebtLine {
  id: string;
  source: WasiyyahDebtSource;
  /** NF-3.8 record / vow id when imported. */
  sourceId?: string;
  /** Free text (counterparty, vow text, or the user's own wording). */
  label: string;
  amount?: number;
  currency?: string;
  /** Count for qaza Salah / fasts. */
  count?: number;
  /** The user confirmed this line belongs in the will. */
  confirmed: boolean;
}

export interface WasiyyahTrustLine {
  id: string;
  sourceId?: string;
  counterparty: string;
  item?: string;
  amount?: number;
  currency?: string;
  confirmed: boolean;
}

export interface WasiyyahBequest {
  id: string;
  beneficiary: string;
  kind: "person" | "charity";
  /** Fixed amount in the will's currency… */
  amount?: number;
  /** …or a percentage (0–100) of the net estate after funeral and debts. */
  percent?: number;
  purpose?: string;
  /** The beneficiary is one of the testator's heirs (Abu Dawud 2870 / Tirmidhi 2120). */
  isHeir: boolean;
  heirType?: HeirType;
  /** The user acknowledged the "no bequest to an heir" warning. */
  heirAcknowledged?: boolean;
}

/** An illustrative NF-3.10 Mirath result attached to section 7 (optional). */
export interface MirathSnapshotRef {
  id: string;
  createdAt: string;
  school: MadhhabId | null;
  shares: Array<{ heir: HeirType; count: number; fraction: string }>;
}

export interface WasiyyahData {
  testator: { name: string /** YYYY-MM-DD */; date: string };
  funeral: {
    sunnahRites: boolean;
    muslimCemetery: boolean;
    avoidInnovations: boolean;
    notes?: string;
  };
  /** ISO 4217 code for the estate, funeral and bequest amounts. */
  currency: string;
  /** Estimated estate `E` (optional). */
  estimatedEstate?: number;
  funeralCost?: number;
  debts: WasiyyahDebtLine[];
  trusts: WasiyyahTrustLine[];
  bequests: WasiyyahBequest[];
  guardians: string[];
  executor?: string;
  mirathSnapshot?: MirathSnapshotRef;
  witnesses: [string, string];
  /** Print the user-locale text with English alongside. */
  sideBySideEnglish: boolean;
}

export interface WasiyyahVersion {
  id: string;
  createdAt: string;
  data: WasiyyahData;
}

/** Plan §NF-3.9 shape (assembled from the vault items for export). */
export interface WasiyyahDoc {
  versions: WasiyyahVersion[];
  currentId: string;
}

export interface WasiyyahSettings {
  /** Review reminder interval (default 12). */
  reviewIntervalMonths: number;
  /** ISO time of the last review (a saved version also counts). */
  lastReviewedAt?: string;
  /** Total of open "I owe" amounts when last reviewed (for the >20 % change nudge). */
  debtsSnapshot?: { total: number; currency: string };
  /** YYYY-MM-DD the >20 % debts change was first noticed (anchors the reminder). */
  debtsChangeNoticedOn?: string;
}

/** One vault item of the `wasiyyah` document. */
export type WasiyyahVaultItem =
  | { kind: "version"; createdAt: string; data: WasiyyahData }
  | { kind: "draft"; data: WasiyyahData }
  | ({ kind: "settings" } & WasiyyahSettings);
