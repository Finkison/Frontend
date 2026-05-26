import TopNav from "../shared/TopNav";
import SideNav from "../shared/SideNav";

export default function SchoolLayout({ children }) {
  const links = [
    { to: "/school", label: "Dashboard" },
    { to: "/school/class", label: "Class View" },
    { to: "/school/students", label: "Students" },
    { to: "/school/teachers", label: "Teachers" },
    { to: "/school/reports", label: "Reports" },
  ];

  return (
    <div className="layout">
      <SideNav links={links} />
      <main>
        <TopNav title="School" />
        {children}
      </main>
    </div>
  );
}
