import React from "react";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
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
                  ? "after:content-[''] after:w-full after:h-0.5 after:bg-[#E7E0D6] after:inline-block after:absolute after:top-4 after:left-1/2"
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
                      ? "bg-[#881337] text-white"
                      : isCurrent
                      ? "bg-white dark:bg-[#261E1A] border-2 border-[#881337] text-[#881337] font-bold ring-4 ring-rose-50"
                      : "bg-stone-100 dark:bg-[#201815] border border-[#E7E0D6] dark:border-white/10 text-stone-400 dark:text-[#A89C90]"
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
                        ? "text-[#881337]"
                        : isComplete
                        ? "text-[#261E1A] dark:text-[#FDFBF7]"
                        : "text-[#5C5046] dark:text-[#E7E0D6]"
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-[11px] text-stone-400 dark:text-[#A89C90] hidden sm:block">
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
