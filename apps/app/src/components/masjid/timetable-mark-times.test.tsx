import { fireEvent, screen } from "@testing-library/react-native";
import { Image } from "react-native";

import { TimetableMarkTimes } from "@/components/masjid/timetable-mark-times";
import { renderWithProviders } from "@/test-support/render";

jest.mock("@/lib/timetable-ocr", () => ({
  readMarkedTime: jest.fn(async () => null),
  releaseRegionReader: jest.fn(async () => undefined),
}));

const ocrModule = jest.requireMock("@/lib/timetable-ocr") as {
  releaseRegionReader: jest.Mock;
};

beforeEach(() => {
  jest.spyOn(Image, "getSize").mockImplementation((_uri, ok) => ok?.(400, 800));
});

afterEach(() => jest.restoreAllMocks());

/** The time field of a Salah (its chip carries the same name). */
const field = (prayer: string) =>
  screen.getAllByLabelText(prayer).find((node) => node.type === "TextInput") ??
  screen.getByLabelText(`${prayer} (field)`);

function setup(initial = {}) {
  const onDone = jest.fn();
  const onCancel = jest.fn();
  return {
    onDone,
    onCancel,
    render: () =>
      renderWithProviders(
        <TimetableMarkTimes
          photoUri="file:///board.jpg"
          ocr={null}
          initial={initial}
          onDone={onDone}
          onCancel={onCancel}
        />,
      ),
  };
}

describe("TimetableMarkTimes (guided import)", () => {
  it("starts at the first Salah the automatic read missed", async () => {
    await setup({ fajr: "05:00" }).render();
    expect(screen.getByText("Drag a box around the time for Dhuhr")).toBeTruthy();
    expect(screen.getByDisplayValue("05:00")).toBeTruthy();
  });

  it("hands the typed and pre-filled times on for review", async () => {
    const { onDone, render } = setup({ fajr: "05:00" });
    await render();
    const continueButton = screen.getByRole("button", { name: "Check the times" });
    await fireEvent.changeText(field("Isha"), "8:15");
    await fireEvent.press(continueButton);
    expect(onDone).toHaveBeenCalledWith(
      expect.objectContaining({ fajr: "05:00", isha: "8:15", asr: "" }),
    );
  });

  it("blocks a time that isn't a time", async () => {
    const { onDone, render } = setup({ fajr: "05:00" });
    await render();
    await fireEvent.changeText(field("Asr"), "5:7");
    expect(screen.getByText("1 time isn't in HH:MM format yet.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Check the times" }));
    expect(onDone).not.toHaveBeenCalled();
  });

  it("can't continue with nothing marked or typed", async () => {
    const { onDone, onCancel, render } = setup();
    await render();
    await fireEvent.press(screen.getByRole("button", { name: "Check the times" }));
    expect(onDone).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("switches the Salah being marked", async () => {
    await setup().render();
    await fireEvent.press(screen.getByRole("button", { name: "Mark Maghrib" }));
    expect(screen.getByText("Drag a box around the time for Maghrib")).toBeTruthy();
  });

  it("stops the area reader when it closes", async () => {
    const view = await setup().render();
    view.unmount();
    expect(ocrModule.releaseRegionReader).toHaveBeenCalled();
  });
});
