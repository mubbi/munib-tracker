import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import AdhkarBuilderScreen from "@/app/adhkar-builder";
import { customAdhkarStore } from "@/stores/custom-adhkar-store";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

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

const titles = () => customAdhkarStore.getState().items.map((item) => item.title);

describe("Adhkar builder confirmations (WP3 Issue C)", () => {
  beforeEach(async () => {
    resetExpoRouterMock();
    customAdhkarStore.setState({ items: [], isReady: true });
    await act(async () => {
      await customAdhkarStore.getState().create({ title: "My evening dua", arabic: "" });
    });
  });

  it("asks before deleting and keeps the adhkar when the user cancels", async () => {
    await renderWithProviders(<AdhkarBuilderScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByText("Delete this adhkar?")).toBeTruthy();
    expect(screen.getByText("“My evening dua” will be removed permanently.")).toBeTruthy();
    expect(titles()).toEqual(["My evening dua"]);

    await fireEvent.press(screen.getAllByRole("button", { name: "Cancel" }).at(-1) as never);
    await waitFor(() => expect(screen.queryByText("Delete this adhkar?")).toBeNull());
    expect(titles()).toEqual(["My evening dua"]);
  });

  // The Undo that follows is covered by tv-undo.feature.test.tsx (on-page Undo on TV).
  it("deletes once confirmed", async () => {
    await renderWithProviders(<AdhkarBuilderScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: "Delete" }));
    await fireEvent.press(screen.getAllByRole("button", { name: "Delete" }).at(-1) as never);

    await waitFor(() => expect(titles()).toEqual([]));
  });

  it("renders the discard confirm inside the open form sheet (iOS cannot stack modals)", async () => {
    await renderWithProviders(<AdhkarBuilderScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: "Add adhkar" }));
    await fireEvent.changeText(await screen.findByLabelText("Title"), "Draft");
    await fireEvent.press(screen.getAllByRole("button", { name: "Cancel" }).at(-1) as never);

    const heading = await screen.findByText("Discard changes?");
    // The form sheet is a dialog named after its title; the confirm must be inside it.
    const formSheet = screen.getByLabelText("New adhkar");
    let node: typeof heading | null = heading;
    let inside = false;
    while (node) {
      if (node === formSheet) inside = true;
      node = node.parent as typeof heading | null;
    }
    expect(inside).toBe(true);

    await fireEvent.press(screen.getByRole("button", { name: "Discard" }));
    await waitFor(() => expect(screen.queryByLabelText("Title")).toBeNull());
  });
});
