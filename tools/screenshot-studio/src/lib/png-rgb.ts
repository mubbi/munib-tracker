import { crc32, deflateSync, inflateSync } from "node:zlib";

// Browser canvases always encode RGBA PNGs, but App Store creative assets
// (product page header / search results) "can't include alpha channels or
// transparencies", and Play's feature graphic / TV banner reject transparency
// too. Re-encode 8-bit RGBA PNGs as opaque 8-bit RGB (composited over white,
// matching the exporter's backgroundColor). Anything else is returned as-is.

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function paeth(a: number, b: number, c: number) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData) >>> 0);
  return Buffer.concat([len, typeAndData, crc]);
}

/** Decode the RGBA scanlines of a non-interlaced 8-bit RGBA PNG, or null if it isn't one. */
function decodeRgba(png: Buffer): { width: number; height: number; pixels: Uint8Array } | null {
  if (png.length < 8 || !png.subarray(0, 8).equals(SIGNATURE)) return null;
  let off = 8;
  let width = 0;
  let height = 0;
  const idat: Buffer[] = [];
  while (off + 8 <= png.length) {
    const len = png.readUInt32BE(off);
    const type = png.toString("ascii", off + 4, off + 8);
    const data = png.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const bitDepth = data[8];
      const colorType = data[9];
      const interlace = data[12];
      if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) return null;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    off += 12 + len;
  }
  if (!width || !height || idat.length === 0) return null;

  const raw = inflateSync(Buffer.concat(idat));
  const bpp = 4;
  const stride = width * bpp;
  if (raw.length < (stride + 1) * height) return null;
  const pixels = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const src = y * (stride + 1) + 1;
    const dst = y * stride;
    const prev = dst - stride;
    for (let x = 0; x < stride; x++) {
      const cur = raw[src + x];
      const a = x >= bpp ? pixels[dst + x - bpp] : 0;
      const b = y > 0 ? pixels[prev + x] : 0;
      const c = x >= bpp && y > 0 ? pixels[prev + x - bpp] : 0;
      let v: number;
      switch (filter) {
        case 0:
          v = cur;
          break;
        case 1:
          v = cur + a;
          break;
        case 2:
          v = cur + b;
          break;
        case 3:
          v = cur + ((a + b) >> 1);
          break;
        case 4:
          v = cur + paeth(a, b, c);
          break;
        default:
          return null;
      }
      pixels[dst + x] = v & 0xff;
    }
  }
  return { width, height, pixels };
}

export function flattenPngAlpha(png: Buffer): Buffer {
  const decoded = decodeRgba(png);
  if (!decoded) return png;
  const { width, height, pixels } = decoded;

  // Composite over white and Paeth-filter each RGB scanline for compact output.
  const bpp = 3;
  const stride = width * bpp;
  const rgb = new Uint8Array(stride * height);
  for (let i = 0, j = 0; i < pixels.length; i += 4, j += 3) {
    const alpha = pixels[i + 3];
    if (alpha === 255) {
      rgb[j] = pixels[i];
      rgb[j + 1] = pixels[i + 1];
      rgb[j + 2] = pixels[i + 2];
    } else {
      const k = alpha / 255;
      const white = 255 * (1 - k);
      rgb[j] = Math.round(pixels[i] * k + white);
      rgb[j + 1] = Math.round(pixels[i + 1] * k + white);
      rgb[j + 2] = Math.round(pixels[i + 2] * k + white);
    }
  }
  const filtered = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const out = y * (stride + 1);
    const row = y * stride;
    filtered[out] = 4; // Paeth
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? rgb[row + x - bpp] : 0;
      const b = y > 0 ? rgb[row - stride + x] : 0;
      const c = x >= bpp && y > 0 ? rgb[row - stride + x - bpp] : 0;
      filtered[out + 1 + x] = (rgb[row + x] - paeth(a, b, c)) & 0xff;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour, no alpha
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(filtered, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
