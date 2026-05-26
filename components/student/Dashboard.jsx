import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard, getStudentProgress } from "../../services/studentService";
import { getPracticeHistory } from "../../services/practiceService";
import MiniLineChart from "../shared/MiniLineChart";

export default function Dashboard() {
  const { data: dashboardData } = useQuery(["studentDashboard"], getStudentDashboard);
  const { data: progressData } = useQuery(["studentProgress"], () => getStudentProgress());
  const { data: historyData } = useQuery(["practiceHistory"], getPracticeHistory);

  const dashboard = dashboardData?.data || {};
  const progress = progressData?.data || [];
  const history = historyData?.data || [];

  const trend = useMemo(() => {
    const scores = history.slice(0, 8).map((h) => h.score_percent).reverse();
    return scores.length ? scores : [44, 52, 58, 61, 67, 70, 72];
  }, [history]);

  const weakCount = progress.filter((p) => p.accuracy_percent < 50).length;

  return (
    <div className="container">
      <div className="grid">
        <div className="card kpi-card"><h3>Grade</h3><p>{dashboard.grade ?? "-"}</p></div>
        <div className="card kpi-card"><h3>Stream</h3><p>{dashboard.stream ?? "-"}</p></div>
        <div className="card kpi-card"><h3>Predicted Score</h3><p>{dashboard.predicted_score ?? 0}/700</p></div>
        <div className="card kpi-card"><h3>Streak</h3><p>{dashboard.streak_days ?? 0} days</p></div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>Performance Trend</h3>
          <p className="muted">Recent session score movement</p>
          <MiniLineChart points={trend} height={140} />
        </div>
        <div className="card">
          <h3>Action Center</h3>
          <p className="muted">Topics tracked: {progress.length}</p>
          <p className="muted">Weak topics: {weakCount}</p>
          <p className="muted">Sessions completed: {history.length}</p>
        </div>
      </div>
    </div>
  );
}
