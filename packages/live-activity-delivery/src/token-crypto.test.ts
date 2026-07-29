import { describe, expect, it } from "vitest";
import {
  decryptActivityKitToken,
  encryptActivityKitToken,
  hashActivityKitToken,
  resolveActivityKitEncryptionKey,
} from "./token-crypto.js";
import { LiveActivityDeliveryError } from "./types.js";

describe("activity kit token crypto", () => {
  it("round-trips an ActivityKit push token", () => {
    const key = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });
    const token = "a".repeat(64);
    const encrypted = encryptActivityKitToken(token, key);
    expect(encrypted.startsWith("v1.")).toBe(true);
    expect(decryptActivityKitToken(encrypted, key)).toBe(token);
    expect(hashActivityKitToken(token)).toHaveLength(64);
  });

  it("rejects a non-32-byte encryption key", () => {
    expect(() =>
      resolveActivityKitEncryptionKey({
        encryptionKeyBase64: Buffer.from("too-short").toString("base64"),
        jwtSecret: "x",
      }),
    ).toThrow(LiveActivityDeliveryError);
  });
});
