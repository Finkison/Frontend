import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function MathGeometrySimulation(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [angularSpeed, setAngularSpeed] = useState(1.2);
  const [stepIndex, setStepIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const thetaRef = useRef<number>(0);
  const wavePointsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setReducedMotion(true);
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 280);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 280;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#1C1512";
      ctx.fillRect(0, 0, width, height);

      const circleCenterX = 110;
      const centerY = height / 2;
      const radius = 54;
      const waveStartX = 200;

      ctx.strokeStyle = "rgba(251, 191, 36, 0.12)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(circleCenterX - radius - 15, centerY);
      ctx.lineTo(circleCenterX + radius + 15, centerY);
      ctx.moveTo(circleCenterX, centerY - radius - 15);
      ctx.lineTo(circleCenterX, centerY + radius + 15);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(waveStartX, centerY);
      ctx.lineTo(width - 15, centerY);
      ctx.stroke();

      if (isRunning && !reducedMotion) {
        thetaRef.current += 0.03 * angularSpeed;
      } else if (reducedMotion) {
        thetaRef.current = stepIndex * (Math.PI / 12);
      }

      const theta = thetaRef.current;
      const px = circleCenterX + radius * Math.cos(theta);
      const py = centerY - radius * Math.sin(theta);

      ctx.beginPath();
      ctx.arc(circleCenterX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#881337";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(circleCenterX, centerY);
      ctx.lineTo(px, py);
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(circleCenterX, centerY, 18, 0, -theta % (Math.PI * 2), true);
      ctx.strokeStyle = "#B45309";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(px, py);
      ctx.lineTo(waveStartX, py);
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FBBF24";
      ctx.fill();
      ctx.strokeStyle = "#881337";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (isRunning || reducedMotion) {
        wavePointsRef.current.unshift({ x: waveStartX, y: py });
        if (wavePointsRef.current.length > (width - waveStartX) / 2) {
          wavePointsRef.current.pop();
        }
      }

      if (wavePointsRef.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "#FBBF24";
        ctx.lineWidth = 2.5;

        for (let i = 0; i < wavePointsRef.current.length; i++) {
          const pt = wavePointsRef.current[i];
          const x = waveStartX + i * 2;
          if (i === 0) ctx.moveTo(x, pt.y);
          else ctx.lineTo(x, pt.y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(waveStartX, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#FBBF24";
        ctx.fill();
      }

      if (isRunning && !reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, angularSpeed, stepIndex, reducedMotion]);

  const handleReset = () => {
    thetaRef.current = 0;
    wavePointsRef.current = [];
    setStepIndex(0);
    setIsRunning(true);
  };

  return (
    <div className="bg-white dark:bg-[#261E1A] rounded-[8px] border border-[#E7E0D6] dark:border-white/10 overflow-hidden select-none">

      <div className="bg-[#4C0519] px-4 py-3 flex items-center justify-between text-xs text-white border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
          <span className="font-semibold tracking-wide text-[#FBBF24]">
            Grade 11 Mathematics: Unit 5 (Trigonometric Functions)
          </span>
        </div>
        <div className="text-[11px] text-stone-200 font-mono">
          Formula: y = sin(θ), ω = {(angularSpeed * 1.5).toFixed(2)} rad/s
        </div>
      </div>

      <div className="relative bg-[#1C1512] h-[280px]">
        <canvas
          ref={canvasRef}
          aria-describedby="math-visual-description"
          className="w-full h-full block"
        />

        <div className="absolute bottom-2 left-3 flex items-center gap-3 bg-[#1C1512]/85 px-2.5 py-1 rounded border border-[#881337]/30 text-[10px] text-stone-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#881337]" /> Unit Circle (r=1)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[#FBBF24]" /> Sine Wave Trace
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 border-t border-dashed border-[#D97706]" /> Projection
          </span>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-[#261E1A] border-t border-[#E7E0D6] dark:border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            {!reducedMotion ? (
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-[#1C1512] dark:text-[#FDFBF7] focus:rounded-[6px] focus:ring-2 focus:ring-[#881337]"
                aria-label={isRunning ? "Pause trigonometry simulation" : "Play trigonometry simulation"}
              >
                {isRunning ? "Pause trigonometry simulation" : "Play trigonometry simulation"}
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#A89C90] text-[#261E1A] dark:text-[#FDFBF7] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer focus:ring-2 focus:ring-[#881337]"
                  aria-label="Previous frame"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => s + 1)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#A89C90] text-[#261E1A] dark:text-[#FDFBF7] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer focus:ring-2 focus:ring-[#881337]"
                  aria-label="Next frame"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="min-h-[44px] px-3.5 py-2 rounded-[8px] bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1C1512] text-xs font-semibold flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#881337]"
              aria-label="Replay simulation from start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="speed-slider" className="text-xs font-semibold text-[#261E1A] dark:text-[#FDFBF7] whitespace-nowrap">
              Angular speed: {angularSpeed.toFixed(1)}x
            </label>
            <input
              id="speed-slider"
              type="range"
              min="0.3"
              max="2.5"
              step="0.1"
              value={angularSpeed}
              onChange={(e) => setAngularSpeed(parseFloat(e.target.value))}
              className="w-28 sm:w-36 h-2 bg-stone-200 dark:bg-white/10 rounded-lg accent-[#881337] cursor-pointer"
            />
          </div>
        </div>

        <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6] leading-normal">
          Unit circle rotation projecting harmonic sine wave showing continuous periodic trigonometric mapping.
        </p>

        <details className="text-xs text-[#7D6F63] cursor-pointer">
          <summary className="font-semibold text-[#881337] hover:underline">
            Text alternative & scientific description
          </summary>
          <div id="math-visual-description" className="pt-1.5 pl-2 border-l-2 border-[#FECDD3] dark:border-[#881337]/50 text-[11px] leading-relaxed">
            The animation diagrams the geometric relationship between the Cartesian unit circle and the periodic function y = sin(θ). As a point rotates counter-clockwise with angular displacement θ, its vertical coordinate projects horizontally to trace a continuous sinusoidal curve across time.
          </div>
        </details>
      </div>
    </div>
  );
}
