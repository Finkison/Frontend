import { useEffect, useState } from "react";
import { getLeaderboard } from "../../services/discoveryService";

export default function Leaderboard() {
  const [scope, setScope] = useState("national");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getLeaderboard(scope)
      .then((r) => setRows(r.data || []))
      .catch(() => setRows([]));
  }, [scope]);

  // Extract top 3 podium spots
  const topThree = rows.slice(0, 3);
  const remainingRows = rows.slice(3);

  // We want to order podium places nicely: 2nd, 1st, 3rd for visual balance
  const podiumPlaces = [
    topThree[1] ? { ...topThree[1], place: "second", label: "2" } : null,
    topThree[0] ? { ...topThree[0], place: "first", label: "1" } : null,
    topThree[2] ? { ...topThree[2], place: "third", label: "3" } : null,
  ].filter(Boolean);

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>Academic Leaderboard</h2>
        <p className="muted" style={{ marginBottom: 16 }}>
          Track rankings based on adaptive practices, mock simulation scores, and consistency ratios.
        </p>

        {/* Dynamic Filter Tabs */}
        <div className="tabs-wrap">
          <button 
            className={`tab-btn ${scope === "national" ? "active" : ""}`}
            onClick={() => setScope("national")}
          >
            🌐 National Roster
          </button>
          <button 
            className={`tab-btn ${scope === "region" ? "active" : ""}`}
            onClick={() => setScope("region")}
          >
            📍 Regional Standing
          </button>
          <button 
            className={`tab-btn ${scope === "school" ? "active" : ""}`}
            onClick={() => setScope("school")}
          >
            🏫 School Roster
          </button>
        </div>

        {rows.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20 }}>No ranking data available.</div>
        ) : (
          <>
            {/* Visual Podium */}
            <div className="podium-wrapper">
              {podiumPlaces.map((p) => (
                <div key={p.student_name} className={`podium-place ${p.place}`}>
                  <div className="podium-step">
                    <span style={{ fontSize: 24 }}>{p.label}</span>
                  </div>
                  <div className="podium-name">{p.student_name}</div>
                  <div className="podium-score">{p.score} pts</div>
                  <span className="muted" style={{ fontSize: 10 }}>{p.school}</span>
                </div>
              ))}
            </div>

            {/* List Table for other ranks */}
            <table className="beautiful-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>School</th>
                  <th>Region</th>
                  <th>Diagnostic Score</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.rank}-${r.student_name}`} style={{
                    background: r.student_name === "Daniel Finkison" ? "rgba(10, 110, 85, 0.04)" : "transparent"
                  }}>
                    <td>
                      <strong>#{r.rank}</strong>
                    </td>
                    <td>
                      <strong>{r.student_name}</strong> {r.student_name === "Daniel Finkison" && "⭐"}
                    </td>
                    <td>{r.school}</td>
                    <td>{r.region}</td>
                    <td>
                      <strong style={{ color: "var(--teal)" }}>{r.score} / 700</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
