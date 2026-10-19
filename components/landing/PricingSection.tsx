import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Shield, Star, HelpCircle } from "lucide-react";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  ctaText: string;
  ctaLink: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "candidate-foundation",
    name: "Candidate foundation",
    tagline: "Single student preparation for Grade 12 National University Entrance Exam.",
    monthlyPrice: 350,
    annualPrice: 280,
    features: [
      "Access to all 12 preparatory subjects",
      "Five official mock university entrance simulations",
      "Basic Bayesian gap diagnostics",
      "Curriculum alignment across Grades 9 through 12",
      "Standard email community support",
    ],
    ctaText: "Enroll in candidate foundation",
    ctaLink: "/register",
  },
  {
    id: "preparatory-plus",
    name: "Preparatory scholar plus",
    tagline: "Complete multi-subject mastery with AI diagnostics and live teacher moderation.",
    monthlyPrice: 650,
    annualPrice: 520,
    features: [
      "Everything in Candidate foundation",
      "Unlimited AI-guided mock entrance exam simulations",
      "Step-by-step video worked solutions for all 2010–2023 papers",
      "Sub-second prerequisite gap remediation",
      "Weekly live Q&A moderation with certified teachers",
      "Priority academic verification certificate",
    ],
    ctaText: "Start scholar plus trial",
    ctaLink: "/register",
  },
  {
    id: "institutional-school",
    name: "Institutional campus license",
    tagline: "Dedicated deployment for secondary schools, preparatory academies, and departments.",
    monthlyPrice: 2400,
    annualPrice: 1920,
    features: [
      "Unlimited student and faculty accounts per campus",
      "Principal and departmental telemetry analytics",
      "Automated syllabus pacing and moderation workflows",
      "Custom question bank generation and printable paper exam exports",
      "Dedicated institutional integration engineer",
      "Service level agreement (99.9% uptime)",
    ],
    ctaText: "Contact institutional sales",
    ctaLink: "/contact",
  },
];

export default function PricingSection(): React.ReactElement {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="w-full space-y-10">
      {/* Monthly / Annual Billing Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <div
          role="radiogroup"
          aria-label="Billing frequency selector"
          className="inline-flex items-center p-1 rounded-[8px] bg-slate-100 border border-slate-200"
        >
          <button
            type="button"
            role="radio"
            aria-checked={!isAnnual}
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#881337] ${
              !isAnnual
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Monthly billing
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#881337] ${
              isAnnual
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Annual billing
          </button>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[9999px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Star size={12} className="text-emerald-600" aria-hidden="true" />
          <span>Save 20% with annual license</span>
        </span>
      </div>

      {/* 3-Column Plan Grid with Equal Heights & Pinned CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {DEFAULT_PLANS.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className="relative flex flex-col rounded-[12px] p-6 sm:p-8 bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              {/* Title & Tagline */}
              <div className="mb-6 space-y-2 text-start">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 min-h-[34px] leading-relaxed">
                  {plan.tagline}
                </p>
              </div>

              {/* Price display */}
              <div className="mb-6 pb-6 border-b border-slate-200 text-start">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    ETB {price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / student / {isAnnual ? "mo (billed annually)" : "month"}
                  </span>
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-3 mb-8 flex-1 text-start" aria-label={`${plan.name} features`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <Check
                      size={16}
                      className="text-emerald-600 flex-shrink-0 mt-0.5 icon-first-line"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Pinned CTA Button */}
              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link
                  to={plan.ctaLink}
                  className="w-full min-h-[44px] px-6 py-2.5 rounded-[6px] bg-[#881337] hover:bg-[#9F1239] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#881337] focus:ring-offset-2"
                >
                  {plan.ctaText}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
