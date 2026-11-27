/**
 * NF-3.12 image enhancement for LED / dot-matrix masjid boards (pure, no DOM).
 *
 * Tesseract is trained on solid strokes; an LED board's glyphs are grids of
 * separate coloured dots on a dark panel, so a plain read finds almost
 * nothing. This turns such a photo into dark, solid text on white:
 *
 * 1. brightness = max(R, G, B) — red, green, amber and purple LEDs all light up;
 * 2. polarity: a dark panel (bright text) is inverted later, a paper sheet is not;
 * 3. dilation of the lit dots (separable max filter) so neighbours fuse into strokes;
 * 4. Otsu threshold → black text on a white background.
 *
 * Works on RGBA pixels (canvas `ImageData` shape) so the web recogniser and the
 * evaluation scripts run the exact same code.
 */

export interface RgbaImage {
  /** `ArrayBuffer`-backed (what `getImageData` returns and `new ImageData()` takes). */
  data: Uint8ClampedArray<ArrayBuffer>;
  width: number;
  height: number;
}

export interface EnhanceOptions {
  /** Dilation radius in pixels (0 = none); fuses LED dots this far apart. */
  dilate?: number;
  /** Box-blur radius in pixels (0 = none): averages a dot grid into solid strokes. */
  blur?: number;
  /**
   * Second Otsu split inside the bright class: separates lit LED dots from the
   * unlit (but still glowing) dots of the matrix around them.
   */
  litOnly?: boolean;
  /** Skip the polarity check (a crop the user drew is always worth enhancing). */
  force?: boolean;
}

/** Brightness channel: the brightest of R, G, B. */
function brightness(image: RgbaImage): Uint8Array {
  const { data, width, height } = image;
  const out = new Uint8Array(width * height);
  for (let i = 0; i < out.length; i += 1) {
    const r = data[i * 4] ?? 0;
    const g = data[i * 4 + 1] ?? 0;
    const b = data[i * 4 + 2] ?? 0;
    out[i] = Math.max(r, g, b);
  }
  return out;
}

function histogram(values: Uint8Array): Uint32Array {
  const hist = new Uint32Array(256);
  for (const v of values) hist[v] = (hist[v] ?? 0) + 1;
  return hist;
}

/** Otsu's threshold: the grey level that best splits the histogram in two. */
export function otsuThreshold(values: Uint8Array): number {
  const hist = histogram(values);
  const total = values.length;
  let sum = 0;
  for (let i = 0; i < 256; i += 1) sum += i * (hist[i] ?? 0);
  let sumB = 0;
  let weightB = 0;
  let best = 0;
  let bestVar = -1;
  for (let t = 0; t < 256; t += 1) {
    weightB += hist[t] ?? 0;
    if (weightB === 0) continue;
    const weightF = total - weightB;
    if (weightF === 0) break;
    sumB += t * (hist[t] ?? 0);
    const meanB = sumB / weightB;
    const meanF = (sum - sumB) / weightF;
    const between = weightB * weightF * (meanB - meanF) ** 2;
    if (between > bestVar) {
      bestVar = between;
      best = t;
    }
  }
  return best;
}

/**
 * True when the text is the bright part: the pixels above the Otsu split are
 * the minority (LED boards, coloured panels, chalkboards). Paper sheets — dark
 * ink on a light page — have a bright majority.
 */
export function isDarkBackground(values: Uint8Array): boolean {
  if (values.length === 0) return false;
  const threshold = otsuThreshold(values);
  let bright = 0;
  for (const v of values) if (v > threshold) bright += 1;
  return bright / values.length < 0.45;
}

/** Separable box blur (mean filter) with a square window of `2r + 1`. */
function boxBlur(values: Uint8Array, width: number, height: number, r: number): Uint8Array {
  if (r <= 0) return values;
  const pass = (src: Uint8Array, horizontal: boolean): Uint8Array => {
    const out = new Uint8Array(src.length);
    const lines = horizontal ? height : width;
    const length = horizontal ? width : height;
    const at = (line: number, i: number) => (horizontal ? line * width + i : i * width + line);
    for (let line = 0; line < lines; line += 1) {
      let sum = 0;
      let count = 0;
      for (let i = 0; i <= Math.min(r, length - 1); i += 1) {
        sum += src[at(line, i)] ?? 0;
        count += 1;
      }
      for (let i = 0; i < length; i += 1) {
        out[at(line, i)] = Math.round(sum / count);
        const add = i + r + 1;
        const drop = i - r;
        if (add < length) {
          sum += src[at(line, add)] ?? 0;
          count += 1;
        }
        if (drop >= 0) {
          sum -= src[at(line, drop)] ?? 0;
          count -= 1;
        }
      }
    }
    return out;
  };
  return pass(pass(values, true), false);
}

/** Separable max filter (grey dilation) with a square window of `2r + 1`. */
function dilate(values: Uint8Array, width: number, height: number, r: number): Uint8Array {
  if (r <= 0) return values;
  const tmp = new Uint8Array(values.length);
  for (let y = 0; y < height; y += 1) {
    const row = y * width;
    for (let x = 0; x < width; x += 1) {
      let max = 0;
      const from = Math.max(0, x - r);
      const to = Math.min(width - 1, x + r);
      for (let k = from; k <= to; k += 1) {
        const v = values[row + k] ?? 0;
        if (v > max) max = v;
      }
      tmp[row + x] = max;
    }
  }
  const out = new Uint8Array(values.length);
  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      let max = 0;
      const from = Math.max(0, y - r);
      const to = Math.min(height - 1, y + r);
      for (let k = from; k <= to; k += 1) {
        const v = tmp[k * width + x] ?? 0;
        if (v > max) max = v;
      }
      out[y * width + x] = max;
    }
  }
  return out;
}

/**
 * Black-on-white binarised copy of a bright-on-dark board (LED dots fused).
 * Returns null for a light picture (a printed sheet): it reads best as is.
 */
export function enhanceForOcr(image: RgbaImage, options: EnhanceOptions = {}): RgbaImage | null {
  const { width, height } = image;
  const value = brightness(image);
  const dark = isDarkBackground(value);
  if (!dark && !options.force) return null;
  // A light crop (dark digits on paper) is flipped so the text is the bright part.
  const oriented = dark ? value : value.map((v) => 255 - v);
  const blurred = boxBlur(oriented, width, height, Math.round(options.blur ?? 0));
  const fused = dilate(blurred, width, height, Math.round(options.dilate ?? 0));
  let threshold = otsuThreshold(fused);
  if (options.litOnly) {
    const upper = fused.filter((v) => v > threshold);
    if (upper.length > 0) threshold = otsuThreshold(upper);
  }
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < fused.length; i += 1) {
    // Lit (text) → black, panel → white.
    const v = (fused[i] ?? 0) > threshold ? 0 : 255;
    data[i * 4] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  return { data, width, height };
}
