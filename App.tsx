import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import PublicNavbar from "./components/navigation/PublicNavbar";
import Footer from "./components/shared/Footer";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./components/ui";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const AcademicsPage = lazy(() => import("./pages/AcademicsPage"));
const AiFeaturesPage = lazy(() => import("./pages/AiFeaturesPage"));
const SchoolsPage = lazy(() => import("./pages/SchoolsPage"));
const ForSchoolsPage = SchoolsPage;
const TeachersPage = lazy(() => import("./pages/TeachersPage"));
const ForTeachersPage = TeachersPage;
const StudentsPage = lazy(() => import("./pages/StudentsPage"));
const ForStudentsPage = StudentsPage;
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const SchoolPortalPage = lazy(() => import("./pages/SchoolPortalPage"));
const InstitutionalDashboard = SchoolPortalPage;
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const DesignSystemShowcasePage = lazy(() => import("./pages/DesignSystemShowcasePage"));
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));
const ParentRoutes = lazy(() => import("./routes/ParentRoutes"));
const SchoolRoutes = lazy(() => import("./routes/SchoolRoutes"));
const TeacherRoutes = lazy(() => import("./routes/TeacherRoutes"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-[#881337] rounded-full animate-spin mx-auto" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-6 h-6 rounded-lg bg-[#4C0519] flex items-center justify-center">
              <span className="text-[#FBBF24] text-[10px] font-bold">F</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium">Loading Finkison...</p>
      </div>
    </div>
  );
}

export default function App(): React.ReactElement {
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isInstitutionalPage =
    location.pathname.startsWith("/school") ||
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/parent") ||
    location.pathname.startsWith("/teacher");
  const isPublicPage = !isAuthPage && !isInstitutionalPage;

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="flex flex-col min-h-screen bg-white text-slate-900 transition-colors">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          {isPublicPage && <PublicNavbar />}
          <main id="main-content" className="flex-1" role="main">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/academics" element={<AcademicsPage />} />
                <Route path="/subjects" element={<Navigate to="/academics" replace />} />
                <Route path="/ai-features" element={<AiFeaturesPage />} />
                <Route path="/schools" element={<SchoolsPage />} />
                <Route path="/for-schools" element={<SchoolsPage />} />
                <Route path="/solutions/schools" element={<SchoolsPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/for-teachers" element={<TeachersPage />} />
                <Route path="/solutions/teachers" element={<TeachersPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/for-students" element={<StudentsPage />} />
                <Route path="/solutions/students" element={<StudentsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/security" element={<Navigate to="/school/security" replace />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/demo" element={<Navigate to="/contact" replace />} />
                <Route path="/request-demo" element={<Navigate to="/contact" replace />} />
                <Route path="/consultation" element={<Navigate to="/contact" replace />} />
                <Route path="/schedule-consultation" element={<Navigate to="/contact" replace />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/client" element={<SchoolPortalPage />} />
                <Route path="/institution" element={<SchoolPortalPage />} />
                <Route path="/school-portal" element={<SchoolPortalPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/design-system" element={<DesignSystemShowcasePage />} />

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
                    <ProtectedRoute allowedRoles={["PRINCIPAL", "SCHOOL_ADMIN", "ADMIN", "SUPER_ADMIN"]}>
                      <ErrorBoundary>
                        <SchoolRoutes />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/*"
                  element={
                    <ProtectedRoute allowedRoles={["TEACHER", "ADMIN", "SUPER_ADMIN"]}>
                      <ErrorBoundary>
                        <TeacherRoutes />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          {isPublicPage && <Footer />}
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}
