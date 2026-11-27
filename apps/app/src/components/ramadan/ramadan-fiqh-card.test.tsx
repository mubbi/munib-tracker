import { fireEvent, screen } from "@testing-library/react-native";

import { FidyahFiqhPanel } from "@/components/fidyah/fidyah-fiqh-panel";
import { RamadanFiqhCard } from "@/components/ramadan/ramadan-fiqh-card";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";

afterEach(resetPreferences);

const VALID = /Your fast is still valid/;
const MAKE_UP = /Make this day up later; no kaffarah is due/;

async function openForgetful(madhhab: "hanafi" | "maliki" | null) {
  await renderWithTheme(<RamadanFiqhCard />);
  await setPreferences({ madhhab });
  const label = "I ate or drank forgetfully";
  // First the collapsible header, then the helper's own button (same label).
  await fireEvent.press(screen.getByRole("button", { name: label }));
  const buttons = screen.getAllByRole("button", { name: label });
  await fireEvent.press(buttons[buttons.length - 1] as (typeof buttons)[number]);
}

describe("RamadanFiqhCard — forgetful eating", () => {
  it("Hanafi: the fast stays valid", async () => {
    await openForgetful("hanafi");
    expect(screen.getByText(VALID)).toBeTruthy();
    expect(screen.queryByText(MAKE_UP)).toBeNull();
  });

  it("Maliki: continue, then make the day up", async () => {
    await openForgetful("maliki");
    expect(screen.getByText(MAKE_UP)).toBeTruthy();
    expect(screen.queryByText(VALID)).toBeNull();
  });

  it("all views: shows both outcomes, labelled by school", async () => {
    await openForgetful(null);
    expect(screen.getAllByText(VALID)).toHaveLength(3);
    expect(screen.getAllByText(MAKE_UP)).toHaveLength(1);
  });
});

describe("FidyahFiqhPanel", () => {
  it("Hanafi fidyah: half a sa' of wheat, cash allowed", async () => {
    await renderWithTheme(<FidyahFiqhPanel scenario="fidyah" people={3} />);
    await setPreferences({ madhhab: "hanafi" });
    expect(screen.getByText(/½ sa' of wheat/)).toBeTruthy();
    expect(screen.getByText("Cash value allowed")).toBeTruthy();
    expect(screen.getByText("Poor people to feed: 3. Give each one:")).toBeTruthy();
  });

  it("Shafi'i fidyah: one mudd, food only", async () => {
    await renderWithTheme(<FidyahFiqhPanel scenario="fidyah" people={0} />);
    await setPreferences({ madhhab: "shafii" });
    expect(screen.getByText(/1 mudd of the local staple food/)).toBeTruthy();
    expect(screen.getByText("Food only — give the food itself")).toBeTruthy();
    expect(screen.queryByText("Cash value allowed")).toBeNull();
  });

  it("Shafi'i kaffarah: intercourse only", async () => {
    await renderWithTheme(<FidyahFiqhPanel scenario="kaffarah" people={60} />);
    await setPreferences({ madhhab: "shafii" });
    expect(screen.getByText(/^Intercourse during a Ramadan fast\./)).toBeTruthy();
  });

  it("all views: one block per school, never a silent pick", async () => {
    await renderWithTheme(<FidyahFiqhPanel scenario="fidyah" people={1} />);
    await setPreferences({ madhhab: null });
    expect(screen.getByText(/The schools differ on the measure/)).toBeTruthy();
    expect(screen.getAllByText("Food only — give the food itself")).toHaveLength(3);
    expect(screen.getAllByText("Cash value allowed")).toHaveLength(1);
    expect(screen.getByText(/fidyah for the very elderly/)).toBeTruthy();
  });
});
