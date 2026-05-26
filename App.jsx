import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import StudentRoutes from "./pages/StudentRoutes";
import ParentRoutes from "./pages/ParentRoutes";
import SchoolRoutes from "./pages/SchoolRoutes";
import MainNav from "./components/shared/MainNav";

export default function App() {
  return (
    <>
      <MainNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/parent/*" element={<ParentRoutes />} />
        <Route path="/school/*" element={<SchoolRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
