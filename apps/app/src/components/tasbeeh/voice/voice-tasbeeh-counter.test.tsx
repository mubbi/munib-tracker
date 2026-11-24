import { act, fireEvent, screen } from "@testing-library/react-native";

import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { NO_VOICE, type VoiceTasbeeh } from "@/hooks/use-voice-tasbeeh";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("expo-audio", () => ({ __esModule: true }));
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ type: "WIFI" })),
  NetworkStateType: { WIFI: "WIFI", ETHERNET: "ETHERNET" },
}));
jest.mock("@/lib/platform/hinge", () => ({ useHingePosture: jest.fn(() => null) }));

let mockUsesModel = true;
jest.mock("@/lib/tasbeeh-voice/mode", () => ({ usesModel: () => mockUsesModel }));

let mockVoice: VoiceTasbeeh;
let mockOnVoiceCount: (() => void) | null = null;
jest.mock("@/hooks/use-voice-tasbeeh", () => {
  const actual = jest.requireActual("@/hooks/use-voice-tasbeeh");
  return {
    ...actual,
    useVoiceTasbeeh: (options: { onVoiceCount: () => void }) => {
      mockOnVoiceCount = options.onVoiceCount;
      return mockVoice;
    },
  };
});

function voice(overrides: Partial<VoiceTasbeeh> = {}): VoiceTasbeeh {
  return {
    ...NO_VOICE,
    platformAvailable: true,
    available: true,
    phrase: "subhanallah",
    modelStatus: "ready",
    permission: "granted",
    start: jest.fn(async () => "started" as const),
    stop: jest.fn(),
    muteFor: jest.fn(),
    requestPermission: jest.fn(async () => "granted" as const),
    ...overrides,
  };
}

async function renderCounter(props: Partial<Parameters<typeof TasbeehCounter>[0]> = {}) {
  const onIncrement = jest.fn();
  await renderWithTheme(
    <TasbeehCounter
      count={0}
      target={33}
      onIncrement={onIncrement}
      onDecrement={jest.fn()}
      onReset={jest.fn()}
      voicePhrase="subhanallah"
      {...props}
    />,
  );
  return { onIncrement };
}

beforeEach(() => {
  mockUsesModel = true;
  mockVoice = voice();
  mockOnVoiceCount = null;
});

describe("hands-free tasbeeh in the counter", () => {
  it("offers no voice toggle on a counter without a catalog phrase", async () => {
    await renderCounter({ voicePhrase: null });
    expect(screen.queryByRole("button", { name: "Start hands-free counting" })).toBeNull();
  });

  it("offers no voice toggle where the platform cannot listen", async () => {
    mockVoice = voice({ platformAvailable: false, available: false });
    await renderCounter();
    expect(screen.queryByRole("button", { name: "Start hands-free counting" })).toBeNull();
  });

  it("starts listening from the mic toggle", async () => {
    await renderCounter();
    await fireEvent.press(screen.getByRole("button", { name: "Start hands-free counting" }));
    expect(mockVoice.start).toHaveBeenCalledTimes(1);
  });

  it("opens the explainer sheet when the listener model is missing", async () => {
    mockVoice = voice({
      modelStatus: "missing",
      start: jest.fn(async () => "needs-model" as const),
    });
    await renderCounter();
    await fireEvent.press(screen.getByRole("button", { name: "Start hands-free counting" }));
    expect(screen.getByText("Hands-free counting")).toBeTruthy();
    expect(screen.getByText(/no audio is recorded, stored or sent/)).toBeTruthy();
    expect(screen.getByText(/A low voice is enough/)).toBeTruthy();
    expect(screen.getByText(/Download \(\d+ MB\)/)).toBeTruthy();
  });

  it("labels the pause-count fallback and skips the model download (D24)", async () => {
    mockUsesModel = false;
    mockVoice = voice({
      permission: "undetermined",
      start: jest.fn(async () => "needs-permission" as const),
    });
    await renderCounter();
    await fireEvent.press(screen.getByRole("button", { name: "Start hands-free counting" }));
    expect(screen.getByText(/Counts each pause — less accurate/)).toBeTruthy();
    expect(screen.queryByText(/Download \(\d+ MB\)/)).toBeNull();
    expect(screen.getByRole("button", { name: "Allow microphone" })).toBeTruthy();
  });

  it("lets the free counter pick a phrase first", async () => {
    await renderCounter({ voicePhrase: null, voiceChoosable: true });
    await fireEvent.press(screen.getByRole("button", { name: "Start hands-free counting" }));
    expect(screen.getByText("Which zikr are you saying?")).toBeTruthy();
    expect(screen.getByRole("radio", { name: "Alhamdulillah" })).toBeTruthy();
    expect(mockVoice.start).not.toHaveBeenCalled();
  });

  it("shows the listening panel, the phrase and the gentle stuck hint", async () => {
    mockVoice = voice({ listening: true, stuck: true, level: 0.4 });
    await renderCounter();
    expect(screen.getByText("Listening")).toBeTruthy();
    expect(screen.getByText("Listening for SubhanAllah")).toBeTruthy();
    expect(screen.getByText("Say the phrase clearly, or tap to count")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Stop hands-free counting" }));
    expect(mockVoice.stop).toHaveBeenCalledWith("user");
  });

  it("explains an automatic stop after silence", async () => {
    mockVoice = voice({
      session: { ...NO_VOICE.session, status: "stopped", stopReason: "silence" },
    });
    await renderCounter();
    expect(screen.getByText(/Listening paused after a quiet spell/)).toBeTruthy();
  });

  it("counts a recognised phrase through the same path as a tap", async () => {
    const { onIncrement } = await renderCounter();
    await act(async () => {
      mockOnVoiceCount?.();
    });
    expect(onIncrement).toHaveBeenCalledTimes(1);
  });
});
