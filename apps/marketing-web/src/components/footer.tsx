import { APP_NAME } from "@munib-tracker/shared/constants";

const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 px-6 py-8 text-center text-sm text-muted dark:border-white/10">
      <p>
        © {COPYRIGHT_YEAR} {APP_NAME}. Free for personal and educational use.
      </p>
    </footer>
  );
}
