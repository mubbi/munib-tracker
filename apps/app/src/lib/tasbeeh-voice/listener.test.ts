import {
  concatPcm,
  fakeRunner,
  hush,
  SAID_AB,
  TOY_AB,
  TOY_SPOTTER_VOCAB,
  tone,
  toyLogprobs,
} from "@/test-support/tasbeeh-voice";

import { createVoiceListener } from "./listener";

function setup(matrices = [toyLogprobs(SAID_AB)], threshold = -0.5) {
  const runner = fakeRunner(matrices);
  const onHit = jest.fn();
  const onSpeech = jest.fn();
  const onError = jest.fn();
  const listener = createVoiceListener({
    runner,
    phrase: TOY_AB,
    vocab: TOY_SPOTTER_VOCAB,
    minGapMs: 160,
    threshold: () => threshold,
    onHit,
    onSpeech,
    onError,
  });
  const feed = (pcm: Float32Array) => {
    for (let i = 0; i < pcm.length; i += 1600) listener.feed(pcm.subarray(i, i + 1600));
  };
  return { runner, onHit, onSpeech, onError, listener, feed };
}

describe("voice listener pipeline", () => {
  it("never runs the model on silence", async () => {
    const { runner, onHit, listener, feed } = setup();
    feed(hush(4000));
    await listener.finish();
    expect(runner.calls).toBe(0);
    expect(onHit).not.toHaveBeenCalled();
  });

  it("reports one hit for one spoken phrase", async () => {
    const { runner, onHit, onSpeech, listener, feed } = setup();
    feed(concatPcm(hush(800), tone(700), hush(800)));
    await listener.finish();
    expect(runner.calls).toBe(1);
    expect(onHit).toHaveBeenCalledTimes(1);
    expect(onSpeech.mock.calls).toEqual([[true], [false]]);
  });

  it("ignores a phrase heard during a mute window (screen-reader speech)", async () => {
    const { onHit, listener, feed } = setup();
    feed(hush(500));
    listener.mute(5000);
    feed(concatPcm(tone(700), hush(800)));
    await listener.finish();
    expect(onHit).not.toHaveBeenCalled();
  });

  it("does not count a phrase below the gate", async () => {
    const { onHit, listener, feed } = setup([toyLogprobs([null, 5, 1, 5, 2, null])]);
    feed(concatPcm(hush(500), tone(700), hush(800)));
    await listener.finish();
    expect(onHit).not.toHaveBeenCalled();
  });

  it("reports model failures and stops processing", async () => {
    const { runner, onError, listener, feed } = setup();
    runner.run = jest.fn().mockRejectedValue(new Error("ort exploded"));
    feed(concatPcm(hush(500), tone(700), hush(800)));
    await listener.finish();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("drops everything after dispose", async () => {
    const { runner, onHit, listener, feed } = setup();
    listener.dispose();
    feed(concatPcm(hush(500), tone(700), hush(800)));
    await listener.finish();
    expect(runner.calls).toBe(0);
    expect(onHit).not.toHaveBeenCalled();
  });

  it("tracks audio time for mute windows", () => {
    const { listener, feed } = setup();
    feed(hush(1000));
    expect(listener.audioMs).toBe(1000);
  });
});
