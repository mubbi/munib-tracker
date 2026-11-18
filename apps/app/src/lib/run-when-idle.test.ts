// jest.setup.ts replaces `@/lib/run-when-idle` with a synchronous stub; test the real one.
const { runWhenIdle } =
  jest.requireActual<typeof import("@/lib/run-when-idle")>("@/lib/run-when-idle");

describe("runWhenIdle", () => {
  /** Let the idle callback (setTimeout-based under Jest) fire. */
  const idle = () => new Promise((resolve) => setTimeout(resolve, 5));

  it("defers the task until the thread is idle", async () => {
    const task = jest.fn();
    runWhenIdle(task);
    expect(task).not.toHaveBeenCalled();
    await idle();
    expect(task).toHaveBeenCalledTimes(1);
  });

  it("never runs a cancelled task", async () => {
    const task = jest.fn();
    runWhenIdle(task).cancel();
    await idle();
    expect(task).not.toHaveBeenCalled();
  });
});
