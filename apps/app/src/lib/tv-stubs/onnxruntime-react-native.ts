/**
 * TV stub for `onnxruntime-react-native` (Metro maps it here when `EXPO_TV=1`).
 * Apple TV / Android TV builds have no microphone path, so Qur'an practice never
 * creates a listener there (`isPracticeAvailable()`); this only keeps the bundle
 * resolvable and fails loudly if something tries.
 */

const UNAVAILABLE = "onnxruntime-react-native is unavailable on TV";

export const InferenceSession = {
  create(): Promise<never> {
    return Promise.reject(new Error(UNAVAILABLE));
  },
};

export class Tensor {
  constructor() {
    throw new Error(UNAVAILABLE);
  }
}

export const env = {};

export default { InferenceSession, Tensor, env };
