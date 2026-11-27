import { fireEvent, screen } from "@testing-library/react-native";

import { PracticeReadingCreditLine } from "@/components/quran/practice-session-summary-credit";
import { renderWithTheme } from "@/test-support/render";

describe("PracticeReadingCreditLine (D68)", () => {
  it("renders nothing without a credit or with zero ayahs", async () => {
    await renderWithTheme(<PracticeReadingCreditLine credit={null} />);
    expect(screen.queryByText(/today's reading/)).toBeNull();
    await renderWithTheme(
      <PracticeReadingCreditLine credit={{ sessionId: "s", ayahs: 0, khatm: null }} />,
    );
    expect(screen.queryByText(/today's reading/)).toBeNull();
  });

  it("says how many ayahs were added (singular + plural)", async () => {
    await renderWithTheme(
      <PracticeReadingCreditLine credit={{ sessionId: "s", ayahs: 1, khatm: null }} />,
    );
    expect(screen.getByText("Added 1 ayah to today's reading")).toBeTruthy();
    await renderWithTheme(
      <PracticeReadingCreditLine credit={{ sessionId: "s", ayahs: 7, khatm: null }} />,
    );
    expect(screen.getByText("Added 7 ayahs to today's reading")).toBeTruthy();
    expect(screen.queryByText(/Khatm plan/)).toBeNull();
  });

  it("adds the khatm line and opens the plan on tap", async () => {
    const onOpen = jest.fn();
    await renderWithTheme(
      <PracticeReadingCreditLine
        credit={{ sessionId: "s", ayahs: 7, khatm: { added: 7, unit: "ayah", percent: 12 } }}
        onOpen={onOpen}
      />,
    );
    expect(screen.getByText("Khatm plan now 12% complete")).toBeTruthy();
    fireEvent.press(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("says the ayahs were already counted in this khatm cycle (D72)", async () => {
    await renderWithTheme(
      <PracticeReadingCreditLine
        credit={{
          sessionId: "s",
          ayahs: 3,
          khatm: { added: 0, unit: "ayah", percent: 40, alreadyCounted: true },
        }}
      />,
    );
    expect(screen.getByText("Added 3 ayahs to today's reading")).toBeTruthy();
    expect(screen.getByText("Already counted in your khatm plan — 40% complete")).toBeTruthy();
  });

  it("shows the khatm line alone when only khatm moved", async () => {
    await renderWithTheme(
      <PracticeReadingCreditLine
        credit={{ sessionId: "s", ayahs: 0, khatm: { added: 4, unit: "ayah", percent: 2 } }}
      />,
    );
    expect(screen.getByText("Khatm plan now 2% complete")).toBeTruthy();
    expect(screen.queryByText(/today's reading/)).toBeNull();
  });

  it("renders nothing when nothing new was added anywhere", async () => {
    await renderWithTheme(
      <PracticeReadingCreditLine
        credit={{
          sessionId: "s",
          ayahs: 0,
          khatm: { added: 0, unit: "ayah", percent: 40, alreadyCounted: true },
        }}
      />,
    );
    expect(screen.queryByText(/khatm plan/i)).toBeNull();
  });
});
