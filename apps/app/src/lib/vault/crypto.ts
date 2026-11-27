/**
 * Type anchor for the platform crypto backend. Metro resolves
 * `crypto.native.ts` (iOS/Android/TV) or `crypto.web.ts` (web) before this
 * file; `tsc` and Jest (`haste.platforms: native`) see the native backend.
 * Both implement {@link VaultCryptoBackend}, which keeps them in lock-step.
 */
export { vaultCrypto } from "./crypto.native";
