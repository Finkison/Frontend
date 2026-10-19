/**
 * Button Component - Unified design system implementation
 * Replaces 100+ inline button variations with consistent, accessible component
 * WCAG AA compliant with proper focus states and keyboard navigation
 */

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { tokens } from '../../styles/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'destructive' | 'success' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loading?: boolean;
  error?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading: propIsLoading = false,
      loading = false,
      error = false,
      loadingText,
      leftIcon: propLeftIcon,
      icon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      asChild = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const iconSizes: Record<ButtonSize, string> = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };
    const isLoading = propIsLoading || loading;
    const resolvedIcon = typeof icon === 'function' ? React.createElement(icon, { className: iconSizes[size] }) : icon;
    const leftIcon = propLeftIcon || resolvedIcon;
    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: `
        bg-[#881337] text-white
        hover:bg-[#9F1239]
        focus-visible:ring-2 focus-visible:ring-[#881337] focus-visible:ring-offset-2
        active:bg-[#BE123C] active:scale-[0.98]
        disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:text-stone-500
        shadow-xs
      `,
      secondary: `
        bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white
        hover:bg-slate-200 dark:hover:bg-white/15
        focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
        active:bg-slate-300 dark:active:bg-white/20 active:scale-[0.98]
        disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400
        border border-slate-200 dark:border-white/15
      `,
      ghost: `
        bg-transparent text-slate-700 dark:text-slate-200
        hover:bg-slate-100 dark:hover:bg-white/10
        focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2
        active:bg-slate-200 dark:active:bg-white/15 active:scale-[0.98]
        disabled:text-slate-400
      `,
      danger: `
        bg-rose-600 text-white
        hover:bg-rose-700
        focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2
        active:bg-rose-800 active:scale-[0.98]
        disabled:bg-slate-300 disabled:text-slate-500
        shadow-xs
      `,
      destructive: `
        bg-rose-600 text-white
        hover:bg-rose-700
        focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2
        active:bg-rose-800 active:scale-[0.98]
        disabled:bg-slate-300 disabled:text-slate-500
        shadow-xs
      `,
      success: `
        bg-emerald-700 text-white
        hover:bg-emerald-800
        focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
        active:bg-emerald-900 active:scale-[0.98]
        disabled:bg-slate-300 disabled:text-slate-500
        shadow-xs
      `,
      outline: `
        bg-transparent text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/20
        hover:bg-slate-50 dark:hover:bg-white/10
        focus-visible:ring-2 focus-visible:ring-[#881337] focus-visible:ring-offset-2
        active:bg-slate-100 dark:active:bg-white/15 active:scale-[0.98]
        disabled:border-slate-200 disabled:text-slate-400
      `
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5'
    };

    const baseStyles = `
      inline-flex items-center justify-center
      font-semibold rounded-xl
      transition-all duration-150
      focus:outline-none focus-visible:outline-none
      disabled:cursor-not-allowed disabled:opacity-60
      whitespace-nowrap select-none
      ${fullWidth ? 'w-full' : ''}
    `;

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    const renderLeftIcon = () => {
      if (isLoading) {
        return <Loader2 className={`${iconSizes[size]} animate-spin`} aria-hidden="true" />;
      }
      if (leftIcon) {
        return <span className={iconSizes[size]} aria-hidden="true">{leftIcon}</span>;
      }
      return null;
    };

    const renderRightIcon = () => {
      if (!isLoading && rightIcon) {
        return <span className={iconSizes[size]} aria-hidden="true">{rightIcon}</span>;
      }
      return null;
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ref,
        className: `${combinedClassName} ${child.props.className || ''}`.trim(),
        children: (
          <>
            {renderLeftIcon()}
            {child.props.children}
            {renderRightIcon()}
          </>
        ),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={combinedClassName}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {renderLeftIcon()}
        {children && <span>{isLoading && loadingText ? loadingText : children}</span>}
        {renderRightIcon()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
