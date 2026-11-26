import { fireEvent, screen } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { getSetting } from "@/lib/settings/registry";
import { renderWithTheme } from "@/test-support/render";

import { DangerRow } from "./action-row";
import { ThisDeviceBadge } from "./this-device-badge";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

describe("DangerRow", () => {
  it("reads as an action: tinted well, trailing verb, confirm uses the verb", async () => {
    const onConfirm = jest.fn();
    await renderWithTheme(
      <DangerRow
        title="Clear history"
        subtitle="Device only"
        actionLabel="Clear"
        confirmMessage="Really clear?"
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText("Clear", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getByTestId("danger-row-action", { includeHiddenElements: true })).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Clear history"));
    expect(screen.getByText("Really clear?")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
  });

  it("draws a trash glyph when destructive without a verb, nothing when not destructive", async () => {
    const { unmount } = await renderWithTheme(
      <DangerRow title="Delete all" onConfirm={jest.fn()} />,
    );
    expect(screen.getByTestId("danger-row-action", { includeHiddenElements: true })).toBeTruthy();
    await unmount();

    await renderWithTheme(
      <DangerRow title="Reset settings" destructive={false} onConfirm={jest.fn()} />,
    );
    expect(screen.queryByTestId("danger-row-action", { includeHiddenElements: true })).toBeNull();
  });

  it("shows a title-line accessory such as the This device badge", async () => {
    await renderWithTheme(
      <DangerRow title="Forget voices" accessory={<ThisDeviceBadge />} onConfirm={jest.fn()} />,
    );

    expect(screen.getByTestId("this-device-badge")).toBeTruthy();
    expect(screen.getByText(en.settingsPanel.thisDevice)).toBeTruthy();
  });
});

describe("destructive settings defs", () => {
  it("forget taught voices has an icon, a short subtitle and the privacy note in the confirm", () => {
    const def = getSetting("content.tasbeeh.voice.forgetTaught");
    expect(def?.icon).toBeDefined();
    expect(def?.subtitleKey).toBe("tasbeehVoice.settings.forgetTaughtShort");
    expect(def?.scope).toBe("device");
    const control = def?.control;
    expect(control?.kind).toBe("action");
    if (control?.kind !== "action") return;
    expect(control.confirmKey).toBe("tasbeehVoice.settings.forgetTaughtConfirmPrivacy");
    expect(control.actionLabelKey).toBe("tasbeehVoice.settings.forgetAction");
    expect(en.tasbeehVoice.settings.forgetTaughtConfirmPrivacy).toMatch(
      /No audio is ever recorded/,
    );
  });

  it("clear recent duas and searches gets the same action style", () => {
    const control = getSetting("privacy.clearHistory")?.control;
    expect(control?.kind === "action" && control.actionLabelKey).toBe("settingsPanel.clearAction");
  });
});
