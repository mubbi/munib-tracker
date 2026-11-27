/**
 * Masjid finder & layer types (NF-3.11, D5). Public OSM types live in the
 * self-contained `masjid/osm.ts` (shared with the API); this file adds the
 * user's own home-masjid types. Private iqamah times never leave the user's
 * devices except through their own account sync.
 */
import type { IqamahDaily, JumuahSlot, MasjidOsmType } from "../masjid/osm";

export type {
  GeohashBounds,
  IqamahDaily,
  IqamahTimetable,
  IqamahTimetableSource,
  JumuahSlot,
  MasjidAddress,
  MasjidBadge,
  MasjidDetail,
  MasjidDetailResponse,
  MasjidListResponse,
  MasjidOsmType,
  MasjidPrayer,
  MasjidSummary,
  WallClockTime,
} from "../masjid/osm";
export {
  MASJID_OSM_TYPES,
  OSM_ATTRIBUTION,
  OSM_COPYRIGHT_URL,
  OSM_LICENCE,
} from "../masjid/osm";

/** `UserPreferences.homeMasjid` — the user's own choice (account-synced with prefs). */
export interface HomeMasjid {
  osmType: MasjidOsmType;
  osmId: string;
  name?: string;
  lat: number;
  lon: number;
}

/**
 * The user's private times for one masjid ("Your times"). Stored in blob entity
 * `home_masjid_times`, keyed by `masjidKey`; never sent to the masjids API.
 */
export interface PrivateMasjidTimes {
  daily?: IqamahDaily;
  monthly?: Record<string, IqamahDaily>;
  jumuah?: JumuahSlot[];
  /** How the times were entered (NF-3.12 writes `ocr`). */
  origin?: "manual" | "ocr";
  updatedAt: string;
}

export type PrivateMasjidTimesMap = Record<string, PrivateMasjidTimes>;
