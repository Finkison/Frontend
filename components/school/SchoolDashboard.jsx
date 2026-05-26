import { useEffect, useState } from "react";
import { getSchoolAnalytics } from "../../services/schoolService";

export default function SchoolDashboard() {
  const [stats, setStats] = useState({
    total_students: 156,
    average_predicted_score: 545,
    top_performing_stream: "Natural Science 12A",
    national_percentile_avg: 84,
    by_grade: []
  });

  useEffect(() => {
    getSchoolAnalytics()
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>School Intelligence Dashboard</h2>
        <p className="muted">Track student registration metrics, average score metrics, and stream performance distributions.</p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid" style={{ marginBottom: 20 }}>
        <div className="card kpi-card">
          <h3>Total Enrolled</h3>
          <p>{stats.total_students} Students</p>
        </div>
        <div className="card kpi-card">
          <h3>Avg predicted score</h3>
          <p>{stats.average_predicted_score} / 700</p>
        </div>
        <div className="card kpi-card">
          <h3>Top Stream</h3>
          <p style={{ fontSize: "1.1rem" }}>{stats.top_performing_stream}</p>
        </div>
        <div className="card kpi-card">
          <h3>Avg National Percentile</h3>
          <p>Top {100 - stats.national_percentile_avg}%</p>
        </div>
      </div>

      {/* Grade distribution progress bars */}
      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        <h3 style={{ color: "var(--navy)", marginBottom: 14 }}>Roster Size by Grade</h3>
        <div className="bar-list">
          {(stats.by_grade || [
            { grade: 9, count: 42 },
            { grade: 10, count: 38 },
            { grade: 11, count: 36 },
            { grade: 12, count: 40 }
          ]).map((item) => {
            const maxVal = 50;
            const widthPct = Math.min(100, Math.round((item.count / maxVal) * 100));
            return (
              <div key={item.grade} className="bar-row">
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--navy2)" }}>Grade {item.grade}</span>
                <div className="bar-track" style={{ background: "rgba(15, 39, 68, 0.04)" }}>
                  <div className="bar-fill" style={{ width: `${widthPct}%` }} />
                </div>
                <span style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 700 }}>{item.count} students</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action card */}
      <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #0f2744, #1a3a5c)", color: "#fff" }}>
        <h3 style={{ color: "#fff", marginBottom: 6 }}>📢 School Administrative Bulletin</h3>
        <p style={{ color: "#e6edf7", fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
          National entrance simulations are scheduled next Friday. Educators must complete syllabus updates and assign final benchmark tests before Wednesday.
        </p>
      </div>
    </div>
  );
}
