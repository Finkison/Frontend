import { useEffect, useMemo, useState } from "react";
import { getWeakAreas } from "../../services/studentService";

export default function WeakAreaDashboard() {
  const [weak, setWeak] = useState([]);

  useEffect(() => {
    getWeakAreas()
      .then((r) => setWeak(r.data || []))
      .catch(() => setWeak([]));
  }, []);

  const recommendations = useMemo(() => {
    return weak.map((w) => {
      if (w.subject === "Physics") {
        return {
          id: w.id,
          topic: w.topic,
          subject: w.subject,
          action: "Review Unit 3 Electromagnetic induction formulas and work through 15 adaptive practice questions.",
          time: "Est. time: 45 mins"
        };
      } else if (w.subject === "Biology") {
        return {
          id: w.id,
          topic: w.topic,
          subject: w.subject,
          action: "Read step-by-step meiosis vs mitosis diagrams, then take a targeted concept simulation test.",
          time: "Est. time: 30 mins"
        };
      } else {
        return {
          id: w.id,
          topic: w.topic,
          subject: w.subject,
          action: "Review grammatical subject-verb agreement exceptions and complete error identification drills.",
          time: "Est. time: 20 mins"
        };
      }
    });
  }, [weak]);

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 8 }}>Diagnostic Analytics: Weak Areas</h2>
        <p className="muted" style={{ marginBottom: 18 }}>
          Finkison analyzes your incorrect options to identify conceptual gaps. Topics below 50% require immediate intervention.
        </p>

        {weak.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--teal)" }}>
            ✨ All tracked subjects currently maintain mastery thresholds above 50%! Keep up the stellar work.
          </div>
        ) : (
          <div className="bar-list" style={{ marginTop: 12 }}>
            {weak.map((w, index) => {
              const accuracy = w.accuracy_percent;
              // Determine theme color
              const trackColor = accuracy < 40 ? "var(--danger)" : "var(--warn)";
              return (
                <div key={w.id || `${w.subject}-${index}`} className="bar-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span className={`subject-badge ${w.subject}`} style={{ alignSelf: "flex-start", marginBottom: 2 }}>
                      {w.subject}
                    </span>
                    <strong style={{ fontSize: 13, color: "var(--navy)" }}>{w.topic}</strong>
                  </div>
                  <div className="bar-track" style={{ background: "rgba(15, 39, 68, 0.04)" }}>
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${accuracy}%`,
                        background: trackColor
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: trackColor }}>
                    {accuracy}% Accuracy
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended study paths */}
      {recommendations.length > 0 && (
        <>
          <h3 style={{ color: "var(--navy)", marginBottom: 14 }}>Personalized Action Plan</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {recommendations.map((rec) => (
              <div key={rec.id} className="card" style={{ padding: 18, borderLeft: "4px solid var(--danger)", background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span className="status-pill" style={{ background: "#fef2f2", color: "#b91c1c" }}>
                    High Priority Action
                  </span>
                  <span className="muted" style={{ fontSize: 11 }}>
                    {rec.time}
                  </span>
                </div>
                <h4 style={{ fontSize: 14, color: "var(--navy)", marginBottom: 6 }}>
                  Targeted Study: {rec.subject} — {rec.topic}
                </h4>
                <p style={{ fontSize: 13, color: "var(--txt2)", lineHeight: 1.4 }}>
                  {rec.action}
                </p>
                <button 
                  className="btn secondary" 
                  style={{ alignSelf: "flex-start", marginTop: 12, padding: "6px 12px", fontSize: 11 }}
                >
                  Launch Topic Session
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
