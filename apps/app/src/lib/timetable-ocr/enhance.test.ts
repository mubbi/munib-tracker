import { enhanceForOcr, isDarkBackground, otsuThreshold, type RgbaImage } from "./enhance";

/** A width × height RGBA image; `lit(x, y)` pixels get `on`, the rest `off`. */
function image(
  width: number,
  height: number,
  lit: (x: number, y: number) => boolean,
  on: [number, number, number],
  off: [number, number, number],
): RgbaImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = lit(x, y) ? on : off;
      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { data, width, height };
}

const pixel = (img: RgbaImage, x: number, y: number) => img.data[(y * img.width + x) * 4];

/** A 3-px-wide vertical bar at x 8–10, drawn as LED dots every 2 px. */
const dotBar = (x: number, y: number) => x >= 8 && x <= 10 && x % 2 === 0 && y % 2 === 0;

describe("timetable OCR enhancement (LED boards)", () => {
  it("splits a two-tone histogram between its tones", () => {
    const values = new Uint8Array([10, 10, 10, 200, 200]);
    const t = otsuThreshold(values);
    expect(t).toBeGreaterThanOrEqual(10);
    expect(t).toBeLessThan(200);
  });

  it("tells a bright-on-dark board from a paper sheet", () => {
    const board = new Uint8Array(100).map((_, i) => (i < 15 ? 230 : 20));
    const paper = new Uint8Array(100).map((_, i) => (i < 15 ? 20 : 230));
    expect(isDarkBackground(board)).toBe(true);
    expect(isDarkBackground(paper)).toBe(false);
  });

  it("leaves a light sheet alone unless forced", () => {
    const paper = image(20, 20, dotBar, [0, 0, 0], [250, 250, 250]);
    expect(enhanceForOcr(paper)).toBeNull();
    const forced = enhanceForOcr(paper, { force: true });
    // Forced: the dark ink becomes the black text.
    expect(forced && pixel(forced, 8, 0)).toBe(0);
    expect(forced && pixel(forced, 2, 2)).toBe(255);
  });

  it("turns coloured LED dots into black text on white, fused into a stroke", () => {
    // Red LEDs (brightest channel R) on a dark-green panel.
    const board = image(20, 20, dotBar, [240, 30, 20], [10, 60, 20]);
    const plain = enhanceForOcr(board);
    expect(plain).not.toBeNull();
    expect(plain && pixel(plain, 8, 0)).toBe(0);
    // Between two dots: still panel without fusing, text once dilated.
    expect(plain && pixel(plain, 9, 1)).toBe(255);
    const fused = enhanceForOcr(board, { dilate: 1 });
    expect(fused && pixel(fused, 9, 1)).toBe(0);
    expect(fused && pixel(fused, 2, 2)).toBe(255);
  });

  it("keeps only lit dots when the unlit matrix glows too", () => {
    // Lit dots 250, unlit matrix dots 120, panel 10.
    const data = image(20, 20, (x, y) => x % 2 === 0 && y % 2 === 0, [120, 0, 0], [10, 0, 0]);
    for (let y = 0; y < 20; y += 2) {
      const i = (y * 20 + 8) * 4;
      data.data[i] = 250;
    }
    const both = enhanceForOcr(data);
    const lit = enhanceForOcr(data, { litOnly: true });
    // A plain split keeps the unlit dot at (2, 2) as text; lit-only drops it.
    expect(both && pixel(both, 2, 2)).toBe(0);
    expect(lit && pixel(lit, 2, 2)).toBe(255);
    expect(lit && pixel(lit, 8, 2)).toBe(0);
  });
});
