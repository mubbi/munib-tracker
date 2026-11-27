import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { LOCALE_META } from "@/i18n/locales";
import { LOCALES } from "@/i18n/routing";
import { renderWithIntl } from "@/test-support/intl";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/features",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe("LocaleSwitcher", () => {
  it("opens a list of every locale linking to the current page", () => {
    renderWithIntl(<LocaleSwitcher />);
    const toggle = screen.getByRole("button", { name: "Language: English" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("list", { name: "Language" })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const list = screen.getByRole("list", { name: "Language" });
    const links = within(list).getAllByRole("link");
    expect(links).toHaveLength(LOCALES.length);

    const english = within(list).getByRole("link", { name: LOCALE_META.en.nativeName });
    expect(english).toHaveAttribute("href", "/en/features");
    expect(english).toHaveAttribute("lang", "en");
    expect(english).toHaveAttribute("hreflang", "en");
    expect(english).toHaveAttribute("aria-current", "true");
  });

  it("closes on Escape and returns focus to the toggle", () => {
    renderWithIntl(<LocaleSwitcher />);
    const toggle = screen.getByRole("button", { name: "Language: English" });
    fireEvent.click(toggle);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("renders an inline, labelled list for the mobile drawer", () => {
    const onNavigate = vi.fn();
    renderWithIntl(<LocaleSwitcher variant="list" onNavigate={onNavigate} />);
    const group = screen.getByRole("region", { name: "Language" });
    const english = within(group).getByRole("link", { name: "English" });
    expect(english).toHaveAttribute("aria-current", "true");
    // jsdom can't navigate; stop the default so only our handler runs.
    english.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(english);
    expect(onNavigate).toHaveBeenCalled();
  });
});
