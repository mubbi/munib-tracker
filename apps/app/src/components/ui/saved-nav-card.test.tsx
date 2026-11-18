import { fireEvent, screen } from "@testing-library/react-native";

import { SavedNavCard } from "@/components/ui/saved-nav-card";
import { renderWithTheme } from "@/test-support/render";

const renderCard = (onPress = jest.fn()) =>
  renderWithTheme(
    <SavedNavCard
      title="Saved"
      viewLabel="View bookmarks"
      count={3}
      onPress={onPress}
      headerIcon="bookmark"
      rowIcon="bookmark.fill"
    />,
  );

describe("SavedNavCard", () => {
  it("shows the section title", async () => {
    await renderCard();

    expect(screen.getByText("Saved")).toBeTruthy();
  });

  it("navigates from the counted row", async () => {
    const onPress = jest.fn();
    await renderCard(onPress);

    await fireEvent.press(screen.getByLabelText("View bookmarks, 3"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
