import { fireEvent, screen } from "@testing-library/react-native";

import {
  CustomTasbeehFormModal,
  type CustomTasbeehFormValues,
} from "@/components/tasbeeh/custom-tasbeeh-form-modal";
import { TvLayout } from "@/constants/tv-layout";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
// Imported transitively (reading typography → audio provider); never played here.
jest.mock("expo-audio", () => ({ __esModule: true }));

// The first render warms the theme + i18n graph, which is slow on a busy machine.

type Props = Parameters<typeof CustomTasbeehFormModal>[0];

function buildValues(overrides: Partial<CustomTasbeehFormValues> = {}): CustomTasbeehFormValues {
  return { title: "Salawat", description: "Friday", target: 313, ...overrides };
}

async function renderForm(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    mode: "create",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  const view = await renderWithTheme(<CustomTasbeehFormModal {...props} />);
  return { props, view };
}

const type = async (label: string, text: string) =>
  await fireEvent.changeText(screen.getByLabelText(label), text);
const pick = async (preset: string) =>
  await fireEvent.press(screen.getByRole("tab", { name: preset }));
const createButton = () => screen.getByRole("button", { name: "Create counter" });

describe("CustomTasbeehFormModal", () => {
  it.each([
    { mode: "create" as const, title: "New counter", action: "Create counter" },
    { mode: "edit" as const, title: "Edit counter", action: "Save" },
  ])("labels the $mode form", async ({ mode, title, action }) => {
    await renderForm({ mode });
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByRole("button", { name: action })).toBeTruthy();
  });

  it("defaults to a 33 target and requires a title", async () => {
    await renderForm();
    expect(screen.getByRole("tab", { name: "33" })).toBeSelected();
    expect(createButton()).toBeDisabled();
  });

  it("submits trimmed values and closes", async () => {
    const { props } = await renderForm();
    await type("Title", "  Istighfar  ");
    await type("Description (optional)", " After Fajr ");
    await fireEvent.press(createButton());
    expect(props.onSubmit).toHaveBeenCalledWith({
      title: "Istighfar",
      description: "After Fajr",
      target: 33,
    });
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    { field: "Title", input: "x".repeat(80), counter: "60/60" },
    { field: "Description (optional)", input: "y".repeat(250), counter: "200/200" },
  ])("caps the $field length at $counter", async ({ field, input, counter }) => {
    await renderForm();
    await type(field, input);
    expect(screen.getByText(counter)).toBeTruthy();
  });

  it.each([
    { preset: "unlimited", target: 0 },
    { preset: "99", target: 99 },
    { preset: "100", target: 100 },
  ])("submits the $preset preset as $target", async ({ preset, target }) => {
    const { props } = await renderForm();
    await type("Title", "Zikr");
    await pick(preset);
    await fireEvent.press(createButton());
    expect(props.onSubmit).toHaveBeenCalledWith({ title: "Zikr", description: "", target });
  });

  it("requires a number for a custom target", async () => {
    await renderForm();
    await type("Title", "Durood");
    await pick("Custom");
    expect(createButton()).toBeDisabled();
  });

  it("keeps only up to five digits in a custom target and submits it", async () => {
    const { props } = await renderForm();
    await type("Title", "Durood");
    await pick("Custom");
    await type("e.g. 313", "3a1b3999");
    expect(screen.getByLabelText("e.g. 313").props.value).toBe("31399");
    await fireEvent.press(createButton());
    expect(props.onSubmit).toHaveBeenCalledWith({
      title: "Durood",
      description: "",
      target: 31399,
    });
  });

  it.each([
    { target: 0, tab: "unlimited" },
    { target: 99, tab: "99" },
    { target: 313, tab: "Custom" },
  ])("selects the $tab segment for an initial target of $target", async ({ target, tab }) => {
    await renderForm({ mode: "edit", initial: buildValues({ target }) });
    expect(screen.getByRole("tab", { name: tab })).toBeSelected();
  });

  it("prefills and saves an edited counter", async () => {
    const { props } = await renderForm({ mode: "edit", initial: buildValues() });
    expect(screen.getByLabelText("Title").props.value).toBe("Salawat");
    expect(screen.getByLabelText("e.g. 313").props.value).toBe("313");
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));
    expect(props.onSubmit).toHaveBeenCalledWith(buildValues());
  });

  it("resets the draft when reopened", async () => {
    const { props, view } = await renderForm();
    await type("Title", "Draft");
    await view.rerender(<CustomTasbeehFormModal {...props} visible={false} />);
    await view.rerender(<CustomTasbeehFormModal {...props} visible />);
    expect(screen.getByLabelText("Title").props.value).toBe("");
  });

  it("closes on cancel without submitting", async () => {
    const { props } = await renderForm();
    await fireEvent.press(screen.getByRole("button", { name: "Cancel" }));
    expect(props.onClose).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it.each([
    { tv: false, minHeight: 40 },
    { tv: true, minHeight: TvLayout.chipMinHeight },
  ])("sizes preset segments for focus (tv=$tv)", async ({ tv, minHeight }) => {
    const restore = setPlatform({ isTV: tv });
    try {
      await renderForm();
      expect(flattenStyle(screen.getByRole("tab", { name: "99" }).props.style).minHeight).toBe(
        minHeight,
      );
    } finally {
      restore();
    }
  });
});
