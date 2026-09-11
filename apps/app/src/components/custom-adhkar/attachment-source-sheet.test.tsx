import { fireEvent, render, screen } from "@testing-library/react-native";
import { Platform } from "react-native";

import { AttachmentSourceSheet } from "@/components/custom-adhkar/attachment-source-sheet";
import { MunibThemeProvider } from "@/providers/theme-provider";

jest.mock("@/components/ui/sheet", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Sheet: ({ children, visible }: { children?: React.ReactNode; visible: boolean }) =>
      visible ? React.createElement(View, { testID: "attachment-sheet" }, children) : null,
  };
});

function renderSheet(
  props: { visible?: boolean; embedded?: boolean; onSelect?: jest.Mock; onClose?: jest.Mock } = {},
) {
  const onSelect = props.onSelect ?? jest.fn();
  const onClose = props.onClose ?? jest.fn();
  render(
    <MunibThemeProvider>
      <AttachmentSourceSheet
        visible={props.visible ?? true}
        embedded={props.embedded}
        onClose={onClose}
        onSelect={onSelect}
      />
    </MunibThemeProvider>,
  );
  return { onSelect, onClose };
}

describe("AttachmentSourceSheet", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("renders nothing when the embedded picker is closed", () => {
    renderSheet({ embedded: true, visible: false });
    expect(screen.queryByText("Add attachment")).toBeNull();
    expect(screen.queryByLabelText("Cancel")).toBeNull();
  });

  it("shows an in-place list that selects a source and can cancel", () => {
    Platform.OS = "ios";
    const { onSelect, onClose } = renderSheet({ embedded: true, visible: true });

    expect(screen.getByText("Add attachment")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Take a photo"));
    expect(onSelect).toHaveBeenCalledWith("camera");

    fireEvent.press(screen.getByLabelText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("only offers the document picker on web", () => {
    Platform.OS = "web";
    renderSheet({ embedded: true, visible: true });

    expect(screen.getByLabelText("Files")).toBeTruthy();
    expect(screen.queryByLabelText("Take a photo")).toBeNull();
    expect(screen.queryByLabelText("Photo library")).toBeNull();
  });

  it("renders source options inside a sheet when not embedded", () => {
    Platform.OS = "ios";
    const { onSelect } = renderSheet({ visible: true });

    expect(screen.getByTestId("attachment-sheet")).toBeTruthy();
    fireEvent.press(screen.getByLabelText("Photo library"));
    expect(onSelect).toHaveBeenCalledWith("gallery");
  });
});
