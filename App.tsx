import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MainNav from "./components/shared/MainNav";
import Footer from "./components/shared/Footer";
import NetworkStatusBanner from "./components/shared/NetworkStatusBanner";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ErrorBoundary from "./components/shared/ErrorBoundary";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const AcademicsPage = lazy(() => import("./pages/AcademicsPage"));
const StudentRoutes = lazy(() => import("./pages/StudentRoutes"));
const ParentRoutes = lazy(() => import("./pages/ParentRoutes"));
const SchoolRoutes = lazy(() => import("./pages/SchoolRoutes"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-amber-400 text-[10px] font-bold">F</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">Loading Finkison...</p>
      </div>
    </div>
  );
}

function useShowFooter(): boolean {
  const location = useLocation();
  const dashboardPrefixes = ["/student", "/parent", "/school"];
  return !dashboardPrefixes.some((prefix) => location.pathname.startsWith(prefix));
}

export default function App(): React.ReactElement {
  const showFooter = useShowFooter();

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <NetworkStatusBanner />
        <MainNav />
        <main id="main-content" className="flex-1" role="main">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/academics" element={<AcademicsPage />} />

              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
                    <ErrorBoundary>
                      <StudentRoutes />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent/*"
                element={
                  <ProtectedRoute allowedRoles={["PARENT", "ADMIN"]}>
                    <ErrorBoundary>
                      <ParentRoutes />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/school/*"
                element={
                  <ProtectedRoute allowedRoles={["TEACHER", "PRINCIPAL", "ADMIN"]}>
                    <ErrorBoundary>
                      <SchoolRoutes />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        {showFooter && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
