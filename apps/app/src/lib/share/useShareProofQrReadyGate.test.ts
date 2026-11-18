import { renderHook } from "@testing-library/react-native";

import {
  SHARE_PROOF_QR_READY_TIMEOUT_MS,
  useShareProofQrReadyGate,
} from "./useShareProofQrReadyGate";

async function setup(expectedCount = 2) {
  const { result } = await renderHook(() => useShareProofQrReadyGate(expectedCount));
  return result;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("useShareProofQrReadyGate", () => {
  it("resolves immediately when every QR is already ready", async () => {
    const gate = await setup(1);
    gate.current.markQrReady();
    await expect(gate.current.waitForQrCodes()).resolves.toBeUndefined();
  });

  it("resolves when the last QR reports ready", async () => {
    const gate = await setup(2);
    const done = jest.fn();
    void gate.current.waitForQrCodes().then(done);
    gate.current.markQrReady();
    await Promise.resolve();
    expect(done).not.toHaveBeenCalled();
    gate.current.markQrReady();
    gate.current.markQrReady(); // extra reports are ignored
    await jest.advanceTimersByTimeAsync(0);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it("falls back to a timeout when QR callbacks never arrive", async () => {
    const gate = await setup(3);
    const done = jest.fn();
    void gate.current.waitForQrCodes().then(done);
    await jest.advanceTimersByTimeAsync(SHARE_PROOF_QR_READY_TIMEOUT_MS);
    expect(done).toHaveBeenCalled();
  });

  it("reset requires the QRs to report again", async () => {
    const gate = await setup(1);
    gate.current.markQrReady();
    gate.current.reset();
    const done = jest.fn();
    void gate.current.waitForQrCodes().then(done);
    await Promise.resolve();
    expect(done).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(SHARE_PROOF_QR_READY_TIMEOUT_MS);
    expect(done).toHaveBeenCalled();
  });
});
