import React from "react";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className = "",
}: StepperProps): React.ReactElement {
  return (
    <nav aria-label="Progress Stepper" className={`w-full ${className}`}>
      <ol className="flex items-center w-full">
        {steps.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isUpcoming = idx > currentStep;

          return (
            <li
              key={step.id}
              className={`flex-1 relative ${
                idx !== steps.length - 1
                  ? "after:content-[''] after:w-full after:h-0.5 after:bg-[#E2E8F0] after:inline-block after:absolute after:top-4 after:left-1/2"
                  : ""
              }`}
            >
              <button
                type="button"
                disabled={!onStepClick || isUpcoming}
                onClick={() => onStepClick?.(idx)}
                className={`relative z-10 flex flex-col items-center text-center group w-full cursor-pointer disabled:cursor-default focus:outline-none`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors min-h-[32px] min-w-[32px] ${
                    isComplete
                      ? "bg-[#1D4ED8] text-white"
                      : isCurrent
                      ? "bg-white border-2 border-[#1D4ED8] text-[#1D4ED8] font-bold ring-4 ring-[#EFF6FF]"
                      : "bg-slate-100 border border-[#E2E8F0] text-slate-400"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? "text-[#1D4ED8]"
                        : isComplete
                        ? "text-[#0F172A]"
                        : "text-[#475569]"
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Stepper;
