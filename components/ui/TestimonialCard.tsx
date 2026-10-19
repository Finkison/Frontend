/**
 * TestimonialCard - Social proof with educator testimonials
 * 
 * @example
 * ```tsx
 * <TestimonialCard
 *   quote="Pass rate improved from 68% to 91%"
 *   author={{
 *     name: "Alemayehu Tadesse",
 *     role: "Math Teacher",
 *     school: "Addis Ababa Bole HS",
 *     avatar: "/avatars/alemayehu.jpg"
 *   }}
 *   metric={{
 *     label: "Pass Rate Improvement",
 *     value: "68% → 91%"
 *   }}
 * />
 * ```
 */

import React from 'react';
import { Quote, User } from 'lucide-react';

export interface TestimonialAuthor {
  name: string;
  role: string;
  school: string;
  avatar?: string;
}

export interface TestimonialMetric {
  label: string;
  value: string;
}

export interface TestimonialCardProps {
  quote: string;
  author: TestimonialAuthor;
  metric?: TestimonialMetric;
  rating?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export default function TestimonialCard({
  quote,
  author,
  metric,
  rating,
  className = '',
}: TestimonialCardProps): React.ReactElement {
  return (
    <div
      className={`
        p-6 rounded-xl border border-neutral-200 bg-white
        hover:shadow-lg transition-shadow
        ${className}
      `}
    >
      {/* Quote Icon */}
      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
        <Quote className="w-5 h-5" />
      </div>

      {/* Quote Text */}
      <p className="text-base text-neutral-700 leading-relaxed mb-4">
        "{quote}"
      </p>

      {/* Metric (if provided) */}
      {metric && (
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 mb-4">
          <p className="text-xs text-neutral-500 mb-0.5">{metric.label}</p>
          <p className="text-sm font-semibold text-neutral-900">{metric.value}</p>
        </div>
      )}

      {/* Rating (if provided) */}
      {rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-warning-400' : 'text-neutral-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
        <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-semibold">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{author.name}</p>
          <p className="text-xs text-neutral-600 truncate">
            {author.role}, {author.school}
          </p>
        </div>
      </div>
    </div>
  );
}
