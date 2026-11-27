import { claimMicrophone, microphoneOwner, releaseMicrophone } from "./mic-owner";

describe("mic owner", () => {
  afterEach(() => {
    // Leave no owner behind for the next test.
    const owner = microphoneOwner();
    if (owner) {
      const noop = () => {};
      return claimMicrophone(owner, noop).then(() => releaseMicrophone(noop));
    }
  });

  it("records the owner and gives the mic back only to the same release", async () => {
    const release = jest.fn();
    await claimMicrophone("dictation", release);
    expect(microphoneOwner()).toBe("dictation");

    releaseMicrophone(() => {});
    expect(microphoneOwner()).toBe("dictation");

    releaseMicrophone(release);
    expect(microphoneOwner()).toBeNull();
    expect(release).not.toHaveBeenCalled();
  });

  it("preempts the previous owner and awaits its release before returning", async () => {
    const order: string[] = [];
    const first = jest.fn(async () => {
      await Promise.resolve();
      order.push("first released");
    });
    await claimMicrophone("tasbeeh-voice", first);
    await claimMicrophone("pronunciation", () => {});
    order.push("claimed");

    expect(first).toHaveBeenCalledTimes(1);
    expect(order).toEqual(["first released", "claimed"]);
    expect(microphoneOwner()).toBe("pronunciation");
  });

  it("a preempted owner's own release call does not drop the new owner", async () => {
    let releaseFirst: () => void = () => {};
    releaseFirst = jest.fn(() => releaseMicrophone(releaseFirst));
    await claimMicrophone("quran-practice", releaseFirst);
    await claimMicrophone("dictation", () => {});
    expect(releaseFirst).toHaveBeenCalledTimes(1);
    expect(microphoneOwner()).toBe("dictation");
  });

  it("re-claiming with the same release does not stop the owner", async () => {
    const release = jest.fn();
    await claimMicrophone("tasbeeh-voice", release);
    await claimMicrophone("tasbeeh-voice", release);
    expect(release).not.toHaveBeenCalled();
  });

  it("swallows a failing release", async () => {
    await claimMicrophone("pronunciation", () => {
      throw new Error("boom");
    });
    await expect(claimMicrophone("dictation", () => {})).resolves.toBeUndefined();
    expect(microphoneOwner()).toBe("dictation");
  });
});
