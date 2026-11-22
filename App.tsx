import React, { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import PublicNavbar from "./components/navigation/PublicNavbar";
import Footer from "./components/shared/Footer";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./components/ui";
import { PORTAL_ALLOWED_ROLES } from "./constants/routes";
import { initializeAuthSession } from "./services/api";
import useAuthStore from "./store/authStore";
import { useI18n } from "./i18n";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AcceptInvitationPage = lazy(() => import("./pages/AcceptInvitationPage"));
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
const FamiliesPage = lazy(() => import("./pages/FamiliesPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const DesignSystemShowcasePage = lazy(() => import("./pages/DesignSystemShowcasePage"));
const StudentRoutes = lazy(() => import("./routes/StudentRoutes"));
const ParentRoutes = lazy(() => import("./routes/ParentRoutes"));
const SchoolRoutes = lazy(() => import("./routes/SchoolRoutes"));
const TeacherRoutes = lazy(() => import("./routes/TeacherRoutes"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function PageLoader() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t("appNavigation.loadingPage")}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#E7E0D6] border-t-[#881337] dark:border-white/10 dark:border-t-[#FBBF24]" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="w-6 h-6 rounded-lg bg-[#4C0519] flex items-center justify-center">
              <span className="text-[#FBBF24] text-[10px] font-bold">F</span>
            </div>
          </div>
        </div>
        <p className="text-sm font-medium text-stone-500 dark:text-[#A89C90]">{t("appNavigation.loadingProduct")}</p>
      </div>
    </div>
  );
}

export default function App(): React.ReactElement {
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const restoreSession = () => {
      if (isMounted) void initializeAuthSession();
    };
    const unsubscribe = useAuthStore.persist.onFinishHydration(restoreSession);
    if (useAuthStore.persist.hasHydrated()) restoreSession();
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const isAuthPage = ["/login", "/register", "/accept-invitation"].includes(location.pathname);
  const isInstitutionalPage = /^\/(school|student|parent|teacher|client|institution)(\/|$)/.test(location.pathname) || location.pathname === "/school-portal";
  const isDesignSystemPage = import.meta.env.DEV && location.pathname === "/design-system";
  const isPublicPage = !isAuthPage && !isInstitutionalPage && !isDesignSystemPage;

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#1C1512] text-[#261E1A] dark:text-[#FDFBF7] transition-colors">
          {!isInstitutionalPage && <a href="#main-content" className="skip-link">Skip to main content</a>}
          {isPublicPage && <PublicNavbar />}
          <main id="main-content" className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-we-work" element={<TeamPage />} />
                <Route path="/team" element={<Navigate to="/how-we-work" replace />} />
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
                <Route path="/for-families" element={<FamiliesPage />} />
                <Route path="/families" element={<Navigate to="/for-families" replace />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/demo" element={<Navigate to="/contact" replace />} />
                <Route path="/request-demo" element={<Navigate to="/contact" replace />} />
                <Route path="/consultation" element={<Navigate to="/contact" replace />} />
                <Route path="/schedule-consultation" element={<Navigate to="/contact" replace />} />
                <Route path="/pricing/request-quote" element={<Navigate to="/contact?topic=Pricing" replace />} />
                <Route path="/checkout" element={<Navigate to="/pricing#student-plans" replace />} />
                <Route path="/client" element={<Navigate to="/school" replace />} />
                <Route path="/institution" element={<Navigate to="/school" replace />} />
                <Route path="/school-portal" element={<Navigate to="/school" replace />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                {import.meta.env.DEV && (
                  <Route path="/design-system" element={<DesignSystemShowcasePage />} />
                )}

                <Route
                  path="/student/*"
                  element={
                    <ProtectedRoute allowedRoles={PORTAL_ALLOWED_ROLES.student}>
                      <ErrorBoundary>
                        <StudentRoutes />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/parent/*"
                  element={
                    <ProtectedRoute allowedRoles={PORTAL_ALLOWED_ROLES.parent}>
                      <ErrorBoundary>
                        <ParentRoutes />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/school/*"
                  element={
                    <ProtectedRoute allowedRoles={PORTAL_ALLOWED_ROLES.school}>
                      <ErrorBoundary>
                        <SchoolRoutes />
                      </ErrorBoundary>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/*"
                  element={
                    <ProtectedRoute allowedRoles={PORTAL_ALLOWED_ROLES.teacher}>
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
