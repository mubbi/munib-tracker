import { fireEvent, screen } from "@testing-library/react-native";

import { LessonCompleteButton } from "@/components/lesson-complete-button";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const renderButton = async (completed: boolean) => {
  const onToggle = jest.fn();
  await renderWithTheme(
    <LessonCompleteButton ns="salahGuide" completed={completed} onToggle={onToggle} />,
  );
  return onToggle;
};

describe("LessonCompleteButton", () => {
  it("asks for confirmation before marking complete", async () => {
    const onToggle = await renderButton(false);

    await fireEvent.press(screen.getByRole("button"));

    expect(screen.getByText("Mark as complete?")).toBeTruthy();
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("marks complete once confirmed", async () => {
    const onToggle = await renderButton(false);
    await fireEvent.press(screen.getByRole("button"));

    await fireEvent.press(screen.getByText("Mark complete"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("dismisses the confirmation without toggling", async () => {
    const onToggle = await renderButton(false);
    await fireEvent.press(screen.getAllByRole("button")[0]!);

    await fireEvent.press(screen.getByText("Cancel"));

    expect(onToggle).not.toHaveBeenCalled();
    expect(screen.queryByText("Mark as complete?")).toBeNull();
  });

  it("un-marks immediately when already complete", async () => {
    const onToggle = await renderButton(true);

    await fireEvent.press(screen.getByRole("button"));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Mark as complete?")).toBeNull();
  });
});
