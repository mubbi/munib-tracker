import { searchLocations } from "@/lib/location";

const KARACHI = {
  id: 1174872,
  name: "Karachi",
  latitude: 24.8608,
  longitude: 67.0011,
  country: "Pakistan",
  country_code: "PK",
  admin1: "Sindh",
};

function mockFetchOnce(value: unknown, ok = true) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok,
    json: async () => value,
  });
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("searchLocations", () => {
  it("skips the network for queries shorter than two characters", async () => {
    const fetchMock = mockFetchOnce({ results: [] });
    expect(await searchLocations("k")).toEqual([]);
    expect(await searchLocations("  ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps geocoder rows into display-ready results", async () => {
    mockFetchOnce({ results: [KARACHI] });
    const [result] = await searchLocations("karachi");
    expect(result).toEqual({
      id: "1174872",
      name: "Karachi",
      admin: "Sindh",
      country: "Pakistan",
      latitude: 24.8608,
      longitude: 67.0011,
      label: "Karachi, Pakistan",
    });
  });

  it("drops the region when it merely repeats the city name", async () => {
    mockFetchOnce({ results: [{ ...KARACHI, name: "Sindh", admin1: "Sindh" }] });
    const [result] = await searchLocations("sindh");
    expect(result.admin).toBeUndefined();
  });

  it("encodes the query and requests up to ten results", async () => {
    const fetchMock = mockFetchOnce({ results: [] });
    await searchLocations("São Paulo");
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("name=S%C3%A3o%20Paulo");
    expect(url).toContain("count=10");
  });

  it("returns [] on a non-ok response", async () => {
    mockFetchOnce({}, false);
    expect(await searchLocations("karachi")).toEqual([]);
  });

  it("returns [] when the request throws (offline / aborted)", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network")) as unknown as typeof fetch;
    expect(await searchLocations("karachi")).toEqual([]);
  });

  it("tolerates a payload with no results array", async () => {
    mockFetchOnce({});
    expect(await searchLocations("zzzzzz")).toEqual([]);
  });
});
