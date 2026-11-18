import PushTokenManager from "./expo-notifications-push-token-manager";

describe("web PushTokenManager shim", () => {
  it("accepts listeners without ever emitting", () => {
    const sub = PushTokenManager.addListener();
    expect(() => sub.remove()).not.toThrow();
    PushTokenManager.removeListener();
    PushTokenManager.removeAllListeners();
    PushTokenManager.emit();
    expect(PushTokenManager.listenerCount()).toBe(0);
  });
});
