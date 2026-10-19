import React from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = true,
      disabled = false,
      required = false,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`space-y-1.5 ${fullWidth ? "w-full" : "w-auto"}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <LeftIcon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900/60 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed ${
              LeftIcon ? "pl-10" : ""
            } ${RightIcon ? "pr-10" : ""} ${
              error
                ? "border-rose-400 dark:border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-950/50"
                : "border-slate-200 dark:border-white/15 hover:border-slate-300 dark:hover:border-white/25 focus:border-[#881337] dark:focus:border-[#FBBF24] focus:ring-2 focus:ring-[#881337]/20 dark:focus:ring-[#FBBF24]/20"
            } ${className}`}
            {...props}
          />

          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <RightIcon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
