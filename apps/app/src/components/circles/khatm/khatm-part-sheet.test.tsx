import { fireEvent, screen } from "@testing-library/react-native";

import { KhatmPartSheet } from "@/components/circles/khatm/khatm-part-sheet";
import { makeCircleMember, makeKhatmPart } from "@/test-support/circles";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const members = [
  makeCircleMember({ memberId: "me", isMe: true, displayName: "Me" }),
  makeCircleMember({ memberId: "ali", displayName: "Ali Khan" }),
];

async function renderSheet(
  part: ReturnType<typeof makeKhatmPart>,
  onReciteAlong: jest.Mock | null = jest.fn(),
) {
  const onAction = jest.fn();
  await renderWithTheme(
    <KhatmPartSheet
      part={part}
      unit="juz"
      khatm={{ status: "active", assignmentMode: "self_pick", deadlinePassed: false }}
      members={members}
      myMemberId="me"
      isManager={false}
      busy={false}
      onClose={jest.fn()}
      onAction={onAction}
      onAssign={jest.fn()}
      onReciteAlong={onReciteAlong ?? undefined}
    />,
  );
  return { onAction };
}

describe("KhatmPartSheet recite along (D68)", () => {
  it("offers recite-along on my own unfinished part, without completing it", async () => {
    const onReciteAlong = jest.fn();
    const part = makeKhatmPart(30, { status: "reading", assigneeMemberId: "me" });
    const { onAction } = await renderSheet(part, onReciteAlong);
    await fireEvent.press(screen.getByText("Recite along"));
    expect(onReciteAlong).toHaveBeenCalledWith(part);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("is not offered on someone else's part", async () => {
    await renderSheet(makeKhatmPart(3, { status: "reading", assigneeMemberId: "ali" }));
    expect(screen.queryByText("Recite along")).toBeNull();
  });

  it("is not offered on a part that is done", async () => {
    await renderSheet(makeKhatmPart(4, { status: "done", assigneeMemberId: "me" }));
    expect(screen.queryByText("Recite along")).toBeNull();
  });

  it("is hidden when the host passes no handler (TV / practice unavailable)", async () => {
    await renderSheet(makeKhatmPart(5, { status: "assigned", assigneeMemberId: "me" }), null);
    expect(screen.queryByText("Recite along")).toBeNull();
  });
});
