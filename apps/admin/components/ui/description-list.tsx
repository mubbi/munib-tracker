import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DescriptionListItem = {
  term: string;
  description: ReactNode;
};

type DescriptionListProps = {
  items: DescriptionListItem[];
  className?: string;
};

/**
 * Catalyst-style description list — responsive term/description grid with
 * divided rows. Use for read-only "key: value" metadata blocks.
 */
export function DescriptionList({ items, className }: DescriptionListProps) {
  return (
    <dl className={cn("divide-y divide-line text-sm", className)}>
      {items.map((item) => (
        <div
          key={item.term}
          className="grid grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-3 sm:gap-4"
        >
          <dt className="font-medium text-fg-subtle">{item.term}</dt>
          <dd className="text-fg sm:col-span-2">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
