/**
 * Metro resolves `expo-image-picker` here when `EXPO_TV=1`.
 * Photo library / camera pickers are phone-only.
 */

export type ImagePickerAsset = {
  uri: string;
  width: number;
  height: number;
  type?: "image" | "video";
  fileName?: string | null;
  mimeType?: string;
};

export type PermissionResponse = {
  status: string;
  granted: boolean;
  canAskAgain: boolean;
};

export type ImagePickerResult =
  | { canceled: true; assets: null }
  | { canceled: false; assets: ImagePickerAsset[] };

const denied: PermissionResponse = {
  status: "denied",
  granted: false,
  canAskAgain: false,
};

export async function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse> {
  return denied;
}

export async function requestCameraPermissionsAsync(): Promise<PermissionResponse> {
  return denied;
}

export async function launchImageLibraryAsync(_options?: unknown): Promise<ImagePickerResult> {
  return { canceled: true, assets: null };
}

export async function launchCameraAsync(_options?: unknown): Promise<ImagePickerResult> {
  return { canceled: true, assets: null };
}

export default {
  requestMediaLibraryPermissionsAsync,
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  launchCameraAsync,
};
