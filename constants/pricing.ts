export interface SchoolPricingTier {
  id: "starter" | "school" | "expanded" | "district";
  seatRangeKey: string;
  minSeats: number;
  maxSeats: number;
  defaultSeats: number;
}

export const SCHOOL_PRICE_PER_SEAT_MONTHLY_ETB = 250;
export const MONTHS_PER_YEAR = 12;

export interface SchoolPricingPlan {
  id: "essentials" | "growth" | "complete";
  monthlyPricePerStudentEtb: number;
  nameKey: string;
  descriptionKey: string;
  featureKeys: string[];
  recommended?: boolean;
}

export const SCHOOL_PRICING_PLANS: SchoolPricingPlan[] = [
  {
    id: "essentials",
    monthlyPricePerStudentEtb: 250,
    nameKey: "public.marketing.pricing.essentialsName",
    descriptionKey: "public.marketing.pricing.essentialsDescription",
    featureKeys: ["essentialFeature1", "essentialFeature2", "essentialFeature3", "essentialFeature4", "essentialFeature5"],
  },
  {
    id: "growth",
    monthlyPricePerStudentEtb: 350,
    nameKey: "public.marketing.pricing.growthName",
    descriptionKey: "public.marketing.pricing.growthDescription",
    featureKeys: ["growthFeature1", "growthFeature2", "growthFeature3", "growthFeature4", "growthFeature5"],
    recommended: true,
  },
  {
    id: "complete",
    monthlyPricePerStudentEtb: 500,
    nameKey: "public.marketing.pricing.completeName",
    descriptionKey: "public.marketing.pricing.completeDescription",
    featureKeys: ["completeFeature1", "completeFeature2", "completeFeature3", "completeFeature4", "completeFeature5"],
  },
];
export const MIN_SCHOOL_SEATS = 20;
export const MAX_SCHOOL_SEATS = 1000;
export const SCHOOL_SEAT_STEP = 5;

export const SCHOOL_PRICING_TIERS: SchoolPricingTier[] = [
  {
    id: "starter",
    seatRangeKey: "public.pricingFlow.seatsStarter",
    minSeats: 20,
    maxSeats: 50,
    defaultSeats: 50,
  },
  {
    id: "school",
    seatRangeKey: "public.pricingFlow.seatsSchool",
    minSeats: 51,
    maxSeats: 200,
    defaultSeats: 150,
  },
  {
    id: "expanded",
    seatRangeKey: "public.pricingFlow.seatsExpanded",
    minSeats: 201,
    maxSeats: 500,
    defaultSeats: 300,
  },
  {
    id: "district",
    seatRangeKey: "public.pricingFlow.seatsDistrict",
    minSeats: 501,
    maxSeats: 1000,
    defaultSeats: 600,
  },
];

export function normalizeSchoolSeats(value: number): number {
  const clamped = Math.min(MAX_SCHOOL_SEATS, Math.max(MIN_SCHOOL_SEATS, value));
  return MIN_SCHOOL_SEATS + Math.round((clamped - MIN_SCHOOL_SEATS) / SCHOOL_SEAT_STEP) * SCHOOL_SEAT_STEP;
}

export function getSchoolPricingTier(seats: number): SchoolPricingTier {
  if (seats <= 50) return SCHOOL_PRICING_TIERS[0];
  if (seats <= 200) return SCHOOL_PRICING_TIERS[1];
  if (seats <= 500) return SCHOOL_PRICING_TIERS[2];
  return SCHOOL_PRICING_TIERS[3];
}

export function getSchoolPricingTierById(id: string | null | undefined): SchoolPricingTier | undefined {
  return SCHOOL_PRICING_TIERS.find((tier) => tier.id === id);
}

export function getSchoolPricingPlanById(id: string | null | undefined): SchoolPricingPlan | undefined {
  return SCHOOL_PRICING_PLANS.find((plan) => plan.id === id);
}
