import { concatPcm, hush, tone } from "@/test-support/tasbeeh-voice";

import { createPauseCounter } from "./pause-count";

function run(pcm: Float32Array, mute?: (c: ReturnType<typeof createPauseCounter>) => void) {
  const onHit = jest.fn();
  const counter = createPauseCounter({ onHit });
  mute?.(counter);
  for (let i = 0; i < pcm.length; i += 1600) counter.feed(pcm.subarray(i, i + 1600));
  void counter.finish();
  return onHit;
}

describe("pause count (D24 fallback)", () => {
  it("counts each separate spoken burst once", () => {
    const burst = () => concatPcm(tone(700), hush(800));
    expect(run(concatPcm(hush(500), burst(), burst(), burst()))).toHaveBeenCalledTimes(3);
  });

  it("ignores clicks and coughs shorter than a phrase", () => {
    expect(run(concatPcm(hush(500), tone(80), hush(800)))).not.toHaveBeenCalled();
  });

  it("never counts silence", () => {
    expect(run(hush(5000))).not.toHaveBeenCalled();
  });

  it("ignores speech during a screen-reader announcement", () => {
    const onHit = run(concatPcm(tone(700), hush(800)), (c) => c.mute(5000));
    expect(onHit).not.toHaveBeenCalled();
  });
});
