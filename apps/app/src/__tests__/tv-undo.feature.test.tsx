import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import AdhkarBuilderScreen from "@/app/adhkar-builder";
import { TvUndoButton } from "@/components/ui/tv-undo-button";
import { customAdhkarStore } from "@/stores/custom-adhkar-store";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders, renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/attachments/pdf-preview", () => ({ PdfPreview: () => null }));
jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);
jest.mock("@/lib/user-media-api", () => ({
  ...jest.requireActual("@/lib/user-media-api"),
  purgeCustomAdhkarAttachments: jest.fn(() => Promise.resolve()),
}));

const controller = (undoAvailable: boolean) => ({ undoAvailable, undo: jest.fn(() => true) });

describe("TvUndoButton", () => {
  it("renders nothing on phone / web, where the toast carries Undo", async () => {
    await renderWithTheme(<TvUndoButton controller={controller(true)} />);
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("shows Undo only while the change can be undone, and runs it", async () => {
      const open = controller(true);
      const view = await renderWithTheme(<TvUndoButton controller={controller(false)} />);
      expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();

      await view.rerender(<TvUndoButton controller={open} accessibilityHint="Deleted" />);
      await fireEvent.press(screen.getByRole("button", { name: "Undo" }));

      expect(open.undo).toHaveBeenCalledTimes(1);
      expect(screen.getByHintText("Deleted")).toBeTruthy();
    });
  });
});

describe("Adhkar builder on TV (B-04)", () => {
  usePlatform({ isTV: true });

  beforeEach(async () => {
    resetExpoRouterMock();
    customAdhkarStore.setState({ items: [], isReady: true });
    await act(async () => {
      await customAdhkarStore.getState().create({ title: "My evening dua", arabic: "" });
    });
  });

  it("deletes after the confirm but keeps an on-page Undo that restores the item", async () => {
    await renderWithProviders(<AdhkarBuilderScreen />);
    expect(await screen.findByText("My evening dua")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByText("Delete this adhkar?")).toBeTruthy();
    await fireEvent.press(screen.getAllByRole("button", { name: "Delete" }).at(-1) as never);
    await waitFor(() => expect(customAdhkarStore.getState().items).toHaveLength(0));

    await fireEvent.press(await screen.findByRole("button", { name: "Undo" }));
    await waitFor(() =>
      expect(customAdhkarStore.getState().items.map((i) => i.title)).toEqual(["My evening dua"]),
    );
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
  });
});
