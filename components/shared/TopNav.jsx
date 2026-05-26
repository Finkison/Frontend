import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { useI18n } from "../../i18n";

export default function TopNav({ title }) {
  const user = useAuthStore((s) => s.user);
  const { language, setLanguage, t } = useI18n();
  const location = useLocation();
  const name = useMemo(() => user?.full_name || user?.name || "Learner", [user]);

  return (
    <div className="topbar">
      <div>
        <strong>{title}</strong>
        <div className="topbar-meta">{t("welcome_back")}, {name}</div>
        <div className="topbar-meta">Path: {location.pathname}</div>
      </div>
      <div className="topbar-actions">
        <input className="form-control search-control" type="search" placeholder="Quick search" />
        <button className="btn ghost" type="button">Alerts</button>
        <select className="form-control language-select" value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Language">
          <option value="en">EN</option>
          <option value="am">AM</option>
          <option value="om">OM</option>
        </select>
        <div className="status-pill">{t("live")}</div>
      </div>
    </div>
  );
}
