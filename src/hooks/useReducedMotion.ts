import { useEffect, useState } from 'react';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function getInitialPreference(): boolean {
  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(reducedMotionQuery).matches;
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialPreference);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const updatePreference = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  return prefersReducedMotion;
}
