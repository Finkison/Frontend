/**
 * PricingCard - Display pricing tiers with features and CTA
 * 
 * @example
 * ```tsx
 * <PricingCard
 *   tier="School"
 *   price="3,500 Birr"
 *   period="per student/year"
 *   description="Complete school management platform"
 *   features={[
 *     "Unlimited practice questions",
 *     "Teacher dashboard",
 *     "Gradebook & analytics"
 *   ]}
 *   cta="Request Demo"
 *   ctaLink="/contact"
 *   highlighted={true}
 * />
 * ```
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from './Button';

export interface PricingCardProps {
  tier: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink?: string;
  ctaAction?: () => void;
  highlighted?: boolean;
  badge?: string;
  className?: string;
}

export default function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  ctaLink,
  ctaAction,
  highlighted = false,
  badge,
  className = '',
}: PricingCardProps): React.ReactElement {
  return (
    <div
      className={`
        relative p-8 rounded-xl transition-all
        ${highlighted
          ? 'bg-emerald-700 text-white border-2 border-emerald-700 shadow-xl scale-105'
          : 'bg-white border border-neutral-200 hover:shadow-lg hover:border-neutral-300'
        }
        ${className}
      `}
    >
      {/* Badge (if highlighted) */}
      {badge && highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="px-4 py-1 rounded-full bg-warning-400 text-neutral-900 text-xs font-semibold uppercase tracking-wider">
            {badge}
          </div>
        </div>
      )}

      {/* Tier Name */}
      <h3
        className={`text-xl font-bold mb-2 ${
          highlighted ? 'text-white' : 'text-neutral-900'
        }`}
      >
        {tier}
      </h3>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-bold ${
              highlighted ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {price}
          </span>
          {period && (
            <span
              className={`text-sm ${
                highlighted ? 'text-emerald-100' : 'text-neutral-600'
              }`}
            >
              {period}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-sm mb-6 ${
          highlighted ? 'text-emerald-100' : 'text-neutral-600'
        }`}
      >
        {description}
      </p>

      {/* CTA Button */}
      {ctaLink ? (
        <Button
          variant={highlighted ? 'secondary' : 'primary'}
          size="md"
          className="w-full mb-6"
          asChild
        >
          <Link to={ctaLink}>{cta}</Link>
        </Button>
      ) : (
        <Button
          variant={highlighted ? 'secondary' : 'primary'}
          size="md"
          className="w-full mb-6"
          onClick={ctaAction}
        >
          {cta}
        </Button>
      )}

      {/* Features List */}
      <div className="space-y-3 pt-6 border-t border-neutral-200">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 shrink-0 ${
                highlighted ? 'text-white' : 'text-emerald-700'
              }`}
            />
            <span
              className={`text-sm ${
                highlighted ? 'text-emerald-50' : 'text-neutral-700'
              }`}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
