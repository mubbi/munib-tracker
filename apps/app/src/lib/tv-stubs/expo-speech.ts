/**
 * Metro resolves `expo-speech` here when `EXPO_TV=1`.
 * No ExpoSpeech / AVSpeechSynthesizer module on Apple TV builds.
 */

export type SpeechOptions = {
  language?: string;
  pitch?: number;
  rate?: number;
  voice?: string;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: Error) => void;
};

export function speak(_text: string, options?: SpeechOptions): void {
  options?.onError?.(new Error("Speech unavailable on TV"));
}

export async function stop(): Promise<void> {}

export async function pause(): Promise<void> {}

export async function resume(): Promise<void> {}

export async function isSpeakingAsync(): Promise<boolean> {
  return false;
}

export async function getAvailableVoicesAsync(): Promise<
  Array<{ identifier: string; name: string; language: string; quality?: string }>
> {
  return [];
}

export enum VoiceQuality {
  Default = "Default",
  Enhanced = "Enhanced",
}

export default {
  speak,
  stop,
  pause,
  resume,
  isSpeakingAsync,
  getAvailableVoicesAsync,
  VoiceQuality,
};
