"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/lib/faq";

type AccordionFaqProps = {
  items: FaqItem[];
};

export function AccordionFaq({ items }: AccordionFaqProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border/60 rounded-[var(--radius-card)] border border-border/60 bg-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold tracking-tight transition-colors hover:bg-muted-surface/30"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {item.question}
                <span
                  aria-hidden
                  className={`text-muted transition-transform ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>
            <section id={panelId} aria-labelledby={buttonId} hidden={!isOpen} className="px-6 pb-5">
              <p className="text-sm leading-relaxed text-muted">{item.answer}</p>
            </section>
          </div>
        );
      })}
    </div>
  );
}
