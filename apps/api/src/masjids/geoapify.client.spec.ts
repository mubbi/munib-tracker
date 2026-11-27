import { parseOverpassDetail, parseOverpassSummaries } from "@munib-tracker/shared/masjid/osm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GeoapifyClient, GeoapifyError, geoapifyToOverpass } from "./geoapify.client";
import { GEOAPIFY_CREDITS_PER_CELL, geoapifyDailyCaps } from "./masjids-rate-limit";

/** Shape per the Geoapify Places OpenAPI examples: raw OSM tags + osm_id/osm_type (n|w|r). */
function feature(raw: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [67.0011, 24.8607] },
    properties: {
      lat: 24.8607,
      lon: 67.0011,
      categories: ["religion", "religion.place_of_worship", "religion.place_of_worship.islam"],
      datasource: {
        sourcename: "openstreetmap",
        attribution: "© OpenStreetMap contributors",
        license: "Open Database License",
        url: "https://www.openstreetmap.org/copyright",
        raw,
      },
      ...extra,
    },
  };
}

const COLLECTION = {
  type: "FeatureCollection",
  features: [
    feature({
      osm_id: 101,
      osm_type: "n",
      amenity: "place_of_worship",
      religion: "muslim",
      name: "Masjid Noor",
      "name:ar": "مسجد النور",
      service_times: "Fr 13:30",
      wheelchair: "yes",
      phone: "+92 21 1234567",
    }),
    // Tags trimmed by the provider: the Islamic category fills them in.
    feature({ osm_id: -202, osm_type: "w", name: "Jamia Masjid" }),
    // A conflicting religion is never overridden.
    feature({ osm_id: 303, osm_type: "n", amenity: "place_of_worship", religion: "christian" }),
    // Not from OSM / no ref → skipped.
    feature({ name: "No ref" }),
    { type: "Feature", properties: { name: "No datasource" } },
  ],
};

describe("geoapifyToOverpass", () => {
  it("maps features to Overpass elements the shared parsers accept", () => {
    const summaries = parseOverpassSummaries(geoapifyToOverpass(COLLECTION));
    expect(summaries.map((m) => `${m.osmType}/${m.osmId}`)).toEqual(["node/101", "way/202"]);
    expect(summaries[0]).toMatchObject({
      name: "Masjid Noor",
      names: { ar: "مسجد النور" },
      jumuah: ["13:30"],
      badges: ["wheelchair"],
      lat: 24.8607,
      lon: 67.0011,
    });
  });

  it("parses a Place Details response into a masjid detail", () => {
    const detail = parseOverpassDetail(
      geoapifyToOverpass({
        type: "FeatureCollection",
        features: [COLLECTION.features[0]],
      }),
    );
    expect(detail).toMatchObject({ osmType: "node", osmId: "101", phone: "+92 21 1234567" });
  });

  it("tolerates garbage", () => {
    expect(geoapifyToOverpass(null)).toEqual({ elements: [] });
    expect(geoapifyToOverpass({ features: "x" })).toEqual({ elements: [] });
  });

  it("drops features without an OSM ref and normalises the ones it keeps", () => {
    const { elements } = geoapifyToOverpass({
      features: [
        "not a feature",
        { properties: "x" },
        { properties: { datasource: { raw: "x" } } },
        feature({ osm_type: "x", osm_id: 1 }),
        feature({ osm_type: "n", osm_id: 0 }),
        feature({ osm_type: "n", osm_id: "1e400" }),
        // Signed way id (some datasets), string id, coordinates from geometry only.
        {
          geometry: { type: "Point", coordinates: [10.5, 20.25] },
          properties: {
            categories: ["tourism.sights.place_of_worship.mosque"],
            datasource: {
              raw: { osm_type: "way", osm_id: "-77", religion: "christian", levels: 2, bad: NaN },
            },
          },
        },
        // No usable geometry and no categories: kept, without coordinates or filled tags.
        {
          geometry: { type: "Polygon", coordinates: [] },
          properties: { lat: "1", datasource: { raw: { osm_type: "r", osm_id: 9 } } },
        },
      ],
    });
    expect(elements).toEqual([
      {
        type: "way",
        id: 77,
        lat: 20.25,
        lon: 10.5,
        // Categories fill gaps only — a conflicting `religion` is never overridden.
        tags: { religion: "christian", levels: "2", amenity: "place_of_worship" },
      },
      { type: "relation", id: 9, lat: undefined, lon: undefined, tags: {} },
    ]);
  });
});

