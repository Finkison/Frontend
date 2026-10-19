import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startPractice } from "../../services/practiceService";
import useSessionStore from "../../store/sessionStore";
import useAuthStore from "../../store/authStore";
import useScope from "../../hooks/useScope";

export default function PracticeSetup() {
  const navigate = useNavigate();
  const startSession = useSessionStore((s) => s.startSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const scope = useScope();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{
    type: string;
    subject: string;
    grade: number;
    unit: number;
  }>({
    type: "unit",
    subject: scope.availableSubjects[0] || "Mathematics",
    grade: scope.gradeLevel,
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
    } catch (err: any) {
      setError(err?.userMessage || "Failed to create practice session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 6, color: "var(--navy)" }}>Practice Setup</h2>
        <p className="muted" style={{ marginBottom: 18 }}>
          Select practice mode, subject, and topic.
        </p>

        {scope.isJuniorSecondary && (
          <div style={{ padding: "8px 12px", borderRadius: 8, background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", fontSize: 12, marginBottom: 16 }}>
            <strong>Grade {scope.gradeLevel}:</strong> Access to all foundational natural and social science courses.
          </div>
        )}

        {!isAuthenticated && (
          <div className="alert-card info" style={{ marginBottom: 18 }}>
            <p>Sign in to record your test history and ranking.</p>
            <button className="btn secondary" onClick={() => navigate("/login")}>Sign In</button>
          </div>
        )}

        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          <div className="form-group">
            <label htmlFor="mode">Mode</label>
            <select
              id="mode"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="unit">Unit Practice</option>
              <option value="semester">Semester Exam</option>
              <option value="national">National Mock Exam</option>
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
                {scope.isJuniorSecondary ? (
                  <>
                    <optgroup label="Core Foundation">
                      {scope.commonCourses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Natural Sciences">
                      {scope.naturalCourses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Social Sciences">
                      {scope.socialCourses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </optgroup>
                  </>
                ) : (
                  scope.availableSubjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))
                )}
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
