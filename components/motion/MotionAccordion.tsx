import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { MOTION_TOKENS } from "../../styles/motionTokens";
import { useMotionPreferences } from "./useMotionPreferences";

interface MotionAccordionProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function MotionAccordion({
  question,
  answer,
  isOpen,
  onToggle,
  className = ""
}: MotionAccordionProps): React.ReactElement {
  const contentId = useId();
  const { canAnimate } = useMotionPreferences();

  return (
    <div className={`rounded-lg border border-stone-200 dark:border-white/10 bg-white dark:bg-[#261E1A] overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full p-4 text-left text-xs sm:text-sm font-medium text-stone-900 dark:text-[#FDFBF7] flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#881337]"
      >
        <span>{question}</span>
        <ChevronDown
          className="w-4 h-4 text-stone-400 dark:text-[#A89C90] shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: canAnimate ? MOTION_TOKENS.durations.base : "0ms", // 250ms
            transitionTimingFunction: MOTION_TOKENS.easings.standard
          }}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        role="region"
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transitionProperty: "grid-template-rows",
          transitionDuration: canAnimate ? MOTION_TOKENS.durations.base : "0ms", // 250ms
          transitionTimingFunction: MOTION_TOKENS.easings.standard
        }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 text-xs text-stone-600 dark:text-[#E7E0D6] leading-relaxed border-t border-stone-100 dark:border-white/10">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
