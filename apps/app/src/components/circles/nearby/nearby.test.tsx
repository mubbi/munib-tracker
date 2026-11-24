import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import {
  makeNearbyPreview,
  makeNearbyRequest,
  makeNearbySession,
  mockNearbyNative,
  NEARBY_SESSION_ID,
  resetNearbyMocks,
} from "@/test-support/nearby";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/lib/nearby/native", () => require("@/test-support/nearby").nearbyNativeMock);
jest.mock("@/lib/nearby/permissions", () => require("@/test-support/nearby").nearbyPermissionsMock);

const mockHost = {
  state: { kind: "idle" } as import("@/lib/nearby/machine").NearbyHostState,
  requests: [] as import("@/lib/circles/api").NearbyRequest[],
  start: jest.fn(async () => undefined),
  grant: jest.fn(async () => undefined),
  stop: jest.fn(),
  decide: jest.fn(async () => undefined),
};
jest.mock("@/lib/nearby/use-nearby-host", () => ({
  ...jest.requireActual("@/lib/nearby/use-nearby-host"),
  useNearbyHost: () => mockHost,
}));

const mockJoin = {
  state: { kind: "scanning" } as import("@/lib/nearby/machine").NearbyJoinState,
  items: [] as import("@/lib/nearby/machine").NearbyListItem[],
  selected: null as import("@/lib/circles/api").NearbySessionPreview | null,
  start: jest.fn(async () => undefined),
  grant: jest.fn(async () => undefined),
  select: jest.fn(),
  back: jest.fn(),
  confirm: jest.fn(async () => undefined),
  close: jest.fn(),
};
jest.mock("@/lib/nearby/use-nearby-join", () => ({
  ...jest.requireActual("@/lib/nearby/use-nearby-join"),
  useNearbyJoin: () => mockJoin,
}));

import { InviteMethodTabs } from "./invite-method-tabs";
import { NearbyHostPanel } from "./nearby-host-panel";
import { JoinNearbyButton, NearbyJoinSheet } from "./nearby-join-sheet";

beforeEach(() => {
  resetNearbyMocks();
  resetToastMock();
  resetExpoRouterMock();
  mockHost.state = { kind: "idle" };
  mockHost.requests = [];
  mockJoin.state = { kind: "scanning" };
  mockJoin.items = [];
  mockJoin.selected = null;
  for (const fn of [
    mockHost.start,
    mockHost.grant,
    mockHost.stop,
    mockHost.decide,
    ...Object.values(mockJoin),
  ]) {
    if (typeof fn === "function" && "mockClear" in fn) fn.mockClear();
  }
});

describe("InviteMethodTabs", () => {
  it("keeps only the code / QR content where nearby isn't available (web, TV, no BLE)", async () => {
    mockNearbyNative.isNearbyAvailable.mockReturnValue(false);
    await renderWithTheme(
      <InviteMethodTabs nearby={<Text>nearby panel</Text>}>
        <Text>code panel</Text>
      </InviteMethodTabs>,
    );
    expect(screen.getByText("code panel")).toBeTruthy();
    expect(screen.queryByText("Nearby")).toBeNull();
  });

  it("switches to the nearby panel only when chosen", async () => {
    await renderWithTheme(
      <InviteMethodTabs nearby={<Text>nearby panel</Text>}>
        <Text>code panel</Text>
      </InviteMethodTabs>,
    );
    expect(screen.queryByText("nearby panel")).toBeNull();
    await fireEvent.press(screen.getByText("Nearby"));
    expect(screen.getByText("nearby panel")).toBeTruthy();
  });
});

