import { useEffect, useState } from "react";
import { getDepartments } from "../../services/studentService";

export default function DepartmentsExplorer() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getDepartments()
      .then((r) => setItems(r.data))
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="container" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>Career Departments & Pathfinders</h2>
        <p className="muted">Explore professional career demands, projected salary scales, and match them with curriculum tracks.</p>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 20 }}>No career departments available.</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {items.map((d) => {
            const isCritical = d.demand_level === "Critical" || d.name === "Software Engineering" || d.name === "Cybersecurity";
            const isHigh = d.demand_level === "High" || d.name === "Data Science & AI";
            const demandClass = isCritical ? "critical" : isHigh ? "high" : "medium";
            const demandText = isCritical ? "Critical Demand" : isHigh ? "High Demand" : "Moderate Demand";

            return (
              <div key={d.id} className="card dept-card" style={{ padding: 20 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 18, color: "var(--navy)", margin: 0 }}>{d.name}</h3>
                    <span className={`dept-badge ${demandClass}`}>{demandText}</span>
                  </div>
                  
                  <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
                    {d.description}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <div style={{ fontSize: 12, marginBottom: 8, color: "var(--txt2)" }}>
                    💼 <strong>Career Pathways:</strong>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                      {(d.career_paths || []).map((path) => (
                        <span key={path} className="status-pill" style={{ background: "rgba(15, 39, 68, 0.04)", fontSize: 10, padding: "4px 8px" }}>
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginTop: 12 }}>
                    <span>💵 <strong>Salary Scale:</strong></span>
                    <strong style={{ color: "var(--teal)" }}>{d.salary_projection || "$80,000 - $130,000"}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
