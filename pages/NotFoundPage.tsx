import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import { FinkisonMark } from "../components/shared/FinkisonLogo";

export default function NotFoundPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Page not found — Finkison";
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#FAF8F5] text-[#1C1512] font-sans">
      <div className="text-center max-w-lg space-y-6 p-8 sm:p-12 rounded-2xl bg-white border border-[#E8E2D9] shadow-xs">
        {/* Logo */}
        <div className="flex justify-center">
          <FinkisonMark size={64} />
        </div>

        {/* Error Code & Message */}
        <div>
          <span className="text-5xl font-mono font-bold text-[#881337] tracking-tight block">404</span>
          <h1 className="text-2xl font-bold text-[#1C1512] mt-2 tracking-tight">Page not found</h1>
          <p className="text-sm text-[#574C43] mt-2 leading-relaxed">
            The requested page does not exist or has been moved. Use the links below to return to the platform.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] active:bg-[#BE123C] text-white text-xs font-semibold transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-[#881337]"
          >
            <Home className="w-4 h-4 text-white" />
            <span>Return to home</span>
          </Link>
          <Link
            to="/academics"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] border border-[#E8E2D9] hover:bg-[#FAF8F5] text-[#1C1512] text-xs font-semibold transition-colors"
          >
            <BookOpen className="w-4 h-4 text-[#574C43]" />
            <span>Browse curriculum</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