describe("GeoapifyClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("is off without a key", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "");
    const client = new GeoapifyClient();
    expect(client.configured).toBe(false);
    await expect(
      client.listInBounds({ south: 1, west: 2, north: 3, east: 4 }),
    ).rejects.toBeInstanceOf(GeoapifyError);
  });

  it("asks for masjid categories inside the coarse box, nearest first", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(COLLECTION), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await new GeoapifyClient().listInBounds({
      south: 24.8,
      west: 66.9,
      north: 24.9,
      east: 67.1,
    });
    expect((response.elements as unknown[]).length).toBe(3);
    const url = new URL(String((fetchMock.mock.calls[0] as unknown as [string])[0]));
    expect(url.origin + url.pathname).toBe("https://api.geoapify.com/v2/places");
    expect(url.searchParams.get("categories")).toContain("religion.place_of_worship.islam");
    expect(url.searchParams.get("filter")).toBe("rect:66.900000,24.800000,67.100000,24.900000");
    expect(url.searchParams.get("bias")).toBe("proximity:67.000000,24.850000");
    expect(url.searchParams.get("apiKey")).toBe("test-key");
    // Credit cap: never more places than one worst-case cell is budgeted for.
    expect(Number(url.searchParams.get("limit"))).toBeLessThanOrEqual(
      GEOAPIFY_CREDITS_PER_CELL * 20,
    );
  });

  it("looks a place up by its OSM ref", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "test-key");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(COLLECTION), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await new GeoapifyClient().element("way", "202");
    const url = new URL(String((fetchMock.mock.calls[0] as unknown as [string])[0]));
    expect(url.pathname).toBe("/v2/place-details");
    expect(url.searchParams.get("osm_id")).toBe("202");
    expect(url.searchParams.get("osm_type")).toBe("w");
  });

  it("reports a rejected key without echoing the URL", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "secret-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 401 })),
    );
    const error = await new GeoapifyClient().element("node", "1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GeoapifyError);
    expect(String((error as Error).message)).not.toContain("secret-key");
  });

  it.each([
    ["a 403", () => new Response("no", { status: 403 }), "Geoapify rejected the API key", 403],
    ["a 5xx", () => new Response("down", { status: 503 }), "Geoapify responded 503", 503],
    [
      "a non-JSON body",
      () => new Response("<html>", { status: 200 }),
      "Geoapify returned a non-JSON body",
      undefined,
    ],
  ])("maps %s to a GeoapifyError", async (_label, respond, message, status) => {
    vi.stubEnv("GEOAPIFY_API_KEY", "k");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => respond()),
    );
    const error = await new GeoapifyClient().element("node", "1").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GeoapifyError);
    expect(error).toMatchObject({ message, status });
  });

  it("reports network failures and timeouts without the URL", async () => {
    vi.stubEnv("GEOAPIFY_API_KEY", "secret-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed: https://api.geoapify.com/?apiKey=secret-key");
      }),
    );
    const failed = await new GeoapifyClient().element("node", "1").catch((e: unknown) => e);
    expect(failed).toMatchObject({ name: "GeoapifyError", message: "Geoapify request failed" });

    vi.useFakeTimers();
    try {
      vi.stubGlobal(
        "fetch",
        vi.fn(
          (_url: string, init: RequestInit) =>
            new Promise((_resolve, reject) => {
              init.signal?.addEventListener("abort", () =>
                reject(new DOMException("aborted", "AbortError")),
              );
            }),
        ),
      );
      const pending = new GeoapifyClient().element("node", "1").catch((e: unknown) => e);
      await vi.advanceTimersByTimeAsync(8_000);
      expect(await pending).toMatchObject({ message: "Geoapify request timed out" });
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Geoapify credit budget", () => {
  it("fits the free plan's 3,000 credits with a margin", () => {
    const { cells, details } = geoapifyDailyCaps(3_000);
    expect(cells * GEOAPIFY_CREDITS_PER_CELL + details).toBeLessThanOrEqual(3_000 * 0.95);
    expect(cells).toBeGreaterThan(100);
  });
});
