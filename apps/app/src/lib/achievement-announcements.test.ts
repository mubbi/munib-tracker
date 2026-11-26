import {
  claimAchievementAnnouncement,
  releaseLapsedAchievementAnnouncements,
  resetAchievementAnnouncementsForTests,
} from "./achievement-announcements";

beforeEach(() => {
  resetAchievementAnnouncementsForTests();
});

describe("achievement announcements", () => {
  it("lets only the first claimant celebrate an unlock", () => {
    expect(claimAchievementAnnouncement("salah_1")).toBe(true);
    expect(claimAchievementAnnouncement("salah_1")).toBe(false);
    expect(claimAchievementAnnouncement("salah_7")).toBe(true);
  });

  it("keeps ids that are still unlocked", () => {
    claimAchievementAnnouncement("salah_1");
    releaseLapsedAchievementAnnouncements(["salah_1", "streak_3"]);
    expect(claimAchievementAnnouncement("salah_1")).toBe(false);
  });

  it("celebrates again after the unlock lapsed and is earned back", () => {
    claimAchievementAnnouncement("salah_1");
    releaseLapsedAchievementAnnouncements([]);
    expect(claimAchievementAnnouncement("salah_1")).toBe(true);
  });
});
