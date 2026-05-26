export default function MiniLineChart({ points = [], height = 120 }) {
  if (!points.length) return null;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const stepX = 100 / Math.max(points.length - 1, 1);
  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = 100 - ((p - min) / range) * 100;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height }} aria-label="Line chart">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201,146,10,0.35)" />
          <stop offset="100%" stopColor="rgba(201,146,10,0)" />
        </linearGradient>
      </defs>
      <path d={`${path} L100,100 L0,100 Z`} fill="url(#lineFill)" />
      <path d={path} fill="none" stroke="#C9920A" strokeWidth="2.5" strokeLinecap="round" className="chart-line" />
    </svg>
  );
}
