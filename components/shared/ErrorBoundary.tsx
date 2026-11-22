import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled render error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#261E1A] rounded-3xl p-8 border border-stone-200 dark:border-white/10 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-sans text-2xl font-bold text-stone-900 dark:text-[#FDFBF7]">Application Notice</h3>
              <p className="text-xs text-stone-500 dark:text-[#A89C90] mt-1 leading-relaxed">
                A component experienced a transient render issue. Your exam progress and answers remain safely stored.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#1C1512] border border-stone-200 dark:border-white/10 text-stone-600 dark:text-[#E7E0D6] text-[11px] font-mono text-left max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={() => { window.location.href = "/student"; }}
                className="py-3 px-4 rounded-xl border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-700 dark:text-[#E7E0D6] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
