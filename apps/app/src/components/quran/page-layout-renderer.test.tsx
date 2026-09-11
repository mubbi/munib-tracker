import type { Ayah } from "@munib-tracker/shared/types";
import { render, screen, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";

import { PageLayoutRenderer } from "@/components/quran/page-layout-renderer";
import { iosInlineAyahMarker } from "@/lib/reading-typography";
import { MunibThemeProvider } from "@/providers/theme-provider";

const ayah: Ayah = {
  surah: 2,
  ayah: 98,
  global: 105,
  arabic: "مَن كَانَ عَدُوًّا لِّلَّهِ",
  juz: 1,
  sajda: false,
  hizb: 2,
  page: 15,
};

describe("PageLayoutRenderer ayah markers", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("does not send U+06DD to iOS TextKit", async () => {
    Platform.OS = "ios";
    render(
      <MunibThemeProvider>
        <PageLayoutRenderer
          ayahs={[ayah]}
          arabicSize={28}
          showTransliteration={false}
          showTranslation={false}
          translationDir="ltr"
          secondTranslationDir="ltr"
          page={15}
        />
      </MunibThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(`${ayah.arabic}${iosInlineAyahMarker(98)}`)).toBeTruthy();
    });
    expect(screen.queryByText("\u06DD")).toBeNull();
  });

  it("renders the U+06DD rosette on Android instead of inlining the iOS marker", async () => {
    Platform.OS = "android";
    render(
      <MunibThemeProvider>
        <PageLayoutRenderer
          ayahs={[ayah]}
          arabicSize={28}
          showTransliteration={false}
          showTranslation={false}
          translationDir="ltr"
          secondTranslationDir="ltr"
          page={15}
        />
      </MunibThemeProvider>,
    );

    await waitFor(() => {
      expect(JSON.stringify(screen.toJSON())).toContain("\u06DD");
    });
    expect(JSON.stringify(screen.toJSON())).not.toContain(iosInlineAyahMarker(98));
  });
});
