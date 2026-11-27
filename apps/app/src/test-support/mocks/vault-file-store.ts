/**
 * In-memory stand-in for `lib/vault/vault-file-store` (the jest-wide
 * `expo-file-system` mock doesn't persist writes). In a suite:
 *
 *   jest.mock("@/lib/vault/vault-file-store", () => require("@/test-support/mocks/vault-file-store").vaultFileStoreMock);
 *   beforeEach(() => resetVaultFileStoreMock());
 */
const files = new Map<string, Uint8Array>();

export const vaultFileStoreMock = {
  putFile: async (name: string, bytes: Uint8Array) => {
    files.set(name, new Uint8Array(bytes));
  },
  getFile: async (name: string) => files.get(name) ?? null,
  deleteFile: async (name: string) => {
    files.delete(name);
  },
  listFiles: async () => [...files.keys()],
  wipeFiles: async () => {
    files.clear();
  },
};

/** Raw (sealed) bytes currently stored, by file id. */
export function vaultFileStoreContents(): ReadonlyMap<string, Uint8Array> {
  return files;
}

export function resetVaultFileStoreMock(): void {
  files.clear();
}
