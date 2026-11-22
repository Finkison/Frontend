import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function BiologyDnaSimulation(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [twistSpeed, setTwistSpeed] = useState(1.0);
  const [stepIndex, setStepIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

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

      ctx.strokeStyle = "rgba(251, 191, 36, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      if (isRunning && !reducedMotion) {
        angleRef.current += 0.02 * twistSpeed;
      } else if (reducedMotion) {
        angleRef.current = stepIndex * (Math.PI / 8);
      }

      const angle = angleRef.current;
      const centerY = height / 2;
      const amplitude = 48;
      const numRungs = 24;
      const stepX = width / (numRungs + 2);

      const basePairs = [
        { name1: "A", name2: "T", color1: "#FBBF24", color2: "#881337" },
        { name1: "G", name2: "C", color1: "#B45309", color2: "#BE123C" },
        { name1: "T", name2: "A", color1: "#881337", color2: "#FBBF24" },
        { name1: "C", name2: "G", color1: "#BE123C", color2: "#B45309" },
      ];

      const strand1: { x: number; y: number; z: number }[] = [];
      const strand2: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i <= numRungs; i++) {
        const x = (i + 1) * stepX;
        const rungAngle = angle + (i * Math.PI) / 6;

        const sinA = Math.sin(rungAngle);
        const cosA = Math.cos(rungAngle);

        const y1 = centerY + amplitude * sinA;
        const y2 = centerY - amplitude * sinA;
        const z = cosA;

        strand1.push({ x, y: y1, z });
        strand2.push({ x, y: y2, z: -z });

        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.strokeStyle = z > 0 ? "rgba(251, 191, 36, 0.5)" : "rgba(168, 162, 158, 0.25)";
        ctx.lineWidth = z > 0 ? 2 : 1;
        ctx.stroke();

        const pair = basePairs[i % basePairs.length];
        const radius1 = 4.5 + z * 1.5;
        ctx.beginPath();
        ctx.arc(x, y1, Math.max(2, radius1), 0, Math.PI * 2);
        ctx.fillStyle = pair.color1;
        ctx.fill();
        ctx.strokeStyle = "#4C0519";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const radius2 = 4.5 - z * 1.5;
        ctx.beginPath();
        ctx.arc(x, y2, Math.max(2, radius2), 0, Math.PI * 2);
        ctx.fillStyle = pair.color2;
        ctx.fill();
        ctx.strokeStyle = "#4C0519";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = "#FBBF24";
      ctx.lineWidth = 2.5;
      for (let i = 0; i < strand1.length; i++) {
        if (i === 0) ctx.moveTo(strand1[i].x, strand1[i].y);
        else ctx.lineTo(strand1[i].x, strand1[i].y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "#881337";
      ctx.lineWidth = 2.5;
      for (let i = 0; i < strand2.length; i++) {
        if (i === 0) ctx.moveTo(strand2[i].x, strand2[i].y);
        else ctx.lineTo(strand2[i].x, strand2[i].y);
      }
      ctx.stroke();

      if (isRunning && !reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, twistSpeed, stepIndex, reducedMotion]);

  const handleReset = () => {
    angleRef.current = 0;
    setStepIndex(0);
    setIsRunning(true);
  };

  return (
    <div className="bg-white dark:bg-[#261E1A] rounded-[8px] border border-[#E7E0D6] dark:border-white/10 overflow-hidden select-none">

      <div className="bg-[#4C0519] px-4 py-3 flex items-center justify-between text-xs text-white border-b border-[#FBBF24]/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
          <span className="font-semibold tracking-wide text-[#FBBF24]">
            Grade 12 Biology: Unit 2 (Molecular Genetics)
          </span>
        </div>
        <div className="text-[11px] text-amber-100/80 font-mono">
          Rotational Rate: {(twistSpeed * 0.5).toFixed(2)} rad/s
        </div>
      </div>

      <div className="relative bg-[#1C1512] h-[280px]">
        <canvas
          ref={canvasRef}
          aria-describedby="dna-visual-description"
          className="w-full h-full block"
        />

        <div className="absolute bottom-2 left-3 flex items-center gap-3 bg-[#1C1512]/90 px-2.5 py-1 rounded border border-[#881337]/50 text-[10px] text-stone-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FBBF24]" /> A-T Bond
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#BE123C]" /> G-C Bond
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-[#FBBF24]" /> 5' to 3' Strand
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
                aria-label={isRunning ? "Pause DNA simulation" : "Play DNA simulation"}
              >
                {isRunning ? "Pause DNA simulation" : "Play DNA simulation"}
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#A89C90] text-[#1C1512] dark:text-[#FDFBF7] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer focus:ring-2 focus:ring-[#881337]"
                  aria-label="Previous frame"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => s + 1)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-[8px] border border-[#A89C90] text-[#1C1512] dark:text-[#FDFBF7] text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 dark:hover:bg-white/5 cursor-pointer focus:ring-2 focus:ring-[#881337]"
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
            <label htmlFor="twist-slider" className="text-xs font-semibold text-[#1C1512] whitespace-nowrap">
              Twist rate: {twistSpeed.toFixed(1)}x
            </label>
            <input
              id="twist-slider"
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={twistSpeed}
              onChange={(e) => setTwistSpeed(parseFloat(e.target.value))}
              className="w-28 sm:w-36 h-2 bg-stone-200 dark:bg-white/10 rounded-lg accent-[#881337] cursor-pointer"
            />
          </div>
        </div>

        <p className="text-xs text-[#5C5046] dark:text-[#E7E0D6] leading-normal">
          Antiparallel double helix illustrating complementary hydrogen-bonded base pairs A-T and G-C.
        </p>

        <details className="text-xs text-[#A89C90] cursor-pointer">
          <summary className="font-semibold text-[#881337] hover:underline">
            Text alternative & scientific description
          </summary>
          <div id="dna-visual-description" className="pt-1.5 pl-2 border-l-2 border-[#FECDD3] dark:border-[#881337]/50 text-[11px] leading-relaxed">
            The animation models a right-handed DNA double helix with two antiparallel sugar-phosphate backbones spaced 2.0 nanometers apart. Complementary nitrogenous bases pair across the central axis with adenine binding thymine via two hydrogen bonds, and guanine binding cytosine via three hydrogen bonds.
          </div>
        </details>
      </div>
    </div>
  );
}
