import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import useAuthStore from "../../store/authStore";
import { SITE_CONTENT } from "../../content/siteContent";

export interface HeroSlide {
  id: string;
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  title: string;
  highlightText?: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  statsBadge?: string;
  tagline?: string;
}

export interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoplayIntervalMs?: number;
  initialAudience?: "schools" | "teachers" | "students";
}
export type EnterpriseHeroCarouselProps = HeroCarouselProps;

/**
 * Calm Educational Vector Line Art Background (Layer 1)
 * Drift duration: 48 seconds. Vector lines in Antique Gold (#FBBF24) & Ivory (#FFF1F2) at subtle 8%-10% opacity.
 * Incorporates orbital physics paths, wave harmonic curves, geometric polyhedra, and formula calculus outlines.
 */
function EducationalLineArtBackground({ isPaused }: { isPaused: boolean }): React.ReactElement {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        className={`w-[140%] h-[140%] -top-[20%] -left-[20%] absolute transition-transform ease-out ${
          isPaused ? "" : "animate-hero-drift"
        }`}
        viewBox="0 0 1600 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          opacity: 0.09,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        <defs>
          <linearGradient id="academicLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FECDD3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 1. Atom Orbits and Electron Shells */}
        <g transform="translate(1180, 300)">
          <circle cx="0" cy="0" r="14" stroke="#FBBF24" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="#FBBF24" />
          <ellipse cx="0" cy="0" rx="140" ry="50" stroke="url(#academicLineGrad)" strokeWidth="1.2" transform="rotate(25)" />
          <ellipse cx="0" cy="0" rx="140" ry="50" stroke="url(#academicLineGrad)" strokeWidth="1.2" transform="rotate(-35)" />
          <ellipse cx="0" cy="0" rx="140" ry="50" stroke="url(#academicLineGrad)" strokeWidth="1.2" transform="rotate(85)" />
          <circle cx="120" cy="40" r="3" fill="#FBBF24" />
          <circle cx="-100" cy="35" r="3" fill="#FBBF24" />
          <circle cx="20" cy="-48" r="3" fill="#FBBF24" />
        </g>

        {/* 2. Wave Harmonics and Standing Nodes */}
        <g transform="translate(80, 700)">
          <path
            d="M0,80 Q160,-40 320,80 T640,80 T960,80 T1280,80"
            stroke="#FBBF24"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M0,80 Q160,200 320,80 T640,80 T960,80 T1280,80"
            stroke="url(#academicLineGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
          />
          <circle cx="320" cy="80" r="4" stroke="#FBBF24" strokeWidth="1" />
          <circle cx="640" cy="80" r="4" stroke="#FBBF24" strokeWidth="1" />
          <circle cx="960" cy="80" r="4" stroke="#FBBF24" strokeWidth="1" />
        </g>

        {/* 3. Geometric Polyhedra and Coordinate Axes */}
        <g transform="translate(220, 200)">
          <line x1="-80" y1="0" x2="160" y2="0" stroke="#FBBF24" strokeWidth="1" />
          <line x1="0" y1="120" x2="0" y2="-120" stroke="#FBBF24" strokeWidth="1" />
          <polygon
            points="0,-80 80,45 -80,45"
            stroke="#FBBF24"
            strokeWidth="1.2"
            fill="none"
          />
          <line x1="0" y1="-80" x2="0" y2="15" stroke="url(#academicLineGrad)" strokeWidth="1" />
          <line x1="80" y1="45" x2="0" y2="15" stroke="url(#academicLineGrad)" strokeWidth="1" />
          <line x1="-80" y1="45" x2="0" y2="15" stroke="url(#academicLineGrad)" strokeWidth="1" />
        </g>

        {/* 4. Calculus Integrals & Limit Formulas */}
        <g transform="translate(860, 780)">
          <path
            d="M0,10 C15,-30 25,-40 35,-40 C45,-40 40,-25 30,15 C20,55 15,70 25,70 C35,70 45,60 60,20"
            stroke="#FBBF24"
            strokeWidth="1.5"
            fill="none"
          />
          <text x="75" y="25" fill="#FBBF24" fontSize="24" fontFamily="monospace" opacity="0.8">
            f(x) dx = lim Σ
          </text>
        </g>
      </svg>
    </div>
  );
}

