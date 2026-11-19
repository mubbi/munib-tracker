import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Card } from "@/components/ui/card";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof Card>[0];

const renderCard = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <Card {...props}>
      <Text>Body</Text>
    </Card>,
  );

const cardStyle = () => flattenStyle(parentOf(screen.getByText("Body")).props.style);

describe("Card", () => {
  it.each([
    ["elevated", { borderWidth: 1 }],
    ["outline", { backgroundColor: "transparent", borderWidth: 1 }],
    ["muted", {}],
    ["plain", {}],
  ] as const)("renders the %s variant as a static view", async (variant, expected) => {
    await renderCard({ variant, padding: 0, radius: "sm" });

    expect(screen.queryByRole("button")).toBeNull();
    expect(cardStyle()).toMatchObject({ padding: 0, ...expected });
  });

  it("merges a caller style", async () => {
    await renderCard({ style: { marginTop: 3 } });

    expect(cardStyle().marginTop).toBe(3);
  });

  it("becomes a pressable button when onPress is set", async () => {
    const onPress = jest.fn();
    await renderCard({ onPress, accessibilityLabel: "Open card" });

    await fireEvent.press(screen.getByRole("button", { name: "Open card" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    [true, true],
    [false, undefined],
  ])("preferredFocus=%s sets hasTVPreferredFocus=%s", async (preferredFocus, expected) => {
    await renderCard({
      onPress: jest.fn(),
      accessibilityLabel: "Card",
      accessibilityState: { selected: true },
      preferredFocus,
    });

    const button = screen.getByLabelText("Card");
    expect(button.props.hasTVPreferredFocus).toBe(expected);
    expect(button.props.accessibilityState).toEqual({ selected: true });
  });
});
