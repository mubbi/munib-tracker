import { fireEvent, screen } from "@testing-library/react-native";

import { ReciteToFindPanel } from "@/components/quran/recite-to-find-panel";
import type { ListenerState } from "@/lib/quran-companion/model/download-job";
import { createReciteState, type ReciteState } from "@/lib/recite-to-find/reducer";
import { buildRecitationManifest } from "@/test-support/fixtures/quran-companion";
import { mockRouter } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => true }));
jest.mock("@/hooks/use-recite-to-find", () => ({
  useReciteToFindAvailability: () => mockAvailability,
  useReciteToFind: () => mockRecite,
}));
jest.mock("@/hooks/use-recite-to-find-text", () => ({
  useReciteCandidateArabic: () => ({ "2:255": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ" }),
}));
jest.mock("@/stores/quran-listener-store", () => ({
  quranListenerStore: { getState: () => ({ download: mockDownload, cancel: mockCancel }) },
}));

const mockDownload = jest.fn(async () => "started");
const mockCancel = jest.fn();

function listener(overrides: Partial<ListenerState> = {}): ListenerState {
  return {
    status: "ready",
    engine: "tilawa-zipformer",
    manifest: buildRecitationManifest(),
    bytesDone: 0,
    bytesTotal: 0,
    error: null,
    ...overrides,
  };
}

let mockAvailability: {
  available: boolean;
  listener: ListenerState;
  engineChoice: "tilawa-zipformer";
  wifiOnlyDownload: boolean;
};
let mockRecite: {
  state: ReciteState;
  engineStatus: string;
  engineError: string | null;
  mic: string;
  micPermission: string | null;
  level: { value: number };
  canListen: boolean;
  toggle: jest.Mock;
  stop: jest.Mock;
  reset: jest.Mock;
};

function found(): ReciteState {
  return {
    ...createReciteState(),
    status: "found",
    candidates: [
      {
        key: "2:255",
        surah: 2,
        ayah: 255,
        ayahEnd: 255,
        score: 0.95,
        strength: "strong",
        confirmed: true,
      },
    ],
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAvailability = {
    available: true,
    listener: listener(),
    engineChoice: "tilawa-zipformer",
    wifiOnlyDownload: true,
  };
  mockRecite = {
    state: createReciteState(),
    engineStatus: "ready",
    engineError: null,
    mic: "idle",
    micPermission: "granted",
    level: { value: 0 },
    canListen: true,
    toggle: jest.fn(async () => undefined),
    stop: jest.fn(async () => undefined),
    reset: jest.fn(),
  };
});

describe("ReciteToFindPanel", () => {
  it("renders nothing where recite-to-find is unavailable", async () => {
    mockAvailability.available = false;
    await renderWithTheme(<ReciteToFindPanel />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("offers the listener download (with size and privacy) when it is missing", async () => {
    mockAvailability.listener = listener({ status: "not-downloaded", manifest: null });
    await renderWithTheme(<ReciteToFindPanel />);
    expect(screen.getByText("Download the Qur'an listener")).toBeTruthy();
    expect(screen.getByText(/stays on this device/)).toBeTruthy();
    expect(screen.getByText(/Audio never leaves it/)).toBeTruthy();
    await fireEvent.press(screen.getByText("Download listener"));
    expect(mockDownload).toHaveBeenCalledWith("tilawa-zipformer", {
      wifiOnly: true,
      allowCellular: false,
    });
  });

  it("shows download progress with a cancel action", async () => {
    mockAvailability.listener = listener({
      status: "downloading",
      manifest: null,
      bytesDone: 512,
      bytesTotal: 2048,
    });
    await renderWithTheme(<ReciteToFindPanel />);
    await fireEvent.press(screen.getByText("Cancel"));
    expect(mockCancel).toHaveBeenCalled();
  });

  it("starts listening from the big mic", async () => {
    await renderWithTheme(<ReciteToFindPanel />);
    expect(screen.getByText("Recite to find an ayah")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Start listening"));
    expect(mockRecite.toggle).toHaveBeenCalled();
  });

  it("says nothing yet while listening with no candidate", async () => {
    mockRecite.mic = "listening";
    mockRecite.state = { ...createReciteState(), status: "listening" };
    await renderWithTheme(<ReciteToFindPanel />);
    expect(screen.getByLabelText("Stop listening")).toBeTruthy();
    expect(screen.getByText(/Nothing yet/)).toBeTruthy();
  });

  it("lists a found ayah with its surah, bundled text, and both actions", async () => {
    mockRecite.state = found();
    await renderWithTheme(<ReciteToFindPanel />);
    expect(screen.getByText("Al-Baqarah")).toBeTruthy();
    expect(screen.getByText("2:255")).toBeTruthy();
    expect(screen.getByText("Strong match")).toBeTruthy();
    await fireEvent.press(screen.getByText("Open in reader"));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/quran/[surah]",
      params: { surah: "2", ayah: "255" },
    });
    await fireEvent.press(screen.getByText("Practice from here"));
    expect(mockRouter.push).toHaveBeenLastCalledWith({
      pathname: "/quran/practice/session",
      params: { surah: "2", from: "255", to: "259", source: "hub" },
    });
  });

  it("explains a refused microphone", async () => {
    mockRecite.micPermission = "denied";
    mockRecite.state = { ...createReciteState(), status: "error", error: "mic-denied" };
    await renderWithTheme(<ReciteToFindPanel />);
    expect(screen.getByText(/Microphone access is off/)).toBeTruthy();
  });
});
