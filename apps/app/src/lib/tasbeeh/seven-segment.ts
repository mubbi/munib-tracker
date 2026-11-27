/**
 * Seven-segment digits for the Clicker design (NF-3.19). Segment order is the
 * standard a–g: a top, b top-right, c bottom-right, d bottom, e bottom-left,
 * f top-left, g middle.
 */

export type SegmentMask = readonly [boolean, boolean, boolean, boolean, boolean, boolean, boolean];

const ON = true;
const __ = false;

const DIGITS: Record<string, SegmentMask> = {
  "0": [ON, ON, ON, ON, ON, ON, __],
  "1": [__, ON, ON, __, __, __, __],
  "2": [ON, ON, __, ON, ON, __, ON],
  "3": [ON, ON, ON, ON, __, __, ON],
  "4": [__, ON, ON, __, __, ON, ON],
  "5": [ON, __, ON, ON, __, ON, ON],
  "6": [ON, __, ON, ON, ON, ON, ON],
  "7": [ON, ON, ON, __, __, __, __],
  "8": [ON, ON, ON, ON, ON, ON, ON],
  "9": [ON, ON, ON, ON, __, ON, ON],
};

const BLANK: SegmentMask = [__, __, __, __, __, __, __];

/** Segments lit for one character (`" "` or anything unknown is blank). */
export function segmentsFor(char: string): SegmentMask {
  return DIGITS[char] ?? BLANK;
}

/**
 * Right-aligned LCD cells for a count: at least `minDigits` cells (blank, not
 * zero-padded, like a real tally counter), growing for larger counts.
 */
export function lcdCells(count: number, minDigits = 4): string[] {
  const text = String(Math.max(0, Math.floor(count)));
  const cells = Math.max(minDigits, text.length);
  return text.padStart(cells, " ").split("");
}

/**
 * Segment polygons for a cell of `width × height`, as SVG point strings in a–g
 * order. Slightly slanted bars with mitred ends, like a printed LCD.
 */
export function segmentPolygons(width: number, height: number): string[] {
  const t = Math.max(1, width * 0.16); // bar thickness
  const g = t * 0.18; // gap between bars
  const half = height / 2;
  const h = (x1: number, y: number, x2: number) => [
    [x1 + g, y],
    [x1 + g + t / 2, y - t / 2],
    [x2 - g - t / 2, y - t / 2],
    [x2 - g, y],
    [x2 - g - t / 2, y + t / 2],
    [x1 + g + t / 2, y + t / 2],
  ];
  const v = (x: number, y1: number, y2: number) => [
    [x, y1 + g],
    [x + t / 2, y1 + g + t / 2],
    [x + t / 2, y2 - g - t / 2],
    [x, y2 - g],
    [x - t / 2, y2 - g - t / 2],
    [x - t / 2, y1 + g + t / 2],
  ];
  const x0 = t / 2;
  const x1 = width - t / 2;
  const y0 = t / 2;
  const y2 = height - t / 2;
  const shapes = [
    h(x0, y0, x1), // a
    v(x1, y0, half), // b
    v(x1, half, y2), // c
    h(x0, y2, x1), // d
    v(x0, half, y2), // e
    v(x0, y0, half), // f
    h(x0, half, x1), // g
  ];
  return shapes.map((points) =>
    points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" "),
  );
}
