import { useState } from "react";
import { exportReports } from "../../services/schoolService";

export default function ReportsExport() {
  const [format, setFormat] = useState("csv");
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    setSuccess(false);
    try {
      await exportReports(format);
      setTimeout(() => {
        setDownloading(false);
        setSuccess(true);
      }, 1000);
    } catch (err) {
      setDownloading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 8 }}>Export Roster Analytics & Reports</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Generate aggregated performance, weak area summaries, and student consistency reports for board reviews.
        </p>

        {success && (
          <div className="alert-card info" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", color: "#166534", marginBottom: 16 }}>
            <p>✓ Report compiled and downloaded! Check your local download directory.</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
          <div className="form-group">
            <label htmlFor="reportType">Report Template Type</label>
            <select id="reportType">
              <option value="summary">Aggregated Performance Summary (All Grades)</option>
              <option value="weak">Diagnostic Weak Area Analysis (Grade 12)</option>
              <option value="attendance">Class Stream Attendance & Activity Log</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="exportFormat">Document Format</label>
            <select
              id="exportFormat"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="csv">Standard CSV Spreadsheet (.csv)</option>
              <option value="pdf">Formatted PDF Document (.pdf)</option>
              <option value="xlsx">Excel Sheet Workbook (.xlsx)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button 
            className="btn primary" 
            onClick={handleExport}
            disabled={downloading}
          >
            {downloading ? "Compiling Report Layout..." : "Export & Download Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
