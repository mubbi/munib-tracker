import { fireEvent, screen } from "@testing-library/react-native";

import { DefaultLocationBanner } from "@/components/default-location-banner";
import { locationStore } from "@/stores/location-store";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

const initialLocation = locationStore.getState().location;

beforeEach(resetExpoRouterMock);
afterEach(() => locationStore.setState({ location: initialLocation }));

describe("DefaultLocationBanner", () => {
  it("hides once a real location is set", async () => {
    locationStore.setState({ location: buildStoredLocation() });
    await renderWithTheme(<DefaultLocationBanner />);

    expect(screen.toJSON()).toBeNull();
  });

  it("asks users on the fallback location to set theirs", async () => {
    locationStore.setState({ location: buildStoredLocation({ source: "default" }) });
    await renderWithTheme(<DefaultLocationBanner />);

    expect(screen.getByText("Salah times are for a default city")).toBeTruthy();
    await fireEvent.press(screen.getByText("Set location"));

    expect(mockRouter.push).toHaveBeenCalledWith("/location");
  });
});
