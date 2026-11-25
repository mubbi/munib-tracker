import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PageLayoutRenderer } from "@/components/quran/page-layout-renderer";
import { iosInlineAyahMarker } from "@/lib/reading-typography";
import { buildAyah } from "@/test-support/fixtures/quran";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

const BAQARAH_98 = buildAyah({
  surah: 2,
  ayah: 98,
  global: 105,
  arabic: "مَن كَانَ عَدُوًّا لِّلَّهِ",
  hizb: 2,
  page: 15,
});

// The last ayah of Al-Baqarah followed by the opening of Al-Imran (bismillah + banner).
const BAQARAH_286 = buildAyah({ surah: 2, ayah: 286, arabic: "baqarah-286", page: 49 });
const IMRAN_1 = buildAyah({ surah: 3, ayah: 1, arabic: "imran-1", page: 50 });
const IMRAN_2 = buildAyah({ surah: 3, ayah: 2, arabic: "imran-2", page: 50 });
const PAGE = [BAQARAH_286, IMRAN_1, IMRAN_2];

type RendererProps = Parameters<typeof PageLayoutRenderer>[0];

async function renderPage(props: Partial<RendererProps> = {}) {
  const onAyahPress = jest.fn();
  await renderWithTheme(
    <PageLayoutRenderer
      ayahs={PAGE}
      arabicSize={28}
      showTransliteration={false}
      showTranslation={false}
      translationDir="ltr"
      secondTranslationDir="ltr"
      page={50}
      onAyahPress={onAyahPress}
      {...props}
    />,
  );
  return { onAyahPress };
}

/** Ayah blocks are labelled "ref, Arabic[, translation]" (G-01) — match by the leading ref. */
const byRef = (ref: string) => screen.getByLabelText(new RegExp(`^${ref},`));
const iosText = (arabic: string, ayah: number) => `${arabic}${iosInlineAyahMarker(ayah)}`;
const preferredFocus = () =>
  screen.getAllByRole("button").filter((node) => node.props.hasTVPreferredFocus);

