import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  showToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const ToastProvider = EnterpriseToastProvider;

export function EnterpriseToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // Max 3 stacked toasts
      const updated = [...prev, { ...toast, id }];
      return updated.slice(-3);
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, showToast: addToast, removeToast }}>
      {children}
      <EnterpriseToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

function EnterpriseToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}): React.ReactElement | null {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md flex flex-col gap-2 pointer-events-none"
      style={{ zIndex: "var(--z-toast, 500)" }}
      aria-label="Notification alerts"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}): React.ReactElement {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.durationMs || 5000;

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [isPaused, duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-700 flex-shrink-0" aria-hidden="true" />,
    error: <AlertCircle size={20} className="text-red-700 flex-shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle size={20} className="text-amber-700 flex-shrink-0" aria-hidden="true" />,
    info: <Info size={20} className="text-[#881337] flex-shrink-0" aria-hidden="true" />,
  }[toast.type];

  const borderClasses = {
    success: "border-emerald-200 bg-white",
    error: "border-red-200 bg-white",
    warning: "border-amber-200 bg-white",
    info: "border-rose-200 bg-white",
  }[toast.type];

  const isAlert = toast.type === "error";

  return (
    <div
      role={isAlert ? "alert" : "status"}
      aria-live={isAlert ? "assertive" : "polite"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[12px] border ${borderClasses} shadow-lg transition-transform duration-200 ease-out`}
    >
      {icons}
      <div className="flex-1 text-start">
        <p className="text-sm font-semibold text-slate-900 leading-tight">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="w-8 h-8 inline-flex items-center justify-center rounded-[6px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#881337]"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
