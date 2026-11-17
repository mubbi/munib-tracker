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

async function renderSheet(
  props: { visible?: boolean; embedded?: boolean; onSelect?: jest.Mock; onClose?: jest.Mock } = {},
) {
  const onSelect = props.onSelect ?? jest.fn();
  const onClose = props.onClose ?? jest.fn();
  await render(
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

  it("renders nothing when the embedded picker is closed", async () => {
    await renderSheet({ embedded: true, visible: false });
    expect(screen.queryByText("Add attachment")).toBeNull();
    expect(screen.queryByLabelText("Cancel")).toBeNull();
  });

  it("shows an in-place list that selects a source and can cancel", async () => {
    Platform.OS = "ios";
    const { onSelect, onClose } = await renderSheet({ embedded: true, visible: true });

    expect(screen.getByText("Add attachment")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Take a photo"));
    expect(onSelect).toHaveBeenCalledWith("camera");

    await fireEvent.press(screen.getByLabelText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("only offers the document picker on web", async () => {
    Platform.OS = "web";
    await renderSheet({ embedded: true, visible: true });

    expect(screen.getByLabelText("Files")).toBeTruthy();
    expect(screen.queryByLabelText("Take a photo")).toBeNull();
    expect(screen.queryByLabelText("Photo library")).toBeNull();
  });

  it("renders source options inside a sheet when not embedded", async () => {
    Platform.OS = "ios";
    const { onSelect } = await renderSheet({ visible: true });

    expect(screen.getByTestId("attachment-sheet")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Photo library"));
    expect(onSelect).toHaveBeenCalledWith("gallery");
  });
});
