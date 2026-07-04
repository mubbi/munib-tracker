import { buildAchievementInAppNotification } from "@/lib/in-app-notifications/content";

describe("buildAchievementInAppNotification", () => {
  it("uses a short title and milestone details in the body", () => {
    const notification = buildAchievementInAppNotification({
      title: "First Step",
      description: "Complete 1 obligatory prayer",
    });

    expect(notification.title).toBe("Achievement unlocked");
    expect(notification.body).toBe("First Step · Complete 1 obligatory prayer");
  });
});
