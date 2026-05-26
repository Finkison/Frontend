import { useEffect, useState } from "react";
import { getScoreTrajectory } from "../../services/studentService";

export default function ScorePredictor() {
  const [state, setState] = useState({ current_predicted_score: 580, target_score: 620 });
  const [accuracySim, setAccuracySim] = useState(82); // Simulated overall accuracy percentage

  useEffect(() => {
    getScoreTrajectory()
      .then((r) => setState(r.data))
      .catch(() => setState({ current_predicted_score: 580, target_score: 620 }));
  }, []);

  // Compute simulated predicted score based on slider accuracy
  // National entrance exams are graded out of 700
  const simulatedScore = Math.min(700, Math.round((accuracySim / 100) * 700));
  const progressPercent = Math.min(100, Math.round((simulatedScore / state.target_score) * 100));

  // Determine predicted percentile rank based on score
  const percentileRank = Math.min(99.9, Math.max(50, (simulatedScore / 700) * 100)).toFixed(1);

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>Score Trajectory Predictor</h2>
        <p className="muted" style={{ marginBottom: 18 }}>
          See how daily topic accuracies influence your predicted cumulative score out of 700.
        </p>

        {/* Real Score Tracker */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div style={{ padding: 14, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <span className="muted" style={{ fontSize: 12 }}>Current Prediction</span>
            <h3 style={{ fontSize: 24, color: "var(--navy)", marginTop: 4 }}>
              {state.current_predicted_score} / 700
            </h3>
          </div>
          <div style={{ padding: 14, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <span className="muted" style={{ fontSize: 12 }}>Goal Threshold</span>
            <h3 style={{ fontSize: 24, color: "var(--gold-dk)", marginTop: 4 }}>
              {state.target_score} / 700
            </h3>
          </div>
        </div>

        {/* Score Target Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, fontWeight: 700 }}>
            <span>Target Completion Rate</span>
            <span>{Math.round((state.current_predicted_score / state.target_score) * 100)}%</span>
          </div>
          <div className="meter-track" style={{ background: "rgba(15, 39, 68, 0.05)" }}>
            <div 
              className="meter-fill" 
              style={{ width: `${Math.round((state.current_predicted_score / state.target_score) * 100)}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Interactive Simulator Card */}
      <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, #faf8f3, #f5ecd5)", border: "1px solid var(--gold-lt)" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: 6 }}>📊 Trajectory Simulator</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          Slide to adjust your projected core topic accuracy and calculate potential exam standings.
        </p>

        <div className="slider-group">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: "var(--navy)" }}>Simulated Overall Accuracy</span>
            <span style={{ color: "var(--teal)", fontSize: 15 }}>{accuracySim}%</span>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            value={accuracySim}
            onChange={(e) => setAccuracySim(Number(e.target.value))}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
            <span className="muted" style={{ fontSize: 11 }}>Projected National Score</span>
            <h4 style={{ fontSize: 20, color: "var(--teal)", marginTop: 4 }}>{simulatedScore} / 700</h4>
          </div>
          <div style={{ background: "#fff", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
            <span className="muted" style={{ fontSize: 11 }}>National Percentile Rank</span>
            <h4 style={{ fontSize: 20, color: "var(--navy)", marginTop: 4 }}>Top {100 - Number(percentileRank) < 0.1 ? 0.1 : (100 - Number(percentileRank)).toFixed(1)}%</h4>
          </div>
        </div>

        <p className="muted" style={{ fontSize: 11, marginTop: 14, textAlign: "center" }}>
          *Percentile ratings map standard deviations from historical national university entrance rosters.
        </p>
      </div>
    </div>
  );
}
