import { fireEvent, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import { DownloadNativeAppsSection } from "@/components/settings/download-native-apps-section";
import i18n from "@/i18n";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

describe("DownloadNativeAppsSection", () => {
  it("renders nothing on native", async () => {
    await renderWithTheme(<DownloadNativeAppsSection />);
    expect(screen.queryByLabelText(i18n.t("settings.downloadIosA11y"))).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it.each(["settings.downloadIosA11y", "settings.downloadAndroidA11y"])(
      "opens the store link for %s",
      async (key) => {
        const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
        await renderWithTheme(<DownloadNativeAppsSection />);
        await fireEvent.press(screen.getByLabelText(i18n.t(key)));
        expect(openURL).toHaveBeenCalledWith(expect.stringMatching(/^https:/));
        openURL.mockRestore();
      },
    );
  });
});
