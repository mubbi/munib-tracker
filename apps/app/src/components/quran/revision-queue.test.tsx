import { fireEvent, screen } from "@testing-library/react-native";

import { RevisionQueue } from "@/components/quran/revision-queue";
import type { DueItem } from "@/lib/quran-companion/due-queue";
import type { MemorizationRecord } from "@/lib/quran-companion/types";
import { buildDueItem, buildMemorizationRecord } from "@/test-support/fixtures/quran-companion";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof RevisionQueue>[0];

async function renderQueue(overrides: Partial<Props> = {}) {
  const props: Props = {
    items: [buildDueItem()],
    records: {},
    hifz: {},
    onOpen: jest.fn(),
    onNotNow: jest.fn(),
    onStatus: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<RevisionQueue {...props} />);
  return props;
}

describe("RevisionQueue", () => {
  it("names each row by surah and ayah", async () => {
    await renderQueue({ items: [buildDueItem({ surah: 2, ayah: 255 })] });
    expect(screen.getByText("Al-Baqarah 255")).toBeTruthy();
  });

  it("falls back to the surah number for unknown surahs", async () => {
    await renderQueue({ items: [buildDueItem({ surah: 999 })] });
    expect(screen.getByText("999 1")).toBeTruthy();
  });

  it.each<[MemorizationRecord["status"] | undefined, string]>([
    ["needs_revision", "Needs revision"],
    ["practising", "Practicing"],
    ["learning", "Learning"],
    [undefined, "Review"],
  ])("shows the %p status pill", async (status, pill) => {
    const records: Record<string, MemorizationRecord> = status
      ? { "1:1": buildMemorizationRecord({ status }) }
      : {};
    await renderQueue({ records });
    expect(screen.getByText(pill)).toBeTruthy();
  });

  it.each<[Partial<DueItem>, Props["hifz"], string]>([
    [{ overdueDays: 3 }, {}, "3 days overdue"],
    [{ overdueDays: 1 }, {}, "1 day overdue"],
    [{ overdueDays: 0 }, {}, "Due today"],
    [{ overdueDays: 0 }, { "1:1": "memorized" }, "Due today · Marked memorized"],
    [{ overdueDays: 0 }, { "1:1": "review" }, "Due today"],
  ])("describes due item %j with hifz %j", async (item, hifz, caption) => {
    await renderQueue({ items: [buildDueItem(item)], hifz });
    expect(screen.getByText(caption)).toBeTruthy();
  });

  it("opens a row for practice", async () => {
    const item = buildDueItem({ ayah: 2 });
    const props = await renderQueue({ items: [item] });
    await fireEvent.press(screen.getByLabelText("Practice Al-Fatihah 2"));
    expect(props.onOpen).toHaveBeenCalledWith(item);
  });

  it.each([
    ["Not now", "onNotNow"],
    ["Set status", "onStatus"],
  ] as const)("fires %p for its row", async (label, handler) => {
    const items = [buildDueItem({ ayah: 1 }), buildDueItem({ ayah: 2 })];
    const props = await renderQueue({ items });
    await fireEvent.press(screen.getAllByText(label)[1]);
    expect(props[handler]).toHaveBeenCalledWith(items[1]);
  });
});
