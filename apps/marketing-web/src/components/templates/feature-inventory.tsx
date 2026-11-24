import { Check, Clock } from "lucide-react";
import Link from "next/link";
import { MUNIB_FEATURE_INVENTORY } from "@/content/munib-features";

/**
 * "Everything in Munib Tracker": every inventory group with its items. Roadmap
 * items carry a "Coming soon" pill and a clock icon, never a check.
 */
export function FeatureInventory() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {MUNIB_FEATURE_INVENTORY.map((group) => (
        <div key={group.id} className="rounded-2xl border border-white/10 bg-[#0c2131] p-5">
          <h3 className="font-display text-base font-semibold text-white">{group.title}</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {group.items.map((item) => (
              <li key={item.name} className="flex gap-2.5 text-[14px] leading-snug">
                {item.status === "shipped" ? (
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                ) : (
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-sky-300" />
                )}
                <span>
                  <span className="font-medium text-white/90">
                    {item.href ? (
                      <Link href={item.href} className="hover:text-brand hover:underline">
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </span>
                  {item.status === "planned" ? (
                    <span className="ml-2 inline-block rounded-full bg-sky-300/15 px-2 py-0.5 text-[11px] font-semibold text-sky-200">
                      Coming soon
                    </span>
                  ) : null}
                  {item.detail ? (
                    <span className="block text-[13px] text-white/60">{item.detail}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
