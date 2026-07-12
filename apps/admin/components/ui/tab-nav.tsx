import Link from "next/link";
import { cn } from "@/lib/utils";

type TabItem = {
  id: string;
  label: string;
  href: string;
};

type TabNavProps = {
  tabs: TabItem[];
  activeId: string;
};

/** Underline tab navigation — Tailwind Application UI tabs pattern. */
export function TabNav({ tabs, activeId }: TabNavProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="border-b border-line">
        <nav
          className="-mb-px flex min-w-max flex-nowrap gap-x-6 sm:min-w-0 sm:flex-wrap sm:gap-y-1"
          aria-label="Section tabs"
        >
          {tabs.map((item) => {
            const active = activeId === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex shrink-0 border-b-2 px-1 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-300"
                    : "border-transparent text-fg-subtle hover:border-line-strong hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
