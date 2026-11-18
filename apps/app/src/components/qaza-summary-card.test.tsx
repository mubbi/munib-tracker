import { fireEvent, screen } from "@testing-library/react-native";

import { QazaSummaryCard } from "@/components/qaza-summary-card";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof QazaSummaryCard>[0];

const renderCard = async (props: Partial<Props> = {}) => {
  const onPress = jest.fn();
  await renderWithTheme(
    <QazaSummaryCard remaining={30} completed={10} onPress={onPress} {...props} />,
  );
  return onPress;
};

describe("QazaSummaryCard", () => {
  it("is hidden once every prayer and fast is made up", async () => {
    await renderCard({ remaining: 0, completed: 40 });

    expect(screen.toJSON()).toBeNull();
  });

  it("shows remaining and made-up counts with progress", async () => {
    await renderCard();

    expect(screen.getByText("30")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText(/25%/)).toBeTruthy();
  });

  it("opens the qaza manager", async () => {
    const onPress = await renderCard();

    await fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalled();
  });

  it("shows only the roza line when no prayers are owed", async () => {
    await renderCard({ remaining: 0, completed: 0, rozaRemaining: 4 });

    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.queryByText(/%/)).toBeNull();
  });
});
