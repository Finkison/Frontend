import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function PhysicsWaveSimulation(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [frequency, setFrequency] = useState(1.8); // Hz
  const [amplitude, setAmplitude] = useState(38); // px
  const [stepIndex, setStepIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

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

      // Deep Espresso container #1C1512
      ctx.fillStyle = "#1C1512";
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = "rgba(251, 191, 36, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const centerY = height / 2;

      // Equilibrium axis
      ctx.strokeStyle = "rgba(168, 156, 144, 0.4)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const k = (2 * Math.PI) / 180; // Wavenumber

      if (isRunning && !reducedMotion) {
        phaseRef.current += frequency * 0.035;
      } else if (reducedMotion) {
        phaseRef.current = stepIndex * (Math.PI / 8);
      }
      const phase = phaseRef.current;

      // Primary wave curve
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#FBBF24";

      const points: { x: number; y: number }[] = [];
      for (let x = 0; x < width; x += 3) {
        const y = centerY - amplitude * Math.sin(k * x - phase);
        points.push({ x, y });
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Oscillating particles
      const particleSpacing = 36;
      for (let i = 0; i < points.length; i += Math.floor(particleSpacing / 3)) {
        const pt = points[i];
        if (!pt) continue;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#FBBF24";
        ctx.fill();
        ctx.strokeStyle = "#881337";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Displacement line to equilibrium
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251, 191, 36, 0.25)";
        ctx.lineWidth = 1;
        ctx.moveTo(pt.x, centerY);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
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
  }, [isRunning, frequency, amplitude, stepIndex, reducedMotion]);

  const handleReset = () => {
    phaseRef.current = 0;
    setStepIndex(0);
    setIsRunning(true);
  };

  const wavelength = 180;
  const waveVelocity = Math.round(frequency * wavelength);

  return (
    <div className="bg-white rounded-[8px] border border-[#E7E0D6] overflow-hidden select-none">
      {/* Simulation HUD Bar */}
      <div className="bg-[#4C0519] px-4 py-3 flex items-center justify-between text-xs text-white border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
          <span className="font-semibold tracking-wide text-[#FBBF24]">
            Grade 11 Physics: Unit 4 (Oscillations & Waves)
          </span>
        </div>
        <div className="text-[11px] text-stone-200 font-mono">
          v = f × λ • Speed: {waveVelocity} px/s • f: {frequency.toFixed(1)} Hz
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative bg-[#1C1512] h-[280px]">
        <canvas
          ref={canvasRef}
          aria-describedby="physics-visual-description"
          className="w-full h-full block"
        />

        {/* HUD Info Badge */}
        <div className="absolute bottom-2 left-3 flex items-center gap-3 bg-[#1C1512]/85 px-2.5 py-1 rounded border border-[#881337]/30 text-[10px] text-stone-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[#FBBF24]" /> Transverse Wave
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FBBF24]" /> Oscillating Particle
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 border-t border-dashed border-stone-400" /> Equilibrium
          </span>
        </div>
      </div>

      {/* Control Surface with WCAG 44px Buttons */}
      <div className="p-4 bg-white border-t border-[#E7E0D6] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Controls */}
          <div className="flex items-center gap-2">
            {!reducedMotion ? (
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-[#1C1512] focus:rounded-[6px] focus:ring-2 focus:ring-[#881337]"
                aria-label={isRunning ? "Pause wave simulation" : "Play wave simulation"}
              >
                {isRunning ? "Pause wave simulation" : "Play wave simulation"}
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#A89C90] text-[#261E1A] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 cursor-pointer focus:ring-2 focus:ring-[#881337]"
                  aria-label="Previous frame"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => s + 1)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#A89C90] text-[#261E1A] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 cursor-pointer focus:ring-2 focus:ring-[#881337]"
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

          {/* Parameter Slider: Frequency */}
          <div className="flex items-center gap-3">
            <label htmlFor="freq-slider" className="text-xs font-semibold text-[#261E1A] whitespace-nowrap">
              Frequency: {frequency.toFixed(1)} Hz
            </label>
            <input
              id="freq-slider"
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-28 sm:w-36 h-2 bg-stone-200 rounded-lg accent-[#881337] cursor-pointer"
            />
          </div>
        </div>

        {/* Caption (max 15 words) */}
        <p className="text-xs text-[#5C5046] leading-normal">
          Transverse sinusoidal wave propagation demonstrating particle displacement orthogonal to the direction of energy propagation.
        </p>

        {/* Accessible Text Alternative */}
        <details className="text-xs text-[#7D6F63] cursor-pointer">
          <summary className="font-semibold text-[#881337] hover:underline">
            Text alternative & scientific description
          </summary>
          <div id="physics-visual-description" className="pt-1.5 pl-2 border-l-2 border-[#FECDD3] text-[11px] leading-relaxed">
            The animation models a continuous harmonic transverse wave traveling along an elastic medium. Medium particles oscillate vertically about their equilibrium positions while the wave pattern propagates horizontally at constant phase speed v = f × λ.
          </div>
        </details>
      </div>
    </div>
  );
}
