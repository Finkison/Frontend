import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useScope } from "../../hooks/useScope";
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  GraduationCap,
} from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactElement;

  allowedRoles?: string[];

  minGrade?: number;

  requireFeature?: keyof ReturnType<typeof useScope>;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  minGrade,
  requireFeature,
}: ProtectedRouteProps): React.ReactElement {
  const location = useLocation();
  const { isAuthenticated, role, sessionInitialized } = useAuthStore();
  const scope = useScope();

  if (!sessionInitialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Restoring your session">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E7E0D6] border-t-[#881337] dark:border-white/10 dark:border-t-[#FBBF24]" aria-hidden="true" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = (role || "UNKNOWN").toUpperCase();
    const isAllowed = allowedRoles.some(
      (r) => r.toUpperCase() === currentRole
    ) || scope.isElevated;

    if (!isAllowed) {

      const fallbackRoute = scope.homeRoute || (
        currentRole === "PARENT"
          ? "/parent"
          : currentRole === "TEACHER" || currentRole === "PRINCIPAL"
          ? "/school"
          : "/student"
      );
      return <Navigate to={fallbackRoute} replace state={{ fromUnauthorized: location.pathname }} />;
    }
  }

  if (minGrade && scope.isStudent && !scope.isElevated) {
    if (scope.gradeLevel < minGrade) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#261E1A] rounded-3xl p-8 shadow-2xl border border-amber-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="font-sans text-2xl font-bold text-stone-900 dark:text-[#FDFBF7]">
              Grade Level Restricted
            </h2>
            <p className="text-sm text-stone-600 dark:text-[#E7E0D6]">
              This feature is available for{" "}
              <span className="font-semibold text-stone-800 dark:text-[#FDFBF7]">
                Grade {minGrade}+
              </span>{" "}
              students. You are currently enrolled in{" "}
              <span className="font-semibold text-stone-800 dark:text-[#FDFBF7]">
                {scope.gradeDisplay}
              </span>.
            </p>
            <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-amber-800 font-medium">
                <GraduationCap className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                Continue your {scope.gradeDisplay} coursework and this feature will
                unlock when you progress to Grade {minGrade}.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/student"
                className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to {scope.gradeDisplay} Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  if (requireFeature && !scope[requireFeature]) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#261E1A] rounded-3xl p-8 shadow-2xl border border-stone-200 dark:border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-[#201815] text-stone-500 dark:text-[#A89C90] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-sans text-2xl font-bold text-stone-900 dark:text-[#FDFBF7]">
            Feature Not Available
          </h2>
          <p className="text-sm text-stone-600 dark:text-[#E7E0D6]">
            This feature is not available for your current account scope
            ({scope.gradeDisplay} — {scope.stream}).
          </p>
          <div className="pt-4">
              <Link
                to={scope.homeRoute}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
              </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
