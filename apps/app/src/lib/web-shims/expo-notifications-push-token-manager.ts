/**
 * Silent web replacement for `expo-notifications/build/PushTokenManager.js`.
 *
 * expo-notifications' side-effect module `DevicePushTokenAutoRegistration.fx`
 * calls `addPushTokenListener()` on import. On web the stock manager is a no-op
 * that `console.warn`s "Listening to push token changes is not yet fully
 * supported on web" — noise we can't avoid since the package is imported for
 * local notifications. Same no-op behaviour, minus the warning. Aliased from
 * metro.config.js for `platform === "web"` only; native keeps the real module.
 */
const PushTokenManager = {
  addListener: () => ({ remove: () => {} }),
  removeListener: () => {},
  removeAllListeners: () => {},
  emit: () => {},
  listenerCount: () => 0,
};

export default PushTokenManager;