export default function HeroCarousel({
  autoplayIntervalMs = 7000,
  initialAudience = "schools",
}: HeroCarouselProps): React.ReactElement {
  const audiences = SITE_CONTENT.landing.hero.audiences;
  const [currentAudienceIndex, setCurrentAudienceIndex] = useState(() => {
    const found = audiences.findIndex((a) => a.id === initialAudience);
    return found !== -1 ? found : 0;
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeSlide = audiences[currentAudienceIndex] || audiences[0];

  // Respect system prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Pause dynamic rotation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Smooth dynamic rotation (pauses on hover and focus)
  useEffect(() => {
    if (isReducedMotion || !isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentAudienceIndex((prev) => (prev + 1) % audiences.length);
    }, autoplayIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, isReducedMotion, autoplayIntervalMs, audiences.length]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleAudienceChange = (index: number) => {
    setCurrentAudienceIndex(index);
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="National secondary examination highlights"
      className="relative w-full bg-[#4C0519] text-white overflow-hidden border-b border-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Layer 1: Educational Vector Line Art Background */}
      <EducationalLineArtBackground isPaused={isReducedMotion || !isPlaying || isHovered} />

      {/* Layer 2: Subtle Ambient Warm Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#881337] blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-[#B45309] blur-3xl" />
      </div>

      <div className="container relative z-10 py-12 md:py-16 lg:py-20">
        {/* Dynamic Audience Switcher Tabs (clean, zero visual clutter, no visible play/pause button) */}
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-white/10">
          <div
            role="tablist"
            aria-label="Audience role view"
            className="inline-flex rounded-[8px] bg-white/10 p-1 border border-white/15"
          >
            {audiences.map((aud, idx) => {
              const isSelected = idx === currentAudienceIndex;
              return (
                <button
                  key={aud.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleAudienceChange(idx)}
                  className={`min-h-[44px] px-4 py-2 text-xs font-medium rounded-[6px] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBBF24] cursor-pointer ${
                    isSelected
                      ? "bg-[#FBBF24] text-[#1C1512] font-semibold shadow-xs"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {aud.label}
                </button>
              );
            })}
          </div>

          {/* WCAG 2.2 Accessible Screen Reader Rotation Control (Clean & Invisible in UI) */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause automatic slide rotation" : "Start automatic slide rotation"}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-3 focus:py-2 focus:bg-white focus:text-[#1C1512] focus:rounded-[6px] focus:ring-2 focus:ring-[#FBBF24] text-xs font-semibold shadow-md"
          >
            {isPlaying ? "Pause automatic slide rotation" : "Start automatic slide rotation"}
          </button>
        </div>

        {/* Main Hero Stage: Expansive Institutional Layout */}
        <div className="pt-6 sm:pt-8 pb-4 text-start space-y-8 max-w-4xl">
          {/* Single H1 in sentence case, fluid clamp sizing with balanced wrap */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.12] [text-wrap:balance]">
            {activeSlide.title}
          </h1>

          {/* Supporting Paragraph: Pedagogical clarity, grounded in national standards */}
          <p className="text-base sm:text-lg lg:text-xl text-stone-100 leading-relaxed max-w-3xl">
            {activeSlide.description}
          </p>

          {/* Institutional CTAs: Primary Antique Gold + Secondary Translucent Border */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to={activeSlide.primaryCtaLink || SITE_CONTENT.landing.hero.primaryCtaLink}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3 rounded-[6px] bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-[#1C1512] font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FBBF24] focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              <span>{activeSlide.primaryCtaText || SITE_CONTENT.landing.hero.primaryCta}</span>
              <ArrowRight size={16} className="text-[#1C1512]" aria-hidden="true" />
            </Link>

            <Link
              to={isAuthenticated ? SITE_CONTENT.landing.hero.dashboardLink : (activeSlide.secondaryCtaLink || SITE_CONTENT.landing.hero.secondaryCtaLink)}
              className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-[6px] border border-white/25 hover:border-white/50 text-white font-medium text-sm transition-colors bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#4C0519]"
            >
              {isAuthenticated
                ? SITE_CONTENT.landing.hero.secondaryCtaLoggedIn
                : (activeSlide.secondaryCtaText || SITE_CONTENT.landing.hero.secondaryCtaLoggedOut)}
            </Link>
          </div>

          {/* Quick Institutional Anchors & Telemetry Trust Highlights */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-300">
            <Link to="/contact" className="hover:text-white underline underline-offset-4 transition-colors">
              Contact us
            </Link>
            <span className="text-white/30" aria-hidden="true">•</span>
            <Link to="/academics" className="hover:text-white underline underline-offset-4 transition-colors">
              Explore academics
            </Link>
            <span className="text-white/30" aria-hidden="true">•</span>
            <span className="text-stone-300">
              Domestic Tier-3 Addis Ababa hosting
            </span>
            <span className="text-white/30" aria-hidden="true">•</span>
            <span className="text-stone-300">
              Calibrated Score Forecast engine
            </span>
          </div>

          {/* Institutional Accreditation Strip: Standardized, Non-boxed Academic Trust Pillars */}
          <div className="pt-8 sm:pt-10 mt-6 sm:mt-8 border-t border-white/15">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FBBF24]">
                  <Check size={14} aria-hidden="true" />
                  <span className="text-xs font-semibold text-white tracking-wide">EGECF Curriculum</span>
                </div>
                <p className="text-xs text-stone-300 leading-normal">
                  Grades 9–12 national framework
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FBBF24]">
                  <Check size={14} aria-hidden="true" />
                  <span className="text-xs font-semibold text-white tracking-wide">National Blueprint</span>
                </div>
                <p className="text-xs text-stone-300 leading-normal">
                  Timed entrance specifications
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FBBF24]">
                  <Check size={14} aria-hidden="true" />
                  <span className="text-xs font-semibold text-white tracking-wide">Teacher Verified</span>
                </div>
                <p className="text-xs text-stone-300 leading-normal">
                  100% educator approval gate
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#FBBF24]">
                  <Check size={14} aria-hidden="true" />
                  <span className="text-xs font-semibold text-white tracking-wide">Achieve Mastery</span>
                </div>
                <p className="text-xs text-stone-300 leading-normal">
                  2008–2016 national past papers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
