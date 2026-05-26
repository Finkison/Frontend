import { useEffect, useState } from "react";
import { getTechnologyTracks } from "../../services/studentService";

export default function TechnologyHub() {
  const [tracks, setTracks] = useState([]);
  const [actionTrack, setActionTrack] = useState({});

  useEffect(() => {
    getTechnologyTracks()
      .then((r) => setTracks(r.data))
      .catch(() => setTracks([]));
  }, []);

  const handleStudyTrack = (id) => {
    setActionTrack({ ...actionTrack, [id]: true });
  };

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>Technology & Coding Tracks</h2>
        <p className="muted">Pair your secondary school education with high-demand professional technology tracks.</p>
      </div>

      {tracks.length === 0 ? (
        <div className="card" style={{ padding: 20 }}>No technology tracks available yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {tracks.map((t) => {
            const hasStarted = actionTrack[t.id];
            const progressVal = hasStarted ? Math.min(100, (t.progress || 0) + 5) : (t.progress || 0);

            return (
              <div key={t.id} className="card" style={{ padding: 22, display: "grid", gridTemplateColumns: "1fr 200px", gap: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 18, color: "var(--navy)", margin: 0 }}>{t.title}</h3>
                    <span className="status-pill" style={{ background: "var(--gold-lt)", color: "var(--gold-dk)", fontWeight: 700 }}>
                      {t.level || "Intermediate"}
                    </span>
                  </div>
                  
                  <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
                    {t.description}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12, marginBottom: 10 }}>
                    <div>
                      🛠️ <strong>Key Skills Covered:</strong>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                        {(t.skills || []).map(skill => (
                          <span key={skill} className="status-pill" style={{ background: "rgba(10, 110, 85, 0.05)", color: "var(--teal)", fontSize: 10, padding: "2px 6px" }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      🎯 <strong>Learning Outcomes:</strong>
                      <ul style={{ paddingLeft: 16, marginTop: 4, color: "var(--txt2)" }}>
                        {(t.learning_outcomes || []).map(out => (
                          <li key={out}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators Column */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "1px solid var(--border)", paddingLeft: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                    <span>Track Progress</span>
                    <span>{progressVal}%</span>
                  </div>
                  <div className="meter-track" style={{ background: "rgba(15, 39, 68, 0.05)", marginBottom: 16 }}>
                    <div 
                      className="meter-fill" 
                      style={{ 
                        width: `${progressVal}%`,
                        background: "linear-gradient(90deg, var(--teal), var(--success))"
                      }} 
                    />
                  </div>

                  <button 
                    className="btn primary" 
                    style={{ width: "100%", fontSize: 12 }}
                    onClick={() => handleStudyTrack(t.id)}
                  >
                    {hasStarted ? "Continue Track Course" : "Unlock Track Course"}
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
