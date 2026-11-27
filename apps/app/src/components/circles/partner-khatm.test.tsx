import { fireEvent, screen } from "@testing-library/react-native";

import { KhatmGrid } from "@/components/circles/khatm/khatm-grid";
import { KhatmPartSheet } from "@/components/circles/khatm/khatm-part-sheet";
import { PartnerDots } from "@/components/circles/partner/partner-dots";
import { PartnerGoalCard } from "@/components/circles/partner/partner-goal-card";
import { buildPartnerRows } from "@/lib/circles/partner";
import { makeCircleMember, makeGoalDoneSignal, makeKhatmPart } from "@/test-support/circles";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const members = [
  makeCircleMember({ memberId: "me", isMe: true, displayName: "Me" }),
  makeCircleMember({ memberId: "ali", displayName: "Ali Khan" }),
];

describe("PartnerGoalCard", () => {
  it("shows the private goal and shares only 'done' on tap", async () => {
    const onShare = jest.fn();
    await renderWithTheme(
      <PartnerGoalCard
        goal={{ kind: "quranPages", pages: 3 }}
        onSaveGoal={jest.fn()}
        sharedToday={false}
        paused={false}
        looksMet={false}
        excused={false}
        busy={false}
        onShare={onShare}
        onUnshare={jest.fn()}
      />,
    );
    expect(screen.getByTestId("partner-goal-text").props.children).toBe("Read 3 pages of Qur'an");
    expect(screen.getByText(/never shared/)).toBeTruthy();
    await fireEvent.press(screen.getByText("I did my goal today"));
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it("asks for a goal first and has no share button while paused", async () => {
    const onSaveGoal = jest.fn();
    await renderWithTheme(
      <PartnerGoalCard
        goal={null}
        onSaveGoal={onSaveGoal}
        sharedToday={false}
        paused
        looksMet={false}
        excused={false}
        busy={false}
        onShare={jest.fn()}
        onUnshare={jest.fn()}
      />,
    );
    expect(screen.queryByText("I did my goal today")).toBeNull();
    await fireEvent.press(screen.getByText("Save goal"));
    expect(onSaveGoal).toHaveBeenCalledWith({ kind: "fard5" });
  });
});

describe("PartnerDots", () => {
  it("renders dots without numbers and nudges partners only", async () => {
    const onNudge = jest.fn();
    const rows = buildPartnerRows(members, [makeGoalDoneSignal("ali", "2026-11-24")], "2026-11-24");
    await renderWithTheme(
      <PartnerDots rows={rows} sentSlots={new Set(["ali|reminder"])} onNudge={onNudge} />,
    );
    expect(screen.getByText("Done today")).toBeTruthy();
    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.getAllByText("Make dua for them")).toHaveLength(1);
    await fireEvent.press(screen.getByText("Make dua for them"));
    expect(onNudge).toHaveBeenCalledWith("ali", "dua");
  });
});

describe("Group khatm grid + part sheet", () => {
  it("labels cells with status and the member's chosen name", async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <KhatmGrid
        unit="juz"
        parts={[
          makeKhatmPart(1, { status: "done" }),
          makeKhatmPart(2, { status: "reading", assigneeMemberId: "ali" }),
        ]}
        members={members}
        myMemberId="me"
        onPressPart={onPress}
      />,
    );
    expect(screen.getByLabelText("Juz 2, Reading, Ali Khan")).toBeTruthy();
    expect(screen.getByText("AK")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("khatm-part-2"));
    expect(onPress).toHaveBeenCalledWith(expect.objectContaining({ partNo: 2 }));
  });

  it("asks the manager to check with the member before reassigning a stale part", async () => {
    const onAssign = jest.fn();
    const part = makeKhatmPart(7, { status: "assigned", assigneeMemberId: "ali", stale: true });
    await renderWithTheme(
      <KhatmPartSheet
        part={part}
        unit="juz"
        khatm={{ status: "active", assignmentMode: "self_pick", deadlinePassed: false }}
        members={members}
        myMemberId="me"
        isManager
        busy={false}
        onClose={jest.fn()}
        onAction={jest.fn()}
        onAssign={onAssign}
      />,
    );
    await fireEvent.press(screen.getByText("Reassign"));
    expect(screen.getByText(/Please check with them first/)).toBeTruthy();
    expect(onAssign).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByText("I've checked with them"));
    await fireEvent.press(screen.getByText("You"));
    expect(onAssign).toHaveBeenCalledWith(part, "me");
  });
});
