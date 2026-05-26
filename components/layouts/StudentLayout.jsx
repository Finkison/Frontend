import TopNav from "../shared/TopNav";
import SideNav from "../shared/SideNav";

export default function StudentLayout({ children }) {
  const links = [
    { to: "/student", label: "Dashboard" },
    { to: "/student/practice", label: "Practice" },
    { to: "/student/weak-areas", label: "Weak Areas" },
    { to: "/student/score", label: "Score Predictor" },
    { to: "/student/scholarships", label: "Scholarships" },
    { to: "/student/leaderboard", label: "Leaderboard" },
    { to: "/student/departments", label: "Departments" },
    { to: "/student/technology", label: "Technology" },
    { to: "/student/profile", label: "Profile" },
  ];

  return (
    <div className="layout">
      <SideNav links={links} />
      <main>
        <TopNav title="Student" />
        {children}
      </main>
    </div>
  );
}
