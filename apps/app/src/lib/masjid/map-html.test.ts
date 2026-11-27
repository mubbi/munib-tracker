import {
  buildMasjidMapHtml,
  MAPLIBRE_VERSION,
  OPENFREEMAP_STYLE,
  parseMasjidMapMessage,
  scriptSafeJson,
} from "@/lib/masjid/map-html";

const INPUT = {
  me: { lat: 24.86, lon: 67.0 },
  masjids: [
    { key: "node/1", lat: 24.861, lon: 67.001, name: "Masjid Noor", home: true },
    { key: "way/2", lat: 24.862, lon: 67.002, name: "</script><img src=x onerror=alert(1)>" },
  ],
  dark: true,
  colors: {
    background: "#0B1A14",
    pin: "#2E9E6B",
    pinBorder: "#FFFFFF",
    home: "#D9A343",
    me: "#4C8FD9",
  },
  youLabel: "Your location",
};

describe("masjid map document", () => {
  it("pins MapLibre with SRI and uses keyless OpenFreeMap tiles for the theme", () => {
    const html = buildMasjidMapHtml(INPUT);
    expect(html).toContain(`maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`);
    expect(html.match(/integrity="sha384-[A-Za-z0-9+/=]+"/g)).toHaveLength(2);
    expect(html).toContain(OPENFREEMAP_STYLE.dark);
    expect(buildMasjidMapHtml({ ...INPUT, dark: false })).toContain(OPENFREEMAP_STYLE.light);
    expect(html).not.toMatch(/apiKey|key=/i);
  });

  it("sends every link (attribution credits) out of the map, not into it", () => {
    expect(buildMasjidMapHtml(INPUT)).toContain('<base target="_blank">');
  });

  it("can't be broken out of by an OSM name", () => {
    const html = buildMasjidMapHtml(INPUT);
    // Exactly the two script tags we wrote; the hostile name stays escaped JSON.
    expect(html.match(/<\/script>/g)).toHaveLength(2);
    expect(html).not.toContain("<img");
    expect(JSON.parse(scriptSafeJson({ name: "a</script>& b" }))).toEqual({
      name: "a</script>& b",
    });
  });

  it("drops colours that aren't plain hex/rgb", () => {
    const html = buildMasjidMapHtml({
      ...INPUT,
      colors: { ...INPUT.colors, pin: "red;}</style><script>alert(1)</script>" },
    });
    expect(html).not.toContain("red;}");
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("#2e9e6b");
  });

  it("accepts only the map's own message shapes", () => {
    expect(parseMasjidMapMessage('{"type":"select","key":"node/1"}')).toEqual({
      type: "select",
      key: "node/1",
    });
    expect(parseMasjidMapMessage('{"type":"select","key":null}')).toEqual({
      type: "select",
      key: null,
    });
    expect(parseMasjidMapMessage('{"type":"ready"}')).toEqual({ type: "ready" });
    expect(parseMasjidMapMessage('{"type":"navigate","url":"x"}')).toBeNull();
    expect(parseMasjidMapMessage("not json")).toBeNull();
    expect(parseMasjidMapMessage({ type: "ready" })).toBeNull();
  });
});
