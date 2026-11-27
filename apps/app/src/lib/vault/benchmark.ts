import { derivePassphraseKek, VAULT_SALT_BYTES, VAULT_SCRYPT_PARAMS } from "./keyring";
import type { ScryptParams, VaultCryptoBackend } from "./types";
import { getVaultBackend } from "./vault";

/** Plan §4.2 target: one passphrase derivation in ≤ 1.5 s on a low-end Android phone. */
export const VAULT_KDF_TARGET_MS = 1500;

export interface VaultKdfBenchmark {
  platform: VaultCryptoBackend["platform"];
  params: ScryptParams;
  runsMs: number[];
  medianMs: number;
  withinTarget: boolean;
}

/**
 * Times the real passphrase KDF (scrypt N=2^15, r=8, p=1 → 32 MiB) on this
 * device. Not wired into any UI. To measure on a low-end Android (the plan's
 * acceptance gate — e.g. a 2–3 GB RAM Cortex-A53 device) run a dev build and,
 * from a temporary button or the JS console:
 *
 *   const { benchmarkVaultKdf } = require("@/lib/vault/benchmark");
 *   benchmarkVaultKdf().then((r) => console.log(JSON.stringify(r)));
 *
 * Native runs scrypt in C++ (quick-crypto, off the JS thread); web runs pure-JS
 * @noble/hashes. If the median misses the target on the reference device,
 * lower N only for *new* keyrings — params are stored per keyring, so existing
 * ones keep unlocking.
 */
export async function benchmarkVaultKdf(
  runs = 3,
  params: ScryptParams = VAULT_SCRYPT_PARAMS,
  backend: VaultCryptoBackend = getVaultBackend(),
  now: () => number = () => Date.now(),
): Promise<VaultKdfBenchmark> {
  const runsMs: number[] = [];
  for (let i = 0; i < Math.max(1, runs); i += 1) {
    const salt = backend.randomBytes(VAULT_SALT_BYTES);
    const start = now();
    await derivePassphraseKek(backend, "benchmark passphrase", salt, params);
    runsMs.push(now() - start);
  }
  const sorted = [...runsMs].sort((a, b) => a - b);
  const medianMs = sorted[Math.floor(sorted.length / 2)] as number;
  return {
    platform: backend.platform,
    params,
    runsMs,
    medianMs,
    withinTarget: medianMs <= VAULT_KDF_TARGET_MS,
  };
}
