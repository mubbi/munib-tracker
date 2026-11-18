import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { PinShell } from "@/features/pin-lock/components/pin-shell";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof PinShell>[0];

function renderShell(props: Partial<Props> = {}) {
  return renderWithTheme(<PinShell title="Enter PIN" subtitle="Six digits" {...props} />);
}

describe("PinShell", () => {
  it("renders the title and subtitle", async () => {
    await renderShell();
    expect(screen.getByText("Enter PIN")).toBeTruthy();
    expect(screen.getByText("Six digits")).toBeTruthy();
  });

  it("omits an empty subtitle", async () => {
    await renderShell({ subtitle: "" });
    expect(screen.queryByText("Six digits")).toBeNull();
  });

  it("shows the error message", async () => {
    await renderShell({ errorMessage: "Wrong PIN", shakeTrigger: "Wrong PIN", dotsError: true });
    expect(screen.getByText("Wrong PIN")).toBeTruthy();
  });

  it("renders the footer and keypad slots", async () => {
    await renderShell({
      presentation: "lock",
      footer: <Text>footer-slot</Text>,
      keypad: <Text>keypad-slot</Text>,
    });
    expect(screen.getByText("footer-slot")).toBeTruthy();
    expect(screen.getByText("keypad-slot")).toBeTruthy();
  });

  it("has no close button without onClose", async () => {
    await renderShell();
    expect(screen.queryByLabelText("Close")).toBeNull();
  });

  it.each([
    [false, 1],
    [true, 0],
  ])(
    "close button with closeDisabled=%s calls onClose %i time(s)",
    async (closeDisabled, calls) => {
      const onClose = jest.fn();
      await renderShell({ onClose, closeDisabled });
      await fireEvent.press(screen.getByLabelText("Close"));
      expect(onClose).toHaveBeenCalledTimes(calls);
    },
  );

  it("replaces the PIN block with the success body", async () => {
    await renderShell({
      title: "PIN saved",
      successBody: <Text>success-body</Text>,
      keypad: <Text>keypad-slot</Text>,
    });
    expect(screen.getByText("success-body")).toBeTruthy();
    expect(screen.queryByText("keypad-slot")).toBeNull();
  });

  describe.each(["android", "web"] as const)("on %s", (os) => {
    usePlatform({ OS: os });

    it("renders the PIN block", async () => {
      await renderShell();
      expect(screen.getByText("Six digits")).toBeTruthy();
    });
  });
});
