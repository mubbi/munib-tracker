import { fireEvent, screen } from "@testing-library/react-native";

import { ReferenceLine } from "@/components/content/reference-line";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

describe("ReferenceLine", () => {
  beforeEach(resetExpoRouterMock);

  it("links a Qur'an reference to the reader", async () => {
    await renderWithTheme(<ReferenceLine reference="Qur'an 2:255" />);
    await fireEvent.press(screen.getByLabelText("Open reference Qur'an 2:255"));
    expect(mockRouter.push).toHaveBeenCalled();
  });

  it("keeps unknown references as plain text", async () => {
    await renderWithTheme(<ReferenceLine reference="Ibn Kathir, Tafsir" />);
    expect(screen.getByText("Reference: Ibn Kathir, Tafsir")).toBeTruthy();
    expect(screen.queryByLabelText(/Open reference/)).toBeNull();
  });
});
