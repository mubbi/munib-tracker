import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import AdhkarBuilderScreen from "@/app/adhkar-builder";
import DuroodTasbeehScreen from "@/app/tasbeeh/durood/[id]";
import ZikrCategoryScreen from "@/app/zikr/[category]";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/attachments/pdf-preview", () => ({ PdfPreview: () => null }));
jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);

const mockLoadDurood = jest.fn();
jest.mock("@/lib/content-loaders", () => ({
  ...jest.requireActual("@/lib/content-loaders"),
  loadDuroodItems: (...args: unknown[]) => mockLoadDurood(...args),
}));

beforeEach(() => {
  resetExpoRouterMock();
  mockLoadDurood.mockReset();
});

describe("WP-5C routes", () => {
  it("keeps the header and offers a retry when a tasbeeh corpus fails to load (B-54)", async () => {
    mockLoadDurood.mockRejectedValueOnce(new Error("offline"));
    setMockSearchParams({ id: "durood-1" });
    await renderWithProviders(<DuroodTasbeehScreen />);

    expect(await screen.findByText("Couldn't load this counter.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    expect(screen.getByText("Tasbeeh")).toBeTruthy();

    mockLoadDurood.mockResolvedValueOnce([]);
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(mockLoadDurood).toHaveBeenCalledTimes(2));
  });

  it("shows a not-found state for an unknown zikr category (B-55)", async () => {
    setMockSearchParams({ category: "not-a-category" });
    await renderWithProviders(<ZikrCategoryScreen />);

    expect(await screen.findByText("Adhkar set not found")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Browse adhkar" }));
    expect(mockRouter.replace).toHaveBeenCalledWith("/zikr");
  });

  it("asks before discarding an unsaved adhkar draft and keeps every field (B-56)", async () => {
    await renderWithProviders(<AdhkarBuilderScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: "Add adhkar" }));

    await fireEvent.changeText(await screen.findByLabelText("Title"), "My dua");
    await fireEvent.press(screen.getAllByRole("button", { name: "Cancel" }).at(-1) as never);

    expect(await screen.findByText("Discard changes?")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Keep editing" }));

    await waitFor(() => expect(screen.queryByText("Discard changes?")).toBeNull());
    expect(screen.getByLabelText("Title").props.value).toBe("My dua");
  });

  it("shows an inline error instead of silently disabling Save (B-66)", async () => {
    await renderWithProviders(<AdhkarBuilderScreen />);
    await fireEvent.press(await screen.findByRole("button", { name: "Add adhkar" }));
    await fireEvent.press(await screen.findByRole("button", { name: "Save" }));

    expect(await screen.findByText("Enter a title to save.")).toBeTruthy();
  });
});
