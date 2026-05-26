import { useEffect, useState } from "react";
import { getSchoolStudents } from "../../services/schoolService";

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  useEffect(() => {
    getSchoolStudents()
      .then((r) => setStudents(r.data || []))
      .catch(() => setStudents([]));
  }, []);

  const filtered = students.filter((s) => {
    const matchesSearch = (s.user__full_name || "Daniel Finkison").toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === "all" || s.grade === Number(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 8 }}>Student Roster Directory</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Search, filter, and inspect student performance indicators, exam targets, and platform streak trackers.
        </p>

        {/* Search controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 12, marginBottom: 20 }}>
          <input
            type="search"
            placeholder="Search student by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            aria-label="Filter by Grade"
          >
            <option value="all">All Grades</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "var(--txt3)" }}>
            No students match your active filters.
          </div>
        ) : (
          <table className="beautiful-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Target Score</th>
                <th>Predicted Score</th>
                <th>Streak Days</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.user__full_name || "Daniel Finkison"}</strong>
                    <div className="muted" style={{ fontSize: 10 }}>Stream: {s.stream || "Natural Science"}</div>
                  </td>
                  <td>Grade {s.grade}</td>
                  <td><strong>{s.target_score} / 700</strong></td>
                  <td>
                    <strong style={{ color: s.predicted_score >= 550 ? "var(--teal)" : "var(--gold-dk)" }}>
                      {s.predicted_score} / 700
                    </strong>
                  </td>
                  <td>🔥 {s.streak_days || 0} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
