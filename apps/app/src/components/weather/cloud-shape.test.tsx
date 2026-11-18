import { CloudGraphic } from "@/components/weather/cloud-graphic";
import {
  CLOUD_TONES,
  type CloudSize,
  cloudFrame,
  cloudPartColor,
  cloudPlacementsFor,
  cloudSeedRandom,
  generateCumulusCloud,
} from "@/components/weather/cloud-shape";
import { renderWithTheme } from "@/test-support/render";

describe("cloudSeedRandom", () => {
  it("is deterministic and within [0, 1)", () => {
    const value = cloudSeedRandom(7, 3);
    expect(value).toBe(cloudSeedRandom(7, 3));
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });
});

describe("cloudPartColor", () => {
  it.each([
    ["belly", CLOUD_TONES.storm.belly, 0.92],
    ["highlight", CLOUD_TONES.storm.highlight, 0.85],
    ["body", CLOUD_TONES.storm.fill, 1],
  ] as const)("shades %s puffs", (shade, fill, opacity) => {
    expect(cloudPartColor("storm", shade)).toEqual({ fill, opacity });
  });
});

describe("generateCumulusCloud", () => {
  it.each<[CloudSize, number]>([
    ["small", 4],
    ["medium", 5],
  ])("builds a %s cloud with %i parts", (size, count) => {
    expect(generateCumulusCloud(11, size)).toHaveLength(count);
  });

  it("adds shoulder puffs to large clouds, sorted by layer", () => {
    const counts = new Set(
      [1, 2, 3, 4, 5, 37, 52].map((s) => generateCumulusCloud(s, "large").length),
    );
    expect([...counts].every((n) => n === 6 || n === 7)).toBe(true);
    expect(counts.size).toBe(2);
    const layers = generateCumulusCloud(37, "large").map((p) => p.layer);
    expect(layers).toEqual([...layers].sort((a, b) => a - b));
  });
});

describe("cloudFrame", () => {
  it("pads the bounding box around every part", () => {
    const frame = cloudFrame(100, [
      { kind: "circle", cx: 0.5, cy: 0.5, r: 0.1, layer: 0, shade: "body" },
      { kind: "ellipse", cx: 0.5, cy: 0.5, r: 0.1, layer: 0, shade: "belly" },
    ]);
    expect(frame.width).toBeCloseTo(38);
    expect(frame.offsetX).toBeCloseTo(-31);
  });
});

describe("cloudPlacementsFor", () => {
  const base = { partlyCloudy: false, heavy: false, cloudy: false, baseOpacity: 1 };

  it.each([
    ["partly cloudy", { partlyCloudy: true }, [11, 23]],
    ["cloudy", { cloudy: true }, [11, 37, 52]],
    ["heavy", { heavy: true }, [37, 52]],
    ["default", {}, [11, 23]],
  ])("picks slots for %s skies", (_label, flags, ids) => {
    const placements = cloudPlacementsFor({ ...base, ...flags, baseOpacity: 0.5 });
    expect(placements.map((p) => p.id)).toEqual(ids);
    expect(placements[0].opacity).toBeLessThanOrEqual(0.5);
  });
});

describe("CloudGraphic", () => {
  it("draws circles and ellipses for each part", async () => {
    const parts = generateCumulusCloud(11, "medium");
    const frame = cloudFrame(120, parts);
    const { toJSON } = await renderWithTheme(
      <CloudGraphic baseWidth={120} parts={parts} variant="light" {...frame} />,
    );
    const json = JSON.stringify(toJSON());
    expect(json.match(/RNSVGEllipse/g)).toHaveLength(1);
    expect(json.match(/RNSVGCircle/g)).toHaveLength(parts.length - 1);
  });
});
