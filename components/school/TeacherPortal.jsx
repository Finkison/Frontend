import { useState } from "react";

export default function TeacherPortal() {
  const [outline, setOutline] = useState({
    title: "",
    duration: 3,
    subject: "Mathematics"
  });
  const [success, setSuccess] = useState(false);

  const handleCreateOutline = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOutline({ title: "", duration: 3, subject: "Mathematics" });
    }, 1500);
  };

  return (
    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Lesson outline creator */}
      <form className="card" onSubmit={handleCreateOutline} style={{ padding: 24 }}>
        <h3 style={{ color: "var(--navy)", marginBottom: 8 }}>Lesson Outline Builder</h3>
        <p className="muted" style={{ marginBottom: 18 }}>
          Structure curriculum outlines and sync them with national standard topics for adaptive learning.
        </p>

        {success && (
          <div className="alert-card info" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534", marginBottom: 16 }}>
            <p>✓ Outline registered and distributed to class streams!</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
          <div className="form-group">
            <label htmlFor="outlineTitle">Lesson Title</label>
            <input
              id="outlineTitle"
              type="text"
              placeholder="e.g. Intro to Integrals & Area"
              value={outline.title}
              onChange={(e) => setOutline({ ...outline, title: e.target.value })}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="outlineSubject">Subject</label>
              <select
                id="outlineSubject"
                value={outline.subject}
                onChange={(e) => setOutline({ ...outline, subject: e.target.value })}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="outlineDuration">Weeks Planned</label>
              <input
                id="outlineDuration"
                type="number"
                min={1}
                max={12}
                value={outline.duration}
                onChange={(e) => setOutline({ ...outline, duration: Number(e.target.value) })}
                required
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn primary" type="submit">Create Lesson Plan</button>
        </div>
      </form>

      {/* Manual grade records */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ color: "var(--navy)", marginBottom: 8 }}>Diagnostic Grade Entry</h3>
        <p className="muted" style={{ marginBottom: 16 }}>
          Manually log scores for physical classroom exams to sync with student projected trajectories.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Daniel Finkison (Grade 12A)</span>
            <input type="number" placeholder="Grade/100" style={{ padding: 6 }} defaultValue={88} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Betty Girmay (Grade 12A)</span>
            <input type="number" placeholder="Grade/100" style={{ padding: 6 }} defaultValue={94} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Naod Yoseph (Grade 11B)</span>
            <input type="number" placeholder="Grade/100" style={{ padding: 6 }} defaultValue={78} />
          </div>
        </div>

        <button className="btn primary" style={{ width: "100%", marginTop: 24 }}>
          Save Grade Logs
        </button>
      </div>
    </div>
  );
}
