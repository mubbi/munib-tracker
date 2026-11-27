import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import TourScreen from "@/app/tour";
import { toursStore } from "@/stores/tours-store";
import {
  mockRouter,
  mockRouterCanDismiss,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { queryHostsByRole } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const press = (label: string) => fireEvent.press(screen.getByRole("button", { name: label }));
const seen = () => toursStore.getState().seen;

beforeEach(async () => {
  resetExpoRouterMock();
  mockRouterCanDismiss.mockReturnValue(false);
  await act(async () => toursStore.getState().reset());
});

describe("feature tour (G-90, F-50)", () => {
  it("Back leaves without marking the tour seen", async () => {
    await renderWithTheme(<TourScreen />);
    await press("Go back");
    expect(mockRouter.replace).toHaveBeenCalledWith("/");
    expect(seen()).toEqual([]);
  });

  it("Skip marks the tour seen", async () => {
    await renderWithTheme(<TourScreen />);
    await press("Skip");
    await waitFor(() => expect(seen()).toEqual(["explore"]));
  });

  it("Done on the last step marks it seen, and Skip is not repeated there", async () => {
    await renderWithTheme(<TourScreen />);
    let guard = 0;
    while (screen.queryByRole("button", { name: "Done" }) == null && guard++ < 60) {
      await press("Next");
    }
    expect(screen.queryByRole("button", { name: "Skip" })).toBeNull();
    await press("Done");
    await waitFor(() => expect(seen()).toEqual(["explore"]));
  });

  it("the previous-step button walks back without leaving or marking seen", async () => {
    await renderWithTheme(<TourScreen />);
    await press("Next");
    await press("Back");
    expect(screen.getByLabelText(/^Step 1 of/)).toBeTruthy();
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(seen()).toEqual([]);
  });

  it("speaks the new step and keeps the dots decorative", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    await renderWithTheme(<TourScreen />);
    await press("Next");
    expect(announce).toHaveBeenCalledWith(expect.stringMatching(/^Step 2 of \d+, /));
    announce.mockRestore();
    // No pressable page dots (they were 8pt targets) — every control is ≥ 24pt.
    const undersized = queryHostsByRole("button").filter((node) => {
      const style = flattenStyle(node.props.style);
      const height = style.height ?? style.minHeight;
      return typeof height === "number" && height < 24;
    });
    expect(undersized).toEqual([]);
  });

  it("falls back to the explore tour for an unknown id", async () => {
    setMockSearchParams({ tour: "nope" });
    await renderWithTheme(<TourScreen />);
    expect(screen.getByText("Explore Munib")).toBeTruthy();
  });
});
