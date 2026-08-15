import { useEffect, useRef, useState, type JSX } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type CountUpProps = {
  value: number;
  suffix?: string;
};

const animationDuration = 1200;

export function CountUp({ value, suffix = '' }: CountUpProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const targetValue = Math.max(0, Math.round(value));
  const [displayValue, setDisplayValue] = useState(
    prefersReducedMotion ? targetValue : 0,
  );
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrame: number | null = null;
    let observer: IntersectionObserver | null = null;
    let hasStarted = false;

    const disconnectObserver = (): void => {
      observer?.disconnect();
      observer = null;
    };

    if (prefersReducedMotion || targetValue === 0) {
      setDisplayValue(targetValue);
      return undefined;
    }

    setDisplayValue(0);

    const startCounting = (): void => {
      if (hasStarted) {
        return;
      }

      hasStarted = true;
      disconnectObserver();
      let startedAt: number | null = null;

      const update = (timestamp: number): void => {
        startedAt ??= timestamp;
        const progress = Math.min((timestamp - startedAt) / animationDuration, 1);
        setDisplayValue(Math.round(targetValue * progress));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(update);
        }
      };

      animationFrame = requestAnimationFrame(update);
    };

    if (typeof IntersectionObserver === 'undefined') {
      startCounting();
    } else if (elementRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          startCounting();
        }
      });
      observer.observe(elementRef.current);
    }

    return () => {
      disconnectObserver();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [prefersReducedMotion, targetValue]);

  return (
    <span ref={elementRef} className="count-up">
      {displayValue}
      {suffix}
    </span>
  );
}
