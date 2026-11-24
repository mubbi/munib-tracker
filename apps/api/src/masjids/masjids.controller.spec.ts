import { HttpException, ValidationPipe } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildRequest, buildResponse } from "../test-support/http";
import { MasjidDetailParamsDto, MasjidListQueryDto } from "./dto/masjid.dto";
import { MasjidsController } from "./masjids.controller";
import type { MasjidsService } from "./masjids.service";
import { resetMasjidRateLimits } from "./masjids-rate-limit";
import { OVERPASS_USER_AGENT, OverpassClient } from "./overpass.client";
import { isConfidentMatch, nameSimilarity } from "./timetable-source";

vi.mock("../redis/redisClient", () => ({ getRedisClient: () => null }));

const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

function setup(stale = false) {
  const service = {
    list: vi.fn().mockResolvedValue({ masjids: [], attribution: ["osm"], stale }),
    detail: vi
      .fn()
      .mockResolvedValue({ osmType: "node", osmId: "1", lat: 1, lon: 1, attribution: [], stale }),
  };
  const controller = new MasjidsController(service as unknown as MasjidsService);
  return { service, controller, res: buildResponse() };
}

describe("MasjidsController", () => {
  beforeEach(() => resetMasjidRateLimits());

  it("lists a cell with a public cache header", async () => {
    const { controller, service, res } = setup();
    await controller.list({ cell: "gcpvj" }, buildRequest({ ip: "1.2.3.4" }), res);
    expect(service.list).toHaveBeenCalledWith("gcpvj", "1.2.3.4");
    expect(res.headers.get("cache-control")).toContain("public");
  });

  it("does not cache stale responses", async () => {
    const { controller, res } = setup(true);
    await controller.list({ cell: "gcpvj" }, buildRequest({ ip: "1.2.3.4" }), res);
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("rate-limits a client after 60 list calls in the window", async () => {
    const { controller, res } = setup();
    const req = buildRequest({ headers: { "x-forwarded-for": "9.9.9.9, 10.0.0.1" } });
    for (let i = 0; i < 60; i += 1) await controller.list({ cell: "gcpvj" }, req, res);
    await expect(controller.list({ cell: "gcpvj" }, req, res)).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it("can't dodge the per-client limit by spoofing the first X-Forwarded-For hop", async () => {
    const { controller, res } = setup();
    const spoofed = (i: number) =>
      buildRequest({ headers: { "x-forwarded-for": `203.0.113.${i}, 10.0.0.7` } });
    for (let i = 0; i < 60; i += 1) await controller.list({ cell: "gcpvj" }, spoofed(i), res);
    await expect(controller.list({ cell: "gcpvj" }, spoofed(99), res)).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it("forwards detail params", async () => {
    const { controller, service, res } = setup();
    await controller.detail({ osmType: "way", osmId: "42" }, buildRequest({ ip: "1.1.1.1" }), res);
    expect(service.detail).toHaveBeenCalledWith("way", "42", "1.1.1.1");
  });

  it.each([["gcpv"], ["gcpvja"], ["GCPVJ"], ["gcpva"], ["51.5,-0.1"]])(
    "rejects a non-geohash-5 cell %s (no precise coordinates accepted)",
    async (cell) => {
      await expect(
        pipe.transform({ cell }, { type: "query", metatype: MasjidListQueryDto }),
      ).rejects.toBeDefined();
    },
  );

  it("rejects extra query fields such as coordinates", async () => {
    await expect(
      pipe.transform(
        { cell: "gcpvj", lat: "51.5" },
        { type: "query", metatype: MasjidListQueryDto },
      ),
    ).rejects.toBeDefined();
  });

  it.each([
    [{ osmType: "area", osmId: "1" }],
    [{ osmType: "node", osmId: "0" }],
    [{ osmType: "node", osmId: "1;DROP" }],
  ])("rejects invalid detail params %j", async (params) => {
    await expect(
      pipe.transform(params, { type: "param", metatype: MasjidDetailParamsDto }),
    ).rejects.toBeDefined();
  });
});

describe("OverpassClient", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("POSTs the query with an identifying, generic User-Agent", async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ elements: [] }), { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(new OverpassClient().query("[out:json];node(1);out;")).resolves.toEqual({
      elements: [],
    });
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers["User-Agent"]).toBe(OVERPASS_USER_AGENT);
    expect(OVERPASS_USER_AGENT).not.toMatch(/@/);
    expect(String(init.body)).toContain("data=");
  });

  it("throws on non-2xx", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("busy", { status: 429 })),
    );
    await expect(new OverpassClient().query("x")).rejects.toThrow("429");
  });
});

describe("timetable source matching", () => {
  it("never guesses a match", () => {
    expect(nameSimilarity("Masjid Al-Noor", "Al Noor Mosque")).toBe(1);
    expect(isConfidentMatch({ nameA: "Noor", nameB: "Noor", distanceMeters: 76 })).toBe(false);
    expect(isConfidentMatch({ nameA: "Noor", nameB: "Huda", distanceMeters: 10 })).toBe(false);
    expect(
      isConfidentMatch({ nameA: "East London", nameB: "East London", distanceMeters: 20 }),
    ).toBe(true);
    expect(isConfidentMatch({ explicitIdLink: true })).toBe(true);
    expect(isConfidentMatch({ nameA: "x" })).toBe(false);
  });
});
