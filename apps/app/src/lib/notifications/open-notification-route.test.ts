import { markColdStartReady } from "@/lib/boot/cold-start";
import { openNotificationRoute } from "@/lib/notifications/open-notification-route";

jest.mock("@/lib/boot/cold-start", () => ({
  markColdStartReady: jest.fn(),
}));

describe("openNotificationRoute", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("dismisses splash and navigates with withAnchor after a tick", () => {
    const navigate = jest.fn();
    openNotificationRoute({ navigate }, "/tracker");

    expect(markColdStartReady).toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(navigate).toHaveBeenCalledWith("/tracker", { withAnchor: true });
  });

  it("falls back to the notification centre when route is missing", () => {
    const navigate = jest.fn();
    openNotificationRoute({ navigate }, undefined);
    jest.runAllTimers();
    expect(navigate).toHaveBeenCalledWith("/notifications", { withAnchor: true });
  });
});
