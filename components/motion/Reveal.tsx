import React, { useRef, useState, useEffect } from "react";
import { useMotionPreferences } from "./useMotionPreferences";
import { MOTION_TOKENS } from "../../styles/motionTokens";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  staggerIndex?: number; // 0 to 5
  delayMs?: number;
  durationMs?: number;
  distancePx?: number; // max 16px
}

export default function Reveal({
  children,
  className = "",
  staggerIndex = 0,
  delayMs,
  durationMs = 250,
  distancePx = 16
}: RevealProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { canAnimate } = useMotionPreferences();

  const clampedStagger = Math.min(staggerIndex, MOTION_TOKENS.stagger.maxItems - 1);
  const computedDelay = delayMs !== undefined ? delayMs : clampedStagger * MOTION_TOKENS.stagger.step;
  const clampedDistance = Math.min(distancePx, 16);

  useEffect(() => {
    if (!canAnimate) {
      setHasRevealed(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    // IntersectionObserver playing once
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAnimating(true);
            setHasRevealed(true);
            observer.unobserve(entry.target);

            // Clean up will-change after animation finishes
            const timer = setTimeout(() => {
              setIsAnimating(false);
            }, durationMs + computedDelay + 50);

            return () => clearTimeout(timer);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [canAnimate, durationMs, computedDelay]);

  // If animations disabled (reduced motion / low-end / save-data), show final state instantly
  if (!canAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        opacity: hasRevealed ? 1 : 0,
        transform: hasRevealed ? "translateY(0)" : `translateY(${clampedDistance}px)`,
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${computedDelay}ms`,
        transitionTimingFunction: MOTION_TOKENS.easings.standard,
        willChange: isAnimating ? "opacity, transform" : "auto"
      }}
    >
      {children}
    </div>
  );
}
