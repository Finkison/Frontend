import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChildProgress } from "../../services/parentService";

export default function ChildDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);

  useEffect(() => {
    getChildProgress(id || "child-1")
      .then((r) => setChild(r.data))
      .catch(() => setChild(null));
  }, [id]);

  if (!child) {
    return (
      <div className="container">
        <div className="card" style={{ padding: 30, textAlign: "center" }}>
          <h3 style={{ color: "var(--navy)" }}>Child Roster Record Unresolved</h3>
          <button className="btn primary" onClick={() => navigate("/parent")} style={{ marginTop: 14 }}>Return to Portal</button>
        </div>
      </div>
    );
  }

  // Simulated timeline logs
  const events = [
    { type: "info", time: "May 25, 2026", title: "Math Practice Mastered", desc: "Completed Calculus & Limits with a fantastic score of 82%." },
    { type: "warning", time: "May 24, 2026", title: "Physics Alert Logged", desc: "Accuracy dropped below 50% in Electromagnetism. Study plan updated." },
    { type: "danger", time: "May 20, 2026", title: "Missed Homework Flag", desc: "Unfinished Chemistry unit assignment flagged by educator Mrs. Helen." }
  ];

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
      {/* Left panel: Detailed performance grids */}
      <div>
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ color: "var(--navy)", margin: 0 }}>{child.name || "Student Child"}</h2>
            <span className="status-pill" style={{ background: "var(--teal-lt)", color: "var(--teal)", fontWeight: 700 }}>
              Grade {child.grade} Natural Stream
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <span className="muted" style={{ fontSize: 11 }}>Projected National Score</span>
              <h3 style={{ fontSize: 24, color: "var(--navy)", marginTop: 4 }}>
                {child.predicted_score || 0} / 700
              </h3>
            </div>
            <div style={{ padding: 14, background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <span className="muted" style={{ fontSize: 11 }}>Career Department Goal</span>
              <h3 style={{ fontSize: 18, color: "var(--gold-dk)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {child.department || "Software Engineering"}
              </h3>
            </div>
          </div>

          <h3 style={{ fontSize: 16, color: "var(--navy)", marginBottom: 12 }}>Identified Conceptual Weak Areas</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {(child.weak_subjects || ["Physics", "Biology"]).map((sub) => {
              const accuracy = sub === "Physics" ? 45 : 38;
              return (
                <div key={sub} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <strong>{sub} Diagnostic</strong>
                    <span style={{ color: "var(--danger)", fontWeight: 700 }}>{accuracy}% Accuracy</span>
                  </div>
                  <div className="meter-track" style={{ background: "rgba(15, 39, 68, 0.05)" }}>
                    <div className="meter-fill" style={{ width: `${accuracy}%`, background: "var(--danger)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="btn ghost" onClick={() => navigate("/parent")}>← Return to Portal</button>
      </div>

      {/* Right panel: Timeline feeds */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ color: "var(--navy)", marginBottom: 16 }}>Timeline Feed</h3>
        <div className="timeline">
          {events.map((ev, idx) => (
            <div key={idx} className={`timeline-event ${ev.type}`}>
              <div className="timeline-time">{ev.time}</div>
              <div className="timeline-body">
                <h4>{ev.title}</h4>
                <p>{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
