import { beforeEach, describe, expect, it } from "vitest";

import {
  deleteTvPairing,
  formatTvPairingCode,
  generateTvPairingCode,
  loadTvPairing,
  normalizeTvPairingCode,
  resetTvPairingMemory,
  saveTvPairing,
} from "./tv-pairing-store";

describe("tv-pairing-store", () => {
  beforeEach(() => {
    resetTvPairingMemory();
  });

  it("generates unambiguous 8-character codes", () => {
    const code = generateTvPairingCode();
    expect(code).toHaveLength(8);
    expect(code).toMatch(/^[A-Z2-9]+$/);
    expect(code).not.toMatch(/[01IO]/);
  });

  it("formats and normalizes codes", () => {
    expect(formatTvPairingCode("abcd1234")).toBe("ABCD-1234");
    expect(normalizeTvPairingCode("ab-cd 12-34")).toBe("ABCD1234");
  });

  it("round-trips pending records in memory", async () => {
    const code = "ABCD2345";
    await saveTvPairing(code, { status: "pending", createdAt: Date.now() });
    const loaded = await loadTvPairing(code);
    expect(loaded?.status).toBe("pending");
    await deleteTvPairing(code);
    expect(await loadTvPairing(code)).toBeNull();
  });
});
