/**
 * Timeline - Display chronological events with connecting line
 * 
 * @example
 * ```tsx
 * <Timeline
 *   events={[
 *     {
 *       date: "2021",
 *       title: "Founded",
 *       description: "Finkison launched with 10 pilot schools",
 *       icon: <Rocket />
 *     },
 *     {
 *       date: "2024",
 *       title: "450 Schools",
 *       description: "Serving 320,000+ students nationwide"
 *     }
 *   ]}
 *   orientation="vertical"
 * />
 * ```
 */

import React from 'react';
import { Circle } from 'lucide-react';

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export default function Timeline({
  events,
  orientation = 'vertical',
  className = '',
}: TimelineProps): React.ReactElement {
  if (orientation === 'horizontal') {
    return (
      <div className={`relative ${className}`}>
        {/* Horizontal Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-neutral-200" />

        {/* Events */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
          {events.map((event, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center z-10 mb-4">
                {event.icon || <Circle className="w-5 h-5" fill="currentColor" />}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {event.date}
                </p>
                <h4 className="text-base font-semibold text-neutral-900">
                  {event.title}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical Timeline (default)
  return (
    <div className={`relative ${className}`}>
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-200" />

      {/* Events */}
      <div className="space-y-8 relative">
        {events.map((event, index) => (
          <div key={index} className="flex gap-6">
            {/* Icon Circle */}
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 z-10">
              {event.icon || <Circle className="w-5 h-5" fill="currentColor" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                {event.date}
              </p>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                {event.title}
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
