/**
 * Finkison Motion Design Tokens
 * Single source of truth for public marketing animations.
 * Calm, institutional feel. Only animate transform and opacity.
 */

export const MOTION_TOKENS = {
  durations: {
    fast: "150ms",
    base: "250ms",
    slow: "400ms",
    heroFade: "1500ms",
    countUp: "800ms"
  },
  easings: {
    // Calm, institutional easing curves (no springs, no elastic bounce)
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)"
  },
  distances: {
    reveal: "16px",
    slide: "24px",
    hoverLift: "2px",
    signCardLift: "8px"
  },
  stagger: {
    step: 60, // 60ms between siblings
    maxItems: 6 // maximum 6 items staggered
  }
} as const;

export type MotionDuration = keyof typeof MOTION_TOKENS.durations;
export type MotionEasing = keyof typeof MOTION_TOKENS.easings;
