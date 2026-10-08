import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const { isAuthenticated, role } = useAuthStore();
  const scope = useScope();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const currentRole = (role || "STUDENT").toUpperCase();
    const isAllowed = allowedRoles.some(
      (r) => r.toUpperCase() === currentRole
    ) || scope.isElevated;

    if (!isAllowed) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-red-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Access Restricted
            </h2>
            <p className="text-sm text-slate-600">
              Your account role (
              <span className="font-semibold text-slate-800">
                {scope.role}
              </span>
              ) does not have authorization to view this portal.
              You can only access features within your assigned scope.
            </p>
            <div className="pt-4">
              <a
                href={scope.homeRoute}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Your {scope.isParent ? "Parent" : scope.isEducator ? "School" : "Student"} Portal</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  if (minGrade && scope.isStudent && !scope.isElevated) {
    if (scope.gradeLevel < minGrade) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-amber-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Grade Level Restricted
            </h2>
            <p className="text-sm text-slate-600">
              This feature is available for{" "}
              <span className="font-semibold text-slate-800">
                Grade {minGrade}+
              </span>{" "}
              students. You are currently enrolled in{" "}
              <span className="font-semibold text-slate-800">
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
              <a
                href="/student"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to {scope.gradeDisplay} Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  if (requireFeature && !scope[requireFeature]) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Feature Not Available
          </h2>
          <p className="text-sm text-slate-600">
            This feature is not available for your current account scope
            ({scope.gradeDisplay} — {scope.stream}).
          </p>
          <div className="pt-4">
            <a
              href={scope.homeRoute}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