describe("PageLayoutRenderer", () => {
  describe("ayah markers", () => {
    it("does not send U+06DD to iOS TextKit", async () => {
      await renderPage({ ayahs: [BAQARAH_98], page: 15 });
      await waitFor(() => expect(screen.getByText(iosText(BAQARAH_98.arabic, 98))).toBeTruthy());
      expect(screen.queryByText("۝")).toBeNull();
    });

    describe("on Android", () => {
      usePlatform({ OS: "android" });

      it("renders the U+06DD rosette instead of inlining the iOS marker", async () => {
        await renderPage({ ayahs: [BAQARAH_98], page: 15 });
        await waitFor(() => expect(JSON.stringify(screen.toJSON())).toContain("۝"));
        expect(JSON.stringify(screen.toJSON())).not.toContain(iosInlineAyahMarker(98));
      });

      it.each([
        [buildAyah({ ayah: 7 }), "٧"],
        [buildAyah({ surah: 2, ayah: 42 }), "٤٢"],
        [buildAyah({ surah: 2, ayah: 255 }), "٢٥٥"],
      ])("numbers the rosette for ayah %#", async (ayah, digits) => {
        await renderPage({ ayahs: [ayah] });
        // The rosette is decorative, so it is hidden from assistive tech.
        expect(screen.getByText(digits, { includeHiddenElements: true })).toBeTruthy();
      });
    });
  });

  describe("flowing page", () => {
    it("opens a surah with its banner and bismillah", async () => {
      await renderPage();
      expect(screen.getByText("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")).toBeTruthy();
    });

    it("opens the tapped ayah", async () => {
      const { onAyahPress } = await renderPage();
      await fireEvent.press(byRef("3:2"));
      expect(onAyahPress).toHaveBeenCalledWith(3, 2);
    });

    it("highlights the playing ayah", async () => {
      await renderPage({ highlightAyah: { surah: 3, ayah: 2 } });
      const background = (label: string) => flattenStyle(byRef(label).props.style).backgroundColor;
      expect(background("3:2")).toEqual(expect.any(String));
      expect(background("3:1")).toBeUndefined();
    });
  });

  describe("interleaved with translation", () => {
    const translation = { "3:1": "Alif Lam Meem", "2": "Allah, there is no deity" };
    const transliteration = { "3:1": "Alif-Lam-Meem" };
    const secondTranslation = { "3:1": "الم" };

    it("stacks transliteration and both translations under each ayah", async () => {
      await renderPage({
        showTransliteration: true,
        showTranslation: true,
        transliteration,
        translation,
        secondTranslation,
        translationSize: 16,
        transliterationSize: 14,
        translationDir: "rtl",
        secondTranslationDir: "rtl",
      });
      expect(screen.getByText("Alif-Lam-Meem")).toBeTruthy();
      expect(screen.getByText("Alif Lam Meem")).toBeTruthy();
      expect(screen.getByText("الم")).toBeTruthy();
    });

    it("falls back to translations keyed by ayah number", async () => {
      await renderPage({ showTranslation: true, translation });
      expect(screen.getByText("Allah, there is no deity")).toBeTruthy();
    });

    it("leaves out the translation when only transliteration is on", async () => {
      await renderPage({ showTransliteration: true, transliteration, translation });
      expect(screen.getByText("Alif-Lam-Meem")).toBeTruthy();
      expect(screen.queryByText("Alif Lam Meem")).toBeNull();
    });

    it("opens the tapped ayah block", async () => {
      const { onAyahPress } = await renderPage({ showTranslation: true, translation });
      await fireEvent.press(byRef("3:1"));
      expect(onAyahPress).toHaveBeenCalledWith(3, 1);
    });

    it("highlights the playing ayah block", async () => {
      await renderPage({
        showTranslation: true,
        translation,
        highlightAyah: { surah: 3, ayah: 1 },
      });
      const background = (label: string) => flattenStyle(byRef(label).props.style).backgroundColor;
      expect(background("3:1")).not.toEqual(background("3:2"));
    });
  });

  describe("screen-reader labels (G-01)", () => {
    it("reads the Unicode Arabic and, when shown, the translation; the hint stays separate", async () => {
      await renderPage({
        showTranslation: true,
        translation: { "3:1": "Alif, Lam, Meem." },
      });
      const block = byRef("3:1");
      expect(block.props.accessibilityLabel).toBe("3:1, imran-1, Alif, Lam, Meem.");
      expect(block.props.accessibilityHint).toBe("Opens actions");
    });

    it("reads the Arabic of each ayah in the flowing mushaf paragraph", async () => {
      await renderPage();
      const span = byRef("3:2");
      expect(span.props.accessibilityLabel).toBe("3:2, imran-2");
      expect(span.props.accessibilityLanguage).toBe("ar");
      expect(span.props.accessibilityHint).toBe("Opens actions");
    });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("makes each surah's paragraph one focus stop", async () => {
      await renderPage();
      expect(screen.getAllByRole("button").map((node) => node.props.accessibilityLabel)).toEqual([
        "2:286, baqarah-286",
        "3:1, imran-1, imran-2",
      ]);
    });

    it("opens the highlighted ayah of the focused paragraph", async () => {
      const { onAyahPress } = await renderPage({ highlightAyah: { surah: 3, ayah: 2 } });
      await fireEvent.press(byRef("3:1"));
      expect(onAyahPress).toHaveBeenCalledWith(3, 2);
    });

    it("opens the paragraph's first ayah when none is highlighted", async () => {
      const { onAyahPress } = await renderPage();
      await fireEvent.press(byRef("3:1"));
      expect(onAyahPress).toHaveBeenCalledWith(3, 1);
    });

    it.each([
      ["the first block", "first" as const, false, "2:286"],
      ["the targeted surah's paragraph", { surah: 3, ayah: 2 }, false, "3:1"],
      ["the targeted ayah block", { surah: 3, ayah: 2 }, true, "3:2"],
      ["the first block for an off-page ayah", { surah: 9, ayah: 1 }, true, "2:286"],
    ])("focuses %s", async (_name, tvFocusTarget, showTranslation, label) => {
      await renderPage({ tvFocusTarget, showTranslation });
      expect(preferredFocus()).toEqual([byRef(label)]);
    });

    it("requests no focus on an empty page", async () => {
      await renderPage({ ayahs: [], tvFocusTarget: "first" });
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });
  });
});
