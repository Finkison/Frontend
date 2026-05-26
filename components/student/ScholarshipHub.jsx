import { useEffect, useState } from "react";
import { getMatchedScholarships, getScholarships } from "../../services/discoveryService";

export default function ScholarshipHub() {
  const [all, setAll] = useState([]);
  const [matched, setMatched] = useState([]);
  const [applied, setApplied] = useState({});

  useEffect(() => {
    getScholarships()
      .then((r) => setAll(r.data || []))
      .catch(() => setAll([]));
    getMatchedScholarships()
      .then((r) => setMatched(r.data || []))
      .catch(() => setMatched([]));
  }, []);

  const handleApply = (id) => {
    setApplied({ ...applied, [id]: "Applied" });
  };

  const getStatusStyle = (status) => {
    if (status === "Matched") return { background: "var(--teal-lt)", color: "var(--teal)" };
    return { background: "rgba(15, 39, 68, 0.04)", color: "var(--txt2)" };
  };

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Matched Scholarships */}
      <div>
        <h3 style={{ color: "var(--navy)", marginBottom: 14 }}>🎯 Tailored Matches for You</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          Scholarships synced directly with your predicted score tier and career department tracks.
        </p>

        {matched.length === 0 ? (
          <div className="card" style={{ padding: 20 }}>No tailored matches available yet. Complete more practice sessions!</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {matched.map((s) => {
              const hasApplied = applied[s.id];
              return (
                <div key={s.id} className="card" style={{ padding: 18, borderLeft: "4px solid var(--teal)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <h4 style={{ fontSize: 15, color: "var(--navy)", fontWeight: 700 }}>{s.title}</h4>
                      <span className="muted" style={{ fontSize: 12 }}>{s.provider}</span>
                    </div>
                    <span className="status-pill" style={getStatusStyle("Matched")}>Matched</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, margin: "10px 0" }}>
                    <div>💰 <strong>Award:</strong> {s.amount || "N/A"}</div>
                    <div>⏱️ <strong>Deadline:</strong> {s.deadline || "TBA"}</div>
                    <div>🎓 <strong>Type:</strong> {s.type || "Merit"}</div>
                    <div>📋 <strong>Criteria:</strong> {s.eligibility || "Standard"}</div>
                  </div>

                  <button 
                    className="btn primary" 
                    style={{ width: "100%", marginTop: 8, fontSize: 12 }}
                    onClick={() => handleApply(s.id)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? "✓ Application Received" : "Apply Instantly"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Scholarships list */}
      <div>
        <h3 style={{ color: "var(--navy)", marginBottom: 14 }}>📋 All Available Scholarships</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          Browse international fellowships, regional development grants, and diversity options.
        </p>

        {all.length === 0 ? (
          <div className="card" style={{ padding: 20 }}>No listings at this time. Check back later!</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {all.map((s) => {
              const hasApplied = applied[s.id];
              return (
                <div key={s.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <h4 style={{ fontSize: 14, color: "var(--navy)", fontWeight: 700 }}>{s.title}</h4>
                      <span className="muted" style={{ fontSize: 11 }}>{s.provider}</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11, margin: "8px 0" }}>
                    <div>💰 <strong>Award:</strong> {s.amount || "N/A"}</div>
                    <div>⏱️ <strong>Deadline:</strong> {s.deadline || "TBA"}</div>
                    <div>🎓 <strong>Criteria:</strong> {s.eligibility || "Standard"}</div>
                  </div>

                  <button 
                    className="btn ghost" 
                    style={{ width: "100%", marginTop: 8, fontSize: 11, padding: "6px" }}
                    onClick={() => handleApply(s.id)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? "✓ Applied" : "Submit Application"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
