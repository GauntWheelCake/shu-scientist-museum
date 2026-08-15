import { useEffect, useRef, useState, type JSX } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function TimelineLine(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const line = lineRef.current;
    if (!line || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(line);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <span ref={lineRef} className="timeline-line" aria-hidden="true">
      <span
        className="timeline-line__progress"
        style={{ transform: isVisible ? 'scaleY(1)' : 'scaleY(0)' }}
      />
    </span>
  );
}
