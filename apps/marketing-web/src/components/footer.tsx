import { APP_NAME } from "@munib-tracker/shared/constants";
import Link from "next/link";
import { SITE_PATHS } from "@/lib/site";

const COPYRIGHT_YEAR = 2026;

const LINKS = [
  { href: SITE_PATHS.about, label: "About" },
  { href: SITE_PATHS.privacy, label: "Privacy" },
  { href: SITE_PATHS.terms, label: "Terms" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 px-6 py-8 text-center text-sm text-muted dark:border-white/10">
      <nav className="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="transition-colors hover:text-brand">
            {link.label}
          </Link>
        ))}
      </nav>
      <p>
        © {COPYRIGHT_YEAR} {APP_NAME}. Free for personal and educational use.
      </p>
    </footer>
  );
}
