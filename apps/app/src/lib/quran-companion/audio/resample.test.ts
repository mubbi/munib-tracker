import { createChunker, createResampler, downmix, int16ToFloat32 } from "./resample";

function sine(rate: number, seconds: number, hz = 440): Float32Array {
  const n = Math.round(rate * seconds);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.sin((2 * Math.PI * hz * i) / rate);
  return out;
}

describe("resampler (§7)", () => {
  it.each([48_000, 44_100])("resamples %i Hz to 16 kHz with the right length", (rate) => {
    const r = createResampler();
    const input = sine(rate, 1);
    let total = 0;
    for (let i = 0; i < input.length; i += 1024)
      total += r.push(input.subarray(i, i + 1024), rate, 1).length;
    expect(Math.abs(total - 16_000)).toBeLessThanOrEqual(2);
  });

  it("is continuous across chunk edges (no clicks)", () => {
    const rate = 48_000;
    const input = sine(rate, 0.1, 200);
    const whole = createResampler().push(input, rate, 1);
    const r = createResampler();
    const parts: number[] = [];
    for (let i = 0; i < input.length; i += 333)
      parts.push(...r.push(input.subarray(i, i + 333), rate, 1));
    const n = Math.min(whole.length, parts.length);
    for (let i = 0; i < n; i++) expect(Math.abs(whole[i] - parts[i])).toBeLessThan(1e-4);
  });

  it("passes 16 kHz mono through untouched", () => {
    const input = sine(16_000, 0.01);
    expect(createResampler().push(input, 16_000, 1)).toEqual(input);
  });

  it("downmixes stereo", () => {
    expect(Array.from(downmix(Float32Array.from([1, 0, 0.5, 0.5]), 2))).toEqual([0.5, 0.5]);
  });

  it("converts int16 to float", () => {
    const ints = Int16Array.from([0, 16384, -32768]);
    expect(Array.from(int16ToFloat32(ints.buffer))).toEqual([0, 0.5, -1]);
  });
});

describe("chunker", () => {
  it("hands out fixed chunks and flushes the tail", () => {
    const c = createChunker(100, 2000);
    c.push(new Float32Array(3500));
    expect(c.take()?.length).toBe(1600);
    expect(c.take()?.length).toBe(1600);
    expect(c.take()).toBeNull();
    expect(c.take(true)?.length).toBe(300);
  });

  it("drops the oldest audio past the queue limit", () => {
    const c = createChunker(100, 500);
    c.push(new Float32Array(16_000));
    expect(c.droppedSamples).toBeGreaterThan(0);
  });
});

describe("chunker bookkeeping", () => {
  it("counts dropped samples and clears them on reset", () => {
    const chunker = createChunker(10, 20); // 160-sample chunks, 320-sample queue
    chunker.push(new Float32Array(200));
    chunker.push(new Float32Array(200));
    expect(chunker.droppedSamples).toBe(200);
    chunker.reset();
    expect(chunker.droppedSamples).toBe(0);
    expect(chunker.take(true)).toBeNull();
  });

  it("ignores empty pushes", () => {
    const chunker = createChunker(10);
    chunker.push(new Float32Array(0));
    expect(chunker.take(true)).toBeNull();
  });
});
