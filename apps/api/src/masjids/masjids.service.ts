import {
  boundsOfCells,
  buildOverpassBboxQuery,
  buildOverpassElementQuery,
  geohashWithNeighbours,
  type MasjidDetail,
  type MasjidDetailResponse,
  type MasjidListResponse,
  type MasjidOsmType,
  type MasjidSummary,
  OSM_ATTRIBUTION,
  OSM_COPYRIGHT_URL,
  OSM_LICENCE,
  parseOverpassDetail,
  parseOverpassSummaries,
} from "@munib-tracker/shared/masjid/osm";
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
  ServiceUnavailableException,
} from "@nestjs/common";
import {
  type CachedEntry,
  isFresh,
  isKnownMasjidRef,
  isUsableStale,
  masjidCellKey,
  masjidElementKey,
  readEntry,
  rememberMasjidRefs,
  tryLock,
  unlock,
  writeEntry,
} from "./masjids-cache";
import { spendUpstreamBudget, type UpstreamCall } from "./masjids-rate-limit";
import { OverpassClient } from "./overpass.client";
import {
  TIMETABLE_SOURCES,
  TIMETABLE_SOURCES_TOKEN,
  type TimetableSource,
} from "./timetable-source";

/** ODbL attribution returned with every response (the app shows it on every list/detail screen). */
export const OSM_ATTRIBUTION_LINES: readonly string[] = [
  `${OSM_ATTRIBUTION} (${OSM_LICENCE}) ${OSM_COPYRIGHT_URL}`,
];

/** How long a request waits for another instance's in-flight fetch before serving stale/empty. */
const PEER_WAIT_MS = 600;
const PEER_WAIT_ATTEMPTS = 3;

type Fetched<T> = { value: T; stale: boolean } | null;

/** Who a cold miss is charged to, and which upstream budget it spends. */
interface UpstreamCharge {
  /** Client IP (hashed inside the rate limiter, never logged); null = internal caller. */
  client: string | null;
  call: (previous: CachedEntry<unknown> | null) => Promise<UpstreamCall> | UpstreamCall;
}

/**
 * Read-only OpenStreetMap proxy + cache (NF-3.11, D5). No user data: requests
 * carry only a geohash-5 cell or an OSM ref, nothing is persisted in Postgres,
 * and nothing about the request (cell, ref, IP) is logged.
 */
@Injectable()
export class MasjidsService {
  private readonly logger = new Logger(MasjidsService.name);
  private readonly inflight = new Map<string, Promise<unknown>>();

  constructor(
    private readonly overpass: OverpassClient,
    @Optional()
    @Inject(TIMETABLE_SOURCES_TOKEN)
    private readonly sources: readonly TimetableSource[] = TIMETABLE_SOURCES,
  ) {}

  async list(cell: string, client: string | null = null): Promise<MasjidListResponse> {
    const cells = geohashWithNeighbours(cell);
    const result = await this.cached<MasjidSummary[]>(
      masjidCellKey(cell),
      async () => {
        const masjids = parseOverpassSummaries(
          await this.overpass.query(buildOverpassBboxQuery(boundsOfCells(cells))),
        );
        await rememberMasjidRefs(masjids);
        return masjids;
      },
      { client, call: () => "cell" },
    );
    return {
      masjids: result?.value ?? [],
      attribution: [...OSM_ATTRIBUTION_LINES],
      stale: result ? result.stale : true,
    };
  }

  /**
   * One masjid's details. A ref a cached cell listed (or one fetched before)
   * spends the detail budget; any other id is unverified and spends a much
   * smaller one, so looping over random ids can't drain Overpass. Misses
   * (not a masjid) are cached too.
   */
  async detail(
    osmType: MasjidOsmType,
    osmId: string,
    client: string | null = null,
  ): Promise<MasjidDetailResponse> {
    const result = await this.cached<MasjidDetail | null>(
      masjidElementKey(osmType, osmId),
      async () =>
        parseOverpassDetail(await this.overpass.query(buildOverpassElementQuery(osmType, osmId))),
      {
        client,
        call: async (previous) =>
          previous || (await isKnownMasjidRef(osmType, osmId)) ? "detail" : "unverifiedDetail",
      },
    );
    if (!result) throw new ServiceUnavailableException("Masjid data is temporarily unavailable");
    if (!result.value) throw new NotFoundException("Masjid not found");
    const detail: MasjidDetailResponse = {
      ...result.value,
      attribution: [...OSM_ATTRIBUTION_LINES],
      stale: result.stale,
    };
    const timetable = await this.publicTimetable(result.value);
    if (timetable) {
      detail.timetable = timetable.timetable;
      detail.attribution.push(timetable.attribution);
    }
    return detail;
  }

  /** First licence-cleared source that returns a confident match (registry is empty today). */
  private async publicTimetable(masjid: MasjidDetail) {
    if (!masjid.name) return null;
    for (const source of this.sources) {
      try {
        const timetable = await source.fetch({
          osmId: `${masjid.osmType}/${masjid.osmId}`,
          lat: masjid.lat,
          lon: masjid.lon,
          name: masjid.name,
        });
        if (timetable) return { timetable, attribution: source.attribution };
      } catch {
        this.logger.warn(`Timetable source ${source.id} failed`);
      }
    }
    return null;
  }

  /**
   * Fresh cache → served. Cold/expired → one fetch per key (in-process dedupe +
   * cross-instance lock, upstream budget). Upstream failure → stale data up to
   * 30 days old, flagged `stale`; nothing usable → null.
   */
  private async cached<T>(
    key: string,
    fetcher: () => Promise<T>,
    charge: UpstreamCharge,
  ): Promise<Fetched<T>> {
    const cachedEntry = await readEntry<T>(key);
    if (isFresh(cachedEntry)) return { value: (cachedEntry as CachedEntry<T>).value, stale: false };

    const existing = this.inflight.get(key) as Promise<Fetched<T>> | undefined;
    if (existing) return existing;

    const run = this.refresh(key, fetcher, cachedEntry, charge).finally(() => {
      this.inflight.delete(key);
    });
    this.inflight.set(key, run);
    return run;
  }

  private async refresh<T>(
    key: string,
    fetcher: () => Promise<T>,
    previous: CachedEntry<T> | null,
    charge: UpstreamCharge,
  ): Promise<Fetched<T>> {
    const fallback = (): Fetched<T> =>
      previous && isUsableStale(previous) ? { value: previous.value, stale: true } : null;

    if (!(await tryLock(key))) {
      for (let attempt = 0; attempt < PEER_WAIT_ATTEMPTS; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, PEER_WAIT_MS));
        const peer = await readEntry<T>(key);
        if (isFresh(peer)) return { value: (peer as CachedEntry<T>).value, stale: false };
      }
      return fallback();
    }

    try {
      // Per-client share first: a client over it gets cache-only answers and
      // never touches the shared budget.
      const spent = await spendUpstreamBudget(await charge.call(previous), charge.client);
      if (spent) {
        this.logger.warn(
          spent === "client"
            ? "Client's Overpass share reached; serving cached data"
            : "Overpass budget reached; serving cached data",
        );
        return fallback();
      }
      const value = await fetcher();
      await writeEntry(key, value);
      return { value, stale: false };
    } catch (error) {
      // Never log the cell/ref — only the failure class.
      this.logger.warn(
        `Overpass fetch failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      return fallback();
    } finally {
      await unlock(key);
    }
  }
}
