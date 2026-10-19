/**
 * FeatureCard - Display product features with icon and CTA
 * 
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<Brain />}
 *   title="AI Diagnostic Engine"
 *   description="Identifies knowledge gaps and recommends review topics"
 *   cta={{ text: "Learn more", link: "/ai-features" }}
 * />
 * ```
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta?: {
    text: string;
    link: string;
  };
  variant?: 'default' | 'outlined' | 'emphasized';
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  cta,
  variant = 'default',
  className = '',
}: FeatureCardProps): React.ReactElement {
  const baseStyles = 'p-6 rounded-xl transition-all group';
  
  const variantStyles = {
    default: 'bg-white border border-neutral-200 hover:shadow-lg hover:border-neutral-300',
    outlined: 'bg-transparent border-2 border-neutral-300 hover:border-emerald-700 hover:bg-emerald-50',
    emphasized: 'bg-emerald-50 border border-emerald-200 hover:shadow-lg hover:bg-emerald-100',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-lg flex items-center justify-center mb-4
          ${variant === 'emphasized' 
            ? 'bg-emerald-700 text-white' 
            : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white'
          }
          transition-colors
        `}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 leading-relaxed mb-4">
        {description}
      </p>

      {/* CTA */}
      {cta && (
        <Link
          to={cta.link}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-600 transition-colors group/link"
        >
          <span>{cta.text}</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
