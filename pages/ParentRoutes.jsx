import { Route, Routes } from "react-router-dom";
import ParentLayout from "../components/layouts/ParentLayout";
import ParentDashboard from "../components/parent/ParentDashboard";
import ChildDetailView from "../components/parent/ChildDetailView";
import AlertsPanel from "../components/parent/AlertsPanel";
import TeacherMessaging from "../components/parent/TeacherMessaging";

export default function ParentRoutes() {
  return (
    <ParentLayout>
      <Routes>
        <Route index element={<ParentDashboard />} />
        <Route path="child/:id" element={<ChildDetailView />} />
        <Route path="alerts" element={<AlertsPanel />} />
        <Route path="messages" element={<TeacherMessaging />} />
      </Routes>
    </ParentLayout>
  );
}
