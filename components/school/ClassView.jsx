import { useEffect, useState } from "react";
import { getClassData, assignExam } from "../../services/schoolService";

export default function ClassView() {
  const [grade, setGrade] = useState(12);
  const [section, setSection] = useState("A");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    getClassData(grade, section)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [grade, section]);

  const handleAssignExam = async () => {
    try {
      await assignExam({ grade, section, exam_topic: "Calculus Limits Final" });
      setAssignmentSuccess(true);
      setTimeout(() => setAssignmentSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 8 }}>Class Stream Analytics</h2>
        <p className="muted" style={{ marginBottom: 18 }}>
          Select specific grade tiers and stream sections to inspect enrolled students and assign tasks.
        </p>

        {/* Filter controls */}
        <div className="form-grid" style={{ marginBottom: 20 }}>
          <div className="form-group">
            <label htmlFor="gradeSelect">Grade Level</label>
            <select
              id="gradeSelect"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
            >
              <option value={9}>Grade 9</option>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
              <option value={12}>Grade 12</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sectionSelect">Stream Section</label>
            <select
              id="sectionSelect"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>

        {/* Class data grid */}
        {loading ? (
          <div>Loading class data...</div>
        ) : !data ? (
          <div>No stream roster found for Grade {grade} {section}.</div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ color: "var(--navy)", fontSize: 16 }}>
                Enrolled Students in Grade {grade}{section} ({data.students?.length || 0} registered)
              </h3>
              <button 
                className="btn primary" 
                onClick={handleAssignExam}
                style={{ fontSize: 11, padding: "8px 12px" }}
              >
                {assignmentSuccess ? "✓ Task Assigned!" : "Assign Syllabus Practice"}
              </button>
            </div>

            <table className="beautiful-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Attendance Status</th>
                  <th>Homework Score Average</th>
                </tr>
              </thead>
              <tbody>
                {(data.students || []).map((s, idx) => (
                  <tr key={s.id}>
                    <td><strong>#STU-{(idx + 101)}</strong></td>
                    <td><strong>{s.user__full_name}</strong></td>
                    <td><span className="status-pill">Present</span></td>
                    <td><strong style={{ color: "var(--teal)" }}>84%</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
