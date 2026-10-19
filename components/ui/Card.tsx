import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "outlined" | "raised" | "floating";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  variant = "outlined",
  padding = "md",
  interactive = false,
  header,
  footer,
  className = "",
  children,
  ...props
}: CardProps): React.ReactElement {
  const baseStyles = "rounded-xl transition-all duration-200";

  const variantStyles = {
    flat: "border border-transparent bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white shadow-none",
    outlined: "border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1B3A] text-slate-900 dark:text-white shadow-none",
    raised: "border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1B3A] text-slate-900 dark:text-white shadow-sm hover:shadow-md",
    floating: "border border-slate-200/60 dark:border-white/10 bg-white dark:bg-[#0E2046] text-slate-900 dark:text-white shadow-xl",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const interactiveStyles = interactive
    ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300 dark:hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#881337] active:translate-y-0"
    : "";

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {header && (
        <div className="mb-4 pb-4 border-b border-slate-200 dark:border-white/10">
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
          {footer}
        </div>
      )}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div className={`space-y-1 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h3
      className={`text-base font-semibold text-slate-900 dark:text-white leading-6 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 leading-5 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div className={`space-y-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={`mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
