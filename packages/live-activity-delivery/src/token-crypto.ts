import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { LiveActivityDeliveryError } from "./types.js";

/** Derive a 32-byte AES key from an optional base64 secret, else JWT_SECRET. */
export function resolveActivityKitEncryptionKey(input: {
  encryptionKeyBase64?: string | null;
  jwtSecret: string;
}): Buffer {
  const encoded = input.encryptionKeyBase64?.trim();
  if (encoded) {
    const key = Buffer.from(encoded, "base64");
    if (key.length !== 32) {
      throw new LiveActivityDeliveryError(
        "ACTIVITYKIT_TOKEN_ENCRYPTION_KEY must be 32 bytes",
        "INVALID_KEY",
      );
    }
    return key;
  }
  return createHash("sha256").update(`activitykit:${input.jwtSecret}`).digest();
}

/** Encrypt an ActivityKit push token for at-rest storage (`v1.iv.tag.ciphertext`). */
export function encryptActivityKitToken(token: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return ["v1", iv, cipher.getAuthTag(), encrypted]
    .map((part) => (typeof part === "string" ? part : part.toString("base64url")))
    .join(".");
}

/** Decrypt a stored ActivityKit push token. */
export function decryptActivityKitToken(value: string, key: Buffer): string {
  const [version, iv, tag, encrypted] = value.split(".");
  if (version !== "v1" || !iv || !tag || !encrypted) {
    throw new LiveActivityDeliveryError("Stored ActivityKit token is invalid", "INVALID_TOKEN");
  }
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function hashActivityKitToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
