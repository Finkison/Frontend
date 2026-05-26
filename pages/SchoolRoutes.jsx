import { Route, Routes } from "react-router-dom";
import SchoolLayout from "../components/layouts/SchoolLayout";
import SchoolDashboard from "../components/school/SchoolDashboard";
import ClassView from "../components/school/ClassView";
import StudentTable from "../components/school/StudentTable";
import TeacherPortal from "../components/school/TeacherPortal";
import ReportsExport from "../components/school/ReportsExport";

export default function SchoolRoutes() {
  return (
    <SchoolLayout>
      <Routes>
        <Route index element={<SchoolDashboard />} />
        <Route path="class" element={<ClassView />} />
        <Route path="students" element={<StudentTable />} />
        <Route path="teachers" element={<TeacherPortal />} />
        <Route path="reports" element={<ReportsExport />} />
      </Routes>
    </SchoolLayout>
  );
}
