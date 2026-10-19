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
    <div className={`rounded-lg border border-slate-200 bg-white overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full p-4 text-left text-xs sm:text-sm font-medium text-slate-900 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
      >
        <span>{question}</span>
        <ChevronDown
          className="w-4 h-4 text-slate-400 shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: canAnimate ? MOTION_TOKENS.durations.base : "0ms", // 250ms
            transitionTimingFunction: MOTION_TOKENS.easings.standard
          }}
          aria-hidden="true"
        />
      </button>

      {/* Grid template rows technique: 0fr to 1fr */}
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
          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