describe("NearbyHostPanel", () => {
  it("starts on 'Make visible'", async () => {
    await renderWithTheme(<NearbyHostPanel circleId="c-1" />);
    expect(screen.getByText("Invite someone next to you")).toBeTruthy();
    await fireEvent.press(screen.getByText("Make visible"));
    expect(mockHost.start).toHaveBeenCalled();
  });

  it("explains Bluetooth before the OS prompt", async () => {
    mockHost.state = { kind: "rationale" };
    await renderWithTheme(<NearbyHostPanel circleId="c-1" />);
    await fireEvent.press(screen.getByText("Continue"));
    expect(mockHost.grant).toHaveBeenCalled();
  });

  it("shows the digits large and lets the mockHost accept a request", async () => {
    mockHost.state = { kind: "visible", session: makeNearbySession({ matchCode: "0472" }) };
    mockHost.requests = [makeNearbyRequest({ displayName: "Yusuf" })];
    await renderWithTheme(<NearbyHostPanel circleId="c-1" />);
    expect(screen.getByText("Visible to nearby phones")).toBeTruthy();
    expect(screen.getByLabelText("Match code 0 4 7 2")).toBeTruthy();
    expect(screen.getByText("Yusuf")).toBeTruthy();
    await fireEvent.press(screen.getByText("Accept"));
    await screen.findByText("Yusuf");
    expect(mockHost.decide).toHaveBeenCalledWith("r-1", "accept");
    expect(mockToast.success).toHaveBeenCalledWith("Accepted — they're in the circle now.");
  });

  it("labels a child's device and says why advertising stopped", async () => {
    mockHost.state = { kind: "stopped", reason: "used" };
    await renderWithTheme(<NearbyHostPanel circleId="c-1" childId="child-1" />);
    expect(screen.getByText("Link a phone next to you")).toBeTruthy();
    expect(screen.getByText("Done — this nearby invite has been used.")).toBeTruthy();
    expect(screen.getByText("Make visible again")).toBeTruthy();
  });

  it("offers Settings when Bluetooth permission is blocked", async () => {
    mockHost.state = { kind: "blocked", reason: "permissionBlocked" };
    await renderWithTheme(<NearbyHostPanel circleId="c-1" />);
    expect(screen.getByText("Bluetooth is off for Munib Tracker")).toBeTruthy();
    expect(screen.getByText("Open Settings")).toBeTruthy();
  });
});

describe("Join nearby", () => {
  it("renders nothing where nearby isn't available", async () => {
    mockNearbyNative.isNearbyAvailable.mockReturnValue(false);
    await renderWithTheme(<JoinNearbyButton />);
    expect(screen.queryByText("Join nearby")).toBeNull();
  });

  it("lists nearby circles with a coarse distance", async () => {
    mockJoin.items = [
      {
        sessionId: NEARBY_SESSION_ID,
        rssi: -55,
        proximity: "veryClose",
        preview: makeNearbyPreview(),
      },
    ];
    await renderWithTheme(<NearbyJoinSheet visible purpose="member" onClose={jest.fn()} />);
    expect(mockJoin.start).toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText("Ramadan khatm, Group khatm, Very close"));
    expect(mockJoin.select).toHaveBeenCalledWith(NEARBY_SESSION_ID);
  });

  it("asks to compare the digits and sends the request on 'They match'", async () => {
    mockJoin.state = { kind: "confirming", sessionId: NEARBY_SESSION_ID };
    mockJoin.selected = makeNearbyPreview({ matchCode: "9031" });
    await renderWithTheme(<NearbyJoinSheet visible purpose="member" onClose={jest.fn()} />);
    expect(screen.getByLabelText("Match code 9 0 3 1")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Your name in this circle"), "Yusuf");
    await fireEvent.press(screen.getByText("They match"));
    expect(mockJoin.confirm).toHaveBeenCalledWith("Yusuf");
    await fireEvent.press(screen.getByText("They don't match"));
    expect(mockJoin.back).toHaveBeenCalled();
    // One way back, and no "use the code" fallback once a circle is picked.
    expect(screen.queryByText("Back")).toBeNull();
    expect(screen.queryByText("Can't find it? Use the code or scan the QR instead.")).toBeNull();
  });

  it("offers the code / QR fallback while still looking", async () => {
    mockJoin.state = { kind: "scanning" };
    await renderWithTheme(<NearbyJoinSheet visible purpose="member" onClose={jest.fn()} />);
    expect(screen.getByText("Can't find it? Use the code or scan the QR instead.")).toBeTruthy();
  });

  it("opens the kids shell once a child's phone is linked", async () => {
    mockJoin.state = { kind: "joined", circleId: null, circleType: "family", childLinked: true };
    const onClose = jest.fn();
    await renderWithTheme(<NearbyJoinSheet visible purpose="child_link" onClose={onClose} />);
    await fireEvent.press(screen.getByText("Open"));
    expect(mockRouter.replace).toHaveBeenCalledWith("/kids");
    expect(onClose).toHaveBeenCalled();
  });

  it("opens the circle like an invite join", async () => {
    mockJoin.state = { kind: "joined", circleId: "c-9", circleType: "partner", childLinked: false };
    await renderWithTheme(<NearbyJoinSheet visible purpose="member" onClose={jest.fn()} />);
    await fireEvent.press(screen.getByText("Open"));
    expect(mockRouter.replace).toHaveBeenCalledWith("/partner?circleId=c-9");
  });
});
