/**
 * Dependency-free byte encodings for the vault. Hand-rolled so the same code
 * runs on Hermes, browsers and Jest without relying on `atob`/`btoa`/`Buffer`
 * or `TextDecoder` being present.
 */

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_LOOKUP: Record<string, number> = Object.fromEntries(
  [...B64].map((char, index) => [char, index]),
);

export function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] ?? 0;
    const b = bytes[i + 1] ?? 0;
    const c = bytes[i + 2] ?? 0;
    const triple = (a << 16) | (b << 8) | c;
    out += B64[(triple >> 18) & 63];
    out += B64[(triple >> 12) & 63];
    out += i + 1 < bytes.length ? B64[(triple >> 6) & 63] : "=";
    out += i + 2 < bytes.length ? B64[triple & 63] : "=";
  }
  return out;
}

/** Throws `TypeError` on anything that isn't canonical padded base64. */
export function base64ToBytes(value: string): Uint8Array {
  if (value.length % 4 !== 0) throw new TypeError("invalid base64");
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  const out = new Uint8Array((value.length / 4) * 3 - padding);
  let o = 0;
  for (let i = 0; i < value.length; i += 4) {
    let triple = 0;
    for (let j = 0; j < 4; j += 1) {
      const char = value[i + j] as string;
      const isPad = char === "=" && i + j >= value.length - padding;
      const digit = isPad ? 0 : B64_LOOKUP[char];
      if (digit === undefined) throw new TypeError("invalid base64");
      triple = (triple << 6) | digit;
    }
    if (o < out.length) out[o++] = (triple >> 16) & 255;
    if (o < out.length) out[o++] = (triple >> 8) & 255;
    if (o < out.length) out[o++] = triple & 255;
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) out += byte.toString(16).padStart(2, "0");
  return out;
}

export function utf8Encode(value: string): Uint8Array {
  const out: number[] = [];
  for (const char of value) {
    let code = char.codePointAt(0) ?? 0;
    if (code >= 0xd800 && code <= 0xdfff) code = 0xfffd; // lone surrogate
    if (code < 0x80) out.push(code);
    else if (code < 0x800) out.push(0xc0 | (code >> 6), 0x80 | (code & 63));
    else if (code < 0x10000)
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 63), 0x80 | (code & 63));
    else
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 63),
        0x80 | ((code >> 6) & 63),
        0x80 | (code & 63),
      );
  }
  return Uint8Array.from(out);
}

/** Strict decoder — malformed sequences throw (decrypted vault JSON is always well-formed). */
export function utf8Decode(bytes: Uint8Array): string {
  let out = "";
  let i = 0;
  const cont = (index: number): number => {
    const byte = bytes[index];
    if (byte === undefined || (byte & 0xc0) !== 0x80) throw new TypeError("invalid utf-8");
    return byte & 63;
  };
  while (i < bytes.length) {
    const lead = bytes[i] as number;
    let code: number;
    if (lead < 0x80) {
      code = lead;
      i += 1;
    } else if ((lead & 0xe0) === 0xc0) {
      code = ((lead & 31) << 6) | cont(i + 1);
      i += 2;
    } else if ((lead & 0xf0) === 0xe0) {
      code = ((lead & 15) << 12) | (cont(i + 1) << 6) | cont(i + 2);
      i += 3;
    } else if ((lead & 0xf8) === 0xf0) {
      code = ((lead & 7) << 18) | (cont(i + 1) << 12) | (cont(i + 2) << 6) | cont(i + 3);
      i += 4;
    } else {
      throw new TypeError("invalid utf-8");
    }
    out += String.fromCodePoint(code);
  }
  return out;
}

/** Best-effort zeroing of transient key material. */
export function wipeBytes(bytes: Uint8Array | null | undefined): void {
  bytes?.fill(0);
}
