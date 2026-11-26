import { fireEvent, screen } from "@testing-library/react-native";

import { AdhkarActionRow } from "@/components/zikr/adhkar-action-row";
import type { ZikrAudioControl } from "@/components/zikr/use-zikr-audio";
import type { VoiceSteps } from "@/hooks/use-voice-tasbeeh-steps";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

function audio(overrides: Partial<ZikrAudioControl> = {}): ZikrAudioControl {
  return { available: true, playing: false, toggle: jest.fn(), stop: jest.fn(), ...overrides };
}

function handsFree(overrides: Partial<VoiceSteps> = {}): VoiceSteps {
  return {
    voice: { listening: false } as VoiceSteps["voice"],
    offered: true,
    eligible: true,
    on: false,
    needsChoice: false,
    atLimit: false,
    stopNotice: null,
    sheetOpen: false,
    toggle: jest.fn(),
    teach: jest.fn(),
    skipTeaching: jest.fn(),
    closeSheet: jest.fn(),
    ...overrides,
  };
}

const base = {
  done: false,
  canUndo: true,
  onUndo: jest.fn(),
  onComplete: jest.fn(),
  onReset: jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("AdhkarActionRow", () => {
  it("shows Undo · Play · Hands-free · Done as one row of labelled buttons", async () => {
    const control = audio();
    const steps = handsFree();
    await renderWithTheme(<AdhkarActionRow {...base} audio={control} handsFree={steps} />);

    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Play the recitation" }));
    expect(control.toggle).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Start hands-free counting" }));
    expect(steps.toggle).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Mark complete" }));
    expect(base.onComplete).toHaveBeenCalled();
    expect(screen.getByText("Done")).toBeTruthy();
  });

  it("hides Play when the zikr has no audio and shows Pause while it plays", async () => {
    const view = await renderWithTheme(
      <AdhkarActionRow {...base} audio={audio({ available: false })} />,
    );
    expect(screen.queryByRole("button", { name: "Play the recitation" })).toBeNull();

    await view.rerender(<AdhkarActionRow {...base} audio={audio({ playing: true })} />);
    expect(screen.getByRole("button", { name: "Pause the recitation" })).toBeTruthy();
    expect(screen.getByText("Pause")).toBeTruthy();
  });

  it("greys Undo at zero instead of hiding it, and turns Done into Reset when complete", async () => {
    await renderWithTheme(<AdhkarActionRow {...base} canUndo={false} done />);
    const undo = screen.getByRole("button", { name: "Undo" });
    expect(undo.props.accessibilityState).toMatchObject({ disabled: true });
    await fireEvent.press(screen.getByRole("button", { name: "Mark not done" }));
    expect(base.onReset).toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Mark complete" })).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("never offers hands-free", async () => {
      await renderWithTheme(<AdhkarActionRow {...base} handsFree={handsFree()} />);
      expect(screen.queryByRole("button", { name: "Start hands-free counting" })).toBeNull();
    });
  });
});
