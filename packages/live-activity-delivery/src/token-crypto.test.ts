import { describe, expect, it } from "vitest";
import {
  decryptActivityKitToken,
  encryptActivityKitToken,
  hashActivityKitToken,
  resolveActivityKitEncryptionKey,
} from "./token-crypto.js";
import { LiveActivityDeliveryError } from "./types.js";

const KEY = resolveActivityKitEncryptionKey({ jwtSecret: "test-secret" });

describe("activity kit token crypto", () => {
  it("round-trips an ActivityKit push token", () => {
    const token = "a".repeat(64);
    const encrypted = encryptActivityKitToken(token, KEY);
    expect(encrypted.startsWith("v1.")).toBe(true);
    expect(decryptActivityKitToken(encrypted, KEY)).toBe(token);
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

  it("accepts a valid base64 32-byte key verbatim", () => {
    const raw = Buffer.alloc(32, 7);

    const key = resolveActivityKitEncryptionKey({
      encryptionKeyBase64: `  ${raw.toString("base64")}  `,
      jwtSecret: "ignored",
    });

    expect(key.equals(raw)).toBe(true);
  });

  it.each(["   ", null, undefined])(
    "derives a 32-byte key from the JWT secret when the key is %j",
    (encryptionKeyBase64) => {
      const key = resolveActivityKitEncryptionKey({
        encryptionKeyBase64,
        jwtSecret: "test-secret",
      });

      expect(key.equals(KEY)).toBe(true);
      expect(key).toHaveLength(32);
    },
  );

  it.each(["v2.a.b.c", "v1.a.b", "garbage"])("rejects malformed stored token %s", (value) => {
    expect(() => decryptActivityKitToken(value, KEY)).toThrow(
      expect.objectContaining({ code: "INVALID_TOKEN" }),
    );
  });

  it("fails to decrypt with the wrong key", () => {
    const encrypted = encryptActivityKitToken("tok", KEY);
    const otherKey = resolveActivityKitEncryptionKey({ jwtSecret: "other" });

    expect(() => decryptActivityKitToken(encrypted, otherKey)).toThrow();
  });
});
