import { describe, it, expect } from "vitest";
import {
  getSchoolPricingTier,
  normalizeSchoolSeats,
  MIN_SCHOOL_SEATS,
  MAX_SCHOOL_SEATS,
  SCHOOL_SEAT_STEP,
  SCHOOL_PRICING_TIERS,
  SCHOOL_PRICING_PLANS,
  SCHOOL_PRICE_PER_SEAT_MONTHLY_ETB,
  MONTHS_PER_YEAR,
} from "../constants/pricing";

describe("School seat pricing flow", () => {
  it("keeps the calculator within the supported seat range and increment", () => {
    expect(MIN_SCHOOL_SEATS).toBe(20);
    expect(MAX_SCHOOL_SEATS).toBe(1000);
    expect(SCHOOL_SEAT_STEP).toBe(5);
    expect(normalizeSchoolSeats(1)).toBe(20);
    expect(normalizeSchoolSeats(1005)).toBe(1000);
  });

  it("rounds estimates to the nearest valid five-seat increment", () => {
    expect(normalizeSchoolSeats(22)).toBe(20);
    expect(normalizeSchoolSeats(23)).toBe(25);
    expect(normalizeSchoolSeats(148)).toBe(150);
  });

  it.each([
    [20, "starter"],
    [50, "starter"],
    [51, "school"],
    [200, "school"],
    [201, "expanded"],
    [500, "expanded"],
    [501, "district"],
    [1000, "district"],
  ])("selects the expected seat range for %i seats", (seats, expectedPlan) => {
    expect(getSchoolPricingTier(seats).id).toBe(expectedPlan);
  });

  it("offers transparent school size ranges and the published student rates", () => {
    expect(SCHOOL_PRICING_TIERS.map((tier) => tier.id)).toEqual([
      "starter",
      "school",
      "expanded",
      "district",
    ]);
    expect(SCHOOL_PRICING_TIERS.map((tier) => tier.defaultSeats)).toEqual([50, 150, 300, 600]);
    expect(SCHOOL_PRICE_PER_SEAT_MONTHLY_ETB).toBe(250);
    expect(MONTHS_PER_YEAR).toBe(12);
    expect(SCHOOL_PRICING_PLANS.map((plan) => [plan.id, plan.monthlyPricePerStudentEtb])).toEqual([
      ["essentials", 250],
      ["growth", 350],
      ["complete", 500],
    ]);
    expect(SCHOOL_PRICING_TIERS.map(({ minSeats, maxSeats }) => [minSeats, maxSeats])).toEqual([
      [20, 50],
      [51, 200],
      [201, 500],
      [501, 1000],
    ]);
  });
});
