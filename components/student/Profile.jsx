import { useEffect, useState } from "react";
import { getStudentProfile, updateStudentProfile } from "../../services/studentService";
import useAuthStore from "../../store/authStore";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState({
    grade: 12,
    stream: "natural",
    target_score: 620,
    full_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getStudentProfile()
      .then((r) => {
        setProfile({
          grade: r.data.grade || 12,
          stream: r.data.stream || "natural",
          target_score: r.data.target_score || 620,
          full_name: r.data.name || user?.full_name || user?.name || "Student Learner"
        });
      })
      .catch(() => {
        setProfile({
          grade: 12,
          stream: "natural",
          target_score: 620,
          full_name: user?.full_name || user?.name || "Student Learner"
        });
      });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateStudentProfile({
        grade: profile.grade,
        stream: profile.stream,
        target_score: profile.target_score,
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <form className="card" onSubmit={handleSave}>
        <h2 className="section-title">My Student Profile</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Manage your personal details, academic parameters, and national exam target criteria.
        </p>

        {success && (
          <div className="alert-card info">
            <p>✓ Profile updated successfully! Changes reflected immediately.</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              className="form-control"
              type="text"
              value={profile.full_name}
              disabled
            />
            <span className="muted" style={{ fontSize: 11 }}>
              Name is tied to your authentication profile and managed securely.
            </span>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="grade">Grade Level</label>
              <select
                id="grade"
                className="form-control"
                value={profile.grade}
                onChange={(e) => setProfile({ ...profile, grade: Number(e.target.value) })}
              >
                <option value={9}>Grade 9</option>
                <option value={10}>Grade 10</option>
                <option value={11}>Grade 11</option>
                <option value={12}>Grade 12</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stream">Academic Stream</label>
              <select
                id="stream"
                className="form-control"
                value={profile.stream}
                onChange={(e) => setProfile({ ...profile, stream: e.target.value })}
              >
                <option value="natural">Natural Science</option>
                <option value="social">Social Science</option>
                <option value="common">Common</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="target">Target National Score (out of 700)</label>
            <input
              id="target"
              className="form-control"
              type="number"
              min={300}
              max={700}
              value={profile.target_score}
              onChange={(e) => setProfile({ ...profile, target_score: Number(e.target.value) })}
              required
            />
            <span className="muted" style={{ fontSize: 11 }}>
              Finkison models targets against university scholarship admissions records.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </div>
      </form>
    </div>
  );
}
