import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { TtsVoiceSheet, type TtsVoiceSheetProps } from "@/components/tts-voice-sheet";
import { getTtsVoices, type TtsVoice } from "@/lib/tts";
import { deferred } from "@/test-support/async";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/tts", () => ({ getTtsVoices: jest.fn() }));

const VOICES: TtsVoice[] = [
  { identifier: "ar-1", name: "Maged", language: "ar-SA" },
  { identifier: "ar-2", name: "Laila", language: "ar-EG" },
] as TtsVoice[];

const renderSheet = async (props: Partial<TtsVoiceSheetProps> = {}) => {
  const handlers = { onClose: jest.fn(), onSelectVoice: jest.fn() };
  const result = await renderWithTheme(
    <TtsVoiceSheet visible lang="ar" {...handlers} {...props} />,
  );
  return { ...handlers, ...result };
};

const radios = () => screen.getAllByRole("radio");

beforeEach(() => {
  jest.mocked(getTtsVoices).mockReset();
  jest.mocked(getTtsVoices).mockResolvedValue(VOICES);
});

describe("TtsVoiceSheet", () => {
  it("lists the system default plus installed voices for the language", async () => {
    await renderSheet();

    expect(await screen.findByText("Maged")).toBeTruthy();
    expect(screen.getByText("ar-EG")).toBeTruthy();
    expect(radios()).toHaveLength(3);
    expect(getTtsVoices).toHaveBeenCalledWith("ar");
  });

  it("marks the system default when no voice is saved", async () => {
    await renderSheet();
    await screen.findByText("Maged");

    expect(radios().map((radio) => radio.props.accessibilityState.checked)).toEqual([
      true,
      false,
      false,
    ]);
  });

  it("marks the saved voice", async () => {
    await renderSheet({ selectedVoiceId: "ar-2" });
    await screen.findByText("Laila");

    expect(radios().map((radio) => radio.props.accessibilityState.checked)).toEqual([
      false,
      false,
      true,
    ]);
  });

  it("confirms a picked voice and closes", async () => {
    const { onSelectVoice, onClose } = await renderSheet();

    await fireEvent.press(await screen.findByText("Laila"));

    expect(onSelectVoice).toHaveBeenCalledWith("ar-2");
    expect(onClose).toHaveBeenCalled();
  });

  it("confirms the system default", async () => {
    const { onSelectVoice } = await renderSheet({ selectedVoiceId: "ar-1" });
    await screen.findByText("Maged");

    await fireEvent.press(radios()[0]);

    expect(onSelectVoice).toHaveBeenCalledWith(undefined);
  });

  it("falls back to every installed voice when none match the language", async () => {
    jest.mocked(getTtsVoices).mockResolvedValueOnce([]).mockResolvedValueOnce(VOICES);
    await renderSheet();

    expect(await screen.findByText("Maged")).toBeTruthy();
    expect(getTtsVoices).toHaveBeenLastCalledWith();
  });

  it("explains when no voices are installed at all", async () => {
    jest.mocked(getTtsVoices).mockResolvedValue([]);
    await renderSheet();

    await waitFor(() => expect(getTtsVoices).toHaveBeenCalledTimes(2));
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("does not load voices while hidden", async () => {
    await renderSheet({ visible: false });

    expect(getTtsVoices).not.toHaveBeenCalled();
  });

  it("ignores voice results that arrive after it closes", async () => {
    const pending = deferred<TtsVoice[]>();
    jest.mocked(getTtsVoices).mockReturnValue(pending.promise);
    const { rerender, onClose, onSelectVoice } = await renderSheet();

    await rerender(
      <TtsVoiceSheet visible={false} lang="ar" onClose={onClose} onSelectVoice={onSelectVoice} />,
    );
    pending.resolve(VOICES);

    await waitFor(() => expect(screen.queryByText("Maged")).toBeNull());
  });
});

describe("TtsVoiceSheet on TV", () => {
  usePlatform({ isTV: true });

  it.each([
    [undefined, 0],
    ["ar-1", 1],
  ])("focuses the selected row (selectedVoiceId=%s)", async (selectedVoiceId, index) => {
    await renderSheet({ selectedVoiceId });
    await screen.findByText("Maged");

    expect(radios()[index].props.hasTVPreferredFocus).toBe(true);
  });
});
