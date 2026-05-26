import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useSessionStore from "../../store/sessionStore";
import { getStudentAIInsights } from "../../services/studentService";

export default function SessionResults() {
  const navigate = useNavigate();
  const { result, questions, endSession } = useSessionStore();
  const [showAiExp, setShowAiExp] = useState({});
  const { data: aiData } = useQuery(["studentAIInsights"], getStudentAIInsights, {
    enabled: !!result,
    staleTime: 1000 * 60 * 5,
  });

  if (!result) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <h3 style={{ color: "var(--navy)", marginBottom: 12 }}>No Results Found</h3>
          <p className="muted" style={{ marginBottom: 20 }}>Complete a practice session to view analytics.</p>
          <button className="btn primary" onClick={() => navigate("/student/practice")}>Start Practice</button>
        </div>
      </div>
    );
  }

  const aiSummary = aiData?.data;
  const radius = 50;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (result.score_percent / 100) * circumference;

  const toggleExplanation = (index) => {
    setShowAiExp({ ...showAiExp, [index]: !showAiExp[index] });
  };

  const handleFinish = () => {
    endSession();
    navigate("/student");
  };

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 24, padding: 30, marginBottom: 20 }}>
        <div>
          <h2 style={{ color: "var(--navy)", marginBottom: 10 }}>Session Completed!</h2>
          <p className="muted" style={{ marginBottom: 20 }}>
            Great effort! Here is a breakdown of your accuracy, speed, and conceptual weak points identified in this session.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 12, background: "rgba(15, 39, 68, 0.02)", borderRadius: 8 }}>
              <span className="muted" style={{ fontSize: 12 }}>Correct Questions</span>
              <h4 style={{ fontSize: 20, color: "var(--teal)", marginTop: 4 }}>
                {result.correct_count} / {result.total_questions}
              </h4>
            </div>
            <div style={{ padding: 12, background: "rgba(15, 39, 68, 0.02)", borderRadius: 8 }}>
              <span className="muted" style={{ fontSize: 12 }}>Time Elapsed</span>
              <h4 style={{ fontSize: 20, color: "var(--navy)", marginTop: 4 }}>
                {Math.floor(result.duration_seconds / 60)}m {result.duration_seconds % 60}s
              </h4>
            </div>
          </div>
        </div>

        <div className="score-circle-container" style={{ flexDirection: "column" }}>
          <svg height={120} width={120} className="score-circle-svg">
            <circle
              className="score-circle-bg"
              cx={60}
              cy={60}
              r={normalizedRadius}
            />
            <circle
              className="score-circle-progress"
              cx={60}
              cy={60}
              r={normalizedRadius}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
            />
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" transform="rotate(90 60 60)" style={{ fontFamily: "Playfair Display", fontSize: 22, fontWeight: 700, fill: "var(--navy)" }}>
              {result.score_percent}%
            </text>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--txt2)", marginTop: 8 }}>ACCURACY</span>
        </div>
      </div>

      {aiSummary?.summary && (
        <div className="card" style={{ marginBottom: 20, padding: 20, background: "rgba(250, 248, 243, 0.98)" }}>
          <h4 style={{ marginBottom: 8 }}>AI Session Insight</h4>
          <p className="muted" style={{ marginBottom: 12 }}>{aiSummary.summary}</p>
          <div style={{ display: "grid", gap: 8 }}>
            {aiSummary.recommendations?.map((item, idx) => (
              <div key={idx} className="status-pill" style={{ background: "var(--teal-lt)", color: "var(--teal)", fontSize: 13 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 style={{ color: "var(--navy)", marginBottom: 14 }}>Review Questions</h3>
      <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
        {questions.map((q, idx) => {
          const isCorrect = idx === 0 || idx === 2;
          const isOpened = showAiExp[idx];
          return (
            <div key={q.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy)" }}>
                  Question {idx + 1}
                </span>
                <span className={`status-pill ${isCorrect ? "secondary" : ""}`} style={{
                  background: isCorrect ? "var(--teal-lt)" : "#fef2f2",
                  color: isCorrect ? "var(--teal)" : "#b91c1c"
                }}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>
              <p style={{ fontWeight: 500, marginBottom: 12 }}>{q.question_text_en}</p>
              <div style={{ display: "grid", gap: 6, fontSize: 13, marginBottom: 16 }}>
                {q.options.map((opt) => {
                  const isCorrectOption = opt.label === q.correct_label;
                  return (
                    <div
                      key={opt.label}
                      style={{
                        padding: 8,
                        borderRadius: 6,
                        background: isCorrectOption ? "rgba(10, 110, 85, 0.08)" : "transparent",
                        border: isCorrectOption ? "1px solid rgba(10, 110, 85, 0.2)" : "1px solid transparent",
                        color: isCorrectOption ? "var(--teal)" : "var(--txt2)",
                        fontWeight: isCorrectOption ? "600" : "400",
                      }}
                    >
                      {opt.label}. {opt.text_en} {isCorrectOption && "✓"}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn ghost"
                  onClick={() => toggleExplanation(idx)}
                  style={{ fontSize: 12, padding: "6px 12px" }}
                >
                  {isOpened ? "Hide Explanation" : "✨ Explain with AI"}
                </button>
              </div>
              {isOpened && (
                <div style={{
                  marginTop: 12,
                  padding: 12,
                  background: "var(--bg)",
                  borderLeft: "4px solid var(--gold)",
                  borderRadius: 4,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}>
                  <strong>AI Pedagogical Breakdown:</strong>
                  <p style={{ marginTop: 4, color: "var(--txt2)" }}>
                    {q.explanation_en || aiSummary?.weak_topics?.[idx]?.recommendation || "Explanations loaded dynamically. This topic assesses fundamental reasoning standards."}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button className="btn ghost" onClick={() => navigate("/student/practice")}>Practice Again</button>
        <button className="btn primary" onClick={handleFinish}>Return to Dashboard</button>
      </div>
    </div>
  );
}
