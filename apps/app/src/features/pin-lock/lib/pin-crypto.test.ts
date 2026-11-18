import { webcrypto } from "node:crypto";

import {
  hashPin,
  normalizePin,
  PIN_LENGTH,
  verifyPinHash,
} from "@/features/pin-lock/lib/pin-crypto";

jest.mock("expo-crypto", () => ({
  getRandomBytesAsync: jest.fn(async (n: number) => Uint8Array.from({ length: n }, (_, i) => i)),
}));

// Node's Web Crypto backs `crypto.subtle` so PBKDF2 runs for real (no RN polyfill).
if (typeof globalThis.crypto?.subtle === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    writable: true,
    value: webcrypto,
  });
}

/** Swaps the last hex digit so the digest keeps its length but no longer matches. */
function tamperDigest(stored: string): string {
  const last = stored.at(-1) === "0" ? "1" : "0";
  return `${stored.slice(0, -1)}${last}`;
}

describe("pinCrypto", () => {
  it("normalizes separators out of a 6-digit PIN", () => {
    expect(PIN_LENGTH).toBe(6);
    expect(normalizePin("12-34-56")).toBe("123456");
  });

  it("rejects hashing an invalid PIN", async () => {
    await expect(hashPin("123")).rejects.toThrow("PIN must be 6 digits");
  });

  it("hashes in the PIN4 PBKDF2 format", async () => {
    await expect(hashPin("123456")).resolves.toMatch(/^PIN4:[0-9a-f]{32}:150000:[0-9a-f]{64}$/);
  });

  it("verifies the PIN it hashed", async () => {
    const stored = await hashPin("123456");
    await expect(verifyPinHash("123456", stored)).resolves.toBe(true);
  });

  it("rejects a different PIN", async () => {
    const stored = await hashPin("123456");
    await expect(verifyPinHash("654321", stored)).resolves.toBe(false);
  });

  it("rejects an equal-length digest that differs", async () => {
    const stored = await hashPin("111111");
    await expect(verifyPinHash("111111", tamperDigest(stored))).resolves.toBe(false);
  });

  it.each([
    ["an invalid PIN", "12", "PIN4:aa:1:bb"],
    ["an unknown prefix", "123456", "LEGACY:aa:1:bb"],
    ["an empty payload", "123456", "PIN4:"],
    ["a non-numeric iteration count", "123456", "PIN4:aabb:notanumber:cc"],
    ["a missing digest", "123456", "PIN4:aabb:10"],
    ["a failing derivation (0 iterations)", "123456", "PIN4:aabb:0:cc"],
    ["a digest of the wrong length", "123456", "PIN4:aabb:1:cc"],
  ])("returns false for %s", async (_case, pin, stored) => {
    await expect(verifyPinHash(pin, stored)).resolves.toBe(false);
  });
});
