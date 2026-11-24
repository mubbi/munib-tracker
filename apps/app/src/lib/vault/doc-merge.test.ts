import {
  deleteItem,
  emptyVaultDoc,
  liveItems,
  mergeVaultDocs,
  pruneTombstones,
  putItem,
  type VaultDoc,
  vaultDocsEqual,
} from "./doc-merge";
import { base64ToBytes, bytesToBase64, utf8Decode, utf8Encode } from "./encoding";
import { VaultError, vaultErrorI18nKey } from "./errors";
import { assessPassphrase } from "./passphrase-strength";

const T0 = "2026-01-01T00:00:00.000Z";
const T1 = "2026-01-02T00:00:00.000Z";

type Note = { text: string };

describe("mergeVaultDocs", () => {
  it("is commutative and idempotent", () => {
    const a = putItem(
      putItem(emptyVaultDoc<Note>(), "x", { text: "a" }, T1),
      "y",
      { text: "a" },
      T0,
    );
    const b = deleteItem(putItem(emptyVaultDoc<Note>(), "y", { text: "b" }, T0), "y", T1);
    const ab = mergeVaultDocs(a, b);
    expect(vaultDocsEqual(ab, mergeVaultDocs(b, a))).toBe(true);
    expect(vaultDocsEqual(mergeVaultDocs(ab, ab), ab)).toBe(true);
    expect(liveItems(ab).map((i) => i.id)).toEqual(["x"]);
  });

  it("lets a tombstone win a same-timestamp tie and strips the deleted payload", () => {
    const live = putItem(emptyVaultDoc<Note>(), "x", { text: "secret" }, T1);
    const gone = deleteItem(live, "x", T1);
    expect(mergeVaultDocs(live, gone).items.x?.deletedAt).toBe(T1);
    expect(JSON.stringify(gone)).not.toContain("secret");
  });

  it("prunes tombstones older than the TTL only", () => {
    const longAgo = "2025-01-01T00:00:00.000Z";
    let doc: VaultDoc<Note> = putItem(emptyVaultDoc<Note>(), "old", { text: "" }, longAgo);
    doc = deleteItem(doc, "old", longAgo);
    doc = deleteItem(putItem(doc, "new", { text: "" }, T1), "new", T1);
    const pruned = pruneTombstones(doc, new Date("2026-03-01T00:00:00.000Z"), 180);
    expect(Object.keys(pruned.items)).toEqual(["new"]);
  });
});

describe("encoding", () => {
  it("round-trips base64 and UTF-8 (Arabic, emoji)", () => {
    const text = "الحمد لله — ✓ 🌙";
    const bytes = utf8Encode(text);
    expect(utf8Decode(bytes)).toBe(text);
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
    expect(bytesToBase64(utf8Encode("ab"))).toBe("YWI=");
    expect(() => base64ToBytes("abc")).toThrow();
  });
});

describe("errors", () => {
  it("maps codes to vault.errors.* keys and never carries content", () => {
    expect(vaultErrorI18nKey(new VaultError("vault-wrong-passphrase"))).toBe(
      "vault.errors.wrongPassphrase",
    );
    expect(vaultErrorI18nKey(new Error("boom"))).toBe("vault.errors.unavailable");
    expect(new VaultError("vault-corrupt").message).toBe("vault-corrupt");
  });
});

describe("assessPassphrase", () => {
  it("requires 10 characters and grades variety", () => {
    expect(assessPassphrase("short").strength).toBe("tooShort");
    expect(assessPassphrase("aaaaaaaaaaaa").score).toBe(1);
    expect(assessPassphrase("bismillah123").score).toBe(1);
    expect(assessPassphrase("olive river lantern 42").score).toBeGreaterThanOrEqual(3);
    expect(assessPassphrase("Tq9#vL2!mZ8@pX4$").strength).toBe("strong");
  });
});
