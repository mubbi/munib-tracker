/**
 * Metro resolves `expo-location` here when `EXPO_TV=1`.
 * Apple TV has no ExpoLocation native module / usable GPS.
 */

export enum Accuracy {
  Lowest = 1,
  Low = 2,
  Balanced = 3,
  High = 4,
  Highest = 5,
  BestForNavigation = 6,
}

export type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

export type LocationSubscription = { remove: () => void };

export type LocationHeadingObject = {
  trueHeading: number;
  magHeading: number;
  accuracy: number;
};

export async function getForegroundPermissionsAsync(): Promise<{
  status: string;
  granted: boolean;
  canAskAgain: boolean;
}> {
  return { status: "denied", granted: false, canAskAgain: false };
}

export async function requestForegroundPermissionsAsync(): Promise<{
  status: string;
  granted: boolean;
  canAskAgain: boolean;
}> {
  return { status: "denied", granted: false, canAskAgain: false };
}

export async function getCurrentPositionAsync(_options?: {
  accuracy?: Accuracy;
}): Promise<LocationObject> {
  throw new Error("Location unavailable on TV");
}

export async function getLastKnownPositionAsync(): Promise<LocationObject | null> {
  return null;
}

export async function reverseGeocodeAsync(_coords: {
  latitude: number;
  longitude: number;
}): Promise<
  Array<{
    city?: string | null;
    subregion?: string | null;
    district?: string | null;
    country?: string | null;
  }>
> {
  return [];
}

export async function watchHeadingAsync(
  _callback: (data: LocationHeadingObject) => void,
): Promise<LocationSubscription> {
  return { remove: () => {} };
}

export default {
  Accuracy,
  getForegroundPermissionsAsync,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  getLastKnownPositionAsync,
  reverseGeocodeAsync,
  watchHeadingAsync,
};
