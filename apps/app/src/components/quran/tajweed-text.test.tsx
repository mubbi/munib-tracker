import type { TajweedSegment } from "@munib-tracker/shared/types";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";

import { TajweedText } from "@/components/quran/tajweed-text";
import { ARABIC_ZWJ } from "@/lib/arabic-text-join";
import { MunibThemeProvider } from "@/providers/theme-provider";

const segments: TajweedSegment[] = [{ text: "بِسْ", rule: "ghunnah" }, { text: "مِ" }];

function renderTajweed(props: { fallback?: string; segments?: TajweedSegment[] | null } = {}) {
  return render(
    <MunibThemeProvider>
      <TajweedText
        fallback={props.fallback ?? "بِسْمِ اللَّهِ"}
        fontSize={24}
        segments={props.segments}
      />
    </MunibThemeProvider>,
  );
}

describe("TajweedText", () => {
  it("renders fallback Arabic when segments are missing", async () => {
    renderTajweed({ fallback: "قُلْ هُوَ ٱللَّهُ أَحَدٌ" });
    await waitFor(() => {
      expect(screen.getByText("قُلْ هُوَ ٱللَّهُ أَحَدٌ")).toBeTruthy();
    });
  });

  it("renders fallback Arabic when segments are empty", async () => {
    renderTajweed({ fallback: "fallback ayah", segments: [] });
    await waitFor(() => {
      expect(screen.getByText("fallback ayah")).toBeTruthy();
    });
  });

  it("toggles a tajweed tooltip when a colored segment is pressed", async () => {
    renderTajweed({ segments });

    await waitFor(() => {
      expect(screen.getByText(`بِسْ${ARABIC_ZWJ}`)).toBeTruthy();
    });
    expect(screen.getByText("مِ")).toBeTruthy();
    expect(screen.queryByText("Ghunnah — Nasal sound — 2 beats")).toBeNull();

    fireEvent.press(screen.getByLabelText("Ghunnah — Nasal sound — 2 beats"));
    expect(screen.getByText("Ghunnah — Nasal sound — 2 beats")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Ghunnah — Nasal sound — 2 beats"));
    expect(screen.queryByText("Ghunnah — Nasal sound — 2 beats")).toBeNull();
  });

  it("clears the tooltip when the surrounding ayah text is pressed", async () => {
    renderTajweed({ segments });

    await waitFor(() => {
      expect(screen.getByLabelText("Ghunnah — Nasal sound — 2 beats")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("Ghunnah — Nasal sound — 2 beats"));
    expect(screen.getByText("Ghunnah — Nasal sound — 2 beats")).toBeTruthy();

    fireEvent.press(screen.getByText("مِ"));
    expect(screen.queryByText("Ghunnah — Nasal sound — 2 beats")).toBeNull();
  });

  it("shows the tooltip on hover when a fine pointer is available on web", async () => {
    const originalOS = Platform.OS;
    const listeners = new Set<(event: { matches: boolean }) => void>();
    const media = {
      matches: true,
      addEventListener: jest.fn(
        (_type: string, listener: (event: { matches: boolean }) => void) => {
          listeners.add(listener);
        },
      ),
      removeEventListener: jest.fn(
        (_type: string, listener: (event: { matches: boolean }) => void) => {
          listeners.delete(listener);
        },
      ),
    };
    const matchMedia = jest.fn(() => media);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: matchMedia,
    });
    Platform.OS = "web";

    try {
      const { unmount } = renderTajweed({ segments });
      await waitFor(() => {
        expect(matchMedia).toHaveBeenCalledWith("(hover: hover) and (pointer: fine)");
      });

      fireEvent(screen.getByLabelText("Ghunnah — Nasal sound — 2 beats"), "mouseEnter");
      expect(screen.getByText("Ghunnah — Nasal sound — 2 beats")).toBeTruthy();

      fireEvent(screen.getByLabelText("Ghunnah — Nasal sound — 2 beats"), "mouseLeave");
      expect(screen.queryByText("Ghunnah — Nasal sound — 2 beats")).toBeNull();

      media.matches = false;
      act(() => {
        for (const listener of listeners) listener({ matches: false });
      });

      unmount();
      expect(media.removeEventListener).toHaveBeenCalled();
    } finally {
      Platform.OS = originalOS;
    }
  });
});
