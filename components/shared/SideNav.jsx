import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function SideNav({ links }) {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  return (
    <aside className="card side-nav">
      <h3>Navigation</h3>
      <div className="side-links">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className="sidebar-actions">
        {isAuthenticated ? (
          <button className="btn ghost" onClick={() => { logout(); navigate("/"); }}>Logout</button>
        ) : (
          <button className="btn ghost" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </aside>
  );
}
