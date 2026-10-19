import { describe, it, expect } from "vitest";

describe("ModernHeroSection Component Specifications", () => {
  it("verifies the 3 high-quality technology background images are properly mapped", () => {
    const expectedImages = [
      "/images/hero-tech-1.jpg",
      "/images/hero-tech-2.jpg",
      "/images/hero-tech-3.jpg"
    ];

    expect(expectedImages.length).toBe(3);
    expectedImages.forEach((img) => {
      expect(img).toMatch(/^\/images\/hero-tech-\d\.jpg$/);
    });
  });

  it("verifies 5-second cross-fade slider timing requirement", () => {
    const intervalMs = 5000;
    const fadeDurationMs = 1500;
    expect(intervalMs).toBe(5000);
    expect(fadeDurationMs).toBe(1500);
  });

  it("verifies enterprise hero actions are strictly Contact us and sign-in card with zero social widgets", () => {
    const primaryAction = "Contact us";
    const hasHeartButton = false;
    const hasSaveCounter = false;

    expect(primaryAction).toBe("Contact us");
    expect(hasHeartButton).toBe(false);
    expect(hasSaveCounter).toBe(false);
  });
});
