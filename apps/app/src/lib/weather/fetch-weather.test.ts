import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { buildWeatherSnapshot } from "@/test-support/fixtures/weather";

import { fetchCurrentWeather, isWeatherCacheStale, isWeatherForLocation } from "./fetch-weather";
import { fetchMetNoWeather } from "./providers/met-no";
import { fetchOpenMeteoWeather } from "./providers/open-meteo";

const OPEN_METEO = {
  current: { temperature_2m: 21, weather_code: 3, wind_speed_10m: 30, cloud_cover: 80 },
};
const MET_NO = {
  properties: {
    timeseries: [
      {
        data: {
          instant: { details: { air_temperature: 18, wind_speed: 5 } },
          next_6_hours: { summary: { symbol_code: "lightrain_day" } },
        },
      },
    ],
  },
};

describe("fetchOpenMeteoWeather", () => {
  it("maps the current conditions", async () => {
    const fetchMock = mockFetch(fakeResponse(OPEN_METEO));
    expect(await fetchOpenMeteoWeather(24.8, 67)).toMatchObject({
      temperatureCelsius: 21,
      windSpeedKmh: 30,
      cloudCoverPercent: 80,
      condition: "cloudy",
      isWindy: true,
      provider: "open-meteo",
    });
    expect(String(fetchMock.mock.calls[0][0])).toContain("latitude=24.8");
  });

  it("defaults missing cloud cover to 0", async () => {
    mockFetch(fakeResponse({ current: { ...OPEN_METEO.current, cloud_cover: undefined } }));
    expect((await fetchOpenMeteoWeather(0, 0)).cloudCoverPercent).toBe(0);
  });

  it("rejects HTTP errors and incomplete responses", async () => {
    mockFetch(fakeResponse({}, { status: 500 }));
    await expect(fetchOpenMeteoWeather(0, 0)).rejects.toThrow("Open-Meteo responded with 500");
    mockFetch(fakeResponse({ current: { temperature_2m: 1 } }));
    await expect(fetchOpenMeteoWeather(0, 0)).rejects.toThrow("missing current weather fields");
  });
});

describe("fetchMetNoWeather", () => {
  it("maps m/s wind to km/h and the 6-hour symbol", async () => {
    const fetchMock = mockFetch(fakeResponse(MET_NO));
    expect(await fetchMetNoWeather(59.9, 10.7)).toMatchObject({
      temperatureCelsius: 18,
      windSpeedKmh: 18,
      cloudCoverPercent: 0,
      condition: "rain",
      isWindy: false,
      provider: "met-no",
    });
    expect(fetchMock.mock.calls[0][1]).toEqual({ headers: { "User-Agent": expect.any(String) } });
  });

  it("prefers the next-hour symbol and cloud fraction", async () => {
    const entry = MET_NO.properties.timeseries[0];
    mockFetch(
      fakeResponse({
        properties: {
          timeseries: [
            {
              data: {
                instant: { details: { ...entry.data.instant.details, cloud_area_fraction: 55 } },
                next_1_hours: { summary: { symbol_code: "clearsky_day" } },
              },
            },
          ],
        },
      }),
    );
    expect(await fetchMetNoWeather(0, 0)).toMatchObject({
      condition: "clear",
      cloudCoverPercent: 55,
    });
  });

  it("rejects HTTP errors and incomplete responses", async () => {
    mockFetch(fakeResponse({}, { status: 403 }));
    await expect(fetchMetNoWeather(0, 0)).rejects.toThrow("MET Norway responded with 403");
    mockFetch(fakeResponse({ properties: { timeseries: [] } }));
    await expect(fetchMetNoWeather(0, 0)).rejects.toThrow("missing current weather fields");
  });
});

describe("fetchCurrentWeather", () => {
  it("uses Open-Meteo first", async () => {
    mockFetch(fakeResponse(OPEN_METEO));
    expect((await fetchCurrentWeather(0, 0)).provider).toBe("open-meteo");
  });

  it("falls back to MET Norway", async () => {
    mockFetch(new Error("offline"), fakeResponse(MET_NO));
    expect((await fetchCurrentWeather(0, 0)).provider).toBe("met-no");
  });

  it("reports both provider failures", async () => {
    mockFetch(new Error("offline"), fakeResponse({}, { status: 503 }));
    await expect(fetchCurrentWeather(0, 0)).rejects.toThrow(
      "Weather providers failed (Open-Meteo: offline; MET Norway: MET Norway responded with 503)",
    );
  });
});

describe("fetchCurrentWeather non-Error failures", () => {
  it("stringifies thrown values", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockRejectedValueOnce("down").mockRejectedValueOnce("gone");
    await expect(fetchCurrentWeather(0, 0)).rejects.toThrow("(Open-Meteo: down; MET Norway: gone)");
  });
});

describe("cache helpers", () => {
  it("treats unparsable timestamps as stale", () => {
    expect(isWeatherCacheStale("nope")).toBe(true);
  });

  it("matches snapshots to rounded coordinates", () => {
    const snapshot = buildWeatherSnapshot({ latitude: 24.831, longitude: 67.071 });
    expect(isWeatherForLocation(snapshot, 24.829, 67.069)).toBe(true);
    expect(isWeatherForLocation(snapshot, 24.9, 67.07)).toBe(false);
  });
});
