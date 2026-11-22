import { useState, useEffect } from "react";

export interface MotionPreferences {
  prefersReducedMotion: boolean;
  isSaveDataActive: boolean;
  isTabHidden: boolean;
  canAnimate: boolean;
}

export function useMotionPreferences(): MotionPreferences {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isSaveDataActive, setIsSaveDataActive] = useState(false);

  useEffect(() => {

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const onMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", onMediaChange);
    }

    const onVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

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
