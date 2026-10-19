import { describe, it, expect } from "vitest";
import { MOTION_TOKENS } from "../styles/motionTokens";

describe("Motion System and Enterprise Tokens", () => {
  it("defines standard enterprise motion tokens", () => {
    expect(MOTION_TOKENS.durations.fast).toBe("150ms");
    expect(MOTION_TOKENS.durations.base).toBe("250ms");
    expect(MOTION_TOKENS.durations.slow).toBe("400ms");
    expect(MOTION_TOKENS.durations.heroFade).toBe("1500ms");
    expect(MOTION_TOKENS.durations.countUp).toBe("800ms");

    expect(MOTION_TOKENS.easings.standard).toBe("cubic-bezier(0.2, 0, 0, 1)");
    expect(MOTION_TOKENS.easings.exit).toBe("cubic-bezier(0.4, 0, 1, 1)");

    expect(MOTION_TOKENS.distances.reveal).toBe("16px");
    expect(MOTION_TOKENS.distances.slide).toBe("24px");
    expect(MOTION_TOKENS.distances.hoverLift).toBe("2px");
    expect(MOTION_TOKENS.distances.signCardLift).toBe("8px");

    expect(MOTION_TOKENS.stagger.step).toBe(60);
    expect(MOTION_TOKENS.stagger.maxItems).toBe(6);
  });

  it("limits stagger calculations to a maximum of 6 elements", () => {
    const calculateDelay = (index: number) => {
      const clamped = Math.min(index, MOTION_TOKENS.stagger.maxItems - 1);
      return clamped * MOTION_TOKENS.stagger.step;
    };

    expect(calculateDelay(0)).toBe(0);
    expect(calculateDelay(1)).toBe(60);
    expect(calculateDelay(5)).toBe(300);
    expect(calculateDelay(6)).toBe(300); // Capped at index 5
    expect(calculateDelay(10)).toBe(300);
  });

  it("ensures no spring or elastic easing functions exist", () => {
    Object.values(MOTION_TOKENS.easings).forEach((easing) => {
      expect(easing).not.toContain("bounce");
      expect(easing).not.toContain("elastic");
      expect(easing).not.toContain("spring");
    });
  });
});
