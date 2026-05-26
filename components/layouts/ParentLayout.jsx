import TopNav from "../shared/TopNav";
import SideNav from "../shared/SideNav";

export default function ParentLayout({ children }) {
  const links = [
    { to: "/parent", label: "Dashboard" },
    { to: "/parent/alerts", label: "Alerts" },
    { to: "/parent/messages", label: "Messages" },
  ];

  return (
    <div className="layout">
      <SideNav links={links} />
      <main>
        <TopNav title="Parent" />
        {children}
      </main>
    </div>
  );
}
