export default function MiniBarChart({ items = [] }) {
  if (!items.length) return null;
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bar-list">
      {items.map((item) => {
        const width = Math.round((item.value / max) * 100);
        return (
          <div key={item.label} className="bar-row">
            <span className="bar-label">{item.label}</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${width}%` }} />
            </div>
            <span className="bar-value">{item.value}%</span>
          </div>
        );
      })}
    </div>
  );
}
