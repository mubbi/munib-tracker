import { fireEvent, screen } from "@testing-library/react-native";

import i18n from "@/i18n";
import { indexSignals } from "@/lib/circles/family";
import {
  ALL_FIVE,
  makeChildProfile,
  makeFardSignal,
  makeRestDaySignal,
} from "@/test-support/circles";
import { renderWithProviders } from "@/test-support/render";

import { ChildCard } from "./child-card";

const TODAY = "2026-11-24";
const t = i18n.t.bind(i18n);

describe("ChildCard (parent view, D7)", () => {
  it("shows only the five statuses, the weekly line and the reward bar", async () => {
    const days = indexSignals([
      makeFardSignal("child-1", TODAY, { fajr: true, dhuhr: true }),
      makeFardSignal("child-1", "2026-11-23", ALL_FIVE),
      makeRestDaySignal("child-1", "2026-11-22"),
    ]).get("child-1");
    await renderWithProviders(
      <ChildCard
        child={makeChildProfile({ reward: { title: "Park trip", days: 7 } })}
        days={days}
        today={TODAY}
        canEdit={false}
      />,
    );
    expect(screen.getByText("Ali")).toBeTruthy();
    expect(
      screen.getByLabelText(`${t("prayers.fajr")}: ${t("family.status.logged")}`),
    ).toBeTruthy();
    expect(
      screen.getByLabelText(`${t("prayers.isha")}: ${t("family.status.notLogged")}`),
    ).toBeTruthy();
    expect(
      screen.getByText(t("family.digest", { name: "Ali", prayed: 7, possible: 30 })),
    ).toBeTruthy();
    expect(
      screen.getByText(t("family.reward.progress", { title: "Park trip", done: 1, target: 7 })),
    ).toBeTruthy();
    // Never a "missed" mark, no comparison, no qaza.
    expect(screen.queryByText(/missed|qaza/i)).toBeNull();
  });

  it("lets a parent log on the child's behalf", async () => {
    const onToggle = jest.fn();
    await renderWithProviders(
      <ChildCard
        child={makeChildProfile()}
        days={undefined}
        today={TODAY}
        canEdit
        onToggle={onToggle}
      />,
    );
    fireEvent.press(screen.getByRole("checkbox", { name: t("prayers.asr") }));
    expect(onToggle).toHaveBeenCalledWith("asr", {
      fajr: false,
      dhuhr: false,
      asr: true,
      maghrib: false,
      isha: false,
    });
  });

  it("uses the learning line under 7", async () => {
    await renderWithProviders(
      <ChildCard
        child={makeChildProfile({ ageBand: "learning" })}
        days={undefined}
        today={TODAY}
        canEdit={false}
      />,
    );
    expect(screen.getByText(t("family.digestLearning"))).toBeTruthy();
  });

  it.each([
    [13, "family.graduation.available"],
    [15, "family.graduation.reprompt"],
  ])("offers graduation at %i with the matching wording (E13)", async (age, key) => {
    const birthYear = new Date().getUTCFullYear() - age;
    await renderWithProviders(
      <ChildCard
        child={makeChildProfile({ birthYear, ageBand: "graduate", graduationAvailable: true })}
        days={undefined}
        today={TODAY}
        canEdit={false}
      />,
    );
    expect(screen.getByText(t(key))).toBeTruthy();
  });
});
