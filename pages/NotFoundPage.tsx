import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Home, ArrowLeft, BookOpen, Sparkles } from "lucide-react";

export default function NotFoundPage(): React.ReactElement {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg space-y-6">
        {/* 404 Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 flex items-center justify-center shadow-2xl">
          <GraduationCap className="w-10 h-10 text-amber-400" />
        </div>

        {/* Error Code */}
        <div>
          <span className="font-serif text-7xl font-bold text-slate-200 tracking-tight">404</span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">Page Not Found</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            This page doesn't exist in the Ethiopian National Curriculum — or anywhere else on our platform.
            Let's get you back on track to score 500+.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/student/practice"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-50 text-amber-800 text-sm font-semibold border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Start Practice</span>
          </Link>
          <Link
            to="/academics"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-700 text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Browse Curriculum</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
