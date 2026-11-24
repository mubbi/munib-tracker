import { act, fireEvent, screen } from "@testing-library/react-native";

import { TasbeehCounter } from "@/components/tasbeeh/tasbeeh-counter";
import { NO_VOICE, type VoiceTasbeeh } from "@/hooks/use-voice-tasbeeh";
import type { VoiceZikr } from "@/lib/tasbeeh-voice/voice-zikr";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("expo-network", () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ type: "WIFI" })),
  NetworkStateType: { WIFI: "WIFI", ETHERNET: "ETHERNET" },
}));
jest.mock("@/lib/platform/hinge", () => ({ useHingePosture: jest.fn(() => null) }));

let mockUsesModel = true;
jest.mock("@/lib/tasbeeh-voice/mode", () => ({
  ...jest.requireActual("@/lib/tasbeeh-voice/mode"),
  usesModel: () => mockUsesModel,
}));

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

const SUBHANALLAH: VoiceZikr = {
  key: "zikr:after_prayer-tasbih",
  label: "SubhanAllah",
  entry: null,
  phrase: "subhanallah",
};

function voice(overrides: Partial<VoiceTasbeeh> = {}): VoiceTasbeeh {
  return {
    ...NO_VOICE,
    platformAvailable: true,
    available: true,
    zikr: SUBHANALLAH,
    phrase: "subhanallah",
    taught: true,
    modelStatus: "ready",
    permission: "granted",
    start: jest.fn(async () => "started" as const),
    stop: jest.fn(),
    muteFor: jest.fn(),
    requestPermission: jest.fn(async () => "granted" as const),
    startTeaching: jest.fn(async () => "started" as const),
    finishTeaching: jest.fn(async () => "started" as const),
    cancelTeaching: jest.fn(),
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
      voiceZikr={SUBHANALLAH}
      {...props}
    />,
  );
  return { onIncrement };
}

async function openSheet() {
  await fireEvent.press(screen.getByRole("button", { name: "Start hands-free counting" }));
}

beforeEach(() => {
  mockUsesModel = true;
  mockVoice = voice();
  mockOnVoiceCount = null;
});

describe("hands-free tasbeeh in the counter", () => {
  it("offers no voice toggle on a counter that has no zikr and no picker", async () => {
    await renderCounter({ voiceZikr: null });
    expect(screen.queryByRole("button", { name: "Start hands-free counting" })).toBeNull();
  });

  it("offers no voice toggle where the platform cannot listen", async () => {
    mockVoice = voice({ platformAvailable: false, available: false });
    await renderCounter();
    expect(screen.queryByRole("button", { name: "Start hands-free counting" })).toBeNull();
  });

  it("starts a taught zikr straight from the mic toggle (D50)", async () => {
    await renderCounter();
    await openSheet();
    expect(mockVoice.start).toHaveBeenCalledTimes(1);
  });

  it("offers teaching first for a zikr not taught yet, or skipping to pause counting (D50)", async () => {
    mockUsesModel = false;
    mockVoice = voice({ taught: false });
    await renderCounter();
    await openSheet();
    expect(mockVoice.start).not.toHaveBeenCalled();
    expect(screen.getByText("Say it once so only this zikr counts")).toBeTruthy();
    expect(screen.getByText(/No audio is recorded or sent/)).toBeTruthy();
    expect(screen.getAllByText(/a short voice pattern \(not a recording\)/).length).toBeGreaterThan(
      0,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Teach by saying it" }));
    expect(mockVoice.startTeaching).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole("button", { name: "Skip — count every pause" }));
    expect(mockVoice.start).toHaveBeenCalledWith({ skipTeaching: true });
    expect(screen.getByText(/Counts each pause — less accurate/)).toBeTruthy();
    expect(screen.queryByText(/beta/i)).toBeNull();
  });

  it("shows live feedback while teaching", async () => {
    mockUsesModel = false;
    mockVoice = voice({
      taught: false,
      level: 0.5,
      teach: { status: "recording", accepted: 1, target: 3, issue: "different" },
    });
    await renderCounter();
    await openSheet();
    expect(screen.getByText("Say SubhanAllah now")).toBeTruthy();
    expect(screen.getByText("Got it 1/3")).toBeTruthy();
    expect(screen.getByText(/That sounded different/)).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Done — start counting" }));
    expect(mockVoice.finishTeaching).toHaveBeenCalledTimes(1);
  });

  it("offers re-teaching for a taught zikr", async () => {
    mockVoice = voice({ start: jest.fn(async () => "needs-permission" as const) });
    await renderCounter();
    await openSheet();
    expect(screen.getByText("Taught on this device.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Re-teach" }));
    expect(mockVoice.startTeaching).toHaveBeenCalledTimes(1);
  });

  it("opens the explainer sheet when the listener model is missing (spotter mode)", async () => {
    mockVoice = voice({
      taught: false,
      modelStatus: "missing",
      start: jest.fn(async () => "needs-model" as const),
    });
    await renderCounter();
    await openSheet();
    expect(screen.getByText("Hands-free counting")).toBeTruthy();
    expect(screen.getByText(/No audio is recorded or sent/)).toBeTruthy();
    expect(screen.getByText(/A low voice is enough/)).toBeTruthy();
    expect(screen.getByText(/Download \(\d+ MB\)/)).toBeTruthy();
  });

  it("labels the pause-count fallback and skips the model download (D24)", async () => {
    mockUsesModel = false;
    mockVoice = voice({
      taught: false,
      permission: "undetermined",
      start: jest.fn(async () => "needs-permission" as const),
    });
    await renderCounter();
    await openSheet();
    expect(screen.getByText(/Counts each pause — less accurate/)).toBeTruthy();
    expect(screen.queryByText(/Download \(\d+ MB\)/)).toBeNull();
    expect(screen.getByRole("button", { name: "Allow microphone" })).toBeTruthy();
  });

  it("lets the free counter pick any zikr, or something else (D49)", async () => {
    mockVoice = voice({ zikr: null, phrase: null, taught: false });
    await renderCounter({ voiceZikr: null, voiceChoosable: true });
    await openSheet();
    expect(screen.getByText("Which zikr are you saying?")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search adhkar or your tasbeehs")).toBeTruthy();
    expect(await screen.findByRole("radio", { name: "Alhamdulillah" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("radio", { name: "Something else" }));
    expect(
      screen.getByRole("button", { name: "Counting Something else. Change the zikr" }),
    ).toBeTruthy();
    expect(mockVoice.start).not.toHaveBeenCalled();
  });

  it("searches the whole adhkar library from the picker", async () => {
    mockVoice = voice({ zikr: null, phrase: null, taught: false });
    await renderCounter({ voiceZikr: null, voiceChoosable: true });
    await openSheet();
    await screen.findByRole("radio", { name: "Alhamdulillah" });
    await fireEvent.changeText(
      screen.getByPlaceholderText("Search adhkar or your tasbeehs"),
      "Kursi",
    );
    expect((await screen.findAllByRole("radio", { name: "Ayat al-Kursi" })).length).toBeGreaterThan(
      0,
    );
  });

  it("shows the listening panel, the zikr, how it counts, and the gentle stuck hint", async () => {
    mockVoice = voice({ listening: true, stuck: true, level: 0.4, countingMode: "template" });
    await renderCounter();
    expect(screen.getByText("Listening")).toBeTruthy();
    expect(screen.getByText("Listening for SubhanAllah")).toBeTruthy();
    expect(
      screen.getByText("Counts only the zikr you taught — tap to correct any miscount."),
    ).toBeTruthy();
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
