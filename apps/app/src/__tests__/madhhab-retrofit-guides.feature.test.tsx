import { JANAZAH_GUIDE_TOPICS } from "@munib-tracker/shared/content/janazah-guide";
import { act, fireEvent, screen } from "@testing-library/react-native";

import FiqhDifferenceScreen, { generateStaticParams } from "@/app/fiqh/[id]";
import UmrahChecklistScreen from "@/app/umrah/checklist";
import { preferencesStore } from "@/stores/preferences-store";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { setPreferences } from "@/test-support/preferences";
import { renderWithProviders } from "@/test-support/render";
import { resetSettingsStores } from "@/test-support/settings";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

beforeEach(async () => {
  resetExpoRouterMock();
  await resetSettingsStores();
});

describe("/fiqh/[id] difference detail (NF-3.0a search target)", () => {
  it("pre-renders one page per catalog difference with dot-free slugs", () => {
    const params = generateStaticParams();
    expect(params).toContainEqual({ id: "witr-status" });
    expect(params.every((p) => !p.id.includes("."))).toBe(true);
  });

  it("shows the comparison, every school's evidence and the guide links", async () => {
    setMockSearchParams({ id: "janazah-fatiha" });
    await renderWithProviders(<FiqhDifferenceScreen />);
    await setPreferences({ madhhab: null });
    expect(screen.getAllByText("Al-Fatihah in the janazah Salah").length).toBeGreaterThan(0);
    expect(screen.getByTestId(/ruling-compare-.*shafii/)).toBeTruthy();
    expect(screen.getByText("Evidence and sources")).toBeTruthy();
    expect(screen.getAllByText("Sahih al-Bukhari 1335").length).toBeGreaterThan(0);
    expect(screen.getByText("Read more in the guides")).toBeTruthy();
    const takbirSteps = JANAZAH_GUIDE_TOPICS.find((t) => t.id === "takbir-steps");
    await fireEvent.press(screen.getByText(takbirSteps?.title ?? ""));
    expect(mockRouter.push).toHaveBeenCalledWith("/janazah/takbir-steps");
  });

  it("opens a hadith ref in the reader", async () => {
    setMockSearchParams({ id: "janazah-fatiha" });
    await renderWithProviders(<FiqhDifferenceScreen />);
    const link = screen.getAllByRole("link", { name: "Sahih al-Bukhari 1335" })[0];
    if (!link) throw new Error("hadith ref link not rendered");
    await fireEvent.press(link);
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/hadith/[collection]",
      params: { collection: "bukhari", q: "1335" },
    });
  });

  it("shows a not-found state for an unknown slug", async () => {
    setMockSearchParams({ id: "nope-nope" });
    await renderWithProviders(<FiqhDifferenceScreen />);
    expect(screen.getByText("This comparison wasn't found.")).toBeTruthy();
  });
});

// The onboarding madhhab step (§4.1.1 item 1) is covered by the setup wizard
// suite: `__tests__/setup-flow.feature.test.tsx`.

describe("umrah checklist (registered screen anchor /umrah/checklist)", () => {
  it("renders the tawaf wudu note", async () => {
    await renderWithProviders(<UmrahChecklistScreen />);
    await act(async () => preferencesStore.getState().update({ madhhab: "hanafi" }));
    expect(screen.getByText("Wudu for tawaf")).toBeTruthy();
  });
});
