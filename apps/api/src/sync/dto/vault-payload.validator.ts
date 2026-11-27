/**
 * Server-side guard for the E2E-encrypted vault entities (plan §4.2, D2).
 *
 * The server never sees vault plaintext: documents arrive as
 * `{ value: VaultEnvelope | null }` and the keyring as
 * `{ value: VaultKeyring | null }`. We only check the **shape** and the size
 * cap so the table can't be used as free-form storage — values are never
 * logged, echoed in error messages or inspected beyond these structural checks.
 */
export const VAULT_DOC_ENTITIES = [
  "vault_muhasabah",
  "vault_debts",
  "vault_wasiyyah",
  "vault_relatives",
  "vault_excused",
  "vault_khushu",
] as const;
export const VAULT_KEYRING_ENTITY = "vault_keyring";
export const VAULT_ENTITIES = [VAULT_KEYRING_ENTITY, ...VAULT_DOC_ENTITIES] as const;

/** Per-record cap on the serialized `data` payload (UTF-8 bytes). */
export const VAULT_MAX_RECORD_BYTES = 256 * 1024;

const ISO_RE = /^\d{4}-\d{2}-\d{2}T[0-9:.]+(Z|[+-]\d{2}:\d{2})$/;
const B64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const KEY_ID_RE = /^[0-9a-f]{16}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isB64(value: unknown, maxLength = Number.POSITIVE_INFINITY): boolean {
  return (
    typeof value === "string" &&
    value.length % 4 === 0 &&
    value.length <= maxLength &&
    B64_RE.test(value)
  );
}

/** `{ v: 1, alg: "A256GCM", keyId, iv, ct, updatedAt }` — nothing else. */
export function isVaultEnvelope(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    hasOnlyKeys(value, ["v", "alg", "keyId", "iv", "ct", "updatedAt"]) &&
    value.v === 1 &&
    value.alg === "A256GCM" &&
    typeof value.keyId === "string" &&
    KEY_ID_RE.test(value.keyId) &&
    isB64(value.iv, 16) &&
    isB64(value.ct) &&
    typeof value.updatedAt === "string" &&
    ISO_RE.test(value.updatedAt)
  );
}

function isWrappedKey(value: unknown): boolean {
  return (
    isRecord(value) &&
    hasOnlyKeys(value, ["iv", "ct"]) &&
    isB64(value.iv, 16) &&
    isB64(value.ct, 128)
  );
}

/** Optional per-copy stamp on the keyring's passphrase / recovery copies (each merges LWW on its own). */
function isOptionalIso(value: unknown): boolean {
  return value === undefined || (typeof value === "string" && ISO_RE.test(value));
}

function isBoundedInt(value: unknown, min: number, max: number): boolean {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

/** The sync keyring: two wrapped copies of the data key + KDF parameters. */
export function isVaultKeyring(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const { passphrase, recovery } = value;
  if (!isRecord(passphrase) || !isRecord(recovery) || !isRecord(passphrase.params)) return false;
  const params = passphrase.params;
  return (
    hasOnlyKeys(value, ["v", "keyId", "createdAt", "updatedAt", "passphrase", "recovery"]) &&
    value.v === 1 &&
    typeof value.keyId === "string" &&
    KEY_ID_RE.test(value.keyId) &&
    typeof value.createdAt === "string" &&
    ISO_RE.test(value.createdAt) &&
    typeof value.updatedAt === "string" &&
    ISO_RE.test(value.updatedAt) &&
    hasOnlyKeys(passphrase, ["kdf", "params", "salt", "wrapped", "updatedAt"]) &&
    isOptionalIso(passphrase.updatedAt) &&
    passphrase.kdf === "scrypt" &&
    hasOnlyKeys(params, ["N", "r", "p"]) &&
    isBoundedInt(params.N, 2 ** 14, 2 ** 20) &&
    ((params.N as number) & ((params.N as number) - 1)) === 0 &&
    isBoundedInt(params.r, 1, 16) &&
    isBoundedInt(params.p, 1, 4) &&
    isB64(passphrase.salt, 44) &&
    isWrappedKey(passphrase.wrapped) &&
    hasOnlyKeys(recovery, ["kdf", "salt", "wrapped", "updatedAt"]) &&
    isOptionalIso(recovery.updatedAt) &&
    recovery.kdf === "hkdf-sha256" &&
    isB64(recovery.salt, 44) &&
    isWrappedKey(recovery.wrapped)
  );
}

/** Validates `data` for vault entities; any other entity passes untouched. */
export function isValidVaultPayload(entity: unknown, data: unknown): boolean {
  if (typeof entity !== "string" || !(VAULT_ENTITIES as readonly string[]).includes(entity)) {
    return true;
  }
  if (!isRecord(data) || !hasOnlyKeys(data, ["value"]) || !("value" in data)) return false;
  let bytes: number;
  try {
    bytes = Buffer.byteLength(JSON.stringify(data), "utf8");
  } catch {
    return false;
  }
  if (bytes > VAULT_MAX_RECORD_BYTES) return false;
  // `null` = the device cleared its vault (blob deletions propagate as null).
  if (data.value === null) return true;
  return entity === VAULT_KEYRING_ENTITY ? isVaultKeyring(data.value) : isVaultEnvelope(data.value);
}
