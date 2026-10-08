import React from "react";

interface MiniLineChartProps {
  points?: number[];
  height?: number | string;
  lineColor?: string;
  strokeWidth?: number;
  showPoints?: boolean;
}

export default function MiniLineChart({
  points = [],
  height = 120,
  lineColor = "#D97706",
  strokeWidth = 2.5,
  showPoints = true
}: MiniLineChartProps): React.ReactElement | null {
  if (!points.length) return null;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const stepX = 100 / Math.max(points.length - 1, 1);

  const coords = points.map((p, i) => ({
    x: i * stepX,
    y: 100 - ((p - min) / range) * 80 - 10
  }));

  const path = coords.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? "M" : "L"} ${curr.x} ${curr.y}`;
  }, "");

  const areaPath = `${path} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full relative overflow-hidden" style={{ height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        aria-label="Performance line chart"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient Area fill */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Line Stroke */}
        <path
          d={path}
          fill="none"
          stroke={lineColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {showPoints &&
          coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r="2"
              fill="#FFFFFF"
              stroke={lineColor}
              strokeWidth="1.5"
            />
          ))}
      </svg>
    </div>
  );
}
