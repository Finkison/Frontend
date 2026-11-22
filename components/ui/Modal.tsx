import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "md",
}: ModalProps): React.ReactElement | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const instanceId = useId().replace(/:/g, "");
  const titleId = `modal-${instanceId}-title`;
  const descriptionId = `modal-${instanceId}-description`;

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (triggerRef.current && (triggerRef.current as HTMLElement).focus) {
      (triggerRef.current as HTMLElement).focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="fixed inset-0 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
      style={{ zIndex: "var(--z-modal, 400)" }}
    >

      <div
        className="fixed inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        className={`relative w-full ${widthClasses[maxWidth]} bg-white dark:bg-[#261E1A] border border-stone-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]`}
      >

        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-stone-200 dark:border-white/10">
          <div className="space-y-1 pr-4">
            <h2 id={titleId} className="text-lg font-bold text-stone-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-xs text-stone-500 dark:text-stone-400">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-lg text-stone-400 dark:text-[#A89C90] hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337]"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-sm text-stone-800 dark:text-stone-200">
          {children}
        </div>

        {footer && (
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-white/5 border-t border-stone-200 dark:border-white/10 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}

export default Modal;
