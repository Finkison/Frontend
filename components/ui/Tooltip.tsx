import React, { useState, useRef, useId } from "react";

export interface EnterpriseTooltipProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
}

export type TooltipProps = EnterpriseTooltipProps;

export const Tooltip = EnterpriseTooltip;

export default function EnterpriseTooltip({
  content,
  children,
  position = "top",
}: EnterpriseTooltipProps): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {React.cloneElement(children, {
        "aria-describedby": isVisible ? tooltipId : undefined,
      })}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute ${positionClasses} px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-[6px] shadow-md whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-fade-in`}
          style={{ zIndex: "var(--z-tooltip, 600)" }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
