import { fireEvent, screen } from "@testing-library/react-native";

import { AttachmentSourceSheet } from "@/components/custom-adhkar/attachment-source-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

async function renderSheet(props: { visible?: boolean; embedded?: boolean } = {}) {
  const onSelect = jest.fn();
  const onClose = jest.fn();
  await renderWithTheme(
    <AttachmentSourceSheet
      visible={props.visible ?? true}
      embedded={props.embedded}
      onClose={onClose}
      onSelect={onSelect}
    />,
  );
  return { onSelect, onClose };
}

describe("AttachmentSourceSheet", () => {
  it("renders nothing when the embedded picker is closed", async () => {
    await renderSheet({ embedded: true, visible: false });
    expect(screen.queryByText("Add attachment")).toBeNull();
    expect(screen.queryByLabelText("Cancel")).toBeNull();
  });

  it("selects a source from the in-place list", async () => {
    const { onSelect } = await renderSheet({ embedded: true });
    expect(screen.getByText("Add attachment")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Take a photo"));
    expect(onSelect).toHaveBeenCalledWith("camera");
  });

  it("cancels the in-place list", async () => {
    const { onClose } = await renderSheet({ embedded: true });
    await fireEvent.press(screen.getByLabelText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders source options inside a sheet when not embedded", async () => {
    const { onSelect } = await renderSheet();
    expect(screen.getByTestId("sheet")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Photo library"));
    expect(onSelect).toHaveBeenCalledWith("gallery");
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("only offers the document picker", async () => {
      await renderSheet({ embedded: true });
      expect(screen.getByLabelText("Files")).toBeTruthy();
      expect(screen.queryByLabelText("Take a photo")).toBeNull();
      expect(screen.queryByLabelText("Photo library")).toBeNull();
    });
  });
});
