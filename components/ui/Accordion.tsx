import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface EnterpriseAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenId?: string;
  id?: string;
}

export type AccordionProps = EnterpriseAccordionProps;

export default function EnterpriseAccordion({
  items,
  allowMultiple = false,
  defaultOpenId,
  id = "faq-accordion",
}: EnterpriseAccordionProps): React.ReactElement {
  const [openIds, setOpenIds] = useState<string[]>(() => {
    if (defaultOpenId === "") return [];
    return [defaultOpenId || items[0]?.id || ""];
  });

  const toggleItem = (itemId: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(itemId);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== itemId) : [...prev, itemId];
      } else {
        return isOpen ? [] : [itemId];
      }
    });
  };

  return (
    <div className="w-full divide-y divide-stone-200 border-y border-stone-200 dark:divide-white/10 dark:border-white/10" id={id}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `${id}-header-${item.id}`;
        const panelId = `${id}-panel-${item.id}`;

        return (
          <div key={item.id} className="py-2">
            <h3 className="m-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full min-h-[52px] py-3 flex items-center justify-between gap-4 text-start font-semibold text-base sm:text-lg text-stone-900 hover:text-[#881337] transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337] rounded-[6px] dark:text-white dark:hover:text-[#FBBF24]"
              >
                <span>{item.question}</span>
                <span
                  className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 transition-transform duration-250 ease-out dark:bg-[#261E1A] ${
                    isOpen ? "rotate-180 bg-[#FFF1F2] text-[#881337] dark:bg-[#4C0519] dark:text-[#FBBF24]" : "text-stone-500 dark:text-stone-300"
                  }`}
                  aria-hidden="true"
                >
                  <ChevronDown size={18} />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={`transition-all duration-250 ease-out overflow-hidden ${
                isOpen ? "max-h-[500px] opacity-100 pb-4 pt-1" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-[65ch] dark:text-stone-300">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const Accordion = EnterpriseAccordion;
