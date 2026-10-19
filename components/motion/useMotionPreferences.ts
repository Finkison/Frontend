import { useState, useEffect } from "react";

export interface MotionPreferences {
  prefersReducedMotion: boolean;
  isSaveDataActive: boolean;
  isTabHidden: boolean;
  canAnimate: boolean;
}

/**
 * Hook to inspect accessibility motion preferences, Save-Data network flags,
 * and background tab visibility.
 */
export function useMotionPreferences(): MotionPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isSaveDataActive, setIsSaveDataActive] = useState(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", onMediaChange);
    }

    // 2. Check document visibility (hidden tab pause)
    const onVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // 3. Check Save-Data / low-end network header
    const nav = navigator as any;
    if (nav?.connection?.saveData) {
      setIsSaveDataActive(true);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onMediaChange);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const canAnimate = !prefersReducedMotion && !isSaveDataActive && !isTabHidden;

  return {
    prefersReducedMotion,
    isSaveDataActive,
    isTabHidden,
    canAnimate
  };
}
