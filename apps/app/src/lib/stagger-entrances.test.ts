import {
  completeAllStaggerEntrances,
  registerStaggerLayoutListener,
} from "@/lib/stagger-entrances";

describe("stagger layout listeners", () => {
  it("snaps every registered entrance", () => {
    const listeners = [jest.fn(), jest.fn()];
    const unsubscribe = listeners.map((listener) => registerStaggerLayoutListener(listener));
    completeAllStaggerEntrances();
    for (const listener of listeners) expect(listener).toHaveBeenCalledTimes(1);
    for (const off of unsubscribe) off();
  });

  it("stops notifying an unregistered listener", () => {
    const listener = jest.fn();
    registerStaggerLayoutListener(listener)();
    completeAllStaggerEntrances();
    expect(listener).not.toHaveBeenCalled();
  });
});
