import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChildren } from "../../services/parentService";

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);

  useEffect(() => {
    getChildren()
      .then((r) => setChildren(r.data || []))
      .catch(() => setChildren([]));
  }, []);

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>Parent Portal Overview</h2>
        <p className="muted">Monitor your children's real-time national exam diagnostics, study streaks, and school notifications.</p>
      </div>

      {children.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: "center" }}>
          <h4 style={{ color: "var(--navy)" }}>No Children Registered</h4>
          <p className="muted" style={{ margin: "10px 0 16px" }}>Please register child student IDs in your account settings or contact the school office.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {children.map((c) => {
            const targetScore = 650; // Mock default
            const progress = Math.min(100, Math.round(((c.predicted_score || 0) / targetScore) * 100));

            return (
              <div key={c.id} className="card" style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 200px", gap: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 18, color: "var(--navy)", margin: 0 }}>
                      👤 {c.user__full_name || "Student Child"}
                    </h3>
                    <span className="status-pill" style={{ background: "var(--gold-lt)", color: "var(--gold-dk)", fontWeight: 700 }}>
                      Grade {c.grade} — {c.stream || "General Science"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "14px 0", fontSize: 13 }}>
                    <div>📊 <strong>Predicted Entrance Score:</strong> {c.predicted_score || 0}/700</div>
                    <div>🔥 <strong>Active Streak:</strong> 18 days</div>
                  </div>

                  {/* Goal Progress track */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                      <span>Target Milestone Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="meter-track" style={{ background: "rgba(15, 39, 68, 0.05)" }}>
                      <div className="meter-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, borderLeft: "1px solid var(--border)", paddingLeft: 20 }}>
                  <button 
                    className="btn primary" 
                    style={{ fontSize: 12, width: "100%" }}
                    onClick={() => navigate(`child/${c.id}`)}
                  >
                    View Academic Progress
                  </button>
                  <button 
                    className="btn ghost" 
                    style={{ fontSize: 12, width: "100%" }}
                    onClick={() => navigate("messages")}
                  >
                    Message School
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
