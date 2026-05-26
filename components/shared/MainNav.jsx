import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function MainNav() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const items = [
    { to: "/", label: "Home" },
    { to: "/student", label: "Student" },
    { to: "/parent", label: "Parent" },
    { to: "/school", label: "School" },
    { to: "/login", label: isAuthenticated ? "Switch Account" : "Login" },
  ];

  return (
    <header className="main-nav-wrap sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="container main-nav mx-auto flex flex-wrap items-center justify-between gap-4 py-4">
        <NavLink to="/" className="brand-mark text-lg font-semibold text-slate-900">Finkison</NavLink>
        <nav className="main-nav-links flex flex-wrap gap-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `main-link rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-finkison-gold text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
