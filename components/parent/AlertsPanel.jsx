import { useEffect, useState } from "react";
import { getParentAlerts } from "../../services/parentService";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getParentAlerts()
      .then((r) => setAlerts(r.data || []))
      .catch(() => setAlerts([]));
  }, []);

  const handleMarkAsRead = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 8 }}>School Notifications & Academic Alerts</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          Stay updated on deadline extensions, critical drop warnings, and commendable results logs.
        </p>

        {alerts.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20, color: "var(--txt3)" }}>
            No current alerts or warnings registered.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {alerts.map((a) => {
              const isScoreWarning = a.message.includes("below 50%");
              const isCommendation = a.message.includes("outstanding");
              
              let alertClass = "info";
              if (isScoreWarning) alertClass = "danger";
              else if (isCommendation) alertClass = "warning"; // Gold alert for commendation

              return (
                <div 
                  key={a.id} 
                  className={`alert-card ${alertClass}`}
                  style={{
                    opacity: a.is_read ? 0.7 : 1,
                    transition: "opacity 0.3s"
                  }}
                >
                  <div>
                    <p style={{ margin: 0 }}>{a.message}</p>
                    <span style={{ fontSize: 10, display: "block", marginTop: 4 }}>
                      Logged at: {new Date(a.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {!a.is_read && (
                    <button 
                      className="btn secondary" 
                      style={{ padding: "4px 8px", fontSize: 11 }}
                      onClick={() => handleMarkAsRead(a.id)}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
