import { fireEvent, screen } from "@testing-library/react-native";
import { createRef } from "react";
import { AccessibilityInfo, Text, type TextInputInstance } from "react-native";

import { TextField } from "@/components/ui/text-field";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

describe("TextField", () => {
  it("labels the input and forwards changes and the ref", async () => {
    const onChangeText = jest.fn();
    const ref = createRef<TextInputInstance>();
    await renderWithTheme(
      <TextField ref={ref} label="Name" value="" onChangeText={onChangeText} />,
    );

    await fireEvent.changeText(screen.getByLabelText("Name"), "Aisha");

    expect(onChangeText).toHaveBeenCalledWith("Aisha");
    expect(ref.current).toBeTruthy();
    expect(screen.getByText("Name")).toBeTruthy();
  });

  it("shows helper text, replaced by the error which is an alert live region", async () => {
    const view = await renderWithTheme(
      <TextField label="Name" helperText="As on your ID" value="" />,
    );
    expect(screen.getByText("As on your ID")).toBeTruthy();

    await view.rerender(
      <TextField label="Name" helperText="As on your ID" error="Enter a name" value="" />,
    );

    expect(screen.queryByText("As on your ID")).toBeNull();
    expect(screen.getByText("Enter a name")).toBeTruthy();
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("shows a counter and enforces maxLength", async () => {
    await renderWithTheme(<TextField label="Note" value="abc" maxLength={10} />);

    expect(screen.getByText("3/10")).toBeTruthy();
    expect(screen.getByLabelText("Note").props.maxLength).toBe(10);
  });

  it("is not editable when disabled", async () => {
    await renderWithTheme(<TextField label="Name" value="" disabled />);

    expect(screen.getByLabelText("Name").props.editable).toBe(false);
  });

  it("passes secure and multiline through and renders slots", async () => {
    await renderWithTheme(
      <TextField
        label="Pin"
        value=""
        secureTextEntry
        multiline
        leading={<Text>L</Text>}
        trailing={<Text>T</Text>}
      />,
    );

    const input = screen.getByLabelText("Pin");
    expect(input.props.secureTextEntry).toBe(true);
    expect(input.props.multiline).toBe(true);
    expect(screen.getByText("L")).toBeTruthy();
    expect(screen.getByText("T")).toBeTruthy();
  });

  it("marks optional", async () => {
    await renderWithTheme(<TextField label="Name" value="" optional />);

    expect(screen.getByText("Optional")).toBeTruthy();
  });

  describe("ios", () => {
    usePlatform({ OS: "ios" });
    it("announces a new error", async () => {
      const spy = jest
        .spyOn(AccessibilityInfo, "announceForAccessibility")
        .mockImplementation(() => {});
      const view = await renderWithTheme(<TextField label="Name" value="" />);
      await view.rerender(<TextField label="Name" value="" error="Enter a name" />);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith("Error: Enter a name");
      spy.mockRestore();
    });
  });

  describe("web", () => {
    usePlatform({ OS: "web" });
    it("sets aria-invalid and aria-describedby", async () => {
      await renderWithTheme(<TextField label="Name" value="" error="Enter a name" required />);

      const input = screen.getByLabelText("Name");
      expect(input.props["aria-invalid"]).toBe(true);
      expect(input.props["aria-required"]).toBe(true);
      expect(String(input.props["aria-describedby"])).toContain("message");
    });
  });
});
