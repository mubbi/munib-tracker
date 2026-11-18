import { fireEvent, screen } from "@testing-library/react-native";

import { WitrQazaInfo } from "@/components/witr-qaza-info";
import { renderWithTheme } from "@/test-support/render";

const card = () => screen.getByRole("button", { name: "Is Witr qaza required?" });

describe("WitrQazaInfo", () => {
  it("starts collapsed", async () => {
    await renderWithTheme(<WitrQazaInfo />);

    expect(card().props.accessibilityState).toMatchObject({ expanded: false });
    expect(screen.queryByText("Hanafi madhhab")).toBeNull();
  });

  it("expands the madhhab rulings and collapses again", async () => {
    await renderWithTheme(<WitrQazaInfo />);

    await fireEvent.press(card());
    expect(screen.getByText("Hanafi madhhab")).toBeTruthy();

    await fireEvent.press(card());
    expect(screen.queryByText("Hanafi madhhab")).toBeNull();
  });
});
