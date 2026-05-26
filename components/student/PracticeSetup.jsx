import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startPractice } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import useAuthStore from "../../store/authStore";

export default function PracticeSetup() {
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.startSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "unit",
    subject: "Mathematics",
    grade: 12,
    unit: 1
  });

  const onStart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await startPractice(form);
      startSession(data.id, data.session_type, data.questions || [], data.duration_seconds || 60 * 45);
      navigate("/student/session");
    } catch (err) {
      setError("Failed to create practice session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 8, color: "var(--navy)" }}>Practice Setup</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Configure your mock session. Choose topics to practice adaptive learning paths or standard mock tests.
        </p>

        {!isAuthenticated && (
          <div className="alert-card info" style={{ marginBottom: 18 }}>
            <p>Preview mode: Please sign in to save test history and unlock national rankings.</p>
            <button className="btn secondary" onClick={() => navigate("/login")}>Sign In</button>
          </div>
        )}

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          <div className="form-group">
            <label htmlFor="mode">Practice Mode</label>
            <select
              id="mode"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="unit">Topic-focused Unit Practice</option>
              <option value="semester">Cumulative Semester Assessment</option>
              <option value="national">Full National Mock Exam</option>
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="grade">Grade Level</label>
              <select
                id="grade"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
              >
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12</option>
              </select>
            </div>
          </div>

          {form.type === "unit" && (
            <div className="form-group">
              <label htmlFor="unit">Unit Selection</label>
              <select
                id="unit"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: Number(e.target.value) })}
              >
                <option value={1}>Unit 1: Foundations & Core Concepts</option>
                <option value={2}>Unit 2: Intermediate Equations</option>
                <option value={3}>Unit 3: Advanced Applications</option>
                <option value={4}>Unit 4: Review & Synthesis</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button className="btn ghost" onClick={() => navigate("/student")}>Cancel</button>
          <button className="btn primary" onClick={onStart} disabled={loading}>
            {loading ? "Starting Session..." : "Begin Practice"}
          </button>
        </div>
      </div>
    </div>
  );
}
