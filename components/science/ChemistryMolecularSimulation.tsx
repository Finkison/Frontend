import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function ChemistryMolecularSimulation(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [energyLevel, setEnergyLevel] = useState(3); // n = 1, 2, 3, 4
  const [stepIndex, setStepIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

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

      // Deep Espresso canvas background #1C1512
      ctx.fillStyle = "#1C1512";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Coordinate axes
      ctx.strokeStyle = "rgba(251, 191, 36, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (isRunning && !reducedMotion) {
        timeRef.current += 0.025;
      } else if (reducedMotion) {
        timeRef.current = stepIndex * 0.5;
      }

      const t = timeRef.current;

      // Shell definitions (Bohr radii: n=1, n=2, n=3, n=4)
      const shells = [
        { n: 1, radius: 34, electrons: 2, speed: 1.6 },
        { n: 2, radius: 64, electrons: 8, speed: 1.1 },
        { n: 3, radius: 96, electrons: Math.min(8, energyLevel * 2), speed: 0.75 },
      ];

      // Draw Bohr orbitals
      shells.slice(0, energyLevel).forEach((shell) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, shell.radius, 0, Math.PI * 2);
        ctx.strokeStyle = shell.n === energyLevel ? "rgba(251, 191, 36, 0.7)" : "rgba(136, 19, 55, 0.5)";
        ctx.lineWidth = shell.n === energyLevel ? 2 : 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label quantum number
        ctx.font = "10px Inter, sans-serif";
        ctx.fillStyle = "#A8A29E";
        ctx.fillText(`n=${shell.n}`, centerX + shell.radius + 6, centerY + 3);

        // Draw circulating electrons
        for (let i = 0; i < shell.electrons; i++) {
          const orbitalAngle = (i * (2 * Math.PI)) / shell.electrons + t * shell.speed;
          const ex = centerX + shell.radius * Math.cos(orbitalAngle);
          const ey = centerY + shell.radius * Math.sin(orbitalAngle);

          // Electron particle
          ctx.beginPath();
          ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = "#FBBF24";
          ctx.fill();
          ctx.strokeStyle = "#881337";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Subtle orbital trail
          ctx.beginPath();
          ctx.arc(ex, ey, 7, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(251, 191, 36, 0.25)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Central Nucleus (Protons & Neutrons in #881337 and #FBBF24)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.fillStyle = "#881337";
      ctx.fill();
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Nucleus label
      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillStyle = "#FAF8F5";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("+Z", centerX, centerY);

      if (isRunning && !reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, energyLevel, stepIndex, reducedMotion]);

  const handleReset = () => {
    timeRef.current = 0;
    setStepIndex(0);
    setIsRunning(true);
  };

  return (
    <div className="bg-white rounded-[8px] border border-[#E2E8F0] overflow-hidden select-none">
      {/* Simulation HUD Bar */}
      <div className="bg-[#4C0519] px-4 py-3 flex items-center justify-between text-xs text-white border-b border-[#FBBF24]/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
          <span className="font-semibold tracking-wide text-[#FBBF24]">
            Grade 10 Chemistry: Unit 3 (Atomic Structure)
          </span>
        </div>
        <div className="text-[11px] text-amber-100/80 font-mono">
          Principal Quantum Level: n={energyLevel}
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative bg-[#1C1512] h-[280px]">
        <canvas
          ref={canvasRef}
          aria-describedby="chemistry-visual-description"
          className="w-full h-full block"
        />

        {/* HUD Info Badge */}
        <div className="absolute bottom-2 left-3 flex items-center gap-3 bg-[#1C1512]/90 px-2.5 py-1 rounded border border-[#881337]/50 text-[10px] text-stone-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#881337]" /> Nucleus (+Z)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FBBF24]" /> Valence Electrons (e⁻)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 border-t border-dashed border-[#FBBF24]" /> Quantized Orbital
          </span>
        </div>
      </div>

      {/* Control Surface with WCAG 44px Buttons */}
      <div className="p-4 bg-white border-t border-[#E2E8F0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Controls */}
          <div className="flex items-center gap-2">
            {!reducedMotion ? (
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-[#1C1512] focus:rounded-[6px] focus:ring-2 focus:ring-[#881337]"
                aria-label={isRunning ? "Pause atomic simulation" : "Play atomic simulation"}
              >
                {isRunning ? "Pause atomic simulation" : "Play atomic simulation"}
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#64748B] text-[#1C1512] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 cursor-pointer focus:ring-2 focus:ring-[#881337]"
                  aria-label="Previous frame"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => s + 1)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#64748B] text-[#1C1512] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 cursor-pointer focus:ring-2 focus:ring-[#881337]"
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

          {/* Parameter Slider: Energy Shell Level */}
          <div className="flex items-center gap-3">
            <label htmlFor="energy-slider" className="text-xs font-semibold text-[#1C1512] whitespace-nowrap">
              Shells (n): {energyLevel}
            </label>
            <input
              id="energy-slider"
              type="range"
              min="1"
              max="3"
              step="1"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
              className="w-28 sm:w-36 h-2 bg-stone-200 rounded-lg accent-[#881337] cursor-pointer"
            />
          </div>
        </div>

        {/* Caption (max 15 words) */}
        <p className="text-xs text-[#475569] leading-normal">
          Bohr atomic model showing quantum energy levels and valence electron orbital transitions.
        </p>

        {/* Accessible Text Alternative */}
        <details className="text-xs text-[#64748B] cursor-pointer">
          <summary className="font-semibold text-[#881337] hover:underline">
            Text alternative & scientific description
          </summary>
          <div id="chemistry-visual-description" className="pt-1.5 pl-2 border-l-2 border-[#FECDD3] text-[11px] leading-relaxed">
            The visualization simulates the quantized planetary Bohr model of an atom. Concentric dashed orbits represent energy levels from n=1 to n=3 around a positively charged nucleus. Electrons occupy shells according to the 2n² rule, circulating at frequencies inversely proportional to orbital radius.
          </div>
        </details>
      </div>
    </div>
  );
}
