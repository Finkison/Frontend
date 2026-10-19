/**
 * StatCard - Display key metrics with optional trend indicators
 * 
 * @example
 * ```tsx
 * <StatCard
 *   value="320,000+"
 *   label="Active Students"
 *   icon={<Users />}
 *   trend={{ value: 15, direction: 'up' }}
 * />
 * ```
 */

import React from 'react';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

export interface StatCardProps {
  value: string | number;
  label?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  variant?: 'default' | 'emphasized';
  className?: string;
}

export default function StatCard({
  value,
  label,
  title,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className = '',
}: StatCardProps): React.ReactElement {
  const displayLabel = label || title || '';
  return (
    <div
      className={`
        p-6 rounded-xl border transition-shadow
        ${variant === 'emphasized' 
          ? 'border-emerald-200 bg-emerald-50' 
          : 'border-neutral-200 bg-white hover:shadow-lg'
        }
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            {displayLabel}
          </p>
          <p className="text-3xl font-bold text-neutral-900 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-success-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-danger-600" />
              )}
              <p
                className={`text-xs font-semibold ${
                  trend.direction === 'up' ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {trend.direction === 'up' ? '+' : '-'}
                {trend.value}%
                {trend.label && <span className="text-neutral-500 ml-1">{trend.label}</span>}
              </p>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
