import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

export type DrawerPosition = "left" | "right" | "bottom";
export type DrawerSize = "sm" | "md" | "lg" | "full";

export interface EnterpriseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  position?: DrawerPosition;
  size?: DrawerSize;
  children: React.ReactNode;
  footerActions?: {
    primaryText?: string;
    onPrimary?: () => void;
    secondaryText?: string;
    onSecondary?: () => void;
  };
  triggerRef?: React.RefObject<HTMLElement | null>;
  id?: string;
}

export type DrawerProps = EnterpriseDrawerProps;

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  position = "right",
  size = "md",
  children,
  footerActions,
  triggerRef,
  id = "enterprise-drawer",
}: EnterpriseDrawerProps): React.ReactElement | null {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and return focus on close
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock with stable scrollbar-gutter
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Set initial focus to close button
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      // Return focus to trigger element if provided
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // Size width mapping
  const widthClasses = {
    sm: "w-full sm:w-[400px]",
    md: "w-full sm:w-[480px]",
    lg: "w-full sm:w-[640px] sm:max-w-[90vw]",
    full: "w-full sm:max-w-xl",
  }[size];

  // Position specific layout classes
  const positionClasses = {
    left: "top-0 left-0 bottom-0 border-r border-slate-200",
    right: "top-0 right-0 bottom-0 border-l border-slate-200",
    bottom: "bottom-0 left-0 right-0 max-h-[85vh] rounded-t-[16px] border-t border-slate-200",
  }[position];

  return (
    <div
      className="fixed inset-0 z-drawer flex"
      style={{ zIndex: "var(--z-drawer, 300)" }}
      role="region"
      aria-label={`${title} drawer dialog`}
    >
      {/* Overlay Scrim (50% opacity, click-outside to close) */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-250 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={subtitle ? `${id}-desc` : undefined}
        className={`fixed bg-white shadow-2xl flex flex-col transition-transform duration-250 ease-out ${positionClasses} ${
          position === "bottom" ? "w-full" : widthClasses
        }`}
      >
        {/* Mobile bottom sheet drag handle */}
        {position === "bottom" && (
          <div className="w-full flex items-center justify-center pt-3 pb-1" aria-hidden="true">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>
        )}

        {/* Sticky Header: 64px with title + 44px close button */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-white">
          <div>
            <h2 id={`${id}-title`} className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p id={`${id}-desc`} className="text-xs text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="w-11 h-11 inline-flex items-center justify-center rounded-[6px] text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Body (24px padding, overscroll-behavior: contain) */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ overscrollBehavior: "contain" }}
        >
          {children}
        </div>

        {/* Sticky Footer with actions (primary right, secondary left) */}
        {footerActions && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-shrink-0">
            {footerActions.secondaryText && (
              <button
                type="button"
                onClick={footerActions.onSecondary || onClose}
                className="h-11 px-5 rounded-[6px] border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#881337]"
              >
                {footerActions.secondaryText}
              </button>
            )}
            {footerActions.primaryText && (
              <button
                type="button"
                onClick={footerActions.onPrimary}
                className="h-11 px-6 ml-auto rounded-[6px] bg-[#881337] hover:bg-[#9F1239] text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]"
              >
                {footerActions.primaryText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { Drawer };
export const EnterpriseDrawer = Drawer;
