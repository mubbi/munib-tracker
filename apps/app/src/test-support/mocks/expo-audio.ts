/**
 * Empty `expo-audio` stand-in. The real module touches native classes at import
 * time and throws under Jest; components that only import it transitively
 * (via `audio-player-provider` → `learn-tts-context` → Learn primitives) just
 * need it to load.
 *
 *   jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
 */
export const expoAudioMock = { __esModule: true };
