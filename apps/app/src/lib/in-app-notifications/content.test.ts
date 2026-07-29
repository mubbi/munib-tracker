import { buildAchievementInAppNotification } from "@/lib/in-app-notifications/content";

describe("buildAchievementInAppNotification", () => {
  it("uses a short title and milestone details in the body", () => {
    const notification = buildAchievementInAppNotification({
      id: "salah-0",
      trackId: "salah",
      level: 0,
      titleKey: "achievements.milestones.salah.titles.0",
      descriptionKey: "achievements.milestones.salah.description_one",
      descriptionParams: { count: 1 },
      threshold: 1,
      value: 1,
      unlocked: true,
      progress: 1,
    });

    expect(notification.title).toBe("Achievement unlocked");
    expect(notification.body).toBe("First Step · Complete 1 obligatory prayer");
  });
});
