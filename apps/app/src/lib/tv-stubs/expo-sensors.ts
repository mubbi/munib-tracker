/**
 * Metro resolves `expo-sensors` here when `EXPO_TV=1`.
 * Magnetometer / device motion APIs are phone-only.
 */

type Subscription = { remove: () => void };

export const Magnetometer = {
  async isAvailableAsync(): Promise<boolean> {
    return false;
  },
  setUpdateInterval(_ms: number): void {},
  addListener(_listener: (data: { x: number; y: number; z: number }) => void): Subscription {
    return { remove: () => {} };
  },
};

export default { Magnetometer };
